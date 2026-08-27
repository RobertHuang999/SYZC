import type { CollateralWarningEvent } from "@/features/collateral-warning-events/domain/types"

type PublishConfirmDialogProps = {
  open: boolean
  events: CollateralWarningEvent[]
  onClose: () => void
  onConfirm: () => void
}

export function PublishConfirmDialog({
  open,
  events,
  onClose,
  onConfirm,
}: PublishConfirmDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-base font-semibold text-gray-900">公示风险确认</h2>
        <p className="mt-2 text-sm text-gray-600">
          已选择 {events.length} 条【已处理（有效）且未公示】记录。公示后将进入【05
          风险公示】候选池。
        </p>
        <ul className="mt-3 max-h-32 space-y-1 overflow-y-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
          {events.map((event) => (
            <li key={event.eventId}>
              {event.orderNo} · {event.warningType}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-700"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white"
            onClick={onConfirm}
          >
            确认公示
          </button>
        </div>
      </div>
    </div>
  )
}
