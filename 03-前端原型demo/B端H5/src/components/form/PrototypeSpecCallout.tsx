import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * 原型评审用规格对照（含规则编号、PRD 引用）。
 * 视觉与 ProductFieldHint 区分，避免研发误当作上线页面文案。
 */
export function PrototypeSpecCallout({
  children,
  className,
  badge = "原型·规格对照（非上线文案）",
}: {
  children: ReactNode
  className?: string
  badge?: string
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-dashed border-amber-500/45 bg-amber-500/[0.06] px-3 py-2",
        className
      )}
      data-prototype-spec-callout
    >
      <span className="inline-block rounded bg-amber-600/15 px-1.5 py-0.5 text-[10px] font-medium leading-none text-amber-900 dark:text-amber-100">
        {badge}
      </span>
      <div className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}
