import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, ShieldCheck, X, XCircle } from "lucide-react"
import type { UnlockApply } from "../domain/types"

export type UnlockApprovalDecision = "同意" | "驳回"

type UnlockApplyApprovalDialogProps = {
  open: boolean
  apply: UnlockApply | null
  onClose: () => void
  onApprove?: (apply: UnlockApply, opinion: string) => void
  onReject?: (apply: UnlockApply, reason: string) => void
  onSubmit?: (apply: UnlockApply, decision: UnlockApprovalDecision, opinion: string) => void
}

export function UnlockApplyApprovalDialog({
  open,
  apply,
  onClose,
  onApprove,
  onReject,
  onSubmit,
}: UnlockApplyApprovalDialogProps) {
  const [decision, setDecision] = useState<UnlockApprovalDecision>("同意")
  const [opinion, setOpinion] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!open) return
    setDecision("同意")
    setOpinion("")
    setErrorMessage("")
  }, [apply?.applyNo, open])

  if (!open || !apply) {
    return null
  }

  const handleSubmit = () => {
    const trimmed = opinion.trim()
    if (decision === "驳回" && !trimmed) {
      setErrorMessage("驳回必须填写审批理由")
      return
    }

    setErrorMessage("")

    if (onSubmit) {
      onSubmit(apply, decision, trimmed)
    } else if (decision === "同意") {
      onApprove?.(apply, trimmed)
    } else {
      onReject?.(apply, trimmed)
    }

    onClose()
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-2xs animate-in fade-in-50 duration-200">
      {/* 遮罩点击关闭 */}
      <button
        type="button"
        className="flex-1 w-full"
        aria-label="关闭浮窗"
        onClick={onClose}
      />

      {/* 底部浮窗主卡片 */}
      <div className="relative w-full max-h-[88%] flex flex-col rounded-t-3xl bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* 顶部把手与标题栏 */}
        <div className="shrink-0 px-4 pt-3 pb-2.5 border-b border-gray-100 bg-white">
          <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-gray-300/80" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white">
                <ShieldCheck className="size-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">开锁审批处理</h2>
                <p className="text-[11px] text-gray-500 truncate">
                  {apply.applyNo} · {apply.deviceName}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:scale-95 transition-colors"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* 内容滚动区 */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4 overscroll-contain">
          {/* 单选条件「同意、驳回」 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-900 flex items-center gap-1">
                审批决定 <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-gray-400">请选择审批结论</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* 同意选项 */}
              <button
                type="button"
                onClick={() => {
                  setDecision("同意")
                  if (errorMessage) setErrorMessage("")
                }}
                className={`relative flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                  decision === "同意"
                    ? "border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/30"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                    <CheckCircle2
                      className={`size-4 ${
                        decision === "同意" ? "text-emerald-600 fill-emerald-100" : "text-gray-300"
                      }`}
                    />
                    同意
                  </div>
                  <span
                    className={`size-3.5 rounded-full border flex items-center justify-center ${
                      decision === "同意" ? "border-emerald-600 bg-emerald-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    {decision === "同意" && <span className="size-1.5 rounded-full bg-white" />}
                  </span>
                </div>
                <p className="mt-1.5 text-[10px] text-emerald-700/80 leading-relaxed">
                  审批通过并自动生成有效开锁凭证
                </p>
              </button>

              {/* 驳回选项 */}
              <button
                type="button"
                onClick={() => {
                  setDecision("驳回")
                }}
                className={`relative flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                  decision === "驳回"
                    ? "border-rose-500 bg-rose-50/70 shadow-xs ring-1 ring-rose-500/30"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-rose-800">
                    <XCircle
                      className={`size-4 ${
                        decision === "驳回" ? "text-rose-600 fill-rose-100" : "text-gray-300"
                      }`}
                    />
                    驳回
                  </div>
                  <span
                    className={`size-3.5 rounded-full border flex items-center justify-center ${
                      decision === "驳回" ? "border-rose-600 bg-rose-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    {decision === "驳回" && <span className="size-1.5 rounded-full bg-white" />}
                  </span>
                </div>
                <p className="mt-1.5 text-[10px] text-rose-700/80 leading-relaxed">
                  不予通过，终止申请并记录驳回理由
                </p>
              </button>
            </div>
          </div>

          {/* 3. 审批理由 */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <label className="font-bold text-gray-900 flex items-center gap-1">
                审批理由
                {decision === "驳回" ? (
                  <span className="text-rose-500 text-[11px] font-semibold">* 必填</span>
                ) : (
                  <span className="text-gray-400 font-normal text-[11px]">（选填）</span>
                )}
              </label>
              <span className="text-[11px] text-gray-400">{opinion.length}/200</span>
            </div>

            <textarea
              className={`w-full min-h-[88px] rounded-xl border p-3 text-xs text-gray-900 outline-none transition-all ${
                errorMessage
                  ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20"
                  : "border-gray-200 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
              }`}
              placeholder={
                decision === "驳回"
                  ? "请详细填写驳回原因或依据（必填，最多200字）"
                  : "审批通过时可填写补充说明或意见（选填，最多200字）"
              }
              maxLength={200}
              value={opinion}
              onChange={(event) => {
                setOpinion(event.target.value)
                if (errorMessage) setErrorMessage("")
              }}
            />

            {errorMessage && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 font-medium">
                <AlertCircle className="size-3.5 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* 4. 底部操作按钮 */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-3.5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-orange-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-700 active:bg-orange-800 transition-colors"
          >
            提交
          </button>
        </div>
      </div>
    </div>
  )
}
