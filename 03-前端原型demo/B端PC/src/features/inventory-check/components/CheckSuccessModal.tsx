import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface CheckSuccessModalProps {
  open: boolean
  taskName: string
  modeLabel: string
  canExecuteCheck: boolean // 当前登录人是否在计划盘点人员名单内
  onOpenChange: (open: boolean) => void
  onGoToList: () => void
  onGoToCheck: () => void
}

export function CheckSuccessModal({
  open,
  taskName,
  modeLabel,
  canExecuteCheck,
  onOpenChange,
  onGoToList,
  onGoToCheck,
}: CheckSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <DialogTitle className="text-center text-base font-semibold text-slate-900 dark:text-slate-100">
            创建成功
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-slate-500 leading-relaxed">
            已成功创建 <span className="font-medium text-amber-700 dark:text-amber-400">【{modeLabel}】</span>
            <br />
            <span className="font-medium text-slate-800 dark:text-slate-200">{taskName}</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5 flex flex-row items-center justify-center gap-3 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onGoToList}
            className="h-9 px-4 text-xs font-normal"
          >
            返回盘点单列表
          </Button>

          {canExecuteCheck && (
            <Button
              type="button"
              onClick={onGoToCheck}
              className="h-9 px-4 text-xs font-medium"
            >
              去盘点 (录入数据)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

