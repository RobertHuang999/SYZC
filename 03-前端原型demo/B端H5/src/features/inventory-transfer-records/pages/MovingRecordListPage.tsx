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
import { MovingRecordCard } from "../components/MovingRecordCard"
import { MOCK_MOVING_RECORDS } from "../mock/moving-records.mock"
import {
  MOVING_RECORD_TYPE_FILTER_OPTIONS,
  WORKSPACE_ROUTE,
} from "../domain/constants"
import type { MovingRecordItem, MovingRecordType } from "../domain/types"

const TYPE_OPTIONS: DropdownOption[] = MOVING_RECORD_TYPE_FILTER_OPTIONS.map(
  (option) => ({ label: option.label, value: option.value })
)

const WAREHOUSE_OPTIONS: DropdownOption[] = [
  { label: "全部仓库", value: "全部" },
  ...Array.from(new Set(MOCK_MOVING_RECORDS.map((item) => item.warehouseName))).map(
    (name) => ({ label: name, value: name })
  ),
]

const GOODS_OPTIONS: DropdownOption[] = [
  { label: "全部货品", value: "全部" },
  ...Array.from(
    new Set(
      MOCK_MOVING_RECORDS.flatMap((item) => item.goods.map((line) => line.goodsName))
    )
  ).map((name) => ({ label: name, value: name })),
]

const CREATOR_OPTIONS: DropdownOption[] = [
  { label: "全部制单人", value: "全部" },
  ...Array.from(
    new Set(MOCK_MOVING_RECORDS.map((item) => item.creatorName))
  ).map((name) => ({ label: name, value: name })),
]

function dayOf(dateTime: string): string {
  return dateTime.trim().split(" ")[0] ?? ""
}

export function MovingRecordListPage() {
  const [keyword, setKeyword] = useState("")
  const [selectedType, setSelectedType] = useState<MovingRecordType | "全部">("全部")
  const [selectedWarehouse, setSelectedWarehouse] = useState("全部")
  const [selectedGoods, setSelectedGoods] = useState("全部")
  const [selectedCreator, setSelectedCreator] = useState("全部")
  const [moveStartDate, setMoveStartDate] = useState("")
  const [moveEndDate, setMoveEndDate] = useState("")
  const [createStartDate, setCreateStartDate] = useState("")
  const [createEndDate, setCreateEndDate] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredList = useMemo(() => {
    return MOCK_MOVING_RECORDS.filter((item: MovingRecordItem) => {
      if (selectedType !== "全部" && item.moveType !== selectedType) return false
      if (selectedWarehouse !== "全部" && item.warehouseName !== selectedWarehouse) {
        return false
      }
      if (
        selectedGoods !== "全部" &&
        !item.goods.some((line) => line.goodsName === selectedGoods)
      ) {
        return false
      }
      if (selectedCreator !== "全部" && item.creatorName !== selectedCreator) {
        return false
      }

      const moveDay = dayOf(item.moveTime)
      if (moveStartDate && moveDay < moveStartDate) return false
      if (moveEndDate && moveDay > moveEndDate) return false

      const createDay = dayOf(item.createTime)
      if (createStartDate && createDay < createStartDate) return false
      if (createEndDate && createDay > createEndDate) return false

      const query = keyword.trim().toLowerCase()
      if (!query) return true
      return (
        item.id.toLowerCase().includes(query) ||
        item.ownerName.toLowerCase().includes(query) ||
        item.ownerIdentifier.toLowerCase().includes(query) ||
        item.goodsNameSummary.toLowerCase().includes(query) ||
        item.goods.some((line) => line.goodsName.toLowerCase().includes(query))
      )
    })
  }, [
    keyword,
    selectedType,
    selectedWarehouse,
    selectedGoods,
    selectedCreator,
    moveStartDate,
    moveEndDate,
    createStartDate,
    createEndDate,
  ])

  const advancedFilterCount =
    (selectedCreator !== "全部" ? 1 : 0) +
    (moveStartDate || moveEndDate ? 1 : 0) +
    (createStartDate || createEndDate ? 1 : 0)

  const resetAllFilters = () => {
    setKeyword("")
    setSelectedType("全部")
    setSelectedWarehouse("全部")
    setSelectedGoods("全部")
    setSelectedCreator("全部")
    setMoveStartDate("")
    setMoveEndDate("")
    setCreateStartDate("")
    setCreateEndDate("")
  }

  return (
    <MobileShell>
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget annotationIds={["moving-h5-list"]}>
          <NavBar title="移库管理" backTo={WORKSPACE_ROUTE} />
        </PrototypeAnnotationTarget>

        {/* 筛选条：搜索 + 常用胶囊 + 更多筛选 */}
        <div className={H5_FILTER_BAR}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-[#232D39]/60 active:bg-gray-100"
              aria-label="更多筛选"
            >
              <Filter className="size-4.5" />
              {advancedFilterCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {advancedFilterCount}
                </span>
              ) : null}
            </button>

            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                placeholder="请输入移库单号/货主/货物"
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
              label="移库类型"
              value={selectedType}
              options={TYPE_OPTIONS}
              onChange={(value) => setSelectedType(value as MovingRecordType | "全部")}
            />
            <DropdownFilterPill
              label="所属仓库"
              value={selectedWarehouse}
              options={WAREHOUSE_OPTIONS}
              onChange={setSelectedWarehouse}
            />
            <DropdownFilterPill
              label="货品名称"
              value={selectedGoods}
              options={GOODS_OPTIONS}
              onChange={setSelectedGoods}
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
                未找到符合条件的移库记录，可调整筛选条件后重试
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
              <MovingRecordCard key={item.id} item={item} />
            ))
          )}
        </div>

        {/* 更多筛选：移库日期、制单人、制单日期 */}
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={() => {
            setSelectedCreator("全部")
            setMoveStartDate("")
            setMoveEndDate("")
            setCreateStartDate("")
            setCreateEndDate("")
          }}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="移库日期">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={moveStartDate}
                onChange={(event) => setMoveStartDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="移库开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={moveEndDate}
                onChange={(event) => setMoveEndDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="移库结束日期"
              />
            </div>
          </DrawerField>

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
      </div>
    </MobileShell>
  )
}
