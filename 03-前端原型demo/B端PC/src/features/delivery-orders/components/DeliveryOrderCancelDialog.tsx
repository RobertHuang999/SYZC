import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { AlertCircle } from "lucide-react"
import type { DeliveryOrderItem } from "../domain/types"

interface DeliveryOrderCancelDialogProps {
  open: boolean
  order: DeliveryOrderItem | null
  onClose: () => void
  onConfirmCancel: (reason: string) => void
}

export function DeliveryOrderCancelDialog({
  open,
  order,
  onClose,
  onConfirmCancel,
}: DeliveryOrderCancelDialogProps) {
  const navigate = useNavigate()
  const [reason, setReason] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!open || !order) return null

  const handleCancelAndGoReturn = () => {
    if (!reason.trim()) {
      setErrorMsg("请填写取消提货说明（必填，50字以内）")
      return
    }
    setErrorMsg(null)
    onConfirmCancel(reason)
    onClose()

    // 携参跳转退货入库承接页（对齐 PRD 5.5 / R06 / ASCII 1.2）
    navigate(
      `/仓储/入库管理/入库记录/新增?type=RETURN&fromOrder=${order.outboundOrderNo}&owner=${encodeURIComponent(
        order.ownerName
      )}`
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md font-sans">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <AlertCircle className="size-5 text-amber-600" />
            <span>提示</span>
          </DialogTitle>
          <DialogDescription className="pt-2 text-xs leading-relaxed text-foreground">
            您正在操作取消货主 <strong className="text-primary">{order.ownerName}</strong>{" "}
            的提货申请操作，取消后提货申请将无法操作提货且无法恢复，请慎重操作！
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">
              <span className="text-destructive mr-0.5">*</span>说明：
            </span>
            <span className="text-[11px] text-muted-foreground">{reason.length}/50</span>
          </div>
          <Textarea
            placeholder="请填写取消提货说明（必填，50字以内）"
            maxLength={50}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setErrorMsg(null)
            }}
            rows={3}
            className="text-xs"
          />
          {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}
        </div>

        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            取消
          </Button>
          <Button
            size="sm"
            className="text-xs px-4"
            onClick={handleCancelAndGoReturn}
          >
            前往退货入库
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
