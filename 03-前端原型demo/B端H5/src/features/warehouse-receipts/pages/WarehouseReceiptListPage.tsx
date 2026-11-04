import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
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
    }),
    [keyword, warehouse, goodsCategory, thirdParty, status],
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

    // 检查是否审批中或流程冲突 (R-DWR-04)
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
      <div className="flex min-h-0 flex-1 flex-col bg-[#F2F3F7]">
        {/* 小程序顶栏：标题居中，右侧保留胶囊，无开立/新增按钮 */}
        <PrototypeAnnotationTarget annotationIds={["receipt-list-page"]}>
          <NavBar title="仓单管理" backTo={WORKSPACE_ROUTE} />
        </PrototypeAnnotationTarget>

        {/* 顶部搜索栏与 4 个胶囊筛选栏（对齐确认项 5：移除多余抽屉筛选按钮） */}
        <div className={`shrink-0 ${H5_FILTER_BAR} space-y-2.5`}>
          {/* 搜索框 */}
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs text-[#232D39]">
            <Search className="size-4 shrink-0 text-[#232D39]/40" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="请输入持有人名称 / 货品信息"
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#232D39]/35"
            />
            {keyword ? (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="shrink-0 text-[#232D39]/40 hover:text-[#232D39]"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          {/* 横向 4 个快捷筛选胶囊 */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <DropdownFilterPill
              label={warehouse === "全部" ? "仓库" : warehouse}
              options={WAREHOUSE_OPTIONS}
              value={warehouse}
              onChange={setWarehouse}
            />
            <DropdownFilterPill
              label={goodsCategory === "全部" ? "货物" : goodsCategory}
              options={GOODS_OPTIONS}
              value={goodsCategory}
              onChange={setGoodsCategory}
            />
            <DropdownFilterPill
              label={thirdParty === "全部" ? "三方登记" : `三方: ${thirdParty}`}
              options={THIRD_PARTY_OPTIONS}
              value={thirdParty}
              onChange={setThirdParty}
            />
            <DropdownFilterPill
              label={
                status === "全部"
                  ? "状态"
                  : STATUS_OPTIONS.find((option) => option.value === status)?.label ||
                    status
              }
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
                <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <Search className="size-8" />
                </div>
                <p className="text-sm font-medium text-[#232D39]/70">
                  没有找到符合条件的仓单
                </p>
                <p className="mt-1 text-xs text-[#232D39]/40">
                  可尝试调整搜索关键字或筛选条件
                </p>
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
          <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/85 px-4 py-2 text-xs font-medium text-white shadow-lg animate-fade-in">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}
