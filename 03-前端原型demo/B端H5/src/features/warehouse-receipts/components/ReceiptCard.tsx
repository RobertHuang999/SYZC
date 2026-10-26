import { useState } from "react"
import { ChevronRight, Copy, FileText, MoreHorizontal, Package } from "lucide-react"
import { Link } from "react-router-dom"
import type { WarehouseReceipt } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  formatReceiptGoodsLine,
  formatReceiptQuantity,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { receiptH5DetailPath } from "../domain/constants"
import { H5_CARD } from "@/shared/h5-ui-theme"
import { ReceiptSheet } from "./ReceiptSheet"
import { ReceiptStatusPill } from "./ReceiptStatusPill"
import { cn } from "@/lib/utils"

export function ReceiptCard({
  receipt,
  onCopy,
  onMore,
}: {
  receipt: WarehouseReceipt
  onCopy: (code: string) => void
  onMore: (receipt: WarehouseReceipt) => void
}) {
  const [goodsOpen, setGoodsOpen] = useState(false)
  const groups = receipt.goodsGroups

  return (
    <div className={`${H5_CARD} mb-3`}>
      <div className="space-y-2.5 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
              单
            </span>
            <Link
              to={receiptH5DetailPath(receipt.id)}
              className="min-w-0 break-all text-sm font-semibold text-[#232D39]"
            >
              {receipt.code}
            </Link>
            <button
              type="button"
              aria-label="复制仓单编号"
              onClick={() => onCopy(receipt.code)}
              className="shrink-0 rounded p-0.5 text-[#232D39]/35 active:bg-[#232D39]/5"
            >
              <Copy className="size-3.5" />
            </button>
          </div>
          <ReceiptStatusPill status={receipt.status} />
        </div>

        <div className="space-y-2 rounded-lg bg-[#232D39]/5 p-3 text-xs">
          <InfoLine label="存货人">
            <span className="truncate font-medium text-[#232D39]">
              {receipt.owner.name}
            </span>
            <span className="ml-1 shrink-0 text-[11px] text-[#232D39]/45">
              {receipt.owner.identifier}
            </span>
          </InfoLine>
          <InfoLine label="持有人">
            <span className="truncate font-medium text-[#232D39]">
              {receipt.holder.name}
            </span>
            <span className="ml-1 shrink-0 text-[11px] text-[#232D39]/45">
              {receipt.holder.identifier}
            </span>
          </InfoLine>
          <InfoLine label="仓库名称">
            <span className="truncate text-[#232D39]">{receipt.warehouseName}</span>
          </InfoLine>
          <InfoLine label="三方登记">
            <span className="text-[#232D39]">
              {receipt.thirdPartyRegistered ? "是（中仓登准入）" : "否"}
            </span>
          </InfoLine>
          <InfoLine label="货物">
            {groups.length > 2 ? (
              <button
                type="button"
                onClick={() => setGoodsOpen(true)}
                className="flex min-w-0 items-center gap-0.5 text-right text-[#232D39]"
              >
                <span className="truncate">
                  {formatReceiptGoodsLine(groups[0])} 等 {groups.length} 种
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-[#232D39]/40" />
              </button>
            ) : (
              <span className="truncate text-right text-[#232D39]">
                {groups.map((group) => group.name).join("、")}
              </span>
            )}
          </InfoLine>
          <InfoLine label="开立时间">
            <span className="text-[#232D39]">{receipt.establishedAt}</span>
          </InfoLine>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="min-w-0 text-[11px] text-[#232D39]/45">
            <p className="truncate">制单人: {receipt.creatorDisplay}</p>
            <p className="truncate">制单时间: {receipt.createdAt}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to={receiptH5DetailPath(receipt.id)}
              className="inline-flex items-center gap-0.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 active:bg-blue-100"
            >
              详情
            </Link>
            <button
              type="button"
              onClick={() => onMore(receipt)}
              aria-label="更多操作"
              className="inline-flex items-center gap-0.5 rounded-full border border-[#232D39]/20 px-2.5 py-1.5 text-xs font-medium text-[#232D39]/80 active:bg-gray-50"
            >
              <MoreHorizontal className="size-4" />
              更多
            </button>
          </div>
        </div>
      </div>

      <ReceiptSheet
        open={goodsOpen}
        title="仓单货品清单"
        description={`${receipt.code} · 共 ${groups.length} 种货品 / ${groups.reduce(
          (sum, group) => sum + group.lots.length,
          0,
        )} 个批次`}
        onClose={() => setGoodsOpen(false)}
      >
        <div className="space-y-2">
          {groups.map((group, index) => (
            <div
              key={group.id}
              className={cn(
                "flex items-start justify-between gap-3 rounded-xl border border-[#232D39]/8 px-3 py-2.5",
                index === 0 && "bg-[#232D39]/3",
              )}
            >
              <div className="flex min-w-0 items-start gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-[#232D39]/8 text-[11px] text-[#232D39]/60">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#232D39]">{group.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#232D39]/45">
                    <Package className="size-3" />
                    {group.lots.length} 个批次 ·{" "}
                    {group.lots
                      .map((lot) => `${lot.zoneName}-${lot.position || "--"}`)
                      .join("、")}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-medium text-[#232D39]">
                {formatReceiptQuantity(group.quantity)} {group.unit}
              </span>
            </div>
          ))}
        </div>
        <Link
          to={receiptH5DetailPath(receipt.id)}
          className="mt-3 flex items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-xs font-medium text-blue-600"
        >
          <FileText className="size-3.5" />
          查看仓单详情与批次明细
        </Link>
      </ReceiptSheet>
    </div>
  )
}

function InfoLine({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 text-[#232D39]/55">{label}</span>
      <div className="flex min-w-0 items-baseline justify-end">{children}</div>
    </div>
  )
}
