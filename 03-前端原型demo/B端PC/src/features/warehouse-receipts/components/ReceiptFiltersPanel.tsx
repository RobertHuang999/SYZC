import { ChevronDownIcon } from "lucide-react"
import type { ReactNode } from "react"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { ReceiptStatus } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { receiptStatusLabel } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import type { ReceiptFilters } from "@prototype/shared/warehouse-receipts/warehouse-receipt-filters"
import {
  CREATOR_OPTIONS,
  GOODS_CATEGORY_OPTIONS,
  GOODS_VARIETY_MAP,
  STATUS_FILTER_OPTIONS,
  THIRD_PARTY_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "../domain/constants"
import { cn } from "@/lib/utils"

type Props = {
  value: ReceiptFilters
  expanded: boolean
  onToggleExpanded: () => void
  onChange: (value: ReceiptFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function ReceiptFiltersPanel({
  value,
  expanded,
  onToggleExpanded,
  onChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={onToggleExpanded}
          onReset={onReset}
          onSearch={onSearch}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterField label="仓单编号">
            <Input
              placeholder="请输入仓单编号"
              value={value.code}
              onChange={(event) => onChange({ ...value, code: event.target.value })}
              onKeyDown={(event) => event.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="存货人/持有人/货品信息">
            <Input
              placeholder="请输入存货人/持有人/货品信息"
              value={value.keyword}
              onChange={(event) =>
                onChange({ ...value, keyword: event.target.value })
              }
              onKeyDown={(event) => event.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="仓库">
            <Select
              value={value.warehouse}
              onValueChange={(next) =>
                next && onChange({ ...value, warehouse: next })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部仓库</SelectItem>
                {WAREHOUSE_OPTIONS.map((warehouse) => (
                  <SelectItem key={warehouse} value={warehouse}>
                    {warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="状态（可多选）">
            <StatusMultiSelect
              value={value.statuses}
              onChange={(statuses) => onChange({ ...value, statuses })}
            />
          </FilterField>
        </div>

        {expanded ? (
          <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterField label="开立时间" className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={value.establishedStart}
                  onChange={(event) =>
                    onChange({ ...value, establishedStart: event.target.value })
                  }
                />
                <span className="shrink-0 text-sm text-muted-foreground">至</span>
                <Input
                  type="date"
                  value={value.establishedEnd}
                  onChange={(event) =>
                    onChange({ ...value, establishedEnd: event.target.value })
                  }
                />
              </div>
            </FilterField>

            <FilterField label="货品名称" className="lg:col-span-2">
              <div className="space-y-2">
                <Select
                  value={value.goodsCategory}
                  onValueChange={(next) =>
                    next &&
                    onChange({
                      ...value,
                      goodsCategory: next,
                      goodsVarieties: [],
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="全部">全部大类</SelectItem>
                    {GOODS_CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {value.goodsCategory !== "全部" ? (
                  <div className="flex flex-wrap gap-1.5">
                    {(GOODS_VARIETY_MAP[value.goodsCategory] ?? []).map(
                      (variety) => {
                        const active = value.goodsVarieties.includes(variety)
                        return (
                          <button
                            key={variety}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              onChange({
                                ...value,
                                goodsVarieties: active
                                  ? value.goodsVarieties.filter(
                                      (item) => item !== variety,
                                    )
                                  : [...value.goodsVarieties, variety],
                              })
                            }
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-xs transition-colors",
                              active
                                ? "border-blue-200 bg-blue-50 font-medium text-blue-700"
                                : "border-border bg-background text-muted-foreground hover:bg-muted",
                            )}
                          >
                            {variety}
                          </button>
                        )
                      },
                    )}
                  </div>
                ) : null}
              </div>
            </FilterField>

            <FilterField label="三方登记">
              <Select
                value={value.thirdParty}
                onValueChange={(next) =>
                  next &&
                  onChange({
                    ...value,
                    thirdParty: next as ReceiptFilters["thirdParty"],
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {THIRD_PARTY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "全部" ? "全部" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="制单人">
              <Select
                value={value.creator}
                onValueChange={(next) =>
                  next && onChange({ ...value, creator: next })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部制单人</SelectItem>
                  {CREATOR_OPTIONS.map((creator) => (
                    <SelectItem key={creator} value={creator}>
                      {creator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="制单时间" className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={value.createdStart}
                  onChange={(event) =>
                    onChange({ ...value, createdStart: event.target.value })
                  }
                />
                <span className="shrink-0 text-sm text-muted-foreground">至</span>
                <Input
                  type="date"
                  value={value.createdEnd}
                  onChange={(event) =>
                    onChange({ ...value, createdEnd: event.target.value })
                  }
                />
              </div>
            </FilterField>
          </div>
        ) : null}
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

function StatusMultiSelect({
  value,
  onChange,
}: {
  value: ReceiptStatus[]
  onChange: (value: ReceiptStatus[]) => void
}) {
  const label =
    value.length === 0
      ? "全部状态"
      : value.length === 1
        ? receiptStatusLabel(value[0])
        : `已选 ${value.length} 项`

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
          />
        }
      >
        <span className={cn(!value.length && "text-muted-foreground")}>
          {label}
        </span>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <div className="space-y-1">
          {STATUS_FILTER_OPTIONS.map((option) => {
            const checked = value.includes(option.value)
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-blue-600"
                  checked={checked}
                  onChange={() =>
                    onChange(
                      checked
                        ? value.filter((item) => item !== option.value)
                        : [...value, option.value],
                    )
                  }
                />
                {option.label}
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
