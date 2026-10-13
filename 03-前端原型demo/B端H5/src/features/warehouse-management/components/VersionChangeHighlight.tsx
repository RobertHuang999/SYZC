import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type Ctx = { showChanges: boolean; setShowChanges: (v: boolean) => void }

const VersionChangeContext = createContext<Ctx | null>(null)

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

function useCtx() {
  const ctx = useContext(VersionChangeContext)
  if (!ctx) throw new Error("VersionChangeProvider missing")
  return ctx
}

export function VersionChangeToggleBar() {
  const { showChanges, setShowChanges } = useCtx()
  return (
    <label className="mx-3 mb-2 flex items-center gap-2 rounded-lg border border-dashed border-amber-400/80 bg-amber-50 px-3 py-2 text-xs text-amber-950">
      <input
        type="checkbox"
        className="size-4 accent-amber-600"
        checked={showChanges}
        onChange={(e) => setShowChanges(e.target.checked)}
      />
      显示 6.3 变更标记（橙框）
    </label>
  )
}

export function ChangeHighlight({
  children,
  label = "6.3 变更",
}: {
  children: ReactNode
  label?: string
}) {
  const { showChanges } = useCtx()
  if (!showChanges) return <>{children}</>
  return (
    <div className="relative rounded-lg border-2 border-amber-400 bg-amber-50/80 p-2 pt-3">
      <span className="absolute -top-2 left-2 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
        {label}
      </span>
      {children}
    </div>
  )
}
