import { CalendarClockIcon, HistoryIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const CHANGE_NOTE_STYLES: Array<{ pattern: RegExp; label: string; className: string }> = [
  { pattern: /计划中/, label: "计划中", className: "border-orange-200 bg-orange-50 text-orange-800" },
  { pattern: /取消|已取消/, label: "已取消", className: "border-red-200 bg-red-50 text-red-700" },
  { pattern: /联登|智风控/, label: "外链跳转", className: "border-cyan-200 bg-cyan-50 text-cyan-800" },
  { pattern: /优化|0504|版本|修改|入口/, label: "迭代调整", className: "border-slate-200 bg-slate-50 text-slate-700" },
]

function formatDisplayDate(value: string) {
  if (!value) return ""
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value
  return `${year}-${month}-${day}`
}

export function ChangeLogCell({
  createdAt,
  updatedAt,
  changeNote,
}: {
  createdAt: string
  updatedAt: string
  changeNote: string
}) {
  const note = changeNote.trim()
  const hasRevision = Boolean(updatedAt && updatedAt !== createdAt)
  const matchedStyle = note ? CHANGE_NOTE_STYLES.find((item) => item.pattern.test(note)) : undefined
  const isEmpty = !createdAt && !updatedAt && !note

  if (isEmpty) {
    return <span className="text-[11px] text-muted-foreground/60">暂无变更记录</span>
  }

  return (
    <div className="min-w-[140px] max-w-[200px] space-y-1.5">
      <div className="space-y-0.5 text-[10px] text-muted-foreground">
        {createdAt && (
          <div className="flex items-center gap-1">
            <CalendarClockIcon className="size-3 shrink-0" />
            <span>创建 {formatDisplayDate(createdAt)}</span>
          </div>
        )}
        {hasRevision && (
          <div className="flex items-center gap-1 font-medium text-amber-700">
            <HistoryIcon className="size-3 shrink-0" />
            <span>修订 {formatDisplayDate(updatedAt)}</span>
          </div>
        )}
      </div>

      {note && (
        <div className="space-y-1">
          {matchedStyle && (
            <span
              className={cn(
                "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none",
                matchedStyle.className,
              )}
            >
              {matchedStyle.label}
            </span>
          )}
          <p className="text-[11px] leading-snug text-muted-foreground">{note}</p>
        </div>
      )}
    </div>
  )
}

export function ChangeLogLegend({ className }: { className?: string }) {
  return (
    <p className={cn("text-[10px] font-normal text-muted-foreground", className)}>
      来源 CSV「创建时间 / 修定时间 / 变更说明」
    </p>
  )
}
