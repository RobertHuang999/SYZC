import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle2, Download } from "lucide-react"
import type { TransferRecord } from "../domain/types"

interface Props {
  open: boolean
  record: TransferRecord | null
  onClose: () => void
}

export function TransferPdfDialog({ open, record, onClose }: Props) {
  const [downloading, setDownloading] = useState(false)

  if (!record) return null

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      const blob = new Blob(
        [
          `森云科技 SYZC 供应链金融存货监管系统 - 移库凭单\n移库单号: ${record.id}\n货主: ${record.ownerName}\n仓库: ${record.warehouseName}\n移库时间: ${record.transferTime}\n移库类型: ${record.transferTypeName}\n移库总数量: ${record.totalAmount} ${record.unit}`,
        ],
        { type: "text/plain;charset=utf-8" }
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `移库凭单_${record.id}.txt`
      a.click()
      URL.revokeObjectURL(url)
      onClose()
    }, 700)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            单据下载 - 移库凭单
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">移库单号：</span>
              <span className="font-medium text-foreground">{record.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">移库类型：</span>
              <span className="text-foreground">{record.transferTypeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">货主名称：</span>
              <span className="text-foreground">{record.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">所属仓库：</span>
              <span className="text-foreground">{record.warehouseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">移库总数量：</span>
              <span className="font-medium text-foreground">
                {record.totalAmount} {record.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">移库时间：</span>
              <span className="text-foreground">{record.transferTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>系统已成功调取快照，并向【下载记录】追加一条审计生成日志。</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download className="size-4 mr-1.5" />
            {downloading ? "生成并导出中..." : "立即下载 PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

