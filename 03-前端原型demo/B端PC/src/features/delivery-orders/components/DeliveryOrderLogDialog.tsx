import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
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
      <DialogContent className="max-w-xl font-sans max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Clock className="size-5 text-amber-600" />
            <span>操作记录</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            提货单号：{order.orderNo} · 关联出库单：{order.outboundOrderNo}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-xs">
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted-foreground/20">
            {order.logs.map((log, idx) => (
              <div key={log.id || idx} className="relative group">
                {/* 双环金色节点（对齐 ASCII 2.1 风格） */}
                <span className="absolute -left-6 top-1 flex size-5 items-center justify-center rounded-full bg-card border-2 border-amber-600 shadow-2xs">
                  <span className="size-1.5 rounded-full bg-amber-600" />
                </span>

                <div className="rounded-lg border bg-card overflow-hidden shadow-2xs">
                  {/* 卡片头部浅灰底栏 */}
                  <div className="bg-muted/40 px-3 py-1.5 border-b flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-medium">{log.time}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      事件 {idx + 1}
                    </span>
                  </div>

                  {/* 卡片内容 */}
                  <div className="p-3 space-y-1.5">
                    <div className="font-semibold text-foreground text-sm">
                      {log.action}
                    </div>
                    {log.operatorName && (
                      <div className="text-muted-foreground">
                        <span>操作人：</span>
                        <span className="text-foreground">{log.operatorName}</span>
                      </div>
                    )}
                    {log.detail && (
                      <p className="text-foreground/90 text-xs pt-1 border-t border-dashed">
                        {log.detail}
                      </p>
                    )}
                    {log.notes && (
                      <div className="bg-muted/30 p-2 rounded text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">说明：</span>
                        {log.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="justify-center sm:justify-center pt-2">
          <Button size="sm" onClick={onClose} className="px-6 text-xs">
            关 闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
