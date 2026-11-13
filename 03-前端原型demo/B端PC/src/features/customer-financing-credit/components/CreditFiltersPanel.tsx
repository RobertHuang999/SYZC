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
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader onSearch={onSearch} onReset={onReset} />

        {/* 4 项筛选控件：与入库记录等标杆列表保持同一栅格与控件高度 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. 综合搜索：产品名称 / 申请人 */}
          <div className="space-y-2">
            <label className="block text-xs font-normal text-muted-foreground">
              综合搜索
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
                className="pl-8"
              />
            </div>
          </div>

          {/* 2. 融资状态 */}
          <div className="space-y-2">
            <label className="block text-xs font-normal text-muted-foreground">
              融资状态
            </label>
            <Select
              items={CREDIT_STATUS_OPTIONS}
              value={filters.status}
              onValueChange={(value) =>
                onChange({ ...filters, status: value || "ALL" })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                {CREDIT_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. 申请人类型 */}
          <div className="space-y-2">
            <label className="block text-xs font-normal text-muted-foreground">
              申请人类型
            </label>
            <Select
              items={APPLICANT_TYPE_OPTIONS}
              value={filters.applicantType}
              onValueChange={(value) =>
                onChange({ ...filters, applicantType: value || "ALL" })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                {APPLICANT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. 需要尽调 */}
          <div className="space-y-2">
            <label className="block text-xs font-normal text-muted-foreground">
              需要尽调
            </label>
            <Select
              items={NEED_DILIGENCE_OPTIONS}
              value={filters.needDiligence}
              onValueChange={(value) =>
                onChange({ ...filters, needDiligence: value || "ALL" })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                {NEED_DILIGENCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
