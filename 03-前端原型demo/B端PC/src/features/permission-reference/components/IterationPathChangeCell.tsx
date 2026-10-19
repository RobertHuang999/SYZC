import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function PathLine({ value, muted }: { value: string; muted?: boolean }) {
  if (!value) {
    return <span className="text-[10px] text-muted-foreground/50">（无）</span>
  }

  return (
    <p
      className={cn(
        "text-[11px] leading-snug break-words",
        muted ? "text-muted-foreground line-through decoration-muted-foreground/40" : "text-foreground/90",
      )}
    >
      {value}
    </p>
  )
}

export function IterationPathChangeCell({
  before,
  after,
  compact,
}: {
  before: string
  after: string
  compact?: boolean
}) {
  const hasBefore = Boolean(before?.trim())
  const hasAfter = Boolean(after?.trim())

  if (!hasBefore && !hasAfter) {
    return <span className="text-[11px] text-muted-foreground">—</span>
  }

  if (!hasBefore && hasAfter) {
    return (
      <div className={cn("space-y-0.5", compact ? "max-w-[220px]" : "min-w-[200px] max-w-md")}>
        <p className="text-[10px] font-medium text-emerald-700">新增路径</p>
        <PathLine value={after} />
      </div>
    )
  }

  if (hasBefore && !hasAfter) {
    return (
      <div className={cn("space-y-0.5", compact ? "max-w-[220px]" : "min-w-[200px] max-w-md")}>
        <p className="text-[10px] font-medium text-rose-700">下线 / 取消</p>
        <PathLine value={before} muted />
      </div>
    )
  }

  return (
    <div className={cn("space-y-1", compact ? "max-w-[240px]" : "min-w-[220px] max-w-lg")}>
      <PathLine value={before} muted />
      <div className="flex items-start gap-1 text-muted-foreground">
        <ArrowRightIcon className="mt-0.5 size-3 shrink-0" aria-hidden />
        <PathLine value={after} />
      </div>
    </div>
  )
}
