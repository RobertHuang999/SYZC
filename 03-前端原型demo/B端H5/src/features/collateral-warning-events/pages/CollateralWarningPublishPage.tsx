import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { Toast } from "@/components/ui/Toast"
import { CollateralWarningPublishFormContent } from "../components/CollateralWarningPublishFormContent"
import {
  buildPublishDraftFromWarning,
  type PublishDraftErrors,
  type RiskDisclosurePublishDraft,
} from "../domain/publish-draft"
import {
  canEnterPublishFlow,
  mergePublishSubmitPayload,
  validatePublishForm,
} from "@/features/risk-disclosure/domain/publish-form"
import { getCollateralWarningById } from "../lib/detail-utils"
import { getPublishDetailPath } from "../lib/publish-navigation"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

export function CollateralWarningPublishPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isRepublish = Boolean(
    (location.state as { republish?: boolean } | null)?.republish
  )
  const event = useMemo(() => getCollateralWarningById(id), [id])
  const access = useMemo(
    () => canEnterPublishFlow(event, { republish: isRepublish }),
    [event, isRepublish]
  )

  const [draft, setDraft] = useState<RiskDisclosurePublishDraft | null>(null)
  const [errors, setErrors] = useState<PublishDraftErrors>({})
  const [dirty, setDirty] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!event || !access.allowed) {
      return
    }
    setDraft(buildPublishDraftFromWarning(event))
    setErrors({})
    setDirty(false)
  }, [access.allowed, event])

  const updateDraft = (patch: Partial<RiskDisclosurePublishDraft>) => {
    setDraft((current) => (current ? { ...current, ...patch } : current))
    setDirty(true)
  }

  const handleLeave = () => {
    if (
      dirty &&
      !window.confirm("当前公示内容尚未提交，确认离开？未保存的修改将丢失。")
    ) {
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    if (id) {
      navigate(`/m/supervision/order-warnings/${id}`, { replace: true })
      return
    }
    navigate("/m/supervision/order-warnings", { replace: true })
  }

  const handleSubmit = () => {
    if (!draft || !event) return

    const nextErrors = validatePublishForm(draft, event)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setToastMessage("请完善必填项后再提交")
      return
    }

    const payload = mergePublishSubmitPayload(event, draft)
    setToastMessage(`公示成功 — ${payload.orderNo}`)
    window.setTimeout(() => {
      navigate(getPublishDetailPath(payload.sourceWarningId), {
        replace: true,
        state: { fromPublish: true, publishForm: payload },
      })
    }, 600)
  }

  if (!event || !access.allowed) {
    return (
      <MobileShell>
        <NavBar title="风险公示确认" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-gray-500">
          {access.message ?? "无法进入风险公示确认页"}
        </div>
      </MobileShell>
    )
  }

  if (!draft) {
    return (
      <MobileShell>
        <NavBar title="风险公示确认" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-gray-500">
          正在加载公示确认内容…
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <NavBar
        title={isRepublish ? "重新公示确认" : "风险公示确认"}
        onBack={handleLeave}
      />

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-[#f4f6f8]">
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pb-24 overscroll-contain">
          <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2.5 text-xs leading-relaxed text-blue-900">
            保留字段标题并反显预警内容；除订单号外均可编辑。
          </div>

          <PrototypeAnnotationTarget annotationIds={["h5-collateral-warning-detail-facts"]}>
            <CollateralWarningPublishFormContent
              event={event}
              draft={draft}
              errors={errors}
              onDraftChange={updateDraft}
            />
          </PrototypeAnnotationTarget>
        </div>

        <div className="border-t border-gray-200/90 bg-white px-4 py-3 shadow-lg">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleLeave}
              className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200 cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-orange-700 cursor-pointer"
            >
              确认公示
            </button>
          </div>
        </div>
      </div>

      <Toast message={toastMessage} />
    </MobileShell>
  )
}
