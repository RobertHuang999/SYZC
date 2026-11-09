import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldCheck, Smartphone } from "lucide-react"

interface TransferOwnerVerifyDialogProps {
  open: boolean
  ownerName: string
  ownerIdentity: string
  onClose: () => void
  onVerified: () => void
}

export function TransferOwnerVerifyDialog({
  open,
  ownerName,
  ownerIdentity,
  onClose,
  onVerified,
}: TransferOwnerVerifyDialogProps) {
  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [isCounting, setIsCounting] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setCode("")
      setErrorMsg(null)
      setCountdown(60)
      setIsCounting(true)
      return
    }

    let timer: any = null
    if (isCounting && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setIsCounting(false)
    }

    return () => clearInterval(timer)
  }, [open, isCounting, countdown])

  const handleResend = () => {
    setCountdown(60)
    setIsCounting(true)
    setErrorMsg(null)
  }

  const handleConfirm = () => {
    if (!code || code.length < 4) {
      setErrorMsg("请输入合法的 6 位短信验证码")
      return
    }
    // 验证通过，触发建档闭环
    onVerified()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-6 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            货主信息确认 (新受让人二元短信核验)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="rounded-md bg-amber-50 p-3 text-amber-800 border border-amber-200">
            系统检测到接收方为<strong>系统未建档新客户</strong>，已向其预留手机号发送 6 位动态验证码，请当面或电话核实受让人受让真实意愿 (R03)。
          </div>

          <div className="space-y-2 rounded-lg bg-slate-50 p-3 text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">接收方姓名:</span>
              <span className="font-semibold text-slate-900">{ownerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">接收方手机/标识:</span>
              <span className="font-medium text-slate-900">{ownerIdentity}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">
              短信验证码 (6位)：
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                maxLength={6}
                placeholder="请输入短信验证码 (测试可输 888888)"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setErrorMsg(null)
                }}
                className="h-9 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                disabled={isCounting}
                onClick={handleResend}
                className="h-9 text-xs shrink-0 px-3"
              >
                {isCounting ? `${countdown}s 后重新发送` : "重新发送"}
              </Button>
            </div>
            {errorMsg && <p className="text-rose-600 text-[11px]">{errorMsg}</p>}
          </div>
        </div>

        <DialogFooter className="border-t pt-3 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            取消
          </Button>
          <Button size="sm" onClick={handleConfirm} className="h-8 text-xs font-medium">
            核验通过并提交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

