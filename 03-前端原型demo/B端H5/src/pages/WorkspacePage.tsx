import { LayoutGrid } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { MobileShell } from "@/components/layout/MobileShell"
import { MOBILE_MENU_ITEMS, type MenuItemData } from "@/data/mobileMenuData"
import { collateralWarningEventsMock } from "@/features/collateral-warning-events/mock/collateral-warning-events.mock"
import { deviceWarningEventsMock } from "@/features/device-warning-events/mock/device-warning-events.mock"
import { openMenuModule } from "@/lib/open-menu-module"
import { IconRenderer } from "@/components/common/IconRenderer"

interface WorkstationItem extends MenuItemData {
  bgColor: string
  badgeCount?: number
}

const DEVICE_PENDING_COUNT = deviceWarningEventsMock.filter(
  (event) => event.warningStatus === "OPEN_VALID",
).length

const COLLATERAL_PENDING_COUNT = collateralWarningEventsMock.filter(
  (event) => event.warningStatus === "OPEN_VALID",
).length

function formatBadgeCount(count: number) {
  return count > 99 ? "99+" : String(count)
}

interface WorkstationGroup {
  groupName: string
  items: WorkstationItem[]
}

const WORKSPACE_GROUP_ORDER = ["仓储", "融资/监管", "交易", "风控", "结算", "配置管理"]

// 设备管理是工作台的聚合 hub，其他 4 个设备 Tab 从 hub 内进入。
const DEVICE_HUB_TAB_IDS = new Set([
  "ws-device-iot",
  "ws-device-access",
  "ws-device-gps",
  "ws-device-access-logs",
])

const GROUP_ACCENT_COLORS: Record<string, readonly string[]> = {
  仓储: ["bg-[#1875f0]", "bg-[#f57c00]", "bg-[#0288d1]", "bg-[#e53935]", "bg-[#1976d2]"],
  "融资/监管": ["bg-[#1875f0]", "bg-[#43a047]", "bg-[#0288d1]", "bg-[#1976d2]", "bg-[#e53935]"],
  交易: ["bg-[#e53935]", "bg-[#1e88e5]", "bg-[#43a047]"],
  风控: ["bg-[#f57c00]", "bg-[#e53935]", "bg-[#43a047]", "bg-[#1e88e5]"],
  结算: ["bg-[#1875f0]", "bg-[#43a047]", "bg-[#e53935]"],
  配置管理: ["bg-[#1875f0]", "bg-[#43a047]", "bg-[#0288d1]", "bg-[#1976d2]"],
}

const WORKSPACE_BADGE_COUNTS: Record<string, number> = {
  "ws-risk-device-warning": DEVICE_PENDING_COUNT,
  "ws-risk-order-warning": COLLATERAL_PENDING_COUNT,
}

const WORKSPACE_GROUPS: WorkstationGroup[] = WORKSPACE_GROUP_ORDER.map((groupName) => ({
  groupName,
  items: MOBILE_MENU_ITEMS.filter(
    (item) =>
      item.primaryModule === "工作台" &&
      item.secondaryCategory === groupName &&
      !DEVICE_HUB_TAB_IDS.has(item.id),
  ).map((item, index) => ({
    ...item,
    bgColor: GROUP_ACCENT_COLORS[groupName][index % GROUP_ACCENT_COLORS[groupName].length],
    badgeCount: WORKSPACE_BADGE_COUNTS[item.id],
  })),
}))

export function WorkspacePage() {
  const navigate = useNavigate()

  const handleItemClick = (item: WorkstationItem) => {
    openMenuModule(navigate, item.id)
  }

  return (
    <MobileShell>
      {/* 顶部标题栏 */}
      <div className="flex h-11 shrink-0 items-center justify-between px-4">
        <h1 className="text-lg font-bold text-gray-900">工作台</h1>
        <button
          type="button"
          className="flex size-8 items-center justify-center text-gray-700"
        >
          <LayoutGrid className="size-5" />
        </button>
      </div>

      {/* 滚动工作台分组列表 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-3 overscroll-contain">
        {WORKSPACE_GROUPS.map((group) => (
          <section
            key={group.groupName}
            className="rounded-2xl bg-white p-3.5 shadow-xs space-y-3"
          >
            {/* 分组标题 */}
            <h2 className="text-xs font-bold text-gray-800 tracking-tight">
              {group.groupName}
            </h2>

            {/* 5列等宽宫格网格 */}
            <div className="grid grid-cols-5 gap-y-3.5 gap-x-1">
              {group.items.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="group flex flex-col items-center cursor-pointer active:scale-95 transition-transform text-center"
                  >
                    {/* 彩色圆角方形图标底座 */}
                    <div className="relative">
                      <div
                        className={`flex size-10 items-center justify-center rounded-[12px] text-white shadow-xs ${item.bgColor}`}
                      >
                        <IconRenderer icon={item.iconType} className="size-5 stroke-[2.2]" />
                      </div>
                      {item.badgeCount != null && item.badgeCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-1 ring-white">
                          {formatBadgeCount(item.badgeCount)}
                        </span>
                      )}
                    </div>

                    {/* 文字标签 */}
                    <span className="mt-1.5 line-clamp-2 text-[10px] leading-tight text-gray-700 font-medium tracking-tighter">
                      {item.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* 底部导航栏 */}
      <BottomTabBar />
    </MobileShell>
  )
}
