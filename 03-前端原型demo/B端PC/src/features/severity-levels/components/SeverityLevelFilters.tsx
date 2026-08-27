import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ENABLED_FILTER_OPTIONS } from "../domain/constants"
import type { EnabledFilter, SeverityLevelFilters } from "../domain/types"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"

type SeverityLevelFiltersPanelProps = {
  value: SeverityLevelFilters
  onChange: (value: SeverityLevelFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function SeverityLevelFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: SeverityLevelFiltersPanelProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          onSearch={onSearch}
          onReset={() => {
            onReset()
          }}
          onAdd={onAdd}
          addLabel="新增等级"
        />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Label>是否启用</Label>
            <Select
              value={value.enabled}
              onValueChange={(nextValue) =>
                onChange({
                  ...value,
                  enabled: nextValue as EnabledFilter,
                })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENABLED_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
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
