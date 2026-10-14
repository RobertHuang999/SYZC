import { useState } from "react"
import { Download, FileSpreadsheet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { OutboundRecord } from "../domain/types"

interface OutboundExportRecordsDialogProps {
  open: boolean
  record: OutboundRecord | null
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function OutboundExportRecordsDialog({
  open,
  record,
  onClose,
  onSuccess,
}: OutboundExportRecordsDialogProps) {
  const [downloading, setDownloading] = useState(false)

  if (!open || !record) return null

  const handleExport = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      onSuccess(`出库记录 Excel 导出成功：[${record.orderNo}].xlsx`)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-gray-900">下载出库记录明细</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="my-4 space-y-3 text-xs text-gray-600">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">出库单号：</span>
                <span className="font-medium text-gray-800">{record.orderNo}</span>
              </div>
              <div>
                <span className="text-gray-400">出库类型：</span>
                <span className="font-medium text-gray-800">{record.type}</span>
              </div>
              <div>
                <span className="text-gray-400">货主主体：</span>
                <span className="text-gray-800">{record.ownerName}</span>
              </div>
              <div>
                <span className="text-gray-400">仓库名称：</span>
                <span className="text-gray-800">{record.warehouseName}</span>
              </div>
              <div>
                <span className="text-gray-400">总出库量：</span>
                <span className="text-gray-800">
                  {record.totalAmount} {record.amountUnit}
                </span>
              </div>
              <div>
                <span className="text-gray-400">关联单号：</span>
                <span className="text-gray-800">{record.relatedNo || "—"}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-md border-gray-100 overflow-hidden">
            <div className="bg-gray-100/70 px-3 py-1.5 font-medium text-[11px] text-gray-700">
              导出列清单预览（标准 Excel 表格）:
            </div>
            <div className="p-3 text-[11px] space-y-1 text-gray-500">
              <p>• 序号、出库单号、出库日期、出库类型、货主名称、货主标识</p>
              <p>• 仓库、库房、分区、具体位置、货物名称、大类、品类、规格</p>
              <p>• 存货条码、入库时间、出库前数量、出库数量、出库后数量、计量单位</p>
              <p>• 制单人、制单时间、审核节点履历、提货人信息及提货时间</p>
            </div>
          </div>

          <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded">
            提示：依据金融审计要求，导出行为将自动记录操作人、时间戳与 IP 地址至系统安全审计日志中（O15）。
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={downloading}>
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={downloading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Download className="mr-1.5 size-3.5" />
            {downloading ? "正在导出..." : "确认下载 Excel"}
          </Button>
        </div>
      </div>
    </div>
  )
}
