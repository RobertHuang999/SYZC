import { useState, useMemo } from "react"
import {
  Camera,
  Copy,
  ShieldAlert,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal"
import { PublishConfirmDialog } from "@/components/ui/PublishConfirmDialog"
import { SectionCard } from "@/components/ui/SectionCard"
import { Toast } from "@/components/ui/Toast"
import { formatDateTime } from "@/shared/lib/date-utils"
import { getDetailHeaderActions } from "../domain/actions"
import { WARNING_STATUS } from "../domain/types"
import { CollateralWarningStatusBadge } from "../components/CollateralWarningStatusBadge"
import { getCollateralWarningById } from "../lib/detail-utils"

export function CollateralWarningDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [publishOpen, setPublishOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)

  const [allExpanded, setAllExpanded] = useState(true)

  const event = useMemo(() => getCollateralWarningById(id), [id])
  const headerActions = useMemo(
    () => (event ? getDetailHeaderActions(event) : ["back"]),
    [event]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text)
    showToast(`已复制: ${text}`)
  }

  if (!event) {
    return (
      <MobileShell>
        <NavBar title="押品预警详情" />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-sm text-gray-500">
          <ShieldAlert className="size-12 text-gray-300 mb-2" />
          <p>未找到对应的押品预警记录</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
          >
            返回上一页
          </button>
        </div>
      </MobileShell>
    )
  }

  const isPenetration = event.warningSource === "物联穿透" || Boolean(event.deviceEventId)
  const isClosed = event.warningStatus === WARNING_STATUS.CLOSED_VALID
  const isInvalid = event.warningStatus === WARNING_STATUS.OPEN_INVALID

  return (
    <MobileShell>
      <NavBar
        title={`${event.orderNo} 预警详情`}
        right={
          <button
            type="button"
            onClick={() => setAllExpanded((prev) => !prev)}
            className="text-xs font-medium text-blue-600 active:opacity-70 cursor-pointer"
          >
            {allExpanded ? "全部收起" : "全部展开"}
          </button>
        }
      />

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-[#f4f6f8]">
        {/* 可滚动内容区域 */}
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pb-6 overscroll-contain">
          {/* 1. 预警基本事实摘要（严格对齐字段清单第一章） */}
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
                  <button
                    type="button"
                    onClick={() => copyToClipboard(event.orderNo)}
                    className="text-gray-400 hover:text-blue-600 cursor-pointer"
                    title="复制单号"
                  >
                    <Copy className="size-3" />
                  </button>
                </div>
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
                <span className="flex-1 text-right text-gray-800 font-medium">
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
                <span className="flex-1 text-right text-gray-800 font-mono">
                  {formatDateTime(event.warningTime)}
                </span>
              </div>

              <div className="border-t border-gray-100/80 pt-2">
                <span className="text-gray-500">预警内容:</span>
                <p className="mt-1 rounded-xl bg-slate-50 p-2.5 leading-relaxed text-gray-800 border border-slate-100/90 font-normal">
                  {event.warningContent}
                </p>
              </div>

              {event.snapshotImageStatus === "available" && (
                <div className="mt-1 flex items-center justify-between rounded-xl bg-blue-50/70 p-2.5 text-xs text-blue-900 border border-blue-100">
                  <div className="flex items-center gap-1.5">
                    <Camera className="size-4 text-blue-600" />
                    <span>现场监控抓拍图已留痕存证</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImagePreviewOpen(true)}
                    className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs active:bg-blue-700 cursor-pointer"
                  >
                    查看抓拍
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* 2. 物联穿透关联字段（仅穿透类展示，严格对齐字段清单第二章） */}
          {isPenetration && (
            <SectionCard
              title="物联穿透关联设备信息"
              indicatorColor="#6366f1"
              collapsed={!allExpanded}
              extra={
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/m/iot/device-warning-events/${event.deviceEventId ?? "dev-evt-2026082001"}?warn_id=${event.eventId}`
                    )
                  }
                  className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200 active:bg-indigo-100 cursor-pointer"
                >
                  看设备事件 ▸
                </button>
              }
            >
              <div className="space-y-2 text-xs">
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

                <div className="flex items-center justify-between">
                  <span className="w-24 shrink-0 text-gray-500">触发位置:</span>
                  <span className="flex-1 text-right text-gray-800">
                    {event.penetrationInfo?.triggerLocation || "一号钢材仓 / A库 / 01分区"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="w-24 shrink-0 text-gray-500">关联设备事件ID:</span>
                  <span className="flex-1 text-right font-mono text-gray-700">
                    {event.deviceEventId || "dev-evt-2026082001"}
                  </span>
                </div>
              </div>
            </SectionCard>
          )}

          {/* 3. 触发数据快照（严格对齐字段清单第四章：触发数据快照） */}
          <SectionCard
            title="触发数据快照"
            indicatorColor="#f57c00"
            defaultCollapsed={true}
            collapsed={!allExpanded}
          >
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-start justify-between">
                <span className="w-20 shrink-0 text-gray-500">快照指标:</span>
                <span className="flex-1 text-right font-medium text-gray-900">
                  {event.triggerSnapshot || "抵/质押物价值下跌突破预警阈值 12.0%"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="w-20 shrink-0 text-gray-500">单据类型:</span>
                <span className="flex-1 text-right text-gray-800">
                  {event.orderType || "抵/质押订单"}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* 4. 处置与核销信息（严格对齐字段清单第三章：解除预警表单字段） */}
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
                  <span className="flex-1 text-right font-medium text-gray-800 font-mono">
                    {event.processedTime ? formatDateTime(event.processedTime) : "—"}
                  </span>
                </div>

                {event.disposalInfo?.situationDescription && (
                  <div className="border-t border-gray-100 pt-2">
                    <span className="text-gray-500">情况说明:</span>
                    <p className="mt-1 rounded-xl bg-slate-50 p-2.5 leading-relaxed text-gray-800 border border-slate-100 font-normal">
                      {event.disposalInfo.situationDescription}
                    </p>
                  </div>
                )}

                {event.disposalInfo?.sitePhotos && event.disposalInfo.sitePhotos.length > 0 && (
                  <div className="border-t border-gray-100 pt-2">
                    <span className="text-gray-500">现场照片:</span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {event.disposalInfo.sitePhotos.map((photo, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImagePreviewOpen(true)}
                          className="flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-gray-700 border border-gray-200 active:bg-gray-100 cursor-pointer"
                        >
                          <Camera className="size-3 text-emerald-600" />
                          <span>{photo}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {event.disposalInfo?.releaseSnapshotImage && (
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[11px]">
                    <span className="text-gray-500">解除预警抓拍图:</span>
                    <span className="font-mono text-gray-700">
                      {event.disposalInfo.releaseSnapshotImage}
                    </span>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* 5. 记录有效性/失效说明（仅未处理无效展示） */}
          {isInvalid && event.invalidReason && (
            <SectionCard
              title="记录失效说明"
              indicatorColor="#ef4444"
              collapsed={!allExpanded}
            >
              <div className="rounded-xl bg-rose-50/70 p-2.5 text-xs text-rose-900 border border-rose-200">
                <span className="font-semibold">失效原因: </span>
                <span>{event.invalidReason}</span>
              </div>
            </SectionCard>
          )}
        </div>

        {/* 底部页内动作区（严格对齐 Demo 规格 §2.5） */}
        <div className="border-t border-gray-200/90 bg-white px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200 cursor-pointer"
            >
              返回列表
            </button>

            {headerActions.includes("publish") && (
              <button
                type="button"
                onClick={() => setPublishOpen(true)}
                className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-orange-700 cursor-pointer"
              >
                公示风险 ▸
              </button>
            )}

            {headerActions.includes("viewDevice") && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/m/iot/device-warning-events/${event.deviceEventId ?? "dev-evt-2026082001"}?warn_id=${event.eventId}`
                  )
                }
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-indigo-700 cursor-pointer"
              >
                看设备事件 ▸
              </button>
            )}

            {headerActions.includes("release") && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/m/finance/pledge-orders?order=${event.orderNo}&warn_id=${event.eventId}`
                  )
                }
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-blue-700 cursor-pointer"
              >
                解除预警 ▸
              </button>
            )}
          </div>

          {isPenetration && !isClosed && (
            <div className="mt-2 text-[10px] text-gray-400 text-center">
              💡 须在设备预警信息现场核销后自动联动解除；本页无解除预警入口
            </div>
          )}
        </div>
      </div>

      {/* 公示确认弹窗 */}
      <PublishConfirmDialog
        open={publishOpen}
        events={[event]}
        onClose={() => setPublishOpen(false)}
        onConfirm={() => {
          setPublishOpen(false)
          showToast("公示成功，已向关联机构同步风险报告")
        }}
      />

      {/* 预警抓拍图预览弹窗 */}
      <ImagePreviewModal
        open={imagePreviewOpen}
        title={`${event.orderNo} · 现场抓拍图`}
        subTitle={formatDateTime(event.warningTime)}
        imageUrl={`mock-snapshot-${event.eventId}`}
        onClose={() => setImagePreviewOpen(false)}
      />

      <Toast message={toastMessage} />
    </MobileShell>
  )
}
