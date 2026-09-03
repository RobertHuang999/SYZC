import { useState } from "react"
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileCheck,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Lock,
  RefreshCcw,
  RefreshCw,
  SearchCheck,
  Send,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  Workflow,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BottomTabBar } from "@/components/layout/BottomTabBar"
import { MobileShell } from "@/components/layout/MobileShell"
import { openMenuModule } from "@/lib/open-menu-module"

export function TasksManagementPage() {
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  const openFeature = (nameOrId: string) => openMenuModule(navigate, nameOrId)

  const openOtherApproval = (moduleId: string) => {
    openMenuModule(navigate, moduleId)
  }

  return (
      <MobileShell>
      {/* 顶部标题栏 */}
      <div className="px-4 pt-3 pb-1">
        <h1 className="text-lg font-bold text-gray-900">业务办理</h1>
      </div>

      {/* 页面主滚动区域 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-3 overscroll-contain">
        {/* 顶部统计条 */}
        <section className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">待确认合计</span>
            <span className="text-base font-bold text-gray-900">53</span>
            <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-semibold text-amber-700">
              今日新增 3
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

        {/* 1. 内部审批 (核心卡片网格) */}
        <section className="rounded-2xl bg-white p-3.5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-800 tracking-tight">内部审批</h2>

          {/* 上面三项：待处理、抄送我的、已处理 */}
          <div className="grid grid-cols-3 gap-2">
            {/* 待处理 */}
            <div
              onClick={() => openFeature("biz-overview-pending")}
              className="relative flex flex-col justify-between rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#f57c00] text-white">
                  <ClipboardList className="size-4" />
                </div>
                <span className="flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  12
                </span>
              </div>
              <div className="mt-2 text-xs font-bold text-gray-900">待处理</div>
              <div className="mt-1 flex items-center text-[10px] text-amber-600 font-medium bg-amber-50 rounded px-1 py-0.2 w-fit">
                <span>今日新增 3</span>
                <ChevronRight className="size-2.5" />
              </div>
            </div>

            {/* 抄送我的 */}
            <div
              onClick={() => openFeature("biz-overview-cc")}
              className="relative flex flex-col justify-between rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#1875f0] text-white">
                  <Send className="size-4" />
                </div>
                <span className="flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  5
                </span>
              </div>
              <div className="mt-2 text-xs font-bold text-gray-900">抄送我的</div>
              <div className="mt-1 flex items-center text-[10px] text-amber-600 font-medium bg-amber-50 rounded px-1 py-0.2 w-fit">
                <span>今日新增 3</span>
                <ChevronRight className="size-2.5" />
              </div>
            </div>

            {/* 已处理 */}
            <div
              onClick={() => openFeature("biz-overview-processed")}
              className="relative flex flex-col justify-between rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#43a047] text-white">
                  <CheckCircle2 className="size-4" />
                </div>
              </div>
              <div className="mt-2 text-xs font-bold text-gray-900">已处理</div>
              <div className="mt-1 flex items-center text-[10px] text-blue-600 font-medium bg-blue-50 rounded px-1 py-0.2 w-fit">
                <span>今日已处理 3</span>
                <ChevronRight className="size-2.5" />
              </div>
            </div>
          </div>

          {/* 下面两项：我的申请记录、业务申请记录 */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => openFeature("biz-overview-my-apply")}
              className="flex items-center justify-between rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#43a047] text-white">
                  <FileText className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">我的申请记录</div>
                  <div className="mt-0.5 flex items-center text-[10px] text-amber-600 font-medium">
                    <span>今日新增 3</span>
                    <ChevronRight className="size-2.5" />
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={() => openFeature("biz-overview-biz-apply")}
              className="flex items-center justify-between rounded-xl bg-[#f8fafc] p-2.5 cursor-pointer active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#e53935] text-white">
                  <FileSpreadsheet className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">业务申请记录</div>
                  <div className="mt-0.5 flex items-center text-[10px] text-amber-600 font-medium">
                    <span>今日新增 3</span>
                    <ChevronRight className="size-2.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 业务发起 (5列网格) */}
        <section className="rounded-2xl bg-white p-3.5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-800 tracking-tight">业务发起</h2>

          <div className="grid grid-cols-5 gap-y-3.5 gap-x-1 text-center">
            {/* 入库发起 */}
            <div
              onClick={() => openFeature("biz-init-inbound")}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#1875f0] text-white shadow-xs">
                <ArrowDownToLine className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700">入库发起</span>
            </div>

            {/* 出库发起 */}
            <div
              onClick={() => openFeature("biz-init-outbound")}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#fb8c00] text-white shadow-xs">
                <ArrowUpFromLine className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700">出库发起</span>
            </div>

            {/* 移库发起 */}
            <div
              onClick={() => openFeature("biz-init-transfer-loc")}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#43a047] text-white shadow-xs">
                <ArrowLeftRight className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700">移库发起</span>
            </div>

            {/* 货物转让 */}
            <div
              onClick={() => openFeature("biz-init-transfer-owner")}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#e53935] text-white shadow-xs">
                <RefreshCcw className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700">货物转让</span>
            </div>

            {/* 仓单开立 */}
            <div
              onClick={() => openFeature("biz-init-receipt-issue")}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#f57c00] text-white shadow-xs">
                <FileCheck className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700">仓单开立</span>
            </div>

            {/* 抵质押业务办理 */}
            <div
              onClick={() => openFeature("biz-init-pledge-biz")}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#1875f0] text-white shadow-xs">
                <Lock className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700 line-clamp-2 leading-tight">
                抵质押业务办理
              </span>
            </div>

            {/* 异动申请 */}
            <div
              onClick={() => openFeature("biz-init-movement-apply")}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#e53935] text-white shadow-xs">
                <SlidersHorizontal className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700">异动申请</span>
            </div>

            {/* 盘点发起 */}
            <div
              onClick={() => openFeature("biz-init-stock-taking-apply")}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#0288d1] text-white shadow-xs">
                <ClipboardList className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700">盘点发起</span>
            </div>

            {/* 加工发起 */}
            <div
              onClick={() => openFeature("biz-init-processing-apply")}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#1976d2] text-white shadow-xs">
                <Workflow className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700">加工发起</span>
            </div>
          </div>
        </section>

        {/* 3. 客户需求审批 (5列网格，带红点角标) */}
        <section className="rounded-2xl bg-white p-3.5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-800 tracking-tight">客户需求审批</h2>

          <div className="grid grid-cols-5 gap-y-3.5 gap-x-1 text-center">
            {/* 客户入库预约 (红点5) */}
            <div
              onClick={() => openFeature("biz-approve-customer-inbound-appoint")}
              className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#1875f0] text-white shadow-xs">
                  <ArrowDownToLine className="size-5 stroke-[2.2]" />
                </div>
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-1 ring-white">
                  5
                </span>
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700 line-clamp-2 leading-tight">
                客户入库预约
              </span>
            </div>

            {/* 客户出库预约 (红点1) */}
            <div
              onClick={() => openFeature("biz-approve-customer-outbound-appoint")}
              className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#fb8c00] text-white shadow-xs">
                  <ArrowUpFromLine className="size-5 stroke-[2.2]" />
                </div>
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-1 ring-white">
                  1
                </span>
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700 line-clamp-2 leading-tight">
                客户出库预约
              </span>
            </div>

            {/* 客户融资需求线索 (红点9) */}
            <div
              onClick={() => openFeature("biz-approve-customer-finance-leads")}
              className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#43a047] text-white shadow-xs">
                  <FileSignature className="size-5 stroke-[2.2]" />
                </div>
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-1 ring-white">
                  9
                </span>
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700 line-clamp-2 leading-tight">
                客户融资需求线索
              </span>
            </div>

            {/* 客户销售需求 (红点12) */}
            <div
              onClick={() => openFeature("biz-approve-customer-sales-req")}
              className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#1e88e5] text-white shadow-xs">
                  <Store className="size-5 stroke-[2.2]" />
                </div>
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-1 ring-white">
                  12
                </span>
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700 line-clamp-2 leading-tight">
                客户销售需求
              </span>
            </div>

            {/* 客户采购需求 */}
            <div
              onClick={() => openFeature("biz-approve-customer-procure-req")}
              className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#e53935] text-white shadow-xs">
                  <ShoppingBag className="size-5 stroke-[2.2]" />
                </div>
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700 line-clamp-2 leading-tight">
                客户采购需求
              </span>
            </div>

            {/* 尽调办理 */}
            <div
              onClick={() => openFeature("biz-approve-due-diligence-sso")}
              className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#1976d2] text-white shadow-xs">
                <SearchCheck className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700">尽调办理</span>
            </div>
          </div>
        </section>

        {/* 4. 其他审批 (5列网格) */}
        <section className="rounded-2xl bg-white p-3.5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-800 tracking-tight">其他审批</h2>

          <div className="grid grid-cols-5 gap-y-3.5 gap-x-1 text-center">
            {/* 政策资讯审核 (红点1) */}
            <div
              onClick={() => openOtherApproval("biz-approve-policy-news")}
              className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#43a047] text-white shadow-xs">
                  <FileCheck className="size-5 stroke-[2.2]" />
                </div>
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-1 ring-white">
                  1
                </span>
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700 line-clamp-2 leading-tight">
                政策资讯审核
              </span>
            </div>

            {/* 开锁审批 */}
            <div
              onClick={() => openOtherApproval("biz-approve-unlock-apply")}
              className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#f57c00] text-white shadow-xs">
                <Lock className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700 line-clamp-2 leading-tight">
                开锁审批
              </span>
            </div>

            {/* 贷中风控处理 */}
            <div
              onClick={() => openOtherApproval("biz-approve-in-loan-risk-sso")}
              className="relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#1875f0] text-white shadow-xs">
                <ShieldCheck className="size-5 stroke-[2.2]" />
              </div>
              <span className="mt-1.5 text-[10px] font-medium text-gray-700 line-clamp-2 leading-tight">
                贷中风控处理
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* 底部导航栏 */}
      <BottomTabBar />
    </MobileShell>
  )
}
