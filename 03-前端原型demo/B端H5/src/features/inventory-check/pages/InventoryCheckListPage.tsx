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
import { InventoryCheckCard } from "../components/InventoryCheckCard"
import {
  CHECK_ACTUAL_USER_OPTIONS,
  CHECK_CREATOR_OPTIONS,
  CHECK_RESULT_OPTIONS,
  CHECK_STATUS_OPTIONS,
  CHECK_TYPE_OPTIONS,
  CHECK_WAREHOUSE_OPTIONS,
  CHECK_CURRENT_USER,
  CHECK_WORKSPACE_ROUTE,
  DEFAULT_CHECK_FILTERS,
} from "../domain/constants"
import type { CheckListFilters, InventoryCheckRecord } from "../domain/types"
import { filterCheckRecords } from "../lib/check-utils"
import { INVENTORY_CHECK_RECORDS } from "../mock/inventory-checks.mock"

const TYPE_OPTIONS: DropdownOption[] = CHECK_TYPE_OPTIONS
const STATUS_OPTIONS: DropdownOption[] = CHECK_STATUS_OPTIONS
const RESULT_OPTIONS: DropdownOption[] = CHECK_RESULT_OPTIONS
const WAREHOUSE_OPTIONS: DropdownOption[] = CHECK_WAREHOUSE_OPTIONS

function canCheckRecord(record: InventoryCheckRecord): boolean {
  return (
    record.status === "PENDING_START" ||
    record.status === "IN_PROGRESS" ||
    record.status === "EXPIRED"
  )
}

function canRevokeRecord(record: InventoryCheckRecord): boolean {
  return (
    record.status === "PENDING_START" &&
    record.creatorId === CHECK_CURRENT_USER.id
  )
}

export function InventoryCheckListPage() {
  const [records, setRecords] = useState<InventoryCheckRecord[]>(
    () => INVENTORY_CHECK_RECORDS
  )
  const [filters, setFilters] = useState<CheckListFilters>(DEFAULT_CHECK_FILTERS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<InventoryCheckRecord | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const patchFilters = (patch: Partial<CheckListFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  const filtered = useMemo(
    () => filterCheckRecords(records, filters),
    [records, filters]
  )

  const advancedFilterCount =
    (filters.taskName ? 1 : 0) +
    (filters.actualUsers.length > 0 ? 1 : 0) +
    (filters.creator !== "ALL" ? 1 : 0) +
    (filters.startDate || filters.endDate ? 1 : 0)

  const activeFilterCount =
    (filters.checkType !== "ALL" ? 1 : 0) +
    (filters.status !== "ALL" ? 1 : 0) +
    (filters.result !== "ALL" ? 1 : 0) +
    (filters.warehouseName !== "ALL" ? 1 : 0) +
    (advancedFilterCount > 0 ? 1 : 0)

  const resetAll = () => {
    setFilters(DEFAULT_CHECK_FILTERS)
    setDrawerOpen(false)
  }

  const resetDrawer = () => {
    patchFilters({
      taskName: "",
      actualUsers: [],
      creator: "ALL",
      startDate: "",
      endDate: "",
    })
  }

  const handleCheck = (record: InventoryCheckRecord) => {
    showToast(`已打开 ${record.checkNo} 的盘点任务（现场录入页不在本次原型范围）`)
  }

  const handleRevoke = (record: InventoryCheckRecord) => {
    setRevoking(record)
  }

  const confirmRevoke = () => {
    if (!revoking) return
    setRecords((prev) =>
      prev.map((record) =>
        record.id === revoking.id ? { ...record, status: "REVOKED" } : record
      )
    )
    showToast(`盘点单 ${revoking.checkNo} 已撤销，未产生盘点数据`)
    setRevoking(null)
  }

  const toggleActualUser = (user: string) => {
    setFilters((prev) => ({
      ...prev,
      actualUsers: prev.actualUsers.includes(user)
        ? prev.actualUsers.filter((item) => item !== user)
        : [...prev.actualUsers, user],
    }))
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget annotationIds={["check-h5-list"]}>
          <NavBar title="货物盘点" backTo={CHECK_WORKSPACE_ROUTE} />
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
                placeholder="请输入盘点单号/任务名称"
                className={H5_SEARCH_INPUT}
                value={filters.keyword}
                onChange={(event) => patchFilters({ keyword: event.target.value })}
              />
              {filters.keyword ? (
                <button
                  type="button"
                  onClick={() => patchFilters({ keyword: "" })}
                  className="absolute right-2.5 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 text-gray-600"
                  aria-label="清空搜索"
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
              label="盘点类型"
              value={filters.checkType}
              options={TYPE_OPTIONS}
              onChange={(value) => patchFilters({ checkType: value })}
            />
            <DropdownFilterPill
              label="盘点状态"
              value={filters.status}
              options={STATUS_OPTIONS}
              onChange={(value) => patchFilters({ status: value })}
            />
            <DropdownFilterPill
              label="盘点结果"
              value={filters.result}
              options={RESULT_OPTIONS}
              onChange={(value) => patchFilters({ result: value })}
            />
            <DropdownFilterPill
              label="仓库"
              value={filters.warehouseName}
              options={WAREHOUSE_OPTIONS}
              onChange={(value) => patchFilters({ warehouseName: value })}
            />
          </div>
        </div>

        <div className={`${H5_LIST_SCROLL} pb-8`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                <Search className="size-7" />
              </div>
              <p className="text-xs font-medium text-[#232D39]/60">
                暂无符合条件的盘点任务
              </p>
              <p className="mt-1 text-[11px] text-[#232D39]/40">
                试试调整筛选条件，或重置后重新查询
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-xs"
              >
                <RotateCcw className="size-3" />
                重置筛选条件
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <InventoryCheckCard
                key={item.id}
                item={item}
                canCheck={canCheckRecord(item)}
                canRevoke={canRevokeRecord(item)}
                onCheck={handleCheck}
                onRevoke={handleRevoke}
              />
            ))
          )}
        </div>

        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={resetDrawer}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="任务名称">
            <input
              type="text"
              value={filters.taskName}
              onChange={(event) => patchFilters({ taskName: event.target.value })}
              placeholder="请输入任务名称"
              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
            />
          </DrawerField>

          <DrawerField label="盘点时间">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(event) => patchFilters({ startDate: event.target.value })}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="盘点开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(event) => patchFilters({ endDate: event.target.value })}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="盘点结束日期"
              />
            </div>
          </DrawerField>

          <DrawerField label="实际盘点人员">
            <div className="flex flex-wrap gap-2">
              {CHECK_ACTUAL_USER_OPTIONS.map((user) => {
                const active = filters.actualUsers.includes(user)
                return (
                  <button
                    key={user}
                    type="button"
                    onClick={() => toggleActualUser(user)}
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      active
                        ? "border-blue-200 bg-blue-50 font-semibold text-blue-600"
                        : "border-gray-200 bg-white text-[#232D39]/70"
                    }`}
                  >
                    {user}
                  </button>
                )
              })}
            </div>
          </DrawerField>

          <DrawerField label="制单人">
            <div className="flex flex-wrap gap-2">
              {CHECK_CREATOR_OPTIONS.map((option) => {
                const active = filters.creator === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => patchFilters({ creator: option.value })}
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      active
                        ? "border-blue-200 bg-blue-50 font-semibold text-blue-600"
                        : "border-gray-200 bg-white text-[#232D39]/70"
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </DrawerField>
        </FilterDrawer>

        {revoking && (
          <div className="absolute inset-0 z-50 flex items-end bg-black/40">
            <button
              type="button"
              className="absolute inset-0"
              aria-label="关闭撤销确认"
              onClick={() => setRevoking(null)}
            />
            <div className="relative w-full rounded-t-2xl bg-white p-4 pb-8">
              <h3 className="text-base font-semibold text-[#232D39]">撤销盘点单</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#232D39]/70">
                确认撤销盘点单「{revoking.checkNo}」？撤销后任务终止，已录入的盘点数据将不再生效。
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setRevoking(null)}
                  className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-[#232D39]"
                >
                  再想想
                </button>
                <button
                  type="button"
                  onClick={confirmRevoke}
                  className="flex-1 rounded-lg bg-rose-600 py-2.5 text-sm font-medium text-white"
                >
                  确认撤销
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
