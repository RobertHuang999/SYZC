import { useMemo, useState } from "react"
import { Search, Filter, X, RotateCcw } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { DrawerField, FilterDrawer } from "@/components/ui/FilterDrawer"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { OutboundRecordCard } from "../components/OutboundRecordCard"
import { MOBILE_OUTBOUND_TYPE_OPTIONS, WORKSPACE_ROUTE } from "../domain/constants"
import type { MobileOutboundRecord } from "../domain/types"
import { mobileOutboundRecordsMock } from "../mock/outbound-records.mock"
import { H5_FILTER_BAR, H5_LIST_SCROLL, H5_SEARCH_INPUT } from "@/shared/h5-ui-theme"

const TYPE_OPTIONS: DropdownOption[] = MOBILE_OUTBOUND_TYPE_OPTIONS.map((val) => ({
  label: val === "全部" ? "全部类型" : val,
  value: val,
}))

const WAREHOUSE_OPTIONS: DropdownOption[] = [
  { label: "全部仓库", value: "全部" },
  { label: "海霸王仓库", value: "海霸王仓库" },
  { label: "生鲜冷链仓库", value: "生鲜冷链仓库" },
  { label: "农产品监管仓库", value: "农产品监管仓库" },
  { label: "青白江国际陆港监管仓", value: "青白江国际陆港监管仓" },
]

const STATUS_OPTIONS: DropdownOption[] = [
  { label: "全部状态", value: "全部" },
  { label: "已通过", value: "APPROVED" },
  { label: "审核中", value: "PENDING" },
  { label: "未通过", value: "REJECTED" },
  { label: "已撤销", value: "WITHDRAWN" },
]

const PICKUP_OPTIONS: DropdownOption[] = [
  { label: "全部提货", value: "全部" },
  { label: "已提货", value: "PICKED" },
  { label: "未提货", value: "UNPICKED" },
]

export function OutboundRecordListPage() {
  const [records] = useState<MobileOutboundRecord[]>(mobileOutboundRecordsMock)
  const [keyword, setKeyword] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("全部")
  const [selectedType, setSelectedType] = useState<string>("全部")
  const [selectedStatus, setSelectedStatus] = useState<string>("全部")
  const [selectedPickup, setSelectedPickup] = useState<string>("全部")
  const [outboundStartDate, setOutboundStartDate] = useState("")
  const [outboundEndDate, setOutboundEndDate] = useState("")
  const [createStartDate, setCreateStartDate] = useState("")
  const [createEndDate, setCreateEndDate] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  const filtered = useMemo(() => {
    return records.filter((row) => {
      if (selectedWarehouse !== "全部" && row.warehouseName !== selectedWarehouse) {
        return false
      }
      if (selectedType !== "全部" && row.type !== selectedType) {
        return false
      }
      if (selectedStatus !== "全部" && row.statusCode !== selectedStatus) {
        return false
      }
      if (selectedPickup === "PICKED" && !row.pickCompleted) {
        return false
      }
      if (selectedPickup === "UNPICKED" && row.pickCompleted) {
        return false
      }
      const outboundDay = row.outboundTime.slice(0, 10)
      if (outboundStartDate && outboundDay < outboundStartDate) return false
      if (outboundEndDate && outboundDay > outboundEndDate) return false
      const createDay = row.createTime.slice(0, 10)
      if (createStartDate && createDay < createStartDate) return false
      if (createEndDate && createDay > createEndDate) return false
      const q = keyword.trim().toLowerCase()
      if (!q) return true
      return (
        row.orderNo.toLowerCase().includes(q) ||
        row.ownerName.toLowerCase().includes(q) ||
        row.warehouseName.toLowerCase().includes(q) ||
        row.goodsSummary.toLowerCase().includes(q) ||
        (row.relatedNo && row.relatedNo.toLowerCase().includes(q))
      )
    })
  }, [records, keyword, selectedWarehouse, selectedType, selectedStatus, selectedPickup, outboundStartDate, outboundEndDate, createStartDate, createEndDate])

  const handleDownload = (kind: "excel" | "pdf", item: MobileOutboundRecord) => {
    if (kind === "excel") {
      showToast(`正在导出出库记录台账 Excel（${item.orderNo}）...`)
    } else {
      showToast(`正在生成监管仓库出库凭证 PDF（${item.orderNo}）...`)
    }
  }

  const resetAllFilters = () => {
    setKeyword("")
    setSelectedWarehouse("全部")
    setSelectedType("全部")
    setSelectedStatus("全部")
    setSelectedPickup("全部")
    setOutboundStartDate("")
    setOutboundEndDate("")
    setCreateStartDate("")
    setCreateEndDate("")
  }

  const activeFilterCount =
    (selectedWarehouse !== "全部" ? 1 : 0) +
    (selectedType !== "全部" ? 1 : 0) +
    (selectedStatus !== "全部" ? 1 : 0) +
    (selectedPickup !== "全部" ? 1 : 0) +
    (outboundStartDate || outboundEndDate || createStartDate || createEndDate ? 1 : 0)

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget annotationIds={["outbound-h5-list"]}>
          <NavBar title="出库管理" backTo={WORKSPACE_ROUTE} />
        </PrototypeAnnotationTarget>

        {/* 搜索与筛选栏（对齐源码 search-section + stream-filter-card 与 H5规范） */}
        <div className={H5_FILTER_BAR}>
          {/* 搜索框行：左侧常驻筛选漏斗 + 浅灰背景搜索条 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-[#232D39]/60 active:bg-gray-100 cursor-pointer"
              aria-label="高级筛选"
            >
              <Filter className="size-4.5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="请输入货主名称/标识"
                className={H5_SEARCH_INPUT}
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

          {/* 横向滚动胶囊栏：所属仓库、出库类型、审核状态、提货状态 */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <DropdownFilterPill
              label="所属仓库"
              value={selectedWarehouse}
              options={WAREHOUSE_OPTIONS}
              onChange={(val) => setSelectedWarehouse(val)}
            />
            <DropdownFilterPill
              label="出库类型"
              value={selectedType}
              options={TYPE_OPTIONS}
              onChange={(val) => setSelectedType(val)}
            />
            <DropdownFilterPill
              label="审核状态"
              value={selectedStatus}
              options={STATUS_OPTIONS}
              onChange={(val) => setSelectedStatus(val)}
            />
            <DropdownFilterPill
              label="提货状态"
              value={selectedPickup}
              options={PICKUP_OPTIONS}
              onChange={(val) => setSelectedPickup(val)}
            />
          </div>
        </div>

        {/* 列表内容流 */}
        <div className={`${H5_LIST_SCROLL} pb-8`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                <Search className="size-7" />
              </div>
              <p className="text-xs font-medium text-[#232D39]/60">未找到符合条件的出库记录</p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-xs"
              >
                <RotateCcw className="size-3" />
                重置筛选条件
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <OutboundRecordCard
                key={item.id}
                item={item}
                onDownload={handleDownload}
              />
            ))
          )}
        </div>

        {/* 更多筛选：出库日期与制单日期（常用维度已在胶囊上） */}
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={() => {
            setOutboundStartDate("")
            setOutboundEndDate("")
            setCreateStartDate("")
            setCreateEndDate("")
          }}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="出库日期">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={outboundStartDate}
                onChange={(event) => setOutboundStartDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="出库开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={outboundEndDate}
                onChange={(event) => setOutboundEndDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="出库结束日期"
              />
            </div>
          </DrawerField>

          <DrawerField label="制单日期">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={createStartDate}
                onChange={(event) => setCreateStartDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="制单开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={createEndDate}
                onChange={(event) => setCreateEndDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="制单结束日期"
              />
            </div>
          </DrawerField>
        </FilterDrawer>

        {/* Toast 提示浮层 */}
        {toast && (
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </MobileShell>
  )
}
