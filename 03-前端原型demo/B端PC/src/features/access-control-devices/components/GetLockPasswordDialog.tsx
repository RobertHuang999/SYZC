import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
}

type DialogState = "form" | "success"

function defaultValidFrom(): string {
  return "2026-08-31T14:00"
}

function defaultValidTo(): string {
  return "2026-08-31T18:00"
}

function validateValidity(validFrom: string, validTo: string): string | null {
  if (validFrom >= validTo) return "有效期结束时间须晚于开始时间"
  const spanMs = new Date(validTo).getTime() - new Date(validFrom).getTime()
  if (spanMs > 24 * 60 * 60 * 1000) {
    return "密码有效期最大不得超过 24 小时"
  }
  return null
}

export function GetLockPasswordDialog({
  open,
  context,
  onOpenChange,
}: GetLockPasswordDialogProps) {
  const navigate = useNavigate()
  const [state, setState] = useState<DialogState>("form")
  const [reason, setReason] = useState("出库")
  const [validFrom, setValidFrom] = useState(defaultValidFrom())
  const [validTo, setValidTo] = useState(defaultValidTo())
  const [remark, setRemark] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createdApplyNo, setCreatedApplyNo] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setState("form")
      setReason("出库")
      setValidFrom(defaultValidFrom())
      setValidTo(defaultValidTo())
      setRemark("")
      setSubmitting(false)
      setErrorMessage(null)
      setCreatedApplyNo(null)
    }
  }, [open])

  if (!context) return null

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleSubmit = () => {
    if (!reason) {
      setErrorMessage("请选择事由")
      return
    }
    const validityError = validateValidity(validFrom, validTo)
    if (validityError) {
      setErrorMessage(validityError)
      return
    }
    if (remark.length > 50) {
      setErrorMessage("备注最多 50 字")
      return
    }
    setErrorMessage(null)
    setSubmitting(true)
    window.setTimeout(() => {
      const record = createDirectLockUnlockApply({
        context,
        reason,
        remark: remark || undefined,
        validFrom,
        validTo,
      })
      addUnlockApply(record)
      setCreatedApplyNo(record.applyNo)
      setSubmitting(false)
      setState("success")
    }, 600)
  }

  const detailHref = createdApplyNo
    ? `${MY_APPLY_LIST_PATH}?tab=unlock-applies&applyNo=${createdApplyNo}`
    : `${MY_APPLY_LIST_PATH}?tab=unlock-applies`

  const handleViewDetail = () => {
    if (!createdApplyNo) return
    navigate(detailHref)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        {state === "success" && createdApplyNo ? (
          <>
            <DialogHeader>
              <DialogTitle>开锁凭证已生成</DialogTitle>
              <DialogDescription>
                临时密码已短信发送至绑定手机号，请点击下方按钮查看详情。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">申请单号</span>
                <span className="font-mono font-medium">{createdApplyNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">申请状态</span>
                <span>已通过</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">凭证状态</span>
                <span>已下发</span>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button onClick={handleViewDetail}>查看申请详情</Button>
              <Button variant="outline" onClick={handleClose}>
                返回设备列表
              </Button>
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
                <Label>
                  <span className="text-destructive mr-1">*</span>
                  有效期
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="datetime-local"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                  />
                  <span className="text-muted-foreground">至</span>
                  <Input
                    type="datetime-local"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                  />
                </div>
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
              提交后可在【我的申请记录】查看密码；短信将发送至绑定手机号；最长有效期 24 小时
            </p>
            {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button disabled={submitting} onClick={handleSubmit}>
                {submitting ? "提交中…" : "获取密码"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
