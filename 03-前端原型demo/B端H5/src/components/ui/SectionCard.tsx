import { useState, useEffect, type ReactNode } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type SectionCardProps = {
  title: string
  indicatorColor?: string // 竖条主题色，如 '#00a870' | '#f57c00' | '#1875f0'
  extra?: ReactNode // 标题右侧的额外内容（如操作按钮、Badge）
  collapsible?: boolean // 是否可折叠，默认 true
  defaultCollapsed?: boolean // 默认是否折叠
  collapsed?: boolean // 外部受控折叠状态
  onToggleCollapse?: (nextState: boolean) => void
  children: ReactNode
  className?: string
}

export function SectionCard({
  title,
  indicatorColor = "#00a870",
  extra,
  collapsible = true,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onToggleCollapse,
  children,
  className = "",
}: SectionCardProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(
    controlledCollapsed !== undefined ? controlledCollapsed : defaultCollapsed
  )

  // 当外部 controlledCollapsed 变化时（如点击“全部收起/全部展开”），同步内部状态
  useEffect(() => {
    if (controlledCollapsed !== undefined) {
      setInternalCollapsed(controlledCollapsed)
    }
  }, [controlledCollapsed])

  const handleToggle = () => {
    if (!collapsible) return
    const next = !internalCollapsed
    setInternalCollapsed(next)
    onToggleCollapse?.(next)
  }

  return (
    <section
      className={`rounded-2xl border border-gray-100/90 bg-white p-4 shadow-xs transition-all ${className}`}
    >
      {/* 头部标题栏：带设计图风格的垂直主题色条 + 标题 + 右侧折叠/操作区 */}
      <div
        className={`flex items-center justify-between ${
          !internalCollapsed ? "border-b border-gray-100/70 pb-3" : ""
        } ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="h-3.5 w-1 shrink-0 rounded-full"
            style={{ backgroundColor: indicatorColor }}
          />
          <h2 className="text-sm font-bold text-gray-900 truncate tracking-tight">
            {title}
          </h2>
        </div>

        <div
          className="flex items-center gap-2 shrink-0 text-xs"
          onClick={(e) => {
            // 如果点击的是 extra 内的操作，不触发折叠
            if (e.target !== e.currentTarget) {
              e.stopPropagation()
            }
          }}
        >
          {extra}

          {collapsible && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleToggle()
              }}
              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-gray-400 hover:text-gray-600 active:opacity-70 cursor-pointer"
            >
              <span>{internalCollapsed ? "展开" : "收起"}</span>
              {internalCollapsed ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronUp className="size-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 折叠内容区域 */}
      {!internalCollapsed && <div className="mt-3">{children}</div>}
    </section>
  )
}
