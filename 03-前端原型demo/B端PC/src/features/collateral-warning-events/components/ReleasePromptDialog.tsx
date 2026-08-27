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

type ReleasePromptDialogProps = {
  open: boolean
  orderNo?: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ReleasePromptDialog({
  open,
  orderNo,
  onOpenChange,
  onConfirm,
}: ReleasePromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircleIcon className="size-5" />
            <DialogTitle>解除预警提示</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-base font-medium text-foreground">
            前往关联的订单业务中解除
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          该预警为商业类规则触发{orderNo ? `（订单：${orderNo}）` : ""}，需前往对应的抵质押/监管订单业务流程中完成人工核销与解除。
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onConfirm}>
            前往订单业务
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
