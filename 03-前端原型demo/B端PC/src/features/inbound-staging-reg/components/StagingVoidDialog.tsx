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
import { Textarea } from "@/components/ui/textarea"

type Props = {
  open: boolean
  regNo: string
  onClose: () => void
  onConfirm: (reason: string) => void
}

export function StagingVoidDialog({ open, regNo, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (!open) setReason("")
  }, [open])

  const trimmed = reason.trim()
  const valid = trimmed.length > 0 && trimmed.length <= 200

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>作废入库暂存登记单</DialogTitle>
          <DialogDescription>
            作废后登记单 {regNo} 永久只读，不可恢复或转正（O02）。
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="请录入详细作废原因（最多 200 字）"
          value={reason}
          rows={4}
          onChange={(e) => setReason(e.target.value.slice(0, 200))}
        />
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!valid}
            onClick={() => onConfirm(trimmed)}
          >
            确认作废
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
