import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldAlert } from "lucide-react"
import { REASON_OPTIONS } from "../domain/constants"
import type { UnlockApplySubmitContext } from "../domain/types"

type UnlockApplySubmitSheetProps = {
  open: boolean
  context: UnlockApplySubmitContext | null
  onClose: () => void
}

export function UnlockApplySubmitSheet({ open, context, onClose }: UnlockApplySubmitSheetProps) {
  const navigate = useNavigate()
  const [reason, setReason] = useState("出库")
  const [remark, setRemark] = useState("")
  const [unlockCount, setUnlockCount] = useState("1")
  const [validFrom, setValidFrom] = useState("2026-08-28T14:00")
  const [validTo, setValidTo] = useState("2026-08-28T18:00")
  const [windowStart, setWindowStart] = useState("2026-08-28T14:00")
  const [windowEnd, setWindowEnd] = useState("2026-08-28T18:00")
  const [submitting, setSubmitting] = useState(false)
  const [applyNo, setApplyNo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason("出库")
      setRemark("")
      setUnlockCount("1")
      setValidFrom("2026-08-28T14:00")
      setValidTo("2026-08-28T18:00")
      setWindowStart("2026-08-28T14:00")
      setWindowEnd("2026-08-28T18:00")
      setSubmitting(false)
      setApplyNo(null)
      setError(null)
    }
  }, [open])

  if (!open || !context) return null

  const isLock = context.deviceType === "挂锁门禁"
  const isFace = context.deviceType === "人脸门禁"

  const handleSubmit = () => {
    if (windowStart > windowEnd) {
      setError("预计使用时段开始时间不能晚于结束时间")
      return
    }
    if (isFace) {
      const count = Number(unlockCount)
      if (!Number.isInteger(count) || count < 1 || count > 100) {
        setError("开锁次数须为 1~100 的整数")
        return
      }
      if (validFrom >= validTo) {
        setError("有效期结束时间须晚于开始时间")
        return
      }
    }
    setError(null)
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setApplyNo("UA20260828001")
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="关闭" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8">
        {applyNo ? (
          <>
            <h2 className="text-base font-semibold text-gray-900">开锁申请已提交</h2>
            <p className="mt-2 text-xs text-gray-500">
              {isLock
                ? "请等待审批，审批通过后将短信下发临时密码"
                : "请等待审批，审批通过后可在详情页查看临时密码"}
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">申请单号</span>
                <span className="font-mono">{applyNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">申请状态</span>
                <span>待审批</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white"
                onClick={() => {
                  onClose()
                  navigate(`/m/my-applies/unlock/${applyNo}`)
                }}
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
            <h2 className="text-base font-semibold text-gray-900">发起开锁申请</h2>
            <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              <span>您正在申请临时开锁授权</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {context.deviceName}（{context.deviceCode}）· {context.warehouseName}
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
                备注
                <textarea
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  maxLength={50}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </label>

              {isFace && (
                <>
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
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs text-gray-600">
                      有效期起
                      <input
                        type="datetime-local"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-2 text-xs"
                        value={validFrom}
                        onChange={(e) => setValidFrom(e.target.value)}
                      />
                    </label>
                    <label className="block text-xs text-gray-600">
                      有效期止
                      <input
                        type="datetime-local"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-2 text-xs"
                        value={validTo}
                        onChange={(e) => setValidTo(e.target.value)}
                      />
                    </label>
                  </div>
                </>
              )}

              <div>
                <p className="text-xs text-gray-600">
                  <span className="text-rose-500">*</span> 预计使用时段
                </p>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <input
                    type="datetime-local"
                    className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs"
                    value={windowStart}
                    onChange={(e) => setWindowStart(e.target.value)}
                  />
                  <input
                    type="datetime-local"
                    className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs"
                    value={windowEnd}
                    onChange={(e) => setWindowEnd(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-400">仅供审批参考，不替代凭证有效期</p>
              </div>

              {error && <p className="text-xs text-rose-600">{error}</p>}
              <p className="text-[11px] text-gray-400">
                {isLock
                  ? "审批通过后短信下发临时密码"
                  : "审批通过后在详情页查看临时密码（不下发短信）"}
              </p>
            </div>

            <div className="mt-4 flex gap-3">
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
                {submitting ? "提交中…" : "提交申请"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
