import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import type { WarehouseReceipt } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { receiptH5DetailPath } from "../domain/constants"
import { ReceiptStatusPill } from "./ReceiptStatusPill"

export function ReceiptOpsHeader({
  receipt,
  hint,
}: {
  receipt: WarehouseReceipt
  hint?: string
}) {
  return (
    <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-[#232D39]/45">仓单编号</p>
          <Link
            to={receiptH5DetailPath(receipt.id)}
            className="mt-0.5 block break-all text-sm font-semibold text-[#232D39]"
          >
            {receipt.code}
          </Link>
        </div>
        <ReceiptStatusPill status={receipt.status} />
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-[#232D39]/5 pt-2.5 text-[11px]">
        <span className="truncate text-[#232D39]/50">
          货主：<span className="text-[#232D39]/80">{receipt.owner.name}</span>
        </span>
        <span className="truncate text-right text-[#232D39]/50">
          仓库：<span className="text-[#232D39]/80">{receipt.warehouseName}</span>
        </span>
        <span className="truncate text-[#232D39]/50">
          货品：<span className="text-[#232D39]/80">{receipt.goodsGroups.length} 种</span>
        </span>
        <span className="truncate text-right text-[#232D39]/50">
          批次：
          <span className="text-[#232D39]/80">
            {receipt.goodsGroups.reduce((sum, group) => sum + group.lots.length, 0)} 个
          </span>
        </span>
      </div>

      {hint ? (
        <p className="mt-2 flex items-start gap-1 rounded-lg bg-amber-50 px-2.5 py-2 text-[11px] leading-relaxed text-amber-800">
          <ChevronRight className="mt-0.5 size-3 shrink-0" />
          {hint}
        </p>
      ) : null}
    </section>
  )
}
