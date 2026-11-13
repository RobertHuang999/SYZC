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
import { cn } from "@/lib/utils"
import {
  DEFAULT_REJECT_POOL_FILTERS,
  type RejectPoolFilters,
} from "../domain/types"

const NEED_DILIGENCE_LABELS: Record<RejectPoolFilters["needDiligence"], string> = {
  ALL: "全部",
  YES: "是（需尽调）",
  NO: "否（免尽调）",
}

const STAGNATION_LABELS: Record<RejectPoolFilters["stagnationState"], string> = {
  ALL: "全部",
  OVERDUE: "超期未调度（大于 72 小时）",
  NORMAL: "正常（72 小时内）",
}

const REJECT_NODE_LABELS: Record<RejectPoolFilters["rejectNodeName"], string> = {
  ALL: "全部节点",
  需求线索驳回: "需求线索驳回",
  尽调风控不通过: "尽调风控不通过",
  授信资方拒绝: "授信资方拒绝",
}

const BUSINESS_STATUS_LABELS: Record<RejectPoolFilters["businessStatus"], string> = {
  ALL: "全部状态",
  APPLY_FAILED: "申请失败",
  ACCEPT_FAILED: "受理失败",
}

type RejectPoolFiltersPanelProps = {
  value: RejectPoolFilters
  onChange: (value: RejectPoolFilters) => void
  onSearch: () => void
  onReset: () => void
  extraActions?: ReactNode
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
    <div className={cn("space-y-1.5", className)}>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </div>
  )
}

export function RejectPoolFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  extraActions,
}: RejectPoolFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={() => {
            onChange({ ...DEFAULT_REJECT_POOL_FILTERS })
            onReset()
          }}
          onSearch={onSearch}
          extraActions={extraActions}
        />

        {/* 默认首行 4 列：申请单号、申请人/产品名称、需要尽调、停滞状态 */}
        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="申请单号">
            <Input
              placeholder="请输入申请单号"
              value={value.applyNo}
              onChange={(event) =>
                onChange({ ...value, applyNo: event.target.value })
              }
              onKeyDown={(event) => event.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="申请人 / 产品名称">
            <Input
              placeholder="请输入申请人或产品名称"
              value={value.keyword}
              onChange={(event) =>
                onChange({ ...value, keyword: event.target.value })
              }
              onKeyDown={(event) => event.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="需要尽调">
            <Select
              value={value.needDiligence}
              onValueChange={(next) => {
                if (!next) return
                onChange({
                  ...value,
                  needDiligence: next as RejectPoolFilters["needDiligence"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {NEED_DILIGENCE_LABELS[value.needDiligence]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部</SelectItem>
                <SelectItem value="YES">是（需尽调）</SelectItem>
                <SelectItem value="NO">否（免尽调）</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="停滞状态">
            <Select
              value={value.stagnationState}
              onValueChange={(next) => {
                if (!next) return
                onChange({
                  ...value,
                  stagnationState: next as RejectPoolFilters["stagnationState"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {STAGNATION_LABELS[value.stagnationState]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部</SelectItem>
                <SelectItem value="OVERDUE">超期未调度（大于 72 小时）</SelectItem>
                <SelectItem value="NORMAL">正常（72 小时内）</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        {/* 展开筛选：退回节点名称、融资业务状态、申请日期区间、退回日期区间 */}
        {expanded && (
          <div className="grid gap-4 border-t border-border/60 pt-4 lg:grid-cols-4">
            <FilterField label="退回节点名称">
              <Select
                value={value.rejectNodeName}
                onValueChange={(next) => {
                  if (!next) return
                  onChange({
                    ...value,
                    rejectNodeName: next as RejectPoolFilters["rejectNodeName"],
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {REJECT_NODE_LABELS[value.rejectNodeName]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部节点</SelectItem>
                  <SelectItem value="需求线索驳回">需求线索驳回</SelectItem>
                  <SelectItem value="尽调风控不通过">尽调风控不通过</SelectItem>
                  <SelectItem value="授信资方拒绝">授信资方拒绝</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="融资业务状态">
              <Select
                value={value.businessStatus}
                onValueChange={(next) => {
                  if (!next) return
                  onChange({
                    ...value,
                    businessStatus: next as RejectPoolFilters["businessStatus"],
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {BUSINESS_STATUS_LABELS[value.businessStatus]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部状态</SelectItem>
                  <SelectItem value="APPLY_FAILED">申请失败</SelectItem>
                  <SelectItem value="ACCEPT_FAILED">受理失败</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="申请日期区间">
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={value.appliedStart}
                  onChange={(event) =>
                    onChange({ ...value, appliedStart: event.target.value })
                  }
                />
                <span className="text-xs text-muted-foreground">至</span>
                <Input
                  type="date"
                  value={value.appliedEnd}
                  onChange={(event) =>
                    onChange({ ...value, appliedEnd: event.target.value })
                  }
                />
              </div>
            </FilterField>

            <FilterField label="退回日期区间">
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={value.rejectedStart}
                  onChange={(event) =>
                    onChange({ ...value, rejectedStart: event.target.value })
                  }
                />
                <span className="text-xs text-muted-foreground">至</span>
                <Input
                  type="date"
                  value={value.rejectedEnd}
                  onChange={(event) =>
                    onChange({ ...value, rejectedEnd: event.target.value })
                  }
                />
              </div>
            </FilterField>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
