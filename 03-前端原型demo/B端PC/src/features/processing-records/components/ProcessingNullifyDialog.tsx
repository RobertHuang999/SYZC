import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ProcessingRecord } from "../domain/types"

interface ProcessingNullifyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: ProcessingRecord | null
  onSuccess: (updatedRecord: ProcessingRecord) => void
}

export function ProcessingNullifyDialog({
  open,
  onOpenChange,
  record,
  onSuccess,
}: ProcessingNullifyDialogProps) {
  const [voidReason, setVoidReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setVoidReason("")
      setError(null)
    }
  }, [open])

  const handleConfirm = () => {
    if (!record) return

    if (!voidReason.trim()) {
      setError("请填写作废原因（最多 500 字，必填项）。")
      return
    }

    // 释放计划投入锁定库存，将作废信息写入 modifyRecord (R14)
    const updatedInputs = record.inputGoodsGroups.map((group) => ({
      ...group,
      details: group.details.map((d) => ({
        ...d,
        actualAmount: 0,
        releasedAmount: d.lockedAmount ?? d.planAmount,
      })),
    }))

    const updatedRecord: ProcessingRecord = {
      ...record,
      status: "VOIDED",
      version: record.version + 1,
      inputGoodsGroups: updatedInputs,
      modifyRecord: {
        type: "VOIDED",
        operatorName: "仓库主管-刘建军",
        operatorOrg: "森云智能仓储监管部",
        operateTime: new Date().toISOString().replace("T", " ").slice(0, 19),
        voidReason: voidReason.trim(),
      },
    }

    onSuccess(updatedRecord)
    onOpenChange(false)
  }

  if (!record) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-foreground">
            作废确认
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            加工单号：{record.id}
          </DialogDescription>
        </DialogHeader>

        {/* 黄色警示条 */}
        <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>作废后将全额释放原投入货物的全部锁定库存，请如实填写作废原因。</span>
        </div>

        {error && (
          <div className="text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-foreground font-medium">
            <span><span className="text-rose-500 mr-0.5">*</span>作废原因说明</span>
            <span className="text-[11px] text-muted-foreground">{voidReason.length}/500</span>
          </div>
          <Textarea
            value={voidReason}
            maxLength={500}
            rows={4}
            placeholder="请详细说明单据作废原因（必填，上限 500 字）"
            className="text-xs"
            onChange={(e) => {
              setVoidReason(e.target.value)
              if (error) setError(null)
            }}
          />
        </div>

        <DialogFooter className="mt-4 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleConfirm}
          >
            确定作废
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

