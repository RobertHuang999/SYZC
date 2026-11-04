import { Bookmark, Home, Monitor, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

/**
 * 小程序底部 Tab 栏：内容区高 50px，图标 24px、文字 10px，
 * 底部追加 iPhone 安全区内边距，真机不会被小白条挡住。
 */
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
    <nav className="relative z-30 flex w-full shrink-0 flex-col border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md select-none">
      <div className="flex h-[50px] w-full items-stretch px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.active
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-all active:opacity-70 ${
                isActive
                  ? "text-[#1875f0] font-semibold"
                  : "text-gray-400"
              }`}
            >
              <Icon
                className={`size-6 transition-transform ${
                  isActive ? "stroke-[2.2] scale-105" : "stroke-[1.8]"
                }`}
              />
              <span className="text-[10px] leading-none tracking-tight">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
