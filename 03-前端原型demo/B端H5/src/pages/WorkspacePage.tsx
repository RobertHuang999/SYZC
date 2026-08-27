import { useState } from "react"
import {
  AlertOctagon,
  AlertTriangle,
  Archive,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  BellRing,
  BookOpen,
  Boxes,
  Building,
  Camera,
  ClipboardCheck,
  Cpu,
  Factory,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FolderCheck,
  HandCoins,
  Layers,
  LayoutGrid,
  ListOrdered,
  Lock,
  QrCode,
  ReceiptText,
  RefreshCcw,
  SearchCheck,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Warehouse,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BuildingToast } from "@/components/common/BuildingToast"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { MobileShell } from "@/components/layout/MobileShell"

interface WorkstationItem {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  customRoute?: string
  isAvailable?: boolean // 仅预警两大功能为 true
}

interface WorkstationGroup {
  groupName: string
  items: WorkstationItem[]
}

const WORKSPACE_GROUPS: WorkstationGroup[] = [
  {
    groupName: "仓储",
    items: [
      {
        id: "ws-inventory-mgr",
        name: "存货管理",
        icon: Boxes,
        bgColor: "bg-[#1875f0]",
      },
      {
        id: "ws-receipt-mgr",
        name: "仓单管理",
        icon: FileText,
        bgColor: "bg-[#f57c00]",
      },
      {
        id: "ws-cargo-rights",
        name: "货权档案",
        icon: FolderCheck,
        bgColor: "bg-[#0288d1]",
      },
      {
        id: "ws-evidence-mgr",
        name: "证据管理",
        icon: ShieldCheck,
        bgColor: "bg-[#e53935]",
      },
      {
        id: "ws-inbound-mgr",
        name: "入库管理",
        icon: ArrowDownToLine,
        bgColor: "bg-[#1976d2]",
      },
      {
        id: "ws-outbound-mgr",
        name: "出库管理",
        icon: ArrowUpFromLine,
        bgColor: "bg-[#fb8c00]",
      },
      {
        id: "ws-transfer-loc-mgr",
        name: "移库管理",
        icon: ArrowLeftRight,
        bgColor: "bg-[#43a047]",
      },
      {
        id: "ws-transfer-owner-mgr",
        name: "货物转让",
        icon: RefreshCcw,
        bgColor: "bg-[#e53935]",
      },
      {
        id: "ws-delivery-order",
        name: "提货单",
        icon: QrCode,
        bgColor: "bg-[#1e88e5]",
      },
      {
        id: "ws-stock-taking",
        name: "货物盘点",
        icon: ClipboardCheck,
        bgColor: "bg-[#f57c00]",
      },
      {
        id: "ws-device-monitoring",
        name: "设备管理",
        icon: Camera,
        bgColor: "bg-[#43a047]",
      },
      {
        id: "ws-cargo-movement",
        name: "异动管理",
        icon: SlidersHorizontal,
        bgColor: "bg-[#e53935]",
      },
      {
        id: "ws-tally-stacking",
        name: "理货堆放",
        icon: Layers,
        bgColor: "bg-[#fb8c00]",
      },
      {
        id: "ws-stock-detail",
        name: "库存明细",
        icon: ListOrdered,
        bgColor: "bg-[#43a047]",
      },
      {
        id: "ws-inventory-flow",
        name: "库存流水",
        icon: HandCoins,
        bgColor: "bg-[#1e88e5]",
      },
      {
        id: "ws-processing-mgr",
        name: "加工管理",
        icon: Cpu,
        bgColor: "bg-[#f57c00]",
      },
    ],
  },
  {
    groupName: "融资/监管",
    items: [
      {
        id: "biz-init-pledge-biz",
        name: "抵质押业务办理",
        icon: Lock,
        bgColor: "bg-[#1875f0]",
      },
      {
        id: "ws-credit-process",
        name: "客户融资需求管理",
        icon: HandCoins,
        bgColor: "bg-[#43a047]",
      },
      {
        id: "ws-supervision-archive",
        name: "监管档案",
        icon: Archive,
        bgColor: "bg-[#0288d1]",
      },
      {
        id: "ws-due-diligence-process",
        name: "客户融资尽调办理",
        icon: SearchCheck,
        bgColor: "bg-[#1976d2]",
      },
    ],
  },
  {
    groupName: "交易",
    items: [
      {
        id: "ws-trade-procure",
        name: "采购需求管理",
        icon: ShoppingCart,
        bgColor: "bg-[#e53935]",
      },
      {
        id: "ws-trade-sales",
        name: "销售需求管理",
        icon: Store,
        bgColor: "bg-[#1e88e5]",
      },
      {
        id: "ws-policy-news",
        name: "政策资讯",
        icon: BookOpen,
        bgColor: "bg-[#43a047]",
      },
    ],
  },
  {
    groupName: "风控",
    items: [
      {
        id: "ws-risk-device-warning",
        name: "设备预警信息",
        icon: BellRing,
        bgColor: "bg-[#f57c00]",
        customRoute: "/m/iot/device-warning-events",
        isAvailable: true,
      },
      {
        id: "ws-risk-order-warning",
        name: "押品预警信息",
        icon: AlertTriangle,
        bgColor: "bg-[#e53935]",
        customRoute: "/m/supervision/order-warnings",
        isAvailable: true,
      },
      {
        id: "ws-risk-device-events",
        name: "设备事务通知",
        icon: AlertOctagon,
        bgColor: "bg-[#43a047]",
      },
      {
        id: "ws-risk-in-loan",
        name: "贷中风控管理",
        icon: ShieldCheck,
        bgColor: "bg-[#1e88e5]",
      },
      {
        id: "ws-risk-publicity",
        name: "风险公示",
        icon: FileCheck2,
        bgColor: "bg-[#e53935]",
      },
    ],
  },
  {
    groupName: "结算",
    items: [
      {
        id: "ws-settle-mgr",
        name: "结算管理",
        icon: ReceiptText,
        bgColor: "bg-[#1875f0]",
      },
      {
        id: "ws-settle-income-new",
        name: "新增收入结算单",
        icon: ArrowDownToLine,
        bgColor: "bg-[#43a047]",
      },
      {
        id: "ws-settle-expense-new",
        name: "新增支出结算单",
        icon: ArrowUpFromLine,
        bgColor: "bg-[#e53935]",
      },
    ],
  },
  {
    groupName: "配置管理",
    items: [
      {
        id: "ws-conf-warehouse",
        name: "仓库管理",
        icon: Warehouse,
        bgColor: "bg-[#1875f0]",
      },
      {
        id: "ws-conf-warehouse-new",
        name: "新增仓库",
        icon: Building,
        bgColor: "bg-[#43a047]",
      },
      {
        id: "ws-conf-industrial-site-new",
        name: "新增产业地",
        icon: Factory,
        bgColor: "bg-[#0288d1]",
      },
      {
        id: "ws-conf-industrial-site-mgr",
        name: "产业地信息管理",
        icon: FileSpreadsheet,
        bgColor: "bg-[#1976d2]",
      },
    ],
  },
]

export function WorkspacePage() {
  const navigate = useNavigate()
  const [toastFeature, setToastFeature] = useState<string | null>(null)

  const handleItemClick = (item: WorkstationItem) => {
    if (item.isAvailable && item.customRoute) {
      navigate(item.customRoute)
    } else {
      setToastFeature(item.name)
    }
  }

  return (
    <MobileShell>
      {/* 正在构建 Toast 提示 */}
      <BuildingToast
        featureName={toastFeature}
        onClose={() => setToastFeature(null)}
      />

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
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
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
                const IconComponent = item.icon
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="group flex flex-col items-center cursor-pointer active:scale-95 transition-transform text-center"
                  >
                    {/* 彩色圆角方形图标底座 */}
                    <div
                      className={`flex size-10 items-center justify-center rounded-[12px] text-white shadow-xs ${item.bgColor}`}
                    >
                      <IconComponent className="size-5 stroke-[2.2]" />
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
