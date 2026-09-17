import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeftIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CollateralWarningPublishFormContent } from "../components/CollateralWarningPublishFormContent"
import {
  buildPublishDraftFromWarning,
  type PublishDraftErrors,
  type RiskDisclosurePublishDraft,
} from "../domain/publish-draft"
import { getCollateralWarningById } from "../lib/detail-utils"
import {
  COLLATERAL_WARNING_LIST_PATH,
} from "../lib/publish-navigation"
import { canSelectForBatchPublish } from "../domain/actions"
import type { CollateralWarningEventDetail } from "../domain/types"
import { SnapshotImageModal, type SnapshotPreviewData } from "@/shared/components/SnapshotImageModal"
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
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(() => new Set())
  const [previewImage, setPreviewImage] = useState<SnapshotPreviewData | null>(
    null
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const nextDrafts: DraftMap = {}
    events.forEach((event) => {
      nextDrafts[event.eventId] = buildPublishDraftFromWarning(event)
    })
    setDrafts(nextDrafts)
    setErrorsMap({})
    setDirtyIds(new Set())
    setActiveIndex(0)
  }, [events])

  const activeEvent = events[activeIndex] ?? null
  const activeDraft = activeEvent ? drafts[activeEvent.eventId] : null
  const activeErrors = activeEvent ? errorsMap[activeEvent.eventId] ?? {} : {}

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 3000)
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
    setDirtyIds((current) => new Set(current).add(activeEvent.eventId))
    setErrorsMap((current) => ({
      ...current,
      [activeEvent.eventId]: {},
    }))
  }

  const confirmLeaveIfDirty = () => {
    if (dirtyIds.size === 0) {
      return true
    }
    return window.confirm("当前批量公示内容尚未全部提交，确认离开？未保存的修改将丢失。")
  }

  const handleLeave = () => {
    if (!confirmLeaveIfDirty()) {
      return
    }
    navigate(COLLATERAL_WARNING_LIST_PATH)
  }

  const switchToIndex = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= events.length) {
      return
    }
    setActiveIndex(nextIndex)
  }

  const handleSubmitAll = () => {
    const nextErrorsMap: ErrorMap = {}
    let firstInvalidIndex = -1

    events.forEach((event, index) => {
      const draft = drafts[event.eventId]
      if (!draft) {
        return
      }
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

    const payloads = events.map((event) =>
      mergePublishSubmitPayload(event, drafts[event.eventId])
    )

    navigate(COLLATERAL_WARNING_LIST_PATH, {
      replace: true,
      state: {
        batchPublishedIds: events.map((event) => event.eventId),
        batchPublishCount: payloads.length,
      },
    })
  }

  if (events.length === 0) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="outline" onClick={() => navigate(COLLATERAL_WARNING_LIST_PATH)}>
          <ArrowLeftIcon />
          返回列表
        </Button>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到可批量公示的候选记录，请返回列表重新勾选
        </div>
      </div>
    )
  }

  if (!activeEvent || !activeDraft) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          正在加载批量公示确认内容…
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            批量公示信息确认
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            共 {events.length} 条候选；右侧表单与单条公示确认页一致，逐条核对后可编辑并一次性提交。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleLeave}>
            <ArrowLeftIcon />
            返回列表
          </Button>
          <Button onClick={handleSubmitAll}>
            提交全部公示（{events.length} 条）
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-xl border bg-card p-3">
          <div className="mb-2 text-xs font-semibold text-muted-foreground">
            批量候选 · {events.length} 条
          </div>
          <ul className="space-y-1">
            {events.map((event, index) => {
              const isActive = index === activeIndex
              const hasError = Object.keys(errorsMap[event.eventId] ?? {}).length > 0
              const isDirty = dirtyIds.has(event.eventId)

              return (
                <li key={event.eventId}>
                  <button
                    type="button"
                    onClick={() => switchToIndex(index)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs">{event.orderNo}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {index + 1}/{events.length}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {event.warningType}
                    </div>
                    <div className="mt-1 flex gap-1.5 text-[10px]">
                      {isDirty ? (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">
                          已编辑
                        </span>
                      ) : null}
                      {hasError ? (
                        <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-700">
                          待完善
                        </span>
                      ) : null}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
            当前编辑：{activeEvent.eventId} · {activeEvent.orderNo} ·{" "}
            {activeEvent.warningType}（{activeIndex + 1}/{events.length}）
          </div>

          <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-disposal"]}>
            <CollateralWarningPublishFormContent
              event={activeEvent}
              draft={activeDraft}
              errors={activeErrors}
              onDraftChange={updateDraft}
              onPreviewImage={setPreviewImage}
            />
          </PrototypeAnnotationTarget>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={activeIndex === 0}
                onClick={() => switchToIndex(activeIndex - 1)}
              >
                <ChevronLeft className="size-4" />
                上一条
              </Button>
              <Button
                variant="outline"
                disabled={activeIndex >= events.length - 1}
                onClick={() => switchToIndex(activeIndex + 1)}
              >
                下一条
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleLeave}>
                取消
              </Button>
              <Button onClick={handleSubmitAll}>
                提交全部公示（{events.length} 条）
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SnapshotImageModal
        data={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {toastMessage ? (
        <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  )
}
