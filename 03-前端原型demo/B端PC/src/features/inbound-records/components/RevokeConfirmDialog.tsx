import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

type RevokeConfirmDialogProps = {
  open: boolean
  ownerName: string
  orderNo: string
  onClose: () => void
  onConfirm: () => void
}

export function RevokeConfirmDialog({
  open,
  ownerName,
  orderNo,
  onClose,
  onConfirm,
}: RevokeConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="size-5" />
            <DialogTitle>系统提示</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-sm text-foreground">
            您确认要撤销货主（<span className="font-semibold">{ownerName}</span>）单号为{" "}
            <span className="font-mono font-medium">{orderNo}</span>{" "}
            的入库审核任务吗？
            <span className="mt-1 block text-destructive">撤销后不可恢复，请谨慎操作！</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            我再想想
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            确认撤销
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
