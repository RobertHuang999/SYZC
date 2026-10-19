import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import type { InboundStagingReg } from "../domain/types"
import { resolveConvertTarget } from "../lib/convert-routing"
import {
  STAGING_O03_PC_CD_HINT_USER,
  STAGING_O03_REMINDERS_SPEC,
  STAGING_O03_REMINDERS_USER,
} from "@prototype/shared/inbound/staging-ui-labels"

type Props = {
  open: boolean
  reg: InboundStagingReg | null
  onClose: () => void
  onConfirmPc: (path: string) => void
  onMobileOnly: (h5Path: string) => void
  onCopyMobileLink?: () => void
}

export function ConvertToFormalDialog({
  open,
  reg,
  onClose,
  onConfirmPc,
  onMobileOnly,
  onCopyMobileLink,
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

  const copyMobileLink = () => {
    if (target.kind !== "mobile_only") return
    const url = `${window.location.origin}${target.h5Path}`
    void navigator.clipboard.writeText(url)
    onCopyMobileLink?.()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>转为正式入库确认</DialogTitle>
          <DialogDescription>
            登记单 {reg.regNo} · {reg.inboundType}
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc space-y-1.5 pl-5">
          {STAGING_O03_REMINDERS_USER.map((line) => (
            <li key={line}>
              <ProductFieldHint className="text-sm text-foreground">{line}</ProductFieldHint>
            </li>
          ))}
          {target.kind === "mobile_only" ? (
            <li>
              <ProductFieldHint className="text-sm font-medium text-amber-800">
                {STAGING_O03_PC_CD_HINT_USER}
              </ProductFieldHint>
            </li>
          ) : null}
        </ul>
        <PrototypeSpecCallout>{STAGING_O03_REMINDERS_SPEC}</PrototypeSpecCallout>
        {target.kind === "mobile_only" ? (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <p className="min-w-0 flex-1 break-all">
              手机链接（Mock）：{target.h5Path}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 gap-1 border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
              onClick={copyMobileLink}
            >
              <Copy className="size-3.5" />
              复制链接
            </Button>
          </div>
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
