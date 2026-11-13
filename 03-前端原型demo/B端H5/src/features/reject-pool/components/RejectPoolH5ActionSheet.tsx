import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import {
  AlertTriangle,
  Check,
  ShieldAlert,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { resolveOverlayRoot } from "@/shared/lib/overlay-root"
import { H5_PRIMARY } from "@/shared/h5-ui-theme"
import {
  REJECT_POOL_REASSIGN_FUNDER_SPEC_NOTE,
  REJECT_POOL_REASSIGN_FUNDER_USER_HINT,
  REJECT_POOL_REINIT_DILIGENCE_SPEC_NOTE,
  REJECT_POOL_REINIT_DILIGENCE_USER_HINT,
  REJECT_POOL_REVIVE_SPEC_NOTE,
  REJECT_POOL_REVIVE_USER_HINT,
  REJECT_POOL_ROUTE_ASSIGN_SPEC_NOTE,
  REJECT_POOL_ROUTE_ASSIGN_USER_HINT,
  REJECT_POOL_SKIP_DILIGENCE_SPEC_NOTE,
  REJECT_POOL_SKIP_DILIGENCE_USER_HINT,
} from "@prototype/shared/reject-pool/reject-pool-ui-labels"
import {
  FUNDER_OPTIONS,
  SURVEYOR_OPTIONS,
  formatYuan,
  nextBatchNo,
  type CollateralType,
  type RejectPoolH5Filters,
  type RejectPoolRecord,
} from "../domain/types"

export type H5ActionKind =
  | "revive"
  | "routeAssign"
  | "reinitDiligence"
  | "skipDiligence"
  | "reassignFunder"
  | "unlock"

function BottomSheetPortal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  const root = resolveOverlayRoot()
  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/45">
      <button
        type="button"
        aria-label="关闭弹层"
        className="flex-1"
        onClick={onClose}
      />
      <div
        className="flex max-h-[82%] flex-col rounded-t-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 active:bg-gray-100"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{children}</div>
      </div>
    </div>,
    root,
  )
}

/** H5 更多筛选抽屉 */
export function RejectPoolH5FilterSheet({
  open,
  value,
  onClose,
  onReset,
  onConfirm,
}: {
  open: boolean
  value: RejectPoolH5Filters
  onClose: () => void
  onReset: () => void
  onConfirm: (next: RejectPoolH5Filters) => void
}) {
  const [draft, setDraft] = useState<RejectPoolH5Filters>(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  return (
    <BottomSheetPortal open={open} onClose={onClose} title="更多筛选条件">
      <div className="space-y-4 text-xs">
        <div className="space-y-2">
          <p className="font-semibold text-gray-800">融资业务状态</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "ALL", label: "全部状态" },
                { value: "APPLY_FAILED", label: "申请失败" },
                { value: "ACCEPT_FAILED", label: "受理失败" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setDraft((prev) => ({ ...prev, businessStatus: opt.value }))
                }
                className={`rounded-full px-3 py-1.5 text-xs ${
                  draft.businessStatus === opt.value
                    ? H5_PRIMARY.pillActive
                    : "border border-gray-200 bg-gray-50 text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-gray-800">退回日期区间</p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={draft.rejectedStart}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, rejectedStart: e.target.value }))
              }
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs"
            />
            <span className="text-gray-400">至</span>
            <input
              type="date"
              value={draft.rejectedEnd}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, rejectedEnd: e.target.value }))
              }
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs"
            />
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              onReset()
              onClose()
            }}
            className="h-10 flex-1 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700"
          >
            重置
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(draft)
              onClose()
            }}
            className={`h-10 flex-[1.3] rounded-lg text-xs font-medium ${H5_PRIMARY.btn}`}
          >
            确认筛选
          </button>
        </div>
      </div>
    </BottomSheetPortal>
  )
}

/** H5 重调度操作底部抽屉（覆盖 5 大场景 + 特批解封 + 表单校验 + 二次确认） */
export function RejectPoolH5ActionSheet({
  open,
  kind,
  record,
  onClose,
  onDone,
}: {
  open: boolean
  kind: H5ActionKind | null
  record: RejectPoolRecord | null
  onClose: () => void
  onDone: (payload: {
    kind: H5ActionKind
    record: RejectPoolRecord
    assigneeName?: string
    ticketNo?: string
    reason?: string
  }) => void
}) {
  const [applicantName, setApplicantName] = useState("")
  const [amountInput, setAmountInput] = useState("")
  const [periodsInput, setPeriodsInput] = useState("")
  const [collateralType, setCollateralType] = useState<CollateralType>("INVENTORY")
  const [receiptCode, setReceiptCode] = useState("")
  const [uploadedName, setUploadedName] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState("")
  const [note, setNote] = useState("")
  const [ticketNo, setTicketNo] = useState("OA-RISK-20261113-088")
  const [error, setError] = useState<string | null>(null)
  const [confirmStep, setConfirmStep] = useState(false)

  useEffect(() => {
    if (open && record) {
      setApplicantName(record.applicantName)
      setAmountInput(String(record.intendedAmountYuan))
      setPeriodsInput(String(record.intendedPeriods))
      setCollateralType(record.collateralType)
      setReceiptCode(record.warehouseReceiptCodes?.[0] ?? "")
      setUploadedName(null)
      setSelectedId("")
      setNote("")
      setTicketNo("OA-RISK-20261113-088")
      setError(null)
      setConfirmStep(false)
    }
  }, [open, record, kind])

  if (!record || !kind) return null

  const titleMap: Record<H5ActionKind, string> = {
    revive: "重新救活融资申请",
    routeAssign: "按路由重新指派",
    reinitDiligence: "重新发起尽调",
    skipDiligence: "变更路由直分资方",
    reassignFunder: "重新分配合作资方",
    unlock: "线下特批解除风控熔断",
  }

  const showFunderList =
    kind === "reassignFunder" ||
    kind === "skipDiligence" ||
    (kind === "routeAssign" && !record.needDiligence)

  const showSurveyorList =
    kind === "reinitDiligence" ||
    (kind === "routeAssign" && record.needDiligence)

  const selectedFunder = FUNDER_OPTIONS.find((f) => f.id === selectedId)
  const selectedSurveyor = SURVEYOR_OPTIONS.find((s) => s.id === selectedId)
  const isHistoricalFunder = Boolean(
    selectedFunder &&
      record.historicalRejectedFunders.includes(selectedFunder.name),
  )

  const validateBeforeConfirm = () => {
    if (kind === "revive") {
      if (applicantName.trim().length < 2) {
        setError("申请人名称不能为空。")
        return
      }
      const amt = Number(amountInput)
      if (!Number.isFinite(amt) || amt <= 0) {
        setError("意向融资金额必须大于 0。")
        return
      }
      const per = Number(periodsInput)
      if (!Number.isInteger(per) || per < 1) {
        setError("意向融资期数必须为正整数。")
        return
      }
      if (collateralType === "WAREHOUSE_RECEIPT" && !receiptCode.trim()) {
        setError("选择数字仓单时必须填写仓单编号。")
        return
      }
      if (note.trim().length < 5) {
        setError("请填写至少 5 个字的救活整改说明。")
        return
      }
    }

    if (showSurveyorList) {
      if (!selectedSurveyor) {
        setError("请选择处于启用状态的尽调服务方专员。")
        return
      }
      if (
        kind === "reinitDiligence" &&
        record.lastSurveyorId &&
        selectedSurveyor.id === record.lastSurveyorId
      ) {
        setError(
          `不可重复指派上一轮退回专员（${record.lastSurveyorName ?? selectedSurveyor.name}），请改选其他尽调专员。`,
        )
        return
      }
      if (kind === "reinitDiligence" && note.trim().length < 10) {
        setError("请填写不少于 10 个字的重调度核查重点说明。")
        return
      }
    }

    if (showFunderList) {
      if (!selectedFunder) {
        setError("请选择合作资金方机构。")
        return
      }
      if (kind === "skipDiligence" && note.trim().length < 20) {
        setError("风控总监特批免尽调说明不少于 20 个字。")
        return
      }
      if (kind === "reassignFunder" && note.trim().length < 5) {
        setError("请填写至少 5 个字的改派资方说明。")
        return
      }
    }

    if (kind === "unlock") {
      if (!ticketNo.trim() || note.trim().length < 10) {
        setError("请填写特批工单号及不少于 10 个字的特批解封说明。")
        return
      }
    }

    setError(null)
    setConfirmStep(true)
  }

  const handleFinalSubmit = () => {
    const assigneeName = selectedFunder?.name ?? selectedSurveyor?.name
    onDone({
      kind,
      record,
      assigneeName,
      ticketNo: ticketNo.trim(),
      reason: note.trim(),
    })
    onClose()
  }

  return (
    <BottomSheetPortal open={open} onClose={onClose} title={`${titleMap[kind]} · ${record.applyNo}`}>
      {!confirmStep ? (
        <div className="space-y-3.5 text-xs">
          {kind === "revive" && (
            <>
              <ProductFieldHint>{REJECT_POOL_REVIVE_USER_HINT}</ProductFieldHint>
              <div className="space-y-2">
                <label className="block font-medium text-gray-800">
                  申请人名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block font-medium text-gray-800">
                    意向金额(元) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-gray-800">
                    意向期数(期) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={periodsInput}
                    onChange={(e) => setPeriodsInput(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block font-medium text-gray-800">
                  抵/质押物类型 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "INVENTORY", label: "现货存货" },
                      { value: "WAREHOUSE_RECEIPT", label: "数字仓单" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCollateralType(opt.value)}
                      className={`rounded-lg border py-2 text-xs font-medium ${
                        collateralType === opt.value
                          ? H5_PRIMARY.pillActive
                          : "border-gray-200 bg-gray-50 text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {collateralType === "WAREHOUSE_RECEIPT" && (
                <div className="space-y-1">
                  <label className="block font-medium text-gray-800">
                    数字仓单编号 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={receiptCode}
                    onChange={(e) => setReceiptCode(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() =>
                  setUploadedName(`补充增信合同_${record.applyNo}.pdf`)
                }
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-blue-300 bg-blue-50/40 py-2 text-xs font-medium text-blue-600"
              >
                <Upload className="size-3.5" />
                {uploadedName ? `已补充：${uploadedName}` : "模拟上传补充材料"}
              </button>
              <PrototypeSpecCallout>{REJECT_POOL_REVIVE_SPEC_NOTE}</PrototypeSpecCallout>
            </>
          )}

          {kind === "routeAssign" && (
            <>
              <ProductFieldHint>{REJECT_POOL_ROUTE_ASSIGN_USER_HINT}</ProductFieldHint>
              <div className="rounded-lg bg-blue-50/70 px-3 py-2 text-xs font-medium text-blue-800">
                当前路由：{record.needDiligence ? "需要尽调 = 是（派尽调专员）" : "需要尽调 = 否（直推资金方）"}
              </div>
              <PrototypeSpecCallout>{REJECT_POOL_ROUTE_ASSIGN_SPEC_NOTE}</PrototypeSpecCallout>
            </>
          )}

          {kind === "reinitDiligence" && (
            <>
              <ProductFieldHint>{REJECT_POOL_REINIT_DILIGENCE_USER_HINT}</ProductFieldHint>
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-900">
                上轮拒单/退回专员：{record.lastSurveyorName ?? record.rejectHandler}
              </div>
              <PrototypeSpecCallout>{REJECT_POOL_REINIT_DILIGENCE_SPEC_NOTE}</PrototypeSpecCallout>
            </>
          )}

          {kind === "skipDiligence" && (
            <>
              <ProductFieldHint>{REJECT_POOL_SKIP_DILIGENCE_USER_HINT}</ProductFieldHint>
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-900">
                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <span>提交后「需要尽调」将变更为否，直接推送合作资方（授信已受理）。</span>
              </div>
              <PrototypeSpecCallout>{REJECT_POOL_SKIP_DILIGENCE_SPEC_NOTE}</PrototypeSpecCallout>
            </>
          )}

          {kind === "reassignFunder" && (
            <>
              <ProductFieldHint>{REJECT_POOL_REASSIGN_FUNDER_USER_HINT}</ProductFieldHint>
              <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-900">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span>原尽调报告与信用结论继续有效，无需退回重做尽调。</span>
              </div>
              <PrototypeSpecCallout>{REJECT_POOL_REASSIGN_FUNDER_SPEC_NOTE}</PrototypeSpecCallout>
            </>
          )}

          {kind === "unlock" && (
            <div className="space-y-2">
              <label className="block font-medium text-gray-800">
                线下特批工单号 <span className="text-rose-500">*</span>
              </label>
              <input
                value={ticketNo}
                onChange={(e) => setTicketNo(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
              />
            </div>
          )}

          {showSurveyorList && (
            <div className="space-y-2">
              <label className="block font-medium text-gray-800">
                选择尽调专员 <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-1.5">
                {SURVEYOR_OPTIONS.map((s) => {
                  const active = selectedId === s.id
                  const isPrev =
                    kind === "reinitDiligence" && record.lastSurveyorId === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedId(s.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left ${
                        active
                          ? "border-blue-500 bg-blue-50/60"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                          <span>{s.name}</span>
                          {isPrev && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                              上轮退回专员
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500">{s.org}</div>
                      </div>
                      {active && <Check className="size-4 text-blue-600" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {showFunderList && (
            <div className="space-y-2">
              <label className="block font-medium text-gray-800">
                选择合作资金方 <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-1.5">
                {FUNDER_OPTIONS.map((f) => {
                  const active = selectedId === f.id
                  const prevRejected = record.historicalRejectedFunders.includes(
                    f.name,
                  )
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedId(f.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left ${
                        active
                          ? "border-blue-500 bg-blue-50/60"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 font-semibold text-gray-900">
                          <span>{f.name}</span>
                          {prevRejected && (
                            <span className="rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                              *历史曾拒
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500">{f.tag}</div>
                      </div>
                      {active && <Check className="size-4 text-blue-600" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-800">
                {kind === "skipDiligence"
                  ? "风控总监特批免尽调说明"
                  : kind === "revive"
                    ? "救活整改说明"
                    : kind === "unlock"
                      ? "特批解封说明"
                      : "重调度说明"}
                {kind !== "routeAssign" && <span className="text-rose-500"> *</span>}
              </label>
              {kind === "skipDiligence" && (
                <span className="text-[11px] text-amber-600">
                  {note.trim().length}/至少 20 字
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="请输入操作说明或核查要点..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-blue-400 focus:outline-hidden"
            />
          </div>

          {error && (
            <div className="flex items-start gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 flex-1 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700"
            >
              取消
            </button>
            <button
              type="button"
              onClick={validateBeforeConfirm}
              className={`h-10 flex-[1.3] rounded-lg text-xs font-medium ${H5_PRIMARY.btn}`}
            >
              下一步：确认提交
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-2 text-xs">
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 space-y-1.5">
            <p className="font-bold text-blue-900">二次确认：{titleMap[kind]}</p>
            <p className="text-blue-800">
              单号：{record.applyNo}（{applicantName}）
            </p>
            {kind === "revive" && (
              <p className="text-blue-800">
                救活额度：{formatYuan(Number(amountInput))} 元 / {periodsInput} 期
              </p>
            )}
            {(selectedFunder || selectedSurveyor) && (
              <p className="text-blue-800">
                目标对象：{selectedFunder?.name ?? selectedSurveyor?.name}（新批次{" "}
                {nextBatchNo(record.batchNo)}）
              </p>
            )}
          </div>

          {isHistoricalFunder && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
              高风险提示：所选资金方「{selectedFunder?.name}」为历史曾拒机构（*历史曾拒），确认再次向其发起授信？
            </div>
          )}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setConfirmStep(false)}
              className="h-10 flex-1 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700"
            >
              返回修改
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className={`h-10 flex-[1.3] rounded-lg text-xs font-medium ${H5_PRIMARY.btn}`}
            >
              确认执行重调度
            </button>
          </div>
        </div>
      )}
    </BottomSheetPortal>
  )
}

