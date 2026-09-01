import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import {
  APPLY_STATUS_FILTER_OPTIONS,
  DEFAULT_UNLOCK_APPLY_FILTERS,
  REASON_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "../domain/constants"
import type { UnlockApplyFilters } from "../domain/types"

type UnlockApplyFiltersPanelProps = {
  value: UnlockApplyFilters
  onChange: (value: UnlockApplyFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function UnlockApplyFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
}: UnlockApplyFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const applyDateShortcut = (shortcut: "today" | "week" | "month" | "30days") => {
    const end = "2026-08-28"
    if (shortcut === "today") {
      onChange({ ...value, submitTimeFrom: end, submitTimeTo: end })
      return
    }
    if (shortcut === "week") {
      onChange({ ...value, submitTimeFrom: "2026-08-22", submitTimeTo: end })
      return
    }
    if (shortcut === "month") {
      onChange({ ...value, submitTimeFrom: "2026-08-01", submitTimeTo: end })
      return
    }
    onChange({ ...value, submitTimeFrom: "2026-07-29", submitTimeTo: end })
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={() => {
            onChange({ ...DEFAULT_UNLOCK_APPLY_FILTERS })
            onReset()
          }}
          onSearch={onSearch}
        />

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="申请单号">
            <Input
              placeholder="精确匹配"
              value={value.applyNo}
              onChange={(event) => onChange({ ...value, applyNo: event.target.value })}
            />
          </FilterField>

          <FilterField label="设备名称/编码">
            <Input
              placeholder="模糊匹配"
              value={value.deviceKeyword}
              onChange={(event) =>
                onChange({ ...value, deviceKeyword: event.target.value })
              }
            />
          </FilterField>

          <FilterField label="绑定仓库">
            <Select
              value={value.warehouseName}
              onValueChange={(warehouseName) =>
                onChange({ ...value, warehouseName: warehouseName ?? "全部" })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WAREHOUSE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="申请状态">
            <Select
              value={value.applyStatus}
              onValueChange={(applyStatus) =>
                onChange({
                  ...value,
                  applyStatus:
                    (applyStatus as UnlockApplyFilters["applyStatus"]) ?? "全部",
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLY_STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          {expanded && (
            <>
              <FilterField label="申请人">
                <Input
                  placeholder="模糊匹配"
                  value={value.applicantKeyword}
                  onChange={(event) =>
                    onChange({ ...value, applicantKeyword: event.target.value })
                  }
                />
              </FilterField>

              <FilterField label="事由">
                <Select
                  value={value.reason}
                  onValueChange={(reason) =>
                    onChange({ ...value, reason: reason ?? "全部" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REASON_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>

              <FilterField label="提交时间" className="lg:col-span-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={value.submitTimeFrom}
                      onChange={(event) =>
                        onChange({ ...value, submitTimeFrom: event.target.value })
                      }
                    />
                    <span className="text-muted-foreground">至</span>
                    <Input
                      type="date"
                      value={value.submitTimeTo}
                      onChange={(event) =>
                        onChange({ ...value, submitTimeTo: event.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyDateShortcut("today")}
                    >
                      今天
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyDateShortcut("week")}
                    >
                      本周
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyDateShortcut("month")}
                    >
                      本月
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyDateShortcut("30days")}
                    >
                      近30天
                    </Button>
                  </div>
                </div>
              </FilterField>
            </>
          )}
        </div>
      </CardContent>
    </Card>
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
