import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { BATCH_PUBLISH_CONFIRM_MESSAGE } from "../domain/actions"
import type { CollateralWarningEvent } from "../domain/types"

type BatchPublishConfirmSheetProps = {
  open: boolean
  events: CollateralWarningEvent[]
  onClose: () => void
  onConfirm: () => void
}

export function BatchPublishConfirmSheet({
  open,
  events,
  onClose,
  onConfirm,
}: BatchPublishConfirmSheetProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <PrototypeAnnotationTarget annotationIds={["collateral-warning-toolbar"]}>
        <div className="max-h-[80vh] w-full overflow-hidden rounded-t-2xl bg-white shadow-xl">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-bold text-gray-900">批量公示风险确认</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {BATCH_PUBLISH_CONFIRM_MESSAGE}
            </p>
            <p className="mt-2 text-xs font-medium text-gray-800">
              已选 {events.length} 条已结案且未公示的预警
            </p>
          </div>

          <ul className="max-h-48 space-y-0 overflow-y-auto px-4 py-2 text-xs">
            {events.map((event) => (
              <li
                key={event.eventId}
                className="border-b border-gray-50 py-2 last:border-0"
              >
                <span className="font-mono font-semibold text-blue-700">
                  {event.orderNo}
                </span>
                <span className="text-gray-400"> · </span>
                {event.warningType}
                <span className="text-gray-400"> · </span>
                {event.warningTime}
              </li>
            ))}
          </ul>

          <div className="flex gap-2 border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200"
            >
              取消
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white active:bg-blue-700"
            >
              去编辑公示内容
            </button>
          </div>
        </div>
      </PrototypeAnnotationTarget>
    </div>
  )
}
