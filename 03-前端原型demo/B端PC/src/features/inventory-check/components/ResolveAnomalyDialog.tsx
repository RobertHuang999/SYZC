import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"

interface ResolveAnomalyDialogProps {
  open: boolean
  goodsName: string
  onOpenChange: (open: boolean) => void
  onConfirm: (remark: string) => void
}

export function ResolveAnomalyDialog({
  open,
  goodsName,
  onOpenChange,
  onConfirm,
}: ResolveAnomalyDialogProps) {
  const [remark, setRemark] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = () => {
    const trimmed = remark.trim()
    if (!trimmed) {
      setErrorMsg("请填写处理说明（1~200字）")
      return
    }
    if (trimmed.length > 200) {
      setErrorMsg("处理说明不能超过200字")
      return
    }

    onConfirm(trimmed)
    setRemark("")
    setErrorMsg("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="p-1 rounded bg-amber-50 text-amber-600">
              <AlertCircle className="h-4 w-4" />
            </span>
            解除盘点异常
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            针对货品：<span className="font-medium text-slate-800 dark:text-slate-200">{goodsName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="text-rose-500 mr-1">*</span>处理说明
            </label>
            <span
              className={`text-xs ${
                remark.length > 200 ? "text-rose-500 font-semibold" : "text-slate-400"
              }`}
            >
              {remark.length}/200
            </span>
          </div>

          <Textarea
            placeholder="请详细描述消除或解释现场异常的具体业务原因与处理依据（1~200字）"
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value)
              if (errorMsg) setErrorMsg("")
            }}
            rows={4}
            className={`text-xs resize-none ${errorMsg ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
          />

          {errorMsg && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errorMsg}
            </p>
          )}

          <p className="text-[11px] text-slate-400 leading-normal">
            注：解除异常将原子写入历史审计记录，并固化操作人与时间戳，不可篡改。
          </p>
        </div>

        <DialogFooter className="mt-2 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs px-4"
          >
            取消
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            className="h-8 text-xs px-4"
          >
            确认解除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

