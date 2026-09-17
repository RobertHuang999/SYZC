import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CollateralWarningPublishFormContent } from "@/features/collateral-warning-events/components/CollateralWarningPublishFormContent"
import {
  buildPublishDraftFromWarning,
  type PublishDraftErrors,
  type RiskDisclosurePublishDraft,
} from "@/features/collateral-warning-events/domain/publish-draft"
import { getCollateralWarningById } from "@/features/collateral-warning-events/lib/detail-utils"
import { SnapshotImageModal, type SnapshotPreviewData } from "@/shared/components/SnapshotImageModal"
import {
  COLLATERAL_WARNING_LIST_PATH,
  getCollateralWarningDetailPath,
  getPublishDetailPath,
} from "@/features/collateral-warning-events/lib/publish-navigation"
import {
  canEnterPublishFlow,
  mergePublishSubmitPayload,
  validatePublishForm,
} from "../domain/publish-form"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

export function RiskDisclosurePublishPage() {
  const { warnId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isRepublish = Boolean(
    (location.state as { republish?: boolean } | null)?.republish
  )
  const event = useMemo(() => getCollateralWarningById(warnId), [warnId])
  const access = useMemo(
    () => canEnterPublishFlow(event, { republish: isRepublish }),
    [event, isRepublish]
  )

  const [draft, setDraft] = useState<RiskDisclosurePublishDraft | null>(null)
  const [errors, setErrors] = useState<PublishDraftErrors>({})
  const [dirty, setDirty] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<SnapshotPreviewData | null>(null)

  useEffect(() => {
    if (!event || !access.allowed) {
      return
    }
    setDraft(buildPublishDraftFromWarning(event))
    setErrors({})
    setDirty(false)
  }, [access.allowed, event])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const updateDraft = (patch: Partial<RiskDisclosurePublishDraft>) => {
    setDraft((current) => (current ? { ...current, ...patch } : current))
    setDirty(true)
  }

  const handleSubmit = () => {
    if (!draft || !event) return

    const nextErrors = validatePublishForm(draft, event)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      showToast("请完善必填项后再提交")
      return
    }

    const payload = mergePublishSubmitPayload(event, draft)
    showToast(`公示成功 — ${payload.orderNo}`)
    navigate(getPublishDetailPath(payload.sourceWarningId), {
      replace: true,
      state: { fromPublish: true, publishForm: payload },
    })
  }

  const handleLeave = () => {
    if (
      dirty &&
      !window.confirm("当前公示内容尚未提交，确认离开？未保存的修改将丢失。")
    ) {
      return
    }
    navigate(
      event
        ? getCollateralWarningDetailPath(event.eventId)
        : COLLATERAL_WARNING_LIST_PATH
    )
  }

  if (!event || !access.allowed) {
    return (
      <div className="space-y-4 p-6">
        <Link to={COLLATERAL_WARNING_LIST_PATH}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          {access.message ?? "无法进入风险公示确认页"}
        </div>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          正在加载公示确认内容…
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isRepublish ? "重新公示信息确认" : "风险公示信息确认"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            保留字段标题并反显预警内容；除订单号外均可编辑后提交公示。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleLeave}>
            <ArrowLeftIcon />
            返回预警列表
          </Button>
          <Button onClick={handleSubmit}>确认公示</Button>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
        来源预警：{event.eventId} · {event.orderNo} · 已结案 · 有效
        {isRepublish ? " · 重新公示" : " · 未公示"}
      </div>

      <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-disposal"]}>
        <CollateralWarningPublishFormContent
          event={event}
          draft={draft}
          errors={errors}
          onDraftChange={updateDraft}
          onPreviewImage={setPreviewImage}
        />
      </PrototypeAnnotationTarget>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={handleLeave}>
          取消
        </Button>
        <Button onClick={handleSubmit}>确认公示</Button>
      </div>

      <SnapshotImageModal
        data={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {toastMessage && (
        <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
