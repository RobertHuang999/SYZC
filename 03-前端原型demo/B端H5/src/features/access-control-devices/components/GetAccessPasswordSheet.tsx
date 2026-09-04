import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { REASON_OPTIONS } from "../domain/constants"
import type { AccessDevicePasswordContext } from "../domain/types"
import { createDirectFaceUnlockApply } from "@/features/my-applies/lib/create-direct-unlock-apply"
import { addUnlockApply } from "@/features/my-applies/lib/unlock-applies-store"

type GetAccessPasswordSheetProps = {
  open: boolean
  context: AccessDevicePasswordContext | null
  onClose: () => void
}

export function GetAccessPasswordSheet({
  open,
  context,
  onClose,
}: GetAccessPasswordSheetProps) {
  const navigate = useNavigate()
  const [reason, setReason] = useState("入库")
  const [unlockCount, setUnlockCount] = useState("3")
  const [validFrom, setValidFrom] = useState("2026-08-31T14:00")
  const [validTo, setValidTo] = useState("2026-08-31T18:00")
  const [remark, setRemark] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [createdApplyNo, setCreatedApplyNo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason("入库")
      setUnlockCount("3")
      setValidFrom("2026-08-31T14:00")
      setValidTo("2026-08-31T18:00")
      setRemark("")
      setSubmitting(false)
      setCreatedApplyNo(null)
      setError(null)
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
    const spanMs = new Date(validTo).getTime() - new Date(validFrom).getTime()
    if (spanMs > 24 * 60 * 60 * 1000) {
      setError("密码有效期最大不得超过 24 小时")
      return
    }
    setError(null)
    setSubmitting(true)
    window.setTimeout(() => {
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
      setSubmitting(false)
    }, 600)
  }

  const handleViewDetail = () => {
    if (!createdApplyNo) return
    navigate(`/m/my-applies/unlock/${createdApplyNo}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="关闭" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8">
        {createdApplyNo ? (
          <>
            <h2 className="text-base font-semibold text-gray-900">开锁凭证已生成</h2>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              临时密码已生成，请点击下方按钮在详情页查看（人脸门禁不下发短信）。
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">申请单号</span>
                <span className="font-mono">{createdApplyNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">申请状态</span>
                <span>已通过</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">凭证状态</span>
                <span>已下发</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white"
                onClick={handleViewDetail}
              >
                查看申请详情
              </button>
              <button
                type="button"
                className="w-full rounded-xl border border-gray-200 py-3 text-sm text-gray-700"
                onClick={onClose}
              >
                返回设备列表
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-base font-semibold text-gray-900">获取门禁密码</h2>
            <p className="mt-1 text-xs text-gray-500">
              {context.deviceName}（{context.deviceCode}）
            </p>

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
                提交后可在【我的申请记录】查看密码；最长有效期 24 小时；人脸门禁不下发短信
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
                  {submitting ? "提交中…" : "获取密码"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
