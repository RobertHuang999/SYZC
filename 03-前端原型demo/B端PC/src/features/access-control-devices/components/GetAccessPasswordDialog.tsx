import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
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
import { createDirectFaceUnlockApply } from "@/features/unlock-applies/lib/create-direct-unlock-apply"
import { addUnlockApply } from "@/features/unlock-applies/lib/unlock-applies-store"
import { MY_APPLY_LIST_PATH } from "@/features/unlock-applies/domain/constants"

type GetAccessPasswordDialogProps = {
  open: boolean
  context: AccessDevicePasswordContext | null
  onOpenChange: (open: boolean) => void
  onDirectSuccess?: (applyNo: string) => void
}

type DialogState = "form" | "success" | "error"

function defaultValidFrom(): string {
  return "2026-08-31T14:00"
}

function defaultValidTo(): string {
  return "2026-08-31T18:00"
}

export function GetAccessPasswordDialog({
  open,
  context,
  onOpenChange,
  onDirectSuccess,
}: GetAccessPasswordDialogProps) {
  const [state, setState] = useState<DialogState>("form")
  const [reason, setReason] = useState("入库")
  const [unlockCount, setUnlockCount] = useState("3")
  const [validFrom, setValidFrom] = useState(defaultValidFrom())
  const [validTo, setValidTo] = useState(defaultValidTo())
  const [remark, setRemark] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createdApplyNo, setCreatedApplyNo] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setState("form")
      setReason("入库")
      setUnlockCount("3")
      setValidFrom(defaultValidFrom())
      setValidTo(defaultValidTo())
      setRemark("")
      setSubmitting(false)
      setErrorMessage(null)
      setCreatedApplyNo(null)
    }
  }, [open])

  if (!context) return null

  const validate = (): string | null => {
    if (!reason) return "请选择事由"
    const count = Number(unlockCount)
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      return "开锁次数须为 1~100 的整数"
    }
    if (validFrom >= validTo) return "有效期结束时间须晚于开始时间"
    const spanMs = new Date(validTo).getTime() - new Date(validFrom).getTime()
    if (spanMs > 24 * 60 * 60 * 1000) {
      return "密码有效期最大不得超过 24 小时"
    }
    if (remark.length > 50) return "备注最多 50 字"
    return null
  }

  const handleSubmit = () => {
    const err = validate()
    if (err) {
      setErrorMessage(err)
      return
    }
    setErrorMessage(null)
    setSubmitting(true)
    window.setTimeout(() => {
      const record = createDirectFaceUnlockApply({
        context,
        reason,
        remark: remark || undefined,
        unlockCount: Number(unlockCount),
        validFrom,
        validTo,
      })
      addUnlockApply(record)
      setCreatedApplyNo(record.applyNo)
      onDirectSuccess?.(record.applyNo)
      setSubmitting(false)
      setState("success")
    }, 600)
  }

  const detailHref = createdApplyNo
    ? `${MY_APPLY_LIST_PATH}?tab=unlock-applies&applyNo=${createdApplyNo}`
    : `${MY_APPLY_LIST_PATH}?tab=unlock-applies`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        {state === "success" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-green-600" />
                密码已生成
              </DialogTitle>
              <DialogDescription className="pt-2 leading-relaxed">
                密码已生成（人脸门禁不下发短信）。请前往
                <span className="font-medium text-foreground">【我的申请记录】</span>
                的
                <span className="font-medium text-foreground">开锁申请</span>
                查看密码。
              </DialogDescription>
            </DialogHeader>
            {createdApplyNo && (
              <p className="text-xs text-muted-foreground">申请单号：{createdApplyNo}</p>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                关闭
              </Button>
              <Link
                to={detailHref}
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                前往查看
              </Link>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>获取门禁密码</DialogTitle>
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
                <Select value={reason} onValueChange={(v) => setReason(v ?? "入库")}>
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
                <Label>
                  <span className="text-destructive mr-1">*</span>
                  开锁次数
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      setUnlockCount(String(Math.max(1, Number(unlockCount) - 1)))
                    }
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={unlockCount}
                    onChange={(e) => setUnlockCount(e.target.value)}
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      setUnlockCount(String(Math.min(100, Number(unlockCount) + 1)))
                    }
                  >
                    +
                  </Button>
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
              最长有效期 24 小时；超过有效期凭证自动失效；请在【我的申请记录】查看密码
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
