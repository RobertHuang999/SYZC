import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Loader2 } from "lucide-react"
import type { OwnerType } from "../domain/form-types"

type OwnerVerifyDialogProps = {
  open: boolean
  isNewOwner?: boolean
  ownerType: OwnerType | string
  ownerName: string
  originalOwnerName?: string
  ownerIdentifier: string
  contactPhone?: string
  originalContactPhone?: string
  idCardNo?: string
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onConfirm: () => void
  onSendSmsHint?: (targetPhone: string) => void
  loading?: boolean
}

export function OwnerVerifyDialog({
  open,
  isNewOwner = false,
  ownerType,
  ownerName,
  originalOwnerName,
  ownerIdentifier,
  contactPhone,
  originalContactPhone,
  idCardNo,
  onOpenChange,
  onBack,
  onConfirm,
  onSendSmsHint,
  loading = false,
}: OwnerVerifyDialogProps) {
  const [code, setCode] = useState("")
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [sentNotice, setSentNotice] = useState<string | null>(null)

  const isPersonal = ownerType === "个人货主" || ownerType === "个人"
  const needVerifyCode = Boolean(isNewOwner)

  // 获取接收短信核验的目标手机号
  const targetPhone = isPersonal ? ownerIdentifier : contactPhone || "13800138000"

  // 手机号脱敏
  const maskPhone = (phone?: string) => {
    if (!phone) return "—"
    if (phone.length === 11) {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
    }
    return phone
  }

  // 身份证脱敏
  const maskIdCard = (id?: string) => {
    if (!id) return "—"
    if (id.length >= 18) {
      return id.replace(/(\d{6})\d{8}(\w{4})/, "$1********$2")
    }
    return id
  }

  useEffect(() => {
    if (!open) {
      setCode("")
      setError(null)
      setSentNotice(null)
      setSeconds(0)
      return
    }

    // 仅在新货主且需要验证码时才自动发送并开始倒计时
    if (needVerifyCode) {
      setSeconds(60)
      setSentNotice(`验证码已发送至货主手机 ${maskPhone(targetPhone)}`)
      const timer = window.setInterval(() => {
        setSeconds((value) => (value > 0 ? value - 1 : 0))
      }, 1000)
      return () => window.clearInterval(timer)
    } else {
      setSeconds(0)
      setSentNotice(null)
    }
  }, [open, targetPhone, needVerifyCode])

  const handleSendCode = () => {
    if (seconds > 0 || !needVerifyCode) return
    setSeconds(60)
    setError(null)
    setSentNotice(`验证码已重新发送至 ${maskPhone(targetPhone)}`)
    onSendSmsHint?.(targetPhone)
  }

  const handleConfirm = () => {
    if (needVerifyCode) {
      if (!code.trim()) {
        setError("请输入 6 位短信验证码")
        return
      }
      if (code.trim().length !== 6) {
        setError("验证码为 6 位数字，请重新输入")
        return
      }
    }
    setError(null)
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <DialogTitle>货主信息确认</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {needVerifyCode
              ? "请认真核对新货主实名认证信息与联系方式，并完成短信二元身份校验。"
              : "请认真核对货主档案信息与联系方式，确认无误后进入下一步。"}
          </DialogDescription>
        </DialogHeader>

        {/* 货主信息展示卡片（对齐 store-apply-info.vue owner-info-container） */}
        <div className="space-y-2.5 rounded-lg border bg-muted/20 p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">货主类型：</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {isPersonal ? "个人" : "企业"}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-normal ${
                  needVerifyCode
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}
              >
                {needVerifyCode ? "新登记货主" : "在册货主"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">货主名称：</span>
              <span className="font-medium text-foreground">{ownerName || "—"}</span>
            </div>
            {originalOwnerName && originalOwnerName !== ownerName && !isPersonal && (
              <span className="text-right text-[11px] text-amber-600">
                原名称：{originalOwnerName}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">货主标识：</span>
            <span className="font-medium text-foreground">
              {isPersonal ? maskPhone(ownerIdentifier) : ownerIdentifier || "—"}
            </span>
          </div>

          {isPersonal ? (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">身份证号：</span>
              <span className="text-foreground">
                {maskIdCard(idCardNo)}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">联系电话：</span>
                <span className="text-foreground">
                  {maskPhone(contactPhone)}
                </span>
              </div>
              {originalContactPhone && originalContactPhone !== contactPhone && (
                <span className="text-right text-[11px] text-amber-600">
                  原联系电话：{maskPhone(originalContactPhone)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 仅在【新货主】时展示短信验证码输入区（老货主无需验证码） */}
        {needVerifyCode && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="owner-sms-code" className="text-xs">
                <span className="text-destructive">* </span>短信验证码
              </Label>
              <span className="text-[11px] text-muted-foreground">
                演示默认可填: <code className="font-semibold text-primary">123456</code>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                id="owner-sms-code"
                placeholder="请输入 6 位短信验证码"
                value={code}
                maxLength={6}
                className="tracking-wider"
                onChange={(event) => {
                  setCode(event.target.value)
                  setError(null)
                }}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={seconds > 0}
                className="shrink-0 text-xs"
                onClick={handleSendCode}
              >
                {seconds > 0 ? `${seconds}s后重新获取` : "重新发送"}
              </Button>
            </div>

            {sentNotice && !error && (
              <p className="text-[11px] text-emerald-600">{sentNotice}</p>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}

        {needVerifyCode ? (
          <div className="rounded border border-amber-200 bg-amber-50/60 p-2 text-[11px] text-amber-800">
            注意：该货主为首次入库登记，完成短信核验后将正式建立货主档案。
          </div>
        ) : (
          <div className="rounded border border-emerald-200 bg-emerald-50/60 p-2 text-[11px] text-emerald-800">
            提示：该货主为系统现有在册货主，信息核对无误后可直接确认进入下一步。
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
            返回修改
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            确认并下一步
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
