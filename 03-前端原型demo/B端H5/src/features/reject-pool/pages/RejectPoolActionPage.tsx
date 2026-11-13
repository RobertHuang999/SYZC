import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { AlertCircle, CheckCircle2, Lock } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"
import {
  FUNDER_OPTIONS,
  H5_REJECT_POOL_LIST_PATH,
  SURVEYOR_OPTIONS,
  formatYuan,
  h5RejectPoolDetailPath,
  isCircuitBroken,
  nextBatchNo,
  type RejectPoolRecord,
} from "../domain/types"
import {
  loadH5RejectPoolRecords,
  saveH5RejectPoolRecords,
} from "./RejectPoolListPage"

export type H5RejectActionKind =
  | "revive"
  | "routeAssign"
  | "reinitDiligence"
  | "skipDiligence"
  | "reassignFunder"
  | "unlock"

const ACTION_LABEL: Record<H5RejectActionKind, string> = {
  revive: "重新救活",
  routeAssign: "按路由指派",
  reinitDiligence: "重新发起尽调",
  skipDiligence: "变更路由直分资方",
  reassignFunder: "重新分配资方",
  unlock: "特批解除熔断",
}

function defaultAction(record: RejectPoolRecord): H5RejectActionKind {
  if (isCircuitBroken(record)) return "unlock"
  if (record.tabKey === "CLUE_REJECTED") return "revive"
  if (record.tabKey === "DILIGENCE_FAILED") return "reinitDiligence"
  return "reassignFunder"
}

export function RejectPoolActionPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [record, setRecord] = useState<RejectPoolRecord | null>(null)
  const [amountInput, setAmountInput] = useState("")
  const [periodsInput, setPeriodsInput] = useState("")
  const [note, setNote] = useState("")
  const [selectedSurveyorId, setSelectedSurveyorId] = useState("")
  const [selectedFunderId, setSelectedFunderId] = useState("")
  const [specialReason, setSpecialReason] = useState("")
  const [ticketNo, setTicketNo] = useState("RISK-UNLOCK-20261113-01")
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const list = loadH5RejectPoolRecords()
    const decoded = id ? decodeURIComponent(id) : ""
    const found =
      list.find((item) => item.id === decoded || item.applyNo === decoded) ??
      list[0] ??
      null
    setRecord(found)
    if (found) {
      setAmountInput(String(found.intendedAmountYuan))
      setPeriodsInput(String(found.intendedPeriods))
      setNote("")
      setSelectedSurveyorId("")
      setSelectedFunderId("")
      setSpecialReason("")
      setError(null)
    }
  }, [id])

  const kind: H5RejectActionKind = useMemo(() => {
    if (!record) return "revive"
    const raw = searchParams.get("action") as H5RejectActionKind | null
    if (raw && ACTION_LABEL[raw]) return raw
    return defaultAction(record)
  }, [record, searchParams])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  if (!record) {
    return (
      <MobileShell>
        <NavBar title="重调度操作" backTo={H5_REJECT_POOL_LIST_PATH} />
        <div className="flex flex-1 items-center justify-center p-6 text-xs text-gray-500">
          未找到对应的被拒退回单据或已完成重调度。
        </div>
      </MobileShell>
    )
  }

  const locked = isCircuitBroken(record)
  const selectableSurveyors = SURVEYOR_OPTIONS.filter(
    (s) => kind !== "reinitDiligence" || s.id !== record.lastSurveyorId,
  )
  const selectedSurveyor = SURVEYOR_OPTIONS.find((s) => s.id === selectedSurveyorId)
  const selectedFunder = FUNDER_OPTIONS.find((f) => f.id === selectedFunderId)

  const handleValidate = () => {
    setError(null)
    if (locked && kind !== "unlock") {
      setError("已触发 5 次熔断保护，请先线下特批解除。")
      return
    }
    if (kind === "revive") {
      const amt = Number(amountInput)
      const per = Number(periodsInput)
      if (!Number.isFinite(amt) || amt <= 0) {
        setError("请输入大于 0 的意向融资金额。")
        return
      }
      if (!Number.isInteger(per) || per <= 0) {
        setError("意向融资期数必须为正整数。")
        return
      }
      if (note.trim().length < 5) {
        setError("请填写不少于 5 字的补正说明。")
        return
      }
    } else if (kind === "routeAssign") {
      if (record.needDiligence && !selectedSurveyorId) {
        setError("请选择尽调专员。")
        return
      }
      if (!record.needDiligence && !selectedFunderId) {
        setError("请选择合作资金方机构。")
        return
      }
    } else if (kind === "reinitDiligence") {
      if (!selectedSurveyorId) {
        setError("请选择在职尽调专员。")
        return
      }
    } else if (kind === "skipDiligence") {
      if (!selectedFunderId) {
        setError("请选择合作资金方机构。")
        return
      }
      if (specialReason.trim().length < 20) {
        setError("特批跳过尽调理由不少于 20 字。")
        return
      }
    } else if (kind === "reassignFunder") {
      if (!selectedFunderId) {
        setError("请选择合作资金方机构。")
        return
      }
    } else if (kind === "unlock") {
      if (!ticketNo.trim()) {
        setError("请填写线下特批工单号。")
        return
      }
    }
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    setConfirmOpen(false)
    const list = loadH5RejectPoolRecords()
    if (kind === "unlock") {
      const updated: RejectPoolRecord = { ...record, demoUnlocked: true }
      saveH5RejectPoolRecords(
        list.map((item) => (item.id === updated.id ? updated : item)),
      )
      showToast(`特批工单 ${ticketNo.trim()} 已解锁`)
      window.setTimeout(() => navigate(h5RejectPoolDetailPath(updated.id)), 900)
      return
    }

    saveH5RejectPoolRecords(list.filter((item) => item.id !== record.id))
    const nextBatch = nextBatchNo(record.batchNo)
    if (kind === "revive") {
      showToast(`${record.applyNo} 已救活并恢复待受理`)
    } else if (kind === "routeAssign") {
      showToast(
        `已指派给 ${record.needDiligence ? selectedSurveyor?.name : selectedFunder?.name}`,
      )
    } else if (kind === "reinitDiligence") {
      showToast(`已生成新尽调批次 ${nextBatch}`)
    } else if (kind === "skipDiligence") {
      showToast(`特批免尽调已直推 ${selectedFunder?.name}`)
    } else if (kind === "reassignFunder") {
      showToast(`已分配给 ${selectedFunder?.name}`)
    }
    window.setTimeout(() => navigate(H5_REJECT_POOL_LIST_PATH), 900)
  }

  return (
    <MobileShell>
      <NavBar
        title={ACTION_LABEL[kind]}
        backTo={h5RejectPoolDetailPath(record.id)}
      />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#edf2f8] p-3 pb-24">
        <NativeInfoCard title="单据快照">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">申请单号</span>
              <span className="font-semibold text-[#232D39]">{record.applyNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">申请人</span>
              <span className="font-medium text-[#232D39]">{record.applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">融资产品</span>
              <span className="max-w-[65%] text-right font-medium text-[#232D39]">
                {record.productName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">意向额度</span>
              <span className="font-medium text-[#232D39]">
                {formatYuan(record.intendedAmountYuan)} 元 / {record.intendedPeriods} 期
              </span>
            </div>
          </div>
        </NativeInfoCard>

        {locked && kind !== "unlock" && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <Lock className="mt-0.5 size-4 shrink-0" />
            <span>该单据已触发 5 次熔断锁定，请先执行线下特批解封。</span>
          </div>
        )}

        <NativeInfoCard title={ACTION_LABEL[kind]}>
          {kind === "revive" && (
            <div className="divide-y divide-gray-100">
              <NativeFormRow label="意向金额(元)" required>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full text-right text-xs text-[#232D39] outline-none"
                />
              </NativeFormRow>
              <NativeFormRow label="意向期数(月)" required>
                <input
                  type="number"
                  value={periodsInput}
                  onChange={(e) => setPeriodsInput(e.target.value)}
                  className="w-full text-right text-xs text-[#232D39] outline-none"
                />
              </NativeFormRow>
              <div className="pt-2">
                <div className="mb-1 text-xs font-medium text-gray-600">
                  补正说明 <span className="text-rose-500">*</span>
                </div>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="请填写补正资料说明（不少于 5 字）"
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {((kind === "routeAssign" && record.needDiligence) ||
            kind === "reinitDiligence") && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">
                选择尽调专员 <span className="text-rose-500">*</span>
              </div>
              {selectableSurveyors.map((s) => {
                const selected = selectedSurveyorId === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSurveyorId(s.id)}
                    className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs ${
                      selected
                        ? "border-blue-600 bg-blue-50/70"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#232D39]">{s.name}</div>
                      <div className="text-[11px] text-gray-500">{s.org}</div>
                    </div>
                    <span className="text-[11px] text-blue-600">
                      {selected ? "已选" : "选择"}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {((kind === "routeAssign" && !record.needDiligence) ||
            kind === "skipDiligence" ||
            kind === "reassignFunder") && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">
                选择合作资金方机构 <span className="text-rose-500">*</span>
              </div>
              {FUNDER_OPTIONS.map((f) => {
                const selected = selectedFunderId === f.id
                const wasRejected = record.historicalRejectedFunders.includes(f.name)
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFunderId(f.id)}
                    className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs ${
                      selected
                        ? "border-blue-600 bg-blue-50/70"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 font-semibold text-[#232D39]">
                        <span>{f.name}</span>
                        {wasRejected && (
                          <span className="rounded bg-rose-50 px-1 py-0.5 text-[10px] font-semibold text-rose-600">
                            *历史曾拒
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] text-blue-600">
                      {selected ? "已选" : "选择"}
                    </span>
                  </button>
                )
              })}

              {kind === "skipDiligence" && (
                <div className="pt-2">
                  <div className="mb-1 text-xs font-medium text-gray-600">
                    风控特批理由（不少于 20 字） <span className="text-rose-500">*</span>
                  </div>
                  <textarea
                    rows={3}
                    value={specialReason}
                    onChange={(e) => setSpecialReason(e.target.value)}
                    placeholder="请填写跳过尽调的特批依据..."
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          )}

          {kind === "unlock" && (
            <NativeFormRow label="特批工单号" required>
              <input
                value={ticketNo}
                onChange={(e) => setTicketNo(e.target.value)}
                className="w-full text-right text-xs text-[#232D39] outline-none"
              />
            </NativeFormRow>
          )}

          {error && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-rose-50 p-2 text-xs text-rose-600">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </NativeInfoCard>
      </div>

      {/* 吸底提交栏 */}
      <div className="sticky bottom-0 z-30 flex gap-2 border-t border-gray-200 bg-white p-3">
        <button
          type="button"
          onClick={() => navigate(h5RejectPoolDetailPath(record.id))}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-medium text-gray-700"
        >
          返回
        </button>
        <button
          type="button"
          onClick={handleValidate}
          className="flex-[2] rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white"
        >
          提交{ACTION_LABEL[kind]}
        </button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-[#232D39]">
              确认执行「{ACTION_LABEL[kind]}」？
            </h3>
            <p className="mt-1.5 text-xs text-gray-500">
              单据 {record.applyNo} 将更新状态并记录审计批次。
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-600"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-xs font-medium text-white"
              >
                确认执行
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed left-1/2 top-14 z-[60] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-xs text-white shadow-lg">
          <CheckCircle2 className="size-3.5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </MobileShell>
  )
}

