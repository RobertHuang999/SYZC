import { useMemo, useState, type ReactNode } from "react"
import { ChevronDownIcon } from "lucide-react"
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
import { ENABLED_SEVERITY_LEVELS } from "@/shared/mock/severity-levels"
import {
  DEFAULT_DEVICE_WARNING_CONFIG_FILTERS,
  DEVICE_WARNING_CONFIG_STATUS_OPTIONS,
  DEVICE_WARNING_SUB_TYPES,
} from "../domain/constants"
import {
  DISPOSITION_MODES,
  DISPOSITION_MODE_LABELS,
  type DispositionMode,
} from "../domain/disposition"
import {
  DEVICE_WARNING_TYPES,
  type DeviceWarningConfigFilters,
  type DeviceWarningType,
} from "../domain/types"

type DeviceWarningConfigFiltersPanelProps = {
  value: DeviceWarningConfigFilters
  onChange: (value: DeviceWarningConfigFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function DeviceWarningConfigFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: DeviceWarningConfigFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [severityOpen, setSeverityOpen] = useState(false)
  const [dispositionOpen, setDispositionOpen] = useState(false)

  const warningTypeGroups = useMemo(() => {
    return DEVICE_WARNING_TYPES.map((type) => ({
      category: type,
      subTypes: DEVICE_WARNING_SUB_TYPES[type] || [],
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

  const dispositionLabel = useMemo(() => {
    if (value.dispositionModes.length === 0) {
      return "全部"
    }
    if (value.dispositionModes.length === 1) {
      return DISPOSITION_MODE_LABELS[value.dispositionModes[0]]
    }
    return `已选 ${value.dispositionModes.length} 项`
  }, [value.dispositionModes])

  const toggleSeverity = (severityLevelId: string) => {
    const exists = value.severityLevelIds.includes(severityLevelId)
    onChange({
      ...value,
      severityLevelIds: exists
        ? value.severityLevelIds.filter((item) => item !== severityLevelId)
        : [...value.severityLevelIds, severityLevelId],
    })
  }

  const toggleDisposition = (mode: DispositionMode) => {
    const exists = value.dispositionModes.includes(mode)
    onChange({
      ...value,
      dispositionModes: exists
        ? value.dispositionModes.filter((item) => item !== mode)
        : [...value.dispositionModes, mode],
    })
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onSearch={onSearch}
          onReset={() => {
            onChange({ ...DEFAULT_DEVICE_WARNING_CONFIG_FILTERS })
            onReset()
          }}
          onAdd={onAdd}
          addLabel="新增设备规则"
        />
        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="规则名称">
            <Input
              placeholder="请输入规则名称"
              value={value.ruleName}
              onChange={(event) =>
                onChange({ ...value, ruleName: event.target.value })
              }
            />
          </FilterField>

          <FilterField label="预警类型">
            <WarningTypeCascadeSelect
              groups={warningTypeGroups}
              selectedWarningTypes={value.warningTypes}
              selectedSubTypes={value.subTypes || []}
              onChange={(types, subTypes) =>
                onChange({
                  ...value,
                  warningTypes: types as DeviceWarningType[],
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

          <FilterField label="状态">
            <Select
              value={value.status}
              onValueChange={(nextValue) =>
                onChange({
                  ...value,
                  status: nextValue as DeviceWarningConfigFilters["status"],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_WARNING_CONFIG_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        {expanded && (
          <div className="grid gap-4 border-t pt-4 lg:grid-cols-4">
            <FilterField label="处置策略">
              <MultiSelectField
                open={dispositionOpen}
                onOpenChange={setDispositionOpen}
                label={dispositionLabel}
              >
                <button
                  type="button"
                  className="flex w-full items-center px-2 py-1.5 text-left text-sm hover:bg-muted"
                  onClick={() => onChange({ ...value, dispositionModes: [] })}
                >
                  全部
                </button>
                {DISPOSITION_MODES.map((mode) => (
                  <label
                    key={mode}
                    className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={value.dispositionModes.includes(mode)}
                      onChange={() => toggleDisposition(mode)}
                    />
                    <span>{DISPOSITION_MODE_LABELS[mode]}</span>
                  </label>
                ))}
              </MultiSelectField>
            </FilterField>
          </div>
        )}

      </CardContent>
    </Card>
  )
}


function FilterField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
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
