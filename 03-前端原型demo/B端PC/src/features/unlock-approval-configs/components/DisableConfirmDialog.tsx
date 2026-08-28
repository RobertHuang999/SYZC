import { useEffect, useState } from "react"
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

type DisableConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
}

export function DisableConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: DisableConfirmDialogProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason("")
      setError(null)
    }
  }, [open])

  const handleConfirm = () => {
    const trimmed = reason.trim()
    if (!trimmed) {
      setError("请填写停用原因")
      return
    }
    if (trimmed.length > 200) {
      setError("停用原因不能超过 200 字")
      return
    }
    onConfirm(trimmed)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认停用</DialogTitle>
          <DialogDescription>
            停用后新申请不再命中本配置，在途申请不受影响，确认停用？
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="disable-reason">
            <span className="text-destructive font-bold mr-1">*</span>
            停用原因
          </Label>
          <textarea
            id="disable-reason"
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs"
            maxLength={200}
            placeholder="请输入停用原因"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value)
              if (error) setError(null)
            }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{error ?? "≤200 字，必填"}</span>
            <span>{reason.length}/200</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm}>确认停用</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
