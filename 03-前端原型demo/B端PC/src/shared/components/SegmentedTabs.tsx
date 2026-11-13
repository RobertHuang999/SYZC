import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface SegmentedTabItem<T extends string> {
  key: T
  label: ReactNode
  /** 标签左侧图标 */
  icon?: ReactNode
}

interface SegmentedTabsProps<T extends string> {
  items: SegmentedTabItem<T>[]
  value: T
  onChange: (key: T) => void
  className?: string
}

/**
 * 统一的分段式矩形标签页。
 * 样式基准：监管管理「抵押订单 / 质押订单 / 监管服务订单」——外框圆角描边，
 * 选中项品牌蓝实底色白字，未选中项白底灰字，标签之间用竖线分隔。
 */
export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex max-w-full flex-wrap overflow-hidden rounded-lg border border-border bg-card shadow-xs",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.key === value
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 border-r border-border px-4 text-[13px] font-medium transition-colors last:border-r-0",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.icon}
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
