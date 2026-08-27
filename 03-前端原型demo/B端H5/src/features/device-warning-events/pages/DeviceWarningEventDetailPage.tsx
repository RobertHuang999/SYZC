import { useState, useMemo } from "react"
import {
  Camera,
  CheckCircle2,
  Copy,
  Cpu,
  Layers,
  Shield,
  Zap,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal"
import { Toast } from "@/components/ui/Toast"
import { formatDateTime } from "@/shared/lib/date-utils"
import { canManualRelease } from "../domain/actions"
import { DEVICE_WARNING_STATUS_LABELS } from "../domain/types"
import { getDeviceWarningById } from "../mock/device-warning-events.mock"

export function DeviceWarningEventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = useMemo(() => getDeviceWarningById(id), [id])
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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
        <NavBar title="设备预警详情" />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-sm text-gray-500">
          <Cpu className="size-12 text-gray-300 mb-2" />
          <p>未找到对应的设备预警记录</p>
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

  const releaseAllowed = canManualRelease(event)
  const isClosed = event.warningStatus === "CLOSED_VALID"
  const isOpenValid = event.warningStatus === "OPEN_VALID"

  return (
    <MobileShell>
      <NavBar title={`${event.ruleName} 详情`} />

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
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono text-slate-700">
                    {event.deviceCode}
                  </span>
                  <span className="text-xs text-gray-500">
                    {event.warningType}
                  </span>
                </div>
                <h2 className="mt-1 text-base font-bold text-gray-900">
                  {event.ruleName}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="rounded px-2 py-0.5 text-xs font-bold text-white shadow-2xs"
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
                  {DEVICE_WARNING_STATUS_LABELS[event.warningStatus]}
                </span>
              </div>
            </div>

            {/* 基础识别字段 2x2 网格（严格对齐字段清单：预警规则名称、预警类型、预警时间、设备与位置快照） */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-white/85 p-3 text-xs border border-gray-100 backdrop-blur-xs">
              <div>
                <span className="text-[11px] text-gray-400">设备名称</span>
                <div className="mt-0.5 font-semibold text-gray-800">
                  {event.deviceName}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-gray-400">预警类型 / 子类型</span>
                <div className="mt-0.5 font-semibold text-gray-800">
                  {event.warningType} · {event.warningSubType}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-gray-400">仓库位置</span>
                <div className="mt-0.5 text-gray-800 truncate">
                  {event.location}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-gray-400">预警时间</span>
                <div className="mt-0.5 font-medium text-gray-800">
                  {formatDateTime(event.latestWarningTime)}
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

          {/* 2. 设备与位置快照 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <div className="flex size-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Layers className="size-3.5" />
              </div>
              <h3 className="text-xs font-bold text-gray-900">设备与位置快照</h3>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-800">
                    设备名称
                  </span>
                  <span className="font-semibold text-gray-900">
                    {event.deviceName}（设备编码: {event.deviceCode}）
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 pl-2">
                  <span>↓ 仓库位置</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                    位置快照
                  </span>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 pl-2">
                  <span>↓ 预警规则名称</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                    预警规则名称
                  </span>
                  <span className="font-semibold text-gray-900">{event.ruleName}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. 预警触发历史流水（防抖留痕） */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Zap className="size-3.5" />
                </div>
                <h3 className="text-xs font-bold text-gray-900">
                  预警触发流水（累计 {event.triggerCount} 次）
                </h3>
              </div>
              <span className="text-[10px] text-gray-400">同轮次防抖合并</span>
            </div>

            <div className="mt-3 relative pl-4 border-l-2 border-orange-100 space-y-3 text-xs ml-2">
              {event.triggerHistory.map((time, index) => (
                <div key={`${time}-${index}`} className="relative">
                  <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      第 {event.triggerHistory.length - index} 次触发
                    </span>
                    <span className="text-[11px] text-gray-400">{time}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    预警子类型: {event.warningSubType} · 状态有效
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. 解除预警字段（严格对齐字段清单：处理时间、处理人、情况说明、现场照片、解除预警抓拍图） */}
          {isClosed && event.processing.processedTime && (
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
                      {event.processing.processedBy || "系统自动处理"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400">处理时间</span>
                    <div className="mt-0.5 font-medium text-gray-800">
                      {formatDateTime(event.processing.processedTime)}
                    </div>
                  </div>
                </div>

                {event.processing.situationDescription && (
                  <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-100">
                    <span className="text-[11px] text-gray-400">情况说明：</span>
                    <p className="mt-1 text-gray-800 leading-relaxed">
                      {event.processing.situationDescription}
                    </p>
                  </div>
                )}

                {event.processing.sitePhotos && event.processing.sitePhotos.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] text-gray-400">现场照片：</span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {event.processing.sitePhotos.map((photo, idx) => (
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

                {event.processing.releaseSnapshotImage && (
                  <div className="pt-1 text-[11px] text-gray-600 flex items-center gap-1">
                    <span className="text-gray-400">解除预警抓拍图：</span>
                    <span className="font-mono">{event.processing.releaseSnapshotImage}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 5. 触发数据快照（严格对齐字段清单） */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <div className="flex size-6 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Shield className="size-3.5" />
              </div>
              <h3 className="text-xs font-bold text-gray-900">触发数据快照</h3>
            </div>

            <div className="mt-2.5 space-y-2 text-xs text-gray-700">
              <div className="flex items-start justify-between">
                <span className="text-gray-400">监控阈值：</span>
                <span className="font-medium text-gray-800 text-right">
                  {event.ruleSnapshot.monitorThreshold}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-400">防抖条件：</span>
                <span className="text-gray-700 text-right">
                  {event.ruleSnapshot.debounceCondition}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-400">升级策略：</span>
                <span className="text-gray-700 text-right">
                  {event.ruleSnapshot.upgradeStrategy}
                </span>
              </div>
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
            <div className="mt-1 text-[10px] text-gray-400">
              数据账本: iot_event_ledger · Version {event.version} · 操作审计日志留痕有效
            </div>
          </section>
        </div>

        {/* 底部吸底操作栏 */}
        <div className="sticky bottom-0 z-20 flex items-center gap-2 border-t border-gray-200/90 bg-white/95 px-4 py-3 backdrop-blur-md shadow-lg">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200"
          >
            返回
          </button>

          {releaseAllowed ? (
            <button
              type="button"
              onClick={() =>
                navigate(`/m/iot/device-warning-events/${event.eventId}/release`)
              }
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-blue-700"
            >
              解除预警
            </button>
          ) : isOpenValid ? (
            <div className="flex-1 rounded-xl bg-slate-100 py-2 text-center text-xs text-gray-500">
              该类型预警由系统自动恢复，不展示人工解除表单
            </div>
          ) : (
            <button
              type="button"
              onClick={() => showToast("已导出设备告警存证凭证")}
              className="flex-1 rounded-xl bg-gray-900 py-2.5 text-xs font-bold text-white shadow-xs active:bg-gray-800"
            >
              导出存证日志
            </button>
          )}
        </div>
      </div>

      {/* 预警抓拍图大图预览弹窗 */}
      <ImagePreviewModal
        open={imagePreviewOpen}
        title={`${event.deviceName} · 预警抓拍图`}
        subTitle={formatDateTime(event.latestWarningTime)}
        imageUrl={`mock-snapshot-${event.eventId}`}
        onClose={() => setImagePreviewOpen(false)}
      />

      <Toast message={toastMessage} />
    </MobileShell>
  )
}
