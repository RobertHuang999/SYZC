import React from "react"
import { AlertCircle, Building2, Package, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface InventoryMetricCardsProps {
  viewMode: "repo" | "goods" | "owner"
}

export const InventoryMetricCards: React.FC<InventoryMetricCardsProps> = ({ viewMode }) => {
  // 总价卡片
  const TotalPriceCard = (
    <div className="relative overflow-hidden rounded-md border border-sky-100 bg-[#f4f9ff] p-4 shadow-xs h-[88px] flex flex-col justify-between">
      <div className="pointer-events-none absolute right-4 -bottom-4 text-7xl font-bold text-sky-200/40 select-none">
        ¥
      </div>
      <div className="text-xs text-slate-500">总价</div>
      <div className="flex items-center gap-1.5 z-10">
        <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          19,753.8750万元
        </span>
        <Tooltip>
          <TooltipTrigger>
            <div className="text-amber-500 cursor-help">
              <AlertCircle className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-white text-xs">
            当前存在未定价特种物资（稀有金属-航空钛合金棒材-TC4-X），货值暂未计入总价
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )

  // 货品种类卡片
  const VarietyCard = (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs h-[88px] flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-rose-500 text-white">
          <Package className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs text-slate-600">货品种类(个)</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 text-center tracking-tight">
        8
      </div>
    </div>
  )

  // 仓库数量卡片
  const WarehouseCard = (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs h-[88px] flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-amber-500 text-white">
          <Building2 className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs text-slate-600">仓库数量(个)</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 text-center tracking-tight">
        7
      </div>
    </div>
  )

  // 货主数量卡片
  const OwnerCard = (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-xs h-[88px] flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-white">
          <Users className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs text-slate-600">货主数量(位)</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 text-center tracking-tight">
        7
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* 仓库视图展示 3 个卡片（总价占 2 列，或者前 3 个） */}
      {viewMode === "repo" && (
        <>
          <div className="lg:col-span-2">{TotalPriceCard}</div>
          <div>{VarietyCard}</div>
          <div>{WarehouseCard}</div>
        </>
      )}

      {/* 货物视图展示 4 个卡片 */}
      {viewMode === "goods" && (
        <>
          <div>{TotalPriceCard}</div>
          <div>{VarietyCard}</div>
          <div>{WarehouseCard}</div>
          <div>{OwnerCard}</div>
        </>
      )}

      {/* 货主视图展示 4 个卡片，货主数量排在第 2 位（100% 对齐截图） */}
      {viewMode === "owner" && (
        <>
          <div>{TotalPriceCard}</div>
          <div>{OwnerCard}</div>
          <div>{VarietyCard}</div>
          <div>{WarehouseCard}</div>
        </>
      )}
    </div>
  )
}
