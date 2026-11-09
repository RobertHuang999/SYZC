import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { cn } from "@/lib/utils"
import { SHARED_WAREHOUSES } from "@/features/shared/mock/inventory-shared-seed"
import { REPO_ROWS_MOCK, GOODS_ROWS_MOCK } from "../mock/inventory-management.mock"
import type { InventoryManagementFilters, InventoryViewMode } from "../domain/types"

interface InventoryFiltersPanelProps {
  viewMode: InventoryViewMode
  filters: InventoryManagementFilters
  onChange: (filters: InventoryManagementFilters) => void
  onReset: () => void
  onSearch: () => void
  /** 与重置 / 查询同排的额外操作（导出记录、批量导出） */
  extraActions?: ReactNode
}

export function InventoryFiltersPanel({
  viewMode,
  filters,
  onChange,
  onReset,
  onSearch,
  extraActions,
}: InventoryFiltersPanelProps) {
  const patch = (p: Partial<InventoryManagementFilters>) => {
    onChange({
      ...filters,
      ...p,
    })
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader onReset={onReset} onSearch={onSearch} extraActions={extraActions} />

        {/* 每个视图只保留两项筛选：维度 + 业务时间 */}
        <div className="grid gap-4 lg:grid-cols-4">
          {viewMode === "repo" && (
            <FilterField label="仓库名称">
              <Select
                value={filters.warehouseName || "ALL"}
                onValueChange={(val) =>
                  patch({ warehouseName: !val || val === "ALL" ? "" : val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="全部仓库">
                    {filters.warehouseName || "全部仓库"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部仓库</SelectItem>
                  {REPO_ROWS_MOCK.map((r) => (
                    <SelectItem key={r.id} value={r.warehouseName}>
                      {r.warehouseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>
          )}

          {viewMode === "goods" && (
            <FilterField label="货物名称">
              <Select
                value={filters.goodsSpec || "ALL"}
                onValueChange={(val) =>
                  patch({ goodsSpec: !val || val === "ALL" ? "" : val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="全部货品">
                    {filters.goodsSpec || "全部货品"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部货品</SelectItem>
                  {GOODS_ROWS_MOCK.map((g) => (
                    <SelectItem key={g.id} value={g.goodsName}>
                      {g.goodsName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>
          )}

          {viewMode === "owner" && (
            <FilterField label="货主名称 / 标识">
              <Input
                type="text"
                placeholder="请输入货主名称/标识"
                value={filters.ownerName}
                onChange={(e) => patch({ ownerName: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </FilterField>
          )}

          <FilterField label="业务时间" className="lg:col-span-2">
            <DateRangeInput
              start={filters.startDate}
              end={filters.endDate}
              onStartChange={(startDate) => patch({ startDate })}
              onEndChange={(endDate) => patch({ endDate })}
            />
          </FilterField>
        </div>
      </CardContent>
    </Card>
  )
}

function DateRangeInput({
  start,
  end,
  onStartChange,
  onEndChange,
}: {
  start: string
  end: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={start ? start.split(" ")[0]?.split("T")[0] : ""}
        aria-label="开始日期"
        onChange={(event) => onStartChange(event.target.value)}
      />
      <span className="shrink-0 text-sm text-muted-foreground">至</span>
      <Input
        type="date"
        value={end ? end.split(" ")[0]?.split("T")[0] : ""}
        aria-label="结束日期"
        onChange={(event) => onEndChange(event.target.value)}
      />
    </div>
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
      <span className="text-xs font-normal text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
