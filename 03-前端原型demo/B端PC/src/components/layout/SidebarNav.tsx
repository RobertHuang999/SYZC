import { BellRing, Boxes, ChevronDown, ChevronLeft, ChevronRight, CircleGauge, Home, Settings2, ShieldAlert, Warehouse } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { getSidebarGroups, type TopModule } from "@/config/navigation"
import { cn } from "@/lib/utils"

type SidebarNavProps = {
  activeModule: TopModule
}

const groupIcons: Record<string, LucideIcon> = {
  "device-management": Boxes,
  "warning-information": BellRing,
  "warning-configuration": Settings2,
  inventory: Warehouse,
  "warehouse-order": Boxes,
  ownership: ShieldAlert,
  financing: CircleGauge,
  pledge: ShieldAlert,
  "financing-contract": Boxes,
  supervision: CircleGauge,
  "trade-demand": Boxes,
  "trade-contract": Boxes,
  customer: Boxes,
  "risk-center": CircleGauge,
  "risk-information": BellRing,
  "organization-report": CircleGauge,
  "institution-report": CircleGauge,
  "settlement-management": Boxes,
  "business-process": Settings2,
  "功能入口": Home,
}

function buildDefaultOpenGroups(groups: ReturnType<typeof getSidebarGroups>) {
  return Object.fromEntries(groups.map((group) => [group.id, true]))
}

export function SidebarNav({ activeModule }: SidebarNavProps) {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const currentPath = decodeURIComponent(pathname)
  const sidebarGroups = getSidebarGroups(activeModule)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => buildDefaultOpenGroups(sidebarGroups))

  useEffect(() => {
    setOpenGroups(buildDefaultOpenGroups(getSidebarGroups(activeModule)))
  }, [activeModule.id])

  const toggleGroup = (groupId: string) => {
    if (collapsed) {
      setCollapsed(false)
      setOpenGroups((current) => ({ ...current, [groupId]: true }))
      return
    }

    setOpenGroups((current) => ({ ...current, [groupId]: !current[groupId] }))
  }

  return (
    <aside className={cn("sidebar", collapsed && "is-collapsed")}>
      <nav className="sidebar-nav" aria-label="主导航">
        <button className={cn("sidebar-item", collapsed && "is-collapsed")} type="button">
          <Home size={16} strokeWidth={1.7} />
          {!collapsed && <span>首页</span>}
        </button>

        {sidebarGroups.map((group) => {
          const groupActive = group.items.some((item) => currentPath === item.path || currentPath.startsWith(`${item.path}/`))
          const GroupIcon = groupIcons[group.id] ?? Boxes

          const isOpen = openGroups[group.id] ?? false

          return (
            <div className="sidebar-group" key={group.id}>
              <button
                className={cn("sidebar-item sidebar-group-toggle", groupActive && "is-group-active", collapsed && "is-collapsed")}
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleGroup(group.id)}
              >
                <GroupIcon size={16} strokeWidth={1.7} />
                {!collapsed && <span>{group.label}</span>}
                {!collapsed && (
                  <ChevronDown className={cn("sidebar-chevron", !isOpen && "is-closed")} size={14} strokeWidth={1.7} />
                )}
              </button>
              {!collapsed && isOpen && (
                <div className="sidebar-submenu">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "sidebar-item sidebar-subitem",
                          (isActive || currentPath === item.path || currentPath.startsWith(`${item.path}/`)) && "is-active",
                        )
                      }
                    >
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <button
        className={cn("sidebar-collapse", collapsed && "is-collapsed")}
        type="button"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "展开菜单" : "收起菜单"}
        onClick={() => setCollapsed((value) => !value)}
      >
        {collapsed ? <ChevronRight size={15} strokeWidth={1.7} /> : <ChevronLeft size={15} strokeWidth={1.7} />}
        {!collapsed && <span>收起菜单</span>}
      </button>
    </aside>
  )
}
