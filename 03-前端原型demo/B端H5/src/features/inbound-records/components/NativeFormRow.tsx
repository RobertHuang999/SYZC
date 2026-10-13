import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"

type Props = {
  label: string
  required?: boolean
  onClick?: () => void
  showChevron?: boolean
  children: ReactNode
  className?: string
}

export function NativeFormRow({
  label,
  required,
  onClick,
  showChevron,
  children,
  className = "",
}: Props) {
  const interactive = Boolean(onClick)
  return (
    <div
      className={`flex min-h-9 items-center justify-between gap-3 border-b border-[#232D39]/10 py-3.5 last:border-b-0 ${className}`}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick?.()
            }
          : undefined
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <div className="flex shrink-0 items-center text-sm text-[#232D39]">
        {required ? <span className="mr-0.5 text-[#EF3E3E]">*</span> : null}
        {label}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1 text-sm">
        {children}
        {showChevron ? (
          <ChevronRight className="size-4 shrink-0 text-[#2A3339]/30" strokeWidth={2.5} />
        ) : null}
      </div>
    </div>
  )
}
