import { useState } from "react"
import {
  Camera,
  Cpu,
  FileSpreadsheet,
  MoreHorizontal,
  Share2,
  ShieldAlert,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ActionSheet, type ActionSheetItem } from "@/components/ui/ActionSheet"
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal"
import { formatDateTime } from "@/shared/lib/date-utils"
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
  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)

  const actions = getRowActions(event)
  const isIotPenetration = event.warningSource === "物联穿透" || Boolean(event.deviceEventId)

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

  // 构造收敛在 ActionSheet 里的更多操作项（对齐字段清单操作口径：去处理、解除预警、公示风险、详情）
  const actionSheetItems: ActionSheetItem[] = []

  if (actions.includes("publish")) {
    actionSheetItems.push({
      key: "publish",
      label: "公示风险",
      icon: <Share2 className="size-4 text-orange-600" />,
      description: "向关联资金方与监管行公示该笔风险信息",
      onClick: () => handleAction("publish"),
    })
  }

  if (actions.includes("viewDevice")) {
    actionSheetItems.push({
      key: "viewDevice",
      label: "查看设备预警信息",
      icon: <Cpu className="size-4 text-indigo-600" />,
      description: "穿透至发生告警的 IoT 硬件设备台账记录",
      onClick: () => handleAction("viewDevice"),
    })
  }

  if (actions.includes("release")) {
    actionSheetItems.push({
      key: "release",
      label: "去处理（抵质押单据）",
      icon: <ShieldAlert className="size-4 text-blue-600" />,
      description: "跳转至【抵质押单据】页面办理补保或解除流程",
      onClick: () => handleAction("release"),
    })
  }

  actionSheetItems.push({
    key: "detail",
    label: "预警详情",
    icon: <FileSpreadsheet className="size-4 text-gray-600" />,
    description: "查看预警内容、触发数据快照及系统审计日志",
    onClick: () => handleAction("detail"),
  })

  // 主按钮：去处理（抵质押单据）/ 解除预警 / 详情
  const hasReleaseAction = actions.includes("release")
  const hasDeviceAction = actions.includes("viewDevice")

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
        {/* 1. 卡片头部 (Header)：预警订单 + 预警类型 + 预警等级 + 预警状态 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
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
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              {isIotPenetration ? (
                <Cpu className="size-4 text-indigo-600" />
              ) : (
                <ShieldAlert className="size-4 text-amber-600" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-gray-900">
                  {event.orderNo}
                </span>
                <span className="rounded bg-gray-100 px-1.5 py-0.2 text-[10px] font-medium text-gray-600">
                  {event.warningType}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow-2xs"
              style={{ backgroundColor: event.severityColor }}
            >
              {event.severityCode} {event.severityName}
            </span>
            <CollateralWarningStatusBadge event={event} />
          </div>
        </div>

        {/* 2. 核心指标主体 (Body)：预警内容 + 预警抓拍图 */}
        <div className="mt-2.5 space-y-1.5 rounded-xl bg-slate-50/90 p-2.5 text-xs text-gray-700 border border-slate-100/80">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">来源渠道：</span>
            <span className="font-medium text-gray-800">
              {event.warningSource}
            </span>
          </div>

          <div className="flex items-start gap-1 text-[11px] leading-relaxed">
            <span className="w-16 shrink-0 text-gray-400">预警内容：</span>
            <span className="line-clamp-2 flex-1 font-medium text-gray-800">
              {event.warningContent}
            </span>
          </div>

          {event.snapshotImageStatus === "available" && (
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5 text-[11px]">
              <span className="text-gray-400">预警抓拍图：</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setImagePreviewOpen(true)
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 active:underline"
              >
                <Camera className="size-3.5" />
                <span>查看现场抓拍图</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. 底部经办与操作 (Footer)：预警时间 + 是否公示 + 操作 */}
        <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>🕒 {formatDateTime(event.warningTime)}</span>
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

          {!batchMode && (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {/* 高频主要操作 */}
              {hasReleaseAction ? (
                <button
                  type="button"
                  onClick={() => handleAction("release")}
                  className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-2xs active:bg-blue-700"
                >
                  去处理
                </button>
              ) : hasDeviceAction ? (
                <button
                  type="button"
                  onClick={() => handleAction("viewDevice")}
                  className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200 active:bg-indigo-100"
                >
                  看设备事件
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAction("detail")}
                  className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 active:bg-gray-200"
                >
                  详情
                </button>
              )}

              {/* 次要操作收敛于更多菜单 */}
              <button
                type="button"
                onClick={() => setActionSheetOpen(true)}
                className="flex size-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-200"
                aria-label="更多操作"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          )}
        </div>
      </article>

      {/* 底部 ActionSheet 抽屉 */}
      <ActionSheet
        open={actionSheetOpen}
        title={`${event.orderNo} 预警操作`}
        description={event.warningType}
        items={actionSheetItems}
        onClose={() => setActionSheetOpen(false)}
      />

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
