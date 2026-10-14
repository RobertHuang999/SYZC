import { cn } from "@/lib/utils"

type OutboundFormSummaryBarProps = {
  categoryCount: number
  totalAmount: number
  unit: string
  totalValueWan?: number
  showValue?: boolean
  variant?: "inline" | "footer"
  className?: string
}

export function OutboundFormSummaryBar({
  categoryCount,
  totalAmount,
  unit,
  totalValueWan,
  showValue = false,
  variant = "inline",
  className,
}: OutboundFormSummaryBarProps) {
  const isFooter = variant === "footer"

  return (
    <div
      className={cn(
        "text-sm text-muted-foreground",
        isFooter
          ? "bg-transparent px-6 py-3 text-foreground/90"
          : "rounded-md border bg-muted/20 px-4 py-2",
        className
      )}
    >
      <span className="font-medium text-foreground">合计：</span>
      <span className={isFooter ? "ml-1" : undefined}>
        货品品类数：{categoryCount}
      </span>
      <span className="mx-3 text-border">|</span>
      货品总数量 {totalAmount.toFixed(4)} {unit}
      {showValue && typeof totalValueWan === "number" && totalValueWan > 0 ? (
        <>
          <span className="mx-3 text-border">|</span>
          当前出库货物价值约为 {totalValueWan.toFixed(2)} 万元
        </>
      ) : null}
    </div>
  )
}
