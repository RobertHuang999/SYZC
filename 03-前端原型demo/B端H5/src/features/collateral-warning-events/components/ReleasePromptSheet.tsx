import type { LtvHitSnapshot, OrderType } from "../domain/types"
import { getLtvRateLabel } from "@/shared/lib/ltv-rate-label"

type ReleasePromptSheetProps = {
  open: boolean
  orderNo?: string
  orderType?: OrderType
  ltvHitSnapshot?: LtvHitSnapshot | null
  onClose: () => void
  onConfirm: () => void
}

export function ReleasePromptSheet({
  open,
  orderNo,
  orderType,
  ltvHitSnapshot,
  onClose,
  onConfirm,
}: ReleasePromptSheetProps) {
  if (!open) {
    return null
  }

  const isLtv = ltvHitSnapshot != null

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <div className="w-full rounded-t-2xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-bold text-amber-700">解除预警提示</h2>
          <p className="mt-1 text-xs font-medium text-gray-800">
            前往关联的订单业务中解除
          </p>
        </div>
        <div className="space-y-2 px-4 py-3 text-xs leading-relaxed text-gray-600">
          <p>
            该预警为商业类规则触发
            {orderNo ? `（订单：${orderNo}）` : ""}
            ，需前往对应的抵押、质押或监管服务订单业务流程中完成处置。
          </p>
          {isLtv ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-gray-800">
              <p>
                本次命中：
                <span className="font-semibold">{ltvHitSnapshot.hitLine}</span>
                （触发时{getLtvRateLabel(orderType ?? "")} {ltvHitSnapshot.triggerLtv}%）
              </p>
              <p className="mt-2 text-gray-600">订单侧仅展示以下解除方式：</p>
              <p className="mt-1 font-medium">
                {ltvHitSnapshot.allowedReleaseMethods.join("、")}
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex gap-2 border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white"
          >
            前往订单业务
          </button>
        </div>
      </div>
    </div>
  )
}
