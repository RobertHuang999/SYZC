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
  DEFAULT_ORDER_WARNING_CONFIG_FILTERS,
  ORDER_TYPE_OPTIONS,
  ORDER_WARNING_CONFIG_STATUS_OPTIONS,
} from "../domain/constants"
import {
  ORDER_WARNING_ITEM_TYPES,
  type OrderWarningConfigFilters,
  type OrderWarningItemType,
} from "../domain/types"

type OrderWarningConfigFiltersPanelProps = {
  value: OrderWarningConfigFilters
  onChange: (value: OrderWarningConfigFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function OrderWarningConfigFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: OrderWarningConfigFiltersPanelProps) {
  const [enabledItemsOpen, setEnabledItemsOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const enabledItemsLabel = useMemo(() => {
    if (value.enabledItems.length === 0) {
      return "全部"
    }
    if (value.enabledItems.length === 1) {
      return value.enabledItems[0]
    }
    return `已选 ${value.enabledItems.length} 项`
  }, [value.enabledItems])

  const toggleEnabledItem = (item: OrderWarningItemType) => {
    const exists = value.enabledItems.includes(item)
    onChange({
      ...value,
      enabledItems: exists
        ? value.enabledItems.filter((current) => current !== item)
        : [...value.enabledItems, item],
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
            onChange({ ...DEFAULT_ORDER_WARNING_CONFIG_FILTERS })
            onReset()
          }}
          onAdd={onAdd}
          addLabel="新增订单规则"
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

          <FilterField label="订单号">
            <Input
              placeholder="请输入订单号"
              value={value.orderNo}
              onChange={(event) =>
                onChange({ ...value, orderNo: event.target.value })
              }
            />
          </FilterField>

          <FilterField label="订单类型">
            <Select
              value={value.orderType}
              onValueChange={(nextValue) =>
                onChange({
                  ...value,
                  orderType: nextValue as OrderWarningConfigFilters["orderType"],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="已启用预警项">
            <MultiSelectField
              open={enabledItemsOpen}
              onOpenChange={setEnabledItemsOpen}
              label={enabledItemsLabel}
            >
              <button
                type="button"
                className="flex w-full items-center px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={() => onChange({ ...value, enabledItems: [] })}
              >
                全部
              </button>
              {ORDER_WARNING_ITEM_TYPES.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={value.enabledItems.includes(item)}
                    onChange={() => toggleEnabledItem(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </MultiSelectField>
          </FilterField>

          {expanded && (
          <FilterField label="状态">
            <Select
              value={value.status}
              onValueChange={(nextValue) =>
                onChange({
                  ...value,
                  status: nextValue as OrderWarningConfigFilters["status"],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_WARNING_CONFIG_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
          )}
        </div>

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
