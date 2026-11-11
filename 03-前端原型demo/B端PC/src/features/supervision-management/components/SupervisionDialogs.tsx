import { ClockIcon, FileTextIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DocumentManagementTabContent } from "@/shared/document-management"
import type { SupervisionOrderItem } from "../domain/types"

export function SupervisionLogDialog({
  open,
  order,
  onClose,
}: {
  open: boolean
  order: SupervisionOrderItem | null
  onClose: () => void
}) {
  if (!open || !order) return null

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ClockIcon className="size-5 text-primary" />
            <span>操作记录</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            订单编号：{order.orderNo} · 货主：{order.ownerName}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-xs">
          <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-muted-foreground/20">
            {order.logs.map((log, index) => (
              <div key={log.id} className="relative">
                <span className="absolute -left-6 top-1 flex size-5 items-center justify-center rounded-full border-2 border-primary bg-card">
                  <span className="size-1.5 rounded-full bg-primary" />
                </span>

                <div className="overflow-hidden rounded-lg border bg-card shadow-2xs">
                  <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5 text-muted-foreground">
                    <span className="text-[11px] font-medium">{log.time}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                      事件 {order.logs.length - index}
                    </span>
                  </div>
                  <div className="space-y-1.5 p-3">
                    <div className="text-sm font-semibold text-foreground">{log.action}</div>
                    <div className="text-muted-foreground">
                      <span>操作人：</span>
                      <span className="text-foreground">{log.operatorName}</span>
                    </div>
                    {log.detail ? (
                      <p className="border-t border-dashed pt-1 text-xs text-foreground/90">
                        {log.detail}
                      </p>
                    ) : null}
                    {log.notes ? (
                      <div className="rounded bg-muted/30 p-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">说明：</span>
                        {log.notes}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SupervisionMaterialsDialog({
  open,
  order,
  onClose,
}: {
  open: boolean
  order: SupervisionOrderItem | null
  onClose: () => void
}) {
  if (!open || !order) return null

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="flex max-h-[88vh] w-[92vw] flex-col gap-0 overflow-hidden p-0 font-sans sm:max-w-[1080px]">
        <DialogHeader className="shrink-0 border-b border-border px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FileTextIcon className="size-5 text-primary" />
            <span>资料管理</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            订单编号：{order.orderNo} · 资料随监管办理终审自动归档，可按阶段追加补充资料
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <DocumentManagementTabContent
            orderNo={order.orderNo}
            orderType="supervision"
            allowSupplement
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
