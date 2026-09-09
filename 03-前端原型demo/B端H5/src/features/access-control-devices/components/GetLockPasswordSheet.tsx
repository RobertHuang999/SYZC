import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, Copy, KeyRound, Lock, Smartphone, X } from "lucide-react"
import { REASON_OPTIONS } from "../domain/constants"
import type { AccessDevicePasswordContext } from "../domain/types"
import { createDirectLockUnlockApply } from "@/features/my-applies/lib/create-direct-unlock-apply"
import { addUnlockApply } from "@/features/my-applies/lib/unlock-applies-store"

type GetLockPasswordSheetProps = {
  open: boolean
  context: AccessDevicePasswordContext | null
  onClose: () => void
}

export function GetLockPasswordSheet({
  open,
  context,
  onClose,
}: GetLockPasswordSheetProps) {
  const navigate = useNavigate()
  const [reason, setReason] = useState("出库")
  const [remark, setRemark] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [createdApplyNo, setCreatedApplyNo] = useState<string | null>(null)
  const [createdPassword, setCreatedPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setReason("出库")
      setRemark("")
      setSubmitting(false)
      setCreatedApplyNo(null)
      setCreatedPassword(null)
      setCopied(false)
      setError(null)
    }
  }, [open])

  if (!open || !context) return null

  const handleSubmit = () => {
    setError(null)
    setSubmitting(true)
    window.setTimeout(() => {
      const record = createDirectLockUnlockApply({
        context,
        reason,
        remark: remark || undefined,
      })
      addUnlockApply(record)
      setCreatedApplyNo(record.applyNo)
      setCreatedPassword(record.credential?.password ?? "856778")
      setSubmitting(false)
    }, 600)
  }

  const handleCopy = () => {
    if (!createdPassword) return
    navigator.clipboard.writeText(createdPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleViewDetail = () => {
    if (!createdApplyNo) return
    navigate(`/m/my-applies/unlock/${createdApplyNo}`)
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
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                <Lock className="size-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">
                  {createdApplyNo ? "开锁凭证已生成" : "获取门锁密码"}
                </h2>
                <p className="text-[11px] text-gray-500 truncate">
                  {context.deviceName}（{context.deviceCode}）
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
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-3.5 overscroll-contain">
          {createdApplyNo ? (
            <>
              {/* 临时开锁密码大卡片 */}
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/90 to-blue-50/30 p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-blue-700">
                  <KeyRound className="size-3.5" />
                  <span>临时开锁密码</span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="font-mono text-3xl font-extrabold tracking-widest text-blue-950">
                    {createdPassword}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-600 shadow-2xs hover:bg-blue-50 active:scale-95 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>复制</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 短信下发提示 */}
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800 border border-emerald-100">
                <Smartphone className="size-4 shrink-0 text-emerald-600" />
                <span>临时密码已同步通过短信下发至您的手机号，请凭此密码前往设备开锁</span>
              </div>

              {/* 审计摘要卡片 */}
              <div className="space-y-2 rounded-xl bg-gray-50/80 p-3 text-xs border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">申请单号</span>
                  <span className="font-mono font-medium text-gray-800">{createdApplyNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">审批类型</span>
                  <span className="font-medium text-blue-600">免审直发（无需审批）</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">申请状态</span>
                  <span className="font-medium text-emerald-600">已通过</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">凭证状态</span>
                  <span className="font-medium text-emerald-600">已下发</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">开锁事由</span>
                  <span className="text-gray-700">{reason}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 设备位置提示 */}
              <div className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600 border border-gray-100 flex items-center justify-between">
                <span>位置：{context.warehouseName} · {context.locationDetail}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  免审直发
                </span>
              </div>

              {/* 事由 */}
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  <span className="text-rose-500 mr-0.5">*</span> 事由
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  {REASON_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* 备注 */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-700">备注</label>
                  <span className="text-[10px] text-gray-400">{remark.length}/50</span>
                </div>
                <textarea
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  rows={2}
                  maxLength={50}
                  placeholder="选填，可输入开锁背景说明"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              {/* 规则说明 */}
              <div className="rounded-xl bg-amber-50/70 p-2.5 text-[11px] text-amber-800 border border-amber-200/60 leading-relaxed">
                💡 挂锁门禁临时密码将以短信同步发送至绑定手机号，请凭此密码前往设备开锁；开锁流水将自动落账审计。
              </div>

              {error && (
                <div className="rounded-lg bg-rose-50 p-2 text-xs text-rose-600 border border-rose-200">
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* 底部固定操作栏 */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-3.5 flex gap-3">
          {createdApplyNo ? (
            <>
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-medium text-gray-700 active:scale-98 transition-transform"
                onClick={onClose}
              >
                返回设备列表
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-blue-700 active:scale-98 transition-all"
                onClick={handleViewDetail}
              >
                查看申请详情
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-medium text-gray-700 active:scale-98 transition-transform"
                onClick={onClose}
              >
                取消
              </button>
              <button
                type="button"
                disabled={submitting}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-blue-700 disabled:opacity-60 active:scale-98 transition-all"
                onClick={handleSubmit}
              >
                {submitting ? "正在生成密码…" : "获取门锁密码"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

