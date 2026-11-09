import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { DEFAULT_DELIVERY_ORDER_FILTERS } from "../domain/constants"
import type { DeliveryOrderFilters } from "../domain/types"

interface DeliveryOrderFiltersPanelProps {
  filters: DeliveryOrderFilters
  onChange: (filters: DeliveryOrderFilters) => void
  onSearch: () => void
}

export function DeliveryOrderFiltersPanel({
  filters,
  onChange,
  onSearch,
}: DeliveryOrderFiltersPanelProps) {
  return (
    <PrototypeAnnotationTarget annotationIds={["delivery-order-filter"]}>
      <Card>
        <CardContent className="space-y-4 pt-4">
          <WarningFilterHeader
            onReset={() => {
              onChange({ ...DEFAULT_DELIVERY_ORDER_FILTERS })
              onSearch()
            }}
            onSearch={onSearch}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterField label="货主名称/标识">
              <Input
                value={filters.nameOrIdentity}
                onChange={(e) => onChange({ ...filters, nameOrIdentity: e.target.value })}
                placeholder="请输入货主名称/标识"
                className="h-[34px] text-sm"
              />
            </FilterField>

            <FilterField label="提货人姓名/手机号">
              <Input
                value={filters.pickNameOrMobile}
                onChange={(e) => onChange({ ...filters, pickNameOrMobile: e.target.value })}
                placeholder="请输入提货人姓名或手机号"
                className="h-[34px] text-sm"
              />
            </FilterField>

            <FilterField label="提货状态">
              <Select
                value={filters.status}
                onValueChange={(val) => onChange({ ...filters, status: val || "全部" })}
              >
                <SelectTrigger className="h-[34px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-sans">
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="未提货">未提货</SelectItem>
                  <SelectItem value="已提货">已提货</SelectItem>
                  <SelectItem value="已取消">已取消</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>
          </div>
        </CardContent>
      </Card>
    </PrototypeAnnotationTarget>
  )
}

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-normal text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
