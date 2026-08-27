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
import {
  DEFAULT_FILTERS,
  EXECUTABILITY_FILTER_OPTIONS,
  EXECUTION_STATUS_FILTER_OPTIONS,
} from "../domain/constants"
import type { MidLoanRiskFilters } from "../domain/types"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"

type MidLoanRiskFiltersProps = {
  value: MidLoanRiskFilters
  onChange: (value: MidLoanRiskFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function MidLoanRiskFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
}: MidLoanRiskFiltersProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          onReset={() => {
            onChange({ ...DEFAULT_FILTERS })
            onReset()
          }}
          onSearch={onSearch}
        />
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>订单号</Label>
            <Input
              placeholder="模糊匹配订单号"
              value={value.orderNo}
              onChange={(event) =>
                onChange({ ...value, orderNo: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>执行状态</Label>
            <Select
              value={value.executionStatus}
              onValueChange={(nextValue) =>
                onChange({
                  ...value,
                  executionStatus:
                    nextValue as MidLoanRiskFilters["executionStatus"],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXECUTION_STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>是否可执行</Label>
            <Select
              value={value.executability}
              onValueChange={(nextValue) =>
                onChange({
                  ...value,
                  executability:
                    nextValue as MidLoanRiskFilters["executability"],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXECUTABILITY_FILTER_OPTIONS.map((option) => (
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
