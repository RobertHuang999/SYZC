import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, ShieldCheck, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { UnlockApply } from "../domain/types"
import { formatApplicant } from "../lib/detail-utils"

export type UnlockApprovalDecision = "同意" | "驳回"

type UnlockApplyApprovalDialogProps = {
  open: boolean
  apply: UnlockApply | null
  onOpenChange: (open: boolean) => void
  onApprove: (apply: UnlockApply, opinion: string) => void
  onReject: (apply: UnlockApply, reason: string) => void
  onSubmit?: (apply: UnlockApply, decision: UnlockApprovalDecision, opinion: string) => void
}

export function UnlockApplyApprovalDialog({
  open,
  apply,
  onOpenChange,
  onApprove,
  onReject,
  onSubmit,
}: UnlockApplyApprovalDialogProps) {
  const [decision, setDecision] = useState<UnlockApprovalDecision>("同意")
  const [opinion, setOpinion] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!open) return
    setDecision("同意")
    setOpinion("")
    setErrorMessage("")
  }, [apply?.applyNo, open])

  if (!apply) return null

  const handleSubmit = () => {
    const trimmed = opinion.trim()
    if (decision === "驳回" && !trimmed) {
      setErrorMessage("驳回必须填写审批理由")
      return
    }

    setErrorMessage("")

    if (onSubmit) {
      onSubmit(apply, decision, trimmed)
    } else if (decision === "同意") {
      onApprove(apply, trimmed)
    } else {
      onReject(apply, trimmed)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </div>
            <DialogTitle>开锁审批处理</DialogTitle>
          </div>
          <DialogDescription>
            {apply.applyNo} · {apply.deviceName} · {formatApplicant(apply)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* 单选条件「同意、驳回」 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                审批决定 <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground">请选择审批结论</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* 同意选项 */}
              <button
                type="button"
                onClick={() => {
                  setDecision("同意")
                  if (errorMessage) setErrorMessage("")
                }}
                className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  decision === "同意"
                    ? "border-emerald-500 bg-emerald-50/70 text-emerald-950 shadow-xs ring-1 ring-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-300"
                    : "border-border bg-card hover:bg-muted/50 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2
                      className={`size-4 ${
                        decision === "同意" ? "text-emerald-600 fill-emerald-100 dark:fill-emerald-950" : "text-muted-foreground"
                      }`}
                    />
                    同意
                  </div>
                  <span
                    className={`size-3.5 rounded-full border flex items-center justify-center ${
                      decision === "同意" ? "border-emerald-600 bg-emerald-600" : "border-muted-foreground/40 bg-background"
                    }`}
                  >
                    {decision === "同意" && <span className="size-1.5 rounded-full bg-white" />}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                  审批通过并自动生成有效开锁凭证
                </p>
              </button>

              {/* 驳回选项 */}
              <button
                type="button"
                onClick={() => {
                  setDecision("驳回")
                }}
                className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  decision === "驳回"
                    ? "border-rose-500 bg-rose-50/70 text-rose-950 shadow-xs ring-1 ring-rose-500/30 dark:bg-rose-950/20 dark:text-rose-300"
                    : "border-border bg-card hover:bg-muted/50 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700 dark:text-rose-400">
                    <XCircle
                      className={`size-4 ${
                        decision === "驳回" ? "text-rose-600 fill-rose-100 dark:fill-rose-950" : "text-muted-foreground"
                      }`}
                    />
                    驳回
                  </div>
                  <span
                    className={`size-3.5 rounded-full border flex items-center justify-center ${
                      decision === "驳回" ? "border-rose-600 bg-rose-600" : "border-muted-foreground/40 bg-background"
                    }`}
                  >
                    {decision === "驳回" && <span className="size-1.5 rounded-full bg-white" />}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                  不予通过，终止申请并记录驳回理由
                </p>
              </button>
            </div>
          </div>

          {/* 审批理由 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="pc-approval-opinion" className="font-semibold text-foreground flex items-center gap-1">
                审批理由
                {decision === "驳回" ? (
                  <span className="text-destructive font-semibold text-[11px]">* 必填</span>
                ) : (
                  <span className="text-muted-foreground font-normal text-[11px]">（选填）</span>
                )}
              </Label>
              <span className="text-[11px] text-muted-foreground">{opinion.length}/200</span>
            </div>

            <Textarea
              id="pc-approval-opinion"
              className={`min-h-[96px] text-xs resize-none ${
                errorMessage ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
              placeholder={
                decision === "驳回"
                  ? "请详细填写驳回具体原因（必填，最多 200 字）"
                  : "审批通过时可填写补充说明或意见（选填，最多 200 字）"
              }
              maxLength={200}
              value={opinion}
              onChange={(event) => {
                setOpinion(event.target.value)
                if (errorMessage) setErrorMessage("")
              }}
            />

            {errorMessage && (
              <p className="flex items-center gap-1 text-xs text-destructive font-medium">
                <AlertCircle className="size-3.5 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
