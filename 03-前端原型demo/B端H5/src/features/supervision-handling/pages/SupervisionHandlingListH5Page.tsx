import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Filter, Plus, Search, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

type H5HandlingStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "EFFECTIVE"
  | "REJECTED"
  | "WITHDRAWN"
  | "RELEASED"

type H5DocKind = "PLEDGE" | "MORTGAGE" | "SUPERVISION_SERVICE"

interface H5HandlingRecord {
  id: string
  applyNo: string
  docKind: H5DocKind
  guaranteeModeLabel: string
  cargoType: "存货" | "仓单"
  ownerName: string
  ownerId: string
  holderName: string
  qtySummary: string
  valueWan: string
  status: H5HandlingStatus
  submittedAt: string
  rejectReason?: string
}

const STATUS_META: Record<H5HandlingStatus, { label: string; badgeClass: string }> = {
  DRAFT: { label: "草稿", badgeClass: "bg-slate-100 text-slate-700" },
  PENDING_APPROVAL: { label: "审批中", badgeClass: "bg-amber-50 text-amber-700" },
  EFFECTIVE: { label: "已生效", badgeClass: "bg-emerald-50 text-emerald-700" },
  REJECTED: { label: "已驳回", badgeClass: "bg-rose-50 text-rose-700" },
  WITHDRAWN: { label: "已撤回", badgeClass: "bg-slate-100 text-slate-600" },
  RELEASED: { label: "已解押", badgeClass: "bg-blue-50 text-blue-700" },
}

const DOC_KIND_LABEL: Record<H5DocKind, string> = {
  PLEDGE: "质押单",
  MORTGAGE: "抵押单",
  SUPERVISION_SERVICE: "监管服务单",
}

const INITIAL_H5_MOCK: H5HandlingRecord[] = [
  {
    id: "h5-sh-1",
    applyNo: "ZY20261113000100821",
    docKind: "PLEDGE",
    guaranteeModeLabel: "流动质押",
    cargoType: "存货",
    ownerName: "亮点信息科技有限公司",
    ownerId: "91441400MA52XE5675",
    holderName: "浦发银行上海自贸试验区分行",
    qtySummary: "电解铜 40吨",
    valueWan: "298.00万元",
    status: "PENDING_APPROVAL",
    submittedAt: "2026-11-13 09:42:18",
  },
  {
    id: "h5-sh-2",
    applyNo: "DY20261112000200419",
    docKind: "MORTGAGE",
    guaranteeModeLabel: "浮动抵押",
    cargoType: "仓单",
    ownerName: "阜阳市大数据资产运营有限公司",
    ownerId: "913****1202MA2U0JHJ3F",
    holderName: "兴业银行苏州分行",
    qtySummary: "电子仓单 2 张",
    valueWan: "145.16万元",
    status: "EFFECTIVE",
    submittedAt: "2026-11-12 14:18:05",
  },
  {
    id: "h5-sh-3",
    applyNo: "JG20261111000300772",
    docKind: "SUPERVISION_SERVICE",
    guaranteeModeLabel: "动态监管",
    cargoType: "存货",
    ownerName: "广州华南铝业贸易有限公司",
    ownerId: "91440101MA59K8213T",
    holderName: "森云智储监管服务有限公司",
    qtySummary: "重熔用铝锭 100吨",
    valueWan: "204.50万元",
    status: "REJECTED",
    submittedAt: "2026-11-11 10:08:30",
    rejectReason: "合同编号与线下协议不一致，请核对后重提。",
  },
  {
    id: "h5-sh-4",
    applyNo: "DY20261110000400195",
    docKind: "MORTGAGE",
    guaranteeModeLabel: "固定抵押",
    cargoType: "存货",
    ownerName: "原原李",
    ownerId: "185****7112",
    holderName: "武汉农商行汉阳支行",
    qtySummary: "牛肉丸 1000公斤",
    valueWan: "4.85万元",
    status: "WITHDRAWN",
    submittedAt: "2026-11-10 11:20:00",
  },
  {
    id: "h5-sh-5",
    applyNo: "ZY20261105000500318",
    docKind: "PLEDGE",
    guaranteeModeLabel: "静态质押",
    cargoType: "存货",
    ownerName: "青岛海胶国际贸易有限公司",
    ownerId: "91370200MA3N55102X",
    holderName: "浦发银行上海自贸试验区分行",
    qtySummary: "天然橡胶 50吨",
    valueWan: "--",
    status: "RELEASED",
    submittedAt: "2026-11-05 09:10:00",
  },
  {
    id: "h5-sh-6",
    applyNo: "ZY20261113000600991",
    docKind: "PLEDGE",
    guaranteeModeLabel: "流动质押",
    cargoType: "存货",
    ownerName: "亮点信息科技有限公司",
    ownerId: "91441400MA52XE5675",
    holderName: "兴业银行苏州分行",
    qtySummary: "电解铜 20吨",
    valueWan: "149.00万元",
    status: "DRAFT",
    submittedAt: "2026-11-13 10:55:00",
  },
]

export function SupervisionHandlingListH5Page() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<H5HandlingRecord[]>(INITIAL_H5_MOCK)
  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | H5HandlingStatus>("ALL")
  const [docKindFilter, setDocKindFilter] = useState<"ALL" | H5DocKind>("ALL")
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [detailTarget, setDetailTarget] = useState<H5HandlingRecord | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: "WITHDRAW" | "REJECT" | "DELETE"
    record: H5HandlingRecord
  } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const filtered = useMemo(() => {
    const kw = keyword.trim()
    return records.filter((item) => {
      if (kw && !item.applyNo.includes(kw) && !item.ownerName.includes(kw)) return false
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false
      if (docKindFilter !== "ALL" && item.docKind !== docKindFilter) return false
      return true
    })
  }, [records, keyword, statusFilter, docKindFilter])

  const resetFilters = () => {
    setKeyword("")
    setStatusFilter("ALL")
    setDocKindFilter("ALL")
  }

  const executeConfirm = () => {
    if (!confirmAction) return
    const { type, record } = confirmAction
    if (type === "DELETE") {
      setRecords((prev) => prev.filter((r) => r.id !== record.id))
      showToast(`已删除单据 ${record.applyNo}`)
    } else if (type === "WITHDRAW") {
      setRecords((prev) =>
        prev.map((r) => (r.id === record.id ? { ...r, status: "WITHDRAWN" } : r)),
      )
      showToast(`已撤回 ${record.applyNo}，对应资产锁定已释放`)
    } else if (type === "REJECT") {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === record.id
            ? { ...r, status: "REJECTED", rejectReason: "移动端审批驳回" }
            : r,
        ),
      )
      showToast(`已驳回 ${record.applyNo}`)
    }
    setConfirmAction(null)
  }

  return (
    <PrototypeAnnotationTarget annotationIds={["supervision-h5-list-page"]}>
      <MobileShell>
        <NavBar
          title="监管办理记录"
          showBack
          onBack={() => navigate("/m/supervision/initiate")}
          right={
            <button
              type="button"
              onClick={() => navigate("/m/supervision/initiate")}
              className="inline-flex items-center gap-0.5 text-xs font-medium text-[#1875F0]"
            >
              <Plus className="size-3.5" />
              发起
            </button>
          }
        />

        {/* 搜索 + 胶囊筛选 */}
        <div className="shrink-0 space-y-2 border-b border-slate-100 bg-white px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-[#F5F7FA] px-2.5 py-1.5">
              <Search className="size-3.5 text-[#64748B]" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索单据号、货主名称"
                className="w-full bg-transparent text-xs text-[#232D39] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-[#232D39]"
            >
              <Filter className="size-3.5" />
              筛选
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {(
              [
                { key: "ALL", label: "全部" },
                { key: "PENDING_APPROVAL", label: "审批中" },
                { key: "EFFECTIVE", label: "已生效" },
                { key: "REJECTED", label: "已驳回" },
                { key: "DRAFT", label: "草稿" },
              ] as const
            ).map((pill) => (
              <button
                key={pill.key}
                type="button"
                onClick={() => setStatusFilter(pill.key)}
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
                  statusFilter === pill.key
                    ? "bg-[#1875F0] text-white"
                    : "bg-[#F5F7FA] text-[#64748B]"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* 卡片列表 */}
        <div id="supervision-h5-list-page" className="flex-1 space-y-2.5 overflow-y-auto bg-[#F5F7FA] p-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl bg-white py-12 text-center shadow-sm">
              <p className="text-xs text-[#64748B]">暂无匹配的监管办理记录</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 rounded-lg border border-[#1875F0] px-4 py-1.5 text-xs font-medium text-[#1875F0]"
              >
                重置筛选
              </button>
            </div>
          ) : (
            filtered.map((item) => {
              const meta = STATUS_META[item.status]
              return (
                <div key={item.id} className="rounded-xl bg-white p-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold text-[#232D39] break-all">
                      {item.applyNo}
                    </div>
                    <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-medium ${meta.badgeClass}`}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-[#64748B]">
                    <div>
                      类型：{DOC_KIND_LABEL[item.docKind]} · {item.guaranteeModeLabel}（{item.cargoType}）
                    </div>
                    <div>货主：{item.ownerName}</div>
                    <div>权人：{item.holderName}</div>
                    <div className="flex items-center justify-between pt-0.5 text-[#232D39]">
                      <span>{item.qtySummary}</span>
                      <span className="font-semibold text-[#1875F0]">{item.valueWan}</span>
                    </div>
                  </div>

                  {/* 操作胶囊一行 ≤ 4 */}
                  <div className="mt-3 flex flex-wrap justify-end gap-1.5 border-t border-slate-100 pt-2.5">
                    <button
                      type="button"
                      onClick={() => setDetailTarget(item)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-[#232D39]"
                    >
                      详情
                    </button>
                    {(item.status === "DRAFT" ||
                      item.status === "REJECTED" ||
                      item.status === "WITHDRAWN") && (
                      <button
                        type="button"
                        onClick={() => navigate("/m/supervision/initiate")}
                        className="rounded-full border border-[#1875F0] px-3 py-1 text-[11px] text-[#1875F0]"
                      >
                        重新编辑
                      </button>
                    )}
                    {item.status === "PENDING_APPROVAL" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setConfirmAction({ type: "WITHDRAW", record: item })}
                          className="rounded-full border border-amber-400 px-3 py-1 text-[11px] text-amber-700"
                        >
                          撤回
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmAction({ type: "REJECT", record: item })}
                          className="rounded-full border border-rose-300 px-3 py-1 text-[11px] text-rose-600"
                        >
                          驳回
                        </button>
                      </>
                    )}
                    {(item.status === "DRAFT" ||
                      item.status === "REJECTED" ||
                      item.status === "WITHDRAWN") && (
                      <button
                        type="button"
                        onClick={() => setConfirmAction({ type: "DELETE", record: item })}
                        className="rounded-full border border-rose-300 px-3 py-1 text-[11px] text-rose-600"
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* 底部筛选抽屉 */}
        {filterDrawerOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-end bg-black/40"
            onClick={() => setFilterDrawerOpen(false)}
          >
            <div
              className="w-full rounded-t-2xl bg-white p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3">
                <span className="text-sm font-semibold text-[#232D39]">筛选条件</span>
                <button type="button" onClick={() => setFilterDrawerOpen(false)}>
                  <X className="size-4 text-[#64748B]" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="mb-1.5 text-xs text-[#64748B]">开立单据类型</div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { key: "ALL", label: "全部" },
                        { key: "PLEDGE", label: "质押单" },
                        { key: "MORTGAGE", label: "抵押单" },
                        { key: "SUPERVISION_SERVICE", label: "监管服务单" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setDocKindFilter(opt.key)}
                        className={`rounded-full px-3 py-1 text-xs ${
                          docKindFilter === opt.key
                            ? "bg-[#1875F0] text-white"
                            : "bg-slate-100 text-[#64748B]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetFilters()
                      setFilterDrawerOpen(false)
                    }}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-xs text-[#64748B]"
                  >
                    重置
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDrawerOpen(false)}
                    className="flex-1 rounded-lg bg-[#1875F0] py-2 text-xs font-medium text-white"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* 详情抽屉 */}
        {detailTarget ? (
          <div
            className="fixed inset-0 z-50 flex items-end bg-black/40"
            onClick={() => setDetailTarget(null)}
          >
            <div
              className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-semibold text-[#232D39]">办理单据详情</span>
                <button type="button" onClick={() => setDetailTarget(null)}>
                  <X className="size-4 text-[#64748B]" />
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">单据编号</span>
                  <span className="font-medium text-[#232D39]">{detailTarget.applyNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">单据类型</span>
                  <span className="text-[#232D39]">
                    {DOC_KIND_LABEL[detailTarget.docKind]} · {detailTarget.guaranteeModeLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">标的形态</span>
                  <span className="text-[#232D39]">{detailTarget.cargoType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">货主名称</span>
                  <span className="text-[#232D39]">{detailTarget.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">货主标识</span>
                  <span className="text-[#232D39]">{detailTarget.ownerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">权人名称</span>
                  <span className="text-[#232D39]">{detailTarget.holderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">押品汇总</span>
                  <span className="text-[#232D39]">{detailTarget.qtySummary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">货品总价值</span>
                  <span className="font-semibold text-[#1875F0]">{detailTarget.valueWan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">提交时间</span>
                  <span className="text-[#232D39]">{detailTarget.submittedAt}</span>
                </div>
                {detailTarget.rejectReason ? (
                  <div className="rounded-lg bg-rose-50 p-2.5 text-rose-700">
                    驳回原因：{detailTarget.rejectReason}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* 敏感操作二次确认弹窗 */}
        {confirmAction ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
              <div className="text-sm font-semibold text-[#232D39]">
                {confirmAction.type === "WITHDRAW"
                  ? "确认撤回申请"
                  : confirmAction.type === "REJECT"
                    ? "确认驳回申请"
                    : "确认删除单据"}
              </div>
              <p className="mt-2 text-xs text-[#64748B]">
                确认对单据「{confirmAction.record.applyNo}」执行该操作吗？
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-xs text-[#64748B]"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={executeConfirm}
                  className="flex-1 rounded-lg bg-rose-600 py-2 text-xs font-medium text-white"
                >
                  确认执行
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {toast ? (
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[#232D39] px-4 py-2 text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </MobileShell>
    </PrototypeAnnotationTarget>
  )
}

