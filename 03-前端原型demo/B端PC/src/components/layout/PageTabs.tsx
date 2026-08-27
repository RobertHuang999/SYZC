import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getPageTabTitle } from "@/config/navigation"
import { cn } from "@/lib/utils"

type PageTab = {
  path: string
  label: string
}

const defaultPath = "/预警信息/设备预警信息"

export function PageTabs() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = `${location.pathname}${location.search}${location.hash}`
  const [tabs, setTabs] = useState<PageTab[]>([])

  useEffect(() => {
    setTabs((currentTabs) => {
      if (currentTabs.some((tab) => tab.path === currentPath)) {
        return currentTabs
      }

      return [
        ...currentTabs,
        { path: currentPath, label: getPageTabTitle(location.pathname) },
      ]
    })
  }, [currentPath, location.pathname])

  const closeTab = (path: string) => {
    const index = tabs.findIndex((tab) => tab.path === path)
    const nextTabs = tabs.filter((tab) => tab.path !== path)

    if (path === currentPath) {
      const fallback = nextTabs[index - 1] ?? nextTabs[index] ?? { path: defaultPath }
      navigate(fallback.path)
    }

    setTabs(nextTabs)
  }

  return (
    <nav className="page-tabs" aria-label="打开的页面">
      {tabs.map((tab) => {
        const isActive = tab.path === currentPath

        return (
          <div className={cn("page-tab", isActive && "is-active")} key={tab.path}>
            <button
              type="button"
              className="page-tab-trigger"
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
            {tabs.length > 1 && (
              <button
                type="button"
                className="page-tab-close"
                aria-label={`关闭${tab.label}`}
                onClick={() => closeTab(tab.path)}
              >
                <X size={13} strokeWidth={1.8} />
              </button>
            )}
          </div>
        )
      })}
    </nav>
  )
}
