import { useMemo, useState } from "react"
import { Search, Filter, X, RotateCcw } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { InboundRecordCard } from "../components/InboundRecordCard"
import { GoodsSpecCascadePill } from "../components/GoodsSpecCascadePill"
import { WarehouseStoreroomCascadePill } from "../components/WarehouseStoreroomCascadePill"
import { INBOUND_WAREHOUSE_STOREROOM_TREE } from "@prototype/shared/inbound/filter-cascade-trees"
import { inboundWarehouseCascadeKeyMatchesRow } from "@prototype/shared/inbound/list-filter-match"
import {
  InboundDateFilterModal,
  type DateRangeDraft,
} from "../components/InboundDateFilterModal"
import { INBOUND_GOODS_CASCADE_TREE } from "../mock/inbound-goods-cascade.mock"
import type { MobileInboundRecord } from "../domain/types"
import { mobileInboundRecordsMock } from "../mock/inbound-records.mock"
import { H5_FILTER_BAR, H5_LIST_SCROLL } from "@/shared/h5-ui-theme"

const EMPTY_DATE_RANGE: DateRangeDraft = {
  inboundStart: "",
  inboundEnd: "",
  createStart: "",
  createEnd: "",
}

const TYPE_OPTIONS: DropdownOption[] = [
  { label: "全部类型", value: "全部" },
  { label: "普通入库", value: "普通入库" },
  { label: "转让入库", value: "转让入库" },
  { label: "质押入库", value: "质押入库" },
  { label: "抵押入库", value: "抵押入库" },
  { label: "监管服务入库", value: "监管服务入库" },
  { label: "仓单入库", value: "仓单入库" },
  { label: "退货入库", value: "退货入库" },
  { label: "移库入库", value: "移库入库" },
  { label: "存货加工入库", value: "存货加工入库" },
  { label: "质押加工入库", value: "质押加工入库" },
  { label: "抵押加工入库", value: "抵押加工入库" },
  { label: "监管服务加工入库", value: "监管服务加工入库" },
]

const CREATOR_OPTIONS: DropdownOption[] = [
  { label: "全部制单人", value: "全部" },
  { label: "lxy(四川享宇科技有限公司)", value: "lxy(四川享宇科技有限公司)" },
  { label: "王监管(华东仓储运营中心)", value: "王监管(华东仓储运营中心)" },
  { label: "张三(森云监管服务有限公司)", value: "张三(森云监管服务有限公司)" },
]

function dayFromDateTime(isoLike: string): string {
  return isoLike.trim().split(" ")[0]?.split("T")[0] ?? ""
}

function withinDayRange(day: string, start: string, end: string): boolean {
  if (!day) return false
  if (start && day < start) return false
  if (end && day > end) return false
  return true
}

export function InboundRecordListPage() {
  const [records] = useState<MobileInboundRecord[]>(mobileInboundRecordsMock)
  const [keyword, setKeyword] = useState("")
  const [selectedWarehouseKeys, setSelectedWarehouseKeys] = useState<string[]>([])
  const [selectedGoodsKeys, setSelectedGoodsKeys] = useState<string[]>([])
  const [inboundType, setInboundType] = useState("全部")
  const [creator, setCreator] = useState("全部")
  const [onlyUnprinted, setOnlyUnprinted] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [dateDraft, setDateDraft] = useState<DateRangeDraft>({ ...EMPTY_DATE_RANGE })
  const [dateApplied, setDateApplied] = useState<DateRangeDraft>({ ...EMPTY_DATE_RANGE })

  const filtered = useMemo(() => {
    return records.filter((row) => {
      if (onlyUnprinted && !row.hasUnprintedQrCode) return false
      if (selectedWarehouseKeys.length > 0) {
        const hit = selectedWarehouseKeys.some((key) =>
          inboundWarehouseCascadeKeyMatchesRow(key, row.warehouseName)
        )
        if (!hit) return false
      }
      if (selectedGoodsKeys.length > 0) {
        const hit = selectedGoodsKeys.some(
          (key) =>
            row.goodsSummary.includes(key) ||
            key.startsWith(row.goodsSummary) ||
            row.goodsSummary.startsWith(key.split("-").slice(0, 2).join("-"))
        )
        if (!hit) return false
      }
      if (inboundType !== "全部" && row.inboundType !== inboundType) return false
      if (creator !== "全部" && !row.creatorDisplay.includes(creator)) return false

      const inboundDay = dayFromDateTime(row.inboundDate)
      const createDay = dayFromDateTime(row.createdAt)
      if (
        dateApplied.inboundStart ||
        dateApplied.inboundEnd
      ) {
        if (!withinDayRange(inboundDay, dateApplied.inboundStart, dateApplied.inboundEnd)) {
          return false
        }
      }
      if (dateApplied.createStart || dateApplied.createEnd) {
        if (!withinDayRange(createDay, dateApplied.createStart, dateApplied.createEnd)) {
          return false
        }
      }

      const q = keyword.trim().toLowerCase()
      if (!q) return true
      return (
        row.ownerName.toLowerCase().includes(q) ||
        row.ownerIdentifierMasked.toLowerCase().includes(q) ||
        row.orderNo.toLowerCase().includes(q) ||
        row.goodsSummary.toLowerCase().includes(q)
      )
    })
  }, [
    records,
    keyword,
    selectedWarehouseKeys,
    selectedGoodsKeys,
    inboundType,
    creator,
    onlyUnprinted,
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
    setSelectedWarehouseKeys([])
    setSelectedGoodsKeys([])
    setInboundType("全部")
    setCreator("全部")
    setOnlyUnprinted(false)
    setDateDraft({ ...EMPTY_DATE_RANGE })
    setDateApplied({ ...EMPTY_DATE_RANGE })
  }

  const openDateFilter = () => {
    setDateDraft({ ...dateApplied })
    setDateFilterOpen(true)
  }

  return (
    <MobileShell>
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget annotationIds={["inbound-h5-list"]}>
          <NavBar title="入库管理" />
        </PrototypeAnnotationTarget>

        <div className={H5_FILTER_BAR}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openDateFilter}
              className="relative flex size-7 shrink-0 items-center justify-center text-[#232D39]/50 active:bg-[#232D39]/5 rounded-md cursor-pointer"
              aria-label="更多筛选"
            >
              <Filter className="size-4" />
              {dateFilterActive && (
                <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  1
                </span>
              )}
            </button>
            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                placeholder="请输入货主名称/标识"
                className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword ? (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-3.5 items-center justify-center rounded-full bg-gray-300 text-gray-600"
                >
                  <X className="size-2" />
                </button>
              ) : (
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#232D39]/40 pointer-events-none" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
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
              label="制单人"
              value={creator}
              options={CREATOR_OPTIONS}
              onChange={setCreator}
            />
          </div>
        </div>

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
        />

        <div className="mt-2 flex shrink-0 items-center justify-between border-y border-[#232D39]/5 bg-white px-3.5 py-2.5">
          <span className="text-xs text-[#232D39]">仅查看未打印二维码订单</span>
          <button
            type="button"
            role="switch"
            aria-checked={onlyUnprinted}
            onClick={() => setOnlyUnprinted(!onlyUnprinted)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
              onlyUnprinted ? "bg-amber-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                onlyUnprinted ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className={`${H5_LIST_SCROLL} pb-8`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                <Search className="size-7" />
              </div>
              <p className="text-xs font-medium text-[#232D39]/60">未找到符合条件的入库记录</p>
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
            filtered.map((item) => (
              <InboundRecordCard
                key={item.id}
                item={item}
                onDownload={(kind, row) => {
                  showToast(
                    kind === "excel"
                      ? `下载记录导出中: ${row.orderNo}`
                      : `单据凭证生成中: ${row.orderNo}`
                  )
                }}
              />
            ))
          )}
        </div>

        {toast && (
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </MobileShell>
  )
}
