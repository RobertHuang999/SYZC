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
  DEFAULT_OUTBOUND_RECORD_FILTERS,
  OUTBOUND_TYPE_FILTER_OPTIONS,
} from "../domain/constants"
import type { OutboundRecordFilters } from "../domain/types"

interface OutboundRecordFiltersPanelProps {
  value: OutboundRecordFilters
  onChange: (value: OutboundRecordFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

const WAREHOUSE_OPTIONS = [
  "全部",
  "海霸王仓库",
  "生鲜冷链仓库",
  "农产品监管仓库",
  "青白江国际陆港监管仓",
]

const GOODS_OPTIONS = [
  "全部",
  "有色金属-电解铜-国标",
  "黑色金属-热轧卷板-Q235",
  "有色金属-铝锭-A00",
  "农产品-白砂糖-一级白砂糖",
]

const CREATOR_OPTIONS = ["全部", "lxy", "赵强", "张三", "李四", "王仓管"]

export function OutboundRecordFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: OutboundRecordFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const patch = (p: Partial<OutboundRecordFilters>) => {
    onChange({ ...value, ...p })
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={() => {
            onChange({ ...DEFAULT_OUTBOUND_RECORD_FILTERS })
            onReset()
          }}
          onSearch={onSearch}
          onAdd={onAdd}
          addLabel="新增出库"
        />

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="出库单号">
            <Input
              placeholder="请输入出库单号"
              value={value.orderNo}
              onChange={(e) => patch({ orderNo: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="货主名称/标识">
            <Input
              placeholder="请输入货主名称/标识"
              value={value.ownerKeyword}
              onChange={(e) => patch({ ownerKeyword: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="出库类型">
            <Select
              value={value.type}
              onValueChange={(next) => {
                if (!next) return
                patch({ type: next as OutboundRecordFilters["type"] })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                {OUTBOUND_TYPE_FILTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label === "全部" ? "全部类型" : opt.label}
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
                patch({ warehouseName: next })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择仓库" />
              </SelectTrigger>
              <SelectContent>
                {WAREHOUSE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt === "全部" ? "全部仓库" : opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          {expanded && (
            <>
              <FilterField label="出库日期" className="lg:col-span-2">
                <DateRangeInput
                  start={value.outboundStartDate}
                  end={value.outboundEndDate}
                  onStartChange={(outboundStartDate) =>
                    patch({ outboundStartDate })
                  }
                  onEndChange={(outboundEndDate) => patch({ outboundEndDate })}
                />
              </FilterField>

              <FilterField label="货物名称">
                <Select
                  value={value.goodsName}
                  onValueChange={(next) => {
                    if (!next) return
                    patch({ goodsName: next })
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择货品" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOODS_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt === "全部" ? "全部货品" : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>

              <FilterField label="制单人">
                <Select
                  value={value.createdBy}
                  onValueChange={(next) => {
                    if (!next) return
                    patch({ createdBy: next })
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择制单人" />
                  </SelectTrigger>
                  <SelectContent>
                    {CREATOR_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt === "全部" ? "全部制单人" : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>

              <FilterField label="制单时间" className="lg:col-span-2">
                <DateRangeInput
                  start={value.createStartDate}
                  end={value.createEndDate}
                  onStartChange={(createStartDate) =>
                    patch({ createStartDate })
                  }
                  onEndChange={(createEndDate) => patch({ createEndDate })}
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
