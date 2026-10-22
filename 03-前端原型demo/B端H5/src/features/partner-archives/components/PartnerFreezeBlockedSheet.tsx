import { AlertCircle, Ban, X } from "lucide-react"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { PartnerSubject } from "@prototype/B端PC/src/features/partner-archives/domain/types"
import type { FreezeBlockReason } from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-rules"

type PartnerFreezeBlockedSheetProps = {
  open: boolean
  onClose: () => void
  partner: PartnerSubject | null
  blockInfo: FreezeBlockReason | null
}

/** PA-R02 冻结阻断 · H5：与 PC 弹窗同构（标题 + 主体 + 单行说明） */
export function PartnerFreezeBlockedSheet({
  open,
  onClose,
  partner,
  blockInfo,
}: PartnerFreezeBlockedSheetProps) {
  if (!open || !partner || !blockInfo) {
    return null
  }

  const { title = "无法冻结该主体", reason } = blockInfo

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="关闭"
        onClick={onClose}
      />
      <div
        id="partner-archive-freeze-blocked"
        className="relative w-full max-w-sm rounded-xl bg-white p-4 shadow-xl"
      >
        <PrototypeAnnotationTarget annotationIds={["partner-archive-freeze-blocked"]}>
          <span className="sr-only">冻结前置校验阻断</span>
        </PrototypeAnnotationTarget>
        <button
          type="button"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md text-gray-400 active:bg-gray-100"
          aria-label="关闭"
          onClick={onClose}
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-2.5 pr-8">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Ban className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-gray-900">{title}</p>
            <p className="mt-0.5 text-xs text-gray-500">
              主体名称：{partner.name}（{partner.archiveMenu} · {partner.partnerNo}）
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-sm leading-relaxed text-amber-900">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <p>{reason}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
