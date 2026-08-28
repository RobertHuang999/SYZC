import {
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Database,
  LayoutGrid,
  Package,
  ShoppingCart,
  Store,
  Truck,
  Warehouse,
} from "lucide-react"
import type { ComponentType } from "react"

type MenuItem = {
  label: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
}

const basicItems: MenuItem[] = [
  { label: "商品管理", icon: LayoutGrid },
  { label: "客户管理", icon: CircleUserRound },
  { label: "供应商管理", icon: Store },
  { label: "仓库管理", icon: Warehouse },
  { label: "物流管理", icon: Truck },
  { label: "数据字典", icon: Database },
]

const businessItems: MenuItem[] = [
  { label: "采购管理", icon: Truck },
  { label: "销售管理", icon: ShoppingCart },
  { label: "库存管理", icon: Boxes },
]

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

function MenuButton({ item, active = false, collapsed }: { item: MenuItem; active?: boolean; collapsed: boolean }) {
  const Icon = item.icon
  return (
    <button className={`sidebar-item ${active ? "is-active" : ""} ${collapsed ? "is-collapsed" : ""}`} type="button">
      <Icon size={16} strokeWidth={1.7} />
      {!collapsed && <span>{item.label}</span>}
    </button>
  )
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <nav className="sidebar-nav" aria-label="主导航">
        <MenuButton item={{ label: "首页", icon: Package }} collapsed={collapsed} />

        <div className="sidebar-group">
          <button className={`sidebar-item sidebar-group-toggle ${collapsed ? "is-collapsed" : ""}`} type="button">
            <Package size={16} strokeWidth={1.7} />
            {!collapsed && <span>基础资料</span>}
            {!collapsed && <ChevronDown className="sidebar-chevron" size={14} strokeWidth={1.7} />}
          </button>
          <div className="sidebar-submenu">
            {basicItems.map((item) => (
              <MenuButton key={item.label} item={item} active={item.label === "商品管理"} collapsed={collapsed} />
            ))}
          </div>
        </div>

        <div className="sidebar-group business-group">
          {businessItems.map((item) => {
            const Icon = item.icon
            return (
              <button className={`sidebar-item ${collapsed ? "is-collapsed" : ""}`} type="button" key={item.label}>
                <Icon size={16} strokeWidth={1.7} />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && <ChevronRight className="sidebar-chevron" size={14} strokeWidth={1.7} />}
              </button>
            )
          })}
        </div>
      </nav>

      <button className={`sidebar-collapse ${collapsed ? "is-collapsed" : ""}`} type="button" onClick={onToggle}>
        <ChevronLeft size={15} strokeWidth={1.7} />
        {!collapsed && <span>收起菜单</span>}
      </button>
    </aside>
  )
}
