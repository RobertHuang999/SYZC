import { AlertCircle, Ban, FileText, Package } from "lucide-react"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import type { PartnerSubject } from "@prototype/B端PC/src/features/partner-archives/domain/types"
import type { FreezeBlockReason } from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-rules"

type PartnerFreezeBlockedSheetProps = {
  open: boolean
  onClose: () => void
  partner: PartnerSubject | null
  blockInfo: FreezeBlockReason | null
}

export function PartnerFreezeBlockedSheet({
  open,
  onClose,
  partner,
  blockInfo,
}: PartnerFreezeBlockedSheetProps) {
  if (!open || !partner || !blockInfo) {
    return null
  }

  const { title = "无法冻结该主体", reason, detail, guide, blockingDocs } = blockInfo

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative max-h-[85%] overflow-hidden rounded-t-2xl bg-white shadow-xl flex flex-col">
        <div className="border-b border-gray-100 px-4 py-3.5 flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5">
            <Ban className="size-5" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{title}</p>
            <p className="mt-0.5 text-xs text-gray-500">
              {partner.name}（{partner.archiveMenu} · {partner.partnerNo}）
            </p>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-4 py-3.5 space-y-3 text-xs">
          {/* 阻断理由卡片 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-amber-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">{reason}</p>
                {detail && <p className="mt-1 text-xs text-amber-800/90 leading-relaxed">{detail}</p>}
              </div>
            </div>
          </div>

          {/* 关联资产单据明细 */}
          {blockingDocs && blockingDocs.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Package className="size-3.5" />
                  关联资产与在途单据（{blockingDocs.length} 笔）
                </span>
                <span className="text-[10px] text-gray-400">业务未结清</span>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50/60 divide-y divide-gray-100 overflow-hidden">
                {blockingDocs.map((doc) => (
                  <div key={doc.id} className="p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-medium text-gray-900">
                        <FileText className="size-3.5 text-gray-400" />
                        {doc.docTypeName} · {doc.docNo}
                      </span>
                      <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        {doc.statusName}
                      </span>
                    </div>
                    {doc.remark && (
                      <p className="mt-1 pl-5 text-[11px] text-gray-500 line-clamp-2">
                        {doc.remark}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 处置引导建议 */}
          {guide && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">💡 处置建议：</span>
              {guide}
            </div>
          )}

          <div className="pt-1">
            <PrototypeSpecCallout>
              【分菜单主体冻结与在途在库前置校验规则】(PA-R02)：货主名下有在库货物禁止冻结；提货人名下有待提货单据禁止冻结；资金方/服务方名下有进行中单据禁止冻结。
            </PrototypeSpecCallout>
          </div>
        </div>

        <div className="border-t border-gray-100 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white active:bg-blue-700"
            onClick={onClose}
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  )
}
