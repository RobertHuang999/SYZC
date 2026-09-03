import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { getDetailHeaderActions } from "../domain/actions"
import { WARNING_STATUS } from "../domain/types"
import type { CollateralWarningEventDetail } from "../domain/types"
import { CollateralWarningStatusBadge } from "../components/CollateralWarningStatusBadge"
import { PublishConfirmDialog } from "../components/PublishConfirmDialog"
import { ReleasePromptDialog } from "../components/ReleasePromptDialog"
import { getCollateralWarningById } from "../lib/detail-utils"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { collateralWarningDetailAnnotations } from "../annotations/collateral-warning-detail.annotations"
import { collateralWarningDocuments } from "../documents/collateral-warning-documents"

export function CollateralWarningDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [publishTarget, setPublishTarget] =
    useState<CollateralWarningEventDetail | null>(null)
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const event = useMemo(() => getCollateralWarningById(id), [id])
  const headerActions = useMemo(
    () => (event ? getDetailHeaderActions(event) : ["back"]),
    [event]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  if (!event) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/物联网IOT与预警/预警信息/押品预警信息">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的押品预警信息
        </div>
      </div>
    )
  }

  const showPenetration = event.penetrationInfo !== null
  const showDisposal = event.warningStatus === WARNING_STATUS.CLOSED_VALID
  const showInvalid = event.warningStatus === WARNING_STATUS.OPEN_INVALID
  const deviceEventId =
    event.penetrationInfo?.relatedEventId ?? event.deviceEventId ?? "evt-017"
  const returnRoute = `/物联网IOT与预警/预警信息/押品预警信息/详情/${event.eventId}`
  const deviceDetailRoute =
    `/物联网IOT与预警/预警信息/设备预警信息/详情/${deviceEventId}?device_event_id=${encodeURIComponent(deviceEventId)}&warn_id=${encodeURIComponent(event.eventId)}&return_route=${encodeURIComponent(returnRoute)}`
  const orderProcessRoute =
    `/融资/监管/抵质押业务/抵质押业务办理?order_id=${encodeURIComponent(event.orderNo)}&warn_id=${encodeURIComponent(event.eventId)}&return_route=${encodeURIComponent(returnRoute)}`

  return (
    <PrototypeAnnotationProvider
      title="押品预警详情 · 原型批注"
      annotations={collateralWarningDetailAnnotations}
      documents={collateralWarningDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-header", "collateral-warning-detail-actions"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {event.warningType} · {event.orderNo}
              </h1>
              <CollateralWarningStatusBadge event={event} />
            </div>

            <div className="flex flex-wrap gap-2">
              {headerActions.includes("back") && (
                <Link to="/物联网IOT与预警/预警信息/押品预警信息">
                  <Button variant="outline">
                    <ArrowLeftIcon />
                    返回
                  </Button>
                </Link>
              )}
              {headerActions.includes("release") && (
                <Button
                  onClick={() => setReleaseDialogOpen(true)}
                >
                  解除预警
                </Button>
              )}
              {headerActions.includes("viewDevice") && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate(deviceDetailRoute)
                  }}
                >
                  查看设备事件
                </Button>
              )}
              {headerActions.includes("publish") && (
                <Button onClick={() => setPublishTarget(event)}>公示风险</Button>
              )}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-base"]}>
          <DetailSection title="基本信息">
            <DetailField label="预警订单">{event.orderNo}</DetailField>
            <DetailField label="订单类型">{event.orderType}</DetailField>
            <DetailField label="预警类型">{event.warningType}</DetailField>
            <DetailField label="预警等级">
              <SeverityLevelDisplay
                severityCode={event.severityCode}
                severityName={event.severityName}
                severityColor={event.severityColor}
              />
            </DetailField>
            <DetailField label="预警来源">{event.warningSource}</DetailField>
            <DetailField label="规则名称">{event.ruleName}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-facts"]}>
          <DetailSection title="预警事实">
            <DetailField label="预警内容">{event.warningContent}</DetailField>
            <DetailField label="预警时间">{event.warningTime}</DetailField>
            <DetailField label="预警抓拍图">
              {event.snapshotImageUrl ? (
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
            {event.triggerSnapshot && (
              <DetailField label="触发快照">{event.triggerSnapshot}</DetailField>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {showPenetration && event.penetrationInfo && (
          <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-penetration"]}>
            <DetailSection title="穿透信息">
              <DetailField label="触发设备">
                {event.penetrationInfo.triggerDevice}
              </DetailField>
              <DetailField label="物理子类型">
                {event.penetrationInfo.physicalSubType}
              </DetailField>
              <DetailField label="触发位置">
                {event.penetrationInfo.triggerLocation}
              </DetailField>
              <DetailField label="关联事件编号">
                {event.penetrationInfo.relatedEventNo}
              </DetailField>
              <DetailField label="关联事件">
                <Link
                  to={deviceDetailRoute}
                  className="text-primary hover:underline"
                >
                  {event.penetrationInfo.relatedEventNo}
                </Link>
              </DetailField>
              <p className="text-xs text-muted-foreground">
                须在设备预警信息现场核销后自动解除；本页无解除预警入口。
              </p>
            </DetailSection>
          </PrototypeAnnotationTarget>
        )}

        {showDisposal && event.disposalInfo && (
          <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-disposal"]}>
            <DetailSection title="处置信息">
              <DetailField label="处理时间">
                {formatEmptyValue(event.processedTime)}
              </DetailField>
              <DetailField label="处理人">
                {formatEmptyValue(event.processedBy)}
              </DetailField>
              <DetailField label="情况说明">
                {formatEmptyValue(event.disposalInfo.situationDescription)}
              </DetailField>
              <DetailField label="现场照片">
                {event.disposalInfo.sitePhotos.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {event.disposalInfo.sitePhotos.map((photo) => (
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
              <DetailField label="解除预警抓拍图">
                {event.disposalInfo.releaseSnapshotImage ? (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <ImageIcon className="size-4" />
                    {event.disposalInfo.releaseSnapshotImage}
                  </span>
                ) : (
                  "—"
                )}
              </DetailField>
            </DetailSection>
          </PrototypeAnnotationTarget>
        )}

        {showInvalid && (
          <DetailSection title="无效说明">
            <DetailField label="无效原因">
              {formatEmptyValue(event.invalidReason)}
            </DetailField>
          </DetailSection>
        )}

      <PublishConfirmDialog
        open={publishTarget !== null}
        event={publishTarget}
        onOpenChange={(open) => {
          if (!open) {
            setPublishTarget(null)
          }
        }}
        onConfirm={(target) => {
          setPublishTarget(null)
          showToast(`公示风险 — ${target.orderNo}`)
        }}
      />

      <ReleasePromptDialog
        open={releaseDialogOpen}
        orderNo={event.orderNo}
        onOpenChange={setReleaseDialogOpen}
        onConfirm={() => {
          setReleaseDialogOpen(false)
          navigate(orderProcessRoute)
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
