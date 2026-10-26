import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Filter, Plus, RotateCcw, Search, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { ActionSheet, type ActionSheetItem } from "@/components/ui/ActionSheet"
import {
  DrawerField,
  FilterDrawer,
} from "@/components/ui/FilterDrawer"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  EMPTY_RECEIPT_FILTERS,
  matchReceiptFilters,
  sortReceiptsByEstablishedDesc,
  type ReceiptFilters,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-filters"
import type {
  ReceiptRowAction,
  ReceiptStatus,
  WarehouseReceipt,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  RECEIPT_ACTION_LABEL,
  receiptActionsForStatus,
  receiptFlowConflictMessage,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { ReceiptCard } from "../components/ReceiptCard"
import {
  RECEIPT_H5_INITIATE_ROUTE,
  WORKSPACE_ROUTE,
  receiptH5DetailPath,
  receiptH5OpsPath,
} from "../domain/constants"
import { getAllMobileReceipts } from "../mock/warehouse-receipts.mock"
import { H5_FILTER_BAR, H5_LIST_SCROLL } from "@/shared/h5-ui-theme"

const WAREHOUSE_OPTIONS: DropdownOption[] = [
  { label: "全部仓库", value: "全部" },
  { label: "生鲜仓库", value: "生鲜仓库" },
  { label: "海霸王仓库", value: "海霸王仓库" },
  { label: "华东1号智能立体仓", value: "华东1号智能立体仓" },
  { label: "西南大宗物资仓", value: "西南大宗物资仓" },
]

const GOODS_OPTIONS: DropdownOption[] = [
  { label: "全部货物", value: "全部" },
  { label: "水果", value: "水果" },
  { label: "蔬菜", value: "蔬菜" },
  { label: "冻货", value: "冻货" },
  { label: "金属", value: "金属" },
  { label: "钢材", value: "钢材" },
  { label: "铝锭", value: "铝锭" },
  { label: "橡胶", value: "橡胶" },
]

const THIRD_PARTY_OPTIONS: DropdownOption[] = [
  { label: "三方登记", value: "全部" },
  { label: "是", value: "是" },
  { label: "否", value: "否" },
]

const STATUS_OPTIONS: DropdownOption[] = [
  { label: "全部状态", value: "全部" },
  { label: "审批中", value: "PENDING" },
  { label: "正常", value: "NORMAL" },
  { label: "冻结", value: "FROZEN" },
  { label: "注销", value: "CANCELLED" },
]

const STATUS_MULTI: Array<{ value: ReceiptStatus; label: string }> = [
  { value: "PENDING", label: "审批中" },
  { value: "NORMAL", label: "正常" },
  { value: "FROZEN", label: "冻结" },
  { value: "CANCELLED", label: "注销" },
]

const OPS_ROUTE_MAP: Partial<
  Record<ReceiptRowAction, "outbound" | "relocate" | "replenish" | "remove" | "cancel" | "inbound">
> = {
  outbound: "outbound",
  relocate: "relocate",
  replenish: "replenish",
  remove: "remove",
  cancel: "cancel",
  inbound: "inbound",
}

type DateDraft = {
  establishedStart: string
  establishedEnd: string
  createdStart: string
  createdEnd: string
}

const EMPTY_DATE_DRAFT: DateDraft = {
  establishedStart: "",
  establishedEnd: "",
  createdStart: "",
  createdEnd: "",
}

export function WarehouseReceiptListPage() {
  const navigate = useNavigate()
  const [receipts] = useState<WarehouseReceipt[]>(() => getAllMobileReceipts())

  const [keyword, setKeyword] = useState("")
  const [warehouse, setWarehouse] = useState("全部")
  const [goodsCategory, setGoodsCategory] = useState("全部")
  const [thirdParty, setThirdParty] = useState("全部")
  const [status, setStatus] = useState("全部")
  const [statusMulti, setStatusMulti] = useState<ReceiptStatus[]>([])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dateDraft, setDateDraft] = useState<DateDraft>(EMPTY_DATE_DRAFT)
  const [dateApplied, setDateApplied] = useState<DateDraft>(EMPTY_DATE_DRAFT)

  const [moreTarget, setMoreTarget] = useState<WarehouseReceipt | null>(null)
  const [notice, setNotice] = useState<{ title: string; description: string } | null>(
    null,
  )
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const filters: ReceiptFilters = useMemo(
    () => ({
      ...EMPTY_RECEIPT_FILTERS,
      keyword,
      warehouse,
      goodsCategory,
      thirdParty: thirdParty as ReceiptFilters["thirdParty"],
      statuses: statusMulti.length
        ? statusMulti
        : status === "全部"
          ? []
          : [status as ReceiptStatus],
      ...dateApplied,
    }),
    [keyword, warehouse, goodsCategory, thirdParty, status, statusMulti, dateApplied],
  )

  const filtered = useMemo(() => {
    const matched = receipts.filter((receipt) => matchReceiptFilters(receipt, filters))
    return sortReceiptsByEstablishedDesc(matched)
  }, [receipts, filters])

  const dateActive =
    Boolean(dateApplied.establishedStart) ||
    Boolean(dateApplied.establishedEnd) ||
    Boolean(dateApplied.createdStart) ||
    Boolean(dateApplied.createdEnd)

  const resetFilters = () => {
    setKeyword("")
    setWarehouse("全部")
    setGoodsCategory("全部")
    setThirdParty("全部")
    setStatus("全部")
    setStatusMulti([])
    setDateDraft(EMPTY_DATE_DRAFT)
    setDateApplied(EMPTY_DATE_DRAFT)
  }

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      showToast("仓单编号已复制")
    } catch {
      showToast(`复制失败：${code}`)
    }
  }

  const runAction = (receipt: WarehouseReceipt, action: ReceiptRowAction) => {
    if (action === "detail") {
      navigate(receiptH5DetailPath(receipt.id))
      return
    }
    if (action === "download") {
      showToast(`电子仓单正本 ${receipt.code}.pdf 生成中`)
      return
    }

    if (
      receipt.currentFlow &&
      ["replenish", "outbound", "relocate", "cancel"].includes(action)
    ) {
      setNotice({
        title: "暂无法发起新的流程",
        description: receiptFlowConflictMessage(receipt.currentFlow),
      })
      return
    }

    const op = OPS_ROUTE_MAP[action]
    if (op) navigate(receiptH5OpsPath(receipt.id, op))
  }

  const moreItems: ActionSheetItem[] = moreTarget
    ? receiptActionsForStatus(moreTarget.status)
        .filter((action) => action !== "detail")
        .map((action) => ({
          key: action,
          label: RECEIPT_ACTION_LABEL[action],
          danger: action === "cancel",
          primary: action === "download",
          onClick: () => runAction(moreTarget, action),
        }))
    : []

  return (
    <MobileShell>
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget annotationIds={["receipt-h5-list-page"]}>
          <NavBar
            title="仓单管理"
            backTo={WORKSPACE_ROUTE}
            right={
              <PrototypeAnnotationTarget annotationIds={["receipt-h5-list-issue"]}>
                <button
                  type="button"
                  onClick={() => navigate(RECEIPT_H5_INITIATE_ROUTE)}
                  className="inline-flex items-center gap-0.5 rounded-full bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white active:bg-blue-700"
                >
                  <Plus className="size-3.5" />
                  开立
                </button>
              </PrototypeAnnotationTarget>
            }
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["receipt-h5-list-filter"]}>
          <div className={H5_FILTER_BAR}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDateDraft(dateApplied)
                  setDrawerOpen(true)
                }}
                className="relative flex size-7 shrink-0 items-center justify-center rounded-md text-[#232D39]/50 active:bg-[#232D39]/5"
                aria-label="更多筛选"
              >
                <Filter className="size-4" />
                {dateActive || statusMulti.length > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                    {(dateActive ? 1 : 0) + statusMulti.length}
                  </span>
                ) : null}
              </button>
              <div className="relative min-w-0 flex-1">
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="输入仓单编号 / 持有人 / 货品"
                  className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
                {keyword ? (
                  <button
                    type="button"
                    onClick={() => setKeyword("")}
                    className="absolute right-2.5 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 text-gray-600"
                    aria-label="清空"
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
                label="仓库"
                value={warehouse}
                options={WAREHOUSE_OPTIONS}
                onChange={setWarehouse}
              />
              <DropdownFilterPill
                label="货物"
                value={goodsCategory}
                options={GOODS_OPTIONS}
                onChange={setGoodsCategory}
              />
              <DropdownFilterPill
                label="三方登记"
                value={thirdParty}
                options={THIRD_PARTY_OPTIONS}
                onChange={setThirdParty}
              />
              <DropdownFilterPill
                label="状态"
                value={status}
                options={STATUS_OPTIONS}
                onChange={(next) => {
                  setStatus(next)
                  setStatusMulti([])
                }}
              />
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <div className="flex shrink-0 items-center justify-between border-b border-[#232D39]/5 bg-white px-3.5 py-2 text-[11px] text-[#232D39]/45">
          <span>共 {filtered.length} 张仓单</span>
          <span>按开立时间倒序</span>
        </div>

        <PrototypeAnnotationTarget
          annotationIds={["receipt-h5-list-cards", "receipt-h5-list-actions"]}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className={`${H5_LIST_SCROLL} pb-8`}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                  <Search className="size-7" />
                </div>
                <p className="text-xs font-medium text-[#232D39]/60">
                  未找到符合条件的仓单
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
              filtered.map((receipt) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  onCopy={copyCode}
                  onMore={setMoreTarget}
                />
              ))
            )}
          </div>
        </PrototypeAnnotationTarget>

        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={() => {
            setDateDraft(EMPTY_DATE_DRAFT)
            setStatusMulti([])
          }}
          onConfirm={() => {
            if (
              dateDraft.establishedStart &&
              dateDraft.establishedEnd &&
              dateDraft.establishedStart > dateDraft.establishedEnd
            ) {
              showToast("开立时间的开始日期不得晚于结束日期")
              return
            }
            if (
              dateDraft.createdStart &&
              dateDraft.createdEnd &&
              dateDraft.createdStart > dateDraft.createdEnd
            ) {
              showToast("制单时间的开始日期不得晚于结束日期")
              return
            }
            setDateApplied(dateDraft)
            setStatus("全部")
            setDrawerOpen(false)
          }}
        >
          <DrawerField label="开立时间">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateDraft.establishedStart}
                onChange={(event) =>
                  setDateDraft((prev) => ({
                    ...prev,
                    establishedStart: event.target.value,
                  }))
                }
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs"
              />
              <span className="text-xs text-gray-400">至</span>
              <input
                type="date"
                value={dateDraft.establishedEnd}
                onChange={(event) =>
                  setDateDraft((prev) => ({
                    ...prev,
                    establishedEnd: event.target.value,
                  }))
                }
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs"
              />
            </div>
          </DrawerField>

          <DrawerField label="制单时间">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateDraft.createdStart}
                onChange={(event) =>
                  setDateDraft((prev) => ({
                    ...prev,
                    createdStart: event.target.value,
                  }))
                }
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs"
              />
              <span className="text-xs text-gray-400">至</span>
              <input
                type="date"
                value={dateDraft.createdEnd}
                onChange={(event) =>
                  setDateDraft((prev) => ({
                    ...prev,
                    createdEnd: event.target.value,
                  }))
                }
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs"
              />
            </div>
          </DrawerField>

          <DrawerField label="仓单状态（可多选）">
            <div className="grid grid-cols-2 gap-2">
              {STATUS_MULTI.map((option) => {
                const active = statusMulti.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setStatusMulti((prev) =>
                        active
                          ? prev.filter((item) => item !== option.value)
                          : [...prev, option.value],
                      )
                    }
                    className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                      active
                        ? "border-blue-300 bg-blue-50 text-blue-600"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </DrawerField>
        </FilterDrawer>

        <ActionSheet
          open={Boolean(moreTarget)}
          title="仓单操作"
          description={moreTarget ? `${moreTarget.code} · ${moreTarget.warehouseName}` : undefined}
          items={moreItems}
          onClose={() => setMoreTarget(null)}
        />

        {notice ? (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/45 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-4">
              <h3 className="text-center text-sm font-bold text-[#232D39]">
                {notice.title}
              </h3>
              <p className="mt-2 text-center text-xs leading-relaxed text-[#232D39]/65">
                {notice.description}
              </p>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white active:bg-blue-700"
              >
                我知道了
              </button>
            </div>
          </div>
        ) : null}

        {toast ? (
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}
