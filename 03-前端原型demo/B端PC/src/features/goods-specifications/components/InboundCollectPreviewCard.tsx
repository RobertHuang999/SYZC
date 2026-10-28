import type { ReactNode } from "react"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InboundCollectFieldConfig } from "../domain/types"

/** 静态示意输入框：只用来展示形态，不可交互 */
function MockBox({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}

function renderMock(field: InboundCollectFieldConfig) {
  switch (field.controlType) {
    case "下拉单选框":
      return (
        <div className="space-y-1.5">
          <MockBox className="justify-between">
            <span className="truncate">
              {field.placeholder || `请选择${field.name}`}
            </span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
          </MockBox>
          {field.options && field.options.length > 0 && (
            <p className="text-xs text-muted-foreground">
              可选：{field.options.join(" / ")}
            </p>
          )}
        </div>
      )
    case "日期选择器":
      return (
        <MockBox className="justify-between">
          <span>{field.placeholder || "请选择日期"}</span>
          <CalendarIcon className="size-4 shrink-0 opacity-60" />
        </MockBox>
      )
    case "数字区间框":
      return (
        <div className="flex items-center gap-2">
          <MockBox className="min-w-0 flex-1 justify-center">最小值</MockBox>
          <span className="shrink-0 text-sm text-muted-foreground">至</span>
          <MockBox className="min-w-0 flex-1 justify-center">最大值</MockBox>
          {field.unitLabel && (
            <span className="shrink-0 text-sm text-foreground">
              {field.unitLabel}
            </span>
          )}
        </div>
      )
    case "百分比数值框":
      return (
        <div className="flex items-center gap-2">
          <MockBox className="min-w-0 flex-1">
            <span className="truncate">{field.placeholder || "请输入"}</span>
          </MockBox>
          <span className="shrink-0 text-sm text-foreground">
            {field.unitLabel || "%"}
          </span>
        </div>
      )
    case "省市区三级联动":
      return (
        <div className="flex items-center gap-2">
          <MockBox className="min-w-0 flex-1 justify-between">
            <span className="truncate">请选择省份</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
          </MockBox>
          <MockBox className="min-w-0 flex-1 justify-between">
            <span className="truncate">请选择城市</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
          </MockBox>
          <MockBox className="min-w-0 flex-1 justify-between">
            <span className="truncate">请选择区县</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
          </MockBox>
        </div>
      )
    case "周期组合项":
      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <MockBox className="min-w-0 flex-1">
              <span className="truncate">{field.placeholder || "请输入"}</span>
            </MockBox>
            <span className="shrink-0 text-sm text-foreground">
              {field.unitLabel || "个月"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">单位只读，由货品主档指定</p>
        </div>
      )
    default:
      return <MockBox>{field.placeholder || "请输入"}</MockBox>
  }
}

export function InboundCollectPreviewCard({
  field,
  className,
  compact = false,
}: {
  field: InboundCollectFieldConfig
  className?: string
  /** 详情页窄栏等空间受限场景：说明文字收短 */
  compact?: boolean
}) {
  const isDisabled = field.status === "DISABLED"

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm font-medium text-foreground">{field.name}</span>
        <span className="text-destructive">*</span>
        <span className="text-xs text-muted-foreground">
          {compact
            ? "必填由货品主档设置"
            : "必填星号仅作示意，实际是否必填由货品主档设置"}
        </span>
      </div>

      <div className={cn("space-y-1.5", !compact && "max-w-md", isDisabled && "opacity-50")}>
        {renderMock(field)}
        {/* 区间框两个数字框内放不下提示语，单独补一行；其余类型提示语都作为框内占位文字展示 */}
        {field.placeholder && field.controlType === "数字区间框" && (
          <p className="text-xs text-muted-foreground">{field.placeholder}</p>
        )}
      </div>

      {isDisabled && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {compact
            ? "当前已停用，下游新建货品不再显示此项；存量货品与历史入库单不受影响。"
            : "当前收集项已停用，下游新建货品不再显示此项；已引用它的存量货品与历史入库单不受影响。"}
        </p>
      )}
    </div>
  )
}
