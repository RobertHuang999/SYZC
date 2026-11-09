import { ArrowRight } from "lucide-react"
import type { MovingGoodsDetailVo } from "../domain/types"

interface MovingGoodsDetailModalProps {
  open: boolean
  onClose: () => void
  goodsList: MovingGoodsDetailVo[]
  transferId?: string
}

/** 移库货物明细：底部弹层（与入库货品清单同一交互，见《02-移动端列表页设计与交互规范》） */
export function MovingGoodsDetailModal({
  open,
  onClose,
  goodsList,
  transferId,
}: MovingGoodsDetailModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
      <button type="button" className="min-h-0 flex-1" aria-label="关闭" onClick={onClose} />
      <div className="max-h-[78vh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-safe pt-3">
        <p className="text-center text-sm font-medium text-[#232D39]">移库货物明细</p>
        {transferId ? (
          <p className="mt-1 text-center text-[11px] text-[#232D39]/50">{transferId}</p>
        ) : null}

        <div className="mt-3 space-y-2.5 pb-4">
          {goodsList.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rounded-lg border border-[#232D39]/10 p-3 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-[#232D39]">
                  {item.cateName}-{item.typeName}-{item.concatAttrValue}
                </span>
                {item.pledgeStatus ? (
                  <span className="shrink-0 rounded border border-[#232D39]/10 bg-[#232D39]/[0.03] px-1.5 py-0.5 text-[10px] text-[#232D39]/70">
                    {item.pledgeStatus}
                  </span>
                ) : null}
              </div>

              <p className="mt-1 text-[11px] text-[#232D39]/50">
                规格：{item.specification}
                {item.batchNo ? ` · 批次：${item.batchNo}` : ""}
              </p>

              <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-[#232D39]/[0.03] p-2.5 text-[11px]">
                <div className="min-w-0">
                  <span className="block text-[#232D39]/45">原货位</span>
                  <span className="text-[#232D39]">
                    {item.sourceHouseName}-{item.sourceZoneName}
                  </span>
                </div>
                <ArrowRight className="size-3.5 shrink-0 text-blue-600" />
                <div className="min-w-0 text-right">
                  <span className="block text-[#232D39]/45">目标货位</span>
                  <span className="text-blue-600">
                    {item.targetHouseName}-{item.targetZoneName}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[#232D39]/60">移库数量</span>
                <span className="font-medium text-[#232D39]">
                  {item.amount} {item.unit}
                  {item.weight ? `（${item.weight} ${item.weightUnit || "吨"}）` : ""}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pb-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-lg border border-[#232D39]/20 text-sm font-medium text-[#232D39] active:bg-gray-50"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
