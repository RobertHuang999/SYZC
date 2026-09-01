import type { ReactNode } from "react"

type TabScrollLayoutProps = {
  header: ReactNode
  children: ReactNode
  className?: string
}

/**
 * H5 列表页标准布局：固定筛选头 + 下方独立滚动区。
 * 必须配合 MobileShell → flex-1 min-h-0 父链使用，否则列表无法滚动。
 */
export function TabScrollLayout({ header, children, className }: TabScrollLayoutProps) {
  return (
    <div className={`flex flex-1 flex-col min-h-0 overflow-hidden ${className ?? ""}`}>
      <div className="shrink-0">{header}</div>
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  )
}
