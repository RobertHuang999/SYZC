import { Check, Eye } from "lucide-react"
import { parseActionButtons, type ParsedActionButton } from "../lib/parse-action-buttons"

function ActionButtonChip({ item }: { item: ParsedActionButton }) {
  if (item.kind === "visibility") {
    return (
      <span
        className="inline-flex max-w-full items-start gap-1 rounded-md border border-dashed border-amber-300/80 bg-amber-50 px-1.5 py-0.5 text-[11px] leading-snug text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
        title={item.label}
      >
        <Eye className="mt-0.5 size-3 shrink-0" />
        <span>{item.label}</span>
      </span>
    )
  }

  return (
    <span
      className="inline-flex max-w-full items-center gap-1 rounded-md border border-slate-200/80 bg-white px-1.5 py-0.5 text-[11px] leading-snug text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      title={item.hint ? `${item.label}：${item.hint}` : item.label}
    >
      <span
        aria-hidden
        className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border border-primary/50 bg-primary text-white"
      >
        <Check className="size-2.5" strokeWidth={3} />
      </span>
      <span className="min-w-0">
        {item.label}
        {item.hint && <span className="text-slate-400">（{item.hint}）</span>}
      </span>
    </span>
  )
}

export function ActionButtonList({ raw }: { raw: string }) {
  const buttons = parseActionButtons(raw)

  if (buttons.length === 0) {
    return <span className="text-[11px] text-slate-300 dark:text-slate-600">—</span>
  }

  return (
    <div className="flex max-w-md flex-wrap gap-1">
      {buttons.map((item, index) => (
        <ActionButtonChip key={`${item.label}-${index}`} item={item} />
      ))}
    </div>
  )
}

export function ActionButtonLegend({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 text-[11px] text-slate-500 ${className}`}>
      <span className="inline-flex items-center gap-1">
        <span className="inline-flex size-3.5 items-center justify-center rounded-[2px] border border-primary/50 bg-primary text-white">
          <Check className="size-2.5" strokeWidth={3} />
        </span>
        已配置操作按钮权限
      </span>
      <span className="inline-flex items-center gap-1">
        <Eye className="size-3.5 text-amber-600" />
        仅菜单/入口可见性控制
      </span>
    </div>
  )
}
