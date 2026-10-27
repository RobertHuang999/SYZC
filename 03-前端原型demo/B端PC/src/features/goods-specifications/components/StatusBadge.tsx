import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { STATUS_LABEL } from "../domain/constants"
import type { GoodsStatus } from "../domain/types"

export function StatusBadge({
  status,
  className,
}: {
  status: GoodsStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === "ENABLED"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-600",
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "ENABLED" ? "bg-emerald-500" : "bg-slate-400"
        )}
      />
      {STATUS_LABEL[status]}
    </Badge>
  )
}

export function EffectiveStatusBadge({
  effective,
  reason,
}: {
  effective: boolean
  reason?: string
}) {
  return (
    <span className="inline-flex flex-col gap-1">
      <Badge
        variant="outline"
        className={
          effective
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-slate-200 bg-slate-50 text-slate-600"
        }
      >
        {effective ? "有效启用" : "无效停用"}
      </Badge>
      {!effective && reason ? (
        <span className="text-xs text-muted-foreground">{reason}</span>
      ) : null}
    </span>
  )
}
