import { useEffect, useState, type MouseEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type ConfigConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
  reasonRequired?: boolean
  reasonLabel?: string
  reasonPlaceholder?: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

const REASON_MAX_LENGTH = 200

export function ConfigConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  destructive = false,
  reasonRequired = false,
  reasonLabel = "原因",
  reasonPlaceholder = "请输入原因（1～200 字）",
  onOpenChange,
  onConfirm,
}: ConfigConfirmDialogProps) {
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (open) {
      setReason("")
    }
  }, [open, title, reasonLabel])

  const confirmDisabled = reasonRequired && reason.trim().length === 0

  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (confirmDisabled) {
      return
    }
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {reasonRequired && (
          <div className="space-y-2">
            <Label htmlFor="config-confirm-reason">
              {reasonLabel}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="config-confirm-reason"
              value={reason}
              maxLength={REASON_MAX_LENGTH}
              rows={4}
              placeholder={reasonPlaceholder}
              onChange={(event) => setReason(event.target.value)}
            />
            <p className="text-xs text-muted-foreground text-right">
              {reason.length}/{REASON_MAX_LENGTH}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={confirmDisabled}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
