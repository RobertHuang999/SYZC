import { useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Check } from "lucide-react"
import { getOverlayRoot } from "@/shared/lib/overlay-root"

export type DropdownOption = {
  label: string
  value: string
}

type DropdownFilterPillProps = {
  label: string // 默认显示的字段名称，如 "预警状态"
  value: string // 当前选中的 value
  options: DropdownOption[]
  onChange: (value: string) => void
  renderLabel?: (value: string) => string
}

type MenuPosition = {
  top: number
  left: number
  maxWidth: number
}

export function DropdownFilterPill({
  label,
  value,
  options,
  onChange,
  renderLabel,
}: DropdownFilterPillProps) {
  const [open, setOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const overlayRootRef = useRef<HTMLElement | null>(null)

  const isSelected = value !== "全部" && value !== ""
  const selectedOption = options.find((opt) => opt.value === value)
  const displayLabel = renderLabel
    ? renderLabel(value)
    : isSelected
      ? selectedOption?.label || value
      : label

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    const root = overlayRootRef.current ?? getOverlayRoot(containerRef.current)
    if (!trigger || !root) return

    overlayRootRef.current = root
    const triggerRect = trigger.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()

    setMenuPosition({
      top: triggerRect.bottom - rootRect.top + 4,
      left: triggerRect.left - rootRect.left,
      maxWidth: Math.min(240, rootRect.width - 24),
    })
  }, [])

  useEffect(() => {
    if (!open) {
      setMenuPosition(null)
      return
    }

    updateMenuPosition()

    const handleReposition = () => updateMenuPosition()
    window.addEventListener("resize", handleReposition)
    window.addEventListener("scroll", handleReposition, true)

    return () => {
      window.removeEventListener("resize", handleReposition)
      window.removeEventListener("scroll", handleReposition, true)
    }
  }, [open, updateMenuPosition])

  const closeMenu = () => setOpen(false)

  const toggleOpen = () => {
    if (open) {
      closeMenu()
      return
    }
    overlayRootRef.current = getOverlayRoot(containerRef.current)
    setOpen(true)
  }

  const overlayRoot =
    overlayRootRef.current ?? getOverlayRoot(containerRef.current)

  return (
    <div className="relative inline-block shrink-0" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
          isSelected
            ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200"
            : "bg-[#f4f5f7] text-gray-700 hover:bg-gray-200 active:bg-gray-200"
        }`}
      >
        <span className="max-w-[85px] truncate">{displayLabel}</span>
        <ChevronDown
          className={`size-3 text-gray-400 transition-transform ${
            open ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {open &&
        menuPosition &&
        createPortal(
          <>
            <button
              type="button"
              className="absolute inset-0 z-40 touch-none"
              aria-label="关闭筛选"
              onClick={closeMenu}
            />
            <div
              className="absolute z-50 max-h-64 min-w-[150px] overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-xl animate-scale-up"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                maxWidth: menuPosition.maxWidth,
              }}
            >
              <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 border-b border-gray-100 mb-1">
                {label}
              </div>
              {options.map((option) => {
                const active = option.value === value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      closeMenu()
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                      active
                        ? "bg-blue-50 font-bold text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {active && (
                      <Check className="size-3.5 text-blue-600 shrink-0 ml-1" />
                    )}
                  </button>
                )
              })}
            </div>
          </>,
          overlayRoot
        )}
    </div>
  )
}
