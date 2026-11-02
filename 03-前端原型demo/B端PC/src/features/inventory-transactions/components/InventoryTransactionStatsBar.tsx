import React from "react"
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react"

interface InventoryTransactionStatsBarProps {
  inTotalQty: number
  inCount: number
  outTotalQty: number
  outCount: number
}

export const InventoryTransactionStatsBar: React.FC<InventoryTransactionStatsBarProps> = ({
  inTotalQty,
  inCount,
  outTotalQty,
  outCount,
}) => {
  const netQty = inTotalQty - outTotalQty

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      {/* 入库动态 */}
      <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <ArrowDownLeft className="h-3.5 w-3.5" />
            </span>
            <span>本期入库归集</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold text-emerald-950">
              +{inTotalQty.toFixed(3)}
            </span>
            <span className="text-xs text-emerald-700">吨</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-emerald-600 font-medium bg-emerald-100/70 px-2 py-0.5 rounded">
            共 {inCount} 笔入库单
          </span>
        </div>
      </div>

      {/* 出库动态 */}
      <div className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50/50 p-3.5 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
            <span>本期出库归集</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold text-rose-950">
              -{outTotalQty.toFixed(3)}
            </span>
            <span className="text-xs text-rose-700">吨</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-rose-600 font-medium bg-rose-100/70 px-2 py-0.5 rounded">
            共 {outCount} 笔出库单
          </span>
        </div>
      </div>

      {/* 净变动 */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <span>存量净变动</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className={`text-xl font-bold ${
                netQty >= 0 ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {netQty >= 0 ? `+${netQty.toFixed(3)}` : netQty.toFixed(3)}
            </span>
            <span className="text-xs text-slate-500">吨</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
            总计 {inCount + outCount} 笔流水
          </span>
        </div>
      </div>
    </div>
  )
}

