import { useEffect, useState } from "react"

type Props = {
  open: boolean
  regNo: string
  onClose: () => void
  onConfirm: (reason: string) => void
}

export function StagingVoidSheet({ open, regNo, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (!open) setReason("")
  }, [open])

  if (!open) return null

  const trimmed = reason.trim()
  const valid = trimmed.length > 0 && trimmed.length <= 200

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <div className="w-full rounded-t-2xl bg-white p-4 pb-8 text-sm">
        <p className="font-medium text-gray-900">作废入库暂存登记单</p>
        <p className="mt-1 text-xs text-gray-500">
          作废后 {regNo} 永久只读，不可恢复或转正（O02）。
        </p>
        <textarea
          className="mt-3 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          rows={4}
          placeholder="请录入详细作废原因（最多 200 字）"
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, 200))}
        />
        <p className="mt-1 text-right text-[10px] text-gray-400">{trimmed.length}/200</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="h-11 flex-1 rounded-lg border border-gray-200 text-sm"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            disabled={!valid}
            className="h-11 flex-1 rounded-lg bg-red-600 text-sm font-medium text-white disabled:opacity-40"
            onClick={() => onConfirm(trimmed)}
          >
            确认作废
          </button>
        </div>
      </div>
    </div>
  )
}
