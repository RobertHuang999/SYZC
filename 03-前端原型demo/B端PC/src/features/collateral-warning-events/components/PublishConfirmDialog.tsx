import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { CollateralWarningEvent } from "../domain/types"

type PublishConfirmDialogProps = {
  open: boolean
  event: CollateralWarningEvent | null
  onOpenChange: (open: boolean) => void
  onConfirm: (event: CollateralWarningEvent) => void
}

export function PublishConfirmDialog({
  open,
  event,
  onOpenChange,
  onConfirm,
}: PublishConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>公示风险确认</DialogTitle>
          <DialogDescription>
            确认将订单 {event?.orderNo ?? "—"} 的已处理预警公示至风险公示列表？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={() => {
              if (event) {
                onConfirm(event)
              }
            }}
          >
            确认公示
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
