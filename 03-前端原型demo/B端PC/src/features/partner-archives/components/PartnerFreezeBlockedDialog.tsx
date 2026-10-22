import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { AlertCircle, Ban } from "lucide-react"
import type { PartnerSubject } from "../domain/types"
import type { FreezeBlockReason } from "../lib/partner-archive-rules"

type PartnerFreezeBlockedDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  partner: PartnerSubject | null
  blockInfo: FreezeBlockReason | null
}

/** PA-R02 冻结阻断：仅标题 + 主体识别 + 单行阻断说明（对齐 ASCII 列表 1.0） */
export function PartnerFreezeBlockedDialog({
  open,
  onOpenChange,
  partner,
  blockInfo,
}: PartnerFreezeBlockedDialogProps) {
  if (!partner || !blockInfo) {
    return null
  }

  const { title = "无法冻结该合作方主体", reason } = blockInfo

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-4">
        <PrototypeAnnotationTarget annotationIds={["partner-archive-freeze-blocked"]}>
          <span className="sr-only">冻结前置校验阻断</span>
        </PrototypeAnnotationTarget>
        <DialogHeader className="space-y-0 text-left">
          <div className="flex items-start gap-2.5 pr-6">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50">
              <Ban className="size-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <DialogTitle className="text-base font-semibold leading-snug">
                {title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                主体名称：{partner.name}（{partner.archiveMenu} · {partner.partnerNo}）
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 p-3 text-sm leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p>{reason}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
