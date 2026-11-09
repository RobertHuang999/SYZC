import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface RevokeConfirmDialogProps {
  open: boolean
  checkNo: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function RevokeConfirmDialog({
  open,
  checkNo,
  onOpenChange,
  onConfirm,
}: RevokeConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-base font-semibold text-slate-900 dark:text-slate-100">
            确定要撤销盘点单？
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-slate-500 leading-relaxed">
            您正在撤销盘点单 <span className="font-medium text-slate-800 dark:text-slate-200">{checkNo}</span>。
            <br />
            撤销后该盘点任务将立即终止并归档为【已撤销】状态，无法恢复。
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-row items-center justify-center gap-3 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-24 h-9 text-xs"
          >
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="w-24 h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white"
          >
            确 定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

