import type { IterationRecordEntry } from "../data/menu-iteration-records"
import {
  iterationDefaultTypeStyle,
  iterationPlatformStyles,
  iterationTypeStyles,
} from "./iteration-record-styles"
import { cn } from "@/lib/utils"

export function IterationMenuChangeCell({ entries }: { entries: IterationRecordEntry[] }) {
  if (entries.length === 0) {
    return <span className="text-[11px] text-muted-foreground/60">—</span>
  }

  return (
    <div className="min-w-[160px] max-w-[240px] space-y-2">
      {entries.slice(0, 3).map((entry) => (
        <div
          key={`${entry.version}-${entry.id}`}
          className="rounded-md border border-border/60 bg-muted/10 px-2 py-1.5"
        >
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-semibold text-primary">{entry.version}</span>
            <span
              className={cn(
                "rounded border px-1 py-0 text-[9px] font-semibold",
                iterationPlatformStyles[entry.platform],
              )}
            >
              {entry.platform}
            </span>
            <span
              className={cn(
                "rounded border px-1 py-0 text-[9px] font-medium",
                iterationTypeStyles[entry.type] ?? iterationDefaultTypeStyle,
              )}
            >
              {entry.type}
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium leading-snug text-foreground">{entry.title}</p>
          {entry.note && (
            <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground line-clamp-2">
              {entry.note}
            </p>
          )}
        </div>
      ))}
      {entries.length > 3 && (
        <p className="text-[10px] text-muted-foreground">另有 {entries.length - 3} 条，见「菜单迭代记录」</p>
      )}
    </div>
  )
}

export function IterationMenuChangeLegend({ className }: { className?: string }) {
  return (
    <p className={cn("text-[10px] font-normal text-muted-foreground", className)}>
      自动关联 B-迭代需求/各版本/00-菜单迭代记录.md
    </p>
  )
}
