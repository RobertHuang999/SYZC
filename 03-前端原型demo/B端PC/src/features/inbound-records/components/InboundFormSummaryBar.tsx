import { cn } from "@/lib/utils"

type InboundFormSummaryBarProps = {
  categoryCount: number
  goodsTotal: number
  stackedTotal: number
  noStackTotal: number
  variant?: "inline" | "footer"
  className?: string
}

export function InboundFormSummaryBar({
  categoryCount,
  goodsTotal,
  stackedTotal,
  noStackTotal,
  variant = "inline",
  className,
}: InboundFormSummaryBarProps) {
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
      <span className={cn("font-medium", isFooter ? "text-foreground" : "text-foreground")}>
        合计：
      </span>
      <span className={isFooter ? "ml-1" : undefined}>
        货品品类数：{categoryCount}
      </span>
      <span className="mx-3 text-border">|</span>
      货品总数量 {goodsTotal.toFixed(4)}
      <span className="mx-3 text-border">|</span>
      堆放总数量：{stackedTotal.toFixed(4)}
      <span className="mx-3 text-border">|</span>
      无需堆放总数量：{noStackTotal.toFixed(4)}
    </div>
  )
}
