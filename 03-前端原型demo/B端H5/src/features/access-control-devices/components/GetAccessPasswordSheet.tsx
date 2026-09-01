import { useEffect, useState } from "react"
import { Copy } from "lucide-react"
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
  const [credential, setCredential] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [createdApplyNo, setCreatedApplyNo] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason("入库")
      setUnlockCount("3")
      setValidFrom("2026-08-31T14:00")
      setValidTo("2026-08-31T18:00")
      setRemark("")
      setSubmitting(false)
      setCredential(false)
      setError(null)
      setCopied(false)
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
      setCredential(true)
    }, 600)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("856778")
    } catch {
      /* noop */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="关闭" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8">
        <h2 className="text-base font-semibold text-gray-900">
          {credential ? "临时开锁密码" : "获取门禁密码"}
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          {context.deviceName}（{context.deviceCode}）
        </p>

        {credential ? (
          <div className="mt-4 space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
            <p className="text-[11px] text-gray-500">密码仅在当前页面展示（不下发短信）</p>
            <p className="font-mono text-3xl font-bold tracking-[0.25em] text-gray-900">856778</p>
            <p className="text-xs text-gray-600">
              开锁次数 {unlockCount} / 剩余 {unlockCount}
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs"
              onClick={handleCopy}
            >
              <Copy className="size-3.5" />
              {copied ? "已复制" : "复制密码"}
            </button>
            {createdApplyNo && (
              <p className="text-[11px] text-gray-500">已写入我的申请记录 · {createdApplyNo}</p>
            )}
            <div className="mt-2 flex gap-2">
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
                开始
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-2 text-xs"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                />
              </label>
              <label className="block text-xs text-gray-600">
                结束
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-2 text-xs"
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                />
              </label>
            </div>
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
            <p className="text-[11px] text-gray-400">最长 24 小时；密码仅页面展示</p>
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
