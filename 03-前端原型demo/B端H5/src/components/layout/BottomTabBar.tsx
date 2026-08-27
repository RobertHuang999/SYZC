import { Bookmark, Home, Monitor, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function BottomTabBar() {
  const location = useLocation()
  const currentPath = location.pathname

  const tabs = [
    {
      id: "home",
      label: "首页",
      icon: Home,
      path: "/m/home",
      active: currentPath === "/" || currentPath === "/m/home",
    },
    {
      id: "workspace",
      label: "工作台",
      icon: Monitor,
      path: "/m/workspace",
      active: currentPath.startsWith("/m/workspace"),
    },
    {
      id: "tasks",
      label: "业务办理",
      icon: Bookmark,
      path: "/m/tasks",
      active: currentPath.startsWith("/m/tasks"),
    },
    {
      id: "profile",
      label: "我的",
      icon: User,
      path: "/m/profile",
      active: currentPath.startsWith("/m/profile"),
    },
  ]

  return (
    <nav className="shrink-0 z-30 flex h-14 w-full items-center justify-around border-t border-gray-200 bg-white/95 backdrop-blur-md px-1 shadow-xs select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.active
        return (
          <Link
            key={tab.id}
            to={tab.path}
            className={`flex flex-1 flex-col items-center justify-center py-1 transition-all active:scale-95 ${
              isActive
                ? "text-[#1875f0] font-semibold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon
              className={`size-5.5 transition-transform ${
                isActive ? "stroke-[2.5] scale-105" : "stroke-[1.8]"
              }`}
            />
            <span className="mt-0.5 text-[11px] leading-tight tracking-tight">
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
