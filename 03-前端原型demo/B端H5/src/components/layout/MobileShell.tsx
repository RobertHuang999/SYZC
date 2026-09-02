import type { ReactNode } from "react"

type MobileShellProps = {
  children: ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="relative flex flex-1 flex-col h-full w-full min-h-0 overflow-hidden bg-[#edf2f8]">
      {children}
    </div>
  )
}

