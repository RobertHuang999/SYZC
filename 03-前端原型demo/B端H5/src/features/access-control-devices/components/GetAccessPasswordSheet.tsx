import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { REASON_OPTIONS } from "../domain/constants"
import type { AccessDevicePasswordContext } from "../domain/types"
import { createDirectFaceUnlockApply } from "@/features/my-applies/lib/create-direct-unlock-apply"
import { addUnlockApply } from "@/features/my-applies/lib/unlock-applies-store"

type GetAccessPasswordSheetProps = {
  open: boolean
  context: AccessDevicePasswordContext | null
  onClose: () => void
  onDirectSuccess?: (applyNo: string) => void
}

export function GetAccessPasswordSheet({
  open,
  context,
  onClose,
  onDirectSuccess,
}: GetAccessPasswordSheetProps) {
  const navigate = useNavigate()
  const [reason, setReason] = useState("入库")
  const [unlockCount, setUnlockCount] = useState("3")
  const [validFrom, setValidFrom] = useState("2026-08-31T14:00")
  const [validTo, setValidTo] = useState("2026-08-31T18:00")
  const [remark, setRemark] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdApplyNo, setCreatedApplyNo] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason("入库")
      setUnlockCount("3")
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
    const count = Number(unlockCount)
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      setError("开锁次数须为 1~100 的整数")
      return
    }
    if (validFrom >= validTo) {
      setError("有效期结束时间须晚于开始时间")
      return
    }
    setError(null)
    setSubmitting(true)
    window.setTimeout(() => {
      if (!context) return
      const record = createDirectFaceUnlockApply({
        context,
        reason,
        remark: remark || undefined,
        unlockCount: count,
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
          {success ? "密码已生成" : "获取门禁密码"}
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          {context.deviceName}（{context.deviceCode}）
        </p>

        {success ? (
          <div className="mt-4 space-y-4">
            <div className="flex gap-3 rounded-xl bg-green-50 p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
              <p className="text-sm leading-relaxed text-gray-700">
                密码已生成（人脸门禁不下发短信）。请前往
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
              <span className="text-rose-500">*</span> 开锁次数
              <input
                type="number"
                min={1}
                max={100}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                value={unlockCount}
                onChange={(e) => setUnlockCount(e.target.value)}
              />
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
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <p className="text-[11px] text-gray-400">
              最长 24 小时；超过有效期凭证自动失效；请在【我的申请记录】查看密码
            </p>
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
