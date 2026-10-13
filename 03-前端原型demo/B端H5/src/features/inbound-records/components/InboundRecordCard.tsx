import { ChevronRight, FileCheck, FileText, RotateCcw } from "lucide-react"
import { Link } from "react-router-dom"
import { FLOW_STATUS_LABEL, inboundDetailRoute } from "../domain/constants"
import type { MobileInboundRecord } from "../domain/types"

const STATUS_CLASS: Record<MobileInboundRecord["flowStatus"], string> = {
  PENDING: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
  WITHDRAWN: "bg-gray-100 text-gray-600 border-gray-200",
}

type Props = {
  item: MobileInboundRecord
  onDownload?: (kind: "excel" | "pdf", item: MobileInboundRecord) => void
  onRevoke?: (item: MobileInboundRecord) => void
}

export function InboundRecordCard({ item, onDownload, onRevoke }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm">
      <Link to={inboundDetailRoute(item.id)} className="block active:opacity-90">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs text-gray-400">{item.orderNo}</p>
            <p className="mt-1 text-sm font-bold text-gray-900">
              {item.ownerName}
              <span className="ml-1 text-xs font-normal text-gray-400">
                ({item.ownerIdentifierMasked})
              </span>
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASS[item.flowStatus]}`}
          >
            {FLOW_STATUS_LABEL[item.flowStatus]}
          </span>
        </div>

        <div className="mt-2.5 space-y-1 text-xs text-gray-600">
          <p>
            {item.inboundType} · {item.warehouseName}
          </p>
          <p className="line-clamp-1 text-gray-500">{item.goodsSummary}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-orange-600">{item.quantityLabel}</span>
            <span className="text-[11px] text-gray-400">{item.createdAt}</span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-end text-xs font-medium text-orange-600">
          查看详情
          <ChevronRight className="size-4" />
        </div>
      </Link>

      {/* 快捷操作区 */}
      {(item.flowStatus === "APPROVED" && onDownload) ||
      (item.flowStatus === "PROCESSING" && onRevoke) ? (
        <div className="mt-2.5 flex items-center justify-end gap-3 border-t border-gray-100 pt-2 text-xs">
          {item.flowStatus === "APPROVED" && onDownload ? (
            <>
              <button
                type="button"
                className="flex items-center gap-1 text-orange-600 active:opacity-75"
                onClick={() => onDownload("excel", item)}
              >
                <FileCheck className="size-3.5" />
                下载记录
              </button>
              <button
                type="button"
                className="flex items-center gap-1 text-orange-600 active:opacity-75"
                onClick={() => onDownload("pdf", item)}
              >
                <FileText className="size-3.5" />
                单据下载
              </button>
            </>
          ) : null}

          {item.flowStatus === "PROCESSING" && onRevoke ? (
            <button
              type="button"
              className="flex items-center gap-1 text-red-600 active:opacity-75"
              onClick={() => onRevoke(item)}
            >
              <RotateCcw className="size-3.5" />
              撤销申请
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
