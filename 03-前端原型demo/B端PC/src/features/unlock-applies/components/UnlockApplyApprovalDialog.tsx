import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { UnlockApply } from "../domain/types"
import { formatApplicant } from "../lib/detail-utils"

type UnlockApplyApprovalDialogProps = {
  open: boolean
  apply: UnlockApply | null
  onOpenChange: (open: boolean) => void
  onApprove: (apply: UnlockApply, opinion: string) => void
  onReject: (apply: UnlockApply, reason: string) => void
}

export function UnlockApplyApprovalDialog({
  open,
  apply,
  onOpenChange,
  onApprove,
  onReject,
}: UnlockApplyApprovalDialogProps) {
  const [opinion, setOpinion] = useState("")
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectError, setRejectError] = useState("")

  useEffect(() => {
    if (!open) return
    setOpinion("")
    setRejectOpen(false)
    setRejectReason("")
    setRejectError("")
  }, [apply?.applyNo, open])

  const handleApprove = () => {
    if (!apply) return
    onApprove(apply, opinion)
    onOpenChange(false)
  }

  const handleRejectConfirm = () => {
    if (!apply) return
    if (!rejectReason.trim()) {
      setRejectError("请填写驳回原因")
      return
    }
    onReject(apply, rejectReason.trim())
    setRejectOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>去处理</DialogTitle>
            <DialogDescription>
              {apply
                ? `${apply.applyNo} · ${apply.deviceName} · ${formatApplicant(apply)}`
                : "开锁申请审批"}
            </DialogDescription>
          </DialogHeader>

          {apply && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <div className="text-muted-foreground">绑定仓库</div>
                <div className="font-medium">{apply.warehouseName}</div>
                <div className="mt-2 text-muted-foreground">事由</div>
                <div>{apply.reason}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approval-opinion">审批意见（选填，最多 200 字）</Label>
                <Textarea
                  id="approval-opinion"
                  value={opinion}
                  maxLength={200}
                  rows={4}
                  placeholder="审批通过时可填写补充说明"
                  onChange={(event) => setOpinion(event.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(true)}>
              驳回
            </Button>
            <Button onClick={handleApprove}>通过</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>驳回申请</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">驳回原因 *</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              maxLength={200}
              rows={4}
              placeholder="请填写驳回原因"
              onChange={(event) => {
                setRejectReason(event.target.value)
                if (rejectError) setRejectError("")
              }}
            />
            {rejectError && (
              <p className="text-sm text-destructive">{rejectError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              取消
            </Button>
            <Button onClick={handleRejectConfirm}>确认驳回</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
