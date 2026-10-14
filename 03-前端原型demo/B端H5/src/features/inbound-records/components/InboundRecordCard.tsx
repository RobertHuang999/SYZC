import { useState } from "react"
import { AlertCircle, ChevronRight, Download, Clock, User } from "lucide-react"
import { Link } from "react-router-dom"
import { inboundDetailRoute } from "../domain/constants"
import type { MobileInboundRecord } from "../domain/types"
import { MobileGoodsNamesSheet } from "./MobileGoodsNamesSheet"
import { H5_CARD } from "@/shared/h5-ui-theme"

type Props = {
  item: MobileInboundRecord
  onDownload?: (kind: "excel" | "pdf", item: MobileInboundRecord) => void
}

export function InboundRecordCard({ item, onDownload }: Props) {
  const [downloadToast, setDownloadToast] = useState<string | null>(null)
  const [goodsSheetOpen, setGoodsSheetOpen] = useState(false)
  const multiGoods = item.goodsNames.length > 1

  const handleDownloadDoc = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDownload) {
      onDownload("pdf", item)
    } else {
      setDownloadToast(`单据下载中: ${item.orderNo}`)
      setTimeout(() => setDownloadToast(null), 2000)
    }
  }

  const handleDownloadRecord = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDownload) {
      onDownload("excel", item)
    } else {
      setDownloadToast(`下载记录中: ${item.orderNo}`)
      setTimeout(() => setDownloadToast(null), 2000)
    }
  }

  const ownerFirstChar = item.ownerName ? item.ownerName.charAt(0) : "货"

  return (
    <div className={`${H5_CARD} mb-3 hover:border-blue-200 hover:shadow-sm`}>
      <div className="flex items-center justify-between border-b border-gray-100/80 bg-[#f8fafc]/80 px-3.5 py-2">
        <span className="text-xs font-medium text-gray-700">入库·{item.inboundType}</span>
        {item.hasUnprintedQrCode && (
          <div className="flex items-center text-amber-500" title="未打印二维码">
            <AlertCircle className="size-4 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="space-y-2.5 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-5 shrink-0 items-center justify-center rounded bg-blue-600 text-[11px] font-bold text-white">
              {ownerFirstChar}
            </div>
            <div className="min-w-0 truncate text-sm font-semibold text-gray-900">
              {item.ownerName}{" "}
              <span className="ml-1 text-xs font-medium text-gray-500">
                {item.ownerIdentifierMasked}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadDoc}
            className="ml-2 flex shrink-0 cursor-pointer items-center gap-1 text-xs font-medium text-blue-600 active:opacity-75"
          >
            <Download className="size-3.5" />
            <span>单据</span>
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-baseline justify-between">
            <span className="shrink-0 text-gray-500">入库单号</span>
            <Link
              to={inboundDetailRoute(item.id)}
              className="max-w-[65%] truncate pl-2 text-right font-medium text-blue-600"
            >
              {item.orderNo}
            </Link>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="shrink-0 text-gray-500">仓库名称</span>
            <span className="truncate pl-2 text-right text-gray-900">{item.warehouseName}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="shrink-0 text-gray-500">入库货品</span>
            {multiGoods ? (
              <button
                type="button"
                className="flex min-w-0 items-center gap-0.5 text-right text-gray-900"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setGoodsSheetOpen(true)
                }}
              >
                <span className="truncate">{item.goodsSummary}</span>
                <ChevronRight className="size-3.5 shrink-0 text-gray-400" />
              </button>
            ) : (
              <span className="truncate pl-2 text-right text-gray-900">{item.goodsSummary}</span>
            )}
          </div>
          <div className="flex items-baseline justify-between">
            <span className="shrink-0 text-gray-500">入库日期</span>
            <span className="pl-2 text-right text-gray-900">{item.inboundDate}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="shrink-0 text-gray-500">入库数量</span>
            <span className="pl-2 text-right font-medium text-gray-900">
              {item.quantityLabel}
              {item.unit ? ` ${item.unit}` : ""}
            </span>
          </div>
        </div>

        <div className="space-y-1 border-t border-gray-100 pt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <User className="size-3 shrink-0 text-gray-400" />
            <span className="truncate">制单人: {item.creatorDisplay}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3 shrink-0 text-gray-400" />
            <span>制单时间: {item.createdAt}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-2 text-xs font-medium">
          <button
            type="button"
            onClick={handleDownloadRecord}
            className="cursor-pointer text-blue-600 active:opacity-75"
          >
            下载记录
          </button>
          <Link
            to={inboundDetailRoute(item.id)}
            className="text-blue-600 active:opacity-75"
          >
            查看详情
          </Link>
        </div>
      </div>

      {downloadToast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-3 py-1.5 text-xs text-white">
          {downloadToast}
        </div>
      )}

      <MobileGoodsNamesSheet
        open={goodsSheetOpen}
        orderNo={item.orderNo}
        goodsNames={item.goodsNames}
        onClose={() => setGoodsSheetOpen(false)}
      />
    </div>
  )
}
