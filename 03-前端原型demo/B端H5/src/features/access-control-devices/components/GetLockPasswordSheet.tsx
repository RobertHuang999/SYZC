import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { REASON_OPTIONS } from "../domain/constants"
import type { AccessDevicePasswordContext } from "../domain/types"
import { createDirectLockUnlockApply } from "@/features/my-applies/lib/create-direct-unlock-apply"
import { addUnlockApply } from "@/features/my-applies/lib/unlock-applies-store"

type GetLockPasswordSheetProps = {
  open: boolean
  context: AccessDevicePasswordContext | null
  onClose: () => void
  onDirectSuccess?: (applyNo: string) => void
}

export function GetLockPasswordSheet({
  open,
  context,
  onClose,
  onDirectSuccess,
}: GetLockPasswordSheetProps) {
  const navigate = useNavigate()
  const [reason, setReason] = useState("出库")
  const [remark, setRemark] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [createdApplyNo, setCreatedApplyNo] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason("出库")
      setRemark("")
      setSubmitting(false)
      setSuccess(false)
      setShowPassword(false)
      setCreatedApplyNo(null)
    }
  }, [open])

  if (!open || !context) return null

  const handleSubmit = () => {
    if (!context) return
    setSubmitting(true)
    window.setTimeout(() => {
      const record = createDirectLockUnlockApply({
        context,
        reason,
        remark: remark || undefined,
      })
      addUnlockApply(record)
      setCreatedApplyNo(record.applyNo)
      onDirectSuccess?.(record.applyNo)
      setSubmitting(false)
      setSuccess(true)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="关闭" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8">
        <h2 className="text-base font-semibold text-gray-900">
          {success ? "密码已生成并发送短信" : "获取门锁密码"}
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          {context.deviceName}（{context.deviceCode}）
        </p>

        {success ? (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="font-mono text-lg tracking-widest">
                {showPassword ? "856778" : "****5678"}
              </span>
              <button type="button" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-600">短信发送结果：发送成功</p>
            {createdApplyNo && (
              <p className="text-xs text-gray-500">已写入我的申请记录 · {createdApplyNo}</p>
            )}
            <div className="flex gap-2">
              {createdApplyNo && (
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-blue-200 py-3 text-sm font-medium text-blue-600"
                  onClick={() => {
                    onClose()
                    navigate(`/m/my-applies/unlock/${createdApplyNo}`)
                  }}
                >
                  查看记录
                </button>
              )}
              <button
                type="button"
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white"
                onClick={onClose}
              >
                关闭
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <label className="block text-xs text-gray-600">
              <span className="text-rose-500">*</span> 事由
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {REASON_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-gray-600">
              备注
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                maxLength={50}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </label>
            <p className="text-[11px] text-gray-400">密码将发送至绑定手机号，有效期 3 天</p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm text-gray-700"
                onClick={onClose}
              >
                取消
              </button>
              <button
                type="button"
                disabled={submitting}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white disabled:opacity-60"
                onClick={handleSubmit}
              >
                {submitting ? "获取中…" : "获取密码"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
