import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
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

function validateValidity(validFrom: string, validTo: string): string | null {
  if (validFrom >= validTo) return "有效期结束时间须晚于开始时间"
  const spanMs = new Date(validTo).getTime() - new Date(validFrom).getTime()
  if (spanMs > 24 * 60 * 60 * 1000) return "密码有效期最大不得超过 24 小时"
  return null
}

export function GetLockPasswordSheet({
  open,
  context,
  onClose,
  onDirectSuccess,
}: GetLockPasswordSheetProps) {
  const navigate = useNavigate()
  const [reason, setReason] = useState("出库")
  const [validFrom, setValidFrom] = useState("2026-08-31T14:00")
  const [validTo, setValidTo] = useState("2026-08-31T18:00")
  const [remark, setRemark] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdApplyNo, setCreatedApplyNo] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason("出库")
      setValidFrom("2026-08-31T14:00")
      setValidTo("2026-08-31T18:00")
      setRemark("")
      setSubmitting(false)
      setSuccess(false)
      setError(null)
      setCreatedApplyNo(null)
    }
  }, [open])

  if (!open || !context) return null

  const handleSubmit = () => {
    const validityError = validateValidity(validFrom, validTo)
    if (validityError) {
      setError(validityError)
      return
    }
    setError(null)
    setSubmitting(true)
    window.setTimeout(() => {
      const record = createDirectLockUnlockApply({
        context,
        reason,
        remark: remark || undefined,
        validFrom,
        validTo,
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
          {success ? "密码已生成" : "获取门锁密码"}
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          {context.deviceName}（{context.deviceCode}）
        </p>

        {success ? (
          <div className="mt-4 space-y-4">
            <div className="flex gap-3 rounded-xl bg-green-50 p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
              <p className="text-sm leading-relaxed text-gray-700">
                密码已生成并已发送短信至绑定手机号。请前往
                <span className="font-medium">【我的申请记录】</span>
                的
                <span className="font-medium">开锁申请</span>
                查看密码。
              </p>
            </div>
            {createdApplyNo && (
              <p className="text-xs text-gray-500">申请单号：{createdApplyNo}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm text-gray-700"
                onClick={onClose}
              >
                关闭
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white"
                onClick={() => {
                  onClose()
                  navigate(
                    createdApplyNo
                      ? `/m/my-applies/unlock/${createdApplyNo}`
                      : "/m/my-applies?tab=unlock-applies"
                  )
                }}
              >
                前往查看
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
              <span className="text-rose-500">*</span> 有效期
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border border-gray-200 px-2 py-2 text-sm"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                />
                <span className="text-gray-400">至</span>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border border-gray-200 px-2 py-2 text-sm"
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                />
              </div>
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
            <p className="text-[11px] text-gray-400">
              密码将发送至绑定手机号；最长有效期 24 小时；超过有效期凭证自动失效
            </p>
            {error && <p className="text-xs text-rose-600">{error}</p>}
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
