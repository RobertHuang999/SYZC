import { useMemo, useState } from "react"
import { Filter, RotateCcw, Search, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { DrawerField, FilterDrawer } from "@/components/ui/FilterDrawer"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { H5_FILTER_BAR, H5_LIST_SCROLL, H5_SEARCH_INPUT } from "@/shared/h5-ui-theme"
import { ProcessingRecordCard } from "../components/ProcessingRecordCard"
import { MOCK_PROCESSING_RECORDS } from "../mock/processing-records.mock"
import {
  PROCESSING_STATUS_FILTER_OPTIONS,
  PROCESSING_TYPE_FILTER_OPTIONS,
  WORKSPACE_ROUTE,
} from "../domain/constants"
import type { ProcessingRecord } from "../domain/types"

const WAREHOUSE_OPTIONS: DropdownOption[] = [
  { label: "全部仓库", value: "全部" },
  ...Array.from(new Set(MOCK_PROCESSING_RECORDS.map((item) => item.warehouseName))).map(
    (name) => ({ label: name, value: name })
  ),
]

const CREATOR_OPTIONS: DropdownOption[] = [
  { label: "全部制单人", value: "全部" },
  ...Array.from(new Set(MOCK_PROCESSING_RECORDS.map((item) => item.createByName))).map(
    (name) => ({ label: name, value: name })
  ),
]

type PendingAction = {
  type: "complete" | "void"
  record: ProcessingRecord
}

export function ProcessingRecordListPage() {
  const [keyword, setKeyword] = useState("")
  const [selectedType, setSelectedType] = useState("全部")
  const [selectedStatus, setSelectedStatus] = useState("全部")
  const [selectedWarehouse, setSelectedWarehouse] = useState("全部")
  const [selectedCreator, setSelectedCreator] = useState("全部")
  const [goodsKeyword, setGoodsKeyword] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [createStartDate, setCreateStartDate] = useState("")
  const [createEndDate, setCreateEndDate] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2500)
  }

  const filteredList = useMemo(() => {
    return MOCK_PROCESSING_RECORDS.filter((item) => {
      if (selectedType !== "全部" && item.processingType !== selectedType) return false
      if (selectedStatus !== "全部" && item.status !== selectedStatus) return false
      if (selectedWarehouse !== "全部" && item.warehouseName !== selectedWarehouse) return false
      if (selectedCreator !== "全部" && item.createByName !== selectedCreator) return false

      const day = item.processingTime.slice(0, 10)
      if (startDate && day < startDate) return false
      if (endDate && day > endDate) return false

      const createDay = item.createTime.slice(0, 10)
      if (createStartDate && createDay < createStartDate) return false
      if (createEndDate && createDay > createEndDate) return false

      const goodsText = [
        ...item.inputGroups.map((group) => group.goodsName),
        ...item.outputItems.map((output) => output.goodsName),
      ]
        .join(" ")
        .toLowerCase()
      if (goodsKeyword.trim() && !goodsText.includes(goodsKeyword.trim().toLowerCase())) {
        return false
      }

      const query = keyword.trim().toLowerCase()
      if (!query) return true
      return (
        item.id.toLowerCase().includes(query) ||
        item.ownerName.toLowerCase().includes(query) ||
        item.ownerIdentity.toLowerCase().includes(query) ||
        goodsText.includes(query)
      )
    })
  }, [
    keyword,
    selectedType,
    selectedStatus,
    selectedWarehouse,
    selectedCreator,
    goodsKeyword,
    startDate,
    endDate,
    createStartDate,
    createEndDate,
  ])

  const activeFilterCount =
    (selectedCreator !== "全部" ? 1 : 0) +
    (goodsKeyword.trim() ? 1 : 0) +
    (startDate || endDate ? 1 : 0) +
    (createStartDate || createEndDate ? 1 : 0)

  const resetAllFilters = () => {
    setKeyword("")
    setSelectedType("全部")
    setSelectedStatus("全部")
    setSelectedWarehouse("全部")
    setSelectedCreator("全部")
    setGoodsKeyword("")
    setStartDate("")
    setEndDate("")
    setCreateStartDate("")
    setCreateEndDate("")
  }

  const confirmPendingAction = () => {
    if (!pendingAction) return
    const { type, record } = pendingAction
    if (type === "complete") {
      showToast(`加工单 ${record.id} 的现场完成登记请在作业端执行；本页仅展示结果查询。`)
    } else {
      showToast(`加工单 ${record.id} 作废需授权业务主管在作业端确认，本页只读。`)
    }
    setPendingAction(null)
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget annotationIds={["processing-h5-list"]}>
          <NavBar title="加工管理" backTo={WORKSPACE_ROUTE} />
        </PrototypeAnnotationTarget>

        <div className={H5_FILTER_BAR}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#232D39]/60 active:bg-gray-100"
              aria-label="高级筛选"
            >
              <Filter className="size-4.5" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="请输入加工单号/货主/货物"
                className={H5_SEARCH_INPUT}
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              {keyword ? (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-2.5 top-1/2 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-300 text-gray-600"
                >
                  <X className="size-2.5" />
                </button>
              ) : (
                <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#232D39]/40" />
              )}
            </div>
          </div>

          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-0.5">
            <DropdownFilterPill
              label="加工类型"
              value={selectedType}
              options={PROCESSING_TYPE_FILTER_OPTIONS}
              onChange={setSelectedType}
            />
            <DropdownFilterPill
              label="单据状态"
              value={selectedStatus}
              options={PROCESSING_STATUS_FILTER_OPTIONS}
              onChange={setSelectedStatus}
            />
            <DropdownFilterPill
              label="所属仓库"
              value={selectedWarehouse}
              options={WAREHOUSE_OPTIONS}
              onChange={setSelectedWarehouse}
            />
          </div>
        </div>

        <div className={`${H5_LIST_SCROLL} pb-8`}>
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                <Search className="size-7" />
              </div>
              <p className="text-xs font-medium text-[#232D39]/60">
                未找到符合条件的加工记录
              </p>
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
            <>
              <p className="px-1 text-[11px] text-[#232D39]/50">
                共 {filteredList.length} 条加工记录
              </p>
              {filteredList.map((item) => (
                <ProcessingRecordCard
                  key={item.id}
                  item={item}
                  onComplete={(record) => setPendingAction({ type: "complete", record })}
                  onVoid={(record) => setPendingAction({ type: "void", record })}
                />
              ))}
            </>
          )}
        </div>

        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={() => {
            setSelectedCreator("全部")
            setGoodsKeyword("")
            setStartDate("")
            setEndDate("")
            setCreateStartDate("")
            setCreateEndDate("")
          }}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="制单人">
            <select
              value={selectedCreator}
              onChange={(event) => setSelectedCreator(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-[#232D39]"
            >
              {CREATOR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </DrawerField>

          <DrawerField label="货品名称">
            <input
              type="text"
              value={goodsKeyword}
              onChange={(event) => setGoodsKeyword(event.target.value)}
              placeholder="请输入投入或产出货品名称"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-[#232D39]"
            />
          </DrawerField>

          <DrawerField label="加工日期">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="加工开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="加工结束日期"
              />
            </div>
          </DrawerField>

          <DrawerField label="制单时间">
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

          <p className="text-[11px] leading-relaxed text-[#232D39]/45">
            加工类型、单据状态、所属仓库已在首屏胶囊中切换；货品名称、日期与制单人在此补充，点「确定」后生效。
          </p>
        </FilterDrawer>

        {pendingAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5">
            <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl">
              <h3 className="text-sm font-bold text-[#232D39]">
                {pendingAction.type === "complete" ? "完成加工确认" : "作废加工单确认"}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#232D39]/65">
                {pendingAction.type === "complete"
                  ? `将核销加工单 ${pendingAction.record.id} 的实际消耗与产出。移动端原型只演示查询与入口，现场完成登记以作业端实操为准。`
                  : `作废加工单 ${pendingAction.record.id} 会释放计划投入锁定的库存，且不可恢复。请确认已取得授权主管同意。`}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-600"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmPendingAction}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium text-white ${
                    pendingAction.type === "void" ? "bg-rose-600" : "bg-blue-600"
                  }`}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </MobileShell>
  )
}
