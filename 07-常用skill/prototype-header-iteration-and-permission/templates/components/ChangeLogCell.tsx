import { CalendarClock, History } from "lucide-react"

const CHANGE_NOTE_STYLES: Array<{ pattern: RegExp; label: string; className: string }> = [
  { pattern: /计划中|规划中/, label: "规划中", className: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/60 dark:text-orange-300" },
  { pattern: /取消|已取消/, label: "已取消", className: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300" },
  { pattern: /外链|跳转|联登/, label: "跨系统跳转", className: "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-300" },
  { pattern: /优化|版本|修改|重构|更名/, label: "版本调整", className: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300" },
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
    return <span className="text-[11px] text-slate-400">基准版本上线</span>
  }

  return (
    <div className="min-w-[140px] max-w-[220px] space-y-1.5">
      <div className="space-y-0.5 text-[10px] text-slate-400">
        {createdAt && (
          <div className="flex items-center gap-1">
            <CalendarClock className="size-3 shrink-0" />
            <span>创建 {formatDisplayDate(createdAt)}</span>
          </div>
        )}
        {hasRevision && (
          <div className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
            <History className="size-3 shrink-0" />
            <span>修订 {formatDisplayDate(updatedAt)}</span>
          </div>
        )}
      </div>

      {note && (
        <div className="space-y-1">
          {matchedStyle && (
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none ${matchedStyle.className}`}
            >
              {matchedStyle.label}
            </span>
          )}
          <p className="text-[11px] leading-snug text-slate-600 dark:text-slate-400">{note}</p>
        </div>
      )}
    </div>
  )
}

export function ChangeLogLegend({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] text-slate-500 ${className}`}>
      标记功能创建/修订时间与变更原因；支持高亮“规划中 / 跨系统跳转 / 已取消”
    </p>
  )
}
