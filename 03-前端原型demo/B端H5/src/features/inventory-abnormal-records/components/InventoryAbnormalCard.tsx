import { useState } from "react"
import { ArrowRight, Package } from "lucide-react"
import { RecordCard, RecordCardMetricRow } from "@/shared/components/RecordCard"
import type { AbnormalGoodsLine, AbnormalRecord } from "../domain/types"
import { h5AbnormalRecordDetailPath } from "../domain/constants"

interface InventoryAbnormalCardProps {
  item: AbnormalRecord
}

/** 数量统一按最多 3 位小数展示 */
function formatQty(value: number): string {
  return value.toLocaleString("zh-CN", { maximumFractionDigits: 3 })
}

function diffText(line: AbnormalGoodsLine): string {
  if (line.diffQty > 0) {
    return `↑ +${formatQty(line.diffQty)}${line.unit}`
  }
  if (line.diffQty < 0) {
    return `↓ ${formatQty(line.diffQty)}${line.unit}`
  }
  return "无差额"
}

export function InventoryAbnormalCard({ item }: InventoryAbnormalCardProps) {
  const [goodsOpen, setGoodsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const firstLine = item.goodsLines[0]
  const goodsSummary =
    item.goodsLines.length > 1
      ? `${firstLine.goodsName} 等 ${item.goodsLines.length} 项`
      : firstLine.goodsName

  const handleCopy = () => {
    navigator.clipboard.writeText(item.id)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <RecordCard
      orderNo={item.id}
      detailTo={h5AbnormalRecordDetailPath(item.id)}
      typeLabel={item.relateOrderType}
      statusLabel="已生效归档"
      statusTone="emerald"
      ownerName={item.owner.ownerName}
      ownerIdentifier={item.owner.ownerIdentity}
      person={item.applicantName}
      time={item.applyTime}
      metrics={
        <>
          <RecordCardMetricRow label="关联单据" value={item.relateId} />
          <RecordCardMetricRow
            label="异动货品"
            value={goodsSummary}
            onClick={() => setGoodsOpen(true)}
          />
          <RecordCardMetricRow
            label="异动前后"
            value={
              <span className="inline-flex items-center gap-1">
                <span>
                  {formatQty(firstLine.beforeQty)}
                  {firstLine.unit}
                </span>
                <ArrowRight className="size-3 shrink-0 text-[#232D39]/40" />
                <span className="font-semibold">
                  {formatQty(firstLine.afterQty)}
                  {firstLine.unit}
                </span>
                <span
                  className={
                    firstLine.diffQty > 0
                      ? "text-rose-600"
                      : firstLine.diffQty < 0
                        ? "text-emerald-600"
                        : "text-[#232D39]/50"
                  }
                >
                  {diffText(firstLine)}
                </span>
              </span>
            }
          />
          <RecordCardMetricRow label="仓库位置" value={firstLine.location} />
        </>
      }
      actions={[
        {
          key: "detail",
          label: "查看详情",
          to: h5AbnormalRecordDetailPath(item.id),
        },
        {
          key: "copy",
          label: copied ? "已复制" : "复制单号",
          onClick: handleCopy,
        },
      ]}
    >
      {goodsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#232D39]/10 pb-2">
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#232D39]">
                <Package className="size-4 text-blue-600" />
                <span>调账货品明细</span>
              </div>
              <button
                type="button"
                className="text-xs text-[#232D39]/50"
                onClick={() => setGoodsOpen(false)}
              >
                关闭
              </button>
            </div>
            <div className="max-h-[50vh] space-y-2 overflow-y-auto py-3">
              {item.goodsLines.map((line) => (
                <div
                  key={line.id}
                  className="rounded-lg border border-[#232D39]/8 bg-[#232D39]/[0.02] p-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0 font-semibold text-[#232D39]">
                      {line.goodsName}
                    </span>
                    <span className="shrink-0 rounded-full border border-[#232D39]/10 bg-white px-1.5 py-0.5 text-[10px] text-[#232D39]/70">
                      {line.abnormalType}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#232D39]/70">
                    <span>
                      {formatQty(line.beforeQty)}
                      {line.unit}
                    </span>
                    <ArrowRight className="size-3 text-[#232D39]/40" />
                    <span className="font-semibold text-[#232D39]">
                      {formatQty(line.afterQty)}
                      {line.unit}
                    </span>
                    <span
                      className={
                        line.diffQty > 0
                          ? "font-medium text-rose-600"
                          : line.diffQty < 0
                            ? "font-medium text-emerald-600"
                            : "text-[#232D39]/50"
                      }
                    >
                      {diffText(line)}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-[11px] text-[#232D39]/45">
                    {line.location}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setGoodsOpen(false)}
              className="w-full rounded-xl bg-blue-600 py-2 text-xs font-medium text-white active:bg-blue-700"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

    </RecordCard>
  )
}
