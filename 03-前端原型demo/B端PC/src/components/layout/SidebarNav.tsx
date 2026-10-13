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

function isSidebarItemActive(itemPath: string, currentPath: string): boolean {
  if (currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)) {
    return true
  }
  if (itemPath === "/配置管理/仓库管理/仓库管理") {
    if (
      currentPath.startsWith("/配置管理/仓库管理/添加仓库") ||
      currentPath.startsWith("/配置管理/仓库管理/仓库/")
    ) {
      return true
    }
  }
  return false
}

function buildAccordionOpenGroups(
  groups: ReturnType<typeof getSidebarGroups>,
  currentPath: string,
): Record<string, boolean> {
  const activeGroup = groups.find((group) =>
    group.items.some((item) => isSidebarItemActive(item.path, currentPath)),
  )
  const openId = activeGroup?.id ?? groups[0]?.id
  return Object.fromEntries(groups.map((group) => [group.id, group.id === openId]))
}

export function SidebarNav({ activeModule }: SidebarNavProps) {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const currentPath = decodeURIComponent(pathname)
  const sidebarGroups = getSidebarGroups(activeModule)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    buildAccordionOpenGroups(sidebarGroups, currentPath),
  )

  useEffect(() => {
    setOpenGroups(buildAccordionOpenGroups(getSidebarGroups(activeModule), currentPath))
  }, [activeModule.id, currentPath])

  const setOnlyGroupOpen = (groupId: string) => {
    setOpenGroups(Object.fromEntries(sidebarGroups.map((group) => [group.id, group.id === groupId])))
  }

  const toggleGroup = (groupId: string) => {
    if (collapsed) {
      setCollapsed(false)
      setOnlyGroupOpen(groupId)
      return
    }

    setOpenGroups((current) => {
      if (current[groupId]) {
        return { ...current, [groupId]: false }
      }
      return Object.fromEntries(sidebarGroups.map((group) => [group.id, group.id === groupId]))
    })
  }

  return (
    <aside className={cn("sidebar", collapsed && "is-collapsed")}>
      <nav className="sidebar-nav" aria-label="主导航">
        {sidebarGroups.map((group) => {
          const groupActive = group.items.some((item) => isSidebarItemActive(item.path, currentPath))
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
                          (isActive || isSidebarItemActive(item.path, currentPath)) && "is-active",
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
