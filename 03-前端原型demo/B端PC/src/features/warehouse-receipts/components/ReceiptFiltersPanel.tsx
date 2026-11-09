import {
  Check,
  ChevronDown,
  ChevronRight,
  Minus,
  X,
} from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  GOODS_CASCADER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  THIRD_PARTY_OPTIONS,
  WAREHOUSE_OPTIONS,
  type CascaderOption,
} from "../domain/constants"
import { cn } from "@/lib/utils"

type Props = {
  value: ReceiptFilters
  expanded: boolean
  onToggleExpanded: () => void
  onChange: (value: ReceiptFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function ReceiptFiltersPanel({
  value,
  expanded,
  onToggleExpanded,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={onToggleExpanded}
          onReset={onReset}
          onSearch={onSearch}
          onAdd={onAdd}
          addLabel="仓单开立"
        />

        {/* 默认常驻第 1 行：4 项 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. 仓单编号 */}
          <FilterField label="仓单编号">
            <Input
              placeholder="请输入仓单编号"
              value={value.code}
              onChange={(event) => onChange({ ...value, code: event.target.value })}
              onKeyDown={(event) => event.key === "Enter" && onSearch()}
            />
          </FilterField>

          {/* 2. 存货人/持有人/货品信息（综合搜索） */}
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

          {/* 3. 仓库 */}
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

          {/* 4. 状态（可多选） */}
          <FilterField label="状态（可多选）">
            <StatusMultiSelect
              value={value.statuses}
              onChange={(statuses) => onChange({ ...value, statuses })}
            />
          </FilterField>
        </div>

        {/* 展开区：对齐源码 9 项排序与 PC 4 列栅格规范，排满两行 8 列 */}
        {expanded ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 5. 开立时间（col-span-2） */}
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

            {/* 6. 货品名称（标准单列 1 列，对齐全站 Select/Cascader 统一宽度） */}
            <FilterField label="货品名称">
              <GoodsCascadeMultiSelect
                selectedKeys={value.goodsKeys ?? []}
                onChange={(nextKeys) =>
                  onChange({
                    ...value,
                    goodsKeys: nextKeys,
                  })
                }
              />
            </FilterField>

            {/* 7. 三方登记（col-span-1） */}
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

            {/* 8. 制单人（col-span-1） */}
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

            {/* 9. 制单时间（col-span-2） */}
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
      <label className="block text-xs font-normal text-muted-foreground">{label}</label>
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
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm shadow-xs hover:bg-accent/40"
          />
        }
      >
        <span className={cn(!value.length && "text-muted-foreground")}>
          {label}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
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

/** 规范的级联多选勾选框组件（全选对勾、半选横杠、未选空白） */
function CheckBox({
  state,
  onClick,
}: {
  state: "all" | "some" | "none"
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
        state === "all" && "border-primary bg-primary text-primary-foreground",
        state === "some" && "border-primary bg-primary/20 text-primary",
        state === "none" && "border-input bg-background hover:border-primary/50",
      )}
    >
      {state === "all" && <Check className="size-3 stroke-[3]" />}
      {state === "some" && <Minus className="size-3 stroke-[3]" />}
    </button>
  )
}

/**
 * 货品三级级联多选组件（对齐现网源码 el-cascader :props="{ multiple: true }" 规格）
 * 每一级支持全选/半选/反选，叶子规格精细勾选，输入框展示已选项摘要与一键清空
 */
function GoodsCascadeMultiSelect({
  selectedKeys,
  onChange,
}: {
  selectedKeys: string[]
  onChange: (keys: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>(
    GOODS_CASCADER_OPTIONS[0]?.value ?? "",
  )
  const [activeVariety, setActiveVariety] = useState<string>("")

  const selectedCategoryOpt = useMemo(
    () =>
      GOODS_CASCADER_OPTIONS.find((c) => c.value === activeCategory) ??
      GOODS_CASCADER_OPTIONS[0],
    [activeCategory],
  )

  const varietyOptions = useMemo(
    () => selectedCategoryOpt?.children ?? [],
    [selectedCategoryOpt],
  )

  const currentActiveVariety = activeVariety || (varietyOptions[0]?.value ?? "")

  const selectedVarietyOpt = useMemo(
    () => varietyOptions.find((v) => v.value === currentActiveVariety),
    [varietyOptions, currentActiveVariety],
  )

  const specOptions = useMemo(
    () => selectedVarietyOpt?.children ?? [],
    [selectedVarietyOpt],
  )

  /** 计算某个大类下所有规格的叶子全键名 */
  const getAllSpecsOfCategory = (cat: CascaderOption) => {
    const list: string[] = []
    cat.children?.forEach((v) => {
      v.children?.forEach((s) => {
        list.push(`${cat.value}/${v.value}/${s.value}`)
      })
    })
    return list
  }

  /** 计算某个品类下所有规格的叶子全键名 */
  const getAllSpecsOfVariety = (catValue: string, v: CascaderOption) => {
    return (v.children ?? []).map((s) => `${catValue}/${v.value}/${s.value}`)
  }

  /** 切换勾选一组 keys */
  const toggleKeyGroup = (keys: string[], currentState: "all" | "some" | "none") => {
    if (currentState === "all") {
      onChange(selectedKeys.filter((k) => !keys.includes(k)))
    } else {
      onChange([...new Set([...selectedKeys, ...keys])])
    }
  }

  /** 触发器内文本展示（对齐源码 placeholder="请选择货品" 与 collapse-tags 折叠标签体验） */
  const displayText = useMemo(() => {
    if (selectedKeys.length === 0) {
      return "请选择货品"
    }
    if (selectedKeys.length === 1) {
      const parts = selectedKeys[0]!.split("/")
      return parts.join(" / ")
    }
    return `已选 ${selectedKeys.length} 项`
  }, [selectedKeys])

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm shadow-xs hover:bg-accent/40"
          />
        }
      >
        <span
          className={cn(
            "truncate text-left",
            selectedKeys.length === 0 ? "text-muted-foreground" : "text-foreground font-medium",
          )}
        >
          {displayText}
        </span>
        <div className="flex shrink-0 items-center gap-1.5 ml-2">
          {selectedKeys.length > 0 ? (
            <span
              role="button"
              tabIndex={0}
              className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClear()
                }
              }}
              title="清空全部已选"
            >
              <X className="size-3.5" />
            </span>
          ) : null}
          <ChevronDown className="size-4 text-muted-foreground opacity-70" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[520px] p-0"
        align="start"
        sideOffset={6}
      >
        <div className="flex items-center justify-between border-b px-3.5 py-2 text-xs bg-muted/40 text-muted-foreground">
          <span>
            级联多选：支持勾选大类、品类批量全选或精细勾选规格
          </span>
          {selectedKeys.length > 0 ? (
            <span className="font-medium text-primary">
              已勾选 {selectedKeys.length} 项
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-3 divide-x text-xs max-h-72 overflow-y-auto">
          {/* 一级：大类列 */}
          <div className="p-1.5 space-y-0.5">
            <div className="px-2 py-1 font-semibold text-muted-foreground text-[11px]">
              货品大类
            </div>
            {GOODS_CASCADER_OPTIONS.map((cat) => {
              const allKeys = getAllSpecsOfCategory(cat)
              const hitCount = allKeys.filter((k) => selectedKeys.includes(k)).length
              const checkState: "all" | "some" | "none" =
                hitCount === 0
                  ? "none"
                  : hitCount === allKeys.length
                    ? "all"
                    : "some"
              const isActive = (selectedCategoryOpt?.value ?? "") === cat.value

              return (
                <div
                  key={cat.value}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-2 py-1.5 cursor-pointer transition-colors",
                    isActive ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted",
                  )}
                  onClick={() => {
                    setActiveCategory(cat.value)
                    setActiveVariety(cat.children?.[0]?.value ?? "")
                  }}
                >
                  <CheckBox
                    state={checkState}
                    onClick={() => toggleKeyGroup(allKeys, checkState)}
                  />
                  <span className="min-w-0 flex-1 truncate">{cat.label}</span>
                  <ChevronRight className="size-3.5 text-muted-foreground opacity-60" />
                </div>
              )
            })}
          </div>

          {/* 二级：品类列 */}
          <div className="p-1.5 space-y-0.5 bg-muted/10">
            <div className="px-2 py-1 font-semibold text-muted-foreground text-[11px]">
              品类
            </div>
            {varietyOptions.length === 0 ? (
              <div className="px-2 py-6 text-center text-muted-foreground text-[11px]">
                暂无品类
              </div>
            ) : (
              varietyOptions.map((v) => {
                const allKeys = getAllSpecsOfVariety(selectedCategoryOpt?.value ?? "", v)
                const hitCount = allKeys.filter((k) => selectedKeys.includes(k)).length
                const checkState: "all" | "some" | "none" =
                  hitCount === 0
                    ? "none"
                    : hitCount === allKeys.length
                      ? "all"
                      : "some"
                const isActive = currentActiveVariety === v.value

                return (
                  <div
                    key={v.value}
                    className={cn(
                      "flex items-center gap-1.5 rounded px-2 py-1.5 cursor-pointer transition-colors",
                      isActive ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted",
                    )}
                    onClick={() => setActiveVariety(v.value)}
                  >
                    <CheckBox
                      state={checkState}
                      onClick={() => toggleKeyGroup(allKeys, checkState)}
                    />
                    <span className="min-w-0 flex-1 truncate">{v.label}</span>
                    <ChevronRight className="size-3.5 text-muted-foreground opacity-60" />
                  </div>
                )
              })
            )}
          </div>

          {/* 三级：规格列 */}
          <div className="p-1.5 space-y-0.5">
            <div className="px-2 py-1 font-semibold text-muted-foreground text-[11px]">
              规格明细
            </div>
            {specOptions.length === 0 ? (
              <div className="px-2 py-6 text-center text-muted-foreground text-[11px]">
                暂无规格
              </div>
            ) : (
              specOptions.map((s) => {
                const fullKey = `${selectedCategoryOpt?.value ?? ""}/${currentActiveVariety}/${s.value}`
                const isChecked = selectedKeys.includes(fullKey)

                return (
                  <label
                    key={s.value}
                    className={cn(
                      "flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer text-xs transition-colors hover:bg-muted",
                      isChecked && "text-primary font-medium bg-primary/5",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="size-3.5 accent-primary rounded cursor-pointer"
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          onChange(selectedKeys.filter((k) => k !== fullKey))
                        } else {
                          onChange([...selectedKeys, fullKey])
                        }
                      }}
                    />
                    <span className="min-w-0 flex-1 truncate" title={s.label}>
                      {s.label}
                    </span>
                  </label>
                )
              })
            )}
          </div>
        </div>

        {/* 底部操作工具栏 */}
        <div className="flex items-center justify-between border-t bg-muted/30 px-3.5 py-2">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            onClick={handleClear}
          >
            清空已选
          </button>
          <button
            type="button"
            className="rounded-md bg-primary px-3.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => setOpen(false)}
          >
            确定
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
