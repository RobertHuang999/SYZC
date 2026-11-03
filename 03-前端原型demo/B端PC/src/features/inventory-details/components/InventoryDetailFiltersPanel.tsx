import React, { useState, type ReactNode } from "react"
import { Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import {
  CREATOR_OPTIONS,
  GOODS_STATUS_OPTIONS,
  INBOUND_TYPE_OPTIONS,
} from "@/features/shared/mock/inventory-shared-seed"
import {
  GOODS_CASCADE_TREE,
  WAREHOUSE_CASCADE_TREE,
} from "@/features/shared/lib/inventory-cascade"
import { InventoryCascadeSelect } from "@/features/shared/components/InventoryCascadeSelect"
import type { InventoryDetailFilters } from "../domain/types"

interface InventoryDetailFiltersPanelProps {
  filters: InventoryDetailFilters
  onChange: (filters: InventoryDetailFilters) => void
  onReset: () => void
  onUnlock: () => void
  onSearch: () => void
  /** 与重置 / 查询同排的额外操作（导出记录、批量导出） */
  extraActions?: ReactNode
}

const LOCK_LABEL: Record<string, string> = {
  warehouse: "实体仓库",
  goods: "货品",
  owner: "存货权属方",
}

const ALL = "ALL"

export const InventoryDetailFiltersPanel: React.FC<InventoryDetailFiltersPanelProps> = ({
  filters,
  onChange,
  onReset,
  onUnlock,
  onSearch,
  extraActions,
}) => {
  const [expanded, setExpanded] = useState(false)

  const patch = (partial: Partial<InventoryDetailFilters>) => {
    onChange({ ...filters, ...partial })
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        {/* 穿透锁定提示横幅 */}
        {filters.lockedField && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <Lock className="size-4 shrink-0 text-sky-600" />
              <span>已从存货管理锁定【{LOCK_LABEL[filters.lockedField] ?? "筛选条件"}】：</span>
              <span className="rounded border border-sky-300 bg-background px-1.5 py-0.5 font-medium">
                {filters.lockedValue}
              </span>
              <span className="text-muted-foreground">（当前仅展示该主体下的具体货位明细）</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onUnlock} className="text-sky-700">
              <Unlock className="size-4" />
              解除锁定
            </Button>
          </div>
        )}

        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={onReset}
          onSearch={onSearch}
          extraActions={extraActions}
        />

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="入库单号">
            <Input
              type="text"
              placeholder="请输入入库单号"
              value={filters.inboundOrderNo}
              onChange={(e) => patch({ inboundOrderNo: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="入库日期" className="lg:col-span-2">
            <DateRange
              start={filters.inboundDateStart}
              end={filters.inboundDateEnd}
              onStartChange={(value) => patch({ inboundDateStart: value })}
              onEndChange={(value) => patch({ inboundDateEnd: value })}
              startLabel="入库开始日期"
              endLabel="入库结束日期"
            />
          </FilterField>

          <FilterField label="货主名称 / 标识" locked={filters.lockedField === "owner"}>
            <Input
              type="text"
              placeholder="请输入货主名称/标识"
              disabled={filters.lockedField === "owner"}
              value={filters.ownerKeyword}
              onChange={(e) => patch({ ownerKeyword: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </FilterField>

          {expanded && (
            <>
          <FilterField label="入库类型">
            <Select
              value={filters.inboundType || ALL}
              onValueChange={(value) => patch({ inboundType: !value || value === ALL ? "" : value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择入库类型">
                  {filters.inboundType || "全部"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部</SelectItem>
                {INBOUND_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

              <FilterField label="仓库名称" locked={filters.lockedField === "warehouse"}>
                <InventoryCascadeSelect
                  tree={WAREHOUSE_CASCADE_TREE}
                  selectedKeys={filters.warehouseKeys}
                  onChange={(keys) => patch({ warehouseKeys: keys })}
                  disabled={filters.lockedField === "warehouse"}
                  placeholder={
                    filters.lockedField === "warehouse" && filters.lockedValue
                      ? (filters.lockedValue ?? "")
                      : "请选择仓库"
                  }
                  levelHint="实体仓库 · 库房 · 分区"
                />
              </FilterField>

              <FilterField label="货品名称" locked={filters.lockedField === "goods"}>
                <InventoryCascadeSelect
                  tree={GOODS_CASCADE_TREE}
                  selectedKeys={filters.goodsKeys}
                  onChange={(keys) => patch({ goodsKeys: keys })}
                  disabled={filters.lockedField === "goods"}
                  placeholder={
                    filters.lockedField === "goods" && filters.lockedValue
                      ? (filters.lockedValue ?? "")
                      : "请选择货品"
                  }
                  levelHint="货品大类 · 品类 · 规格"
                />
              </FilterField>

              <FilterField label="货品状态">
                <Select
                  value={filters.goodsStatus || ALL}
                  onValueChange={(value) =>
                    patch({ goodsStatus: !value || value === ALL ? "" : value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择货品状态">
                      {filters.goodsStatus || "全部"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>全部</SelectItem>
                    {GOODS_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>

              <FilterField label="制单人">
                <Select
                  value={filters.creator || ALL}
                  onValueChange={(value) => patch({ creator: !value || value === ALL ? "" : value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择制单人">
                      {filters.creator || "全部"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>全部</SelectItem>
                    {CREATOR_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>

              <FilterField label="制单时间" className="lg:col-span-2">
                <DateRange
                  start={filters.createTimeStart}
                  end={filters.createTimeEnd}
                  onStartChange={(value) => patch({ createTimeStart: value })}
                  onEndChange={(value) => patch({ createTimeEnd: value })}
                  startLabel="制单开始日期"
                  endLabel="制单结束日期"
                />
              </FilterField>

              <div className="flex items-end pb-2">
                <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={filters.onlyInStock}
                    onChange={(event) => patch({ onlyInStock: event.target.checked })}
                  />
                  仅查看有库存的
                </label>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function DateRange({
  start,
  end,
  onStartChange,
  onEndChange,
  startLabel,
  endLabel,
}: {
  start: string
  end: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  startLabel: string
  endLabel: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        aria-label={startLabel}
        value={start}
        onChange={(event) => onStartChange(event.target.value)}
      />
      <span className="shrink-0 text-sm text-muted-foreground">至</span>
      <Input
        type="date"
        aria-label={endLabel}
        value={end}
        onChange={(event) => onEndChange(event.target.value)}
      />
    </div>
  )
}

function FilterField({
  label,
  children,
  className,
  locked,
}: {
  label: string
  children: ReactNode
  className?: string
  locked?: boolean
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {locked && (
          <span className="inline-flex items-center gap-0.5 text-muted-foreground">
            <Lock className="size-3" />
            锁定
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
