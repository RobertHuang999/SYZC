import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2 } from "lucide-react"
import type { DeliveryOrderItem } from "../domain/types"

interface DeliveryOrderLogDialogProps {
  open: boolean
  order: DeliveryOrderItem | null
  onClose: () => void
}

export function DeliveryOrderLogDialog({
  open,
  order,
  onClose,
}: DeliveryOrderLogDialogProps) {
  if (!open || !order) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <span>提货单操作记录与全流程审计</span>
          </DialogTitle>
          <DialogDescription>
            单号：{order.orderNo} · 关联出库单：{order.outboundOrderNo}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-xs">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted-foreground/20">
            {order.logs.map((log, idx) => (
              <div key={log.id || idx} className="relative group">
                {/* 时间轴圆点 */}
                <span className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/30">
                  <CheckCircle2 className="size-3" />
                </span>

                <div className="rounded-lg border bg-card p-3 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-sm">
                      {log.action}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {log.time}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span>经办人：{log.operatorName}</span>
                  </div>
                  <p className="text-foreground pt-1 border-t border-dashed">
                    {log.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button size="sm" onClick={onClose}>
            关 闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
