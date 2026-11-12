import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import {
  COLLATERAL_OPTIONS,
  STATUS_OPTIONS,
  SURVEY_OPTIONS,
} from "../domain/constants"
import type { LeadFilters } from "../domain/types"

interface LeadsFiltersPanelProps {
  draftFilters: LeadFilters
  onDraftChange: (newFilters: LeadFilters) => void
  onSearch: () => void
  onReset: () => void
  onExport: () => void
}

export function LeadsFiltersPanel({
  draftFilters,
  onDraftChange,
  onSearch,
  onReset,
  onExport,
}: LeadsFiltersPanelProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <div className="space-y-4">
      <WarningFilterHeader
        onSearch={onSearch}
        onReset={onReset}
        extraActions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-1.5"
          >
            <DownloadIcon className="size-4" />
            <span>导出</span>
          </Button>
        }
      />

      {/* 4列栅格筛选条件区 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 综合搜索 */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">综合搜索</label>
          <Input
            placeholder="请输入产品名称/申请人"
            value={draftFilters.keyword}
            onChange={(e) =>
              onDraftChange({ ...draftFilters, keyword: e.target.value })
            }
            onKeyDown={handleKeyDown}
            className="h-[34px] w-full text-xs"
          />
        </div>

        {/* 需要尽调 */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">需要尽调</label>
          <Select
            value={draftFilters.requiresSurvey}
            onValueChange={(val) =>
              onDraftChange({ ...draftFilters, requiresSurvey: val || "ALL" })
            }
          >
            <SelectTrigger className="h-[34px] w-full text-xs">
              <SelectValue placeholder="请选择是否需要尽调" />
            </SelectTrigger>
            <SelectContent>
              {SURVEY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 融资状态 */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">融资状态</label>
          <Select
            value={draftFilters.status}
            onValueChange={(val) =>
              onDraftChange({ ...draftFilters, status: val || "ALL" })
            }
          >
            <SelectTrigger className="h-[34px] w-full text-xs">
              <SelectValue placeholder="请选择融资状态" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 抵/质押物 */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">抵/质押物</label>
          <Select
            value={draftFilters.collateralType}
            onValueChange={(val) =>
              onDraftChange({ ...draftFilters, collateralType: val || "ALL" })
            }
          >
            <SelectTrigger className="h-[34px] w-full text-xs">
              <SelectValue placeholder="请选择抵/质押物类型" />
            </SelectTrigger>
            <SelectContent>
              {COLLATERAL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
