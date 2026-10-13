import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, Download } from "lucide-react"

type QrCodeDialogProps = {
  open: boolean
  title?: string
  orderNo: string
  goodsName: string
  position: string
  quantityLabel: string
  qrCodeNo: string
  qrCodeUrl?: string
  onClose: () => void
}

export function QrCodeDialog({
  open,
  title = "存货条形码与二维码",
  orderNo,
  goodsName,
  position,
  quantityLabel,
  qrCodeNo,
  qrCodeUrl,
  onClose,
}: QrCodeDialogProps) {
  const codeImg =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      qrCodeNo
    )}`

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <QrCode className="size-5 text-primary" />
            <DialogTitle>{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-3">
          {/* 条形码 / 二维码区域 */}
          <div className="flex flex-col items-center rounded-xl border bg-muted/20 p-5 shadow-sm">
            <img
              src={codeImg}
              alt="存货二维码"
              className="size-44 rounded-md border bg-white p-2 object-contain"
            />
            <span className="mt-3 font-mono text-sm font-semibold tracking-wider text-foreground">
              {qrCodeNo}
            </span>
          </div>

          {/* 货物与库位信息 */}
          <div className="w-full space-y-1.5 rounded-lg border bg-card p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">所属入库单：</span>
              <span className="font-mono font-medium">{orderNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">入库货物：</span>
              <span className="font-medium">{goodsName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">堆放库位：</span>
              <span className="font-medium">{position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">堆放数量：</span>
              <span className="font-semibold text-primary">{quantityLabel}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.open(codeImg, "_blank")
            }}
          >
            <Download className="mr-1 size-4" />
            下载二维码
          </Button>
          <Button size="sm" onClick={onClose}>
            关 闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
