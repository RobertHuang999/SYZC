import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon } from "lucide-react"
import type { LtvHitSnapshot } from "../domain/types"

type ReleasePromptDialogProps = {
  open: boolean
  orderNo?: string
  ltvHitSnapshot?: LtvHitSnapshot | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ReleasePromptDialog({
  open,
  orderNo,
  ltvHitSnapshot,
  onOpenChange,
  onConfirm,
}: ReleasePromptDialogProps) {
  const isLtv = ltvHitSnapshot !== null && ltvHitSnapshot !== undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircleIcon className="size-5" />
            <DialogTitle>解除预警提示</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-base font-medium text-foreground">
            前往关联的订单业务中解除
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            该预警为商业类规则触发{orderNo ? `（订单：${orderNo}）` : ""}
            ，需前往对应的抵押/质押订单业务流程中完成处置。
          </p>
          {isLtv && (
            <div className="rounded-lg border bg-muted/30 p-3 text-foreground">
              <p>
                本次命中：<span className="font-medium">{ltvHitSnapshot.hitLine}</span>
                （触发时抵/质押率 (LTV) {ltvHitSnapshot.triggerLtv}%）
              </p>
              <p className="mt-2 text-muted-foreground">
                订单侧仅展示以下解除方式：
              </p>
              <p className="mt-1 font-medium">
                {ltvHitSnapshot.allowedReleaseMethods.join("、")}
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onConfirm}>前往订单业务</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
