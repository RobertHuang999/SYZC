import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  History,
  Info,
  ArrowDownToLine,
  PackagePlus,
  ArrowLeftRight,
  ArrowUpFromLine,
  Trash2,
  Ban,
  Package,
} from "lucide-react"
import { Link } from "react-router-dom"
import type {
  ReceiptRowAction,
  ReceiptStatus,
  WarehouseReceipt,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  formatReceiptGoodsLine,
  formatReceiptQuantity,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { receiptH5DetailPath } from "../domain/constants"
import { H5_CARD } from "@/shared/h5-ui-theme"
import { ReceiptStatusPill } from "./ReceiptStatusPill"
import { cn } from "@/lib/utils"

/** 源码左侧状态圆形印章徽标映射 */
const STATUS_STAMP_MAP: Record<
  ReceiptStatus,
  { char: string; bg: string; border: string }
> = {
  NORMAL: {
    char: "正",
    bg: "bg-emerald-500 text-white",
    border: "border-emerald-600/20",
  },
  PENDING: {
    char: "审",
    bg: "bg-amber-500 text-white",
    border: "border-amber-600/20",
  },
  FROZEN: {
    char: "冻",
    bg: "bg-sky-600 text-white",
    border: "border-sky-700/20",
  },
  CANCELLED: {
    char: "注",
    bg: "bg-slate-400 text-white",
    border: "border-slate-500/20",
  },
}

/** 方案 B：老源码 6 大更多操作配置 */
type MoreOpItem = {
  key: ReceiptRowAction
  label: string
  icon: typeof ArrowDownToLine
  flowType: number
  /** 是否属于持有人不一致时禁止的操作（入库26、补货15、移库17） */
  restrictedWhenHolderDiff: boolean
}

const MORE_OPS_LIST: MoreOpItem[] = [
  {
    key: "inbound",
    label: "仓单入库",
    icon: ArrowDownToLine,
    flowType: 26,
    restrictedWhenHolderDiff: true,
  },
  {
    key: "replenish",
    label: "仓单补货",
    icon: PackagePlus,
    flowType: 15,
    restrictedWhenHolderDiff: true,
  },
  {
    key: "relocate",
    label: "仓单移库",
    icon: ArrowLeftRight,
    flowType: 17,
    restrictedWhenHolderDiff: true,
  },
  {
    key: "outbound",
    label: "仓单出库",
    icon: ArrowUpFromLine,
    flowType: 14,
    restrictedWhenHolderDiff: false,
  },
  {
    key: "remove",
    label: "仓单移除",
    icon: Trash2,
    flowType: 16,
    restrictedWhenHolderDiff: false,
  },
  {
    key: "cancel",
    label: "仓单注销",
    icon: Ban,
    flowType: 18,
    restrictedWhenHolderDiff: false,
  },
]

export function ReceiptCard({
  receipt,
  onCopy,
  onDownload,
  onOpenRecord,
  onOpClick,
}: {
  receipt: WarehouseReceipt
  onCopy: (code: string) => void
  onDownload: (receipt: WarehouseReceipt) => void
  onOpenRecord: (receipt: WarehouseReceipt) => void
  onOpClick: (receipt: WarehouseReceipt, op: ReceiptRowAction) => void
}) {
  const [showMore, setShowMore] = useState(false)
  const [expandedGoods, setExpandedGoods] = useState(false)

  const groups = receipt.goodsGroups ?? []
  const stamp = STATUS_STAMP_MAP[receipt.status] || STATUS_STAMP_MAP.NORMAL

  // 判断持有人与存货人是否不一致
  const isHolderDifferent =
    receipt.holder.name !== receipt.owner.name ||
    receipt.holder.identifier !== receipt.owner.identifier

  // 审批中收窄下载操作
  const canDownload = receipt.status !== "PENDING"

  // 货物列表前 2 行与超限折叠
  const visibleGoods = expandedGoods ? groups : groups.slice(0, 2)
  const hasMoreGoods = groups.length > 2

  return (
    <div className={`${H5_CARD} mb-3 overflow-hidden transition-all duration-200`}>
      <div className="p-3.5 space-y-3">
        {/* 顶部单号行与制单时间 */}
        <div className="flex items-center justify-between gap-2 border-b border-[#232D39]/6 pb-2.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <Link
              to={receiptH5DetailPath(receipt.id)}
              className="min-w-0 break-all text-xs font-semibold text-blue-600 hover:underline"
            >
              {receipt.code}
            </Link>
            <button
              type="button"
              aria-label="复制仓单编号"
              onClick={() => onCopy(receipt.code)}
              className="shrink-0 rounded p-1 text-[#232D39]/40 active:bg-[#232D39]/5"
            >
              <Copy className="size-3.5" />
            </button>
          </div>
          <span className="shrink-0 text-[11px] text-[#232D39]/45">
            {receipt.createdAt}
          </span>
        </div>

        {/* 货主信息与状态行 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2.5">
            {/* 源码圆标“正/审/冻/注” */}
            <span
              className={cn(
                "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-xs",
                stamp.bg,
              )}
            >
              {stamp.char}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#232D39]">
                {receipt.owner.name}
              </p>
              <p className="mt-0.5 text-xs text-[#232D39]/50">
                {receipt.owner.identifier}
              </p>
            </div>
          </div>

          <ReceiptStatusPill status={receipt.status} />
        </div>

        {/* 持有人行（仅当持有人与存货人不一致时展示） */}
        {isHolderDifferent ? (
          <div className="flex items-baseline gap-2 rounded-lg bg-amber-50/70 border border-amber-200/50 px-2.5 py-1.5 text-xs">
            <span className="shrink-0 font-medium text-amber-800">持有人:</span>
            <span className="truncate font-medium text-amber-900">
              {receipt.holder.name}
            </span>
            <span className="shrink-0 text-[11px] text-amber-700/80">
              ({receipt.holder.identifier})
            </span>
          </div>
        ) : null}

        {/* 货物明细区域 */}
        <div className="rounded-lg bg-[#232D39]/3 p-2.5 text-xs space-y-1.5">
          <div className="space-y-1">
            {visibleGoods.map((good, index) => (
              <div
                key={good.id || index}
                className="flex items-baseline justify-between gap-2 text-[#232D39]/85"
              >
                <span className="truncate">
                  {good.name}
                  {good.specification ? ` (${good.specification})` : ""}
                </span>
                <span className="shrink-0 font-medium text-[#232D39]">
                  {formatReceiptQuantity(good.quantity)} {good.unit}
                </span>
              </div>
            ))}
          </div>

          {hasMoreGoods ? (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setExpandedGoods((prev) => !prev)}
                className="inline-flex items-center gap-0.5 text-[11px] font-medium text-blue-600 active:underline"
              >
                {expandedGoods ? (
                  <>
                    收起货品 <ChevronUp className="size-3" />
                  </>
                ) : (
                  <>
                    展开全部 ({groups.length} 种) <ChevronDown className="size-3" />
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>

        {/* 储存位置与三方认证 */}
        <div className="flex items-center justify-between text-xs text-[#232D39]/65">
          <span className="truncate">
            <span className="text-[#232D39]/45">储存位置：</span>
            {receipt.warehouseName}
          </span>
          {receipt.thirdPartyRegistered ? (
            <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
              中仓登准入
            </span>
          ) : null}
        </div>

        {/* 底栏按钮栏（源码布局） */}
        <div className="flex items-center justify-end gap-2 border-t border-[#232D39]/6 pt-2.5">
          {/* 下载（审批中隐藏） */}
          {canDownload ? (
            <button
              type="button"
              onClick={() => onDownload(receipt)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#232D39] active:bg-gray-50 shadow-2xs"
            >
              下载
            </button>
          ) : null}

          {/* 变更记录 */}
          <button
            type="button"
            onClick={() => onOpenRecord(receipt)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#232D39] active:bg-gray-50 shadow-2xs"
          >
            变更记录
          </button>

          {/* 详情 */}
          <Link
            to={receiptH5DetailPath(receipt.id)}
            className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-600 active:bg-blue-100 shadow-2xs"
          >
            详情
          </Link>

          {/* 更多操作（仅在正常状态下提供动碰业务） */}
          {receipt.status === "NORMAL" ? (
            <button
              type="button"
              onClick={() => setShowMore((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors shadow-2xs",
                showMore
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 bg-white text-[#232D39] active:bg-gray-50",
              )}
            >
              更多操作
              {showMore ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
          ) : null}
        </div>

        {/* 方案 B（贴齐老源码）：卡片内部向下展开 2 行 × 3 列宫格 */}
        {showMore && receipt.status === "NORMAL" ? (
          <div className="mt-2 rounded-xl border border-gray-100 bg-[#F8FAFC] p-3 animate-slide-down">
            <div className="grid grid-cols-3 gap-2">
              {MORE_OPS_LIST.map((op) => {
                const IconComponent = op.icon
                // 判断是否因持有人不一致而置灰
                const isRestricted =
                  isHolderDifferent && op.restrictedWhenHolderDiff

                return (
                  <button
                    key={op.key}
                    type="button"
                    onClick={() => onOpClick(receipt, op.key)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl p-2.5 transition-all text-center",
                      isRestricted
                        ? "bg-gray-100/80 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-white text-slate-700 shadow-xs hover:border-blue-200 active:scale-97 active:bg-blue-50/50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full mb-1.5",
                        isRestricted
                          ? "bg-gray-200 text-gray-400"
                          : "bg-blue-50 text-blue-600",
                      )}
                    >
                      <IconComponent className="size-4" />
                    </div>
                    <span className="text-xs font-medium leading-tight">
                      {op.label}
                    </span>
                    {isRestricted ? (
                      <span className="mt-0.5 text-[9px] text-amber-600 scale-90">
                        非存货人禁用
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
