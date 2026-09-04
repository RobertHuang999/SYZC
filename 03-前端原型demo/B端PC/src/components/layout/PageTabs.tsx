import { X } from "lucide-react"
import { useEffect, useState, type MouseEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getPageTabTitle, topModules } from "@/config/navigation"
import { cn } from "@/lib/utils"

type PageTab = {
  path: string
  label: string
}

const defaultPath = topModules[0].path

/** 去掉 Deep link 参数，避免关闭详情 Tab 后又被列表页自动跳回详情 */
function stripDeepLinkParams(path: string): string {
  const qIndex = path.indexOf("?")
  if (qIndex === -1) return path

  const pathname = path.slice(0, qIndex)
  const rest = path.slice(qIndex)
  const hashIndex = rest.indexOf("#")
  const search = hashIndex === -1 ? rest : rest.slice(0, hashIndex)
  const hash = hashIndex === -1 ? "" : rest.slice(hashIndex)
  const params = new URLSearchParams(search.slice(1))

  if (!params.has("applyNo")) return path

  params.delete("applyNo")
  const nextSearch = params.toString()
  return `${pathname}${nextSearch ? `?${nextSearch}` : ""}${hash}`
}

function getUnlockApplyNoFromPath(pathname: string): string | null {
  const match = pathname.match(/\/unlock-applies\/(UA[^/?#]+)/)
  return match?.[1] ?? null
}

/** 进入详情后，同步清理列表 Tab 上残留的 applyNo，防止关闭详情 Tab 时循环跳转 */
function normalizeTabsForPath(tabs: PageTab[], pathname: string): PageTab[] {
  const applyNo = getUnlockApplyNoFromPath(pathname)
  if (!applyNo) return tabs

  return tabs.map((tab) => {
    if (!tab.path.includes(`applyNo=${applyNo}`)) return tab
    const cleaned = stripDeepLinkParams(tab.path)
    return cleaned === tab.path ? tab : { ...tab, path: cleaned }
  })
}

export function PageTabs() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = `${location.pathname}${location.search}${location.hash}`
  const [tabs, setTabs] = useState<PageTab[]>([])

  useEffect(() => {
    setTabs((currentTabs) => {
      let next = normalizeTabsForPath(currentTabs, location.pathname)

      if (next.some((tab) => tab.path === currentPath)) {
        return next
      }

      return [
        ...next,
        { path: currentPath, label: getPageTabTitle(location.pathname) },
      ]
    })
  }, [currentPath, location.pathname])

  const closeTab = (path: string, event: MouseEvent) => {
    event.stopPropagation()

    const index = tabs.findIndex((tab) => tab.path === path)
    const nextTabs = tabs.filter((tab) => tab.path !== path)

    if (path === currentPath) {
      const fallbackPath = stripDeepLinkParams(
        (nextTabs[index - 1] ?? nextTabs[index] ?? { path: defaultPath }).path
      )
      navigate(fallbackPath)
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
                onClick={(event) => closeTab(tab.path, event)}
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
