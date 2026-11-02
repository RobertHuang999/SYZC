import React, { useState } from "react"
import { Search, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SHARED_WAREHOUSES, SHARED_GOODS, SHARED_OWNERS } from "@/features/shared/mock/inventory-shared-seed"
import type { TallyStackingFilters } from "../domain/types"

interface TallyFiltersPanelProps {
  filters: TallyStackingFilters
  onChange: (filters: TallyStackingFilters) => void
  onReset: () => void
  onSearch: () => void
}

export const TallyFiltersPanel: React.FC<TallyFiltersPanelProps> = ({
  filters,
  onChange,
  onReset,
  onSearch,
}) => {
  const [expanded, setExpanded] = useState(false)

  const handleFieldChange = (field: keyof TallyStackingFilters, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    })
  }

  const categoryOptions = Array.from(new Set(SHARED_GOODS.map((g) => g.category)))

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm mb-4">
      {/* 默认前 4 项 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* 1. 入库单号 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">源头入库单号</label>
          <Input
            type="text"
            placeholder="输入入库单号检索"
            value={filters.inboundOrderNo}
            onChange={(e) => handleFieldChange("inboundOrderNo", e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        {/* 2. 监管仓库 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">实体监管仓库</label>
          <Select
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

        {/* 3. 货品大类 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">货品大类</label>
          <Select
            value={filters.goodsCategory || "ALL"}
            onValueChange={(val) =>
              handleFieldChange("goodsCategory", !val || val === "ALL" ? "" : val)
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="全部大类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部大类</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. 存货权属货主 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">权属货主</label>
          <Select
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

      {/* 展开项 */}
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center mt-3 pt-3 border-t border-slate-100">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">规格/牌号搜索</label>
            <Input
              type="text"
              placeholder="输入规格型号搜索"
              value={filters.goodsSpec}
              onChange={(e) => handleFieldChange("goodsSpec", e.target.value)}
              className="h-9 text-xs"
            />
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

