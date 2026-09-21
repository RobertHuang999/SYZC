import { Camera, Copy } from "lucide-react"
import { SectionCard } from "@/components/ui/SectionCard"
import { formatDateTime } from "@/shared/lib/date-utils"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { CollateralWarningEventDetail } from "../domain/types"
import { WARNING_STATUS } from "../domain/types"
import { CollateralWarningStatusBadge } from "./CollateralWarningStatusBadge"

type CollateralWarningDetailContentProps = {
  event: CollateralWarningEventDetail
  allExpanded?: boolean
  onCopyOrderNo?: (orderNo: string) => void
  onPreviewImage?: () => void
  onViewDevice?: () => void
}

export function CollateralWarningDetailContent({
  event,
  allExpanded = true,
  onCopyOrderNo,
  onPreviewImage,
  onViewDevice,
}: CollateralWarningDetailContentProps) {
  const isPenetration =
    event.warningSource === "物联穿透" || Boolean(event.deviceEventId)
  const isClosed = event.warningStatus === WARNING_STATUS.CLOSED_VALID
  const isInvalid = event.warningStatus === WARNING_STATUS.OPEN_INVALID
  const situationDescription =
    event.disposalInfo?.situationDescription ?? ""
  const sitePhotos = event.disposalInfo?.sitePhotos ?? []

  return (
    <>
      <PrototypeAnnotationTarget
        annotationIds={[
          "h5-collateral-warning-detail-header",
          "h5-collateral-warning-detail-base",
          "h5-collateral-warning-detail-facts",
        ]}
      >
        <SectionCard
          title="预警事实摘要"
          indicatorColor="#1875f0"
          collapsed={!allExpanded}
          extra={
            <div className="flex items-center gap-1.5">
              <span
                className="rounded px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs"
                style={{ backgroundColor: event.severityColor }}
              >
                {event.severityCode} {event.severityName}
              </span>
              <CollateralWarningStatusBadge event={event} />
            </div>
          }
        >
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">预警订单:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-gray-900">
                  {event.orderNo}
                </span>
                {onCopyOrderNo ? (
                  <button
                    type="button"
                    onClick={() => onCopyOrderNo(event.orderNo)}
                    className="text-gray-400 hover:text-blue-600 cursor-pointer"
                    title="复制单号"
                  >
                    <Copy className="size-3" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">订单类型:</span>
              <span className="flex-1 text-right font-semibold text-indigo-700">
                {event.orderType ?? "抵押"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">规则名称:</span>
              <span className="flex-1 text-right font-bold text-gray-900">
                {event.ruleName || `${event.warningType}监控`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">预警类型:</span>
              <span className="flex-1 text-right font-semibold text-indigo-700">
                {event.warningType}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">来源渠道:</span>
              <span className="flex-1 text-right font-medium text-gray-800">
                {event.warningSource}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">是否公示:</span>
              <span
                className={`rounded px-1.5 py-0.2 text-[10px] font-medium ${
                  event.publicityStatus === "已公示"
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : event.publicityStatus === "已取消"
                      ? "bg-gray-100 text-gray-500 border border-gray-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {event.publicityStatus}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">预警时间:</span>
              <span className="flex-1 text-right font-mono text-gray-800">
                {formatDateTime(event.warningTime)}
              </span>
            </div>

            <div className="border-t border-gray-100/80 pt-2">
              <span className="text-gray-500">预警内容:</span>
              <p className="mt-1 rounded-xl border border-slate-100/90 bg-slate-50 p-2.5 font-normal leading-relaxed text-gray-800">
                {event.warningContent}
              </p>
            </div>

            {event.snapshotImageStatus === "available" && onPreviewImage ? (
              <div className="mt-1 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 text-xs text-blue-900">
                <div className="flex items-center gap-1.5">
                  <Camera className="size-4 text-blue-600" />
                  <span>现场监控抓拍图已留痕存证</span>
                </div>
                <button
                  type="button"
                  onClick={onPreviewImage}
                  className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs active:bg-blue-700 cursor-pointer"
                >
                  查看抓拍
                </button>
              </div>
            ) : null}
          </div>
        </SectionCard>
      </PrototypeAnnotationTarget>

      {isPenetration ? (
        <SectionCard
          title="物联穿透关联设备信息"
          indicatorColor="#6366f1"
          collapsed={!allExpanded}
          extra={
            onViewDevice ? (
              <button
                type="button"
                onClick={onViewDevice}
                className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 active:bg-indigo-100 cursor-pointer"
              >
                看设备事件 ▸
              </button>
            ) : null
          }
        >
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">所属仓库:</span>
              <span className="flex-1 text-right text-gray-800">
                {event.penetrationInfo?.triggerLocation ||
                  "一号钢材仓 / A库 / 01分区"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">位置:</span>
              <span className="flex-1 text-right text-gray-800">
                {event.penetrationInfo?.installLocation || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">触发设备名称:</span>
              <span className="flex-1 text-right font-medium text-gray-900">
                {event.penetrationInfo?.triggerDevice || "智能挂锁-A01"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">物理事件子类型:</span>
              <span className="flex-1 text-right font-semibold text-rose-700">
                {event.penetrationInfo?.physicalSubType || "剪杆/拆壳破坏"}
              </span>
            </div>
          </div>
        </SectionCard>
      ) : null}

      {(isClosed || event.processedTime) && (
        <SectionCard
          title="处置与核销信息"
          indicatorColor="#00a870"
          collapsed={!allExpanded}
        >
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">处理人:</span>
              <span className="flex-1 text-right font-medium text-gray-800">
                {event.processedBy || "王风控 (森云科技)"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="w-24 shrink-0 text-gray-500">处理时间:</span>
              <span className="flex-1 text-right font-mono font-medium text-gray-800">
                {event.processedTime ? formatDateTime(event.processedTime) : "—"}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-2">
              <span className="text-gray-500">情况说明:</span>
              {situationDescription ? (
                <p className="mt-1 rounded-xl border border-slate-100 bg-slate-50 p-2.5 font-normal leading-relaxed text-gray-800">
                  {situationDescription}
                </p>
              ) : null}
            </div>

            <div className="border-t border-gray-100 pt-2">
              <span className="text-gray-500">现场照片:</span>
              {sitePhotos.length > 0 && onPreviewImage ? (
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {sitePhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={onPreviewImage}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-gray-700 active:bg-gray-100 cursor-pointer"
                    >
                      <Camera className="size-3 text-emerald-600" />
                      <span>{photo}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {event.disposalInfo?.releaseSnapshotImage ? (
              <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[11px]">
                <span className="text-gray-500">解除预警抓拍图:</span>
                <span className="font-mono text-gray-700">
                  {event.disposalInfo.releaseSnapshotImage}
                </span>
              </div>
            ) : null}
          </div>
        </SectionCard>
      )}

      {isInvalid && event.invalidReason ? (
        <SectionCard
          title="记录失效说明"
          indicatorColor="#ef4444"
          collapsed={!allExpanded}
        >
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-2.5 text-xs text-rose-900">
            <span className="font-semibold">失效原因: </span>
            <span>{event.invalidReason}</span>
          </div>
        </SectionCard>
      ) : null}
    </>
  )
}
