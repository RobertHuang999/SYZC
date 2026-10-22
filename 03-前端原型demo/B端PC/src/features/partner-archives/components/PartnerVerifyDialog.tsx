import { useEffect, useState } from "react"
import { ShieldCheckIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ROLE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
  type RoleType,
  type SubjectType,
} from "../domain/types"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { partnerVerifyDialogCopy } from "../lib/partner-archive-ui-labels"
import { maskLoginPhone } from "../lib/detail-utils"

export type PartnerVerifyDialogProps = {
  open: boolean
  subjectType: SubjectType
  name: string
  idNumber: string
  contactPhone: string
  fullAddress: string
  roles?: RoleType[]
  mode?: "CREATE" | "CHANGE_PHONE" | "VERIFY_CONTACT"
  /** 场景 3 子场景：新增建档 / 列表或详情补验 / 入库 R03·PA-R04b */
  verifyContext?: "CREATE_ARCHIVE" | "DETAIL_VERIFY" | "INBOUND_CREATE" | "INBOUND_SUBMIT"
  agentName?: string
  oldPhone?: string
  cancelLabel?: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

const DEFAULT_MOCK_CODE = "888888"

function maskIdNumber(idNumber: string): string {
  if (idNumber.length !== 18) return idNumber
  return `${idNumber.slice(0, 6)}********${idNumber.slice(-4)}`
}

export function PartnerVerifyDialog({
  open,
  subjectType,
  name,
  idNumber,
  contactPhone,
  fullAddress,
  roles = [],
  mode = "CREATE",
  verifyContext = "CREATE_ARCHIVE",
  agentName,
  oldPhone,
  cancelLabel = "返回修改",
  onOpenChange,
  onConfirm,
}: PartnerVerifyDialogProps) {
  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  // 弹窗打开时重置倒计时和验证码
  useEffect(() => {
    if (open) {
      setCode("")
      setCodeError(null)
      setCountdown(60)
    }
  }, [open])

  // 倒计时计时器
  useEffect(() => {
    if (!open || countdown <= 0) return
    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [open, countdown])

  const handleResend = () => {
    if (countdown > 0) return
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setCountdown(60)
      setCodeError(null)
    }, 400)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setCodeError("请输入短信验证码")
      return
    }
    // 允许演示码 888888 或任意 6 位数字验证码
    if (code.trim().length !== 6 || !/^\d{6}$/.test(code.trim())) {
      setCodeError("请输入 6 位纯数字验证码")
      return
    }
    setCodeError(null)
    onConfirm()
  }

  const maskedPhone = maskLoginPhone(contactPhone)
  const maskedId = maskIdNumber(idNumber)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheckIcon className="size-4" />
            </div>
            <DialogTitle>
              {mode === "CHANGE_PHONE"
                ? "修改联系手机身份确认"
                : verifyContext === "INBOUND_CREATE" || verifyContext === "INBOUND_SUBMIT"
                  ? "货主身份信息确认"
                  : mode === "VERIFY_CONTACT"
                    ? "验证联系手机"
                    : "合作方身份信息确认"}
            </DialogTitle>
          </div>
          {(() => {
            const copy = partnerVerifyDialogCopy(mode, verifyContext)
            return (
              <>
                <DialogDescription>{copy.user}</DialogDescription>
                {copy.spec ? <PrototypeSpecCallout>{copy.spec}</PrototypeSpecCallout> : null}
              </>
            )
          })()}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 核心四要素核对卡片 */}
          <div className="rounded-lg border bg-muted/30 p-3.5 text-xs space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">主体类型：</span>
                <span className="font-medium text-foreground ml-1">
                  {SUBJECT_TYPE_LABELS[subjectType]}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">主体名称：</span>
                <span className="font-medium text-foreground ml-1">{name}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">
                  {subjectType === "INDIVIDUAL" ? "身份证号：" : "统一信用代码："}
                </span>
                <span className="font-medium text-foreground ml-1">{maskedId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {mode === "CHANGE_PHONE"
                    ? subjectType === "INDIVIDUAL"
                      ? "新手机号："
                      : "新联系电话："
                    : subjectType === "INDIVIDUAL"
                      ? "业务手机："
                      : "经办人手机："}
                </span>
                <span className="font-medium text-foreground ml-1">{maskedPhone}</span>
                {mode === "CHANGE_PHONE" && oldPhone && (
                  <span className="text-[11px] text-muted-foreground ml-1.5">
                    (原: {maskLoginPhone(oldPhone)})
                  </span>
                )}
              </div>
            </div>

            {subjectType === "ENTERPRISE" &&
              agentName &&
              (mode === "VERIFY_CONTACT" || mode === "CREATE") && (
              <div>
                <span className="text-muted-foreground">经办人姓名：</span>
                <span className="font-medium text-foreground ml-1">{agentName}</span>
              </div>
            )}

            {fullAddress.trim() && (
              <div>
                <span className="text-muted-foreground">证件登记地址：</span>
                <span className="font-medium text-foreground ml-1 leading-relaxed">
                  {fullAddress}
                </span>
              </div>
            )}

            {(mode === "CREATE" || mode === "VERIFY_CONTACT") && roles.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1 border-t">
                <span className="text-muted-foreground">业务角色：</span>
                <div className="flex flex-wrap gap-1">
                  {roles.map((r) => (
                    <Badge key={r} variant="outline" className="text-[10px] py-0 px-1.5">
                      {ROLE_TYPE_LABELS[r]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 动态验证码输入行 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="partner-verify-code">
                <span className="text-destructive font-bold mr-1">*</span>
                短信验证码
              </Label>
              <span className="text-muted-foreground">
                验证码已发送至 <span className="text-foreground">{maskedPhone}</span>
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="partner-verify-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={`请输入 6 位短信验证码（演示码：${DEFAULT_MOCK_CODE}）`}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""))
                    setCodeError(null)
                  }}
                  className="tracking-widest text-base"
                  autoFocus
                />
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={countdown > 0 || sending}
                onClick={handleResend}
                className="w-28 text-xs shrink-0"
              >
                {countdown > 0 ? `${countdown}s 后重新获取` : "重新获取"}
              </Button>
            </div>

            {codeError && (
              <p className="text-xs text-destructive">{codeError}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button type="submit">
              {mode === "CHANGE_PHONE"
                ? "确认修改并生效"
                : mode === "VERIFY_CONTACT"
                  ? verifyContext === "INBOUND_SUBMIT"
                    ? "确认并继续提交"
                    : verifyContext === "DETAIL_VERIFY"
                      ? "确认验证"
                      : "确认验证并建档"
                  : verifyContext === "INBOUND_CREATE"
                    ? "确认并下一步"
                    : "确认建档并生效"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
