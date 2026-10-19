import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** 上线界面字段/区块说明（研发按此实现，勿写规则编号） */
export function ProductFieldHint({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      {children}
    </p>
  )
}
