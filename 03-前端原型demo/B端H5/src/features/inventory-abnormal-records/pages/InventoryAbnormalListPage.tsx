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
import { InventoryAbnormalCard } from "../components/InventoryAbnormalCard"
import {
  ABNORMAL_TYPE_OPTIONS,
  ORDER_TYPE_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "../domain/constants"
import { abnormalRecordsMock } from "../mock/inventory-abnormal.mock"

const ORDER_TYPE_FILTER_OPTIONS: DropdownOption[] = [
  { label: "全部单据", value: "全部" },
  ...ORDER_TYPE_OPTIONS.map((type) => ({ label: type, value: type })),
]

const ABNORMAL_TYPE_FILTER_OPTIONS: DropdownOption[] = [
  { label: "全部异动", value: "全部" },
  ...ABNORMAL_TYPE_OPTIONS.map((type) => ({ label: type, value: type })),
]

const WAREHOUSE_FILTER_OPTIONS: DropdownOption[] = [
  { label: "全部仓库", value: "全部" },
  ...WAREHOUSE_OPTIONS.map((name) => ({ label: name, value: name })),
]

/** 申请人选项取自 Mock，展示为「姓名（机构）」的姓名部分 */
const APPLICANT_OPTIONS: DropdownOption[] = [
  { label: "全部申请人", value: "全部" },
  ...Array.from(new Set(abnormalRecordsMock.map((item) => item.applicantName))).map(
    (name) => ({
      label: name.split("（")[0] ?? name,
      value: name,
    }),
  ),
]

export function InventoryAbnormalListPage() {
  const [keyword, setKeyword] = useState("")
  const [selectedOrderType, setSelectedOrderType] = useState("全部")
  const [selectedAbnormalType, setSelectedAbnormalType] = useState("全部")
  const [selectedWarehouse, setSelectedWarehouse] = useState("全部")
  const [selectedApplicant, setSelectedApplicant] = useState("全部")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredList = useMemo(() => {
    return abnormalRecordsMock.filter((item) => {
      if (selectedOrderType !== "全部" && item.relateOrderType !== selectedOrderType) {
        return false
      }
      if (
        selectedAbnormalType !== "全部" &&
        !item.goodsLines.some((line) => line.abnormalType === selectedAbnormalType)
      ) {
        return false
      }
      if (selectedWarehouse !== "全部" && item.warehouseName !== selectedWarehouse) {
        return false
      }
      if (selectedApplicant !== "全部" && item.applicantName !== selectedApplicant) {
        return false
      }

      const applyDay = item.applyTime.slice(0, 10)
      if (startDate && applyDay < startDate) return false
      if (endDate && applyDay > endDate) return false

      const q = keyword.trim().toLowerCase()
      if (!q) return true
      return (
        item.id.toLowerCase().includes(q) ||
        item.relateId.toLowerCase().includes(q) ||
        item.owner.ownerName.toLowerCase().includes(q) ||
        item.owner.ownerIdentity.toLowerCase().includes(q) ||
        item.goodsLines.some((line) => line.goodsName.toLowerCase().includes(q))
      )
    })
  }, [
    keyword,
    selectedOrderType,
    selectedAbnormalType,
    selectedWarehouse,
    selectedApplicant,
    startDate,
    endDate,
  ])

  const activeFilterCount =
    (selectedOrderType !== "全部" ? 1 : 0) +
    (selectedAbnormalType !== "全部" ? 1 : 0) +
    (selectedWarehouse !== "全部" ? 1 : 0) +
    (selectedApplicant !== "全部" ? 1 : 0) +
    (startDate || endDate ? 1 : 0)

  const resetAllFilters = () => {
    setKeyword("")
    setSelectedOrderType("全部")
    setSelectedAbnormalType("全部")
    setSelectedWarehouse("全部")
    setSelectedApplicant("全部")
    setStartDate("")
    setEndDate("")
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget annotationIds={["abnormal-h5-list"]}>
          <NavBar title="异动管理" backTo="/m/workspace" />
        </PrototypeAnnotationTarget>

        <div className={H5_FILTER_BAR}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-[#232D39]/60 active:bg-gray-100"
              aria-label="更多筛选"
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
                placeholder="异动单号/关联单据/货主/货物"
                className={H5_SEARCH_INPUT}
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              {keyword ? (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-2.5 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 text-gray-600"
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
              label="单据类型"
              value={selectedOrderType}
              options={ORDER_TYPE_FILTER_OPTIONS}
              onChange={setSelectedOrderType}
            />
            <DropdownFilterPill
              label="异动类型"
              value={selectedAbnormalType}
              options={ABNORMAL_TYPE_FILTER_OPTIONS}
              onChange={setSelectedAbnormalType}
            />
            <DropdownFilterPill
              label="仓库"
              value={selectedWarehouse}
              options={WAREHOUSE_FILTER_OPTIONS}
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
                未找到符合条件的异动记录
              </p>
              <p className="mt-1 text-[11px] text-[#232D39]/40">
                可调整单据类型、异动类型或申请时间后重试
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
            filteredList.map((item) => (
              <InventoryAbnormalCard key={item.id} item={item} />
            ))
          )}
        </div>

        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={() => {
            setSelectedApplicant("全部")
            setStartDate("")
            setEndDate("")
          }}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="申请人">
            <select
              value={selectedApplicant}
              onChange={(event) => setSelectedApplicant(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
              aria-label="申请人"
            >
              {APPLICANT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </DrawerField>

          <DrawerField label="申请日期">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="申请开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="申请结束日期"
              />
            </div>
          </DrawerField>
        </FilterDrawer>
      </div>
    </MobileShell>
  )
}
