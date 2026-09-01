import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { UnlockApply } from "../domain/types"

type UnlockApplyApprovalDialogProps = {
  open: boolean
  apply: UnlockApply | null
  onClose: () => void
  onApprove: (apply: UnlockApply, opinion: string) => void
  onReject: (apply: UnlockApply, reason: string) => void
}

export function UnlockApplyApprovalDialog({
  open,
  apply,
  onClose,
  onApprove,
  onReject,
}: UnlockApplyApprovalDialogProps) {
  const [opinion, setOpinion] = useState("")
  const [rejectError, setRejectError] = useState("")

  useEffect(() => {
    if (!open) return
    setOpinion("")
    setRejectError("")
  }, [apply?.applyNo, open])

  if (!open || !apply) {
    return null
  }

  const handleApprove = () => {
    onApprove(apply, opinion)
    onClose()
  }

  const handleReject = () => {
    if (!opinion.trim()) {
      setRejectError("驳回须填写审批意见")
      return
    }
    onReject(apply, opinion.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">去处理</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {apply.applyNo} · {apply.deviceName}
            </p>
          </div>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
            onClick={onClose}
            aria-label="关闭"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[58vh] overflow-y-auto px-4 py-3 space-y-3">
          <div className="rounded-xl bg-slate-50 p-3 text-xs">
            <div className="text-gray-400">绑定仓库</div>
            <div className="mt-0.5 font-medium text-gray-900">{apply.warehouseName}</div>
            <div className="mt-2 text-gray-400">申请人</div>
            <div className="mt-0.5 text-gray-900">
              {apply.applicantName}（{apply.applicantAccount}）
            </div>
            <div className="mt-2 text-gray-400">事由</div>
            <div className="mt-0.5 text-gray-900">{apply.reason}</div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">审批意见</label>
            <textarea
              className="w-full min-h-[88px] rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 outline-none focus:border-orange-500"
              placeholder="通过可选填；驳回必填"
              maxLength={200}
              value={opinion}
              onChange={(event) => {
                setOpinion(event.target.value)
                if (rejectError) setRejectError("")
              }}
            />
            <div className="mt-1 text-right text-[10px] text-gray-400">
              {opinion.length}/200
            </div>
            {rejectError && (
              <p className="mt-1 text-xs text-red-600">{rejectError}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={handleReject}
            className="rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-50"
          >
            驳回
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="rounded-xl bg-orange-600 py-2.5 text-xs font-semibold text-white active:bg-orange-700"
          >
            通过
          </button>
        </div>
      </div>
    </div>
  )
}
