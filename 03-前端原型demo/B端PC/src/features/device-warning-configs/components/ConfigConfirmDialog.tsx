import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ConfigConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfigConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  destructive = false,
  onOpenChange,
  onConfirm,
}: ConfigConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant={destructive ? "destructive" : "default"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
