import { Link } from "react-router-dom"
import { ITERATION_RECORD_LABEL, ITERATION_RECORD_PATH } from "@/config/navigation"
import type { IterationRecordEntry } from "../data/menu-iteration-records"
import { IterationPathChangeCell } from "./IterationPathChangeCell"
import { IterationPriorityBadge } from "./IterationPriorityBadge"
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
    <div className="min-w-[200px] max-w-[320px] space-y-2">
      {entries.slice(0, 2).map((entry) => (
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
            <IterationPriorityBadge priority={entry.priority} />
          </div>
          <p className="mt-1 text-[11px] font-medium leading-snug text-foreground">{entry.title}</p>
          {(entry.before || entry.after) && (
            <div className="mt-1">
              <IterationPathChangeCell before={entry.before} after={entry.after} compact />
            </div>
          )}
          {entry.note && (
            <p className="mt-1 text-[10px] leading-snug text-muted-foreground">{entry.note}</p>
          )}
        </div>
      ))}
      {entries.length > 2 && (
        <p className="text-[10px] text-muted-foreground">
          另有 {entries.length - 2} 条，见
          <Link to={ITERATION_RECORD_PATH} className="ml-0.5 font-medium text-primary hover:underline">
            {ITERATION_RECORD_LABEL}
          </Link>
        </p>
      )}
    </div>
  )
}

export function IterationMenuChangeLegend({ className }: { className?: string }) {
  return (
    <p className={cn("text-[10px] font-normal text-muted-foreground", className)}>
      按页面路径自动关联各版本迭代记录（含路径对比与 P0/P1）
    </p>
  )
}
