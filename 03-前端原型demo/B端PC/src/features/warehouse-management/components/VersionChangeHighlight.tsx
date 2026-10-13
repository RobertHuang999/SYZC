import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

type VersionChangeContextValue = {
  showChanges: boolean
  setShowChanges: (value: boolean) => void
}

const VersionChangeContext = createContext<VersionChangeContextValue | null>(
  null
)

export function VersionChangeProvider({ children }: { children: ReactNode }) {
  const [showChanges, setShowChanges] = useState(true)
  const value = useMemo(
    () => ({ showChanges, setShowChanges }),
    [showChanges]
  )
  return (
    <VersionChangeContext.Provider value={value}>
      {children}
    </VersionChangeContext.Provider>
  )
}

function useVersionChangeContext() {
  const ctx = useContext(VersionChangeContext)
  if (!ctx) {
    throw new Error("VersionChangeProvider 未挂载")
  }
  return ctx
}

export function VersionChangeToggleBar() {
  const { showChanges, setShowChanges } = useVersionChangeContext()
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-sm dark:border-primary/50 dark:bg-primary/10">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          className="size-4 rounded border-primary/40 accent-primary"
          checked={showChanges}
          onChange={(event) => setShowChanges(event.target.checked)}
        />
        <span>显示 6.3 变更标记</span>
      </label>
      <span className="text-xs text-muted-foreground">
        关闭后页面按交付态展示，便于对照旧版习惯
      </span>
    </div>
  )
}

type ChangeHighlightProps = {
  children: ReactNode
  className?: string
  label?: string
}

export function ChangeHighlight({
  children,
  className,
  label = "6.3 变更",
}: ChangeHighlightProps) {
  const { showChanges } = useVersionChangeContext()
  if (!showChanges) {
    return <>{children}</>
  }
  return (
    <div
      className={cn(
        "relative rounded-md border-2 border-primary/60 bg-primary/5 p-2 dark:border-primary/50 dark:bg-primary/10",
        className
      )}
    >
      <span className="absolute -top-2.5 left-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary-foreground shadow-sm">
        {label}
      </span>
      <div className="pt-1">{children}</div>
    </div>
  )
}
