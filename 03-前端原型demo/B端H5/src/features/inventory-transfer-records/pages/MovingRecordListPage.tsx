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
import { MOVING_CREATOR_OPTIONS } from "../mock/moving-form.mock"
import { MOVING_FLOW_TYPES } from "../domain/constants"
import type { MovingRecordItem } from "../domain/types"

/** 仓库筛选选项取自真实 Mock 数据，避免选项与记录对不上导致空列表 */
const REPO_OPTIONS: DropdownOption[] = [
  { label: "全部仓库", value: "全部" },
  ...Array.from(
    new Set(
      MOCK_MOVING_RECORDS.flatMap((item) => [
        item.repoNames,
        ...item.respOutStockInfoVoList.map((goods) => goods.sourceRepoName),
      ]).filter(Boolean)
    )
  ).map((name) => ({ label: name, value: name })),
]

const TYPE_OPTIONS: DropdownOption[] = [
  { label: "全部类型", value: "全部" },
  ...MOVING_FLOW_TYPES.map((type) => ({ label: type.name, value: type.id })),
]

const CREATOR_OPTIONS: DropdownOption[] = [
  { label: "全部制单人", value: "全部" },
  ...MOVING_CREATOR_OPTIONS.map((creator) => ({
    label: `${creator.userName}（${creator.belongOrgName}）`,
    value: creator.id,
  })),
]

function dayOf(dateTime: string): string {
  return dateTime.trim().split(" ")[0] ?? ""
}

export function MovingRecordListPage() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedRepoId, setSelectedRepoId] = useState("全部")
  const [selectedFlowType, setSelectedFlowType] = useState("全部")
  const [selectedCreatorId, setSelectedCreatorId] = useState("全部")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2500)
  }

  const filteredList = useMemo(() => {
    return MOCK_MOVING_RECORDS.filter((item) => {
      const keyword = searchKeyword.trim().toLowerCase()
      if (keyword) {
        const hitKeyword =
          item.ownerName.toLowerCase().includes(keyword) ||
          item.ownerIdentity.toLowerCase().includes(keyword) ||
          item.id.toLowerCase().includes(keyword) ||
          item.goodsInfo.toLowerCase().includes(keyword)
        if (!hitKeyword) return false
      }

      if (selectedRepoId !== "全部") {
        const hitRepo =
          item.repoNames.includes(selectedRepoId) ||
          item.respOutStockInfoVoList.some(
            (goods) =>
              goods.sourceRepoName === selectedRepoId ||
              goods.targetRepoName === selectedRepoId
          )
        if (!hitRepo) return false
      }

      if (selectedFlowType !== "全部" && item.flowType !== selectedFlowType) {
        return false
      }

      if (selectedCreatorId !== "全部" && item.createByName !== selectedCreatorIdName(selectedCreatorId)) {
        return false
      }

      const day = dayOf(item.transferTime || item.createTime)
      if (startDate && day < startDate) return false
      if (endDate && day > endDate) return false

      return true
    })
  }, [searchKeyword, selectedRepoId, selectedFlowType, selectedCreatorId, startDate, endDate])

  const advancedFilterCount =
    (selectedCreatorId !== "全部" ? 1 : 0) + (startDate || endDate ? 1 : 0)

  const resetFilters = () => {
    setSearchKeyword("")
    setSelectedRepoId("全部")
    setSelectedFlowType("全部")
    setSelectedCreatorId("全部")
    setStartDate("")
    setEndDate("")
  }

  const handleDownload = (kind: "bill" | "history", item: MovingRecordItem) => {
    showToast(
      kind === "bill"
        ? `正在生成移库凭证 PDF（${item.id}）...`
        : `正在导出移库下载记录（${item.id}）...`
    )
  }

  return (
    <MobileShell>
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget annotationIds={["moving-h5-list"]}>
          <NavBar title="移库管理" backTo="/m/workspace" />
        </PrototypeAnnotationTarget>

        {/* 筛选条：搜索 + 常用胶囊 + 更多筛选 */}
        <div className={H5_FILTER_BAR}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex size-7 shrink-0 items-center justify-center rounded-md text-[#232D39]/50 active:bg-[#232D39]/5"
              aria-label="更多筛选"
            >
              <Filter className="size-4" />
              {advancedFilterCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {advancedFilterCount}
                </span>
              ) : null}
            </button>

            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                placeholder="请输入货主名称/标识"
                className={H5_SEARCH_INPUT}
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
              {searchKeyword ? (
                <button
                  type="button"
                  onClick={() => setSearchKeyword("")}
                  className="absolute right-2.5 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 text-gray-600"
                >
                  <X className="size-2" />
                </button>
              ) : (
                <Search className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#232D39]/40" />
              )}
            </div>
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
            <DropdownFilterPill
              label="所属仓库"
              value={selectedRepoId}
              options={REPO_OPTIONS}
              onChange={setSelectedRepoId}
            />
            <DropdownFilterPill
              label="移库类型"
              value={selectedFlowType}
              options={TYPE_OPTIONS}
              onChange={setSelectedFlowType}
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
                onClick={resetFilters}
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-xs"
              >
                <RotateCcw className="size-3" />
                重置筛选条件
              </button>
            </div>
          ) : (
            filteredList.map((item) => (
              <MovingRecordCard
                key={item.id}
                item={item}
                onDownloadBill={(row) => handleDownload("bill", row)}
                onDownloadHistory={(row) => handleDownload("history", row)}
              />
            ))
          )}
        </div>

        {/* 更多筛选：制单人 + 移库日期 */}
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={() => {
            setSelectedCreatorId("全部")
            setStartDate("")
            setEndDate("")
          }}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="制单人">
            <div className="grid grid-cols-2 gap-2">
              {CREATOR_OPTIONS.map((option) => {
                const active = selectedCreatorId === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedCreatorId(option.value)}
                    className={`truncate rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      active
                        ? "border border-blue-200 bg-blue-50 font-bold text-blue-600"
                        : "border border-transparent bg-gray-50 text-[#232D39]/80"
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </DrawerField>

          <DrawerField label="移库日期">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="结束日期"
              />
            </div>
          </DrawerField>
        </FilterDrawer>

        {toast ? (
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}

/** 制单人筛选值（ID）→ 人员姓名 */
function selectedCreatorIdName(creatorId: string): string {
  return MOVING_CREATOR_OPTIONS.find((creator) => creator.id === creatorId)?.userName ?? ""
}
