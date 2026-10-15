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
import { INBOUND_TYPE_FILTER_OPTIONS } from "@/features/inbound-records/domain/constants"
import { InboundCascadeFilterSelect } from "@/features/inbound-records/components/InboundCascadeFilterSelect"
import type { StagingRegStatus } from "../domain/types"
import type { InboundStagingFilters } from "../domain/staging-list-types"

const STATUS_OPTIONS: Array<StagingRegStatus | "全部"> = [
  "全部",
  "待补全",
  "已转正式",
  "已作废",
]

type Props = {
  value: InboundStagingFilters
  onChange: (value: InboundStagingFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function InboundStagingFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
          onReset={onReset}
          onSearch={onSearch}
          onAdd={onAdd}
          addLabel="新增入库暂存登记"
        />

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="登记单号">
            <Input
              placeholder="请输入登记单号"
              value={value.regNo}
              onChange={(e) => onChange({ ...value, regNo: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="入库日期" className="lg:col-span-2">
            <DateRangeInput
              start={value.inboundDateStart}
              end={value.inboundDateEnd}
              onStartChange={(inboundDateStart) =>
                onChange({ ...value, inboundDateStart })
              }
              onEndChange={(inboundDateEnd) => onChange({ ...value, inboundDateEnd })}
            />
          </FilterField>

          <FilterField label="入库类型">
            <Select
              value={value.inboundType}
              onValueChange={(next) => {
                if (!next) return
                onChange({ ...value, inboundType: next })
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
                <SelectItem value="仓单入库">仓单入库</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="入库仓库">
            <InboundCascadeFilterSelect
              variant="warehouse"
              selectedKeys={value.warehouseCascadeKeys}
              onChange={(warehouseCascadeKeys) =>
                onChange({ ...value, warehouseCascadeKeys })
              }
              placeholder="全部仓库"
            />
          </FilterField>

          {expanded ? (
            <>
              <FilterField label="单据状态">
                <Select
                  value={value.status}
                  onValueChange={(next) => {
                    if (!next) return
                    onChange({ ...value, status: next as InboundStagingFilters["status"] })
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="货主/送货说明">
                <Input
                  placeholder="货主名称或临时说明"
                  value={value.ownerKeyword}
                  onChange={(e) => onChange({ ...value, ownerKeyword: e.target.value })}
                />
              </FilterField>
              <FilterField label="登记人">
                <Input
                  placeholder="登记人姓名或工号"
                  value={value.registrantKeyword}
                  onChange={(e) =>
                    onChange({ ...value, registrantKeyword: e.target.value })
                  }
                />
              </FilterField>
              <FilterField label="关联正式入库单号">
                <Input
                  placeholder="19 位正式单号"
                  value={value.relatedFormalNo}
                  onChange={(e) => onChange({ ...value, relatedFormalNo: e.target.value })}
                />
              </FilterField>
            </>
          ) : null}
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
        value={start}
        aria-label="开始日期"
        className="min-w-0 flex-1"
        onChange={(e) => onStartChange(e.target.value)}
      />
      <span className="shrink-0 text-muted-foreground">至</span>
      <Input
        type="date"
        value={end}
        aria-label="结束日期"
        className="min-w-0 flex-1"
        onChange={(e) => onEndChange(e.target.value)}
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
