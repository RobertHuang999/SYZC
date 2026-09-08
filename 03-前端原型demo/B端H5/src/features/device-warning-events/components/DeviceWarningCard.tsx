import { useState } from "react"
import { Camera } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal"
import { formatDateTime } from "@/shared/lib/date-utils"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { canManualRelease } from "../domain/actions"
import { DEVICE_WARNING_STATUS_LABELS } from "../domain/types"
import type { DeviceWarningEvent } from "../domain/types"

type DeviceWarningCardProps = {
  event: DeviceWarningEvent
}

export function DeviceWarningCard({ event }: DeviceWarningCardProps) {
  const navigate = useNavigate()
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)

  const releaseAllowed = canManualRelease(event)

  return (
    <>
      <article
        onClick={() => navigate(`/m/iot/device-warning-events/${event.eventId}`)}
        className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer hover:border-blue-200 hover:shadow-sm"
      >
        <div className="flex items-start justify-between gap-2 border-b border-gray-100/80 pb-2.5">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-gray-900 truncate leading-snug">
              {event.ruleName}
            </h3>
            <div className="mt-0.5 text-[11px] text-gray-400 font-medium truncate">
              {event.warningType} · {event.warningSubType}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow-2xs"
              style={{ backgroundColor: event.severityColor }}
            >
              {event.severityCode} {event.severityName}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${
                event.warningStatus === "OPEN_VALID"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : event.warningStatus === "CLOSED_VALID"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {DEVICE_WARNING_STATUS_LABELS[event.warningStatus] || event.warningStatus}
            </span>
          </div>
        </div>

        <div className="mt-2.5 space-y-1.5 rounded-xl bg-[#f8fafc] p-2.5 text-xs text-gray-700 border border-slate-100/90">
          <div className="flex items-center justify-between text-[11px] gap-2">
            <span className="w-16 shrink-0 text-gray-400">设备名称:</span>
            <span className="flex-1 text-right font-medium text-gray-800 truncate">
              {event.deviceName} ({event.deviceCode})
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] gap-2">
            <span className="w-16 shrink-0 text-gray-400">所属仓库:</span>
            <span className="flex-1 text-right font-medium text-gray-800 truncate">
              {event.warehouseName || event.location}
            </span>
          </div>

          <div className="flex items-start justify-between text-[11px] gap-2 leading-relaxed">
            <span className="w-16 shrink-0 text-gray-400">预警内容:</span>
            <span className="flex-1 text-left font-medium text-gray-800 line-clamp-2">
              {event.warningContent}
            </span>
          </div>

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

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-1">
            <span>预警时间:</span>
            <span className="text-gray-600 font-medium font-mono">
              {formatDateTime(event.warningTime)}
            </span>
          </div>
        </div>

        {/* 已处置时展示处理信息合并行 */}
        {(event.processedBy || event.processedTime) && (
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center gap-1 truncate">
              <span>处理信息:</span>
              <span className="text-gray-700 font-medium truncate">
                {event.processedBy || "系统自动处理"}
              </span>
            </div>
            {event.processedTime && (
              <span className="font-mono text-[10px] text-gray-500 shrink-0">
                {formatDateTime(event.processedTime)}
              </span>
            )}
          </div>
        )}

        <PrototypeAnnotationTarget annotationIds={["device-warning-row-actions"]}>
          <div
            className="mt-2.5 flex items-center justify-end gap-3 border-t border-gray-100 pt-2 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {releaseAllowed && (
              <button
                type="button"
                onClick={() =>
                  navigate(`/m/iot/device-warning-events/${event.eventId}/release`)
                }
                className="text-xs font-semibold text-[#f57c00] active:opacity-70 cursor-pointer hover:underline"
              >
                解除 ▸
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                navigate(`/m/iot/device-warning-events/${event.eventId}`)
              }
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#f57c00] active:opacity-70 cursor-pointer hover:underline"
            >
              <span>详情 ▸</span>
            </button>
          </div>
        </PrototypeAnnotationTarget>
      </article>

      <ImagePreviewModal
        open={imagePreviewOpen}
        title={`${event.deviceName} · 现场抓拍图`}
        subTitle={formatDateTime(event.warningTime)}
        imageUrl={`mock-snapshot-${event.eventId}`}
        onClose={() => setImagePreviewOpen(false)}
      />
    </>
  )
}
