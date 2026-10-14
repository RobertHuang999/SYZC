import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

type PdfViewerDialogProps = {
  open: boolean
  title?: string
  fileUrl?: string
  fileName?: string
  onClose: () => void
}

export function PdfViewerDialog({
  open,
  title = "单据与资料文件预览",
  fileUrl,
  fileName = "资料文件.pdf",
  onClose,
}: PdfViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-red-500" />
            <DialogTitle>{title} - {fileName}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border bg-muted/20 p-6 text-center">
          <FileText className="size-16 text-red-400" />
          <h4 className="mt-4 text-base font-medium">{fileName}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF 电子签名已防伪存证 · 司法存证哈希固化
          </p>

          <div className="mt-6 flex flex-col items-center gap-2 rounded-md border bg-card p-4 text-xs text-muted-foreground">
            <div>存证哈希：<span className="text-foreground break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span></div>
            <div>签名主体：四川享宇科技有限公司 电子印章中心</div>
            <div>归档状态：正式凭据生效</div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.open(fileUrl || "#", "_blank")
            }}
          >
            <Download className="mr-1 size-4" />
            下载源文件
          </Button>
          <Button size="sm" onClick={onClose}>
            关 闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
