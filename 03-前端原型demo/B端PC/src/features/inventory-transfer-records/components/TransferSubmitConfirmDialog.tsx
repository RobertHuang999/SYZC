import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  open: boolean
  categoryCount: number
  totalQuantity: number
  unit: string
  submitting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function TransferSubmitConfirmDialog({
  open,
  categoryCount,
  totalQuantity,
  unit,
  submitting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <AlertCircle className="size-5 text-amber-500" />
            确认提交移库申请
          </DialogTitle>
          <DialogDescription className="text-sm pt-2 text-foreground/90">
            本次移库申请共包含{" "}
            <strong className="text-primary">{categoryCount}</strong> 个品类，移库总数量为{" "}
            <strong className="text-primary">
              {totalQuantity} {unit}
            </strong>
            。
            <br />
            <br />
            提交后系统将对原库位库存施加
            <strong>【移库占用锁定】</strong>，并推送至工作中心审批流。终审通过前不可撤回已分配储位。是否确认提交？
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            返回修改
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={submitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {submitting ? "提交中..." : "确定提交"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

