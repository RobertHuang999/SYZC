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
  DEFAULT_ONLINE_PLEDGE_FILTERS,
  type OnlinePledgeFilters,
} from "../domain/types"

const STATUS_LABELS: Record<OnlinePledgeFilters["financingStatus"], string> = {
  ALL: "全部状态",
  CREDIT_SUCCESS: "申请成功",
  IN_PROCESSING: "处理中",
  LOAN_DISBURSED: "已放款",
  SETTLED: "已结清",
}

const NEED_DILIGENCE_LABELS: Record<OnlinePledgeFilters["needDiligence"], string> = {
  ALL: "全部",
  YES: "是（需尽调）",
  NO: "否（免尽调）",
}

const COLLATERAL_LABELS: Record<OnlinePledgeFilters["collateralType"], string> = {
  ALL: "全部类型",
  INVENTORY: "现货存货",
  WAREHOUSE_RECEIPT: "数字仓单",
}

const APPLICANT_TYPE_LABELS: Record<OnlinePledgeFilters["applicantType"], string> = {
  ALL: "全部主体",
  ENTERPRISE: "企业货主",
  INDIVIDUAL: "个人货主",
}

type OnlinePledgeFiltersPanelProps = {
  value: OnlinePledgeFilters
  onChange: (value: OnlinePledgeFilters) => void
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

export function OnlinePledgeFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  extraActions,
}: OnlinePledgeFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={() => {
            onChange({ ...DEFAULT_ONLINE_PLEDGE_FILTERS })
            onReset()
          }}
          onSearch={onSearch}
          extraActions={extraActions}
        />

        {/* 默认首行 4 列：申请单号、申请人/产品名称、融资状态、需要尽调 */}
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

          <FilterField label="融资状态">
            <Select
              value={value.financingStatus}
              onValueChange={(next) => {
                if (!next) return
                onChange({
                  ...value,
                  financingStatus: next as OnlinePledgeFilters["financingStatus"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{STATUS_LABELS[value.financingStatus]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部状态</SelectItem>
                <SelectItem value="CREDIT_SUCCESS">申请成功</SelectItem>
                <SelectItem value="IN_PROCESSING">处理中</SelectItem>
                <SelectItem value="LOAN_DISBURSED">已放款</SelectItem>
                <SelectItem value="SETTLED">已结清</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="需要尽调">
            <Select
              value={value.needDiligence}
              onValueChange={(next) => {
                if (!next) return
                onChange({
                  ...value,
                  needDiligence: next as OnlinePledgeFilters["needDiligence"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{NEED_DILIGENCE_LABELS[value.needDiligence]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部</SelectItem>
                <SelectItem value="YES">是（需尽调）</SelectItem>
                <SelectItem value="NO">否（免尽调）</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        {/* 展开筛选：抵/质押物类型、申请人类型、申请开始日期、申请结束日期 */}
        {expanded && (
          <div className="grid gap-4 border-t border-border/60 pt-4 lg:grid-cols-4">
            <FilterField label="抵/质押物类型">
              <Select
                value={value.collateralType}
                onValueChange={(next) => {
                  if (!next) return
                  onChange({
                    ...value,
                    collateralType: next as OnlinePledgeFilters["collateralType"],
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{COLLATERAL_LABELS[value.collateralType]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部类型</SelectItem>
                  <SelectItem value="INVENTORY">现货存货</SelectItem>
                  <SelectItem value="WAREHOUSE_RECEIPT">数字仓单</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="申请人类型">
              <Select
                value={value.applicantType}
                onValueChange={(next) => {
                  if (!next) return
                  onChange({
                    ...value,
                    applicantType: next as OnlinePledgeFilters["applicantType"],
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{APPLICANT_TYPE_LABELS[value.applicantType]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部主体</SelectItem>
                  <SelectItem value="ENTERPRISE">企业货主</SelectItem>
                  <SelectItem value="INDIVIDUAL">个人货主</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="申请开始日期">
              <Input
                type="date"
                value={value.appliedStartDate}
                onChange={(event) =>
                  onChange({ ...value, appliedStartDate: event.target.value })
                }
              />
            </FilterField>

            <FilterField label="申请结束日期">
              <Input
                type="date"
                value={value.appliedEndDate}
                onChange={(event) =>
                  onChange({ ...value, appliedEndDate: event.target.value })
                }
              />
            </FilterField>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

