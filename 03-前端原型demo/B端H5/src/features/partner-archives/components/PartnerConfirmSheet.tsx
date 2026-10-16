import { useEffect, useState } from "react"

type PartnerConfirmSheetProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
  reasonRequired?: boolean
  reasonLabel?: string
  reasonPlaceholder?: string
  onClose: () => void
  onConfirm: (reason: string) => void
}

const REASON_MAX = 200

export function PartnerConfirmSheet({
  open,
  title,
  description,
  confirmLabel,
  destructive = false,
  reasonRequired = false,
  reasonLabel = "原因",
  reasonPlaceholder = "请输入原因（1～200 字）",
  onClose,
  onConfirm,
}: PartnerConfirmSheetProps) {
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (open) {
      setReason("")
    }
  }, [open, title])

  if (!open) {
    return null
  }

  const disabled = reasonRequired && reason.trim().length === 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative max-h-[85%] overflow-hidden rounded-t-2xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="text-base font-semibold text-gray-900">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p>
        </div>
        <div className="max-h-[50vh] overflow-y-auto px-4 py-3">
          <label className="text-xs font-medium text-gray-700">
            {reasonLabel}
            {reasonRequired ? <span className="text-red-500"> *</span> : null}
          </label>
          <textarea
            className="mt-2 min-h-[88px] w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            maxLength={REASON_MAX}
            placeholder={reasonPlaceholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <p className="mt-1 text-right text-[10px] text-gray-400">
            {reason.trim().length}/{REASON_MAX}
          </p>
        </div>
        <div className="flex gap-3 border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-700"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            disabled={disabled}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-40 ${
              destructive ? "bg-red-600" : "bg-blue-600"
            }`}
            onClick={() => onConfirm(reason.trim())}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
