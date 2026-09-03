import { CheckIcon, EyeIcon } from "lucide-react"
import { parseActionButtons, type ParsedActionButton } from "../lib/parse-action-buttons"
import { cn } from "@/lib/utils"

function ActionButtonChip({ item }: { item: ParsedActionButton }) {
  if (item.kind === "visibility") {
    return (
      <span
        className="inline-flex max-w-full items-start gap-1 rounded-md border border-dashed border-amber-300/80 bg-amber-50 px-1.5 py-0.5 text-[11px] leading-snug text-amber-900"
        title={item.label}
      >
        <EyeIcon className="mt-0.5 size-3 shrink-0" />
        <span>{item.label}</span>
      </span>
    )
  }

  return (
    <span
      className="inline-flex max-w-full items-center gap-1 rounded-md border border-border/80 bg-background px-1 py-0.5 text-[11px] leading-snug text-foreground shadow-sm"
      title={item.hint ? `${item.label}：${item.hint}` : item.label}
    >
      <span
        aria-hidden
        className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border border-primary/50 bg-primary text-primary-foreground"
      >
        <CheckIcon className="size-2.5" strokeWidth={3} />
      </span>
      <span className="min-w-0">
        {item.label}
        {item.hint && <span className="text-muted-foreground">（{item.hint}）</span>}
      </span>
    </span>
  )
}

export function ActionButtonList({ raw }: { raw: string }) {
  const buttons = parseActionButtons(raw)

  if (buttons.length === 0) {
    return <span className="text-[11px] text-muted-foreground/60">—</span>
  }

  return (
    <div className="flex max-w-md flex-wrap gap-1">
      {buttons.map((item, index) => (
        <ActionButtonChip key={`${item.label}-${index}`} item={item} />
      ))}
    </div>
  )
}

export function ActionButtonLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground", className)}>
      <span className="inline-flex items-center gap-1">
        <span className="inline-flex size-3 items-center justify-center rounded-[2px] border border-primary/50 bg-primary text-primary-foreground">
          <CheckIcon className="size-2" strokeWidth={3} />
        </span>
        已配置功能按钮
      </span>
      <span className="inline-flex items-center gap-1">
        <EyeIcon className="size-3 text-amber-700" />
        仅菜单可见性控制
      </span>
    </div>
  )
}
