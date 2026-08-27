import { useState, useMemo } from "react"
import { Filter, Layers, Search, ShieldAlert, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { DrawerField, FilterDrawer } from "@/components/ui/FilterDrawer"
import { PublishConfirmDialog } from "@/components/ui/PublishConfirmDialog"
import { Toast } from "@/components/ui/Toast"
import { daysBetween } from "@/shared/lib/date-utils"
import { ENABLED_SEVERITY_LEVELS } from "@/shared/mock/severity-levels"
import { canBatchSelect } from "../domain/actions"
import {
  DEFAULT_FILTERS,
  PUBLICITY_STATUS_FILTER_OPTIONS,
  WARNING_SOURCE_FILTER_OPTIONS,
  WARNING_STATUS_FILTER_OPTIONS,
} from "../domain/constants"
import {
  COLLATERAL_WARNING_TYPES,
  type CollateralWarningEvent,
  type CollateralWarningFilters,
  type CollateralWarningType,
  type PublicityStatus,
  type WarningSourceFilter,
  type WarningStatusFilter,
} from "../domain/types"
import { CollateralWarningCard } from "../components/CollateralWarningCard"
import {
  filterCollateralWarningEvents,
  hasBatchPublishCandidates,
} from "../lib/event-utils"
import { collateralWarningEventsMock } from "../mock/collateral-warning-events.mock"

export function CollateralWarningListPage() {
  const [draftFilters, setDraftFilters] =
    useState<CollateralWarningFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<CollateralWarningFilters>(DEFAULT_FILTERS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [publishTargets, setPublishTargets] = useState<
    CollateralWarningEvent[] | null
  >(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredEvents = useMemo(
    () => filterCollateralWarningEvents(collateralWarningEventsMock, appliedFilters),
    [appliedFilters]
  )

  const batchPublishEnabled = useMemo(
    () => hasBatchPublishCandidates(filteredEvents),
    [filteredEvents]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  // 1. 预警状态下拉选项（严格对齐《押品预警信息字段清单》）
  const warningStatusOptions: DropdownOption[] = WARNING_STATUS_FILTER_OPTIONS.map(
    (status) => ({
      label: status,
      value: status,
    })
  )

  // 2. 预警类型 11 个大类下拉选项（严格对齐《押品预警信息字段清单》）
  const warningTypeOptions: DropdownOption[] = [
    { label: "全部类型", value: "全部" },
    ...COLLATERAL_WARNING_TYPES.map((type) => ({
      label: type,
      value: type,
    })),
  ]

  // 3. 是否公示下拉选项（严格对齐《押品预警信息字段清单》）
  const publicityOptions: DropdownOption[] = PUBLICITY_STATUS_FILTER_OPTIONS.map(
    (status) => ({
      label: status === "全部" ? "全部公示状态" : status,
      value: status,
    })
  )

  // 4. 来源渠道下拉选项
  const sourceOptions: DropdownOption[] = WARNING_SOURCE_FILTER_OPTIONS.map(
    (source) => ({
      label: source === "全部" ? "全部来源" : source,
      value: source,
    })
  )

  const handleStatusChange = (val: string) => {
    const next = { ...appliedFilters, warningStatus: val as WarningStatusFilter }
    setDraftFilters(next)
    setAppliedFilters(next)
  }

  const handleTypeChange = (val: string) => {
    const nextTypes: CollateralWarningType[] =
      val === "全部" ? [] : [val as CollateralWarningType]
    const next = { ...appliedFilters, warningTypes: nextTypes }
    setDraftFilters(next)
    setAppliedFilters(next)
  }

  const handlePublicityChange = (val: string) => {
    const next = { ...appliedFilters, publicityStatus: val as PublicityStatus | "全部" }
    setDraftFilters(next)
    setAppliedFilters(next)
  }

  const handleSourceChange = (val: string) => {
    const next = { ...appliedFilters, warningSource: val as WarningSourceFilter }
    setDraftFilters(next)
    setAppliedFilters(next)
  }

  const handleDrawerConfirm = () => {
    if (
      daysBetween(draftFilters.warningTimeStart, draftFilters.warningTimeEnd) >
      366
    ) {
      showToast("查询时间跨度不能超过 366 天")
      return
    }

    setAppliedFilters(draftFilters)
    setDrawerOpen(false)
  }

  const toggleSelect = (eventId: string) => {
    setSelectedIds((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId]
    )
  }

  const selectedEvents = filteredEvents.filter((event) =>
    selectedIds.includes(event.eventId)
  )

  const exitBatchMode = () => {
    setBatchMode(false)
    setSelectedIds([])
  }

  // 计算【更多筛选】抽屉生效项数量（预警等级、时间等）
  const drawerFiltersCount =
    (appliedFilters.severityLevelIds.length > 0 ? 1 : 0) +
    (appliedFilters.warningTimeStart !== DEFAULT_FILTERS.warningTimeStart ||
    appliedFilters.warningTimeEnd !== DEFAULT_FILTERS.warningTimeEnd
      ? 1
      : 0)

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["collateral-warning-page"]}>
        <NavBar
          title={batchMode ? `批量公示 (${selectedIds.length})` : "押品预警信息"}
          onBack={batchMode ? exitBatchMode : undefined}
          right={
            batchMode ? (
              <button
                type="button"
                className="text-xs font-semibold text-gray-600 active:text-gray-900 cursor-pointer"
                onClick={exitBatchMode}
              >
                取消
              </button>
            ) : (
              <button
                type="button"
                disabled={!batchPublishEnabled}
                onClick={() => setBatchMode(true)}
                className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-200 disabled:opacity-40 disabled:border-transparent active:bg-blue-100 cursor-pointer"
              >
                批量公示
              </button>
            )
          }
        />
      </PrototypeAnnotationTarget>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部搜索栏与下拉筛选条件 */}
        {!batchMode && (
          <PrototypeAnnotationTarget annotationIds={["collateral-warning-filter"]}>
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
                    placeholder="请输入预警订单号/预警内容/货品"
                    className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                    value={appliedFilters.keyword}
                    onChange={(event) => {
                      const next = {
                        ...appliedFilters,
                        keyword: event.target.value,
                      }
                      setDraftFilters(next)
                      setAppliedFilters(next)
                    }}
                  />
                  {appliedFilters.keyword ? (
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...appliedFilters, keyword: "" }
                        setDraftFilters(next)
                        setAppliedFilters(next)
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
                  label="是否公示"
                  value={appliedFilters.publicityStatus}
                  options={publicityOptions}
                  onChange={handlePublicityChange}
                />

                <DropdownFilterPill
                  label="来源渠道"
                  value={appliedFilters.warningSource}
                  options={sourceOptions}
                  onChange={handleSourceChange}
                />
              </div>
            </div>
          </PrototypeAnnotationTarget>
        )}

        {/* 批量操作提示栏 */}
        {batchMode && (
          <PrototypeAnnotationTarget annotationIds={["collateral-warning-toolbar"]}>
            <div className="flex items-center justify-between border-b border-amber-200/80 bg-amber-50/90 px-4 py-2.5 text-xs text-amber-900">
              <div className="flex items-center gap-1.5">
                <Layers className="size-4 text-amber-600" />
                <span>
                  已选择 <strong className="text-amber-700">{selectedIds.length}</strong> 条 · 仅“已处理未公示”可勾选
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const selectableCandidates = filteredEvents
                    .filter(canBatchSelect)
                    .map((item) => item.eventId)
                  setSelectedIds(selectableCandidates)
                }}
                className="text-xs font-semibold text-blue-600 active:underline cursor-pointer"
              >
                全选符合项
              </button>
            </div>
          </PrototypeAnnotationTarget>
        )}

        {/* 数据列表区域 */}
        <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
              <ShieldAlert className="size-10 text-gray-300 mb-2" />
              <div className="text-sm font-semibold text-gray-600">
                暂无符合条件的押品预警
              </div>
              <p className="mt-1 text-xs text-gray-400">
                请尝试调整搜索关键词或重置筛选条件
              </p>
              <button
                type="button"
                onClick={() => {
                  setDraftFilters(DEFAULT_FILTERS)
                  setAppliedFilters(DEFAULT_FILTERS)
                }}
                className="mt-4 rounded-xl bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700 active:bg-gray-200 cursor-pointer"
              >
                重置所有筛选
              </button>
            </div>
          ) : (
            <PrototypeAnnotationTarget annotationIds={["collateral-warning-table", "collateral-warning-row-actions"]}>
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <CollateralWarningCard
                    key={event.eventId}
                    event={event}
                    batchMode={batchMode}
                    selected={selectedIds.includes(event.eventId)}
                    selectable={canBatchSelect(event)}
                    onToggleSelect={toggleSelect}
                    onPublish={(target) => setPublishTargets([target])}
                    onPermissionDenied={() =>
                      showToast("您暂无该订单对应项目的管理权限，无法跳转办理")
                    }
                  />
                ))}
              </div>
            </PrototypeAnnotationTarget>
          )}
        </div>



        {/* 批量公示底部固定操作栏 */}
        {batchMode && (
          <div className="border-t border-gray-200/90 bg-white/95 px-4 py-3 backdrop-blur-md">
            <button
              type="button"
              className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md active:bg-blue-700 disabled:opacity-40 disabled:shadow-none"
              disabled={selectedIds.length === 0}
              onClick={() => setPublishTargets(selectedEvents)}
            >
              下一步：确认公示 ({selectedIds.length} 条)
            </button>
          </div>
        )}
      </div>

      {/* 【更多筛选项】抽屉（支持预警等级多选、预警时间范围等） */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onReset={() => setDraftFilters(DEFAULT_FILTERS)}
        onConfirm={handleDrawerConfirm}
      >
        <DrawerField label="预警等级">
          <div className="flex flex-wrap gap-1.5">
            {ENABLED_SEVERITY_LEVELS.map((level) => {
              const checked = draftFilters.severityLevelIds.includes(
                level.severityLevelId
              )
              return (
                <button
                  key={level.severityLevelId}
                  type="button"
                  className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                    checked
                      ? "bg-blue-600 text-white font-semibold shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setDraftFilters((current) => ({
                      ...current,
                      severityLevelIds: checked
                        ? current.severityLevelIds.filter(
                            (id) => id !== level.severityLevelId
                          )
                        : [...current.severityLevelIds, level.severityLevelId],
                    }))
                  }
                >
                  {level.severityCode} {level.severityName}
                </button>
              )
            })}
          </div>
        </DrawerField>

        <DrawerField label="预警时间范围（最长 366 天）">
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="flex-1 rounded-xl border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-blue-500"
              value={draftFilters.warningTimeStart}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  warningTimeStart: event.target.value,
                }))
              }
            />
            <span className="text-xs text-gray-400">至</span>
            <input
              type="date"
              className="flex-1 rounded-xl border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-blue-500"
              value={draftFilters.warningTimeEnd}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  warningTimeEnd: event.target.value,
                }))
              }
            />
          </div>
        </DrawerField>
      </FilterDrawer>

      {/* 公示确认弹窗 */}
      <PublishConfirmDialog
        open={publishTargets !== null}
        events={publishTargets ?? []}
        onClose={() => setPublishTargets(null)}
        onConfirm={() => {
          setPublishTargets(null)
          exitBatchMode()
          showToast("风险公示提交成功，已向资金方发布存证通知")
        }}
      />

      <Toast message={toastMessage} />
    </MobileShell>
  )
}
