import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FormPageStickyFooterProps = {
  /** 左侧说明或合计 */
  left?: ReactNode
  /** 右侧取消 / 提交按钮 */
  children: ReactNode
  className?: string
}

/**
 * 表单页吸底栏：贴在 `.page-surface` 内容区下沿，不铺满整屏、不盖住侧栏。
 */
export function FormPageStickyFooter({
  left,
  children,
  className,
}: FormPageStickyFooterProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-30 mt-auto border-t border-border bg-card/95 px-6 py-3 shadow-[0_-8px_16px_-12px_rgba(15,35,95,0.18)] backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 text-xs text-muted-foreground">{left}</div>
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      </div>
    </div>
  )
}
