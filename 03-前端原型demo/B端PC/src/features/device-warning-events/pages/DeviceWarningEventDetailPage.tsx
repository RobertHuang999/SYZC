import { useMemo, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DateTimeText } from "@/shared/components/DateTimeText"
import { getDetailHeaderActions } from "../domain/actions"
import { WARNING_STATUS } from "../domain/status"
import type { DeviceWarningEventDetail } from "../domain/types"
import { WarningStatusBadge } from "../components/WarningStatusBadge"
import { SeverityLevelDisplay } from "../components/SeverityLevelDisplay"
import { DetailField, DetailSection } from "../components/DetailSection"
import { ReleaseConfirmDialog } from "../components/ReleaseConfirmDialog"
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningDetailAnnotations } from "../annotations/device-warning-detail.annotations"
import { deviceWarningDocuments } from "../documents/device-warning-documents"
import { SnapshotImageModal, type SnapshotPreviewData } from "@/shared/components/SnapshotImageModal"
import {
  formatDetailWarningContent,
  formatEmptyValue,
  getDeviceWarningEventById,
} from "../lib/detail-utils"

export function DeviceWarningEventDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [releaseTarget, setReleaseTarget] =
    useState<DeviceWarningEventDetail | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<SnapshotPreviewData | null>(null)

  const event = useMemo(() => getDeviceWarningEventById(id), [id])
  const returnRoute = useMemo(() => {
    const candidate = new URLSearchParams(location.search).get("return_route")
    return candidate?.startsWith("/")
      ? candidate
      : "/物联网IOT与预警/预警信息/设备预警信息"
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
            <div className="col-span-full space-y-1">
              <div className="detail-field-label">预警内容</div>
              <div className="rounded-lg border bg-muted/20 p-3 text-sm leading-relaxed text-foreground">
                {warningContent}
              </div>
            </div>
            <DetailField label="预警时间">
              <DateTimeText value={event.warningTime} plain />
            </DetailField>
            <DetailField label="预警抓拍图">
              {event.snapshotImageStatus === "available" ? (
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary hover:underline cursor-pointer"
                  onClick={() =>
                    setPreviewImage({
                      title: `预警触发现场抓拍图 — ${event.ruleName}`,
                      desc: `关联设备：${event.deviceName} (${event.deviceCode}) | 预警时间：${event.warningTime}`,
                      time: event.warningTime,
                      location: `${event.warehouseDetail}`,
                    })
                  }
                >
                  <ImageIcon className="size-4 mr-1" />
                  查看触发抓拍大图
                </Button>
              ) : event.snapshotImageStatus === "failed" ? (
                <span className="text-destructive text-sm">抓拍失败</span>
              ) : (
                <span className="text-muted-foreground text-sm">无抓拍图</span>
              )}
            </DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-detail-release-info"]}>
          <DetailSection title="处置与核销信息">
            <DetailField label="处理时间">
              <DateTimeText value={event.processedTime} plain />
            </DetailField>
            <DetailField label="处理人">
              {formatEmptyValue(event.processedBy)}
            </DetailField>
            <div className="col-span-full">
              <div className="detail-field-label mb-1">情况说明</div>
              <div className="rounded-md border bg-muted/20 p-2.5 text-sm text-foreground">
                {showReleaseMaterials
                  ? formatEmptyValue(event.releaseMaterialSnapshot.situationDescription)
                  : "—"}
              </div>
            </div>
            <div className="col-span-full">
              <div className="detail-field-label mb-1.5">现场照片</div>
              {showReleaseMaterials &&
              event.releaseMaterialSnapshot.sitePhotos.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {event.releaseMaterialSnapshot.sitePhotos.map((photo) => (
                    <button
                      key={photo}
                      type="button"
                      onClick={() =>
                        setPreviewImage({
                          title: `现场核实照片凭证 — ${photo}`,
                          desc: `事件流水：${event.eventUuid} | 规则：${event.ruleName}`,
                          time: event.processedTime || event.warningTime,
                          location: event.warehouseDetail,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:border-primary/50 hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="size-3.5 text-primary" />
                      <span>{photo}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">未上传现场照片</span>
              )}
            </div>
            {showReleaseMaterials && event.releaseMaterialSnapshot.releaseSnapshotImage && (
              <DetailField label="解除抓拍图">
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary hover:underline cursor-pointer"
                  onClick={() =>
                    setPreviewImage({
                      title: `解除核销监控抓拍图 — ${event.ruleName}`,
                      desc: `核销人：${event.processedBy} | 解除时间：${event.processedTime}`,
                      time: event.processedTime || event.warningTime,
                      location: event.warehouseDetail,
                    })
                  }
                >
                  <ImageIcon className="size-4 mr-1" />
                  查看解除抓拍大图
                </Button>
              </DetailField>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-detail-rule-snapshot"]}>
          <DetailSection title="规则快照">
            <DetailField label="处置策略快照">
              {event.ruleConfigSnapshot.dispositionMode}
            </DetailField>
            <DetailField label="监控阈值">
              {event.ruleConfigSnapshot.monitorThreshold}
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
