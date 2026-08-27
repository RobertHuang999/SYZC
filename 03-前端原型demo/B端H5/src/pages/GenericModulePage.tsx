import { useState } from "react"
import { Filter, Search, Shield } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { IconRenderer } from "@/components/common/IconRenderer"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { MOBILE_MENU_ITEMS, type MenuItemData } from "@/data/mobileMenuData"

// 模拟业务数据生成
function generateMockRecords(item: MenuItemData) {
  const isPledgeOrSupervise =
    item.secondaryCategory.includes("融资") ||
    item.name.includes("质押") ||
    item.name.includes("监管")
  const isApproval =
    item.secondaryCategory.includes("审批") ||
    item.secondaryCategory === "业务概览"

  return [
    {
      id: "REC-202608-001",
      title: isPledgeOrSupervise
        ? "上海宝钢 2026期 热轧卷板 Q235B 动态质押监管单"
        : isApproval
        ? "【待审批】江苏宏达 800吨 优质电解铜 入库预约申请"
        : "宝山1号智能立体仓 · 热轧卷板 (规格: 3.5*1500*C)",
      subCode: "CD-2026-SH0825-998",
      warehouse: "上海宝山1号智能立体仓 A区-03垛",
      company: "江苏宏达大宗金属贸易有限公司",
      weight: "1,250.00 吨",
      value: "¥ 4,875,000.00",
      status: "正常监管中",
      statusColor: "emerald",
      date: "2026-08-25 10:30",
    },
    {
      id: "REC-202608-002",
      title: isPledgeOrSupervise
        ? "江阴华西 电解铜 Cu-CATH-1 仓单质押授信单"
        : isApproval
        ? "【待审批】浙江物产 500吨 聚丙烯 抵质押放款复核"
        : "无锡惠山保税仓 · 高纯阴极铜 (批次: WX-2026-CU88)",
      subCode: "CD-2026-WX0820-312",
      warehouse: "无锡惠山大宗金属保税仓 B区-11库",
      company: "无锡锡通供应链科技有限公司",
      weight: "680.50 吨",
      value: "¥ 46,274,000.00",
      status: "质押锁定中",
      statusColor: "blue",
      date: "2026-08-24 16:45",
    },
    {
      id: "REC-202608-003",
      title: isPledgeOrSupervise
        ? "山东鲁银 螺纹钢 HRB400E 最低货值监管预警单"
        : isApproval
        ? "【已处理】宁波港通 450吨 螺纹钢 出库解押放行核销"
        : "宁波北仑港保税监管仓 · 螺纹钢 (规格: Φ22mm)",
      subCode: "CD-2026-NB0818-109",
      warehouse: "宁波北仑港保税监管仓 C区露天堆场",
      company: "山东鲁银钢铁物产股份有限公司",
      weight: "2,100.00 吨",
      value: "¥ 7,980,000.00",
      status: "预警处置中",
      statusColor: "rose",
      date: "2026-08-23 09:15",
    },
  ]
}

export function GenericModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const [actionToast, setActionToast] = useState<string | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)

  const menuItem = MOBILE_MENU_ITEMS.find((item) => item.id === moduleId)

  if (!menuItem) {
    return (
      <MobileShell>
        <NavBar title="未找到功能" backTo="/m/workspace" />
        <div className="flex-1 p-6 text-center text-sm text-gray-500">
          未能匹配到此功能项：{moduleId}
          <div className="mt-4">
            <button
              onClick={() => navigate("/m/workspace")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs text-white"
            >
              返回工作台
            </button>
          </div>
        </div>
      </MobileShell>
    )
  }

  const mockRecords = generateMockRecords(menuItem)

  const handleAction = (actionName: string) => {
    if (actionName.includes("智风控")) {
      setActionToast("🚀 正在通过单点登录 (SSO) 安全联登至智风控决策引擎平台...")
    } else {
      setActionToast(`已触发操作：【${actionName}】（原型模拟成功）`)
    }
    setTimeout(() => setActionToast(null), 2500)
  }

  return (
    <MobileShell>
      {/* 顶部导航 */}
      <NavBar
        title={menuItem.name}
        right={
          menuItem.buttons.length > 0 ? (
            <button
              type="button"
              onClick={() => handleAction(menuItem.buttons[1] || menuItem.buttons[0])}
              className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white active:bg-blue-700"
            >
              {menuItem.buttons[1] || menuItem.buttons[0]}
            </button>
          ) : undefined
        }
      />

      {/* Toast 提示 */}
      {actionToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-gray-900/95 px-4 py-2 text-xs text-white shadow-xl backdrop-blur-md animate-fade-in border border-gray-700">
          {actionToast}
        </div>
      )}

      {/* 主滚动体 */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
        {/* 1. 功能定义与权限约束看板 */}
        <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white p-3.5 shadow-xs">
          <div className="flex items-start gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <IconRenderer icon={menuItem.iconType} className="size-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-gray-900">
                  {menuItem.name}
                </span>
                {menuItem.subTab && (
                  <span className="rounded bg-indigo-100/70 px-1.5 py-0.2 text-[10px] font-semibold text-indigo-800">
                    {menuItem.subTab}
                  </span>
                )}
                {menuItem.badge && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                    {menuItem.badge}
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-[11px] text-gray-500">
                所属路径：{menuItem.primaryModule} &gt; {menuItem.secondaryCategory}
                {menuItem.originPath !== "无变化" && ` (原: ${menuItem.originPath})`}
              </div>
            </div>
          </div>

          <p className="mt-2.5 text-xs text-gray-700 leading-relaxed bg-white/70 rounded-xl p-2.5 border border-gray-100">
            {menuItem.description}
          </p>

          {/* 数据权限与安全硬控说明 */}
          <div className="mt-2.5 flex items-start gap-1.5 rounded-xl bg-amber-50/80 p-2 text-[11px] text-amber-900 border border-amber-200/60">
            <Shield className="size-3.5 text-amber-600 mt-0.5 shrink-0" />
            <div className="leading-snug">
              <span className="font-semibold">数据与作业权限：</span>
              <span>{menuItem.dataPermission}</span>
            </div>
          </div>

          {/* 功能按钮集 */}
          <div className="mt-3">
            <div className="text-[10px] font-medium text-gray-400 mb-1">
              支持的操作与指令集：
            </div>
            <div className="flex flex-wrap gap-1.5">
              {menuItem.buttons.map((btn, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAction(btn)}
                  className="rounded-lg bg-white px-2 py-1 text-xs font-medium text-gray-700 border border-gray-200 shadow-2xs hover:bg-gray-50 active:bg-blue-50 active:text-blue-600 active:border-blue-300 transition-colors"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. 搜索与状态过滤器 */}
        <section className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索单据号、批次、企业名..."
              className="w-full rounded-xl bg-white py-1.5 pl-8 pr-3 text-xs border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => handleAction("高级筛选")}
            className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1.5 text-xs text-gray-700 border border-gray-200 shadow-2xs active:bg-gray-50"
          >
            <Filter className="size-3.5" />
            <span>筛选</span>
          </button>
        </section>

        {/* 3. 业务台账列表 */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs text-gray-500 font-medium">
            <span>实时业务台账 ({mockRecords.length})</span>
            <span className="text-[11px] text-blue-600">按更新时间降序</span>
          </div>

          {mockRecords.map((rec) => (
            <div
              key={rec.id}
              onClick={() => setSelectedRecord(rec)}
              className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs hover:border-blue-300 transition-all cursor-pointer active:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 font-mono">
                    {rec.subCode}
                  </span>
                  <h3 className="mt-1 text-xs font-bold text-gray-900 leading-snug">
                    {rec.title}
                  </h3>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    rec.statusColor === "emerald"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : rec.statusColor === "blue"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {rec.status}
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2 text-[11px]">
                <div>
                  <span className="text-gray-400">数量/吨数: </span>
                  <span className="font-semibold text-gray-800">{rec.weight}</span>
                </div>
                <div>
                  <span className="text-gray-400">核定货值: </span>
                  <span className="font-semibold text-gray-800">{rec.value}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">存储位置: </span>
                  <span className="text-gray-700">{rec.warehouse}</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
                <span>主体: {rec.company}</span>
                <span>{rec.date}</span>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* 4. 详情弹窗抽屉 */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-[430px] rounded-t-[24px] bg-white p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="text-sm font-bold text-gray-900">
                {menuItem.name} · 业务详情
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="size-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="rounded-xl bg-blue-50/60 p-2.5 border border-blue-100">
                <div className="font-semibold text-gray-900">{selectedRecord.title}</div>
                <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                  单据编号: {selectedRecord.subCode}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="text-gray-400">监管吨数</div>
                  <div className="font-bold text-gray-800">{selectedRecord.weight}</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="text-gray-400">核算货值</div>
                  <div className="font-bold text-gray-800">{selectedRecord.value}</div>
                </div>
              </div>

              <div className="text-[11px] text-gray-600">
                <div>• 所属仓库：{selectedRecord.warehouse}</div>
                <div>• 申请机构：{selectedRecord.company}</div>
                <div>• 审核流转：已通过初审，待复核归档</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRecord(null)
                  handleAction("查看完整区块链存证")
                }}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200"
              >
                存证溯源
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRecord(null)
                  handleAction("执行流程审批")
                }}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-xs active:bg-blue-700"
              >
                去处理 / 办理
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  )
}
