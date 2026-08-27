import { useState } from "react"
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
  DISCLOSURE_STATUS_FILTER_OPTIONS,
} from "../domain/constants"
import {
  RISK_DISCLOSURE_WARNING_TYPES,
  type RiskDisclosureFilters,
} from "../domain/types"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"

type RiskDisclosureFiltersProps = {
  value: RiskDisclosureFilters
  onChange: (value: RiskDisclosureFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function RiskDisclosureFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
}: RiskDisclosureFiltersProps) {
  const [expanded, setExpanded] = useState(false)

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
          <div className="space-y-2">
            <Label>规则名称</Label>
            <Input
              placeholder="模糊匹配规则名称"
              value={value.ruleName}
              onChange={(event) =>
                onChange({ ...value, ruleName: event.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>预警类型</Label>
            <Select
              value={value.warningType}
              onValueChange={(nextValue) =>
                onChange({
                  ...value,
                  warningType: nextValue as RiskDisclosureFilters["warningType"],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部</SelectItem>
                {RISK_DISCLOSURE_WARNING_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label>货主</Label>
            <Input
              placeholder="模糊匹配货主名称"
              value={value.ownerName}
              onChange={(event) =>
                onChange({ ...value, ownerName: event.target.value })
              }
            />
          </div>

          {expanded && (
          <div className="space-y-2">
            <Label>状态</Label>
            <Select
              value={value.disclosureStatus}
              onValueChange={(nextValue) =>
                onChange({
                  ...value,
                  disclosureStatus:
                    nextValue as RiskDisclosureFilters["disclosureStatus"],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISCLOSURE_STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
