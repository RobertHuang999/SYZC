import React, { useState, type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { cn } from "@/lib/utils"
import { SHARED_WAREHOUSES, SHARED_GOODS, SHARED_OWNERS } from "@/features/shared/mock/inventory-shared-seed"
import type { TallyStackingFilters } from "../domain/types"

interface TallyFiltersPanelProps {
  filters: TallyStackingFilters
  onChange: (filters: TallyStackingFilters) => void
  onReset: () => void
  onSearch: () => void
  /** 与重置 / 查询同排的额外操作（导出记录、批量导出） */
  extraActions?: ReactNode
}

export const TallyFiltersPanel: React.FC<TallyFiltersPanelProps> = ({
  filters,
  onChange,
  onReset,
  onSearch,
  extraActions,
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
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={onReset}
          onSearch={onSearch}
          extraActions={extraActions}
        />

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="源头入库单号">
            <Input
              type="text"
              placeholder="请输入入库单号"
              value={filters.inboundOrderNo}
              onChange={(e) => handleFieldChange("inboundOrderNo", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="实体监管仓库">
            <Select
              value={filters.warehouseName || "ALL"}
              onValueChange={(val) =>
                handleFieldChange("warehouseName", !val || val === "ALL" ? "" : val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="全部仓库">
                  {filters.warehouseName || "全部仓库"}
                </SelectValue>
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
          </FilterField>

          <FilterField label="货品大类">
            <Select
              value={filters.goodsCategory || "ALL"}
              onValueChange={(val) =>
                handleFieldChange("goodsCategory", !val || val === "ALL" ? "" : val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="全部大类">
                  {filters.goodsCategory || "全部大类"}
                </SelectValue>
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
          </FilterField>

          <FilterField label="权属货主">
            <Select
              value={filters.ownerName || "ALL"}
              onValueChange={(val) =>
                handleFieldChange("ownerName", !val || val === "ALL" ? "" : val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="全部货主">
                  {filters.ownerName || "全部货主"}
                </SelectValue>
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
          </FilterField>

          {expanded && (
            <FilterField label="规格 / 牌号">
              <Input
                type="text"
                placeholder="请输入规格型号"
                value={filters.goodsSpec}
                onChange={(e) => handleFieldChange("goodsSpec", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </FilterField>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function FilterField({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}
