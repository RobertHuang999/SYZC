import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"

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

export function DropdownFilterPill({
  label,
  value,
  options,
  onChange,
  renderLabel,
}: DropdownFilterPillProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isSelected = value !== "全部" && value !== ""
  const selectedOption = options.find((opt) => opt.value === value)
  const displayLabel = renderLabel
    ? renderLabel(value)
    : isSelected
    ? selectedOption?.label || value
    : label

  // 点击外部自动关闭下拉浮层
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* 胶囊按钮：样式严格对照设计图（浅灰背景、圆角、右侧向下三角小箭头） */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
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

      {/* 下拉浮层弹窗 */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div
            className="absolute z-50 mt-1 max-h-64 min-w-[150px] max-w-[240px] overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-xl animate-scale-up"
            style={{
              top:
                (containerRef.current?.getBoundingClientRect().bottom ?? 0) + 4,
              left: Math.max(
                12,
                Math.min(
                  containerRef.current?.getBoundingClientRect().left ?? 12,
                  window.innerWidth - 220
                )
              ),
            }}
            onClick={(e) => e.stopPropagation()}
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
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                    active
                      ? "bg-blue-50 font-bold text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {active && <Check className="size-3.5 text-blue-600 shrink-0 ml-1" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
