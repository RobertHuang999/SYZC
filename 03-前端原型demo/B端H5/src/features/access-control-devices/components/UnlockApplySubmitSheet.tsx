import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, Clock, FileCheck, Lock, ShieldAlert, UserRound, X } from "lucide-react"
import { REASON_OPTIONS } from "../domain/constants"
import type { UnlockApplySubmitContext } from "../domain/types"
import type { UnlockApprovalConfig } from "../mock/unlock-approval-configs.mock"
import { submitUnlockApply } from "@/features/my-applies/lib/submit-unlock-apply"

type UnlockApplySubmitSheetProps = {
  open: boolean
  context: UnlockApplySubmitContext | null
  matchedConfig: UnlockApprovalConfig | null
  onClose: () => void
  onBlocked?: (message: string) => void
}

function validateValidity(validFrom: string, validTo: string): string | null {
  if (validFrom >= validTo) return "有效期结束时间须晚于开始时间"
  const spanMs = new Date(validTo).getTime() - new Date(validFrom).getTime()
  if (spanMs > 24 * 60 * 60 * 1000) return "密码有效期最大不得超过 24 小时"
  return null
}

export function UnlockApplySubmitSheet({
  open,
  context,
  matchedConfig,
  onClose,
  onBlocked,
}: UnlockApplySubmitSheetProps) {
  const navigate = useNavigate()
  const [reason, setReason] = useState("出库")
  const [remark, setRemark] = useState("")
  const [unlockCount, setUnlockCount] = useState("1")
  const [validFrom, setValidFrom] = useState("2026-08-28T14:00")
  const [validTo, setValidTo] = useState("2026-08-28T18:00")
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
      setSubmitting(false)
      setApplyNo(null)
      setError(null)
    }
  }, [open])

  if (!open || !context) return null

  const isLock = context.deviceType === "挂锁门禁"
  const isFace = context.deviceType === "人脸门禁"

  const handleSubmit = () => {
    if (!context || !matchedConfig) return
    const validityError = validateValidity(validFrom, validTo)
    if (validityError) {
      setError(validityError)
      return
    }
    if (isFace) {
      const count = Number(unlockCount)
      if (!Number.isInteger(count) || count < 1 || count > 100) {
        setError("开锁次数须为 1~100 的整数")
        return
      }
    }
    setError(null)
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      const outcome = submitUnlockApply({
        context,
        matchedConfig,
        reason,
        remark: remark.trim() || undefined,
        validFrom,
        validTo,
        unlockCount: isFace ? Number(unlockCount) : undefined,
      })
      if (!outcome.ok) {
        const message = `设备已有在途申请 ${outcome.pendingApplyNo}，请等待处理完成`
        setError(message)
        onBlocked?.(message)
        return
      }
      setApplyNo(outcome.applyNo)
    }, 600)
  }

  const handleViewDetail = () => {
    if (!applyNo) return
    navigate(`/m/my-applies/unlock/${applyNo}`)
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
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-white ${
                  isLock ? "bg-amber-500" : "bg-blue-600"
                }`}
              >
                {isLock ? <Lock className="size-4" /> : <UserRound className="size-4" />}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate">
                  {applyNo ? "开锁申请已提交" : "发起开锁申请"}
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
          {applyNo ? (
            <>
              {/* 申请成功提醒卡片 */}
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/90 to-blue-50/30 p-4 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FileCheck className="size-5" />
                </div>
                <h3 className="mt-2 text-sm font-bold text-gray-900">开锁审批申请已受理</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {isLock
                    ? "请等待审批人审核；审批通过后临时密码将以短信下发。"
                    : "请等待审批人审核；审批通过后临时密码可在申请详情页查看（人脸门禁不下发短信）。"}
                </p>
              </div>

              {/* 审批审计详情 */}
              <div className="space-y-2 rounded-xl bg-gray-50/80 p-3 text-xs border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">申请单号</span>
                  <span className="font-mono font-medium text-gray-800">{applyNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">匹配审批流</span>
                  <span className="font-medium text-blue-600 truncate max-w-[200px]">
                    {matchedConfig?.configName ?? "指定审批流"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">申请状态</span>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 border border-amber-200">
                    待审批
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">凭证状态</span>
                  <span className="font-medium text-gray-400">未生成（审批后下发）</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">申请有效期</span>
                  <span className="text-gray-700 font-mono">
                    {validFrom.replace("T", " ")} ~ {validTo.replace("T", " ")}
                  </span>
                </div>
                {isFace && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">申请开锁次数</span>
                    <span className="text-gray-800 font-medium">{unlockCount} 次</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* 命中审批流安全提示 */}
              <div className="flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 p-3 text-xs text-amber-900">
                <ShieldAlert className="size-4 shrink-0 mt-0.5 text-amber-600" />
                <div className="min-w-0 flex-1">
                  <span className="font-semibold">已命中审批配置：</span>
                  <span>{matchedConfig?.configName ?? "标准审批流"}</span>
                  <p className="mt-0.5 text-[11px] text-amber-700">
                    该设备须提交申请并经审批通过后，方可获取有效开锁凭证。
                  </p>
                </div>
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

              {/* 有效期 (移动端上下两行布局，避免横向截断) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  <span className="text-rose-500 mr-0.5">*</span> 预计使用窗口（最长24小时）
                </label>
                <div className="space-y-2 rounded-xl border border-gray-200/80 bg-gray-50/50 p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-12 shrink-0 text-xs text-gray-500">开始时间</span>
                    <input
                      type="datetime-local"
                      className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-hidden"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 shrink-0 text-xs text-gray-500">结束时间</span>
                    <input
                      type="datetime-local"
                      className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-hidden"
                      value={validTo}
                      onChange={(e) => setValidTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 人脸专属：开锁次数 */}
              {isFace && (
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    <span className="text-rose-500 mr-0.5">*</span> 开锁次数（1~100 次）
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 active:scale-95 text-base font-medium shadow-2xs"
                      onClick={() =>
                        setUnlockCount((v) => String(Math.max(1, (parseInt(v, 10) || 1) - 1)))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-xs font-semibold focus:border-blue-500 focus:outline-hidden"
                      value={unlockCount}
                      onChange={(e) => setUnlockCount(e.target.value)}
                    />
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 active:scale-95 text-base font-medium shadow-2xs"
                      onClick={() =>
                        setUnlockCount((v) => String(Math.min(100, (parseInt(v, 10) || 1) + 1)))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

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
                  placeholder="选填，补充申请原因说明"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              {/* 阻断/错误提示 */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 animate-in fade-in-50">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                  <div className="flex-1 leading-relaxed">
                    <strong>提交失败：</strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* 规则说明 */}
              <div className="rounded-xl bg-gray-50 p-2.5 text-[11px] text-gray-500 border border-gray-100 space-y-1">
                <div className="flex items-center gap-1">
                  <Clock className="size-3 text-gray-400 shrink-0" />
                  <span>最长有效期 24 小时；超过有效期凭证自动失效。</span>
                </div>
                <p>
                  {isLock
                    ? "挂锁门禁：审批通过后短信下发临时密码。"
                    : "人脸门禁：审批通过后在详情页查看临时密码（不下发短信，R31）。"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* 底部固定操作栏 */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-3.5 flex gap-3">
          {applyNo ? (
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
                {submitting ? "正在提交申请…" : "提交申请"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

