import { useMemo, useState, type ReactNode } from "react"
import { ChevronDownIcon } from "lucide-react"
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
import { WarningTypeCascadeSelect } from "@/components/business/WarningTypeCascadeSelect"
import {
  DEFAULT_FILTERS,
  WARNING_STATUS_FILTER_OPTIONS,
  DEVICE_WARNING_EVENT_SUB_TYPES,
} from "../domain/constants"
import { WARNING_TYPES, type DeviceWarningEventFilters, type WarningType } from "../domain/types"
import {
  ENABLED_SEVERITY_LEVELS,
  WAREHOUSE_OPTIONS,
} from "../mock/filter-options.mock"

type DeviceWarningEventFiltersProps = {
  value: DeviceWarningEventFilters
  onChange: (value: DeviceWarningEventFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function DeviceWarningEventFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
}: DeviceWarningEventFiltersProps) {
  const [severityOpen, setSeverityOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const warningTypeGroups = useMemo(() => {
    return WARNING_TYPES.map((type) => ({
      category: type,
      subTypes: DEVICE_WARNING_EVENT_SUB_TYPES[type] || [],
    }))
  }, [])

  const severityLabel = useMemo(() => {
    if (value.severityLevelIds.length === 0) {
      return "全部"
    }
    const selected = ENABLED_SEVERITY_LEVELS.filter((item) =>
      value.severityLevelIds.includes(item.severityLevelId)
    )
    if (selected.length === 1) {
      return `${selected[0].severityCode} ${selected[0].severityName}`
    }
    return `已选 ${selected.length} 项`
  }, [value.severityLevelIds])

  const toggleSeverity = (severityLevelId: string) => {
    const exists = value.severityLevelIds.includes(severityLevelId)
    onChange({
      ...value,
      severityLevelIds: exists
        ? value.severityLevelIds.filter((item) => item !== severityLevelId)
        : [...value.severityLevelIds, severityLevelId],
    })
  }

  const applyDateShortcut = (shortcut: "today" | "week" | "month") => {
    const end = "2026-08-20"
    let start = end

    if (shortcut === "week") {
      start = "2026-08-14"
    }
    if (shortcut === "month") {
      start = "2026-08-01"
    }

    onChange({
      ...value,
      warningTimeStart: start,
      warningTimeEnd: end,
    })
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={() => {
            onChange({ ...DEFAULT_FILTERS })
            onReset()
          }}
          onSearch={onSearch}
        />

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="预警类型">
            <WarningTypeCascadeSelect
              groups={warningTypeGroups}
              selectedWarningTypes={value.warningTypes}
              selectedSubTypes={value.subTypes || []}
              onChange={(types, subTypes) =>
                onChange({
                  ...value,
                  warningTypes: types as WarningType[],
                  subTypes,
                })
              }
            />
          </FilterField>

          <FilterField label="预警等级">
            <MultiSelectField
              open={severityOpen}
              onOpenChange={setSeverityOpen}
              label={severityLabel}
            >
              <button
                type="button"
                className="flex w-full items-center px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={() => onChange({ ...value, severityLevelIds: [] })}
              >
                全部
              </button>
              {ENABLED_SEVERITY_LEVELS.map((level) => (
                <label
                  key={level.severityLevelId}
                  className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={value.severityLevelIds.includes(level.severityLevelId)}
                    onChange={() => toggleSeverity(level.severityLevelId)}
                  />
                  <span
                    className="inline-block size-2.5 rounded-full"
                    style={{ backgroundColor: level.severityColor }}
                  />
                  <span>
                    {level.severityCode} {level.severityName}
                  </span>
                </label>
              ))}
            </MultiSelectField>
          </FilterField>

          <FilterField label="预警状态">
            <Select
              value={value.warningStatus}
              onValueChange={(nextValue) =>
                onChange({
                  ...value,
                  warningStatus: nextValue as DeviceWarningEventFilters["warningStatus"],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WARNING_STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="所属仓库">
            <Select
              value={value.warehouseName}
              onValueChange={(nextValue) =>
                onChange({ ...value, warehouseName: nextValue ?? "全部" })
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

          {expanded && (
            <>
              <FilterField label="预警时间" className="lg:col-span-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={value.warningTimeStart}
                      onChange={(event) =>
                        onChange({
                          ...value,
                          warningTimeStart: event.target.value,
                        })
                      }
                    />
                    <span className="text-muted-foreground">至</span>
                    <Input
                      type="date"
                      value={value.warningTimeEnd}
                      onChange={(event) =>
                        onChange({
                          ...value,
                          warningTimeEnd: event.target.value,
                        })
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

function MultiSelectField({
  label,
  open,
  onOpenChange,
  children,
}: {
  label: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs",
          "hover:bg-muted/40"
        )}
        onClick={() => onOpenChange(!open)}
      >
        <span className="truncate">{label}</span>
        <ChevronDownIcon className="size-4 opacity-60" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {children}
        </div>
      )}
    </div>
  )
}
