import React, { useState } from "react"
import { Search, RotateCcw, ChevronDown, ChevronUp, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SHARED_WAREHOUSES, SHARED_OWNERS } from "@/features/shared/mock/inventory-shared-seed"
import type { InventoryTransactionFilters } from "../domain/types"

interface InventoryTransactionFiltersPanelProps {
  filters: InventoryTransactionFilters
  onChange: (filters: InventoryTransactionFilters) => void
  onReset: () => void
  onUnlock: () => void
  onSearch: () => void
}

export const InventoryTransactionFiltersPanel: React.FC<InventoryTransactionFiltersPanelProps> = ({
  filters,
  onChange,
  onReset,
  onUnlock,
  onSearch,
}) => {
  const [expanded, setExpanded] = useState(false)

  const handleFieldChange = (field: keyof InventoryTransactionFilters, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    })
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm mb-4">
      {/* 穿透锁定提示横幅 */}
      {filters.lockedField && (
        <div className="flex items-center justify-between bg-sky-50 border border-sky-200 rounded-md px-3 py-2 text-xs text-sky-800 mb-3">
          <div className="flex items-center gap-1.5 font-medium">
            <Lock className="h-4 w-4 text-sky-600 shrink-0" />
            <span>
              已从存货管理锁定【
              {filters.lockedField === "warehouse"
                ? "实体仓库"
                : filters.lockedField === "goods"
                ? "货品规格"
                : "存货权属方"}
              】：
            </span>
            <strong className="text-sky-900 bg-white/80 px-1.5 py-0.5 rounded border border-sky-300">
              {filters.lockedValue}
            </strong>
            <span className="text-slate-500 font-normal">（当前仅汇总呈现该主体名下出入库流水）</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onUnlock}
            className="h-6 px-2 text-xs text-sky-700 hover:text-sky-900 hover:bg-sky-100 gap-1"
          >
            <Unlock className="h-3 w-3" />
            解除锁定
          </Button>
        </div>
      )}

      {/* 默认前 4 项栅格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* 1. 业务开始日期 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">业务开始日期</label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFieldChange("startDate", e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        {/* 2. 业务结束日期 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">业务结束日期</label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFieldChange("endDate", e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        {/* 3. 流向类型 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">流向类型</label>
          <Select
            value={filters.direction}
            onValueChange={(val) =>
              handleFieldChange("direction", !val ? "ALL" : (val as "ALL" | "IN" | "OUT"))
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="全部流向" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部流向 (入库+出库)</SelectItem>
              <SelectItem value="IN">入库流水 (增加)</SelectItem>
              <SelectItem value="OUT">出库流水 (扣减)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 4. 监管仓库（若锁定则 disabled） */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-600">实体监管仓库</label>
            {filters.lockedField === "warehouse" && (
              <span className="text-[10px] text-sky-600 flex items-center gap-0.5">
                <Lock className="h-2.5 w-2.5" /> 锁定
              </span>
            )}
          </div>
          <Select
            disabled={filters.lockedField === "warehouse"}
            value={filters.warehouseName || "ALL"}
            onValueChange={(val) =>
              handleFieldChange("warehouseName", !val || val === "ALL" ? "" : val)
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="全部仓库" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部仓库</SelectItem>
              {SHARED_WAREHOUSES.map((wh) => (
                <SelectItem key={wh.id} value={wh.name}>
                  {wh.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 展开区域：细分业务类型、单据编号、货品、货主 */}
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center mt-3 pt-3 border-t border-slate-100">
          {/* 5. 细分业务类型 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">细分业务类型</label>
            <Select
              value={filters.businessType || "ALL"}
              onValueChange={(val) =>
                handleFieldChange("businessType", !val || val === "ALL" ? "" : val)
              }
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部细分类型</SelectItem>
                <SelectItem value="普通入库">普通入库</SelectItem>
                <SelectItem value="采购入库">采购入库</SelectItem>
                <SelectItem value="质押入库">质押入库</SelectItem>
                <SelectItem value="加工入库">加工入库</SelectItem>
                <SelectItem value="提货出库">提货出库</SelectItem>
                <SelectItem value="移库出库">移库出库</SelectItem>
                <SelectItem value="平仓出库">平仓处置出库</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 6. 单据编号 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">关联单据编号</label>
            <Input
              type="text"
              placeholder="输入单据号搜索"
              value={filters.orderNo}
              onChange={(e) => handleFieldChange("orderNo", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* 7. 规格搜索 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">货品规格</label>
              {filters.lockedField === "goods" && (
                <span className="text-[10px] text-sky-600 flex items-center gap-0.5">
                  <Lock className="h-2.5 w-2.5" /> 锁定
                </span>
              )}
            </div>
            <Input
              disabled={filters.lockedField === "goods"}
              type="text"
              placeholder="输入规格型号搜索"
              value={filters.goodsSpec}
              onChange={(e) => handleFieldChange("goodsSpec", e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* 8. 权属货主 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">权属货主</label>
              {filters.lockedField === "owner" && (
                <span className="text-[10px] text-sky-600 flex items-center gap-0.5">
                  <Lock className="h-2.5 w-2.5" /> 锁定
                </span>
              )}
            </div>
            <Select
              disabled={filters.lockedField === "owner"}
              value={filters.ownerName || "ALL"}
              onValueChange={(val) =>
                handleFieldChange("ownerName", !val || val === "ALL" ? "" : val)
              }
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="全部货主" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部货主</SelectItem>
                {SHARED_OWNERS.map((own) => (
                  <SelectItem key={own.id} value={own.name}>
                    {own.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* 底部按钮栏 */}
      <div className="flex items-center justify-between mt-3 pt-2">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary flex items-center gap-1 hover:underline cursor-pointer"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              收起筛选
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              展开高级筛选
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重置
          </Button>
          <Button
            size="sm"
            onClick={onSearch}
            className="h-8 text-xs gap-1 bg-primary text-white"
          >
            <Search className="h-3.5 w-3.5" />
            查询
          </Button>
        </div>
      </div>
    </div>
  )
}

