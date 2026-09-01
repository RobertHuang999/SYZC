import type { ReactNode } from "react"
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
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import {
  DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS,
  STATUS_OPTIONS,
} from "../domain/constants"
import type { UnlockApprovalConfigFilters } from "../domain/types"

type UnlockApprovalConfigFiltersPanelProps = {
  value: UnlockApprovalConfigFilters
  onChange: (value: UnlockApprovalConfigFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function UnlockApprovalConfigFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: UnlockApprovalConfigFiltersPanelProps) {
  const updateFilters = (patch: Partial<UnlockApprovalConfigFilters>) => {
    onChange({ ...value, ...patch })
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          onSearch={onSearch}
          onReset={() => {
            onChange({ ...DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS })
            onReset()
          }}
          onAdd={onAdd}
          addLabel="新增配置"
        />

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="配置名称">
            <Input
              placeholder="请输入配置名称"
              value={value.configName}
              onChange={(event) =>
                updateFilters({ configName: event.target.value })
              }
            />
          </FilterField>

          <FilterField label="状态">
            <Select
              value={value.status}
              onValueChange={(nextValue) => {
                if (!nextValue) return
                updateFilters({
                  status: nextValue as UnlockApprovalConfigFilters["status"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="配置编号">
            <Input
              placeholder="精确匹配"
              value={value.configNo}
              onChange={(event) =>
                updateFilters({ configNo: event.target.value })
              }
            />
          </FilterField>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterField({
  label,
  children,
}: {
  label: ReactNode
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
