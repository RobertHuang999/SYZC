import { useEffect } from "react"
import { Construction } from "lucide-react"

interface BuildingToastProps {
  featureName: string | null
  onClose: () => void
}

export function BuildingToast({ featureName, onClose }: BuildingToastProps) {
  useEffect(() => {
    if (!featureName) return
    const timer = setTimeout(() => {
      onClose()
    }, 2000)
    return () => clearTimeout(timer)
  }, [featureName, onClose])

  if (!featureName) return null

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-md border border-slate-700/60 animate-fade-in select-none">
      <Construction className="size-4 text-amber-400 shrink-0" />
      <span>
        【<span className="text-amber-300">{featureName}</span>】功能正在构建中
      </span>
    </div>
  )
}
