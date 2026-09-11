import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DateTimeText } from "@/shared/components/DateTimeText"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { getDetailHeaderActions } from "../domain/actions"
import { WARNING_STATUS } from "../domain/types"
import type {
  CollateralCargoSnapshot,
  CollateralWarningEventDetail,
} from "../domain/types"
import { CollateralWarningStatusBadge } from "../components/CollateralWarningStatusBadge"
import { PublishConfirmDialog } from "../components/PublishConfirmDialog"
import { ReleasePromptDialog } from "../components/ReleasePromptDialog"
import { getCollateralWarningById } from "../lib/detail-utils"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { collateralWarningDetailAnnotations } from "../annotations/collateral-warning-detail.annotations"
import { collateralWarningDocuments } from "../documents/collateral-warning-documents"
import { SnapshotImageModal, type SnapshotPreviewData } from "@/shared/components/SnapshotImageModal"

function formatCargoSummary(cargoItem: CollateralCargoSnapshot): string {
  const cargoDescription = [
    cargoItem.cargoCategory,
    cargoItem.cargoName,
    cargoItem.cargoSpecification,
  ]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" / ")

  return [cargoDescription, cargoItem.cargoQuantity.trim()]
    .filter(Boolean)
    .join(" - ")
}

export function CollateralWarningDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [publishTarget, setPublishTarget] =
    useState<CollateralWarningEventDetail | null>(null)
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<SnapshotPreviewData | null>(null)

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
  const isHistoricalReadOnly = event.warningSource === "历史" || event.orderType === "监管"
  const deviceEventId =
    event.penetrationInfo?.relatedEventId ?? event.deviceEventId ?? "evt-017"
  const returnRoute = `/物联网IOT与预警/预警信息/押品预警信息/详情/${event.eventId}`
  const deviceDetailRoute =
    `/物联网IOT与预警/预警信息/设备预警信息/详情/${deviceEventId}?device_event_id=${encodeURIComponent(deviceEventId)}&warn_id=${encodeURIComponent(event.eventId)}&return_route=${encodeURIComponent(returnRoute)}`
  const orderProcessRoute =
    `/融资/监管/抵质押业务/抵质押业务办理?order_id=${encodeURIComponent(event.orderNo)}&warn_id=${encodeURIComponent(event.eventId)}&return_route=${encodeURIComponent(returnRoute)}`
  const cargoItems = event.orderSnapshot.cargoItems
  const primaryStorageLocation =
    cargoItems[0]?.storageLocation || "仓储监管现场"

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

        {isHistoricalReadOnly && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {event.orderType === "监管"
              ? "监管订单当前关闭，本记录仅支持详情、审计和资料查看，不提供解除、公示或其他写操作。"
              : "本记录为历史归档，仅支持详情、审计和资料查看，不提供业务写操作。"}
          </div>
        )}

        {/* 1. 基础识别与业务属性（对齐字段清单第一章） */}
        <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-base"]}>
          <DetailSection title="基本信息">
            <DetailField label="事件 ID">
              <span className="font-mono">{event.eventId}</span>
            </DetailField>
            <DetailField label="预警订单">{event.orderNo}</DetailField>
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
            <DetailField label="预警状态">
              <CollateralWarningStatusBadge event={event} />
            </DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 3. 预警事实与位置（对齐字段清单第一章） */}
        <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-facts"]}>
          <DetailSection title="预警事实与位置">
            <div className="col-span-full space-y-2">
              <div className="grid gap-x-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
                <div className="detail-field-label">货物位置</div>
                <div className="detail-field-label">货物与数量</div>
              </div>
              {cargoItems.length > 0 ? (
                cargoItems.map((cargoItem, index) => (
                  <div
                    key={`${cargoItem.cargoName}-${index}`}
                    className="grid gap-x-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]"
                  >
                    <div className="detail-field-value flex min-w-0 items-start leading-relaxed">
                      {cargoItems.length > 1 && (
                        <span className="mr-2 shrink-0 text-xs text-muted-foreground">
                          货物 {index + 1}
                        </span>
                      )}
                      <span className="min-w-0">{cargoItem.storageLocation}</span>
                    </div>
                    <div className="detail-field-value flex min-w-0 items-start leading-relaxed">
                      {cargoItems.length > 1 && (
                        <span className="mr-2 shrink-0 text-xs text-muted-foreground">
                          货物 {index + 1}
                        </span>
                      )}
                      <span className="min-w-0">
                        {formatCargoSummary(cargoItem) || "—"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid gap-x-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
                  <div className="detail-field-value">{formatEmptyValue(primaryStorageLocation)}</div>
                  <div className="detail-field-value">—</div>
                </div>
              )}
            </div>
            <div className="col-span-full space-y-1">
              <div className="detail-field-label">预警内容</div>
              <div className="rounded-lg border bg-muted/20 p-3 text-sm leading-relaxed text-foreground">
                {event.warningContent}
              </div>
            </div>
            <DetailField label="预警时间">
              <DateTimeText value={event.warningTime} plain />
            </DetailField>
            <DetailField label="预警抓拍图">
              {event.snapshotImageStatus === "available" ? (
                <button
                  type="button"
                  onClick={() =>
                    setPreviewImage({
                      title: "预警触发监控抓拍图",
                      desc: `订单号：${event.orderNo} | 触发时间：${event.warningTime}`,
                      time: event.warningTime,
                      location: primaryStorageLocation,
                    })
                  }
                  className="h-auto cursor-pointer p-0 text-primary hover:underline"
                >
                  <ImageIcon className="size-3.5" />
                  <span>查看现场监控抓拍图</span>
                </button>
              ) : event.snapshotImageStatus === "failed" ? (
                <span className="text-xs text-destructive">抓拍失败（摄像头通信超时）</span>
              ) : (
                <span className="text-xs text-muted-foreground">货位无联动摄像头抓拍图</span>
              )}
            </DetailField>

            {event.warningType === "物联穿透告警" ? (
              <div className="col-span-full mt-2 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                由仓储现场物理设备传感器即时异常联动触发，详细指标见下方【穿透信息】。
              </div>
            ) : null}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {/* 4. 物联穿透关联字段（对齐字段清单第二章，仅物联穿透告警展示） */}
        {showPenetration && event.penetrationInfo && (
          <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-penetration"]}>
            <DetailSection title="穿透信息">
              <DetailField label="触发设备名称">
                {event.penetrationInfo.triggerDevice}
              </DetailField>
              <DetailField label="物理事件子类型">
                <span className="font-semibold text-destructive">
                  {event.penetrationInfo.physicalSubType}
                </span>
              </DetailField>
              <DetailField label="触发现场位置">
                {event.penetrationInfo.triggerLocation}
              </DetailField>
              <p className="col-span-full text-xs text-muted-foreground mt-1">
                💡 说明：物联穿透告警为底层设备异常自动联动生成，须在【设备预警信息】现场核销后自动解除；本页面无人工解除预警入口。
              </p>
            </DetailSection>
          </PrototypeAnnotationTarget>
        )}

        {/* 5. 处置与核销信息（对齐字段清单第三章：解除预警表单字段，仅已结案 · 有效展示） */}
        {showDisposal && event.disposalInfo && (
          <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-disposal"]}>
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
                  {formatEmptyValue(event.disposalInfo.situationDescription)}
                </div>
              </div>
              <div className="col-span-full">
                <div className="detail-field-label mb-1.5">现场照片</div>
                {event.disposalInfo.sitePhotos.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {event.disposalInfo.sitePhotos.map((photo) => (
                      <button
                        key={photo}
                        type="button"
                        onClick={() =>
                          setPreviewImage({
                            title: `现场核实照片凭证 — ${photo}`,
                            desc: `核销单据：${event.orderNo} | 处理人：${event.processedBy || "风控专员"}`,
                            time: event.processedTime || event.warningTime,
                            location: primaryStorageLocation,
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
              {event.disposalInfo.releaseSnapshotImage && (
                <DetailField label="解除抓拍图">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewImage({
                        title: "解除预警即时监控抓拍图",
                        desc: `核销单据：${event.orderNo} | 解除时间：${event.processedTime}`,
                        time: event.processedTime || event.warningTime,
                        location: primaryStorageLocation,
                      })
                    }
                    className="h-auto cursor-pointer p-0 text-primary hover:underline"
                  >
                    <ImageIcon className="size-3.5" />
                    <span>查看解除抓拍图</span>
                  </button>
                </DetailField>
              )}
            </DetailSection>
          </PrototypeAnnotationTarget>
        )}

        {/* 6. 无效说明（仅已作废展示） */}
        {showInvalid && (
          <DetailSection title="无效说明">
            <DetailField label="失效原因">
              <span className="text-destructive font-medium">
                {formatEmptyValue(event.invalidReason)}
              </span>
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
