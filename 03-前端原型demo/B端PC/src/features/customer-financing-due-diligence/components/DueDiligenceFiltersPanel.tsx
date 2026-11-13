import type { ReactNode } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import {
  COMPLETED_TAB_STATUS_OPTIONS,
  PENDING_TAB_STATUS_OPTIONS,
  SAME_ORG_SURVEYORS,
} from "../domain/constants"
import type { DiligenceFilters, DiligenceTab } from "../domain/types"

interface DueDiligenceFiltersPanelProps {
  activeTab: DiligenceTab
  filters: DiligenceFilters
  onChange: (filters: DiligenceFilters) => void
  onSearch: () => void
  onReset: () => void
  extraActions?: ReactNode
}

const SURVEYOR_OPTIONS = [
  { value: "ALL", label: "全部尽调人员" },
  ...SAME_ORG_SURVEYORS.map((item) => ({
    value: item.name,
    label: item.name,
  })),
]

export function DueDiligenceFiltersPanel({
  activeTab,
  filters,
  onChange,
  onSearch,
  onReset,
  extraActions,
}: DueDiligenceFiltersPanelProps) {
  const statusOptions =
    activeTab === "PENDING"
      ? PENDING_TAB_STATUS_OPTIONS
      : COMPLETED_TAB_STATUS_OPTIONS

  return (
    <Card className="border-border/60 bg-card shadow-xs">
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          onSearch={onSearch}
          onReset={onReset}
          extraActions={extraActions}
        />

        {/* 标准 4 列筛选栅格：一行 4 项，超出自动换行 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. 综合搜索 */}
          <div className="space-y-2">
            <label className="block text-xs font-normal text-muted-foreground">综合搜索</label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="请输入申请人/产品名称"
                value={filters.keyword}
                onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch()
                }}
                className="pl-8"
              />
            </div>
          </div>

          {/* 2. 尽调状态 */}
          <div className="space-y-2">
            <label className="block text-xs font-normal text-muted-foreground">尽调状态</label>
            <Select
              items={statusOptions}
              value={filters.status}
              onValueChange={(next) =>
                onChange({ ...filters, status: next || "ALL" })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择尽调状态" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. 尽调人员 */}
          <div className="space-y-2">
            <label className="block text-xs font-normal text-muted-foreground">尽调人员</label>
            <Select
              items={SURVEYOR_OPTIONS}
              value={filters.surveyor || "ALL"}
              onValueChange={(next) =>
                onChange({ ...filters, surveyor: next || "ALL" })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择尽调人员" />
              </SelectTrigger>
              <SelectContent>
                {SURVEYOR_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. 尽调分配时间（起止日期） */}
          <div className="space-y-2">
            <label className="block text-xs font-normal text-muted-foreground">尽调分配时间</label>
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                aria-label="尽调分配开始日期"
                value={filters.assignedFrom || ""}
                onChange={(e) =>
                  onChange({ ...filters, assignedFrom: e.target.value })
                }
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground">至</span>
              <Input
                type="date"
                aria-label="尽调分配结束日期"
                value={filters.assignedTo || ""}
                onChange={(e) =>
                  onChange({ ...filters, assignedTo: e.target.value })
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
