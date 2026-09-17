import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { BATCH_PUBLISH_CONFIRM_MESSAGE } from "../domain/actions"
import type { CollateralWarningEvent } from "../domain/types"

type BatchPublishConfirmDialogProps = {
  open: boolean
  events: CollateralWarningEvent[]
  onOpenChange: (open: boolean) => void
  onConfirm: (events: CollateralWarningEvent[]) => void
}

export function BatchPublishConfirmDialog({
  open,
  events,
  onOpenChange,
  onConfirm,
}: BatchPublishConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <PrototypeAnnotationTarget
          annotationIds={["collateral-warning-toolbar"]}
          markerPosition="top-left"
        >
          <DialogHeader>
            <DialogTitle>批量公示风险</DialogTitle>
            <DialogDescription>
              {BATCH_PUBLISH_CONFIRM_MESSAGE}
              <span className="mt-2 block text-foreground">
                已选 {events.length} 条已结案 · 有效且从未公示的预警。
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            下一步将进入批量公示确认页，逐条编辑公示快照（与单条「公示风险」表单一致），全部核对后再一次性提交。
          </div>

          <ul className="max-h-48 overflow-y-auto rounded-md border bg-muted/30 p-3 text-sm">
            {events.map((event) => (
              <li key={event.eventId} className="border-b border-border/40 py-1.5 last:border-0">
                <span className="font-mono text-primary">{event.orderNo}</span>
                <span className="text-muted-foreground"> · </span>
                {event.warningType}
                <span className="text-muted-foreground"> · </span>
                {event.warningTime}
              </li>
            ))}
          </ul>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={() => onConfirm(events)}>去编辑公示内容</Button>
          </DialogFooter>
        </PrototypeAnnotationTarget>
      </DialogContent>
    </Dialog>
  )
}
