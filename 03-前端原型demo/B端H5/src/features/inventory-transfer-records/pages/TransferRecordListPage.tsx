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
import { TransferRecordCard } from "../components/TransferRecordCard"
import {
  H5_CREATOR_OPTIONS,
  H5_TRANSFER_RECORD_LIST_PATH,
  H5_WAREHOUSE_OPTIONS,
} from "../domain/constants"
import type { MobileTransferRecord } from "../domain/types"
import { mobileTransferRecordsMock } from "../mock/transfer-records.mock"

const WAREHOUSE_OPTIONS: DropdownOption[] = H5_WAREHOUSE_OPTIONS
const CREATOR_OPTIONS: DropdownOption[] = H5_CREATOR_OPTIONS

export function TransferRecordListPage() {
  const [keyword, setKeyword] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState("ALL")
  const [selectedCreator, setSelectedCreator] = useState("ALL")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredList = useMemo(() => {
    return mobileTransferRecordsMock.filter((item) => {
      if (selectedWarehouse !== "ALL" && item.warehouseName !== selectedWarehouse) {
        return false
      }
      if (
        selectedCreator !== "ALL" &&
        !item.createByName.includes(selectedCreator)
      ) {
        return false
      }
      const transferDay = (item.transferTime || item.createTime).slice(0, 10)
      if (startDate && transferDay < startDate) return false
      if (endDate && transferDay > endDate) return false

      const kw = keyword.trim().toLowerCase()
      if (!kw) return true
      return (
        item.id.toLowerCase().includes(kw) ||
        item.sourceOwner.ownerName.toLowerCase().includes(kw) ||
        item.sourceOwner.ownerIdentity.toLowerCase().includes(kw) ||
        item.targetOwner.ownerName.toLowerCase().includes(kw) ||
        item.targetOwner.ownerIdentity.toLowerCase().includes(kw) ||
        item.goodsList.some((goods) => goods.goodsName.toLowerCase().includes(kw))
      )
    })
  }, [keyword, selectedWarehouse, selectedCreator, startDate, endDate])

  const advancedFilterCount = (startDate || endDate ? 1 : 0)

  const resetAllFilters = () => {
    setKeyword("")
    setSelectedWarehouse("ALL")
    setSelectedCreator("ALL")
    setStartDate("")
    setEndDate("")
  }

  return (
    <MobileShell>
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget annotationIds={["transfer-h5-list"]}>
          <NavBar title="货物转让" backTo="/m/workspace" />
        </PrototypeAnnotationTarget>

        {/* 筛选条：漏斗 + 搜索 + 常用胶囊 */}
        <div className={H5_FILTER_BAR}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-[#232D39]/60 active:bg-gray-100"
              aria-label="更多筛选"
            >
              <Filter className="size-4.5" />
              {advancedFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {advancedFilterCount}
                </span>
              )}
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="请输入单号/货主名称/标识"
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
              label="所属仓库"
              value={selectedWarehouse}
              options={WAREHOUSE_OPTIONS}
              onChange={setSelectedWarehouse}
            />
            <DropdownFilterPill
              label="制单人"
              value={selectedCreator}
              options={CREATOR_OPTIONS}
              onChange={setSelectedCreator}
            />
          </div>
        </div>

        {/* 列表滚动区 */}
        <div className={`${H5_LIST_SCROLL} pb-8`}>
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                <Search className="size-7" />
              </div>
              <p className="text-xs font-medium text-[#232D39]/60">
                未找到符合条件的转让记录，可调整筛选条件后重试
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
              <TransferRecordCard key={item.id} item={item} />
            ))
          )}
        </div>

        {/* 更多筛选：转让日期 */}
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={() => {
            setStartDate("")
            setEndDate("")
          }}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="转让日期">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="转让开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="转让结束日期"
              />
            </div>
          </DrawerField>
        </FilterDrawer>
      </div>
    </MobileShell>
  )
}
