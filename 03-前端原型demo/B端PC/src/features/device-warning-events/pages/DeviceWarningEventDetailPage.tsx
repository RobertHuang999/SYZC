import { useMemo, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDetailHeaderActions } from "../domain/actions"
import { WARNING_STATUS } from "../domain/status"
import type { DeviceWarningEventDetail } from "../domain/types"
import { WarningStatusBadge } from "../components/WarningStatusBadge"
import { SeverityLevelDisplay } from "../components/SeverityLevelDisplay"
import { DetailField, DetailSection } from "../components/DetailSection"
import { ReleaseConfirmDialog } from "../components/ReleaseConfirmDialog"
import { TriggerHistoryDrawer } from "../components/TriggerHistoryDrawer"
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningDetailAnnotations } from "../annotations/device-warning-detail.annotations"
import { deviceWarningDocuments } from "../documents/device-warning-documents"
import {
  formatDetailWarningContent,
  formatEmptyValue,
  getDeviceWarningEventById,
} from "../lib/detail-utils"

export function DeviceWarningEventDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [releaseTarget, setReleaseTarget] =
    useState<DeviceWarningEventDetail | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const event = useMemo(() => getDeviceWarningEventById(id), [id])
  const returnRoute = useMemo(() => {
    const candidate = new URLSearchParams(location.search).get("return_route")
    return candidate?.startsWith("/")
      ? candidate
      : "/预警信息/设备预警信息"
  }, [location.search])
  const headerActions = useMemo(
    () => (event ? getDetailHeaderActions(event) : ["back"]),
    [event]
  )

  if (!event) {
    return (
      <div className="space-y-4 p-6">
        <Link to={returnRoute}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <CardNotFound />
      </div>
    )
  }

  const warningContent = formatDetailWarningContent(event)
  const isClosed = event.warningStatus === WARNING_STATUS.CLOSED_VALID
  const showReleaseMaterials =
    isClosed &&
    (event.releaseMaterialSnapshot.situationDescription ||
      event.releaseMaterialSnapshot.sitePhotos.length > 0 ||
      event.releaseMaterialSnapshot.releaseSnapshotImage)

  return (
    <PrototypeAnnotationProvider
      title="设备预警详情 · 原型批注"
      annotations={deviceWarningDetailAnnotations}
      documents={deviceWarningDocuments}
    >
      <div className="space-y-4 p-6">
      <PrototypeAnnotationTarget annotationIds={["device-warning-detail-header", "device-warning-detail-actions"]}>
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {event.ruleName}
            </h1>
            <WarningStatusBadge event={event} />
          </div>

          <div className="flex flex-wrap gap-2">
            {headerActions.includes("back") && (
              <Link to={returnRoute}>
                <Button variant="outline">
                  <ArrowLeftIcon />
                  返回
                </Button>
              </Link>
            )}
            {headerActions.includes("release") && (
              <Button onClick={() => setReleaseTarget(event)}>解除预警</Button>
            )}
            {headerActions.includes("frequency") && (
              <Button variant="secondary" onClick={() => setTimelineOpen(true)}>
                查看频次 {event.triggerCount}次
              </Button>
            )}
          </div>
        </div>
      </PrototypeAnnotationTarget>

      <PrototypeAnnotationTarget annotationIds={["device-warning-detail-base"]}>
        <DetailSection title="基本信息">
          <DetailField label="事件 ID">{event.eventUuid}</DetailField>
          <DetailField label="规则名称">{event.ruleName}</DetailField>
          <DetailField label="预警类型">{event.warningType}</DetailField>
          <DetailField label="预警子类型">{event.warningSubType}</DetailField>
          <DetailField label="预警等级">
            <SeverityLevelDisplay event={event} />
          </DetailField>
          <DetailField label="预警状态">
            <div className="space-y-1">
              <WarningStatusBadge event={event} />
              {event.invalidReason && (
                <p className="text-sm text-muted-foreground">
                  失效原因：{event.invalidReason}
                </p>
              )}
            </div>
          </DetailField>
        </DetailSection>
      </PrototypeAnnotationTarget>

      <PrototypeAnnotationTarget annotationIds={["device-warning-detail-facts"]}>
        <DetailSection title="触发事实与位置">
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
      </PrototypeAnnotationTarget>

      <PrototypeAnnotationTarget annotationIds={["device-warning-detail-timeline"]}>
        <DetailSection title="频次与时间">
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
          <DetailField label="最近预警时间">
            {formatEmptyValue(event.latestWarningTime)}
          </DetailField>
          <DetailField label="防抖留痕">
            {formatEmptyValue(event.debounceTrace)}
          </DetailField>
        </DetailSection>
      </PrototypeAnnotationTarget>

      <PrototypeAnnotationTarget annotationIds={["device-warning-detail-release-info"]}>
        <DetailSection title="处置信息">
          <DetailField label="处理时间">
            {formatEmptyValue(event.processedTime)}
          </DetailField>
          <DetailField label="处理人">
            {formatEmptyValue(event.processedBy)}
          </DetailField>
          <DetailField label="情况说明">
            {showReleaseMaterials
              ? formatEmptyValue(event.releaseMaterialSnapshot.situationDescription)
              : "—"}
          </DetailField>
          <DetailField label="现场照片">
            {showReleaseMaterials &&
            event.releaseMaterialSnapshot.sitePhotos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {event.releaseMaterialSnapshot.sitePhotos.map((photo) => (
                  <span
                    key={photo}
                    className="inline-flex items-center gap-1 text-primary"
                  >
                    <ImageIcon className="size-4" />
                    {photo}
                  </span>
                ))}
              </div>
            ) : (
              "—"
            )}
          </DetailField>
          <DetailField label="解除抓拍">
            {showReleaseMaterials &&
            event.releaseMaterialSnapshot.releaseSnapshotImage ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <ImageIcon className="size-4" />
                {event.releaseMaterialSnapshot.releaseSnapshotImage}
              </span>
            ) : (
              "—"
            )}
          </DetailField>
        </DetailSection>
      </PrototypeAnnotationTarget>

      <PrototypeAnnotationTarget annotationIds={["device-warning-detail-rule-snapshot"]}>
        <DetailSection title="规则快照">
          <DetailField label="监控阈值">
            {event.ruleConfigSnapshot.monitorThreshold}
          </DetailField>
          <DetailField label="防抖条件">
            {event.ruleConfigSnapshot.debounceCondition}
          </DetailField>
          <DetailField label="升级策略">
            {event.ruleConfigSnapshot.upgradeStrategy}
          </DetailField>
        </DetailSection>
      </PrototypeAnnotationTarget>

      <ReleaseConfirmDialog
        open={releaseTarget !== null}
        event={releaseTarget}
        onOpenChange={(open) => {
          if (!open) {
            setReleaseTarget(null)
          }
        }}
        onConfirm={(target) => {
          setReleaseTarget(null)
          setToastMessage(`解除成功 — ${target.ruleName}`)
          navigate(returnRoute)
        }}
      />

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

function CardNotFound() {
  return (
    <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
      未找到对应的设备预警信息
    </div>
  )
}
