import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReleaseMaterialForm } from "../components/ReleaseMaterialForm"
import { TriggerHistoryDrawer } from "../components/TriggerHistoryDrawer"
import { DetailField, DetailSection } from "../components/DetailSection"
import { WarningStatusBadge } from "../components/WarningStatusBadge"
import { SeverityLevelDisplay } from "../components/SeverityLevelDisplay"
import {
  getReleaseAccess,
  getReleaseHintText,
  RELEASE_DEMO_SITUATION_BY_EVENT,
  validateReleaseForm,
  type ReleaseFormErrors,
} from "../domain/release-validation"
import {
  formatDetailWarningContent,
  getDeviceWarningEventById,
} from "../lib/detail-utils"
import {
  getReleaseBackPath,
  isReleaseNavigationState,
  type ReleaseNavigationState,
} from "../lib/release-navigation"
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningReleaseAnnotations } from "../annotations/device-warning-release.annotations"
import { deviceWarningDocuments } from "../documents/device-warning-documents"

export function DeviceWarningEventReleasePage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const navigationState = isReleaseNavigationState(location.state)
    ? (location.state as ReleaseNavigationState)
    : null

  const event = useMemo(() => getDeviceWarningEventById(id), [id])
  const access = useMemo(() => getReleaseAccess(event), [event])
  const backPath = event
    ? getReleaseBackPath(event.eventId, navigationState?.from)
    : "/物联网IOT与预警/预警信息/设备预警信息"

  const [situationDescription, setSituationDescription] = useState("")
  const [sitePhotoNames, setSitePhotoNames] = useState<string[]>([])
  const [errors, setErrors] = useState<ReleaseFormErrors>({})
  const [dirty, setDirty] = useState(false)
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!event || !access.allowed) {
      return
    }

    if (!navigationState?.releaseConfirmed) {
      navigate(backPath, { replace: true })
      return
    }

    setSituationDescription(
      RELEASE_DEMO_SITUATION_BY_EVENT[event.eventId] ?? ""
    )
    setSitePhotoNames([])
    setErrors({})
    setDirty(false)
  }, [access.allowed, backPath, event, navigate, navigationState?.releaseConfirmed])

  useEffect(() => {
    if (!event || access.allowed) {
      return
    }

    setToastMessage(access.message)
    const timer = window.setTimeout(() => {
      navigate(`/物联网IOT与预警/预警信息/设备预警信息/详情/${event.eventId}`, {
        replace: true,
      })
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [access, event, navigate])

  const markDirty = () => {
    if (!dirty) {
      setDirty(true)
    }
  }

  const handleNavigateAway = (to: string) => {
    if (
      dirty &&
      !window.confirm("当前有未保存的变更，确认离开解除页吗？")
    ) {
      return
    }

    navigate(to)
  }

  const handleSubmitClick = () => {
    if (!event) {
      return
    }

    const validationErrors = validateReleaseForm({
      situationDescription,
      sitePhotoNames,
      version: event.version,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setDirty(false)
    setToastMessage(`解除成功 — ${event.ruleName}`)
    window.setTimeout(() => {
      navigate(backPath, { replace: true })
    }, 1000)
  }

  if (!event) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/物联网IOT与预警/预警信息/设备预警信息">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的设备预警信息
        </div>
      </div>
    )
  }

  if (!access.allowed) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          {access.message}
        </div>
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    )
  }

  if (!navigationState?.releaseConfirmed) {
    return null
  }

  const warningContent = formatDetailWarningContent(event)
  const hintText = getReleaseHintText(event.triggerCount)

  return (
    <PrototypeAnnotationProvider
      title="设备预警解除 · 原型批注"
      annotations={deviceWarningReleaseAnnotations}
      documents={deviceWarningDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["device-warning-release-header", "device-warning-release-submit"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                解除预警 — {event.ruleName}
              </h1>
              <p className="text-sm text-muted-foreground">{hintText}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => handleNavigateAway(backPath)}>
                <ArrowLeftIcon />
                返回
              </Button>
              <Button variant="outline" onClick={() => handleNavigateAway(backPath)}>
                取消
              </Button>
              <Button onClick={handleSubmitClick}>确认解除</Button>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-release-summary"]}>
          <DetailSection title="预警摘要">
            <DetailField label="事件 ID">{event.eventUuid}</DetailField>
            <DetailField label="规则名称">{event.ruleName}</DetailField>
            <DetailField label="预警类型">{event.warningType}</DetailField>
            <DetailField label="预警子类型">{event.warningSubType}</DetailField>
            <DetailField label="预警等级">
              <SeverityLevelDisplay event={event} />
            </DetailField>
            <DetailField label="预警状态">
              <WarningStatusBadge event={event} />
            </DetailField>
            <DetailField label="预警次数">
              <button
                type="button"
                className="font-semibold text-orange-600 hover:underline"
                onClick={() => setTimelineOpen(true)}
              >
                {event.triggerCount} 次
              </button>
              <button
                type="button"
                className="ml-2 text-primary hover:underline"
                onClick={() => setTimelineOpen(true)}
              >
                查看触发历史
              </button>
            </DetailField>
            <DetailField label="首次预警时间">
              {event.firstWarningTime}
            </DetailField>
            <DetailField label="最近预警时间">{event.latestWarningTime}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <DetailSection title="触发事实">
          <DetailField label="所属仓库">{event.warehouseDetail}</DetailField>
          <DetailField label="关联设备">
            {event.deviceName} ({event.deviceCode})
          </DetailField>
          <DetailField label="预警内容">{warningContent}</DetailField>
          <DetailField label="预警抓拍图">
            {event.snapshotImageStatus === "available" ? (
              <Button variant="link" className="h-auto p-0">
                <ImageIcon className="size-4" />
                查看触发抓拍大图
              </Button>
            ) : event.snapshotImageStatus === "failed" ? (
              "抓拍失败"
            ) : (
              "无抓拍图"
            )}
          </DetailField>
        </DetailSection>

        <PrototypeAnnotationTarget annotationIds={["device-warning-release-form"]}>
          <DetailSection title="解除材料">
            <ReleaseMaterialForm
              situationDescription={situationDescription}
              sitePhotoNames={sitePhotoNames}
              version={event.version}
              triggerCount={event.triggerCount}
              errors={errors}
              onSituationChange={(value) => {
                markDirty()
                setSituationDescription(value)
                if (errors.situationDescription) {
                  setErrors((prev) => ({
                    ...prev,
                    situationDescription: undefined,
                  }))
                }
              }}
              onSitePhotosChange={(names) => {
                markDirty()
                setSitePhotoNames(names)
                if (errors.sitePhotos) {
                  setErrors((prev) => ({ ...prev, sitePhotos: undefined }))
                }
              }}
            />
          </DetailSection>
        </PrototypeAnnotationTarget>

        <TriggerHistoryDrawer
          open={timelineOpen}
          event={event}
          onOpenChange={setTimelineOpen}
          onSnapshotPreview={(sequence) => {
            setToastMessage(`抓拍预览 — 第 ${sequence} 次触发`)
            window.setTimeout(() => setToastMessage(null), 2500)
          }}
        />
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
