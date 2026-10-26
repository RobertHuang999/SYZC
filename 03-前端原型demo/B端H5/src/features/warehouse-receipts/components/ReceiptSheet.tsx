import type { ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReceiptSheet({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  className,
}: {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  className?: string
}) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-xs"
        aria-label="关闭"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 flex max-h-[85%] w-full flex-col rounded-t-3xl bg-white shadow-2xl animate-slide-up",
          className,
        )}
      >
        <div className="shrink-0 border-b border-[#232D39]/8 px-4 pb-3 pt-4">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#232D39]">{title}</h3>
              {description ? (
                <p className="mt-1 text-xs leading-relaxed text-[#232D39]/55">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#232D39]/5 text-[#232D39]/60 active:bg-[#232D39]/10"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-[#232D39]/8 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export type ReceiptSelectOption = {
  id: string
  label: string
  description?: string
  disabled?: boolean
}

export function ReceiptSelectSheet({
  open,
  title,
  description,
  options,
  selectedId,
  onClose,
  onSelect,
  theme = "blue",
}: {
  open: boolean
  title: string
  description?: string
  options: ReceiptSelectOption[]
  selectedId?: string
  onClose: () => void
  onSelect: (option: ReceiptSelectOption) => void
  theme?: "blue" | "gold"
}) {
  const activeClass =
    theme === "gold"
      ? "border-[#E6C98F] bg-[#FBF4E6]"
      : "border-blue-300 bg-blue-50/70"
  const radioClass =
    theme === "gold"
      ? "border-[#E0A23C] bg-[#E0A23C]"
      : "border-blue-600 bg-blue-600"

  return (
    <ReceiptSheet open={open} title={title} description={description} onClose={onClose}>
      <div className="space-y-2">
        {options.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#232D39]/45">
            暂无可选项
          </p>
        ) : (
          options.map((option) => {
            const active = option.id === selectedId
            return (
              <button
                key={option.id}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  onSelect(option)
                  onClose()
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors",
                  active
                    ? activeClass
                    : "border-[#232D39]/10 bg-white active:bg-[#232D39]/5",
                  option.disabled && "opacity-40",
                )}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[#232D39]">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-0.5 block text-xs text-[#232D39]/50">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border",
                    active
                      ? radioClass
                      : "border-[#232D39]/25",
                  )}
                >
                  {active ? <span className="size-1.5 rounded-full bg-white" /> : null}
                </span>
              </button>
            )
          })
        )}
      </div>
    </ReceiptSheet>
  )
}
