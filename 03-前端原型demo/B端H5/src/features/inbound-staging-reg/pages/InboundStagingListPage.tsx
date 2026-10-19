import { useEffect, useMemo, useState } from "react"
import { Filter, Plus, RotateCcw, Search, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { GoodsSpecCascadePill } from "@/features/inbound-records/components/GoodsSpecCascadePill"
import { WarehouseStoreroomCascadePill } from "@/features/inbound-records/components/WarehouseStoreroomCascadePill"
import { INBOUND_WAREHOUSE_STOREROOM_TREE } from "@prototype/shared/inbound/filter-cascade-trees"
import { inboundWarehouseCascadeKeyMatchesRow } from "@prototype/shared/inbound/list-filter-match"
import { resolveStagingGoodsNames } from "@prototype/shared/inbound/staging-goods-display"
import { INBOUND_GOODS_CASCADE_TREE } from "@/features/inbound-records/mock/inbound-goods-cascade.mock"
import {
  inboundStagingRegsMock,
  voidStagingReg,
  type InboundStagingReg,
  type StagingRegStatus,
} from "@prototype/shared/inbound/inbound-staging.mock"
import { ConvertToFormalSheet } from "../components/ConvertToFormalSheet"
import { InboundStagingRegCard } from "../components/InboundStagingRegCard"
import { StagingVoidSheet } from "../components/StagingVoidSheet"
import {
  H5_INBOUND_INITIATE_ROUTE,
  INBOUND_STAGING_FORM_ROUTE,
  INBOUND_STAGING_LIST_ROUTE,
  inboundStagingEditQuery,
} from "../domain/constants"
import { WORKSPACE_ROUTE } from "@/features/inbound-records/domain/constants"
import { INBOUND_STAGING_CONVERT_ENABLED } from "@prototype/shared/inbound/inbound-633-delivery"
import {
  InboundDateFilterModal,
  type DateRangeDraft,
} from "@/features/inbound-records/components/InboundDateFilterModal"
import { H5_FILTER_BAR, H5_LIST_SCROLL, H5_PAGE_BODY } from "@/shared/h5-ui-theme"
import { navigateToFormalInbound } from "../lib/formal-inbound-nav"

const EMPTY_DATE_RANGE: DateRangeDraft = {
  inboundStart: "",
  inboundEnd: "",
  createStart: "",
  createEnd: "",
}

function dayFromDateTime(isoLike: string): string {
  return isoLike.trim().split(" ")[0]?.split("T")[0] ?? ""
}

function withinDayRange(day: string, start: string, end: string): boolean {
  if (!day) return false
  if (start && day < start) return false
  if (end && day > end) return false
  return true
}

const STATUS_OPTIONS: DropdownOption[] = [
  { label: "全部状态", value: "全部" },
  { label: "待补全", value: "待补全" },
  { label: "已转正式", value: "已转正式" },
  { label: "已作废", value: "已作废" },
]

const TYPE_OPTIONS: DropdownOption[] = [
  { label: "全部类型", value: "全部" },
  { label: "普通入库", value: "普通入库" },
  { label: "质押入库", value: "质押入库" },
  { label: "抵押入库", value: "抵押入库" },
  { label: "监管服务入库", value: "监管服务入库" },
  { label: "仓单入库", value: "仓单入库" },
]

export function InboundStagingListPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState<(StagingRegStatus | "全部")>("全部")
  const [inboundType, setInboundType] = useState("全部")
  const [selectedWarehouseKeys, setSelectedWarehouseKeys] = useState<string[]>([])
  const [selectedGoodsKeys, setSelectedGoodsKeys] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [mockTick, setMockTick] = useState(0)
  const [convertTarget, setConvertTarget] = useState<InboundStagingReg | null>(null)
  const [voidTarget, setVoidTarget] = useState<InboundStagingReg | null>(null)
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [dateDraft, setDateDraft] = useState<DateRangeDraft>({ ...EMPTY_DATE_RANGE })
  const [dateApplied, setDateApplied] = useState<DateRangeDraft>({ ...EMPTY_DATE_RANGE })

  useEffect(() => {
    const bump = () => setMockTick((t) => t + 1)
    window.addEventListener("focus", bump)
    window.addEventListener("staging-reg-updated", bump)
    return () => {
      window.removeEventListener("focus", bump)
      window.removeEventListener("staging-reg-updated", bump)
    }
  }, [])

  const filtered = useMemo(() => {
    void mockTick
    return inboundStagingRegsMock.filter((row) => {
      if (status !== "全部" && row.status !== status) return false
      if (inboundType !== "全部" && row.inboundType !== inboundType) return false
      if (selectedWarehouseKeys.length > 0) {
        const hit = selectedWarehouseKeys.some((key) =>
          inboundWarehouseCascadeKeyMatchesRow(key, row.warehouseName),
        )
        if (!hit) return false
      }
      const goodsNames = resolveStagingGoodsNames(row)
      if (selectedGoodsKeys.length > 0) {
        const hit = selectedGoodsKeys.some((key) =>
          goodsNames.some(
            (name) => name.includes(key) || name.startsWith(key.split("-")[0] ?? ""),
          ),
        )
        if (!hit) return false
      }
      const inboundDay = dayFromDateTime(row.inboundDate)
      if (dateApplied.inboundStart || dateApplied.inboundEnd) {
        if (!withinDayRange(inboundDay, dateApplied.inboundStart, dateApplied.inboundEnd)) {
          return false
        }
      }
      const registerDay = dayFromDateTime(row.registeredAt)
      if (dateApplied.createStart || dateApplied.createEnd) {
        if (!withinDayRange(registerDay, dateApplied.createStart, dateApplied.createEnd)) {
          return false
        }
      }

      const q = keyword.trim().toLowerCase()
      if (!q) return true
      return (
        row.regNo.toLowerCase().includes(q) ||
        row.ownerDisplay.toLowerCase().includes(q) ||
        row.goodsSummary.toLowerCase().includes(q) ||
        goodsNames.some((name) => name.toLowerCase().includes(q))
      )
    })
  }, [
    keyword,
    status,
    inboundType,
    selectedWarehouseKeys,
    selectedGoodsKeys,
    mockTick,
    dateApplied,
  ])

  const dateFilterActive =
    Boolean(dateApplied.inboundStart) ||
    Boolean(dateApplied.inboundEnd) ||
    Boolean(dateApplied.createStart) ||
    Boolean(dateApplied.createEnd)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  const resetFilters = () => {
    setKeyword("")
    setStatus("全部")
    setInboundType("全部")
    setSelectedWarehouseKeys([])
    setSelectedGoodsKeys([])
    setDateDraft({ ...EMPTY_DATE_RANGE })
    setDateApplied({ ...EMPTY_DATE_RANGE })
  }

  const openDateFilter = () => {
    setDateDraft({ ...dateApplied })
    setDateFilterOpen(true)
  }

  const handleConvert = (row: InboundStagingReg) => {
    setConvertTarget(row)
  }

  const confirmConvert = () => {
    if (!convertTarget) return
    const regNo = convertTarget.regNo
    setConvertTarget(null)
    navigate(`${H5_INBOUND_INITIATE_ROUTE}?sourceRegId=${encodeURIComponent(regNo)}`)
    showToast(`前往入库发起预填 ${regNo}`)
  }

  const handleVoid = (row: InboundStagingReg) => {
    setVoidTarget(row)
  }

  const handleEdit = (row: InboundStagingReg) => {
    navigate(inboundStagingEditQuery(row.id))
  }

  const handleViewFormal = (row: InboundStagingReg) => {
    navigateToFormalInbound(
      row.relatedFormalNo,
      navigate,
      showToast,
      INBOUND_STAGING_LIST_ROUTE,
    )
  }

  return (
    <MobileShell>
      <div className={`relative ${H5_PAGE_BODY} bg-[#edf2f8]`}>
        <PrototypeAnnotationTarget annotationIds={["inbound-staging-h5-list"]}>
          <NavBar title="入库暂存登记" backTo={WORKSPACE_ROUTE} />
        </PrototypeAnnotationTarget>

        <div className={H5_FILTER_BAR}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openDateFilter}
              className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#232D39]/50 active:bg-[#232D39]/5"
              aria-label="更多筛选"
            >
              <Filter className="size-4" />
              {dateFilterActive ? (
                <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  1
                </span>
              ) : null}
            </button>
            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                placeholder="请输入登记单号 / 货主 / 货品"
                className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword ? (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-2.5 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 text-gray-600"
                >
                  <X className="size-2" />
                </button>
              ) : (
                <Search className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            <WarehouseStoreroomCascadePill
              tree={INBOUND_WAREHOUSE_STOREROOM_TREE}
              selectedFullKeys={selectedWarehouseKeys}
              onChange={setSelectedWarehouseKeys}
            />
            <GoodsSpecCascadePill
              tree={INBOUND_GOODS_CASCADE_TREE}
              selectedFullKeys={selectedGoodsKeys}
              onChange={setSelectedGoodsKeys}
            />
            <DropdownFilterPill
              label="入库类型"
              value={inboundType}
              options={TYPE_OPTIONS}
              onChange={setInboundType}
            />
            <DropdownFilterPill
              label="单据状态"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(v) => setStatus(v as StagingRegStatus | "全部")}
            />
          </div>
        </div>

        <PrototypeAnnotationTarget flexGrow annotationIds={["inbound-staging-h5-list-actions"]}>
        <div className={`${H5_LIST_SCROLL} pb-24`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                <Search className="size-7" />
              </div>
              <p className="text-xs font-medium text-[#232D39]/60">未找到符合条件的暂存登记单</p>
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
            filtered.map((row) => (
              <InboundStagingRegCard
                key={row.id}
                row={row}
                onEdit={handleEdit}
                onConvert={
                  INBOUND_STAGING_CONVERT_ENABLED ? handleConvert : undefined
                }
                onVoid={handleVoid}
                onViewFormal={handleViewFormal}
              />
            ))
          )}
        </div>
        </PrototypeAnnotationTarget>

        <button
          type="button"
          className="fixed bottom-20 right-4 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg active:bg-blue-700"
          aria-label="新增暂存登记"
          onClick={() => navigate(INBOUND_STAGING_FORM_ROUTE)}
        >
          <Plus className="size-7" />
        </button>

        <InboundDateFilterModal
          open={dateFilterOpen}
          value={dateDraft}
          onChange={setDateDraft}
          onClose={() => setDateFilterOpen(false)}
          onReset={() => setDateDraft({ ...EMPTY_DATE_RANGE })}
          onConfirm={() => {
            setDateApplied({ ...dateDraft })
            setDateFilterOpen(false)
          }}
          secondaryRangeLabel="登记时间"
        />

        <ConvertToFormalSheet
          open={Boolean(convertTarget)}
          reg={convertTarget}
          onClose={() => setConvertTarget(null)}
          onConfirm={confirmConvert}
        />

        <StagingVoidSheet
          open={Boolean(voidTarget)}
          regNo={voidTarget?.regNo ?? ""}
          onClose={() => setVoidTarget(null)}
          onConfirm={(reason) => {
            if (voidTarget) voidStagingReg(voidTarget.regNo, reason)
            setVoidTarget(null)
            showToast("登记单已作废")
            setMockTick((t) => t + 1)
          }}
        />

        {toast ? (
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}
