import { ImageIcon } from "lucide-react"
import { DateTimeText } from "@/shared/components/DateTimeText"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import type { SnapshotPreviewData } from "@/shared/components/SnapshotImageModal"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type {
  CollateralCargoSnapshot,
  CollateralWarningEventDetail,
} from "../domain/types"
import { WARNING_STATUS } from "../domain/types"
import { CollateralWarningStatusBadge } from "./CollateralWarningStatusBadge"

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

type CollateralWarningDetailContentProps = {
  event: CollateralWarningEventDetail
  onPreviewImage?: (data: SnapshotPreviewData) => void
}

export function CollateralWarningDetailContent({
  event,
  onPreviewImage,
}: CollateralWarningDetailContentProps) {
  const showPenetration = event.penetrationInfo !== null
  const showDisposal = event.warningStatus === WARNING_STATUS.CLOSED_VALID
  const showInvalid = event.warningStatus === WARNING_STATUS.OPEN_INVALID
  const cargoItems = event.orderSnapshot.cargoItems
  const primaryStorageLocation =
    cargoItems[0]?.storageLocation || "仓储监管现场"
  const situationDescription =
    event.disposalInfo?.situationDescription ?? ""
  const sitePhotos = event.disposalInfo?.sitePhotos ?? []

  return (
    <>
      <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-base"]}>
        <DetailSection title="基本信息">
          <DetailField label="事件 ID">
            <span className="font-mono">{event.eventId}</span>
          </DetailField>
          <DetailField label="预警订单">{event.orderNo}</DetailField>
          <DetailField label="订单类型">
            {event.orderType ?? event.orderSnapshot.orderType}
          </DetailField>
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
                <div className="detail-field-value">
                  {formatEmptyValue(primaryStorageLocation)}
                </div>
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
                  onPreviewImage?.({
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
              <span className="text-xs text-destructive">
                抓拍失败（摄像头通信超时）
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                货位无联动摄像头抓拍图
              </span>
            )}
          </DetailField>

          {event.warningType === "物联穿透告警" ? (
            <div className="col-span-full mt-2 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              由仓储现场物理设备传感器即时异常联动触发，详细指标见下方【穿透信息】。
            </div>
          ) : null}
        </DetailSection>
      </PrototypeAnnotationTarget>

      {showPenetration && event.penetrationInfo ? (
        <PrototypeAnnotationTarget annotationIds={["collateral-warning-detail-penetration"]}>
          <DetailSection title="穿透信息">
            <DetailField label="所属仓库">
              {event.penetrationInfo.triggerLocation}
            </DetailField>
            <DetailField label="位置">
              {event.penetrationInfo.installLocation}
            </DetailField>
            <DetailField label="触发设备名称">
              {event.penetrationInfo.triggerDevice}
            </DetailField>
            <DetailField label="物理事件子类型">
              <span className="font-semibold text-destructive">
                {event.penetrationInfo.physicalSubType}
              </span>
            </DetailField>
            <p className="col-span-full mt-1 text-xs text-muted-foreground">
              💡 说明：物联穿透告警为底层设备异常自动联动生成，须在【设备预警信息】现场核销后自动解除；本页面无人工解除预警入口。
            </p>
          </DetailSection>
        </PrototypeAnnotationTarget>
      ) : null}

      {showDisposal && event.disposalInfo ? (
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
                {formatEmptyValue(situationDescription)}
              </div>
            </div>
            <div className="col-span-full">
              <div className="detail-field-label mb-1.5">现场照片</div>
              {sitePhotos.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {sitePhotos.map((photo) => (
                    <button
                      key={photo}
                      type="button"
                      onClick={() =>
                        onPreviewImage?.({
                          title: `现场核实照片凭证 — ${photo}`,
                          desc: `核销单据：${event.orderNo} | 处理人：${event.processedBy || "风控专员"}`,
                          time: event.processedTime || event.warningTime,
                          location: primaryStorageLocation,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 cursor-pointer"
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
            {event.disposalInfo.releaseSnapshotImage ? (
              <DetailField label="解除抓拍图">
                <button
                  type="button"
                  onClick={() =>
                    onPreviewImage?.({
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
            ) : null}
          </DetailSection>
        </PrototypeAnnotationTarget>
      ) : null}

      {showInvalid ? (
        <DetailSection title="无效说明">
          <DetailField label="失效原因">
            <span className="font-medium text-destructive">
              {formatEmptyValue(event.invalidReason)}
            </span>
          </DetailField>
        </DetailSection>
      ) : null}
    </>
  )
}
