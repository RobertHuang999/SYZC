import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { Toast } from "@/components/ui/Toast"
import { CollateralWarningPublishFormContent } from "../components/CollateralWarningPublishFormContent"
import {
  buildPublishDraftFromWarning,
  type PublishDraftErrors,
  type RiskDisclosurePublishDraft,
} from "../domain/publish-draft"
import { canSelectForBatchPublish } from "../domain/actions"
import { getCollateralWarningById } from "../lib/detail-utils"
import { COLLATERAL_WARNING_LIST_PATH } from "../lib/publish-navigation"
import type { CollateralWarningEventDetail } from "../domain/types"
import {
  mergePublishSubmitPayload,
  validatePublishForm,
} from "@/features/risk-disclosure/domain/publish-form"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

type BatchPublishNavigationState = {
  warnIds?: string[]
}

type DraftMap = Record<string, RiskDisclosurePublishDraft>
type ErrorMap = Record<string, PublishDraftErrors>

function resolveBatchEvents(warnIds: string[]): CollateralWarningEventDetail[] {
  return warnIds.flatMap((warnId) => {
    const event = getCollateralWarningById(warnId)
    if (!event || !canSelectForBatchPublish(event)) {
      return []
    }
    return [event]
  })
}

export function CollateralWarningBatchPublishPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState = location.state as BatchPublishNavigationState | null
  const events = useMemo(
    () => resolveBatchEvents(navigationState?.warnIds ?? []),
    [navigationState?.warnIds]
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [drafts, setDrafts] = useState<DraftMap>({})
  const [errorsMap, setErrorsMap] = useState<ErrorMap>({})
  const [dirty, setDirty] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const nextDrafts: DraftMap = {}
    events.forEach((event) => {
      nextDrafts[event.eventId] = buildPublishDraftFromWarning(event)
    })
    setDrafts(nextDrafts)
    setErrorsMap({})
    setDirty(false)
    setActiveIndex(0)
  }, [events])

  const activeEvent = events[activeIndex] ?? null
  const activeDraft = activeEvent ? drafts[activeEvent.eventId] : null
  const activeErrors = activeEvent ? errorsMap[activeEvent.eventId] ?? {} : {}

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 3000)
  }

  const handleLeave = () => {
    if (
      dirty &&
      !window.confirm("当前批量公示内容尚未全部提交，确认离开？未保存的修改将丢失。")
    ) {
      return
    }
    navigate(COLLATERAL_WARNING_LIST_PATH)
  }

  const updateDraft = (patch: Partial<RiskDisclosurePublishDraft>) => {
    if (!activeEvent) return
    setDrafts((current) => ({
      ...current,
      [activeEvent.eventId]: {
        ...current[activeEvent.eventId],
        ...patch,
      },
    }))
    setDirty(true)
    setErrorsMap((current) => ({
      ...current,
      [activeEvent.eventId]: {},
    }))
  }

  const handleSubmitAll = () => {
    const nextErrorsMap: ErrorMap = {}
    let firstInvalidIndex = -1

    events.forEach((event, index) => {
      const draft = drafts[event.eventId]
      if (!draft) return
      const itemErrors = validatePublishForm(draft, event)
      if (Object.keys(itemErrors).length > 0) {
        nextErrorsMap[event.eventId] = itemErrors
        if (firstInvalidIndex === -1) {
          firstInvalidIndex = index
        }
      }
    })

    setErrorsMap(nextErrorsMap)

    if (firstInvalidIndex !== -1) {
      setActiveIndex(firstInvalidIndex)
      showToast(`第 ${firstInvalidIndex + 1} 条存在未填项，请完善后再提交`)
      return
    }

    events.forEach((event) => {
      mergePublishSubmitPayload(event, drafts[event.eventId])
    })

    navigate(COLLATERAL_WARNING_LIST_PATH, {
      replace: true,
      state: {
        batchPublishedIds: events.map((event) => event.eventId),
        batchPublishCount: events.length,
      },
    })
  }

  if (events.length === 0) {
    return (
      <MobileShell>
        <NavBar title="批量公示确认" onBack={() => navigate(COLLATERAL_WARNING_LIST_PATH)} />
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-gray-500">
          未找到可批量公示的候选记录
        </div>
      </MobileShell>
    )
  }

  if (!activeEvent || !activeDraft) {
    return (
      <MobileShell>
        <NavBar title="批量公示确认" onBack={handleLeave} />
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-gray-500">
          正在加载批量公示确认内容…
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["collateral-warning-toolbar"]}>
        <NavBar
          title={`批量公示 (${activeIndex + 1}/${events.length})`}
          onBack={handleLeave}
        />
      </PrototypeAnnotationTarget>

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-[#f4f6f8]">
        <div className="shrink-0 border-b border-gray-200/80 bg-white px-3 py-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {events.map((event, index) => {
              const hasError = Object.keys(errorsMap[event.eventId] ?? {}).length > 0
              const isActive = index === activeIndex
              return (
                <button
                  key={event.eventId}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    isActive
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : hasError
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  {event.orderNo}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pb-28 overscroll-contain">
          <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2.5 text-xs leading-relaxed text-blue-900">
            当前：{activeEvent.orderNo} · {activeEvent.warningType}。表单与单条公示确认页一致，除订单号外均可编辑。
          </div>

          <PrototypeAnnotationTarget annotationIds={["h5-collateral-warning-detail-facts"]}>
            <CollateralWarningPublishFormContent
              event={activeEvent}
              draft={activeDraft}
              errors={activeErrors}
              onDraftChange={updateDraft}
            />
          </PrototypeAnnotationTarget>
        </div>

        <div className="border-t border-gray-200/90 bg-white px-4 py-3 shadow-lg">
          <div className="mb-2 flex gap-2">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((current) => current - 1)}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
              上一条
            </button>
            <button
              type="button"
              disabled={activeIndex >= events.length - 1}
              onClick={() => setActiveIndex((current) => current + 1)}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 disabled:opacity-40"
            >
              下一条
              <ChevronRight className="size-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleSubmitAll}
            className="w-full rounded-2xl bg-orange-600 py-3 text-sm font-bold text-white shadow-md active:bg-orange-700"
          >
            提交全部公示（{events.length} 条）
          </button>
        </div>
      </div>

      <Toast message={toastMessage} />
    </MobileShell>
  )
}
