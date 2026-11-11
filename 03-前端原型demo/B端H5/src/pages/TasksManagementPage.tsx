import { useState } from "react"
import { ChevronRight, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { IconRenderer } from "@/components/common/IconRenderer"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { MOBILE_MENU_ITEMS, type MenuItemData } from "@/data/mobileMenuData"
import { openMenuModule } from "@/lib/open-menu-module"

interface TaskHubItem extends MenuItemData {
  bgColor: string
  badgeCount?: number
}

const PENDING_CONFIRM_TOTAL = 60
const TODAY_NEW_TOTAL = 0

const TASK_SECTION_ORDER = ["内部审批", "业务发起", "客户需求审批", "其他审批"] as const

const TASK_ITEM_ORDER: Record<string, readonly string[]> = {
  内部审批: [
    "biz-overview-pending",
    "biz-overview-cc",
    "biz-overview-processed",
    "biz-overview-supervision-entrust",
    "biz-overview-my-apply",
    "biz-overview-biz-apply",
  ],
  业务发起: [
    "biz-init-inbound",
    "biz-init-outbound",
    "biz-init-transfer-loc",
    "biz-init-transfer-owner",
    "biz-init-receipt-issue",
    "biz-init-pledge-biz",
    "biz-init-movement-apply",
    "biz-init-processing-apply",
  ],
  客户需求审批: [
    "biz-approve-customer-inbound-appoint",
    "biz-approve-customer-outbound-appoint",
    "biz-approve-customer-finance-leads",
    "biz-approve-customer-sales-req",
    "biz-approve-customer-procure-req",
    "biz-approve-due-diligence-sso",
  ],
  其他审批: ["biz-approve-policy-news", "biz-approve-unlock-apply", "biz-approve-in-loan-risk-sso"],
}

const INTERNAL_APPROVAL_ICON_COLORS: Record<string, string> = {
  "biz-overview-pending": "bg-[#f57c00]",
  "biz-overview-cc": "bg-[#1875f0]",
  "biz-overview-processed": "bg-[#43a047]",
  "biz-overview-supervision-entrust": "bg-[#1875f0]",
  "biz-overview-my-apply": "bg-[#43a047]",
  "biz-overview-biz-apply": "bg-[#e53935]",
}

const TASK_GRID_ACCENT: Record<string, readonly string[]> = {
  业务发起: [
    "bg-[#1875f0]",
    "bg-[#fb8c00]",
    "bg-[#43a047]",
    "bg-[#e53935]",
    "bg-[#f57c00]",
    "bg-[#1875f0]",
    "bg-[#e53935]",
    "bg-[#1976d2]",
  ],
  客户需求审批: [
    "bg-[#1875f0]",
    "bg-[#fb8c00]",
    "bg-[#43a047]",
    "bg-[#1e88e5]",
    "bg-[#e53935]",
    "bg-[#1976d2]",
  ],
  其他审批: ["bg-[#43a047]", "bg-[#f57c00]", "bg-[#1875f0]"],
}

/** 与参考截图一致的演示角标（原型 Mock，非真实待办统计） */
const TASK_BADGE_COUNTS: Record<string, number> = {
  "biz-overview-pending": 3,
  "biz-overview-supervision-entrust": 53,
  "biz-approve-customer-finance-leads": 1,
  "biz-approve-customer-sales-req": 1,
  "biz-approve-customer-procure-req": 1,
  "biz-approve-policy-news": 2,
}

function formatBadgeCount(count: number) {
  return count > 99 ? "99+" : String(count)
}

function sortTaskItems(sectionName: string, items: MenuItemData[]): MenuItemData[] {
  const order = TASK_ITEM_ORDER[sectionName]
  if (!order) return items
  const rank = new Map(order.map((id, index) => [id, index]))
  const allowed = new Set(order)
  return items
    .filter((item) => allowed.has(item.id))
    .sort((a, b) => {
      const ra = rank.get(a.id) ?? 999
      const rb = rank.get(b.id) ?? 999
      return ra - rb
    })
}

function buildTaskSections(): { sectionName: string; items: TaskHubItem[] }[] {
  return TASK_SECTION_ORDER.map((sectionName) => {
    const raw = MOBILE_MENU_ITEMS.filter(
      (item) =>
        item.primaryModule === "业务办理" &&
        item.secondaryCategory === sectionName &&
        item.enabled !== false,
    )
    const sorted = sortTaskItems(sectionName, raw)
    const accents = TASK_GRID_ACCENT[sectionName]

    return {
      sectionName,
      items: sorted.map((item, index) => ({
        ...item,
        bgColor:
          sectionName === "内部审批"
            ? (INTERNAL_APPROVAL_ICON_COLORS[item.id] ?? "bg-[#1875f0]")
            : (accents?.[index % (accents?.length ?? 1)] ?? "bg-[#1875f0]"),
        badgeCount: TASK_BADGE_COUNTS[item.id],
      })),
    }
  })
}

const TASK_SECTIONS = buildTaskSections()

function InternalApprovalCard({
  item,
  onOpen,
}: {
  item: TaskHubItem
  onOpen: (id: string) => void
}) {
  return (
    <div
      onClick={() => onOpen(item.id)}
      className="relative flex min-h-[92px] flex-col justify-between rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100 transition-colors"
    >
      <div className="flex items-start justify-between gap-1">
        <div
          className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-white ${item.bgColor}`}
        >
          <IconRenderer icon={item.iconType} className="size-4 stroke-[2.2]" />
        </div>
        {item.badgeCount != null && item.badgeCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white">
            {formatBadgeCount(item.badgeCount)}
          </span>
        )}
      </div>
      <div className="mt-2 text-xs font-bold text-gray-900 leading-snug">{item.name}</div>
      <div className="mt-1 flex items-center text-[10px] font-medium text-gray-400">
        <span>查看</span>
        <ChevronRight className="size-2.5" />
      </div>
    </div>
  )
}

function GridIconItem({
  item,
  onOpen,
}: {
  item: TaskHubItem
  onOpen: (id: string) => void
}) {
  return (
    <div
      onClick={() => onOpen(item.id)}
      className="group flex flex-col items-center cursor-pointer active:scale-95 transition-transform text-center"
    >
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
      <span className="mt-1.5 line-clamp-2 text-[10px] leading-tight text-gray-700 font-medium tracking-tighter">
        {item.name}
      </span>
    </div>
  )
}

export function TasksManagementPage() {
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  const openFeature = (id: string) => openMenuModule(navigate, id)

  return (
    <MobileShell>
      <NavBar title="业务办理" showBack={false} />

      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-3 overscroll-contain">
        <section className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">待确认合计</span>
            <span className="text-base font-bold text-gray-900">{PENDING_CONFIRM_TOTAL}</span>
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              今日新增 {TODAY_NEW_TOTAL}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className={`text-gray-400 hover:text-gray-600 active:scale-95 ${
              isRefreshing ? "animate-spin text-blue-600" : ""
            }`}
          >
            <RefreshCw className="size-4" />
          </button>
        </section>

        {TASK_SECTIONS.map((section) => (
          <section key={section.sectionName} className="rounded-2xl bg-white p-3.5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-gray-800 tracking-tight">{section.sectionName}</h2>

            {section.sectionName === "内部审批" ? (
              <div className="grid grid-cols-3 gap-2">
                {section.items.map((item) => (
                  <InternalApprovalCard key={item.id} item={item} onOpen={openFeature} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-y-3.5 gap-x-1 text-center">
                {section.items.map((item) => (
                  <GridIconItem key={item.id} item={item} onOpen={openFeature} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <BottomTabBar />
    </MobileShell>
  )
}
