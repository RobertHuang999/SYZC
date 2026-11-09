import { useState, type ReactNode } from "react"
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
import {
  DEFAULT_TRANSFER_FILTERS,
  WAREHOUSE_OPTIONS,
  GOODS_OPTIONS,
  CREATOR_OPTIONS,
} from "../domain/constants"
import type { TransferRecordFilters } from "../domain/types"

type TransferRecordFiltersPanelProps = {
  value: TransferRecordFilters
  onChange: (value: TransferRecordFilters) => void
  onSearch: () => void
  onAdd: () => void
}

export function TransferRecordFiltersPanel({
  value,
  onChange,
  onSearch,
  onAdd,
}: TransferRecordFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={() => {
            onChange({ ...DEFAULT_TRANSFER_FILTERS })
            onSearch()
          }}
          onSearch={onSearch}
          onAdd={onAdd}
          addLabel="新增转让"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. 转让单号 */}
          <FilterField label="转让单号">
            <Input
              placeholder="请输入转让单号"
              value={value.id}
              onChange={(e) => onChange({ ...value, id: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="h-[34px] text-sm"
            />
          </FilterField>

          {/* 2. 转让日期 */}
          <FilterField label="转让日期">
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                value={value.assignStartDate}
                onChange={(e) =>
                  onChange({ ...value, assignStartDate: e.target.value })
                }
                className="h-[34px] text-sm"
                placeholder="开始日期"
              />
              <span className="text-xs text-slate-400 shrink-0">至</span>
              <Input
                type="date"
                value={value.assignEndDate}
                onChange={(e) =>
                  onChange({ ...value, assignEndDate: e.target.value })
                }
                className="h-[34px] text-sm"
                placeholder="结束日期"
              />
            </div>
          </FilterField>

          {/* 3. 货主名称/标识 */}
          <FilterField label="货主名称/标识">
            <Input
              placeholder="请输入货主名称/标识"
              value={value.keyword}
              onChange={(e) => onChange({ ...value, keyword: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="h-[34px] text-sm"
            />
          </FilterField>

          {/* 4. 仓库名称 */}
          <FilterField label="仓库名称">
            <Select
              value={value.warehouseId}
              onValueChange={(val) => onChange({ ...value, warehouseId: val ?? "" })}
            >
              <SelectTrigger className="h-[34px] text-sm w-full">
                <SelectValue>{() => WAREHOUSE_OPTIONS.find((item) => item.value === value.warehouseId)?.label ?? "全部仓库"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {WAREHOUSE_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          {expanded && (
            <>
              {/* 5. 货品名称 */}
              <FilterField label="货品名称">
                <Select
                  value={value.goodsName}
                  onValueChange={(val) => onChange({ ...value, goodsName: val ?? "" })}
                >
                  <SelectTrigger className="h-[34px] text-sm w-full">
                    <SelectValue>{() => GOODS_OPTIONS.find((item) => item.value === value.goodsName)?.label ?? "全部货品"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {GOODS_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>

              {/* 6. 制单人 */}
              <FilterField label="制单人">
                <Select
                  value={value.createBy}
                  onValueChange={(val) => onChange({ ...value, createBy: val ?? "" })}
                >
                  <SelectTrigger className="h-[34px] text-sm w-full">
                    <SelectValue>{() => CREATOR_OPTIONS.find((item) => item.value === value.createBy)?.label ?? "全部制单人"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CREATOR_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>

              {/* 7. 制单时间 */}
              <FilterField label="制单时间" className="lg:col-span-2">
                <div className="flex items-center gap-1.5">
                  <Input
                    type="date"
                    value={value.createStartDate}
                    onChange={(e) =>
                      onChange({ ...value, createStartDate: e.target.value })
                    }
                    className="h-[34px] text-sm"
                    placeholder="开始日期"
                  />
                  <span className="text-xs text-slate-400 shrink-0">至</span>
                  <Input
                    type="date"
                    value={value.createEndDate}
                    onChange={(e) =>
                      onChange({ ...value, createEndDate: e.target.value })
                    }
                    className="h-[34px] text-sm"
                    placeholder="结束日期"
                  />
                </div>
              </FilterField>
            </>
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
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <label className="text-xs font-normal text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
