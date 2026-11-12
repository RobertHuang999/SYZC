import { SearchIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  APPLICANT_TYPE_OPTIONS,
  COMPLETED_TAB_STATUS_OPTIONS,
  PENDING_TAB_STATUS_OPTIONS,
} from "../domain/constants"
import type { DiligenceFilters, DiligenceTab } from "../domain/types"

interface DueDiligenceFiltersPanelProps {
  activeTab: DiligenceTab
  filters: DiligenceFilters
  onChange: (filters: DiligenceFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function DueDiligenceFiltersPanel({
  activeTab,
  filters,
  onChange,
  onSearch,
  onReset,
}: DueDiligenceFiltersPanelProps) {
  const statusOptions =
    activeTab === "PENDING"
      ? PENDING_TAB_STATUS_OPTIONS
      : COMPLETED_TAB_STATUS_OPTIONS

  return (
    <Card className="border-border/60 bg-card shadow-xs">
      <CardContent className="p-4">
        {/* 严格对齐现网 3 项筛选控件 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* 1. 申请人/产品 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              申请人/产品：
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="请输入申请人/产品"
                value={filters.keyword}
                onChange={(e) =>
                  onChange({ ...filters, keyword: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch()
                }}
                className="pl-8 text-sm"
              />
            </div>
          </div>

          {/* 2. 申请类型 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              申请类型：
            </label>
            <select
              value={filters.applicantType}
              onChange={(e) =>
                onChange({ ...filters, applicantType: e.target.value })
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {APPLICANT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. 状态 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              状态：
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                onChange({ ...filters, status: e.target.value })
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 操作按钮区 */}
        <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border/40 pt-3">
          <div className="text-xs text-muted-foreground">
            草稿态隔离：点击【查询】后生效检索，回车亦可触发
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-8 gap-1 text-xs"
            >
              <RotateCcwIcon className="h-3.5 w-3.5" />
              重置
            </Button>
            <Button
              size="sm"
              onClick={onSearch}
              className="h-8 gap-1 text-xs"
            >
              <SearchIcon className="h-3.5 w-3.5" />
              查询
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
