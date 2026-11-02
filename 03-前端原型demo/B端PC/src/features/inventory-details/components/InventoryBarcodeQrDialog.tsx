import React, { useState } from "react"
import { QrCode, Copy, Printer, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { InventoryDetailRecord } from "@/features/shared/mock/inventory-shared-seed"

interface InventoryBarcodeQrDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryDetailRecord | null
}

export const InventoryBarcodeQrDialog: React.FC<InventoryBarcodeQrDialogProps> = ({
  open,
  onOpenChange,
  item,
}) => {
  const [copied, setCopied] = useState(false)

  if (!item) return null

  const handleCopy = () => {
    navigator.clipboard?.writeText(item.barcode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    alert(`【模拟打印货位标签】已发送打印任务至现场打印机：\n存货条码：${item.barcode}\n货品：${item.specification}\n垛位：${item.houseName}-${item.partitionName}-${item.locationCode}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <QrCode className="h-5 w-5 text-primary" />
            <span>存货条码二维码</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            物理垛位唯一存货防伪条码，用于移动端现场扫码验货与盘点核销。
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-xl border border-slate-200 mt-2">
          {/* 二维码卡片 */}
          <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200">
            <svg
              className="w-36 h-36 text-slate-900"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="11" width="13" height="13" />
              <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="76" y="11" width="13" height="13" />
              <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="76" width="13" height="13" />
              <rect x="36" y="12" width="6" height="6" />
              <rect x="48" y="18" width="10" height="6" />
              <rect x="36" y="36" width="12" height="12" />
              <rect x="54" y="42" width="8" height="6" />
              <rect x="68" y="38" width="10" height="8" />
              <rect x="38" y="56" width="6" height="8" />
              <rect x="52" y="54" width="8" height="8" />
              <rect x="70" y="58" width="8" height="8" />
              <rect x="42" y="76" width="8" height="8" />
              <rect x="56" y="78" width="8" height="6" />
              <rect x="80" y="74" width="8" height="12" />
            </svg>
            <div className="text-center font-mono text-xs font-bold text-slate-800 mt-2">
              {item.barcode}
            </div>
          </div>

          {/* 属性参数 */}
          <div className="w-full text-xs space-y-1.5 mt-4 text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">货品全称：</span>
              <span className="font-medium text-slate-900 text-right truncate max-w-[170px]" title={item.specification}>
                {item.specification}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">空间货位：</span>
              <span className="font-medium text-slate-800 text-right">
                {item.houseName} · {item.partitionName} · {item.locationCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">当前在库：</span>
              <span className="font-medium text-emerald-600 text-right">
                {item.availableQuantity.toFixed(3)} {item.unit}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 text-xs gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "已复制条码" : "复制条码编号"}
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="h-8 text-xs gap-1.5 bg-primary text-white"
          >
            <Printer className="h-3.5 w-3.5" />
            打印标签
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

