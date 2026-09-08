import { formatDateTime } from "@/shared/lib/date-utils"

type DateTimeTextProps = {
  value?: string | null
  stacked?: boolean
  plain?: boolean
  className?: string
}

/** 业务页面统一的时间展示：完整日期、秒级精度；plain 模式使用页面默认正文字体。 */
export function DateTimeText({
  value,
  stacked = false,
  plain = false,
  className = "",
}: DateTimeTextProps) {
  const formatted = formatDateTime(value)

  if (formatted === "—") {
    return <span className="text-muted-foreground">—</span>
  }

  if (!stacked) {
    return (
      <span className={`${plain ? "" : "font-mono tabular-nums text-[13px]"} ${className}`}>
        {formatted}
      </span>
    )
  }

  const [datePart, timePart] = formatted.trim().split(/\s+/, 2)
  if (!timePart) {
    return (
      <span className={`${plain ? "" : "font-mono tabular-nums text-xs"} ${className}`}>
        {formatted}
      </span>
    )
  }

  return (
    <span className={`flex flex-col leading-tight ${plain ? "" : "font-mono tabular-nums"} ${className}`}>
      <span className={plain ? "" : "text-xs text-foreground"}>{datePart}</span>
      <span className={plain ? "mt-0.5" : "mt-0.5 text-[11px] text-muted-foreground"}>
        {timePart}
      </span>
    </span>
  )
}
