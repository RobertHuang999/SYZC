import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { REASON_OPTIONS } from "../domain/constants"
import type { AccessDevicePasswordContext } from "../domain/types"
import { createDirectLockUnlockApply } from "@/features/unlock-applies/lib/create-direct-unlock-apply"
import { addUnlockApply } from "@/features/unlock-applies/lib/unlock-applies-store"
import { MY_APPLY_LIST_PATH } from "@/features/unlock-applies/domain/constants"

type GetLockPasswordDialogProps = {
  open: boolean
  context: AccessDevicePasswordContext | null
  onOpenChange: (open: boolean) => void
  onDirectSuccess?: (applyNo: string) => void
}

type DialogState = "form" | "success" | "error"

export function GetLockPasswordDialog({
  open,
  context,
  onOpenChange,
  onDirectSuccess,
}: GetLockPasswordDialogProps) {
  const [state, setState] = useState<DialogState>("form")
  const [reason, setReason] = useState("出库")
  const [remark, setRemark] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createdApplyNo, setCreatedApplyNo] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setState("form")
      setReason("出库")
      setRemark("")
      setSubmitting(false)
      setShowPassword(false)
      setErrorMessage(null)
      setCreatedApplyNo(null)
    }
  }, [open])

  if (!context) return null

  const handleSubmit = () => {
    if (!reason) {
      setErrorMessage("请选择事由")
      return
    }
    setErrorMessage(null)
    setSubmitting(true)
    window.setTimeout(() => {
      const record = createDirectLockUnlockApply({ context, reason, remark: remark || undefined })
      addUnlockApply(record)
      setCreatedApplyNo(record.applyNo)
      onDirectSuccess?.(record.applyNo)
      setSubmitting(false)
      setState("success")
    }, 600)
  }

  const maskedPassword = "****5678"
  const plainPassword = "856778"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        {state === "success" ? (
          <>
            <DialogHeader>
              <DialogTitle>密码已生成并发送短信</DialogTitle>
              <DialogDescription>
                密码已发送至您绑定的手机号，有效期 3 天
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-sm">
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
                <span className="font-mono text-lg tracking-widest">
                  {showPassword ? plainPassword : maskedPassword}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">密码有效期</span>
                <span>2026-08-31 09:15 ~ 2026-09-03 09:15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">短信发送结果</span>
                <span className="text-green-600">发送成功</span>
              </div>
              {createdApplyNo && (
                <p className="text-xs text-muted-foreground">
                  已写入我的开锁申请（无需审核）· {createdApplyNo}
                </p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              {createdApplyNo && (
                <Link
                  to={`${MY_APPLY_LIST_PATH}/unlock-applies/${createdApplyNo}`}
                  onClick={() => onOpenChange(false)}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
                >
                  查看记录
                </Link>
              )}
              <Button onClick={() => onOpenChange(false)}>关闭</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>获取门锁密码</DialogTitle>
              <DialogDescription>
                {context.deviceName}（{context.deviceCode}）· {context.warehouseName} ·{" "}
                {context.locationDetail}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  <span className="text-destructive mr-1">*</span>
                  事由
                </Label>
                <Select value={reason} onValueChange={(v) => setReason(v ?? "出库")}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REASON_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>备注</Label>
                <textarea
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  maxLength={50}
                  placeholder="选填，补充说明"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {remark.length}/50
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              密码将发送至您绑定的手机号，有效期 3 天
            </p>
            {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button disabled={submitting} onClick={handleSubmit}>
                {submitting ? "获取中…" : "获取密码"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
