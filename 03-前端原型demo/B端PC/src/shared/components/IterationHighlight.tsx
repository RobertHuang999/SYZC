import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Sparkles, Info, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface IterationHighlightContextType {
  /** 版本视图三档：只看 6.3 变更 / 全部原型 / 还原线上 */
  viewMode: IterationViewMode
  setViewMode: (mode: IterationViewMode) => void
  /** 便捷布尔值：viewMode 不为 off 时为 true */
  highlightEnabled: boolean
  setHighlightEnabled: (enabled: boolean) => void
  toggleHighlight: () => void
  activeVersion: string
}

export type IterationViewMode = "focus63" | "all" | "off"

const IterationHighlightContext = createContext<IterationHighlightContextType>({
  viewMode: "all",
  setViewMode: () => {},
  highlightEnabled: true,
  setHighlightEnabled: () => {},
  toggleHighlight: () => {},
  activeVersion: "6.3",
})

const STORAGE_KEY = "syzc_iteration_view_mode"
const LEGACY_STORAGE_KEY = "syzc_iteration_highlight_enabled"

function readInitialViewMode(): IterationViewMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "focus63" || saved === "all" || saved === "off") {
      return saved
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy === "false") {
      return "off"
    }
  } catch {
    // ignore
  }
  return "all"
}

export function IterationHighlightProvider({
  children,
  defaultVersion = "6.3",
}: {
  children: ReactNode
  defaultVersion?: string
}) {
  const [viewMode, setViewMode] = useState<IterationViewMode>(readInitialViewMode)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, viewMode)
    } catch {
      // ignore
    }
  }, [viewMode])

  const setHighlightEnabled = (enabled: boolean) => setViewMode(enabled ? "all" : "off")
  const toggleHighlight = () => setViewMode((prev) => (prev === "off" ? "all" : "off"))

  return (
    <IterationHighlightContext.Provider
      value={{
        viewMode,
        setViewMode,
        highlightEnabled: viewMode !== "off",
        setHighlightEnabled,
        toggleHighlight,
        activeVersion: defaultVersion,
      }}
    >
      {children}
    </IterationHighlightContext.Provider>
  )
}

export function useIterationHighlight() {
  return useContext(IterationHighlightContext)
}

const VIEW_MODE_OPTIONS: Array<{
  value: IterationViewMode
  label: string
  title: string
}> = [
  {
    value: "focus63",
    label: "只看 6.3 变更",
    title: "只显示 6.3 新增或调整的琥珀框与改动点位，历史沿用点位收起",
  },
  {
    value: "all",
    label: "全部原型",
    title: "琥珀框与全部点位都显示；6.3 点位为琥珀色，历史沿用点位为浅灰",
  },
  {
    value: "off",
    label: "还原线上",
    title: "隐藏琥珀框与打点数字，还原真实线上视觉",
  },
]

/**
 * 顶栏版本视图开关：一个开关同时管住「琥珀框」与「页面打点」。
 */
export function IterationViewSwitch({ className }: { className?: string }) {
  const { viewMode, setViewMode } = useIterationHighlight()

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/[0.06] p-0.5 text-[11px]",
        className
      )}
      role="group"
      aria-label="原型版本视图"
    >
      {VIEW_MODE_OPTIONS.map((option) => {
        const active = viewMode === option.value
        return (
          <button
            key={option.value}
            type="button"
            title={option.title}
            onClick={() => setViewMode(option.value)}
            className={cn(
              "cursor-pointer rounded-full px-2 py-1 font-medium transition-colors",
              active
                ? option.value === "off"
                  ? "bg-slate-600 text-white"
                  : "bg-amber-500 text-white shadow-xs"
                : "text-amber-800/80 hover:bg-amber-500/15 dark:text-amber-200/80"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * 6.3 迭代版本改动高亮切换开关控件（可放置在导航栏或页面工具栏）
 */
export function IterationHighlightToggle({ className }: { className?: string }) {
  const { highlightEnabled, toggleHighlight, activeVersion } = useIterationHighlight()

  return (
    <button
      type="button"
      onClick={toggleHighlight}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-all border shadow-xs cursor-pointer select-none",
        highlightEnabled
          ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/50 hover:bg-amber-500/20"
          : "bg-muted/60 text-muted-foreground border-border hover:bg-muted",
        className
      )}
      title={highlightEnabled ? "点击隐藏 6.3 迭代改动点高亮（还原真实线上视觉）" : "点击开启 6.3 迭代改动点琥珀框高亮"}
    >
      {highlightEnabled ? (
        <>
          <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {activeVersion} 迭代高亮: [√ 开启]
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        </>
      ) : (
        <>
          <EyeOff className="w-3.5 h-3.5" />
          <span>{activeVersion} 迭代高亮: 关</span>
        </>
      )}
    </button>
  )
}

/**
 * 页面级 6.3 标识条：用于整页新增或改动分散、不宜逐块画框的场景。
 * 只在「只看 6.3 变更」与「全部原型」两档显示。
 */
export function IterationPageTag({
  version = "6.3",
  changeType = "新增",
  title,
  description,
  className,
}: {
  version?: string
  changeType?: "新增" | "优化" | "联动"
  title: string
  description?: string
  className?: string
}) {
  const { highlightEnabled } = useIterationHighlight()

  if (!highlightEnabled) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-amber-500/60 bg-amber-500/[0.06] px-3 py-2 text-xs",
        className
      )}
    >
      <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-1.5 py-0.5 text-[11px] font-semibold text-white">
        <Sparkles className="h-3 w-3" />
        {version} {changeType}
      </span>
      <span className="font-medium text-amber-900 dark:text-amber-100">{title}</span>
      {description ? (
        <span className="text-amber-800/80 dark:text-amber-200/80">{description}</span>
      ) : null}
    </div>
  )
}

export interface IterationHighlightProps {
  children: ReactNode
  version?: string
  ruleId?: string
  title: string
  description?: string
  type?: "added" | "modified" | "linked"
  inline?: boolean
  className?: string
  badgePosition?: "top-left" | "top-right" | "inline"
}

/**
 * 迭代高亮外框组件：使用琥珀边框和标识凸显 6.3 版本改动点
 */
export function IterationHighlight({
  children,
  version = "6.3",
  ruleId,
  title,
  description,
  type = "added",
  inline = false,
  className,
  badgePosition = "top-left",
}: IterationHighlightProps) {
  const { highlightEnabled } = useIterationHighlight()

  if (!highlightEnabled) {
    return <>{children}</>
  }

  const typeConfig = {
    added: { tag: "新增", tagClass: "bg-amber-500 text-white" },
    modified: { tag: "优化", tagClass: "bg-amber-600 text-white" },
    linked: { tag: "联动", tagClass: "bg-amber-700 text-white" },
  }[type]

  const Badge = (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold tracking-tight shadow-xs select-none",
        "bg-amber-500 text-white border border-amber-600",
        badgePosition === "top-left" && "absolute -top-3 left-3 z-20",
        badgePosition === "top-right" && "absolute -top-3 right-3 z-20",
        badgePosition === "inline" && "mb-1.5"
      )}
    >
      <Sparkles className="w-3 h-3 shrink-0" />
      <span>{version} {typeConfig.tag}</span>
      <span className="ml-0.5">· {title}{ruleId ? `（${ruleId}）` : ""}</span>
      {description && (
        <span
          className="ml-0.5 text-amber-100 cursor-help"
          title={description}
        >
          <Info className="w-3 h-3 inline opacity-90" />
        </span>
      )}
    </div>
  )

  if (inline) {
    return (
      <span
        className={cn(
          "relative inline-flex items-center rounded-md border-2 border-dashed border-amber-500/80 bg-amber-500/10 px-1.5 py-0.5 transition-all hover:bg-amber-500/15 group",
          className
        )}
      >
        {children}
        <span
          className="ml-1 inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-amber-500 text-white text-[10px] font-bold leading-none shadow-2xs"
          title={
            description
              ? `${title}${ruleId ? `（${ruleId}）` : ""}：${description}`
              : `${title}${ruleId ? `（${ruleId}）` : ""}`
          }
        >
          <Sparkles className="w-2.5 h-2.5" />
          {`${version} · ${title}`}
        </span>
      </span>
    )
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-dashed border-amber-500/80 bg-amber-500/[0.04] p-4 transition-all dark:border-amber-500/70 dark:bg-amber-500/[0.06]",
        badgePosition !== "inline" && "pt-5 mt-2",
        className
      )}
    >
      {Badge}
      {children}
      {description && (
        <div className="mt-3 flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-900 dark:text-amber-200 border border-amber-300/40 dark:border-amber-700/40">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>变更说明：</strong>
            {description}
          </span>
        </div>
      )}
    </div>
  )
}

