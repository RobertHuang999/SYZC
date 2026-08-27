import { useState } from "react"
import {
  Camera,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal"
import { formatDateTime } from "@/shared/lib/date-utils"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { getRowActions } from "../domain/actions"
import type { CollateralWarningEvent } from "../domain/types"
import { CollateralWarningStatusBadge } from "./CollateralWarningStatusBadge"

type CollateralWarningCardProps = {
  event: CollateralWarningEvent
  batchMode?: boolean
  selected?: boolean
  selectable?: boolean
  onToggleSelect?: (eventId: string) => void
  onPublish?: (event: CollateralWarningEvent) => void
  onPermissionDenied?: () => void
}

export function CollateralWarningCard({
  event,
  batchMode = false,
  selected = false,
  selectable = false,
  onToggleSelect,
  onPublish,
  onPermissionDenied,
}: CollateralWarningCardProps) {
  const navigate = useNavigate()
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)

  const actions = getRowActions(event)

  const handleAction = (action: (typeof actions)[number]) => {
    switch (action) {
      case "detail":
        navigate(`/m/supervision/order-warnings/${event.eventId}`)
        break
      case "release":
        if (event.orderNo === "PO202608-88") {
          onPermissionDenied?.()
          return
        }
        navigate(
          `/m/finance/pledge-orders?order=${event.orderNo}&warn_id=${event.eventId}`
        )
        break
      case "viewDevice":
        navigate(
          `/m/iot/device-warning-events/${event.deviceEventId ?? "dev-evt-2026082001"}?warn_id=${event.eventId}`
        )
        break
      case "publish":
        onPublish?.(event)
        break
    }
  }

  const hasReleaseAction = actions.includes("release")
  const hasDeviceAction = actions.includes("viewDevice")
  const hasPublishAction = actions.includes("publish")

  return (
    <>
      <article
        onClick={() => {
          if (batchMode) {
            if (selectable) onToggleSelect?.(event.eventId)
          } else {
            handleAction("detail")
          }
        }}
        className={`group relative overflow-hidden rounded-2xl border bg-white p-3.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer ${
          selected
            ? "border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20"
            : "border-gray-200/90 hover:border-blue-200 hover:shadow-sm"
        }`}
      >
        {/* 1. 卡片头部：预警订单 + 预警等级Tag + 预警状态Tag */}
        <div className="flex items-start justify-between gap-2 border-b border-gray-100/80 pb-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {batchMode && (
              <input
                type="checkbox"
                className="size-4 shrink-0 rounded border-gray-300 text-blue-600 accent-blue-600"
                checked={selected}
                disabled={!selectable}
                onChange={() => onToggleSelect?.(event.eventId)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-mono text-sm font-bold text-gray-900 truncate leading-snug">
                {event.orderNo}
              </h3>
              <div className="mt-0.5 text-[11px] text-gray-400 font-medium truncate">
                {event.warningType}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow-2xs"
              style={{ backgroundColor: event.severityColor }}
            >
              {event.severityCode} {event.severityName}
            </span>
            <CollateralWarningStatusBadge event={event} />
          </div>
        </div>

        {/* 2. 核心事实灰框 (#f8fafc) —— 严格对齐字段清单：来源、预警内容、预警抓拍图 */}
        <div className="mt-2.5 space-y-1.5 rounded-xl bg-[#f8fafc] p-2.5 text-xs text-gray-700 border border-slate-100/90">
          <div className="flex items-center justify-between text-[11px] gap-2">
            <span className="w-16 shrink-0 text-gray-400">来源渠道:</span>
            <span className="flex-1 text-right font-medium text-indigo-700 truncate">
              {event.warningSource}
            </span>
          </div>

          <div className="flex items-start justify-between text-[11px] gap-2 leading-relaxed">
            <span className="w-16 shrink-0 text-gray-400">预警内容:</span>
            <span className="flex-1 text-left font-medium text-gray-800 line-clamp-2">
              {event.warningContent}
            </span>
          </div>

          {/* 现场抓拍图 */}
          {event.snapshotImageStatus === "available" && (
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5 text-[11px]">
              <span className="text-gray-400">预警抓拍:</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setImagePreviewOpen(true)
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
              >
                <Camera className="size-3.5" />
                <span>查看现场抓拍图</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. 元信息行：预警时间 + 是否公示 */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-1">
            <span>预警时间:</span>
            <span className="text-gray-600 font-medium font-mono">
              {formatDateTime(event.warningTime)}
            </span>
          </div>

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

        {/* 4. 底部动作栏 —— 严格对齐规则规格 */}
        {!batchMode && (
          <PrototypeAnnotationTarget annotationIds={["collateral-warning-row-actions"]}>
            <div
              className="mt-2.5 flex items-center justify-end gap-3 border-t border-gray-100 pt-2 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              {hasReleaseAction && (
                <button
                  type="button"
                  onClick={() => handleAction("release")}
                  className="text-xs font-semibold text-[#f57c00] active:opacity-70 cursor-pointer hover:underline"
                >
                  解除预警 ▸
                </button>
              )}

              {hasDeviceAction && (
                <button
                  type="button"
                  onClick={() => handleAction("viewDevice")}
                  className="text-xs font-semibold text-[#f57c00] active:opacity-70 cursor-pointer hover:underline"
                >
                  看设备事件 ▸
                </button>
              )}

              {hasPublishAction && (
                <button
                  type="button"
                  onClick={() => handleAction("publish")}
                  className="text-xs font-semibold text-[#f57c00] active:opacity-70 cursor-pointer hover:underline"
                >
                  公示风险 ▸
                </button>
              )}

              <button
                type="button"
                onClick={() => handleAction("detail")}
                className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#f57c00] active:opacity-70 cursor-pointer hover:underline"
              >
                <span>详情 ▸</span>
              </button>
            </div>
          </PrototypeAnnotationTarget>
        )}
      </article>

      {/* 预警抓拍图弹窗 */}
      <ImagePreviewModal
        open={imagePreviewOpen}
        title={`${event.orderNo} · 预警抓拍图`}
        subTitle={formatDateTime(event.warningTime)}
        imageUrl={`mock-snapshot-${event.eventId}`}
        onClose={() => setImagePreviewOpen(false)}
      />
    </>
  )
}
