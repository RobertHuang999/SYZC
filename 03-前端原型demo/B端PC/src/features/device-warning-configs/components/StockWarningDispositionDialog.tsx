import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIterationHighlight } from "@/shared/components/IterationHighlight"

export type StockDispositionChoice = "CONVERT_MANUAL" | "INVALIDATE_STOCK" | "KEEP_AS_IS"

export interface StockWarningDispositionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingCount?: number
  ruleName?: string
  devicesCount?: number
  onConfirm: (choice: StockDispositionChoice) => void
}

export function StockWarningDispositionDialog({
  open,
  onOpenChange,
  pendingCount = 3,
  ruleName = "温湿度监控预警规则",
  devicesCount = 2,
  onConfirm,
}: StockWarningDispositionDialogProps) {
  const { highlightEnabled } = useIterationHighlight()
  const [choice, setChoice] = useState<StockDispositionChoice>("CONVERT_MANUAL")

  const handleConfirm = () => {
    onConfirm(choice)
    onOpenChange(false)
  }

  const options: Array<{
    value: StockDispositionChoice
    title: string
    hint?: string
    desc: string
  }> = [
      {
        value: "CONVERT_MANUAL",
        title: "转为人工核查解除",
        hint: "（系统推荐）",
        desc: "把存量预警改为人工核查解除，并在设备预警信息台账开放人工核验解除入口，避免自动恢复失效后一直挂在那里。",
      },
      {
        value: "INVALIDATE_STOCK",
        title: "存量预警直接作废",
        desc: "将存量预警直接标记为已作废，作废原因记录为“规则配置修改批量作废”，停止升级计时，历史流水归档留痕。",
      },
      {
        value: "KEEP_AS_IS",
        title: "保持原样不处理",
        desc: "存量预警保留原有配置快照与处置策略，仅后续新触发的预警按新规则执行（注意：若阈值/条件调整，可能无法自动结案）。",
      },
    ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-[640px] shadow-lg",
          highlightEnabled && "border-2 border-amber-500/80"
        )}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-base font-semibold">存量预警处置方式确认</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground pt-0.5">
            检测到当前规则【{ruleName}】修改了处置策略或判定阈值，该规则关联的 {devicesCount} 台设备下共有{" "}
            <span className="font-semibold text-rose-600 dark:text-rose-400">{pendingCount} 条待处置</span>{" "}
            有效预警。为避免自动结案失效导致卡死，请选择存量预警的处置方式：
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {options.map((opt) => {
            const isSelected = choice === opt.value
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:bg-muted/40"
                )}
              >
                <input
                  type="radio"
                  name="stockDispositionChoice"
                  className="mt-1 size-4 accent-primary cursor-pointer"
                  checked={isSelected}
                  onChange={() => setChoice(opt.value)}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">
                      {opt.title}
                    </span>
                    {opt.hint && (
                      <span className="text-xs text-muted-foreground">{opt.hint}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </label>
            )
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确认保存并生效
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}