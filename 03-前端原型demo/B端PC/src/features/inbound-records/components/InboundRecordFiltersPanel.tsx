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
import {
  DEFAULT_INBOUND_RECORD_FILTERS,
  INBOUND_TYPE_FILTER_OPTIONS,
} from "../domain/constants"
import type { InboundRecordFilters } from "../domain/types"
import {
  inboundCreatorFilterOptions,
  inboundGoodsSpecFilterOptions,
  inboundWarehouseFilterOptions,
} from "../mock/inbound-records.mock"

type InboundRecordFiltersPanelProps = {
  value: InboundRecordFilters
  onChange: (value: InboundRecordFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function InboundRecordFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: InboundRecordFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={() => {
            onChange({ ...DEFAULT_INBOUND_RECORD_FILTERS })
            onReset()
          }}
          onSearch={onSearch}
          onAdd={onAdd}
          addLabel="新增入库"
        />

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="入库单号">
            <Input
              placeholder="请输入入库单号"
              value={value.orderNo}
              onChange={(event) =>
                onChange({ ...value, orderNo: event.target.value })
              }
              onKeyDown={(event) => event.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="货主名称/标识">
            <Input
              placeholder="请输入货主名称/标识"
              value={value.ownerKeyword}
              onChange={(event) =>
                onChange({ ...value, ownerKeyword: event.target.value })
              }
              onKeyDown={(event) => event.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="入库类型">
            <Select
              value={value.inboundType}
              onValueChange={(next) => {
                if (!next) return
                onChange({
                  ...value,
                  inboundType: next as InboundRecordFilters["inboundType"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                {INBOUND_TYPE_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="仓库名称">
            <Select
              value={value.warehouseName}
              onValueChange={(next) => {
                if (!next) return
                onChange({ ...value, warehouseName: next })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择仓库" />
              </SelectTrigger>
              <SelectContent>
                {inboundWarehouseFilterOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "全部" ? "全部仓库" : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          {expanded && (
            <>
              <FilterField label="入库日期" className="lg:col-span-2">
                <DateRangeInput
                  start={value.inboundDateStart}
                  end={value.inboundDateEnd}
                  onStartChange={(inboundDateStart) =>
                    onChange({ ...value, inboundDateStart })
                  }
                  onEndChange={(inboundDateEnd) =>
                    onChange({ ...value, inboundDateEnd })
                  }
                />
              </FilterField>

              <FilterField label="货品名称">
                <Select
                  value={value.goodsSpec}
                  onValueChange={(next) => {
                    if (!next) return
                    onChange({ ...value, goodsSpec: next })
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择货品" />
                  </SelectTrigger>
                  <SelectContent>
                    {inboundGoodsSpecFilterOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option === "全部" ? "全部货品" : option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>

              <FilterField label="制单人">
                <Select
                  value={value.creator}
                  onValueChange={(next) => {
                    if (!next) return
                    onChange({ ...value, creator: next })
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择制单人" />
                  </SelectTrigger>
                  <SelectContent>
                    {inboundCreatorFilterOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option === "全部" ? "全部制单人" : option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>

              <FilterField label="制单时间" className="lg:col-span-2">
                <DateRangeInput
                  start={value.createdAtStart}
                  end={value.createdAtEnd}
                  onStartChange={(createdAtStart) =>
                    onChange({ ...value, createdAtStart })
                  }
                  onEndChange={(createdAtEnd) =>
                    onChange({ ...value, createdAtEnd })
                  }
                />
              </FilterField>
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
      <span className="shrink-0 text-muted-foreground">至</span>
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
