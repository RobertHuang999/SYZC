import { useState, useMemo } from "react"
import {
  Cpu,
  Filter,
  Search,
  X,
} from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { DrawerField, FilterDrawer } from "@/components/ui/FilterDrawer"
import { ENABLED_SEVERITY_LEVELS } from "@/shared/mock/severity-levels"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  DEFAULT_DEVICE_WARNING_FILTERS,
  DEVICE_WARNING_STATUS_FILTER_OPTIONS,
  DEVICE_WARNING_STATUS_LABEL_OPTIONS,
  DEVICE_WARNING_TYPES,
  DEVICE_WARNING_WAREHOUSES,
} from "../domain/constants"
import type {
  DeviceWarningEvent,
  DeviceWarningFilters,
  DeviceWarningFrequency,
  DeviceWarningStatusFilter,
  DeviceWarningType,
} from "../domain/types"
import { DeviceWarningCard } from "../components/DeviceWarningCard"
import { filterDeviceWarningEvents } from "../lib/event-utils"
import { deviceWarningEventsMock } from "../mock/device-warning-events.mock"

const DEVICE_WARNING_FILTER_STORAGE_KEY = "SYZC_H5_DEVICE_WARNING_FILTERS"

function loadCachedDeviceFilters(): DeviceWarningFilters {
  try {
    const raw = sessionStorage.getItem(DEVICE_WARNING_FILTER_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_DEVICE_WARNING_FILTERS
}

function saveCachedDeviceFilters(filters: DeviceWarningFilters) {
  try {
    sessionStorage.setItem(DEVICE_WARNING_FILTER_STORAGE_KEY, JSON.stringify(filters))
  } catch {}
}

export function DeviceWarningEventListPage() {
  const [draftFilters, setDraftFilters] = useState<DeviceWarningFilters>(loadCachedDeviceFilters)
  const [appliedFilters, setAppliedFilters] = useState<DeviceWarningFilters>(loadCachedDeviceFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [frequencyTarget, setFrequencyTarget] = useState<DeviceWarningEvent | null>(null)

  const events = useMemo(
    () => filterDeviceWarningEvents(deviceWarningEventsMock, appliedFilters),
    [appliedFilters]
  )

  const updateFilter = (patch: Partial<DeviceWarningFilters>) => {
    setDraftFilters((current) => ({ ...current, ...patch }))
  }

  const applyFilters = () => {
    setAppliedFilters(draftFilters)
    saveCachedDeviceFilters(draftFilters)
    setDrawerOpen(false)
  }

  const resetFilters = () => {
    setDraftFilters(DEFAULT_DEVICE_WARNING_FILTERS)
    setAppliedFilters(DEFAULT_DEVICE_WARNING_FILTERS)
    saveCachedDeviceFilters(DEFAULT_DEVICE_WARNING_FILTERS)
  }

  // 1. 预警状态下拉选项
  const warningStatusOptions: DropdownOption[] = DEVICE_WARNING_STATUS_FILTER_OPTIONS.map(
    (status) => ({
      label: DEVICE_WARNING_STATUS_LABEL_OPTIONS[status],
      value: status,
    })
  )

  // 2. 预警类型 5 个标准大类下拉选项
  const warningTypeOptions: DropdownOption[] = [
    { label: "全部类型", value: "全部" },
    ...DEVICE_WARNING_TYPES.map((type) => ({
      label: type,
      value: type,
    })),
  ]

  // 3. 所属监管仓库下拉选项
  const warehouseOptions: DropdownOption[] = DEVICE_WARNING_WAREHOUSES.map(
    (warehouse) => ({
      label: warehouse === "全部" ? "全部仓库" : warehouse,
      value: warehouse,
    })
  )

  // 4. 触发频次下拉选项
  const frequencyOptions: DropdownOption[] = [
    { label: "全部频次", value: "全部" },
    { label: "高频（>5 次）", value: "高频（>5 次）" },
  ]

  const handleStatusChange = (val: string) => {
    const next = { ...appliedFilters, warningStatus: val as DeviceWarningStatusFilter }
    setDraftFilters(next)
    setAppliedFilters(next)
    saveCachedDeviceFilters(next)
  }

  const handleTypeChange = (val: string) => {
    const nextTypes: DeviceWarningType[] =
      val === "全部" ? [] : [val as DeviceWarningType]
    const next = { ...appliedFilters, warningTypes: nextTypes }
    setDraftFilters(next)
    setAppliedFilters(next)
    saveCachedDeviceFilters(next)
  }

  const handleWarehouseChange = (val: string) => {
    const next = { ...appliedFilters, warehouseName: val }
    setDraftFilters(next)
    setAppliedFilters(next)
    saveCachedDeviceFilters(next)
  }

  const handleFrequencyChange = (val: string) => {
    const next = { ...appliedFilters, triggerFrequency: val as DeviceWarningFrequency }
    setDraftFilters(next)
    setAppliedFilters(next)
    saveCachedDeviceFilters(next)
  }

  const toggleSeverity = (severityLevelId: string) => {
    setDraftFilters((current) => ({
      ...current,
      severityLevelIds: current.severityLevelIds.includes(severityLevelId)
        ? current.severityLevelIds.filter((item) => item !== severityLevelId)
        : [...current.severityLevelIds, severityLevelId],
    }))
  }

  const drawerFiltersCount =
    (appliedFilters.severityLevelIds.length > 0 ? 1 : 0) +
    (appliedFilters.firstWarningTimeStart !== DEFAULT_DEVICE_WARNING_FILTERS.firstWarningTimeStart ||
    appliedFilters.firstWarningTimeEnd !== DEFAULT_DEVICE_WARNING_FILTERS.firstWarningTimeEnd
      ? 1
      : 0)

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["device-warning-page"]}>
        <NavBar title="设备预警信息" />
      </PrototypeAnnotationTarget>

      {/* 顶部搜索栏与下拉筛选条件 */}
      <PrototypeAnnotationTarget annotationIds={["device-warning-filter"]}>
        <div className="shrink-0 space-y-2 border-b border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs">
          {/* 1. 搜索栏行 */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-500 active:bg-gray-100 cursor-pointer"
              aria-label="更多筛选"
            >
              <Filter className="size-4.5 text-gray-600" />
              {drawerFiltersCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {drawerFiltersCount}
                </span>
              )}
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="请输入预警规则/设备名称/设备编码"
                className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                value={draftFilters.keyword}
                onChange={(event) => {
                  const keyword = event.target.value
                  updateFilter({ keyword })
                  setAppliedFilters((current) => {
                    const next = { ...current, keyword }
                    saveCachedDeviceFilters(next)
                    return next
                  })
                }}
              />
              {draftFilters.keyword ? (
                <button
                  type="button"
                  onClick={() => {
                    updateFilter({ keyword: "" })
                    setAppliedFilters((current) => {
                      const next = { ...current, keyword: "" }
                      saveCachedDeviceFilters(next)
                      return next
                    })
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-4 items-center justify-center rounded-full bg-gray-300 text-gray-600 cursor-pointer"
                >
                  <X className="size-2.5" />
                </button>
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              )}
            </div>
          </div>

          {/* 2. 筛选条件下拉胶囊行 */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <DropdownFilterPill
              label="预警状态"
              value={appliedFilters.warningStatus}
              options={warningStatusOptions}
              renderLabel={(val) => DEVICE_WARNING_STATUS_LABEL_OPTIONS[val as keyof typeof DEVICE_WARNING_STATUS_LABEL_OPTIONS] || val}
              onChange={handleStatusChange}
            />

            <DropdownFilterPill
              label="预警类型"
              value={
                appliedFilters.warningTypes.length === 0
                  ? "全部"
                  : appliedFilters.warningTypes[0]
              }
              options={warningTypeOptions}
              onChange={handleTypeChange}
            />

            <DropdownFilterPill
              label="所属仓库"
              value={appliedFilters.warehouseName}
              options={warehouseOptions}
              onChange={handleWarehouseChange}
            />

            <DropdownFilterPill
              label="触发频次"
              value={appliedFilters.triggerFrequency}
              options={frequencyOptions}
              onChange={handleFrequencyChange}
            />
          </div>
        </div>
      </PrototypeAnnotationTarget>

      {/* 预警卡片列表 */}
      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
            <Cpu className="size-10 text-gray-300 mb-2" />
            <div className="text-sm font-semibold text-gray-600">
              暂无符合条件的设备预警
            </div>
            <p className="mt-1 text-xs text-gray-400">
              请尝试调整搜索关键词或重置筛选条件
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-xl bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700 active:bg-gray-200 cursor-pointer"
            >
              重置所有筛选
            </button>
          </div>
        ) : (
          <PrototypeAnnotationTarget annotationIds={["device-warning-table"]}>
            <div className="space-y-3">
              {events.map((event) => (
                <DeviceWarningCard
                  key={event.eventId}
                  event={event}
                  onShowFrequencyHistory={(target) => setFrequencyTarget(target)}
                />
              ))}
            </div>
          </PrototypeAnnotationTarget>
        )}
      </div>

      {/* 【更多筛选项】抽屉 */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onReset={resetFilters}
        onConfirm={applyFilters}
      >
        <DrawerField label="预警等级">
          <div className="flex flex-wrap gap-1.5">
            {ENABLED_SEVERITY_LEVELS.map((level) => (
              <button
                key={level.severityLevelId}
                type="button"
                className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                  draftFilters.severityLevelIds.includes(level.severityLevelId)
                    ? "bg-blue-600 text-white font-semibold shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => toggleSeverity(level.severityLevelId)}
              >
                {level.severityCode} {level.severityName}
              </button>
            ))}
          </div>
        </DrawerField>

        <DrawerField label="首次预警时间范围">
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="flex-1 rounded-xl border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-blue-500"
              value={draftFilters.firstWarningTimeStart}
              onChange={(event) => updateFilter({ firstWarningTimeStart: event.target.value })}
            />
            <span className="text-xs text-gray-400">至</span>
            <input
              type="date"
              className="flex-1 rounded-xl border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-blue-500"
              value={draftFilters.firstWarningTimeEnd}
              onChange={(event) => updateFilter({ firstWarningTimeEnd: event.target.value })}
            />
          </div>
        </DrawerField>
      </FilterDrawer>

      {/* 触发频次历史弹窗抽屉 */}
      {frequencyTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in"
            aria-label="关闭触发历史"
            onClick={() => setFrequencyTarget(null)}
          />
          <div className="relative z-10 w-full max-w-[430px] rounded-t-3xl bg-white p-4 shadow-2xl animate-slide-up">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  触发流水明细 · {frequencyTarget.ruleName}
                </h2>
                <p className="text-[11px] text-gray-500">
                  设备：{frequencyTarget.deviceName}（共 {frequencyTarget.triggerCount} 次）
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFrequencyTarget(null)}
                className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[50vh] space-y-2.5 overflow-y-auto px-1 text-xs">
              {frequencyTarget.triggerHistory.map((time, index) => (
                <div
                  key={`${time}-${index}`}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{time}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      预警子类型: {frequencyTarget.warningSubType} · 状态有效
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl bg-blue-50/70 p-2.5 text-[11px] text-blue-900 border border-blue-100">
              💡 频次累加不重复下发外部短信，防抖周期内自动合并为同轮次事件。
            </div>

            <button
              type="button"
              onClick={() => setFrequencyTarget(null)}
              className="mt-3 w-full rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200 cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  )
}
