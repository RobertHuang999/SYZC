import { cn } from "@/lib/utils"

const priorityStyles: Record<string, string> = {
  P0: "border-rose-300 bg-rose-50 text-rose-900",
  P1: "border-amber-300 bg-amber-50 text-amber-950",
  P2: "border-slate-300 bg-slate-50 text-slate-700",
}

export function IterationPriorityBadge({ priority }: { priority?: string }) {
  const normalized = priority?.trim()
  if (!normalized || normalized === "—") {
    return <span className="text-[10px] text-muted-foreground/50">—</span>
  }

  const style = priorityStyles[normalized.toUpperCase()] ?? "border-border bg-muted/30 text-muted-foreground"

  return (
    <span
      className={cn(
        "inline-flex rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide",
        style,
      )}
    >
      {normalized.toUpperCase()}
    </span>
  )
}
