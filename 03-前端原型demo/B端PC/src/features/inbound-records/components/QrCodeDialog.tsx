import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Copy, Printer } from "lucide-react"

type QrCodeDialogProps = {
  open: boolean
  type?: "main" | "sub"
  title?: string
  orderNo: string
  goodsName: string
  position: string
  quantityLabel: string
  qrCodeNo: string
  qrCodeUrl?: string
  onClose: () => void
  onCopyHint?: (text: string) => void
}

export function QrCodeDialog({
  open,
  type = "main",
  title,
  orderNo,
  goodsName,
  position,
  quantityLabel,
  qrCodeNo,
  qrCodeUrl,
  onClose,
  onCopyHint,
}: QrCodeDialogProps) {
  const codeImg =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
      qrCodeNo
    )}`

  const defaultTitle =
    type === "main" ? "存货主条码 (货品总码)" : "存货子条码 (垛位明细码)"

  const handleCopyCode = () => {
    void navigator.clipboard.writeText(qrCodeNo)
    onCopyHint?.(qrCodeNo)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <QrCode className="size-5 text-primary" />
            <DialogTitle>{title || defaultTitle}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {/* 条码/二维码卡片 */}
          <div className="flex flex-col items-center rounded-xl border bg-muted/20 p-5 shadow-2xs w-full max-w-xs">
            <div className="rounded-md border bg-white p-2.5 shadow-xs">
              <img
                src={codeImg}
                alt="存货二维码"
                className="size-48 object-contain"
              />
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold tracking-wider text-foreground">
              <span>{qrCodeNo}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 text-muted-foreground hover:text-primary"
                title="复制条码编号"
                onClick={handleCopyCode}
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {type === "main" ? "适用于货品总体批次溯源" : "适用于库房垛位盘点扫描"}
            </span>
          </div>

          {/* 货物与库位关联信息 */}
          <div className="w-full space-y-2 rounded-lg border bg-card p-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">所属入库单：</span>
              <span className="font-medium text-foreground">{orderNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">入库货物：</span>
              <span className="font-medium text-foreground">{goodsName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">堆放库位：</span>
              <span className="font-medium text-foreground">{position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">对应数量：</span>
              <span className="font-semibold text-primary">{quantityLabel}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              window.open(codeImg, "_blank")
            }}
          >
            <Download className="mr-1.5 size-3.5" />
            下载二维码
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              window.print()
            }}
          >
            <Printer className="mr-1.5 size-3.5" />
            打印条码
          </Button>
          <Button size="sm" onClick={onClose}>
            关 闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
