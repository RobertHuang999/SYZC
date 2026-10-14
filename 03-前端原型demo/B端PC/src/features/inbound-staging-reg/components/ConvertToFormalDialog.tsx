import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { InboundStagingReg } from "../domain/types"
import { resolveConvertTarget } from "../lib/convert-routing"

type Props = {
  open: boolean
  reg: InboundStagingReg | null
  onClose: () => void
  onConfirmPc: (path: string) => void
  onMobileOnly: (h5Path: string) => void
}

export function ConvertToFormalDialog({
  open,
  reg,
  onClose,
  onConfirmPc,
  onMobileOnly,
}: Props) {
  if (!reg) return null

  const target = resolveConvertTarget(reg.inboundType, "pc", reg.regNo)

  const handleConfirm = () => {
    if (target.kind === "mobile_only") {
      onMobileOnly(target.h5Path)
      return
    }
    if (target.kind === "pc") {
      onConfirmPc(target.path)
    }
  }

  const primaryLabel =
    target.kind === "mobile_only" ? "我知道了，请在手机操作" : "确认并前往正式页"

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>转为正式入库确认</DialogTitle>
          <DialogDescription>
            登记单 {reg.regNo} · {reg.inboundType}
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>快照将预填至正式制单页；提交成功后本单回写【已转正式】。</li>
          <li>须补齐档案货主（R03）、库位清零（R13）、至少 1 张现场照片（R16）。</li>
          {target.kind === "mobile_only" ? (
            <li className="font-medium text-amber-700">
              仓单入库请在手机端打开「业务办理 → 入库发起」完成转正，PC 不提供仓单正式制单页。
            </li>
          ) : null}
        </ul>
        {target.kind === "mobile_only" ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            手机链接（Mock）：{target.h5Path}
          </p>
        ) : null}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="button" onClick={handleConfirm}>
            {primaryLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
