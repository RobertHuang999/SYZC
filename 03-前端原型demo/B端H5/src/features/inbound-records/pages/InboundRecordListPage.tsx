import { useMemo, useState } from "react"
import { Search, AlertCircle, X, Filter, RotateCcw } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { DrawerField, FilterDrawer } from "@/components/ui/FilterDrawer"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { InboundRecordCard } from "../components/InboundRecordCard"
import {
  FLOW_STATUS_FILTER_OPTIONS,
  FLOW_STATUS_LABEL,
} from "../domain/constants"
import type { InboundFlowStatusFilter, MobileInboundRecord } from "../domain/types"
import { mobileInboundRecordsMock } from "../mock/inbound-records.mock"

const STATUS_OPTIONS: DropdownOption[] = FLOW_STATUS_FILTER_OPTIONS.map((value) => ({
  label: value === "全部" ? "全部状态" : FLOW_STATUS_LABEL[value],
  value,
}))

const WAREHOUSE_OPTIONS: DropdownOption[] = [
  { label: "全部仓库", value: "全部" },
  { label: "海霸王仓库", value: "海霸王仓库" },
  { label: "生鲜冷链仓库", value: "生鲜冷链仓库" },
  { label: "农产品监管仓库", value: "农产品监管仓库" },
  { label: "青白江国际陆港监管仓", value: "青白江国际陆港监管仓" },
]

const TYPE_OPTIONS: DropdownOption[] = [
  { label: "全部类型", value: "全部" },
  { label: "普通入库", value: "普通入库" },
  { label: "仓单入库", value: "仓单入库" },
  { label: "质押入库", value: "质押入库" },
  { label: "抵押入库", value: "抵押入库" },
]

export function InboundRecordListPage() {
  const [records, setRecords] = useState<MobileInboundRecord[]>(mobileInboundRecordsMock)
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState<InboundFlowStatusFilter>("全部")
  const [warehouse, setWarehouse] = useState<string>("全部")
  const [inboundType, setInboundType] = useState<string>("全部")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // 撤销弹窗
  const [revokeTarget, setRevokeTarget] = useState<MobileInboundRecord | null>(null)

  const filtered = useMemo(() => {
    return records.filter((row) => {
      if (status !== "全部" && row.flowStatus !== status) return false
      if (warehouse !== "全部" && row.warehouseName !== warehouse) return false
      if (inboundType !== "全部" && row.inboundType !== inboundType) return false
      const q = keyword.trim().toLowerCase()
      if (!q) return true
      return (
        row.orderNo.toLowerCase().includes(q) ||
        row.ownerName.toLowerCase().includes(q) ||
        row.warehouseName.toLowerCase().includes(q) ||
        row.goodsSummary.toLowerCase().includes(q) ||
        row.ownerIdentifierMasked.toLowerCase().includes(q)
      )
    })
  }, [records, keyword, status, warehouse, inboundType])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  const handleRevokeConfirm = () => {
    if (!revokeTarget) return
    setRecords((prev) =>
      prev.map((r) => (r.id === revokeTarget.id ? { ...r, flowStatus: "WITHDRAWN" } : r))
    )
    showToast(`入库申请 ${revokeTarget.orderNo} 已撤销`)
    setRevokeTarget(null)
  }

  const resetAllFilters = () => {
    setKeyword("")
    setStatus("全部")
    setWarehouse("全部")
    setInboundType("全部")
  }

  const activeFilterCount =
    (status !== "全部" ? 1 : 0) +
    (warehouse !== "全部" ? 1 : 0) +
    (inboundType !== "全部" ? 1 : 0)

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#F2F3F7]">
        <PrototypeAnnotationTarget annotationIds={["inbound-h5-list"]}>
          <NavBar title="入库管理" />
        </PrototypeAnnotationTarget>

        {/* 搜索与筛选栏（对齐源码与H5规范） */}
        <div className="shrink-0 space-y-2 border-b border-[#232D39]/5 bg-white px-3.5 py-2.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-[#232D39]/60 active:bg-gray-100 cursor-pointer"
              aria-label="高级筛选"
            >
              <Filter className="size-4.5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-orange-600 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="请输入货主名称/标识"
                className="w-full rounded-xl bg-[#232D39]/5 py-2 pl-3.5 pr-8 text-xs text-[#232D39] placeholder:text-[#232D39]/40 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword ? (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-4 items-center justify-center rounded-full bg-gray-300 text-gray-600 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#232D39]/40 pointer-events-none" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <DropdownFilterPill
              label="审核状态"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(value) => setStatus(value as InboundFlowStatusFilter)}
              theme="orange"
            />
            <DropdownFilterPill
              label="入库类型"
              value={inboundType}
              options={TYPE_OPTIONS}
              onChange={(value) => setInboundType(value)}
              theme="orange"
            />
            <DropdownFilterPill
              label="所属仓库"
              value={warehouse}
              options={WAREHOUSE_OPTIONS}
              onChange={(value) => setWarehouse(value)}
              theme="orange"
            />
          </div>
        </div>

        {/* 列表流 */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3.5 pb-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-xs text-[#232D39]/20 mb-3">
                <Search className="size-8" />
              </div>
              <p className="text-xs font-medium text-[#232D39]/60">未找到符合条件的入库记录</p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-orange-600 shadow-xs border border-orange-200"
              >
                <RotateCcw className="size-3" />
                重置筛选条件
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <InboundRecordCard
                key={item.id}
                item={item}
                onDownload={(kind, row) => {
                  showToast(
                    kind === "excel"
                      ? `下载记录 Excel 导出中：${row.orderNo}`
                      : `单据下载 PDF 生成中：${row.orderNo}`
                  )
                }}
                onRevoke={(row) => setRevokeTarget(row)}
              />
            ))
          )}
        </div>

        {/* 高级筛选抽屉 FilterDrawer */}
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={resetAllFilters}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="审核状态">
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const active = status === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value as InboundFlowStatusFilter)}
                    className={`rounded-lg py-2 px-2 text-center text-xs transition-colors ${
                      active
                        ? "bg-orange-50 font-bold text-orange-600 border border-orange-200"
                        : "bg-gray-50 text-[#232D39]/80 border border-transparent"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </DrawerField>

          <DrawerField label="入库业务类型">
            <div className="grid grid-cols-2 gap-2">
              {TYPE_OPTIONS.map((opt) => {
                const active = inboundType === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setInboundType(opt.value)}
                    className={`rounded-lg py-2 px-2.5 text-xs text-left truncate transition-colors ${
                      active
                        ? "bg-orange-50 font-bold text-orange-600 border border-orange-200"
                        : "bg-gray-50 text-[#232D39]/80 border border-transparent"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </DrawerField>

          <DrawerField label="所属监管仓库">
            <div className="grid grid-cols-2 gap-2">
              {WAREHOUSE_OPTIONS.map((opt) => {
                const active = warehouse === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setWarehouse(opt.value)}
                    className={`rounded-lg py-2 px-2.5 text-xs text-left truncate transition-colors ${
                      active
                        ? "bg-orange-50 font-bold text-orange-600 border border-orange-200"
                        : "bg-gray-50 text-[#232D39]/80 border border-transparent"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </DrawerField>
        </FilterDrawer>

        {/* 撤销二次确认弹窗 */}
        {revokeTarget ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-2xs">
            <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl">
              <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle className="size-6" />
              </div>
              <h3 className="mt-3 text-center text-sm font-bold text-[#232D39]">
                撤销入库申请
              </h3>
              <p className="mt-2 text-center text-xs leading-relaxed text-[#232D39]/70">
                确定要撤销入库单号{" "}
                <span className="font-mono font-semibold text-[#232D39]">
                  {revokeTarget.orderNo}
                </span>{" "}
                的待审批流程吗？撤销后货权暂存记录将变为已撤回。
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-medium text-[#232D39]/70 active:bg-gray-200"
                  onClick={() => setRevokeTarget(null)}
                >
                  放弃
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white shadow-xs active:bg-red-700"
                  onClick={handleRevokeConfirm}
                >
                  确认撤销
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* 底部轻量 Toast */}
        {toast ? (
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#232D39]/90 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-xs transition-opacity animate-fade-in">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}
