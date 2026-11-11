import { Bookmark, Home, Monitor, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { MOBILE_TAB_BADGE_COUNTS } from "@/data/mobile-tab-badges"
import { H5_PRIMARY } from "@/shared/h5-ui-theme"

export type BottomTabBadgeCounts = {
  workspace?: number
  tasks?: number
}

type BottomTabBarProps = {
  badgeCounts?: BottomTabBadgeCounts
}

function formatTabBadge(count: number) {
  return count > 99 ? "99+" : String(count)
}

/**
 * 小程序底部 Tab 栏：内容区高 50px，图标 24px、文字 10px，
 * 底部追加 iPhone 安全区内边距，真机不会被小白条挡住。
 */
export function BottomTabBar({ badgeCounts }: BottomTabBarProps = {}) {
  const location = useLocation()
  const currentPath = location.pathname
  const mergedBadges = { ...MOBILE_TAB_BADGE_COUNTS, ...badgeCounts }

  const tabs = [
    {
      id: "home",
      label: "首页",
      icon: Home,
      path: "/m/home",
      active: currentPath === "/" || currentPath === "/m/home",
      badge: undefined as number | undefined,
    },
    {
      id: "workspace",
      label: "工作台",
      icon: Monitor,
      path: "/m/workspace",
      active: currentPath.startsWith("/m/workspace"),
      badge: mergedBadges.workspace,
    },
    {
      id: "tasks",
      label: "业务办理",
      icon: Bookmark,
      path: "/m/tasks",
      active: currentPath.startsWith("/m/tasks"),
      badge: mergedBadges.tasks,
    },
    {
      id: "profile",
      label: "我的",
      icon: User,
      path: "/m/profile",
      active: currentPath.startsWith("/m/profile"),
      badge: undefined,
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
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-all active:opacity-70 ${
                isActive ? `font-semibold ${H5_PRIMARY.text}` : "text-gray-400"
              }`}
            >
              <span className="relative inline-flex">
                <Icon
                  className={`size-6 transition-transform ${
                    isActive ? "scale-105 stroke-[2.2]" : "stroke-[1.8]"
                  }`}
                />
                {tab.badge != null && tab.badge > 0 ? (
                  <span className="absolute -right-2.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-0.5 text-[8px] font-bold leading-none text-white ring-1 ring-white">
                    {formatTabBadge(tab.badge)}
                  </span>
                ) : null}
              </span>
              <span className="text-[10px] leading-none tracking-tight">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
