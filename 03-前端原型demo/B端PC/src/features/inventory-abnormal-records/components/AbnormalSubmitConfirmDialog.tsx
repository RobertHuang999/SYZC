import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { InStockItem } from "../domain/form-types"
import type { DiffCalcResult } from "../lib/form-utils"

interface AbnormalSubmitConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  stock: InStockItem | null
  diffResult: DiffCalcResult
  abnormalType: string
  submitting?: boolean
}

export function AbnormalSubmitConfirmDialog({
  open,
  onClose,
  onConfirm,
  stock,
  diffResult,
  abnormalType,
  submitting = false,
}: AbnormalSubmitConfirmDialogProps) {
  if (!stock) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            <AlertCircle className="size-5 text-amber-500" />
            确认提交货物异动申请？
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            提交后系统将生成 19 位异动单据并进入审批中心，该货位状态将临时切换为【异动申请中】并互斥锁定。
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex justify-between">
            <span className="text-slate-500">货物名称：</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {stock.goodsTitle}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">所在库区：</span>
            <span className="text-slate-700 dark:text-slate-300">
              {stock.warehouseName}-{stock.storeroomName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">异动前可用量：</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {stock.availableQty} {stock.unit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">异动后可用量：</span>
            <span className="font-semibold text-primary">
              {diffResult.afterQty} {stock.unit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">试算变动差额：</span>
            <span
              className={`font-semibold ${
                diffResult.diffQty > 0 ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {diffResult.diffQty > 0 ? `+${diffResult.diffQty}` : diffResult.diffQty}{" "}
              {stock.unit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">申报异动类型：</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {abnormalType}
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting} className="h-8 text-xs cursor-pointer">
            再检查一下
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={submitting}
            className="h-8 text-xs cursor-pointer font-medium"
          >
            {submitting ? "正在提交中..." : "确认提交申请"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

