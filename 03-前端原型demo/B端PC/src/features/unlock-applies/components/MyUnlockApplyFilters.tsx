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
import {
  DEFAULT_MY_UNLOCK_APPLY_FILTERS,
  MY_APPLY_STATUS_OPTIONS,
  MY_CREDENTIAL_STATUS_OPTIONS,
  REASON_OPTIONS,
  UNLOCK_APPLY_STATUS_LABEL,
  WAREHOUSE_OPTIONS,
  CREDENTIAL_STATUS_LABEL,
} from "../domain/constants"
import type { MyUnlockApplyFilters, UnlockApplyStatus, CredentialStatus } from "../domain/types"

type MyUnlockApplyFiltersPanelProps = {
  value: MyUnlockApplyFilters
  onChange: (value: MyUnlockApplyFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function MyUnlockApplyFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
}: MyUnlockApplyFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [applyStatusOpen, setApplyStatusOpen] = useState(false)
  const [credentialStatusOpen, setCredentialStatusOpen] = useState(false)

  const applyStatusLabel = useMemo(() => {
    if (value.applyStatuses.length === 0) return "全部"
    if (value.applyStatuses.length === 1) {
      return UNLOCK_APPLY_STATUS_LABEL[value.applyStatuses[0]]
    }
    return `已选 ${value.applyStatuses.length} 项`
  }, [value.applyStatuses])

  const credentialStatusLabel = useMemo(() => {
    if (value.credentialStatuses.length === 0) return "全部"
    if (value.credentialStatuses.length === 1) {
      return CREDENTIAL_STATUS_LABEL[value.credentialStatuses[0]]
    }
    return `已选 ${value.credentialStatuses.length} 项`
  }, [value.credentialStatuses])

  const toggleApplyStatus = (status: UnlockApplyStatus) => {
    const next = value.applyStatuses.includes(status)
      ? value.applyStatuses.filter((s) => s !== status)
      : [...value.applyStatuses, status]
    onChange({ ...value, applyStatuses: next })
  }

  const toggleCredentialStatus = (status: CredentialStatus) => {
    const next = value.credentialStatuses.includes(status)
      ? value.credentialStatuses.filter((s) => s !== status)
      : [...value.credentialStatuses, status]
    onChange({ ...value, credentialStatuses: next })
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onReset={() => {
            onChange({ ...DEFAULT_MY_UNLOCK_APPLY_FILTERS })
            onReset()
          }}
          onSearch={onSearch}
        />

        {/* 默认行：是否需要审核、提交时间、申请状态、凭证状态 */}
        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="是否需要审核">
            <Select
              value={value.needsApproval}
              onValueChange={(needsApproval) =>
                onChange({
                  ...value,
                  needsApproval:
                    (needsApproval as MyUnlockApplyFilters["needsApproval"]) ?? "全部",
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["全部", "是", "否"] as const).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="提交时间">
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                value={value.submitTimeFrom}
                onChange={(event) =>
                  onChange({ ...value, submitTimeFrom: event.target.value })
                }
              />
              <span className="shrink-0 text-muted-foreground text-xs">~</span>
              <Input
                type="date"
                value={value.submitTimeTo}
                onChange={(event) =>
                  onChange({ ...value, submitTimeTo: event.target.value })
                }
              />
            </div>
          </FilterField>

          <FilterField label="申请状态">
            <MultiSelectField
              open={applyStatusOpen}
              onOpenChange={setApplyStatusOpen}
              label={applyStatusLabel}
            >
              <button
                type="button"
                className="flex w-full items-center px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={() => onChange({ ...value, applyStatuses: [] })}
              >
                全部
              </button>
              {MY_APPLY_STATUS_OPTIONS.map((status) => (
                <label
                  key={status}
                  className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={value.applyStatuses.includes(status)}
                    onChange={() => toggleApplyStatus(status)}
                  />
                  <span>{UNLOCK_APPLY_STATUS_LABEL[status]}</span>
                </label>
              ))}
            </MultiSelectField>
          </FilterField>

          <FilterField label="凭证状态">
            <MultiSelectField
              open={credentialStatusOpen}
              onOpenChange={setCredentialStatusOpen}
              label={credentialStatusLabel}
            >
              <button
                type="button"
                className="flex w-full items-center px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={() => onChange({ ...value, credentialStatuses: [] })}
              >
                全部
              </button>
              {MY_CREDENTIAL_STATUS_OPTIONS.map((status) => (
                <label
                  key={status}
                  className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={value.credentialStatuses.includes(status)}
                    onChange={() => toggleCredentialStatus(status)}
                  />
                  <span>{CREDENTIAL_STATUS_LABEL[status]}</span>
                </label>
              ))}
            </MultiSelectField>
          </FilterField>
        </div>

        {expanded && (
          <div className="grid gap-4 lg:grid-cols-4 border-t pt-4">
            <FilterField label="设备名称">
              <Input
                placeholder="模糊匹配"
                value={value.deviceName}
                onChange={(event) =>
                  onChange({ ...value, deviceName: event.target.value })
                }
              />
            </FilterField>

            <FilterField label="设备编码">
              <Input
                placeholder="精确匹配"
                value={value.deviceCode}
                onChange={(event) =>
                  onChange({ ...value, deviceCode: event.target.value })
                }
              />
            </FilterField>

            <FilterField label="设备类型">
              <Select
                value={value.deviceType}
                onValueChange={(deviceType) =>
                  onChange({
                    ...value,
                    deviceType:
                      (deviceType as MyUnlockApplyFilters["deviceType"]) ?? "全部",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["全部", "挂锁门禁", "人脸门禁"] as const).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <FilterField label="申请人">
              <Input
                placeholder="模糊匹配姓名或账号"
                value={value.applicantKeyword}
                onChange={(event) =>
                  onChange({ ...value, applicantKeyword: event.target.value })
                }
              />
            </FilterField>

            <FilterField label="配置编号">
              <Input
                placeholder="精确匹配"
                value={value.configNo}
                onChange={(event) =>
                  onChange({ ...value, configNo: event.target.value })
                }
              />
            </FilterField>
          </div>
        )}
      </CardContent>
    </Card>
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
