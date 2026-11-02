import { useState, type ReactNode } from "react"
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
import { SHARED_GOODS, SHARED_WAREHOUSES } from "@/features/shared/mock/inventory-shared-seed"
import { REPO_ROWS_MOCK, GOODS_ROWS_MOCK } from "../mock/inventory-management.mock"
import type { InventoryManagementFilters, InventoryViewMode } from "../domain/types"

interface InventoryFiltersPanelProps {
  viewMode: InventoryViewMode
  filters: InventoryManagementFilters
  onChange: (filters: InventoryManagementFilters) => void
  onReset: () => void
  onSearch: () => void
}

export function InventoryFiltersPanel({
  viewMode,
  filters,
  onChange,
  onReset,
  onSearch,
}: InventoryFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const patch = (p: Partial<InventoryManagementFilters>) => {
    onChange({
      ...filters,
      ...p,
    })
  }

  const categoryOptions = Array.from(new Set(SHARED_GOODS.map((g) => g.category)))

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        {/* 标准标杆筛选头 */}
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={onReset}
          onSearch={onSearch}
        />

        {/* 筛选项栅格：标准 lg:grid-cols-4 规范 */}
        <div className="grid gap-4 lg:grid-cols-4">
          {/* 仓库视图 */}
          {viewMode === "repo" && (
            <>
              <FilterField label="仓库名称">
                <Select
                  value={filters.warehouseName || "ALL"}
                  onValueChange={(val) =>
                    patch({ warehouseName: !val || val === "ALL" ? "" : val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="全部仓库" />
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

              <FilterField label="业务时间" className="lg:col-span-2">
                <DateRangeInput
                  start={filters.startDate}
                  end={filters.endDate}
                  onStartChange={(startDate) => patch({ startDate })}
                  onEndChange={(endDate) => patch({ endDate })}
                />
              </FilterField>

              <FilterField label="货品大类">
                <Select
                  value={filters.goodsCategory || "ALL"}
                  onValueChange={(val) =>
                    patch({ goodsCategory: !val || val === "ALL" ? "" : val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="全部大类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">全部大类</SelectItem>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>
            </>
          )}

          {/* 货物视图 */}
          {viewMode === "goods" && (
            <>
              <FilterField label="货物名称">
                <Select
                  value={filters.goodsSpec || "ALL"}
                  onValueChange={(val) =>
                    patch({ goodsSpec: !val || val === "ALL" ? "" : val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="全部货品" />
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

              <FilterField label="业务时间" className="lg:col-span-2">
                <DateRangeInput
                  start={filters.startDate}
                  end={filters.endDate}
                  onStartChange={(startDate) => patch({ startDate })}
                  onEndChange={(endDate) => patch({ endDate })}
                />
              </FilterField>

              <FilterField label="货品大类">
                <Select
                  value={filters.goodsCategory || "ALL"}
                  onValueChange={(val) =>
                    patch({ goodsCategory: !val || val === "ALL" ? "" : val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="全部大类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">全部大类</SelectItem>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>
            </>
          )}

          {/* 货主视图 */}
          {viewMode === "owner" && (
            <>
              <FilterField label="货主名称/标识">
                <Input
                  type="text"
                  placeholder="请输入货主名称/标识"
                  value={filters.ownerName}
                  onChange={(e) => patch({ ownerName: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
              </FilterField>

              <FilterField label="业务时间" className="lg:col-span-2">
                <DateRangeInput
                  start={filters.startDate}
                  end={filters.endDate}
                  onStartChange={(startDate) => patch({ startDate })}
                  onEndChange={(endDate) => patch({ endDate })}
                />
              </FilterField>

              <FilterField label="所属仓库">
                <Select
                  value={filters.warehouseName || "ALL"}
                  onValueChange={(val) =>
                    patch({ warehouseName: !val || val === "ALL" ? "" : val })
                  }
                >
                  <SelectTrigger className="w-full">
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
              </FilterField>
            </>
          )}

          {/* 展开区追加项 */}
          {expanded && (
            <>
              <FilterField label="规格型号">
                <Input
                  type="text"
                  placeholder="请输入规格型号关键字"
                  value={filters.goodsVariety}
                  onChange={(e) => patch({ goodsVariety: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
              </FilterField>

              {viewMode !== "repo" && (
                <FilterField label="仓库名称">
                  <Select
                    value={filters.warehouseName || "ALL"}
                    onValueChange={(val) =>
                      patch({ warehouseName: !val || val === "ALL" ? "" : val })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="全部仓库" />
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
            </>
          )}
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
        className="min-w-0 flex-1"
        onChange={(event) => onStartChange(event.target.value)}
      />
      <span className="shrink-0 text-muted-foreground text-xs">至</span>
      <Input
        type="date"
        value={end ? end.split(" ")[0]?.split("T")[0] : ""}
        aria-label="结束日期"
        className="min-w-0 flex-1"
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
      <Label>{label}</Label>
      {children}
    </div>
  )
}
