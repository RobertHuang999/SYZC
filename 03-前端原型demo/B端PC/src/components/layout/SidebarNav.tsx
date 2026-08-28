import { BellRing, Boxes, ChevronDown, ChevronLeft, ChevronRight, CircleGauge, Home, Settings2, ShieldAlert, Warehouse } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"
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
}

export function SidebarNav({ activeModule }: SidebarNavProps) {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const currentPath = decodeURIComponent(pathname)
  const sidebarGroups = getSidebarGroups(activeModule)

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

          return (
            <div className="sidebar-group" key={group.id}>
              <button className={cn("sidebar-item sidebar-group-toggle", groupActive && "is-group-active", collapsed && "is-collapsed")} type="button">
                <GroupIcon size={16} strokeWidth={1.7} />
                {!collapsed && <span>{group.label}</span>}
                {!collapsed && <ChevronDown className="sidebar-chevron" size={14} strokeWidth={1.7} />}
              </button>
              {!collapsed && (
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

      <button className={cn("sidebar-collapse", collapsed && "is-collapsed")} type="button" onClick={() => setCollapsed((value) => !value)}>
        <ChevronLeft size={15} strokeWidth={1.7} />
        {!collapsed && <span>收起菜单</span>}
        {collapsed && <ChevronRight size={15} strokeWidth={1.7} />}
      </button>
    </aside>
  )
}
