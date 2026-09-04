import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ShieldAlert } from "lucide-react"
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
import { MY_APPLY_LIST_PATH, REASON_OPTIONS } from "../domain/constants"

export type UnlockApplySubmitContext = {
  deviceName: string
  deviceCode: string
  deviceType: "挂锁门禁" | "人脸门禁"
  warehouseName: string
  locationDetail: string
}

type UnlockApplySubmitDialogProps = {
  open: boolean
  context: UnlockApplySubmitContext | null
  onOpenChange: (open: boolean) => void
  onSubmitSuccess?: (applyNo: string) => void
}

type SubmitResult = {
  applyNo: string
} | null

function defaultValidFrom(): string {
  return "2026-08-28T14:00"
}

function defaultValidTo(): string {
  return "2026-08-28T18:00"
}

function validateValidity(validFrom: string, validTo: string): string | null {
  if (validFrom >= validTo) return "有效期结束时间须晚于开始时间"
  const spanMs = new Date(validTo).getTime() - new Date(validFrom).getTime()
  if (spanMs > 24 * 60 * 60 * 1000) {
    return "密码有效期最大不得超过 24 小时"
  }
  return null
}

export function UnlockApplySubmitDialog({
  open,
  context,
  onOpenChange,
  onSubmitSuccess,
}: UnlockApplySubmitDialogProps) {
  const [reason, setReason] = useState("出库")
  const [remark, setRemark] = useState("")
  const [unlockCount, setUnlockCount] = useState("1")
  const [validFrom, setValidFrom] = useState(defaultValidFrom())
  const [validTo, setValidTo] = useState(defaultValidTo())
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason("出库")
      setRemark("")
      setUnlockCount("1")
      setValidFrom(defaultValidFrom())
      setValidTo(defaultValidTo())
      setSubmitting(false)
      setResult(null)
      setError(null)
    }
  }, [open])

  const isLockDevice = context?.deviceType === "挂锁门禁"
  const isFaceDevice = context?.deviceType === "人脸门禁"

  const handleSubmit = () => {
    const validityError = validateValidity(validFrom, validTo)
    if (validityError) {
      setError(validityError)
      return
    }
    if (isFaceDevice) {
      const count = Number(unlockCount)
      if (!Number.isInteger(count) || count < 1 || count > 100) {
        setError("开锁次数须为 1~100 的整数")
        return
      }
    }
    if (remark.length > 50) {
      setError("备注最多 50 字")
      return
    }
    setError(null)
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      const applyNo = "UA20260828001"
      setResult({ applyNo })
      onSubmitSuccess?.(applyNo)
    }, 600)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  if (!context) return null

  const successHint = isLockDevice
    ? "请等待审批，审批通过后将短信下发临时密码"
    : "请等待审批，审批通过后可在详情页查看临时密码"
  const submitHint = isLockDevice
    ? "提交后将创建开锁申请，审批通过后短信下发临时密码"
    : "提交后将创建开锁申请，审批通过后在详情页查看临时密码（人脸门禁不下发短信）"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        {result ? (
          <>
            <DialogHeader>
              <DialogTitle>开锁申请已提交</DialogTitle>
              <DialogDescription>{successHint}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">申请单号</span>
                <span className="font-mono font-medium">{result.applyNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">申请状态</span>
                <span>待审批</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">凭证状态</span>
                <span>未生成</span>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Link
                to={`${MY_APPLY_LIST_PATH}?tab=unlock-applies&applyNo=${result.applyNo}`}
              >
                <Button onClick={handleClose}>查看申请详情</Button>
              </Link>
              <Button variant="outline" onClick={handleClose}>
                返回设备列表
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>发起开锁申请</DialogTitle>
            </DialogHeader>

            <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              <span>您正在申请临时开锁授权</span>
            </div>

            <p className="text-sm text-muted-foreground">
              {context.deviceName}（{context.deviceCode}）· {context.warehouseName} ·{" "}
              {context.locationDetail}
            </p>

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
                    {REASON_OPTIONS.filter((o) => o !== "全部").map((option) => (
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

              {isFaceDevice && (
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
              )}

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
              最长有效期 24 小时；超过有效期凭证自动失效
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">{submitHint}</p>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button disabled={submitting} onClick={handleSubmit}>
                {submitting ? "提交中…" : "提交申请"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
