import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type WithdrawConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function WithdrawConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: WithdrawConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认撤回</DialogTitle>
          <DialogDescription>
            撤回后审批待办将关闭，确认撤回该开锁申请？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onConfirm}>确认撤回</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
