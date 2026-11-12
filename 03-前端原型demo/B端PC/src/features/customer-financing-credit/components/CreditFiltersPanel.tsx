import { SearchIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  APPLICANT_TYPE_OPTIONS,
  CREDIT_STATUS_OPTIONS,
  NEED_DILIGENCE_OPTIONS,
} from "../domain/constants"
import type { CreditFilters } from "../domain/types"

interface CreditFiltersPanelProps {
  filters: CreditFilters
  onChange: (filters: CreditFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function CreditFiltersPanel({
  filters,
  onChange,
  onSearch,
  onReset,
}: CreditFiltersPanelProps) {
  return (
    <Card className="border-border/60 bg-card shadow-xs">
      <CardContent className="p-4">
        {/* 4 项筛选控件对齐三件套 5.1 与样式规范 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. 综合搜索：产品名称 / 申请人 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              综合搜索：
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="请输入产品名称/申请人"
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

          {/* 2. 融资状态 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              融资状态：
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                onChange({ ...filters, status: e.target.value })
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {CREDIT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. 申请人类型 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              申请人类型：
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

          {/* 4. 需要尽调 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              需要尽调：
            </label>
            <select
              value={filters.needDiligence}
              onChange={(e) =>
                onChange({ ...filters, needDiligence: e.target.value })
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {NEED_DILIGENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 底部按钮栏 */}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border/40 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" />
            重置
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSearch}
            className="h-8 gap-1.5 bg-primary text-xs text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <SearchIcon className="h-3.5 w-3.5" />
            查询
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

