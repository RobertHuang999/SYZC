import { useState, useMemo } from "react"
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Copy,
  Info,
  Layers,
  ShieldAlert,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal"
import { PublishConfirmDialog } from "@/components/ui/PublishConfirmDialog"
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
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
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
      <NavBar title={`${event.orderNo} 预警详情`} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 可滚动内容区域 */}
        <div className="flex-1 space-y-3.5 overflow-y-auto px-3.5 py-3">
          {/* 1. 基础识别字段汇总卡片 (Summary Card) */}
          <section
            className={`relative overflow-hidden rounded-2xl border p-4 shadow-xs ${
              event.severityCode === "L5"
                ? "border-rose-200 bg-gradient-to-br from-rose-50/90 via-red-50/40 to-white"
                : event.severityCode === "L4"
                ? "border-orange-200 bg-gradient-to-br from-orange-50/90 via-amber-50/30 to-white"
                : "border-blue-200 bg-gradient-to-br from-blue-50/90 via-slate-50 to-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-gray-900 tracking-wider">
                  {event.orderNo}
                </span>
                <h2 className="mt-0.5 text-base font-bold text-gray-900">
                  {event.ruleName || `${event.warningType}监控`}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="rounded px-2 py-0.5 text-xs font-bold text-white shadow-2xs"
                  style={{ backgroundColor: event.severityColor }}
                >
                  {event.severityCode} {event.severityName}
                </span>
                <CollateralWarningStatusBadge event={event} />
              </div>
            </div>

            {/* 基础识别字段 2x2 网格（严格对齐字段清单：预警订单、预警类型、预警时间、是否公示） */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-white/85 p-3 text-xs border border-gray-100 backdrop-blur-xs">
              <div>
                <span className="text-[11px] text-gray-400">预警订单</span>
                <div className="mt-0.5 font-mono font-bold text-gray-800">
                  {event.orderNo}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-gray-400">预警类型</span>
                <div className="mt-0.5 font-semibold text-gray-800">
                  {event.warningType}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-gray-400">预警时间</span>
                <div className="mt-0.5 font-medium text-gray-800">
                  {formatDateTime(event.warningTime)}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-gray-400">是否公示</span>
                <div className="mt-0.5 font-semibold text-gray-800">
                  {event.publicityStatus}
                </div>
              </div>
            </div>

            {/* 预警内容（严格对齐字段清单） */}
            <div className="mt-2.5 rounded-xl bg-white/70 p-3 text-xs text-gray-700 border border-gray-100">
              <span className="font-semibold text-gray-900">预警内容：</span>
              <p className="mt-1 leading-relaxed text-gray-800">
                {event.warningContent}
              </p>
            </div>

            {/* 预警抓拍图（严格对齐字段清单） */}
            {event.snapshotImageStatus === "available" && (
              <div className="mt-2.5 flex items-center justify-between rounded-xl bg-blue-50/80 p-2.5 text-xs text-blue-900 border border-blue-200/60">
                <div className="flex items-center gap-2">
                  <Camera className="size-4 text-blue-600" />
                  <span>预警抓拍图：现场监控已捕获</span>
                </div>
                <button
                  type="button"
                  onClick={() => setImagePreviewOpen(true)}
                  className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs active:bg-blue-700"
                >
                  查看大图
                </button>
              </div>
            )}
          </section>

          {/* 2. 订单与位置快照 / 业务链路表达 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <div className="flex size-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Layers className="size-3.5" />
              </div>
              <h3 className="text-xs font-bold text-gray-900">
                订单与位置快照
              </h3>
            </div>

            {isPenetration && event.penetrationInfo ? (
              <div className="mt-3 space-y-2 text-xs">
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-800">
                      关联设备
                    </span>
                    <span className="font-semibold text-gray-900">
                      {event.penetrationInfo.triggerDevice}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 pl-2">
                    <span>↓ 触发位置</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                      仓库位置
                    </span>
                    <span>{event.penetrationInfo.triggerLocation}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 pl-2">
                    <span>↓ 关联预警订单</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">
                      预警订单
                    </span>
                    <span className="font-mono font-bold text-blue-600">
                      {event.orderNo}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      (来源事件: {event.penetrationInfo.relatedEventNo})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-2.5 text-[11px] text-amber-900 border border-amber-200/50">
                  <div className="flex items-center gap-1.5">
                    <Info className="size-3.5 text-amber-600 shrink-0" />
                    <span>该预警源于物联网硬件告警，须在设备台账核销处置</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/m/iot/device-warning-events/${
                          event.penetrationInfo?.relatedEventId ??
                          event.deviceEventId
                        }?warn_id=${event.eventId}`
                      )
                    }
                    className="shrink-0 font-semibold text-blue-600 active:underline"
                  >
                    前往核销 ▸
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-2 text-xs">
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <div className="text-[11px] text-gray-400">触发数据快照</div>
                  <div className="mt-1 font-mono font-medium text-gray-800 leading-relaxed">
                    {event.triggerSnapshot || "系统实时监控自动捕获"}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 3. 解除预警字段（严格对齐字段清单：处理时间、处理人、情况说明、现场照片、解除预警抓拍图） */}
          {isClosed && event.disposalInfo && (
            <section className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-3.5 shadow-xs">
              <div className="flex items-center gap-2 border-b border-emerald-100 pb-2.5">
                <div className="flex size-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <h3 className="text-xs font-bold text-gray-900">解除预警记录</h3>
              </div>

              <div className="mt-3 space-y-2 text-xs text-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-gray-400">处理人</span>
                    <div className="mt-0.5 font-semibold text-gray-800">
                      {event.processedBy || "王风控（森云科技）"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400">处理时间</span>
                    <div className="mt-0.5 font-medium text-gray-800">
                      {event.processedTime
                        ? formatDateTime(event.processedTime)
                        : "2026-07-30 09:15:00"}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-100">
                  <span className="text-[11px] text-gray-400">情况说明：</span>
                  <p className="mt-1 text-gray-800 leading-relaxed">
                    {event.disposalInfo.situationDescription}
                  </p>
                </div>

                {event.disposalInfo.sitePhotos &&
                  event.disposalInfo.sitePhotos.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] text-gray-400">现场照片：</span>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {event.disposalInfo.sitePhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            onClick={() => setImagePreviewOpen(true)}
                            className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 border border-gray-200 shadow-2xs active:bg-gray-50 cursor-pointer"
                          >
                            <Camera className="size-3 text-emerald-600" />
                            <span>{photo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {event.disposalInfo.releaseSnapshotImage && (
                  <div className="pt-1 text-[11px] text-gray-600 flex items-center gap-1">
                    <span className="text-gray-400">解除预警抓拍图：</span>
                    <span className="font-mono">{event.disposalInfo.releaseSnapshotImage}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. 记录有效性/失效原因说明 */}
          {isInvalid && (
            <section className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5 text-xs text-gray-700">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2 font-bold text-gray-800">
                <AlertTriangle className="size-4 text-gray-500" />
                <span>记录有效性说明（未处理·无效）</span>
              </div>
              <p className="mt-2 leading-relaxed text-gray-600">
                {event.invalidReason || "单据已完成解押/出库、配置已变更或规则删除导致失效。"}
              </p>
            </section>
          )}

          {/* 5. 预警时间轴 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <div className="flex size-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Clock className="size-3.5" />
              </div>
              <h3 className="text-xs font-bold text-gray-900">预警流转时间轴</h3>
            </div>

            <div className="mt-3 relative pl-4 border-l-2 border-blue-100 space-y-3.5 text-xs ml-2">
              {/* 节点 1: 预警时间 */}
              <div className="relative">
                <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                <div className="font-semibold text-gray-900">
                  预警触发（{event.warningType}）
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  预警时间：{formatDateTime(event.warningTime)}
                </div>
              </div>

              {/* 节点 2: 处理时间 */}
              {isClosed ? (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="font-semibold text-gray-900">
                    完成预警解除（已处理·有效）
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    处理时间：{event.processedTime ? formatDateTime(event.processedTime) : "2026-07-30 09:15:00"} · 处理人: {event.processedBy || "系统自动处理"}
                  </div>
                </div>
              ) : isInvalid ? (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-gray-400 ring-4 ring-gray-100" />
                  <div className="font-semibold text-gray-900">
                    记录失效（未处理·无效）
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    关联订单规则或业务状态已变更
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
                  <div className="font-semibold text-amber-800">
                    待处理（未处理·有效）
                  </div>
                  <div className="text-[11px] text-amber-600 mt-0.5">
                    等待责任人或监管行办理处置流程
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 6. 系统字段与追溯字段（严格对齐字段清单：预警信息唯一标识、来源事件唯一标识、操作审计日志） */}
          <section className="rounded-2xl border border-gray-200/80 bg-slate-50/60 p-3 text-xs text-gray-500">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono">预警信息唯一标识: {event.eventId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(event.eventId)}
                className="inline-flex items-center gap-1 text-blue-600 active:underline"
              >
                <Copy className="size-3" />
                复制
              </button>
            </div>
            {event.deviceEventId && (
              <div className="mt-1 text-[11px] text-gray-500 font-mono">
                来源事件唯一标识: {event.deviceEventId}
              </div>
            )}
            <div className="mt-1 text-[10px] text-gray-400">
              数据账本: collateral_risk_ledger · 操作审计日志留痕有效
            </div>
          </section>
        </div>

        {/* 底部固定吸底操作栏 */}
        <div className="sticky bottom-0 z-20 flex items-center gap-2 border-t border-gray-200/90 bg-white/95 px-4 py-3 backdrop-blur-md shadow-lg">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200"
          >
            返回
          </button>

          {/* 操作列入口严格对齐字段清单：去处理、解除预警、公示风险 */}
          {headerActions.includes("release") && (
            <button
              type="button"
              onClick={() => {
                if (event.orderNo === "PO202608-88") {
                  showToast("您暂无相关权限，请联系相关负责人开通项目管理功能权限！")
                  return
                }
                navigate(
                  `/m/finance/pledge-orders?order=${event.orderNo}&warn_id=${event.eventId}`
                )
              }}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-blue-700"
            >
              去处理（抵质押单据）
            </button>
          )}

          {headerActions.includes("viewDevice") && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/m/iot/device-warning-events/${
                    event.penetrationInfo?.relatedEventId ??
                    event.deviceEventId ??
                    "dev-evt-2026082001"
                  }?warn_id=${event.eventId}`
                )
              }
              className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-indigo-700"
            >
              查看设备预警信息
            </button>
          )}

          {headerActions.includes("publish") && (
            <button
              type="button"
              onClick={() => setPublishOpen(true)}
              className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-orange-700"
            >
              公示风险
            </button>
          )}

          {isClosed && !headerActions.includes("publish") && (
            <button
              type="button"
              onClick={() => showToast("已导出存证报告 PDF")}
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-emerald-700"
            >
              导出存证凭证
            </button>
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
          showToast("风险公示成功，已通知相关方")
        }}
      />

      {/* 预警抓拍图预览弹窗 */}
      <ImagePreviewModal
        open={imagePreviewOpen}
        title={`${event.orderNo} · 预警抓拍图`}
        subTitle={formatDateTime(event.warningTime)}
        imageUrl={`mock-snapshot-${event.eventId}`}
        onClose={() => setImagePreviewOpen(false)}
      />

      <Toast message={toastMessage} />
    </MobileShell>
  )
}
