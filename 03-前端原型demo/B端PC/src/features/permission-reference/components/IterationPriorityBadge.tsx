import { cn } from "@/lib/utils"

const priorityStyles: Record<string, string> = {
  P0: "border-rose-300 bg-rose-50 text-rose-900",
  P1: "border-amber-300 bg-amber-50 text-amber-950",
  P2: "border-slate-300 bg-slate-50 text-slate-700",
}

const deliveryTagStyles: Record<string, string> = {
  必交付: "border-emerald-300 bg-emerald-50 text-emerald-950",
  暂定: "border-orange-300 bg-orange-50 text-orange-950",
  暂定开发: "border-sky-300 bg-sky-50 text-sky-950",
  不涉及: "border-zinc-300 bg-zinc-100 text-zinc-600",
}

export function IterationPriorityBadge({ priority }: { priority?: string }) {
  const normalized = priority?.trim()
  if (!normalized || normalized === "—") {
    return <span className="text-[10px] text-muted-foreground/50">—</span>
  }

  const upper = normalized.toUpperCase()
  const style =
    priorityStyles[upper] ??
    deliveryTagStyles[normalized] ??
    "border-border bg-muted/30 text-muted-foreground"

  return (
    <span
      className={cn(
        "inline-flex rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide",
        style,
      )}
    >
      {/^P[0-2]$/.test(upper) ? upper : normalized}
    </span>
  )
}

export function IterationDeliveryTagBadge({ tag }: { tag?: string }) {
  const normalized = tag?.trim()
  if (!normalized || normalized === "—") {
    return <span className="text-[10px] text-muted-foreground/50">—</span>
  }

  const style =
    deliveryTagStyles[normalized] ?? "border-violet-200 bg-violet-50/80 text-violet-900"

  return (
    <span
      className={cn(
        "inline-flex rounded border px-1.5 py-0.5 text-[10px] font-semibold",
        style,
      )}
    >
      {normalized}
    </span>
  )
}
