import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"
import {
  H5_ONLINE_PLEDGE_LIST_PATH,
  formatYuan,
  h5OnlinePledgeDetailPath,
  nowFormatted,
  todayDateString,
  type OnlinePledgeRecord,
} from "../domain/types"
import {
  loadH5OnlinePledgeRecords,
  saveH5OnlinePledgeRecords,
} from "./OnlinePledgeListPage"

export type H5OnlinePledgeActionKind =
  | "initiate"
  | "audit"
  | "cancel"
  | "disburse"

const ACTION_LABEL: Record<H5OnlinePledgeActionKind, string> = {
  initiate: "发起抵质押信息确认",
  audit: "抵质押流程审核",
  cancel: "主动撤销办理申请",
  disburse: "录入贷款发放结果",
}

function defaultAction(record: OnlinePledgeRecord): H5OnlinePledgeActionKind {
  if (record.financingStatus === "CREDIT_SUCCESS") return "initiate"
  if (record.financingStatus === "IN_PROCESSING") {
    return record.processingStage === "ORDER_GENERATED" ? "disburse" : "audit"
  }
  return "initiate"
}

export function OnlinePledgeActionPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [record, setRecord] = useState<OnlinePledgeRecord | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [auditDecision, setAuditDecision] = useState<"APPROVE" | "REJECT">("APPROVE")
  const [reason, setReason] = useState("")
  const [loanAmount, setLoanAmount] = useState("")
  const [loanPeriods, setLoanPeriods] = useState("")
  const [disburseDate, setDisburseDate] = useState(todayDateString())
  const [receiptFileName, setReceiptFileName] = useState("银行电子回单_放款凭证.pdf")
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const list = loadH5OnlinePledgeRecords()
    const decoded = id ? decodeURIComponent(id) : ""
    const found =
      list.find((item) => item.id === decoded || item.applyNo === decoded) ??
      list[0] ??
      null
    setRecord(found)
    if (found) {
      const defaults =
        found.collateralType === "INVENTORY"
          ? found.inventoryItems
              .filter((x) => x.availability === "AVAILABLE")
              .map((x) => x.id)
          : found.receiptItems.map((x) => x.id)
      setSelectedIds(defaults)
      setLoanAmount(String(found.creditAmountYuan))
      setLoanPeriods(String(found.creditPeriods))
      setDisburseDate(todayDateString())
      setReason("")
      setError(null)
    }
  }, [id])

  const kind: H5OnlinePledgeActionKind = useMemo(() => {
    if (!record) return "initiate"
    const raw = searchParams.get("action") as H5OnlinePledgeActionKind | null
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
        <NavBar
          title="业务办理"
          showBack
          onBack={() => navigate(H5_ONLINE_PLEDGE_LIST_PATH)}
        />
        <div className="p-6 text-center text-xs text-gray-500">未找到对应单据</div>
      </MobileShell>
    )
  }

  const selectedAssessedValue =
    record.collateralType === "INVENTORY"
      ? record.inventoryItems
          .filter((x) => selectedIds.includes(x.id))
          .reduce((s, x) => s + x.assessedValueYuan, 0)
      : record.receiptItems
          .filter((x) => selectedIds.includes(x.id))
          .reduce((s, x) => s + x.assessedValueYuan, 0)

  const validate = (): string | null => {
    if (kind === "initiate") {
      if (selectedIds.length === 0) return "请至少选择 1 项拟质押标的"
      if (record.collateralType === "INVENTORY") {
        const hasOccupied = record.inventoryItems.some(
          (x) => selectedIds.includes(x.id) && x.availability === "OCCUPIED",
        )
        if (hasOccupied) return "发起失败：质押货物已被占用或状态异常"
      }
      return null
    }
    if (kind === "audit" && auditDecision === "REJECT") {
      const len = reason.trim().length
      if (len < 10 || len > 200) return "拒绝原因必填，长度 10~200 字"
    }
    if (kind === "cancel") {
      if (record.processingStage === "ORDER_GENERATED") {
        return "撤销失败：订单已开立，无法撤销"
      }
      const len = reason.trim().length
      if (len < 10 || len > 200) return "撤销原因必填，长度 10~200 字"
    }
    if (kind === "disburse") {
      const amt = Number(loanAmount)
      if (!Number.isFinite(amt) || amt <= 0) return "请输入大于 0 的贷款金额"
      if (amt > record.creditAmountYuan) {
        return `放款金额不可超过授信额度（${formatYuan(record.creditAmountYuan)}）`
      }
      const per = Number(loanPeriods)
      if (!Number.isInteger(per) || per < 1 || per > record.creditPeriods) {
        return `贷款期数须为 1 ~ ${record.creditPeriods} 的正整数`
      }
      if (!disburseDate) return "请选择放款日期"
      if (!receiptFileName.trim()) return "请填写或上传放款凭证"
    }
    return null
  }

  const handleOpenConfirm = () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setConfirmOpen(true)
  }

  const handleExecute = () => {
    const now = nowFormatted()
    let updated: OnlinePledgeRecord = { ...record }
    let msg = ""

    if (kind === "initiate") {
      updated = {
        ...record,
        financingStatus: "IN_PROCESSING",
        processingStage: "INFO_REVIEW",
        assessedValueYuan: selectedAssessedValue,
        handlerName: "当前经办人 (H5)",
        handledAt: now,
        version: record.version + 1,
        inventoryItems: record.inventoryItems.map((inv) =>
          selectedIds.includes(inv.id) ? { ...inv, availability: "LOCKED" } : inv,
        ),
        receiptItems: record.receiptItems.map((wr) =>
          selectedIds.includes(wr.id) ? { ...wr, availability: "LOCKED" } : wr,
        ),
        timeline: [
          {
            id: `tl-${Date.now()}`,
            time: now,
            action: "发起抵质押信息确认",
            operator: "当前经办人 (H5)",
            operatorOrg: "移动端操作",
            result: "处理中（信息确认审核中）",
            remark: `已锁定标的（评估货值 ${formatYuan(selectedAssessedValue)}）。`,
          },
          ...record.timeline,
        ],
      }
      msg = "发起抵质押信息确认成功"
    } else if (kind === "audit") {
      if (auditDecision === "APPROVE") {
        const orderNo = `PO-${now.slice(0, 10).replaceAll("-", "")}-${String(Math.floor(1000 + Math.random() * 9000))}`
        updated = {
          ...record,
          financingStatus: "IN_PROCESSING",
          processingStage: "ORDER_GENERATED",
          pledgeOrderNo: orderNo,
          evidenceHash: Array.from({ length: 64 }, (_, idx) =>
            ((Date.now() + idx * 13) % 16).toString(16),
          ).join(""),
          handlerName: "风控审核员 (H5)",
          handledAt: now,
          version: record.version + 1,
          timeline: [
            {
              id: `tl-${Date.now()}`,
              time: now,
              action: "流程审核通过 · 订单生成",
              operator: "风控审核员 (H5)",
              operatorOrg: "森云风控合规部",
              result: "订单已生成（不可撤销）",
              remark: `生成抵质押订单 ${orderNo}。`,
            },
            ...record.timeline,
          ],
        }
        msg = "审核通过，已生成抵质押订单"
      } else {
        updated = {
          ...record,
          financingStatus: "CREDIT_SUCCESS",
          processingStage: undefined,
          lastRollbackReason: reason.trim(),
          handlerName: "风控审核员 (H5)",
          handledAt: now,
          version: record.version + 1,
          inventoryItems: record.inventoryItems.map((inv) =>
            inv.availability === "LOCKED" ? { ...inv, availability: "AVAILABLE" } : inv,
          ),
          receiptItems: record.receiptItems.map((wr) =>
            wr.availability === "LOCKED" ? { ...wr, availability: "AVAILABLE" } : wr,
          ),
          timeline: [
            {
              id: `tl-${Date.now()}`,
              time: now,
              action: "审核拒绝 · 本地回退",
              operator: "风控审核员 (H5)",
              operatorOrg: "森云风控合规部",
              result: "回退至申请成功",
              remark: `拒绝原因：${reason.trim()}`,
            },
            ...record.timeline,
          ],
        }
        msg = "审核已拒绝，单据已本地回退至「申请成功」"
      }
    } else if (kind === "cancel") {
      updated = {
        ...record,
        financingStatus: "CREDIT_SUCCESS",
        processingStage: undefined,
        lastRollbackReason: `主动撤销：${reason.trim()}`,
        handlerName: "当前经办人 (H5)",
        handledAt: now,
        version: record.version + 1,
        inventoryItems: record.inventoryItems.map((inv) =>
          inv.availability === "LOCKED" ? { ...inv, availability: "AVAILABLE" } : inv,
        ),
        receiptItems: record.receiptItems.map((wr) =>
          wr.availability === "LOCKED" ? { ...wr, availability: "AVAILABLE" } : wr,
        ),
        timeline: [
          {
            id: `tl-${Date.now()}`,
            time: now,
            action: "用户主动撤销 · 本地回退",
            operator: "当前经办人 (H5)",
            operatorOrg: "移动端操作",
            result: "回退至申请成功",
            remark: `撤销原因：${reason.trim()}`,
          },
          ...record.timeline,
        ],
      }
      msg = "已主动撤销，单据已本地回退至「申请成功」"
    } else {
      const amt = Number(loanAmount)
      const per = Number(loanPeriods)
      const ratio =
        record.assessedValueYuan > 0
          ? Number(((amt / record.assessedValueYuan) * 100).toFixed(2))
          : 0
      updated = {
        ...record,
        financingStatus: "LOAN_DISBURSED",
        processingStage: undefined,
        loanAmountYuan: amt,
        loanPeriods: per,
        disburseDate,
        disburseReceiptFileName: receiptFileName.trim(),
        approvedPledgeRatio: ratio,
        handlerName: "当前经办人 (H5)",
        handledAt: now,
        version: record.version + 1,
        timeline: [
          {
            id: `tl-${Date.now()}`,
            time: now,
            action: "录入贷款发放结果",
            operator: "当前经办人 (H5)",
            operatorOrg: "移动端操作",
            result: "已放款",
            remark: `实际放款 ${formatYuan(amt)}，期数 ${per} 期。`,
          },
          ...record.timeline,
        ],
      }
      msg = "放款结果录入成功"
    }

    const all = loadH5OnlinePledgeRecords().map((item) =>
      item.id === updated.id ? updated : item,
    )
    saveH5OnlinePledgeRecords(all)
    setConfirmOpen(false)
    showToast(msg)
    window.setTimeout(() => {
      navigate(h5OnlinePledgeDetailPath(updated.id))
    }, 650)
  }

  return (
    <MobileShell>
      <NavBar
        title={ACTION_LABEL[kind]}
        showBack
        onBack={() => navigate(h5OnlinePledgeDetailPath(record.id))}
      />

      <div className="space-y-3 bg-[#F6F8FA] p-3 pb-24 min-h-[calc(100%-44px)]">
        <NativeInfoCard title="单据授信基准">
          <NativeFormRow label="申请单号">
            <span className="text-xs font-medium text-[#232D39]">{record.applyNo}</span>
          </NativeFormRow>
          <NativeFormRow label="申请人">
            <span className="text-xs font-medium text-[#232D39]">{record.applicantName}</span>
          </NativeFormRow>
          <NativeFormRow label="授信额度">
            <span className="text-xs font-semibold text-[#232D39]">
              {formatYuan(record.creditAmountYuan)}（{record.creditPeriods} 期）
            </span>
          </NativeFormRow>
        </NativeInfoCard>

        {kind === "initiate" && (
          <NativeInfoCard title="勾选拟质押标的">
            <div className="space-y-2 p-1">
              {record.collateralType === "INVENTORY"
                ? record.inventoryItems.map((inv) => {
                    const checked = selectedIds.includes(inv.id)
                    const occupied = inv.availability === "OCCUPIED"
                    return (
                      <label
                        key={inv.id}
                        className={`flex items-center justify-between gap-2 rounded-lg border p-2.5 text-xs ${
                          occupied
                            ? "border-rose-200 bg-rose-50"
                            : checked
                              ? "border-[#2E54C6] bg-[#2E54C6]/5"
                              : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setSelectedIds((prev) =>
                                e.target.checked
                                  ? [...prev, inv.id]
                                  : prev.filter((x) => x !== inv.id),
                              )
                            }
                          />
                          <div>
                            <div className="font-medium text-[#232D39]">
                              {inv.varietyName} · {inv.pledgeQuantity} {inv.unit}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {inv.warehouseName}
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold">
                          {occupied ? "已占用" : formatYuan(inv.assessedValueYuan)}
                        </span>
                      </label>
                    )
                  })
                : record.receiptItems.map((wr) => (
                    <label
                      key={wr.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-[#2E54C6] bg-[#2E54C6]/5 p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(wr.id)}
                          onChange={(e) =>
                            setSelectedIds((prev) =>
                              e.target.checked
                                ? [...prev, wr.id]
                                : prev.filter((x) => x !== wr.id),
                            )
                          }
                        />
                        <div>
                          <div className="font-medium text-[#232D39]">
                            {wr.receiptNo}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {wr.goodsSummary}
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {formatYuan(wr.assessedValueYuan)}
                      </span>
                    </label>
                  ))}
              <div className="pt-1 text-right text-xs font-semibold text-[#2E54C6]">
                已选评估货值：{formatYuan(selectedAssessedValue)}
              </div>
            </div>
          </NativeInfoCard>
        )}

        {kind === "audit" && (
          <NativeInfoCard title="审核结论">
            <div className="space-y-3 p-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuditDecision("APPROVE")}
                  className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg border py-2 text-xs font-medium ${
                    auditDecision === "APPROVE"
                      ? "border-[#2E54C6] bg-[#2E54C6] text-white"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <CheckCircle2 className="size-3.5" />
                  审核通过
                </button>
                <button
                  type="button"
                  onClick={() => setAuditDecision("REJECT")}
                  className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg border py-2 text-xs font-medium ${
                    auditDecision === "REJECT"
                      ? "border-rose-600 bg-rose-600 text-white"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <ShieldAlert className="size-3.5" />
                  审核拒绝
                </button>
              </div>
              {auditDecision === "REJECT" && (
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="请录入审核拒绝原因（10~200 字）"
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs outline-none focus:border-[#2E54C6]"
                />
              )}
            </div>
          </NativeInfoCard>
        )}

        {kind === "cancel" && (
          <NativeInfoCard title="主动撤销原因">
            <div className="p-1">
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="请录入撤销原因（10~200 字），撤销后单据本地回退至「申请成功」"
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs outline-none focus:border-[#2E54C6]"
              />
            </div>
          </NativeInfoCard>
        )}

        {kind === "disburse" && (
          <NativeInfoCard title="放款结果录入">
            <div className="space-y-3 p-1 text-xs">
              <div>
                <div className="mb-1 text-gray-500">
                  贷款金额（元）<span className="text-rose-600">*</span>
                </div>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 px-2.5 outline-none focus:border-[#2E54C6]"
                />
              </div>
              <div>
                <div className="mb-1 text-gray-500">
                  贷款期数（期）<span className="text-rose-600">*</span>
                </div>
                <input
                  type="number"
                  value={loanPeriods}
                  onChange={(e) => setLoanPeriods(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 px-2.5 outline-none focus:border-[#2E54C6]"
                />
              </div>
              <div>
                <div className="mb-1 text-gray-500">
                  放款日期 <span className="text-rose-600">*</span>
                </div>
                <input
                  type="date"
                  value={disburseDate}
                  onChange={(e) => setDisburseDate(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 px-2.5 outline-none focus:border-[#2E54C6]"
                />
              </div>
              <div>
                <div className="mb-1 text-gray-500">
                  放款凭证附件 <span className="text-rose-600">*</span>
                </div>
                <input
                  type="text"
                  value={receiptFileName}
                  onChange={(e) => setReceiptFileName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 px-2.5 outline-none focus:border-[#2E54C6]"
                />
              </div>
            </div>
          </NativeInfoCard>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white px-3 py-2.5">
        <button
          type="button"
          onClick={handleOpenConfirm}
          className="w-full rounded-full bg-[#2E54C6] py-2.5 text-xs font-semibold text-white"
        >
          提交{ACTION_LABEL[kind]}
        </button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-4 space-y-3">
            <div className="text-sm font-semibold text-[#232D39]">
              二次确认 · {ACTION_LABEL[kind]}
            </div>
            <div className="text-xs text-gray-600">
              确认对单据【{record.applyNo}】执行「{ACTION_LABEL[kind]}」操作？
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-full border border-gray-200 py-2 text-xs font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleExecute}
                className="flex-1 rounded-full bg-[#2E54C6] py-2 text-xs font-medium text-white"
              >
                确认执行
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900/90 px-4 py-2 text-xs text-white shadow-lg">
          {toast}
        </div>
      )}
    </MobileShell>
  )
}
