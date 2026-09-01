import { useState, useMemo } from "react"
import {
  Camera,
  Cpu,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal"
import { SectionCard } from "@/components/ui/SectionCard"
import { formatDateTime } from "@/shared/lib/date-utils"
import { canManualRelease } from "../domain/actions"
import { DEVICE_WARNING_STATUS_LABELS } from "../domain/types"
import { getDeviceWarningById } from "../mock/device-warning-events.mock"

export function DeviceWarningEventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = useMemo(() => getDeviceWarningById(id), [id])
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [allExpanded, setAllExpanded] = useState(true)

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
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
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
      <NavBar
        title={event.ruleName}
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
          {/* 1. 页头摘要信息（严格对齐字段清单第一章） */}
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
            }
          >
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="w-24 shrink-0 text-gray-500">规则名称:</span>
                <span className="flex-1 text-right font-bold text-gray-900">
                  {event.ruleName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="w-24 shrink-0 text-gray-500">预警类型:</span>
                <span className="flex-1 text-right font-medium text-indigo-700">
                  {event.warningType} · {event.warningSubType}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="w-24 shrink-0 text-gray-500">关联设备:</span>
                <span className="flex-1 text-right font-medium text-gray-800">
                  {event.deviceName} ({event.deviceCode})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="w-24 shrink-0 text-gray-500">所属仓库:</span>
                <span className="flex-1 text-right text-gray-800">
                  {event.warehouseName}（{event.location}）
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="w-24 shrink-0 text-gray-500">首次预警时间:</span>
                <span className="flex-1 text-right text-gray-700 font-mono">
                  {formatDateTime(event.firstWarningTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="w-24 shrink-0 text-gray-500">最近预警时间:</span>
                <span className="flex-1 text-right font-medium text-gray-900 font-mono">
                  {formatDateTime(event.latestWarningTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="w-24 shrink-0 text-gray-500">预警次数:</span>
                <span className="flex-1 text-right font-bold text-orange-700">
                  ⚡ {event.triggerCount} 次
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
                    <span>现场监控抓拍图已捕获</span>
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

          {/* 2. 预警触发流水（严格对齐字段清单：触发历史时间轴明细） */}
          <SectionCard
            title="预警触发历史时间轴"
            indicatorColor="#f57c00"
            collapsed={!allExpanded}
            extra={
              <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200">
                累计 {event.triggerCount} 次触发
              </span>
            }
          >
            <div className="relative pl-4 space-y-3.5 border-l-2 border-orange-200 ml-1.5 my-1 text-xs">
              {event.triggerHistory.map((time, index) => (
                <div key={`${time}-${index}`} className="relative">
                  <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">
                      第 {event.triggerHistory.length - index} 次告警触发
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">{time}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    预警子类型: {event.warningSubType} · 防抖合并留痕
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 3. 处置与解除信息（严格对齐字段清单第二章：解除预警表单字段） */}
          {(isClosed || event.processing.processedTime) && (
            <SectionCard
              title="处置与解除信息"
              indicatorColor="#00a870"
              collapsed={!allExpanded}
            >
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="w-24 shrink-0 text-gray-500">处理人:</span>
                  <span className="flex-1 text-right font-medium text-gray-800">
                    {event.processing.processedBy || "系统自动处理"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="w-24 shrink-0 text-gray-500">处理时间:</span>
                  <span className="flex-1 text-right font-medium text-gray-800 font-mono">
                    {event.processing.processedTime
                      ? formatDateTime(event.processing.processedTime)
                      : "—"}
                  </span>
                </div>

                {event.processing.situationDescription && (
                  <div className="border-t border-gray-100 pt-2">
                    <span className="text-gray-500">情况说明:</span>
                    <p className="mt-1 rounded-xl bg-slate-50 p-2.5 leading-relaxed text-gray-800 border border-slate-100">
                      {event.processing.situationDescription}
                    </p>
                  </div>
                )}

                {event.processing.sitePhotos && event.processing.sitePhotos.length > 0 && (
                  <div className="border-t border-gray-100 pt-2">
                    <span className="text-gray-500">现场照片:</span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {event.processing.sitePhotos.map((photo, idx) => (
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

                {event.processing.releaseSnapshotImage && (
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[11px]">
                    <span className="text-gray-500">解除预警抓拍图:</span>
                    <span className="font-mono text-gray-700">
                      {event.processing.releaseSnapshotImage}
                    </span>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* 4. 规则配置快照（严格对齐字段清单第三章：规则配置快照） */}
          <SectionCard
            title="规则配置快照"
            indicatorColor="#6366f1"
            defaultCollapsed={true}
            collapsed={!allExpanded}
          >
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-start justify-between">
                <span className="w-20 shrink-0 text-gray-500">监控阈值:</span>
                <span className="flex-1 text-right font-medium text-gray-900">
                  {event.ruleSnapshot.monitorThreshold}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="w-20 shrink-0 text-gray-500">防抖条件:</span>
                <span className="flex-1 text-right text-gray-700">
                  {event.ruleSnapshot.debounceCondition}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="w-20 shrink-0 text-gray-500">升级策略:</span>
                <span className="flex-1 text-right text-gray-700">
                  {event.ruleSnapshot.upgradeStrategy}
                </span>
              </div>
            </div>
          </SectionCard>
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

            {releaseAllowed ? (
              <button
                type="button"
                onClick={() =>
                  navigate(`/m/iot/device-warning-events/${event.eventId}/release`)
                }
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-blue-700 cursor-pointer"
              >
                解除预警 ▸
              </button>
            ) : isOpenValid ? (
              <div className="flex-1 rounded-xl bg-amber-50 px-2 py-2 text-center text-[11px] text-amber-800 border border-amber-200">
                💡 该类型预警由系统自动恢复，不支持人工解除
              </div>
            ) : (
              <div className="flex-1 rounded-xl bg-slate-100 py-2 text-center text-xs text-gray-500">
                预警已归档
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 预警抓拍图预览弹窗 */}
      <ImagePreviewModal
        open={imagePreviewOpen}
        title={`${event.deviceName} · 现场抓拍图`}
        subTitle={formatDateTime(event.latestWarningTime)}
        imageUrl={`mock-snapshot-${event.eventId}`}
        onClose={() => setImagePreviewOpen(false)}
      />
    </MobileShell>
  )
}
