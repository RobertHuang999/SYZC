import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEFAULT_FILTERS } from "../domain/constants"
import type { RiskDisclosureFilters } from "../domain/types"
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

          <div className="space-y-2">
            <Label>预警类型</Label>
            <Input
              placeholder="模糊匹配预警类型"
              value={value.warningType}
              onChange={(event) =>
                onChange({ ...value, warningType: event.target.value })
              }
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          列表固定展示已公示记录；以上条件按 AND 组合模糊匹配；不含公示时间日期范围筛选。
        </p>
      </CardContent>
    </Card>
  )
}
