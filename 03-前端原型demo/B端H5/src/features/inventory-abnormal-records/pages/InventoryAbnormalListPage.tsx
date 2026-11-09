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
import type { AbnormalOrderTypeLabel, AbnormalTypeLabel } from "../domain/types"
import { abnormalRecordsMock } from "../mock/inventory-abnormal.mock"

const WAREHOUSE_FILTER_OPTIONS: DropdownOption[] = [
  { label: "全部仓库", value: "全部" },
  ...WAREHOUSE_OPTIONS.map((warehouse) => ({
    label: warehouse.label,
    value: warehouse.value,
  })),
]

/** 记录是否发生在指定仓库 */
function inWarehouse(location: string, warehouse: string): boolean {
  return location.startsWith(`${warehouse}-`)
}

/** 记录是否发生在指定库房 */
function inHouse(location: string, house: string): boolean {
  return location.split("-")[1] === house
}

export function InventoryAbnormalListPage() {
  const [keyword, setKeyword] = useState("")
  const [abnormalNo, setAbnormalNo] = useState("")
  const [relateNo, setRelateNo] = useState("")
  const [ownerKeyword, setOwnerKeyword] = useState("")
  const [goodsKeyword, setGoodsKeyword] = useState("")
  const [orderTypes, setOrderTypes] = useState<AbnormalOrderTypeLabel[]>([])
  const [abnormalTypes, setAbnormalTypes] = useState<AbnormalTypeLabel[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState("全部")
  const [selectedHouse, setSelectedHouse] = useState("全部")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const houseOptions = useMemo(() => {
    const warehouse = WAREHOUSE_OPTIONS.find(
      (item) => item.value === selectedWarehouse,
    )
    return warehouse ? [...warehouse.children] : []
  }, [selectedWarehouse])

  const toggleOrderType = (type: AbnormalOrderTypeLabel) => {
    setOrderTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type],
    )
  }

  const toggleAbnormalType = (type: AbnormalTypeLabel) => {
    setAbnormalTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type],
    )
  }

  const filteredList = useMemo(() => {
    return abnormalRecordsMock.filter((item) => {
      if (abnormalNo.trim() && !item.id.includes(abnormalNo.trim())) return false
      if (relateNo.trim() && !item.relateId.includes(relateNo.trim())) return false

      if (ownerKeyword.trim()) {
        const owner = ownerKeyword.trim().toLowerCase()
        const ownerHit =
          item.owner.ownerName.toLowerCase().includes(owner) ||
          item.owner.ownerIdentity.toLowerCase().includes(owner)
        if (!ownerHit) return false
      }

      if (goodsKeyword.trim()) {
        const goods = goodsKeyword.trim().toLowerCase()
        if (!item.goodsLines.some((line) => line.goodsName.toLowerCase().includes(goods))) {
          return false
        }
      }

      if (orderTypes.length > 0 && !orderTypes.includes(item.relateOrderType)) {
        return false
      }
      if (
        abnormalTypes.length > 0 &&
        !item.goodsLines.some((line) => abnormalTypes.includes(line.abnormalType))
      ) {
        return false
      }

      if (
        selectedWarehouse !== "全部" &&
        !item.goodsLines.some((line) => inWarehouse(line.location, selectedWarehouse))
      ) {
        return false
      }
      if (
        selectedHouse !== "全部" &&
        !item.goodsLines.some((line) => inHouse(line.location, selectedHouse))
      ) {
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
    abnormalNo,
    relateNo,
    ownerKeyword,
    goodsKeyword,
    orderTypes,
    abnormalTypes,
    selectedWarehouse,
    selectedHouse,
    startDate,
    endDate,
  ])

  const advancedFilterCount =
    (abnormalNo ? 1 : 0) +
    (relateNo ? 1 : 0) +
    (ownerKeyword ? 1 : 0) +
    (goodsKeyword ? 1 : 0) +
    (orderTypes.length > 0 ? 1 : 0) +
    (abnormalTypes.length > 0 ? 1 : 0) +
    (selectedWarehouse !== "全部" ? 1 : 0) +
    (selectedHouse !== "全部" ? 1 : 0) +
    (startDate || endDate ? 1 : 0)

  const resetAllFilters = () => {
    setKeyword("")
    setAbnormalNo("")
    setRelateNo("")
    setOwnerKeyword("")
    setGoodsKeyword("")
    setOrderTypes([])
    setAbnormalTypes([])
    setSelectedWarehouse("全部")
    setSelectedHouse("全部")
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
              {advancedFilterCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {advancedFilterCount}
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
              label="仓库"
              value={selectedWarehouse}
              options={WAREHOUSE_FILTER_OPTIONS}
              onChange={(value) => {
                setSelectedWarehouse(value)
                setSelectedHouse("全部")
              }}
            />
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                orderTypes.length > 0
                  ? "border border-blue-200 bg-blue-50 font-bold text-blue-600"
                  : "bg-[#232D39]/5 text-[#232D39]/70"
              }`}
            >
              单据类型{orderTypes.length > 0 ? ` · ${orderTypes.length}` : ""}
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                abnormalTypes.length > 0
                  ? "border border-blue-200 bg-blue-50 font-bold text-blue-600"
                  : "bg-[#232D39]/5 text-[#232D39]/70"
              }`}
            >
              异动类型{abnormalTypes.length > 0 ? ` · ${abnormalTypes.length}` : ""}
            </button>
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
            setAbnormalNo("")
            setRelateNo("")
            setOwnerKeyword("")
            setGoodsKeyword("")
            setOrderTypes([])
            setAbnormalTypes([])
            setSelectedHouse("全部")
            setStartDate("")
            setEndDate("")
          }}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="异动单号">
            <input
              type="text"
              value={abnormalNo}
              onChange={(event) => setAbnormalNo(event.target.value)}
              placeholder="请输入异动单号"
              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
            />
          </DrawerField>

          <DrawerField label="关联单据">
            <input
              type="text"
              value={relateNo}
              onChange={(event) => setRelateNo(event.target.value)}
              placeholder="监管业务单号或入库单号"
              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
            />
          </DrawerField>

          <DrawerField label="货主名称/标识">
            <input
              type="text"
              value={ownerKeyword}
              onChange={(event) => setOwnerKeyword(event.target.value)}
              placeholder="请输入货主名称或识别码"
              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
            />
          </DrawerField>

          <DrawerField label="货物名称">
            <input
              type="text"
              value={goodsKeyword}
              onChange={(event) => setGoodsKeyword(event.target.value)}
              placeholder="请输入货物名称/规格"
              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
            />
          </DrawerField>

          <DrawerField label="单据类型">
            <div className="flex flex-wrap gap-1.5">
              {ORDER_TYPE_OPTIONS.map((type) => {
                const active = orderTypes.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleOrderType(type)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      active
                        ? "border border-blue-200 bg-blue-50 font-semibold text-blue-600"
                        : "bg-gray-50 text-[#232D39]/70"
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </DrawerField>

          <DrawerField label="异动类型">
            <div className="flex flex-wrap gap-1.5">
              {ABNORMAL_TYPE_OPTIONS.map((type) => {
                const active = abnormalTypes.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleAbnormalType(type)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      active
                        ? "border border-blue-200 bg-blue-50 font-semibold text-blue-600"
                        : "bg-gray-50 text-[#232D39]/70"
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </DrawerField>

          <DrawerField label="仓库/库房">
            <div className="flex items-center gap-2">
              <select
                value={selectedWarehouse}
                onChange={(event) => {
                  setSelectedWarehouse(event.target.value)
                  setSelectedHouse("全部")
                }}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
              >
                {WAREHOUSE_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedHouse}
                onChange={(event) => setSelectedHouse(event.target.value)}
                disabled={selectedWarehouse === "全部"}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39] disabled:bg-gray-50 disabled:text-[#232D39]/35"
              >
                <option value="全部">全部库房</option>
                {houseOptions.map((house) => (
                  <option key={house} value={house}>
                    {house}
                  </option>
                ))}
              </select>
            </div>
          </DrawerField>

          <DrawerField label="申请时间范围">
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
