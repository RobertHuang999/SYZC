import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { SeverityLevelRecord } from "../domain/types"

type DeleteConfirmDialogProps = {
  open: boolean
  record: SeverityLevelRecord | null
  onOpenChange: (open: boolean) => void
  onConfirm: (record: SeverityLevelRecord) => void
}

export function DeleteConfirmDialog({
  open,
  record,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>删除后不可恢复，确认删除？</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (record) {
                onConfirm(record)
              }
            }}
          >
            确认删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
