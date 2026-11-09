import { useState } from "react"
import { Download, FileSpreadsheet, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AbnormalExportRecordsDialogProps {
  open: boolean
  onClose: () => void
  totalCount: number
}

export function AbnormalExportRecordsDialog({
  open,
  onClose,
  totalCount,
}: AbnormalExportRecordsDialogProps) {
  const [downloading, setDownloading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1200)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <FileSpreadsheet className="size-5 text-primary" />
            导出货物异动台账
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            将根据当前筛选条件导出异动生效流水与损溢调账明细（Excel 格式）。
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">导出范围：</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              当前筛选结果（共 {totalCount} 条）
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">包含内容：</span>
            <span>异动单号、关联单据、货主、货物、调账前后数量、差额、审批信息</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">文件格式：</span>
            <span className="font-medium text-primary">.XLSX</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} disabled={downloading} className="h-8 text-xs cursor-pointer">
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={downloading || success}
            className="h-8 text-xs cursor-pointer"
          >
            {success ? (
              <>
                <Check className="mr-1.5 size-3.5 text-emerald-300" />
                导出成功
              </>
            ) : downloading ? (
              "正在生成报表..."
            ) : (
              <>
                <Download className="mr-1.5 size-3.5" />
                确认导出
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

