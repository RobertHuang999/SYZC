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
  CREATOR_OPTIONS,
  DEFAULT_RELOCATION_FILTERS,
  GOODS_OPTIONS,
  RELOCATION_TYPE_FILTER_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "../domain/constants"
import type { RelocationFilters } from "../domain/types"

type Props = {
  value: RelocationFilters
  onChange: (value: RelocationFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function RelocationRecordFiltersPanel({ value, onChange, onSearch, onReset, onAdd }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onSearch={onSearch}
          onReset={onReset}
          onAdd={onAdd}
          addLabel="新增移库"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterField label="移库单号">
            <Input
              placeholder="请输入移库单号"
              value={value.id}
              onChange={(e) => onChange({ ...value, id: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="h-[34px] text-sm"
            />
          </FilterField>

          <FilterField label="移库日期">
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                value={value.moveStartDate}
                onChange={(e) => onChange({ ...value, moveStartDate: e.target.value })}
                className="h-[34px] text-sm"
              />
              <span className="shrink-0 text-xs text-slate-400">至</span>
              <Input
                type="date"
                value={value.moveEndDate}
                onChange={(e) => onChange({ ...value, moveEndDate: e.target.value })}
                className="h-[34px] text-sm"
              />
            </div>
          </FilterField>

          <FilterField label="货主名称/标识">
            <Input
              placeholder="请输入货主名称或标识"
              value={value.ownerKeyword}
              onChange={(e) => onChange({ ...value, ownerKeyword: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="h-[34px] text-sm"
            />
          </FilterField>

          <FilterField label="移库类型">
            <Select
              value={value.moveType}
              onValueChange={(val) => onChange({ ...value, moveType: val ?? "ALL" })}
            >
              <SelectTrigger className="h-[34px] text-sm">
                <SelectValue>
                  {(val) =>
                    RELOCATION_TYPE_FILTER_OPTIONS.find((item) => item.value === val)?.label ??
                    "全部类型"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {RELOCATION_TYPE_FILTER_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          {expanded && (
            <>
              <FilterField label="仓库名称">
                <Select
                  value={value.warehouseName}
                  onValueChange={(val) =>
                    onChange({ ...value, warehouseName: val ?? "ALL" })
                  }
                >
                  <SelectTrigger className="h-[34px] text-sm">
                    <SelectValue>
                      {(val) =>
                        WAREHOUSE_OPTIONS.find((item) => item.value === val)?.label ??
                        "全部仓库"
                      }
                    </SelectValue>
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

              <FilterField label="货品名称">
                <Select
                  value={value.goodsName}
                  onValueChange={(val) => onChange({ ...value, goodsName: val ?? "ALL" })}
                >
                  <SelectTrigger className="h-[34px] text-sm">
                    <SelectValue>
                      {(val) =>
                        GOODS_OPTIONS.find((item) => item.value === val)?.label ?? "全部货品"
                      }
                    </SelectValue>
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

              <FilterField label="制单人">
                <Select
                  value={value.createBy}
                  onValueChange={(val) => onChange({ ...value, createBy: val ?? "ALL" })}
                >
                  <SelectTrigger className="h-[34px] text-sm">
                    <SelectValue>
                      {(val) =>
                        CREATOR_OPTIONS.find((item) => item.value === val)?.label ??
                        "全部制单人"
                      }
                    </SelectValue>
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

              <FilterField label="制单时间" className="lg:col-span-2">
                <div className="flex items-center gap-1.5">
                  <Input
                    type="date"
                    value={value.createStartDate}
                    onChange={(e) =>
                      onChange({ ...value, createStartDate: e.target.value })
                    }
                    className="h-[34px] text-sm"
                  />
                  <span className="shrink-0 text-xs text-slate-400">至</span>
                  <Input
                    type="date"
                    value={value.createEndDate}
                    onChange={(e) => onChange({ ...value, createEndDate: e.target.value })}
                    className="h-[34px] text-sm"
                  />
                </div>
              </FilterField>
            </>
          )}
        </div>

        {expanded && (
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onChange({ ...DEFAULT_RELOCATION_FILTERS })}
            >
              清空展开条件
            </button>
          </div>
        )}
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
