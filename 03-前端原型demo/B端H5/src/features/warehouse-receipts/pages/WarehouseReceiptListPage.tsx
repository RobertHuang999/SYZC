import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Filter, RotateCcw, Search, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { DrawerField, FilterDrawer } from "@/components/ui/FilterDrawer"
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
  receiptFlowConflictMessage,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { ReceiptCard } from "../components/ReceiptCard"
import { ReceiptRecordSheet } from "../components/ReceiptRecordSheet"
import {
  WORKSPACE_ROUTE,
  receiptH5DetailPath,
  receiptH5OpsPath,
} from "../domain/constants"
import { getAllMobileReceipts } from "../mock/warehouse-receipts.mock"
import { H5_FILTER_BAR, H5_LIST_SCROLL, H5_SEARCH_INPUT } from "@/shared/h5-ui-theme"

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
  { label: "是（中仓登准入）", value: "是" },
  { label: "否", value: "否" },
]

const STATUS_OPTIONS: DropdownOption[] = [
  { label: "全部状态", value: "全部" },
  { label: "审批中", value: "PENDING" },
  { label: "正常", value: "NORMAL" },
  { label: "冻结", value: "FROZEN" },
  { label: "注销", value: "CANCELLED" },
]

export function WarehouseReceiptListPage() {
  const navigate = useNavigate()
  const [receipts] = useState<WarehouseReceipt[]>(() => getAllMobileReceipts())

  const [keyword, setKeyword] = useState("")
  const [warehouse, setWarehouse] = useState("全部")
  const [goodsCategory, setGoodsCategory] = useState("全部")
  const [thirdParty, setThirdParty] = useState("全部")
  const [status, setStatus] = useState("全部")
  const [establishedStart, setEstablishedStart] = useState("")
  const [establishedEnd, setEstablishedEnd] = useState("")
  const [createdStart, setCreatedStart] = useState("")
  const [createdEnd, setCreatedEnd] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  // 变更记录抽屉目标
  const [recordReceipt, setRecordReceipt] = useState<WarehouseReceipt | null>(null)

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
      statuses: status === "全部" ? [] : [status as ReceiptStatus],
      establishedStart,
      establishedEnd,
      createdStart,
      createdEnd,
    }),
    [keyword, warehouse, goodsCategory, thirdParty, status, establishedStart, establishedEnd, createdStart, createdEnd],
  )

  const filtered = useMemo(() => {
    const list = receipts.filter((receipt) => matchReceiptFilters(receipt, filters))
    return sortReceiptsByEstablishedDesc(list)
  }, [receipts, filters])

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText?.(code)
    showToast(`仓单编号已复制: ${code}`)
  }

  const handleDownload = (receipt: WarehouseReceipt) => {
    showToast(`已生成仓单【${receipt.code}】电子存单 PDF，正在下载...`)
  }

  const handleDownloadRecord = (relatedNo: string) => {
    showToast(`已下载凭证文件: ${relatedNo}.pdf`)
  }

  const handleOpClick = (receipt: WarehouseReceipt, op: ReceiptRowAction) => {
    if (op === "detail") {
      navigate(receiptH5DetailPath(receipt.id))
      return
    }

    if (op === "download") {
      handleDownload(receipt)
      return
    }

    // 检查持有人不一致限制
    const isHolderDifferent =
      receipt.holder.name !== receipt.owner.name ||
      receipt.holder.identifier !== receipt.owner.identifier

    if (
      isHolderDifferent &&
      (op === "replenish" || op === "relocate" || op === "inbound")
    ) {
      setNotice({
        title: "操作受限",
        description:
          "当前仓单持有人与原始存货人不一致。依据存货监管合规风控规则，仅允许原始存货人办理补货、移库或入库业务。",
      })
      return
    }

    // 检查是否审批中或流程冲突 (R04)
    if (receipt.currentFlow) {
      setNotice({
        title: "流程在途拦截",
        description: receiptFlowConflictMessage(receipt.currentFlow),
      })
      return
    }

    if (receipt.status !== "NORMAL") {
      showToast(`当前仓单状态非正常，无法办理动碰业务`)
      return
    }

    // 正常跳转动碰业务路由
    navigate(receiptH5OpsPath(receipt.id, op))
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        {/* 小程序顶栏：标题居中，右侧保留胶囊，无开立/新增按钮 */}
        <PrototypeAnnotationTarget annotationIds={["receipt-list-page"]}>
          <NavBar title="仓单管理" backTo={WORKSPACE_ROUTE} />
        </PrototypeAnnotationTarget>

        {/* 顶部搜索栏与 4 个胶囊筛选栏（对齐确认项 5：移除多余抽屉筛选按钮） */}
        <div className={`shrink-0 ${H5_FILTER_BAR} space-y-2.5`}>
          {/* 搜索框 + 更多筛选 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex size-7 shrink-0 items-center justify-center rounded-md text-[#232D39]/50 active:bg-[#232D39]/5"
              aria-label="更多筛选"
            >
              <Filter className="size-4" />
              {establishedStart || establishedEnd || createdStart || createdEnd ? (
                <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  1
                </span>
              ) : null}
            </button>
            <div className="relative min-w-0 flex-1">
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="请输入持有人名称 / 货品信息"
                className={H5_SEARCH_INPUT}
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
                <Search className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#232D39]/40" />
              )}
            </div>
          </div>

          {/* 横向 4 个快捷筛选胶囊 */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <DropdownFilterPill
              label="所属仓库"
              options={WAREHOUSE_OPTIONS}
              value={warehouse}
              onChange={setWarehouse}
            />
            <DropdownFilterPill
              label="货物类别"
              options={GOODS_OPTIONS}
              value={goodsCategory}
              onChange={setGoodsCategory}
            />
            <DropdownFilterPill
              label="三方登记"
              options={THIRD_PARTY_OPTIONS}
              value={thirdParty}
              onChange={setThirdParty}
            />
            <DropdownFilterPill
              label="仓单状态"
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
            />
          </div>
        </div>

        {/* 仓单卡片列表 */}
        <div className={`min-h-0 flex-1 overflow-y-auto px-4 py-3 ${H5_LIST_SCROLL}`}>
          <PrototypeAnnotationTarget annotationIds={["receipt-list-items"]}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                  <Search className="size-7" />
                </div>
                <p className="text-xs font-medium text-[#232D39]/60">
                  未找到符合条件的仓单，可调整筛选条件后重试
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setKeyword("")
                    setWarehouse("全部")
                    setGoodsCategory("全部")
                    setThirdParty("全部")
                    setStatus("全部")
                    setEstablishedStart("")
                    setEstablishedEnd("")
                    setCreatedStart("")
                    setCreatedEnd("")
                  }}
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
                  onDownload={handleDownload}
                  onOpenRecord={(r) => setRecordReceipt(r)}
                  onOpClick={handleOpClick}
                />
              ))
            )}
          </PrototypeAnnotationTarget>
        </div>

        {/* 更多筛选：开立时间与制单时间 */}
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={() => {
            setEstablishedStart("")
            setEstablishedEnd("")
            setCreatedStart("")
            setCreatedEnd("")
          }}
          onConfirm={() => setDrawerOpen(false)}
        >
          <DrawerField label="开立时间">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={establishedStart}
                onChange={(event) => setEstablishedStart(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="开立开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={establishedEnd}
                onChange={(event) => setEstablishedEnd(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="开立结束日期"
              />
            </div>
          </DrawerField>
          <DrawerField label="制单时间">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={createdStart}
                onChange={(event) => setCreatedStart(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="制单开始日期"
              />
              <span className="shrink-0 text-xs text-[#232D39]/50">至</span>
              <input
                type="date"
                value={createdEnd}
                onChange={(event) => setCreatedEnd(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-[#232D39]"
                aria-label="制单结束日期"
              />
            </div>
          </DrawerField>
        </FilterDrawer>

        {/* 变更记录抽屉弹窗 */}
        <ReceiptRecordSheet
          receipt={recordReceipt}
          open={Boolean(recordReceipt)}
          onClose={() => setRecordReceipt(null)}
          onDownloadRecord={handleDownloadRecord}
        />

        {/* 阻断拦截提示弹窗 */}
        {notice ? (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/45 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl animate-scale-up">
              <h3 className="text-center text-base font-bold text-[#232D39]">
                {notice.title}
              </h3>
              <p className="mt-3 text-center text-xs leading-relaxed text-[#232D39]/75">
                {notice.description}
              </p>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white active:bg-blue-700 shadow-xs"
              >
                我知道了
              </button>
            </div>
          </div>
        ) : null}

        {/* 轻提示 Toast */}
        {toast ? (
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}
