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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle } from "lucide-react"
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
      setErrorMsg("请输入取消提货说明（50字以内）")
      return
    }
    setErrorMsg(null)
    onConfirmCancel(reason)
    onClose()
    // 携参跳转退货入库（对齐 PRD 场景 5）
    navigate("/仓储/入库管理/入库申请/新增?type=RETURN&fromOrder=" + order.orderNo)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            <span>取消提货与退货入库联动</span>
          </DialogTitle>
          <DialogDescription>
            单据取消后将变更为【已取消】终态且不可撤销，出库扣减的库存资产将联动触发【退货入库】流程以重新分配合规库位并恢复库存。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="rounded-md bg-muted/40 p-3 space-y-1 text-muted-foreground">
            <p>• 提货单号：<strong className="text-foreground">{order.orderNo}</strong></p>
            <p>• 货主：{order.ownerName}</p>
            <p>• 提货人：{order.pickupName}</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground flex items-center">
              <span className="text-destructive mr-1">*</span>取消提货说明（必填，最多50字）：
            </Label>
            <Textarea
              placeholder="例如：提货司机车辆严重超载，货主现场拒提申请退回（必填）"
              maxLength={50}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setErrorMsg(null)
              }}
              rows={3}
              className="text-xs"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{errorMsg && <span className="text-destructive">{errorMsg}</span>}</span>
              <span>{reason.length}/50</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            取 消
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleCancelAndGoReturn}
          >
            确认取消并前往退货入库
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
