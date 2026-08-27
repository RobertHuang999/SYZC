import type { ReactNode } from "react"

type MobileShellProps = {
  children: ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="flex flex-1 flex-col h-full w-full overflow-hidden bg-[#edf2f8] relative">
      {children}
    </div>
  )
}

