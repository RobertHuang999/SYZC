import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ShieldAlertIcon,
  UploadIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"
import {
  ONLINE_PLEDGE_DISBURSE_SPEC_NOTE,
  ONLINE_PLEDGE_DISBURSE_USER_HINT,
  ONLINE_PLEDGE_INITIATE_SPEC_NOTE,
  ONLINE_PLEDGE_INITIATE_USER_HINT,
  ONLINE_PLEDGE_ROLLBACK_SPEC_NOTE,
  ONLINE_PLEDGE_ROLLBACK_USER_HINT,
} from "@prototype/shared/online-pledge/online-pledge-ui-labels"
import { onlinePledgeDetailAnnotations } from "../annotations/online-pledge-detail.annotations"
import { onlinePledgeDocuments } from "../documents/online-pledge-documents"
import {
  FINANCING_STATUS_META,
  ONLINE_PLEDGE_LIST_PATH,
  formatYuan,
  nowFormatted,
  onlinePledgeDetailPath,
  todayDateString,
  type OnlinePledgeRecord,
} from "../domain/types"
import {
  loadOnlinePledgeRecords,
  saveOnlinePledgeRecords,
} from "./OnlinePledgeListPage"

export type OnlinePledgeActionKind =
  | "initiate"
  | "audit"
  | "cancel"
  | "disburse"

const ACTION_TITLE_MAP: Record<OnlinePledgeActionKind, string> = {
  initiate: "发起抵质押信息确认",
  audit: "抵质押信息与流程审核",
  cancel: "用户主动撤销办理申请",
  disburse: "录入贷款发放结果",
}

function resolveDefaultAction(record: OnlinePledgeRecord): OnlinePledgeActionKind {
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
  const [selectedCollateralIds, setSelectedCollateralIds] = useState<string[]>([])
  const [auditDecision, setAuditDecision] = useState<"APPROVE" | "REJECT">("APPROVE")
  const [reason, setReason] = useState("")
  const [loanAmount, setLoanAmount] = useState("")
  const [loanPeriods, setLoanPeriods] = useState("")
  const [disburseDate, setDisburseDate] = useState(todayDateString())
  const [receiptFileName, setReceiptFileName] = useState("银行电子回单_放款凭证.pdf")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const list = loadOnlinePledgeRecords()
    const decoded = id ? decodeURIComponent(id) : ""
    const found =
      list.find((item) => item.id === decoded || item.applyNo === decoded) ??
      list[0] ??
      null
    setRecord(found)
    if (found) {
      const defaultIds =
        found.collateralType === "INVENTORY"
          ? found.inventoryItems
              .filter((x) => x.availability === "AVAILABLE")
              .map((x) => x.id)
          : found.receiptItems.map((x) => x.id)
      setSelectedCollateralIds(defaultIds)
      setLoanAmount(String(found.creditAmountYuan))
      setLoanPeriods(String(found.creditPeriods))
      setDisburseDate(todayDateString())
      setReason("")
      setErrorMsg(null)
    }
  }, [id])

  const kind: OnlinePledgeActionKind = useMemo(() => {
    if (!record) return "initiate"
    const raw = searchParams.get("action") as OnlinePledgeActionKind | null
    if (raw && ACTION_TITLE_MAP[raw]) return raw
    return resolveDefaultAction(record)
  }, [record, searchParams])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 2800)
  }

  const selectedAssessedValue = useMemo(() => {
    if (!record) return 0
    if (record.collateralType === "INVENTORY") {
      return record.inventoryItems
        .filter((x) => selectedCollateralIds.includes(x.id))
        .reduce((sum, x) => sum + x.assessedValueYuan, 0)
    }
    return record.receiptItems
      .filter((x) => selectedCollateralIds.includes(x.id))
      .reduce((sum, x) => sum + x.assessedValueYuan, 0)
  }, [record, selectedCollateralIds])

  const estimatedPledgeRatio = useMemo(() => {
    if (!record || selectedAssessedValue <= 0) return 0
    return (record.creditAmountYuan / selectedAssessedValue) * 100
  }, [record, selectedAssessedValue])

  if (!record) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-card p-8 text-center">
          <div className="text-base font-medium">未找到对应业务单据</div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => navigate(ONLINE_PLEDGE_LIST_PATH)}
          >
            返回列表
          </Button>
        </div>
      </div>
    )
  }

  const validateBeforeConfirm = (): string | null => {
    if (kind === "initiate") {
      if (selectedCollateralIds.length === 0) {
        return "请至少选择 1 项拟质押标的"
      }
      if (record.collateralType === "INVENTORY") {
        const hasOccupied = record.inventoryItems.some(
          (x) =>
            selectedCollateralIds.includes(x.id) &&
            x.availability === "OCCUPIED",
        )
        if (hasOccupied) {
          return "发起失败：质押货物已被占用或状态异常（请取消勾选异常标的）"
        }
      }
      return null
    }

    if (kind === "audit") {
      if (auditDecision === "REJECT") {
        const len = reason.trim().length
        if (len < 10 || len > 200) {
          return "审核拒绝原因必填，且长度需在 10~200 字之间"
        }
      }
      return null
    }

    if (kind === "cancel") {
      if (record.processingStage === "ORDER_GENERATED") {
        return "撤销失败：订单已开立，无法撤销"
      }
      const len = reason.trim().length
      if (len < 10 || len > 200) {
        return "撤销原因必填，且长度需在 10~200 字之间"
      }
      return null
    }

    if (kind === "disburse") {
      const amt = Number(loanAmount)
      if (!Number.isFinite(amt) || amt <= 0) {
        return "请输入有效的贷款金额（必须大于 0）"
      }
      if (amt > record.creditAmountYuan) {
        return `放款金额不可超过核定授信额度（${formatYuan(record.creditAmountYuan)}）`
      }
      const per = Number(loanPeriods)
      if (!Number.isInteger(per) || per < 1 || per > record.creditPeriods) {
        return `贷款期数须为 1 ~ ${record.creditPeriods} 之间的正整数`
      }
      if (!disburseDate) {
        return "请选择放款日期"
      }
      if (!receiptFileName.trim()) {
        return "请上传放款凭证附件"
      }
      return null
    }

    return null
  }

  const handleOpenConfirm = () => {
    const err = validateBeforeConfirm()
    if (err) {
      setErrorMsg(err)
      return
    }
    setErrorMsg(null)
    setConfirmOpen(true)
  }

  const handleExecute = () => {
    const now = nowFormatted()
    let updated: OnlinePledgeRecord = { ...record }
    let successToast = ""

    if (kind === "initiate") {
      updated = {
        ...record,
        financingStatus: "IN_PROCESSING",
        processingStage: "INFO_REVIEW",
        assessedValueYuan: selectedAssessedValue,
        handlerName: "当前经办人 (SY-1001)",
        handledAt: now,
        version: record.version + 1,
        inventoryItems: record.inventoryItems.map((inv) =>
          selectedCollateralIds.includes(inv.id)
            ? { ...inv, availability: "LOCKED" }
            : inv,
        ),
        receiptItems: record.receiptItems.map((wr) =>
          selectedCollateralIds.includes(wr.id)
            ? { ...wr, availability: "LOCKED" }
            : wr,
        ),
        timeline: [
          {
            id: `tl-${Date.now()}`,
            time: now,
            action: "发起抵质押信息确认",
            operator: "当前经办人 (SY-1001)",
            operatorOrg: "森云融资运营中心",
            result: "处理中（信息确认审核中）",
            remark: `已锁定拟质押标的（评估总货值 ${formatYuan(selectedAssessedValue)}），生成风控审核任务。`,
          },
          ...record.timeline,
        ],
      }
      successToast = "发起抵质押信息确认成功，已锁定标的并生成审核任务"
    } else if (kind === "audit") {
      if (auditDecision === "APPROVE") {
        const orderNo = `PO-${now.slice(0, 10).replaceAll("-", "")}-${String(Math.floor(1000 + Math.random() * 9000))}`
        const hash = Array.from({ length: 64 }, (_, idx) =>
          ((Date.now() + idx * 17) % 16).toString(16),
        ).join("")
        updated = {
          ...record,
          financingStatus: "IN_PROCESSING",
          processingStage: "ORDER_GENERATED",
          pledgeOrderNo: orderNo,
          evidenceHash: hash,
          handlerName: "风控审核员 (SY-2008)",
          handledAt: now,
          version: record.version + 1,
          timeline: [
            {
              id: `tl-${Date.now()}`,
              time: now,
              action: "流程审核通过 · 订单生成",
              operator: "风控审核员 (SY-2008)",
              operatorOrg: "森云风控合规部",
              result: "订单已生成（不可撤销）",
              remark: `生成正式抵质押订单 ${orderNo}，区块链存证已固化，等待录入放款结果。`,
            },
            ...record.timeline,
          ],
        }
        successToast = "审核通过，已生成正式抵质押订单及电子存证"
      } else {
        updated = {
          ...record,
          financingStatus: "CREDIT_SUCCESS",
          processingStage: undefined,
          lastRollbackReason: reason.trim(),
          handlerName: "风控审核员 (SY-2008)",
          handledAt: now,
          version: record.version + 1,
          inventoryItems: record.inventoryItems.map((inv) =>
            inv.availability === "LOCKED"
              ? { ...inv, availability: "AVAILABLE" }
              : inv,
          ),
          receiptItems: record.receiptItems.map((wr) =>
            wr.availability === "LOCKED"
              ? { ...wr, availability: "AVAILABLE" }
              : wr,
          ),
          timeline: [
            {
              id: `tl-${Date.now()}`,
              time: now,
              action: "审核拒绝 · 本地回退",
              operator: "风控审核员 (SY-2008)",
              operatorOrg: "森云风控合规部",
              result: "回退至申请成功",
              remark: `拒绝原因：${reason.trim()}（本地回退，暂不流入被拒退回池）。`,
            },
            ...record.timeline,
          ],
        }
        successToast =
          "审核已拒绝，单据已本地回退至「申请成功」状态并释放标的锁定"
      }
    } else if (kind === "cancel") {
      updated = {
        ...record,
        financingStatus: "CREDIT_SUCCESS",
        processingStage: undefined,
        lastRollbackReason: `主动撤销：${reason.trim()}`,
        handlerName: "当前经办人 (SY-1001)",
        handledAt: now,
        version: record.version + 1,
        inventoryItems: record.inventoryItems.map((inv) =>
          inv.availability === "LOCKED"
            ? { ...inv, availability: "AVAILABLE" }
            : inv,
        ),
        receiptItems: record.receiptItems.map((wr) =>
          wr.availability === "LOCKED"
            ? { ...wr, availability: "AVAILABLE" }
            : wr,
        ),
        timeline: [
          {
            id: `tl-${Date.now()}`,
            time: now,
            action: "用户主动撤销 · 本地回退",
            operator: "当前经办人 (SY-1001)",
            operatorOrg: "森云融资运营中心",
            result: "回退至申请成功",
            remark: `撤销原因：${reason.trim()}（已释放标的临时锁定）。`,
          },
          ...record.timeline,
        ],
      }
      successToast = "已主动撤销办理申请，单据已本地回退至「申请成功」"
    } else if (kind === "disburse") {
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
        handlerName: "当前经办人 (SY-1001)",
        handledAt: now,
        version: record.version + 1,
        attachments: [
          {
            id: `att-${Date.now()}`,
            category: "放款回单",
            fileName: receiptFileName.trim(),
            fileSize: "768 KB",
            uploadedAt: now,
          },
          ...record.attachments,
        ],
        timeline: [
          {
            id: `tl-${Date.now()}`,
            time: now,
            action: "录入贷款发放结果",
            operator: "当前经办人 (SY-1001)",
            operatorOrg: "森云融资运营中心",
            result: "已放款",
            remark: `实际放款 ${formatYuan(amt)}，期数 ${per} 期，已全链路异步回写线索与尽调台账。`,
          },
          ...record.timeline,
        ],
      }
      successToast = "放款结果录入成功，已全链路回写线索与尽调台账"
    }

    const all = loadOnlinePledgeRecords().map((item) =>
      item.id === updated.id ? updated : item,
    )
    saveOnlinePledgeRecords(all)
    setConfirmOpen(false)
    showToast(successToast)
    window.setTimeout(() => {
      navigate(onlinePledgeDetailPath(updated.id))
    }, 650)
  }

  const statusMeta = FINANCING_STATUS_META[record.financingStatus]

  return (
    <PrototypeAnnotationProvider
      title={`${ACTION_TITLE_MAP[kind]} · ${record.applyNo}`}
      documents={onlinePledgeDocuments}
      annotations={onlinePledgeDetailAnnotations}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["online-pledge-detail-header"]}>
          <DetailPageHeader
            title={ACTION_TITLE_MAP[kind]}
            number={record.applyNo}
            numberLabel="申请单号"
            onBack={() => navigate(onlinePledgeDetailPath(record.id))}
            status={
              <Badge variant="outline" className={statusMeta.badgeClass}>
                {statusMeta.label}
              </Badge>
            }
          />
        </PrototypeAnnotationTarget>

        <DetailSection title="授信与单据基准信息">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField label="申请单号" value={record.applyNo} />
            <DetailField label="申请人名称" value={record.applicantName} />
            <DetailField
              label="核准授信金额（元）"
              value={
                <span className="font-semibold text-foreground">
                  {formatYuan(record.creditAmountYuan)}
                </span>
              }
            />
            <DetailField
              label="核准授信期数"
              value={`${record.creditPeriods} 期`}
            />
          </div>
        </DetailSection>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{ACTION_TITLE_MAP[kind]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {kind === "initiate" && (
              <>
                <ProductFieldHint>{ONLINE_PLEDGE_INITIATE_USER_HINT}</ProductFieldHint>
                <PrototypeSpecCallout>{ONLINE_PLEDGE_INITIATE_SPEC_NOTE}</PrototypeSpecCallout>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    勾选拟质押标的（{record.collateralType === "INVENTORY" ? "现货存货" : "数字仓单"}）
                  </Label>
                  <div className="space-y-2">
                    {record.collateralType === "INVENTORY"
                      ? record.inventoryItems.map((inv) => {
                          const checked = selectedCollateralIds.includes(inv.id)
                          const occupied = inv.availability === "OCCUPIED"
                          return (
                            <label
                              key={inv.id}
                              className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-3 text-xs ${
                                occupied
                                  ? "border-rose-200 bg-rose-50/60"
                                  : checked
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    setSelectedCollateralIds((prev) =>
                                      e.target.checked
                                        ? [...prev, inv.id]
                                        : prev.filter((x) => x !== inv.id),
                                    )
                                  }}
                                />
                                <div>
                                  <div className="font-medium text-foreground">
                                    {inv.varietyName} · {inv.specModel}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {inv.warehouseName} / {inv.zoneLocation} ·{" "}
                                    {inv.pledgeQuantity} {inv.unit}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold tabular-nums">
                                  {formatYuan(inv.assessedValueYuan)}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    occupied
                                      ? "border-rose-200 bg-rose-50 text-rose-700"
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  }
                                >
                                  {occupied ? "已占用异常" : "在库可用"}
                                </Badge>
                              </div>
                            </label>
                          )
                        })
                      : record.receiptItems.map((wr) => {
                          const checked = selectedCollateralIds.includes(wr.id)
                          return (
                            <label
                              key={wr.id}
                              className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-3 text-xs ${
                                checked ? "border-primary bg-primary/5" : "border-border"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    setSelectedCollateralIds((prev) =>
                                      e.target.checked
                                        ? [...prev, wr.id]
                                        : prev.filter((x) => x !== wr.id),
                                    )
                                  }}
                                />
                                <div>
                                  <div className="font-medium text-foreground">
                                    {wr.receiptNo} · {wr.goodsSummary}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {wr.warehouseName} · {wr.quantityText}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold tabular-nums">
                                  {formatYuan(wr.assessedValueYuan)}
                                </div>
                                <Badge
                                  variant="outline"
                                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                                >
                                  有效未质押
                                </Badge>
                              </div>
                            </label>
                          )
                        })}
                  </div>
                </div>

                <div className="grid gap-4 rounded-lg border bg-muted/20 p-4 sm:grid-cols-2">
                  <div>
                    <div className="text-xs text-muted-foreground">已选标的评估总货值</div>
                    <div className="mt-1 text-base font-semibold tabular-nums">
                      {formatYuan(selectedAssessedValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">预估最高质押率</div>
                    <div className="mt-1 text-base font-semibold tabular-nums">
                      {estimatedPledgeRatio.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </>
            )}

            {kind === "audit" && (
              <>
                <ProductFieldHint>{ONLINE_PLEDGE_ROLLBACK_USER_HINT}</ProductFieldHint>
                <PrototypeSpecCallout>{ONLINE_PLEDGE_ROLLBACK_SPEC_NOTE}</PrototypeSpecCallout>

                <div className="space-y-2">
                  <Label>审核结论</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={auditDecision === "APPROVE" ? "default" : "outline"}
                      onClick={() => setAuditDecision("APPROVE")}
                    >
                      <CheckCircle2Icon className="mr-1.5 size-4" />
                      审核通过并生成电子订单
                    </Button>
                    <Button
                      type="button"
                      variant={auditDecision === "REJECT" ? "destructive" : "outline"}
                      onClick={() => setAuditDecision("REJECT")}
                    >
                      <ShieldAlertIcon className="mr-1.5 size-4" />
                      审核拒绝（本地回退）
                    </Button>
                  </div>
                </div>

                {auditDecision === "REJECT" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="audit-reject-reason">
                      审核拒绝原因 <span className="text-rose-600">*</span>
                    </Label>
                    <Textarea
                      id="audit-reject-reason"
                      rows={3}
                      placeholder="请录入审核拒绝原因（10~200 字），拒绝后单据将本地回退至「申请成功」"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            {kind === "cancel" && (
              <>
                <ProductFieldHint>{ONLINE_PLEDGE_ROLLBACK_USER_HINT}</ProductFieldHint>
                <PrototypeSpecCallout>{ONLINE_PLEDGE_ROLLBACK_SPEC_NOTE}</PrototypeSpecCallout>

                <div className="space-y-1.5">
                  <Label htmlFor="cancel-reason">
                    主动撤销原因 <span className="text-rose-600">*</span>
                  </Label>
                  <Textarea
                    id="cancel-reason"
                    rows={3}
                    placeholder="请录入主动撤销原因（10~200 字），如“客户调整借款周期或更换质押仓单”"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </>
            )}

            {kind === "disburse" && (
              <>
                <ProductFieldHint>{ONLINE_PLEDGE_DISBURSE_USER_HINT}</ProductFieldHint>
                <PrototypeSpecCallout>{ONLINE_PLEDGE_DISBURSE_SPEC_NOTE}</PrototypeSpecCallout>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="loan-amount">
                      贷款金额（元） <span className="text-rose-600">*</span>
                    </Label>
                    <Input
                      id="loan-amount"
                      type="number"
                      step="0.01"
                      placeholder={`不得超过 ${record.creditAmountYuan}`}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground">
                      上限：{formatYuan(record.creditAmountYuan)}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="loan-periods">
                      贷款期数（期） <span className="text-rose-600">*</span>
                    </Label>
                    <Input
                      id="loan-periods"
                      type="number"
                      step="1"
                      placeholder={`1 ~ ${record.creditPeriods}`}
                      value={loanPeriods}
                      onChange={(e) => setLoanPeriods(e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground">
                      上限：{record.creditPeriods} 期
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="disburse-date">
                      放款日期 <span className="text-rose-600">*</span>
                    </Label>
                    <Input
                      id="disburse-date"
                      type="date"
                      value={disburseDate}
                      onChange={(e) => setDisburseDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="receipt-file">
                      放款凭证附件 <span className="text-rose-600">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="receipt-file"
                        value={receiptFileName}
                        onChange={(e) => setReceiptFileName(e.target.value)}
                        placeholder="请上传放款电子回单"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-1"
                        onClick={() =>
                          setReceiptFileName(
                            `放款电子回单_${record.applyNo}.pdf`,
                          )
                        }
                      >
                        <UploadIcon className="size-3.5" />
                        模拟上传
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
                <AlertTriangleIcon className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(onlinePledgeDetailPath(record.id))}
              >
                取消返回
              </Button>
              <Button type="button" onClick={handleOpenConfirm}>
                提交{ACTION_TITLE_MAP[kind]}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>二次确认 · {ACTION_TITLE_MAP[kind]}</DialogTitle>
              <DialogDescription>
                {kind === "initiate" &&
                  `确认对【${record.applyNo}】发起抵质押信息确认？提交后将临时锁定所选标的（评估货值 ${formatYuan(selectedAssessedValue)}）并生成风控审核任务。`}
                {kind === "audit" &&
                  auditDecision === "APPROVE" &&
                  `确认审核通过【${record.applyNo}】？系统将固化电子存证哈希并生成正式抵质押订单，后续不可撤销。`}
                {kind === "audit" &&
                  auditDecision === "REJECT" &&
                  `确认拒绝【${record.applyNo}】？单据将在本地回退至「申请成功」状态并释放标的临时锁定。`}
                {kind === "cancel" &&
                  `确认主动撤销【${record.applyNo}】？撤销后单据将在本地回退至「申请成功」并释放标的临时锁定。`}
                {kind === "disburse" &&
                  `确认录入放款结果？贷款金额 ${formatYuan(Number(loanAmount))}、期数 ${loanPeriods} 期，提交后状态将变更为「已放款」并全链路回写。`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
              >
                再核对一下
              </Button>
              <Button type="button" onClick={handleExecute}>
                确认执行
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 max-w-sm rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
