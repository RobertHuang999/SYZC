import React from "react"
import { FileText, Download, Printer, ShieldCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { InventoryTransactionRecord } from "@/features/shared/mock/inventory-shared-seed"

interface TransactionPdfViewerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: InventoryTransactionRecord | null
}

export const TransactionPdfViewerDialog: React.FC<TransactionPdfViewerDialogProps> = ({
  open,
  onOpenChange,
  record,
}) => {
  if (!record) return null

  const handleDownload = () => {
    alert(`【模拟下载凭证】已下载电子凭证：\n流水凭证号：${record.transactionNo}\n业务单号：${record.orderNo}.pdf`)
  }

  const handlePrint = () => {
    alert(`【模拟打印单据】正在发送打印指令至本地打印服务...`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            <span>仓储业务单据凭证 (PDF 预览)</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            带司法存证防伪公章与时间戳认证的终态履约凭证。
          </DialogDescription>
        </DialogHeader>

        {/* 电子凭据纸张效果 */}
        <div className="relative bg-white border border-slate-300 rounded-lg p-6 shadow-xs text-xs space-y-4 font-sans mt-2">
          {/* 水印 */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 select-none">
            <span className="text-7xl font-bold tracking-widest text-slate-900 rotate-[-25deg]">
              森云监管存证
            </span>
          </div>

          {/* 抬头 */}
          <div className="border-b border-slate-300 pb-3 text-center">
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              {record.warehouseName}
            </h2>
            <div className="text-sm font-semibold text-slate-700 mt-0.5">
              仓储业务【{record.businessType}】单据凭证
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-2">
              <span>流水号：{record.transactionNo}</span>
              <span>业务单号：{record.orderNo}</span>
              <span>业务发生日期：{record.businessDate}</span>
            </div>
          </div>

          {/* 明细表格 */}
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold">
              <tr className="h-8 border-b border-slate-300">
                <th className="px-2 py-1 border-r border-slate-300">货品全称与规格</th>
                <th className="px-2 py-1 border-r border-slate-300 min-w-[80px]">业务流向</th>
                <th className="px-2 py-1 border-r border-slate-300 min-w-[90px] text-right">变动数量</th>
                <th className="px-2 py-1 min-w-[90px] text-right">变动后结存</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10 border-b border-slate-300">
                <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-900">
                  {record.specification}
                </td>
                <td className="px-2 py-1 border-r border-slate-300 font-medium">
                  {record.direction === "IN" ? (
                    <span className="text-emerald-700">入库 (+)</span>
                  ) : (
                    <span className="text-rose-700">出库 (-)</span>
                  )}
                </td>
                <td className="px-2 py-1 border-r border-slate-300 text-right font-bold text-slate-900">
                  {record.direction === "IN" ? `+${record.changeQuantity.toFixed(3)}` : `-${record.changeQuantity.toFixed(3)}`} {record.unit}
                </td>
                <td className="px-2 py-1 text-right text-slate-800">
                  {record.balanceQuantity.toFixed(3)} {record.unit}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 签章与经办人栏 */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-[11px] text-slate-600">
            <div>
              <div>存货权属方：{record.ownerName}</div>
              <div>经办人：{record.operatorName}</div>
              <div>系统制单时间：{record.createTime}</div>
            </div>
            <div className="relative text-right flex flex-col items-end justify-center">
              {/* 模拟电子监管红印公章 */}
              <div className="border-2 border-rose-500 text-rose-500 rounded-full h-20 w-20 flex flex-col items-center justify-center p-1 text-[9px] font-bold rotate-[-15deg] shadow-xs">
                <ShieldCheck className="h-4 w-4 mb-0.5" />
                <span>仓储监管核销</span>
                <span className="text-[8px] font-normal font-mono">2026-10-10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8 text-xs gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            打印凭证
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="h-8 text-xs gap-1.5 bg-primary text-white"
          >
            <Download className="h-3.5 w-3.5" />
            下载电子凭证 PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

