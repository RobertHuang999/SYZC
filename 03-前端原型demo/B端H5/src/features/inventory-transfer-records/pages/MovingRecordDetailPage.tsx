import { useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { ArrowRight, CheckCircle2, Clock, Copy, Check, ImageIcon } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { MobileImageModal } from "@/features/inbound-records/components/MobileImageModal"
import { MOCK_MOVING_RECORDS } from "../mock/moving-records.mock"
import {
  H5_MOVING_RECORD_LIST_PATH,
  h5MovingRecordDetailPath,
} from "../domain/constants"
import type { MovingRecordItem } from "../domain/types"

type TabKey = "goods" | "photos" | "audit"

const VALID_TABS: TabKey[] = ["goods", "photos", "audit"]

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[#232D39]/60">{label}</span>
      <span className="text-right text-[#232D39]">{value}</span>
    </div>
  )
}

export function MovingRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()

  const record: MovingRecordItem = useMemo(
    () => MOCK_MOVING_RECORDS.find((item) => item.id === id) || MOCK_MOVING_RECORDS[0],
    [id]
  )

  const [tab, setTab] = useState<TabKey>(() => {
    const fromQuery = searchParams.get("tab")
    return VALID_TABS.includes(fromQuery as TabKey) ? (fromQuery as TabKey) : "goods"
  })
  const [copied, setCopied] = useState(false)
  const [preview, setPreview] = useState<{ images: string[]; index: number } | null>(null)

  const copyId = () => {
    navigator.clipboard.writeText(record.id)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["moving-h5-detail"]}>
        <NavBar title="移库详情" backTo={H5_MOVING_RECORD_LIST_PATH} />
      </PrototypeAnnotationTarget>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-[#edf2f8] p-3 pb-8">
        {/* 摘要卡 */}
        <section className="space-y-2.5 rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#232D39]/60">移库单号</span>
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                已通过
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <p className="break-all text-base font-bold leading-tight text-[#232D39]">
                {record.id}
              </p>
              <button
                type="button"
                onClick={copyId}
                className="mt-0.5 shrink-0 text-[#232D39]/35 active:text-blue-600"
                title="复制移库单号"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
            <p className="pt-0.5 text-[11px] text-[#232D39]/50">
              制单人：{record.creatorName}（{record.creatorOrg}） {record.createTime}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-[#232D39]/5 pt-2 text-xs">
            <FieldRow label="移库时间" value={record.moveTime} />
            <FieldRow label="移库类型" value={record.moveType} />
            <FieldRow label="关联单号" value={record.relatedNo || "—"} />
            <FieldRow label="仓库名称" value={record.warehouseName} />
            <FieldRow label="货主名称" value={record.ownerName} />
            <FieldRow label="货主标识" value={record.ownerIdentifier} />
            <FieldRow label="制单人" value={`${record.creatorName}（${record.creatorOrg}）`} />
            <FieldRow label="制单时间" value={record.createTime} />
            <FieldRow label="备注信息" value={record.remark || "—"} />
          </div>
        </section>

        {/* 分页签 */}
        <div className="flex border-b border-[#232D39]/10 bg-white px-4 pt-1 shadow-xs">
          {(
            [
              ["goods", `移库货品明细 (${record.goods.length})`],
              ["photos", `现场凭证 (${record.photos.length})`],
              ["audit", "审核记录"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`min-w-0 flex-1 whitespace-nowrap py-2 text-center text-xs font-medium transition-colors ${
                tab === key
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                  : "text-[#232D39]/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 移库货品明细 */}
        {tab === "goods" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between rounded-xl border border-blue-200/60 bg-blue-50/80 px-3.5 py-2.5 text-xs text-[#232D39]/80">
              <span>
                共 {record.goods.length} 条储位明细 · {record.goodsNameSummary}
              </span>
              <span className="font-bold text-sm text-blue-600">
                {record.totalQty.toLocaleString("zh-CN", { maximumFractionDigits: 4 })}{" "}
                {record.unit}
              </span>
            </div>

            {record.goods.map((line, index) => (
              <section
                key={line.id}
                className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#232D39]">
                      {index + 1}. {line.goodsName}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#232D39]/50">
                      存货条码：{line.barcode}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block text-[10px] text-[#232D39]/45">移库数量</span>
                    <span className="font-bold text-[#232D39]">
                      {line.quantity.toLocaleString("zh-CN", { maximumFractionDigits: 4 })}{" "}
                      {line.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px]">
                  <div className="min-w-0">
                    <span className="block text-[#232D39]/45">移出位置</span>
                    <span className="text-[#232D39]">
                      {line.outLocation}
                      {line.outSpecific && line.outSpecific !== "—"
                        ? `-${line.outSpecific}`
                        : ""}
                    </span>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-blue-600" />
                  <div className="min-w-0 text-right">
                    <span className="block text-[#232D39]/45">移入位置</span>
                    <span className="text-blue-600">
                      {line.inRoomZone}
                      {line.inSpecific ? `-${line.inSpecific}` : ""}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 border-t border-dashed border-[#232D39]/10 pt-2 text-[11px]">
                  <FieldRow label="入库时间" value={line.inboundTime} />
                  <FieldRow label="其他信息" value={line.otherInfo || "-"} />
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 现场凭证 */}
        {tab === "photos" && (
          <section className="space-y-2 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
            <h3 className="flex items-center gap-1.5 font-bold text-[#232D39]">
              <ImageIcon className="size-4 text-blue-600" />
              移库现场照片
            </h3>
            {record.photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {record.photos.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    onClick={() => setPreview({ images: record.photos, index })}
                    className="aspect-square overflow-hidden rounded-lg border border-[#232D39]/10"
                  >
                    <img src={url} alt="移库现场照片" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-[#232D39]/40">暂无现场照片</p>
            )}
          </section>
        )}

        {/* 审核记录 */}
        {tab === "audit" && (
          <section className="space-y-3 rounded-xl border border-[#232D39]/10 bg-white p-3.5 text-xs shadow-xs">
            <h3 className="flex items-center gap-1.5 border-b border-[#232D39]/5 pb-2 font-bold text-[#232D39]">
              <Clock className="size-4 text-blue-600" />
              流程审批时间线
            </h3>
            <div className="relative space-y-4 pl-5 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-[#232D39]/10">
              {record.auditNodes.map((node, index) => {
                const isLast = index === record.auditNodes.length - 1
                return (
                  <div key={node.id} className="relative">
                    <div
                      className={`absolute -left-5 top-0.5 flex size-4 items-center justify-center rounded-full border-2 border-white text-[10px] text-white ${
                        isLast ? "bg-emerald-500" : "bg-blue-500"
                      }`}
                    >
                      {isLast ? <CheckCircle2 className="size-3" /> : "✓"}
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-[#232D39]">{node.title}</span>
                      <span className="shrink-0 text-[10px] text-[#232D39]/45">
                        {node.handleTime}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#232D39]/70">
                      处理人：{node.handlerName} ·{" "}
                      <span className="font-medium text-emerald-700">{node.result}</span>
                    </p>
                    {node.comment && (
                      <p className="mt-1 rounded-lg bg-[#232D39]/[0.03] p-2 text-[11px] text-[#232D39]/70">
                        意见：{node.comment}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
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
