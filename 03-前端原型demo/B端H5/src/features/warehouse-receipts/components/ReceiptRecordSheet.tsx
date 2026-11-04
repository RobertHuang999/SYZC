import { History, Download, FileText, CheckCircle2 } from "lucide-react"
import type { WarehouseReceipt } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { ReceiptSheet } from "./ReceiptSheet"

export function ReceiptRecordSheet({
  receipt,
  open,
  onClose,
  onDownloadRecord,
}: {
  receipt: WarehouseReceipt | null
  open: boolean
  onClose: () => void
  onDownloadRecord?: (relatedNo: string) => void
}) {
  if (!receipt) return null

  const changes = receipt.changes ?? []

  return (
    <ReceiptSheet
      open={open}
      title="仓单变更记录"
      description={`${receipt.code} · ${receipt.warehouseName} · 共 ${changes.length} 条记录`}
      onClose={onClose}
    >
      <div className="space-y-3 py-1">
        {changes.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#232D39]/45">
            暂无资产变更记录
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-[#232D39]/10">
            {changes.map((record, index) => {
              const isFirst = index === 0
              return (
                <div key={record.id || index} className="relative">
                  {/* 时间线圆点 */}
                  <div
                    className={`absolute -left-6 top-1 flex size-5 items-center justify-center rounded-full border-2 bg-white ${
                      isFirst
                        ? "border-blue-600 text-blue-600"
                        : "border-[#232D39]/30 text-[#232D39]/40"
                    }`}
                  >
                    <div
                      className={`size-2 rounded-full ${
                        isFirst ? "bg-blue-600" : "bg-[#232D39]/40"
                      }`}
                    />
                  </div>

                  <div className="rounded-xl border border-[#232D39]/8 bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        <History className="size-3" />
                        {record.changeType}
                      </span>
                      <span className="text-[11px] text-[#232D39]/50">
                        {record.changedAt}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-[#232D39]/85">
                      {record.summary}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between border-t border-[#232D39]/6 pt-2 text-[11px] text-[#232D39]/50">
                      <span>操作人: {record.operator}</span>
                      {record.relatedNo ? (
                        <button
                          type="button"
                          onClick={() => onDownloadRecord?.(record.relatedNo!)}
                          className="inline-flex items-center gap-1 font-medium text-blue-600 active:underline"
                        >
                          <Download className="size-3" />
                          凭单 {record.relatedNo}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </ReceiptSheet>
  )
}

