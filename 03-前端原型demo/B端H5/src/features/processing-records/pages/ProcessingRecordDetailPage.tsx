import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import {
  ArrowRight,
  Camera,
  Check,
  Clock,
  Copy,
  Factory,
  Package,
  QrCode,
  ShieldCheck,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { MobileImageModal } from "@/features/inbound-records/components/MobileImageModal"
import { MOCK_PROCESSING_RECORDS } from "../mock/processing-records.mock"
import {
  PROCESSING_LIST_ROUTE,
  PROCESSING_STATUS_MAP,
  PROCESSING_TYPE_MAP,
  formatMoney,
  formatQty,
} from "../domain/constants"
import type { ProcessingRecord } from "../domain/types"

type TabKey = "photos" | "input" | "output" | "audit" | "modify"

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "photos", label: "凭证与附件" },
  { key: "input", label: "投入货物" },
  { key: "output", label: "产出货物" },
  { key: "audit", label: "审核记录" },
  { key: "modify", label: "修改记录" },
]

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[#232D39]/60">{label}</span>
      <span className="text-right text-[#232D39]">{value}</span>
    </div>
  )
}

function sumPlanInput(record: ProcessingRecord) {
  return record.inputGroups.reduce(
    (sum, group) => sum + group.lines.reduce((lineSum, line) => lineSum + line.planAmount, 0),
    0
  )
}

function sumActualInput(record: ProcessingRecord) {
  return record.inputGroups.reduce(
    (sum, group) =>
      sum + group.lines.reduce((lineSum, line) => lineSum + (line.actualAmount ?? 0), 0),
    0
  )
}

function sumExpectedOutput(record: ProcessingRecord) {
  return record.outputItems.reduce((sum, output) => sum + output.expectedQty, 0)
}

function sumActualOutput(record: ProcessingRecord) {
  return record.outputItems.reduce((sum, output) => sum + (output.actualQty ?? 0), 0)
}

export function ProcessingRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const record = useMemo(
    () => MOCK_PROCESSING_RECORDS.find((item) => item.id === id) ?? MOCK_PROCESSING_RECORDS[0],
    [id]
  )
  const [tab, setTab] = useState<TabKey>("photos")
  const [copied, setCopied] = useState(false)
  const [preview, setPreview] = useState<{ images: string[]; index: number } | null>(null)

  const status = PROCESSING_STATUS_MAP[record.status]
  const isCompleted = record.status === "COMPLETED"
  const unit = record.inputGroups[0]?.unit ?? record.outputItems[0]?.unit ?? ""
  const inputSummary = record.inputGroups
    .map((group) => group.goodsName.replace(/^.*-/, ""))
    .join("、")
  const outputSummary = record.outputItems
    .map((output) => output.goodsName.replace(/^.*-/, ""))
    .join("、")

  const handleCopy = () => {
    navigator.clipboard.writeText(record.id)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["processing-h5-detail"]}>
        <NavBar title="加工单详情" backTo={PROCESSING_LIST_ROUTE} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-8">
        {/* 摘要卡 */}
        <section className="space-y-2.5 rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#232D39]/60">加工单号</span>
              <span className={`rounded border px-2 py-0.5 text-xs font-medium ${status.badgeClass}`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <p className="break-all text-base font-bold leading-tight text-[#232D39]">
                {record.id}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-0.5 shrink-0 text-[#232D39]/35 active:text-blue-600"
                title="复制加工单号"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
            <p className="pt-0.5 text-[11px] text-[#232D39]/50">
              制单人：{record.createByName}
              {record.createOrgName ? `（${record.createOrgName}）` : ""} {record.createTime}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-[#232D39]/5 pt-2 text-xs">
            <FieldRow label="货主名称" value={record.ownerName} />
            <FieldRow label="货主标识" value={record.ownerIdentity} />
            <FieldRow label="加工日期" value={record.processingTime} />
            <FieldRow label="加工类型" value={PROCESSING_TYPE_MAP[record.processingType]} />
            <FieldRow label="所属仓库" value={record.warehouseName} />
            <FieldRow
              label="关联融资单号"
              value={
                record.associatedOrderId ? (
                  <span className="font-medium text-blue-600">{record.associatedOrderId}</span>
                ) : (
                  "—"
                )
              }
            />
            <FieldRow
              label="单据业务状态"
              value={
                <span className={`inline-flex rounded border px-1.5 py-0.5 text-[11px] font-medium ${status.badgeClass}`}>
                  {status.label}
                </span>
              }
            />
            <FieldRow label="加工原因" value={record.remark || "—"} />
            {isCompleted && (
              <>
                <FieldRow
                  label="加工损耗比例"
                  value={typeof record.lossRatio === "number" ? `${record.lossRatio}%` : "—"}
                />
                <FieldRow label="损耗原因" value={record.lossReason || "—"} />
              </>
            )}
          </div>
        </section>

        {/* 加工流转链路：投入原料 ➔ 加工转化 ➔ 产出成品 */}
        <section className="space-y-2 rounded-xl border border-blue-200/60 bg-blue-50/70 p-3.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#232D39]">
            <Factory className="size-4 text-blue-600" />
            加工流转链路
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <div className="min-w-0 flex-1 rounded-lg bg-white/80 p-2">
              <span className="block text-[#232D39]/45">投入原料</span>
              <span className="mt-0.5 block truncate font-medium text-[#232D39]">
                {inputSummary || "—"}
              </span>
              <span className="mt-0.5 block text-[#232D39]/60">
                {isCompleted
                  ? `${formatQty(sumActualInput(record))} ${unit}`
                  : `${formatQty(sumPlanInput(record))} ${unit}`}
              </span>
            </div>
            <div className="flex shrink-0 flex-col items-center text-blue-600">
              <ArrowRight className="size-4" />
              <span className="mt-0.5 whitespace-nowrap text-[10px]">
                加工{isCompleted && typeof record.lossRatio === "number"
                  ? ` · 损耗 ${record.lossRatio}%`
                  : ""}
              </span>
            </div>
            <div className="min-w-0 flex-1 rounded-lg bg-white/80 p-2 text-right">
              <span className="block text-[#232D39]/45">产出成品</span>
              <span className="mt-0.5 block truncate font-medium text-[#232D39]">
                {outputSummary || "—"}
              </span>
              <span className="mt-0.5 block text-[#232D39]/60">
                {isCompleted
                  ? `${formatQty(sumActualOutput(record))} ${unit}`
                  : `${formatQty(sumExpectedOutput(record))} ${unit}`}
              </span>
            </div>
          </div>
          {!isCompleted && (
            <p className="text-[11px] leading-relaxed text-[#232D39]/55">
              计划数量仅供现场核对；实际消耗、释放余量与产出条码在完成加工登记后回写。
            </p>
          )}
        </section>

        {/* 分页签 */}
        <div className="flex border-b border-[#232D39]/10 bg-white px-2 pt-1 shadow-xs">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`min-w-0 flex-1 whitespace-nowrap py-2 text-center text-xs font-medium transition-colors ${
                tab === item.key
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-[#232D39]/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 投入货物 */}
        {tab === "input" && (
          <div className="space-y-2.5">
            {record.inputGroups.map((group, groupIndex) => (
              <section
                key={group.id}
                className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#232D39]/5 pb-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#232D39]">{group.goodsName}</h3>
                    <p className="mt-0.5 text-[11px] text-[#232D39]/50">
                      规格：{group.specModel}
                    </p>
                  </div>
                  <span className="shrink-0 rounded bg-[#232D39]/[0.04] px-1.5 py-0.5 text-[10px] text-[#232D39]/60">
                    投入货物
                  </span>
                </div>

                {group.lines.map((line, lineIndex) => (
                  <div
                    key={line.id}
                    className="space-y-1.5 rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px]"
                  >
                    <FieldRow
                      label="序号"
                      value={`${groupIndex + 1}.${lineIndex + 1}`}
                    />
                    <FieldRow
                      label="货物位置"
                      value={line.roomZone}
                    />
                    <FieldRow
                      label="具体位置"
                      value={line.specificLocation || "—"}
                    />
                    <FieldRow label="入库时间" value={line.inboundTime} />
                    <FieldRow label="存货条码" value={line.barcode} />
                    <FieldRow label="扩展信息" value={line.otherInfo || "—"} />
                    <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-[#232D39]/10 pt-1.5">
                      <span className="text-[#232D39]/60">计划投入</span>
                      <span className="font-bold text-[#232D39]">
                        {formatQty(line.planAmount)} {line.unit}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-t border-dashed border-[#232D39]/10 pt-1.5">
                      <div>
                        <span className="block text-[#232D39]/45">实际消耗</span>
                        <span className="font-semibold text-[#232D39]">
                          {isCompleted
                            ? `${formatQty(line.actualAmount)} ${line.unit}`
                            : "—"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[#232D39]/45">释放数量</span>
                        <span className="font-semibold text-emerald-600">
                          {isCompleted
                            ? `${formatQty(line.releasedAmount)} ${line.unit}`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}

        {/* 产出货物 */}
        {tab === "output" && (
          <div className="space-y-2.5">
            {record.outputItems.map((output, outputIndex) => (
              <section
                key={output.id}
                className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#232D39]">{output.goodsName}</h3>
                    <p className="mt-0.5 text-[11px] text-[#232D39]/50">
                      规格：{output.specModel}
                    </p>
                  </div>
                  <span className="shrink-0 rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">
                    产出货物
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px]">
                  <div className="col-span-2">
                    <span className="block text-[#232D39]/45">序号</span>
                    <span className="font-semibold text-[#232D39]">{outputIndex + 1}</span>
                  </div>
                  <div>
                    <span className="block text-[#232D39]/45">预计数量</span>
                    <span className="font-semibold text-[#232D39]">
                      {formatQty(output.expectedQty)} {output.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[#232D39]/45">实际数量</span>
                    <span className="font-semibold text-[#232D39]">
                      {isCompleted
                        ? `${formatQty(output.actualQty)} ${output.unit}`
                        : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#232D39]/45">行业参考价</span>
                    <span className="text-[#232D39]">{formatMoney(output.price)}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[#232D39]/45">入库位置</span>
                    <span className="text-[#232D39]">
                      {output.warehouseLocation}
                      {output.specificLocation ? ` · ${output.specificLocation}` : ""}
                    </span>
                  </div>
                </div>

                {output.collectAttrs && output.collectAttrs.length > 0 && (
                  <div className="space-y-1 text-[11px]">
                    <span className="text-[#232D39]/45">扩展属性 (动态采集)</span>
                    {output.collectAttrs.map((attr) => (
                      <FieldRow
                        key={attr.label}
                        label={attr.label}
                        value={`${attr.value ?? "—"}${attr.unit ? ` ${attr.unit}` : ""}`}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 border-t border-dashed border-[#232D39]/10 pt-2 text-[11px]">
                  <span className="flex items-center gap-1 text-[#232D39]/45">
                    <QrCode className="size-3.5" />
                    新存货条码
                  </span>
                  <span className="flex items-center gap-1 font-medium text-[#232D39]">
                    {isCompleted && output.barcode ? output.barcode : "—"}
                  </span>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 审核记录 */}
        {tab === "audit" && (
          <section className="space-y-3 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
            <h3 className="flex items-center gap-1.5 border-b border-[#232D39]/5 pb-2 font-bold text-[#232D39]">
              <ShieldCheck className="size-4 text-blue-600" />
              审批流转记录
            </h3>
            <div className="relative space-y-4 pl-5 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-[#232D39]/10">
              {(record.auditNodes ?? []).length === 0 && (
                <p className="py-4 text-center text-[11px] text-[#232D39]/40">
                  暂无审核历史记录
                </p>
              )}
              {(record.auditNodes ?? []).map((node) => (
                <div key={node.id} className="relative">
                  <div
                    className={`absolute -left-5 top-1 size-3 rounded-full border-2 border-white shadow-xs ${
                      node.status === "REJECTED"
                        ? "bg-rose-500"
                        : node.status === "PENDING"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-[#232D39]">{node.nodeName}</span>
                    <span className="shrink-0 text-[10px] text-[#232D39]/45">
                      {node.handleTime}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#232D39]/70">
                    处理人：{node.handlerName}
                    {node.handlerOrg ? `（${node.handlerOrg}）` : ""}
                  </p>
                  {node.comment && (
                    <p className="mt-1 rounded-lg bg-[#232D39]/[0.03] p-2 text-[11px] text-[#232D39]/70">
                      意见：{node.comment}
                    </p>
                  )}
                  {node.taskId && (
                    <p className="mt-1 text-[11px] font-medium text-blue-600">
                      查看通用审批中心任务详情 ›
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 修改记录 */}
        {tab === "modify" && (
          <section className="space-y-3 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
            <h3 className="flex items-center gap-1.5 border-b border-[#232D39]/5 pb-2 font-bold text-[#232D39]">
              <Clock className="size-4 text-blue-600" />
              修改与作废记录
            </h3>
            {record.modifyRecord ? (
              <div className="space-y-1.5">
                <FieldRow
                  label="记录类型"
                  value={
                    record.modifyRecord.type === "COMPLETED"
                      ? "现场完成加工入库"
                      : "单据授权作废"
                  }
                />
                <FieldRow label="操作人" value={record.modifyRecord.operatorName} />
                {record.modifyRecord.operatorOrg && (
                  <FieldRow label="所属机构" value={record.modifyRecord.operatorOrg} />
                )}
                <FieldRow label="操作时间" value={record.modifyRecord.operateTime} />
                {record.modifyRecord.type === "COMPLETED" && (
                  <>
                    <FieldRow
                      label="加工损耗比例"
                      value={
                        typeof record.modifyRecord.lossRatio === "number"
                          ? `${record.modifyRecord.lossRatio}%`
                          : "—"
                      }
                    />
                    <FieldRow
                      label="损耗原因说明"
                      value={record.modifyRecord.lossReason || "—"}
                    />
                  </>
                )}
                {record.modifyRecord.type === "VOIDED" && (
                  <FieldRow
                    label="作废原因说明"
                    value={record.modifyRecord.voidReason || "—"}
                  />
                )}
              </div>
            ) : (
              <p className="py-6 text-center text-[#232D39]/40">
                该单据尚未完成加工或作废，暂无最终审计记录
              </p>
            )}
          </section>
        )}

        {/* 凭证与附件 */}
        {tab === "photos" && (
          <section className="space-y-2.5 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
            <h3 className="flex items-center gap-1.5 font-bold text-[#232D39]">
              <Camera className="size-4 text-blue-600" />
              现场设备抓拍图
            </h3>
            {record.devicePhotos && record.devicePhotos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {record.devicePhotos.map((photo, index) => {
                  const images = record.devicePhotos
                    ?.filter((item) => item.status === "SUCCESS" && item.url)
                    .map((item) => item.url as string)
                  return photo.status === "SUCCESS" && photo.url ? (
                    <button
                      key={photo.deviceId + index}
                      type="button"
                      onClick={() =>
                        setPreview({
                          images: images ?? [],
                          index: Math.max(0, (images ?? []).indexOf(photo.url as string)),
                        })
                      }
                      className="space-y-1 text-center"
                    >
                      <img
                        src={photo.url}
                        alt={photo.deviceName}
                        className="size-24 rounded-lg border border-[#232D39]/10 object-cover"
                      />
                      <span className="block max-w-24 truncate text-[10px] text-[#232D39]/50">
                        {photo.deviceName}
                      </span>
                    </button>
                  ) : (
                    <div
                      key={photo.deviceId + index}
                      className="flex size-24 flex-col items-center justify-center rounded-lg bg-[#232D39]/[0.04] px-1 text-center text-[10px] text-[#232D39]/45"
                    >
                      <Camera className="mb-1 size-5" />
                      抓图失败或无监控设备
                      <span className="mt-1 truncate">{photo.deviceName}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="flex items-center gap-1.5 text-[11px] text-[#232D39]/45">
                <Package className="size-3.5" />
                抓图失败或无监控设备
              </p>
            )}
          </section>
        )}
      </div>

      <MobileImageModal
        open={preview !== null}
        images={preview?.images ?? []}
        initialIndex={preview?.index ?? 0}
        onClose={() => setPreview(null)}
      />
    </MobileShell>
  )
}
