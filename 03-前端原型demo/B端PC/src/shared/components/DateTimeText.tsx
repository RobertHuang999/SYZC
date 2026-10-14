import { cn } from "@/lib/utils"
import { formatDateTime } from "@/shared/lib/date-utils"

type DateTimeTextProps = {
  value?: string | null
  stacked?: boolean
  plain?: boolean
  className?: string
}

/** 业务页面统一的时间展示：完整日期、秒级精度；继承 PingFang SC 正文字体，数字等宽对齐。 */
export function DateTimeText({
  value,
  stacked = false,
  plain = true,
  className = "",
}: DateTimeTextProps) {
  const formatted = formatDateTime(value)

  if (formatted === "—") {
    return <span className="text-muted-foreground">—</span>
  }

  if (!stacked) {
    return (
      <span
        className={cn(
          "text-[13px] tabular-nums",
          className
        )}
      >
        {formatted}
      </span>
    )
  }

  const [datePart, timePart] = formatted.trim().split(/\s+/, 2)
  if (!timePart) {
    return (
      <span
        className={cn(
          "text-sm tabular-nums",
          className
        )}
      >
        {formatted}
      </span>
    )
  }

  if (plain) {
    return (
      <span
        className={cn(
          "inline-flex flex-col gap-1 whitespace-nowrap text-sm tabular-nums leading-none",
          className
        )}
      >
        <span className="text-foreground">{datePart}</span>
        <span className="text-muted-foreground">{timePart}</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex flex-col gap-0.5 tabular-nums leading-none",
        className
      )}
    >
      <span className="text-xs text-foreground">{datePart}</span>
      <span className="text-[11px] text-muted-foreground">{timePart}</span>
    </span>
  )
}
