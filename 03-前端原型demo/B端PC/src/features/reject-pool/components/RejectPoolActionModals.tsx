import { useEffect, useState } from "react"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  FileTextIcon,
  PaperclipIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  UploadIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  type AttachmentItem,
  type CollateralType,
  type RejectPoolRecord,
} from "../domain/types"

export interface ReviveSubmitPayload {
  applicantName: string
  contactPhone: string
  intendedAmountYuan: number
  intendedPeriods: number
  collateralType: CollateralType
  warehouseReceiptCode?: string
  note: string
  addedAttachment?: AttachmentItem
}

/** S01：线索被拒 -> 重新救活弹窗（含字段校验 + 补充附件 + 二次确认） */
export function ReviveClueModal({
  open,
  record,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  record: RejectPoolRecord | null
  onOpenChange: (open: boolean) => void
  onConfirm: (record: RejectPoolRecord, payload: ReviveSubmitPayload) => void
}) {
  const [applicantName, setApplicantName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [amountInput, setAmountInput] = useState("")
  const [periodsInput, setPeriodsInput] = useState("")
  const [collateralType, setCollateralType] = useState<CollateralType>("INVENTORY")
  const [receiptCode, setReceiptCode] = useState("")
  const [note, setNote] = useState("")
  const [addedFileName, setAddedFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (open && record) {
      setApplicantName(record.applicantName)
      setContactPhone(
        record.applicantType === "ENTERPRISE"
          ? record.agentPhone ?? "13800001234"
          : record.applicantPhone ?? "13800001234",
      )
      setAmountInput(String(record.intendedAmountYuan))
      setPeriodsInput(String(record.intendedPeriods))
      setCollateralType(record.collateralType)
      setReceiptCode(record.warehouseReceiptCodes?.[0] ?? "")
      setNote("")
      setAddedFileName(null)
      setError(null)
      setConfirmOpen(false)
    }
  }, [open, record])

  if (!record) return null

  const validateAndProceed = () => {
    const trimmedName = applicantName.trim()
    if (trimmedName.length < 2 || trimmedName.length > 64) {
      setError("申请人名称不能为空，且长度应在 2 到 64 个字之间。")
      return
    }
    const cleanPhone = contactPhone.trim()
    if (!/^1[3-9]\d{9}$/.test(cleanPhone) && !/^1[3-9]\d\*{4}\d{4}$/.test(cleanPhone)) {
      setError("请填写正确的 11 位手机号码。")
      return
    }
    const parsedAmount = Number(amountInput)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("意向融资金额必须为大于 0 的有效数字。")
      return
    }
    if (!/^\d+(\.\d{1,2})?$/.test(amountInput.trim())) {
      setError("意向融资金额最多保留两位小数。")
      return
    }
    const parsedPeriods = Number(periodsInput)
    if (!Number.isInteger(parsedPeriods) || parsedPeriods < 1 || parsedPeriods > 60) {
      setError("意向融资期数必须为 1 到 60 之间的正整数（单位：期/月）。")
      return
    }
    if (collateralType === "WAREHOUSE_RECEIPT" && !receiptCode.trim()) {
      setError("选择数字仓单质押时，必须填写有效的数字仓单编号。")
      return
    }
    const trimmedNote = note.trim()
    if (trimmedNote.length < 5 || trimmedNote.length > 200) {
      setError("救活整改说明不能为空，请填写 5 到 200 个字的具体补充或整改情况。")
      return
    }
    setError(null)
    setConfirmOpen(true)
  }

  const handleFinalConfirm = () => {
    const addedAttachment: AttachmentItem | undefined = addedFileName
      ? {
          id: `att-${Date.now()}`,
          category: "申请资料",
          fileName: addedFileName,
          fileSize: "1.4 MB",
          uploadedBy: "王主管（运营风控中心）",
          uploadedAt: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
          summary: "线索被拒救活时补充上传的增信及贸易佐证材料",
        }
      : undefined

    onConfirm(record, {
      applicantName: applicantName.trim(),
      contactPhone: contactPhone.trim(),
      intendedAmountYuan: Number(Number(amountInput).toFixed(2)),
      intendedPeriods: Number(periodsInput),
      collateralType,
      warehouseReceiptCode:
        collateralType === "WAREHOUSE_RECEIPT" ? receiptCode.trim() : undefined,
      note: note.trim(),
      addedAttachment,
    })
    setConfirmOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>重新救活融资申请 · {record.applyNo}</DialogTitle>
            <DialogDescription>{REJECT_POOL_REVIVE_USER_HINT}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1 max-h-[68vh] overflow-y-auto pr-1">
            <div className="rounded-lg border border-rose-200 bg-rose-50/70 px-3 py-2.5 text-xs text-rose-800">
              <span className="font-semibold">末次退回原因：</span>
              {record.lastRejectReason}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="revive-name">
                  申请人名称 <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="revive-name"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="请输入企业全称或个人姓名"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="revive-phone">
                  联系电话 <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="revive-phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="请输入 11 位联系手机号"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="revive-amount">
                  意向融资金额（元） <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="revive-amount"
                  type="number"
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="例如：2800000.00"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="revive-periods">
                  意向融资期数（期/月） <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="revive-periods"
                  type="number"
                  min={1}
                  max={60}
                  value={periodsInput}
                  onChange={(e) => setPeriodsInput(e.target.value)}
                  placeholder="请输入 1~60 的整数"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>
                抵/质押物类型 <span className="text-rose-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2.5">
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
                    className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                      collateralType === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {collateralType === "WAREHOUSE_RECEIPT" && (
              <div className="space-y-1.5">
                <Label htmlFor="revive-receipt">
                  数字仓单编号 <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="revive-receipt"
                  value={receiptCode}
                  onChange={(e) => setReceiptCode(e.target.value)}
                  placeholder="例如：CD2091023847561102336"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>补充佐证材料</Label>
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() =>
                    setAddedFileName(`补充贸易合同与货权确认函_${record.applyNo}.pdf`)
                  }
                >
                  <UploadIcon className="size-3.5" />
                  {addedFileName ? "重新上传补充材料" : "模拟上传补充材料"}
                </Button>
                {addedFileName ? (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                    <PaperclipIcon className="size-3" />
                    {addedFileName}
                  </span>
                ) : (
                  <ProductFieldHint className="text-[11px]">
                    支持补充采购发票、仓储权属证明或增信担保函（PDF/图片）。
                  </ProductFieldHint>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="revive-note">
                  救活整改说明 <span className="text-rose-500">*</span>
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {note.trim().length} / 200 字
                </span>
              </div>
              <Textarea
                id="revive-note"
                rows={3}
                maxLength={200}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="请说明客户已补充哪些缺失材料或修正了哪些申请要素（5~200 字）"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                <AlertTriangleIcon className="mt-0.5 size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <PrototypeSpecCallout>{REJECT_POOL_REVIVE_SPEC_NOTE}</PrototypeSpecCallout>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="button" onClick={validateAndProceed}>
              提交救活
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>二次确认：提交线索救活</DialogTitle>
            <DialogDescription>
              确认救活申请单 {record.applyNo}？提交后该单据将移出被拒退回池，并恢复为「待受理」状态重新进入客户融资需求线索分配队列。
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1">
            <div>申请人：{applicantName}</div>
            <div>意向金额：{formatYuan(Number(amountInput))} 元 / {periodsInput} 期</div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              返回修改
            </Button>
            <Button type="button" onClick={handleFinalConfirm}>
              确认救活并恢复待受理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** S02：线索被拒 -> 按路由重新指派（自动识别需要尽调=是/否） */
export function RouteAssignModal({
  open,
  record,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  record: RejectPoolRecord | null
  onOpenChange: (open: boolean) => void
  onConfirm: (
    record: RejectPoolRecord,
    targetId: string,
    targetName: string,
    remark: string,
  ) => void
}) {
  const [selectedId, setSelectedId] = useState("")
  const [remark, setRemark] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (open && record) {
      setSelectedId("")
      setRemark("")
      setError(null)
      setConfirmOpen(false)
    }
  }, [open, record])

  if (!record) return null

  const needDiligence = record.needDiligence
  const candidates = needDiligence ? SURVEYOR_OPTIONS : FUNDER_OPTIONS
  const selectedObj = candidates.find((c) => c.id === selectedId)
  const isHistoricalFunder =
    !needDiligence &&
    Boolean(selectedObj && record.historicalRejectedFunders.includes(selectedObj.name))

  const handleValidate = () => {
    if (!selectedId || !selectedObj) {
      setError(
        needDiligence
          ? "指派失败：请选择一名处于启用状态的尽调服务方专员。"
          : "指派失败：请选择一家处于启用状态的合作资金方机构。",
      )
      return
    }
    setError(null)
    setConfirmOpen(true)
  }

  const handleFinalConfirm = () => {
    if (!selectedObj) return
    onConfirm(record, selectedObj.id, selectedObj.name, remark.trim())
    setConfirmOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>按路由重新指派 · {record.applyNo}</DialogTitle>
            <DialogDescription>{REJECT_POOL_ROUTE_ASSIGN_USER_HINT}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-xs">
              <span>当前线索配置路由：</span>
              <Badge
                variant="outline"
                className={
                  needDiligence
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }
              >
                {needDiligence ? "需要尽调 = 是（指派尽调专员）" : "需要尽调 = 否（直推合作资方）"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label>
                {needDiligence ? "选择尽调服务方专员" : "选择合作资金方机构"}{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {candidates.map((cand) => {
                  const isPrevRejected =
                    !needDiligence && record.historicalRejectedFunders.includes(cand.name)
                  const active = selectedId === cand.id
                  return (
                    <button
                      key={cand.id}
                      type="button"
                      onClick={() => setSelectedId(cand.id)}
                      className={`flex w-full items-start justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-foreground">
                          <span>{cand.name}</span>
                          {isPrevRejected && (
                            <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600 border border-rose-200">
                              *历史曾拒
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {"org" in cand ? `${cand.org} · ${cand.specialty}` : cand.preference}
                        </div>
                      </div>
                      <span
                        className={`mt-1 size-4 shrink-0 rounded-full border flex items-center justify-center ${
                          active ? "border-primary bg-primary text-white" : "border-muted-foreground/40"
                        }`}
                      >
                        {active && <CheckCircle2Icon className="size-3" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="route-assign-remark">指派说明（选填）</Label>
              <Textarea
                id="route-assign-remark"
                rows={2}
                maxLength={200}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="可填写客户跟进要点或补充资料提示（最多 200 字）"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                <AlertTriangleIcon className="mt-0.5 size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <PrototypeSpecCallout>{REJECT_POOL_ROUTE_ASSIGN_SPEC_NOTE}</PrototypeSpecCallout>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleValidate}>
              确认指派
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>二次确认：按路由重新指派</DialogTitle>
            <DialogDescription>
              确认将申请单 {record.applyNo} 指派给「{selectedObj?.name}」并生成新批次 {nextBatchNo(record.batchNo)}？
            </DialogDescription>
          </DialogHeader>
          {isHistoricalFunder && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              提示：所选资金方「{selectedObj?.name}」此前曾拒绝过该申请，请确认客户担保条件已改善后再次发起。
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleFinalConfirm}>
              确认流转至{needDiligence ? "待尽调" : "授信已受理"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** S03：尽调失败 -> 重新发起尽调（更换新尽调专员 + 生成新批次） */
export function ReinitiateDiligenceModal({
  open,
  record,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  record: RejectPoolRecord | null
  onOpenChange: (open: boolean) => void
  onConfirm: (
    record: RejectPoolRecord,
    surveyorId: string,
    surveyorName: string,
    note: string,
  ) => void
}) {
  const [surveyorId, setSurveyorId] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (open && record) {
      setSurveyorId("")
      setNote("")
      setError(null)
      setConfirmOpen(false)
    }
  }, [open, record])

  if (!record) return null

  const selectedSurveyor = SURVEYOR_OPTIONS.find((s) => s.id === surveyorId)

  const handleValidate = () => {
    if (!selectedSurveyor) {
      setError("发起失败：请选择一位在职尽调服务方专员。")
      return
    }
    if (record.lastSurveyorId && selectedSurveyor.id === record.lastSurveyorId) {
      setError(
        `重新发起尽调不可重复指派上一轮退回专员（${record.lastSurveyorName ?? selectedSurveyor.name}），请改选其他尽调专员。`,
      )
      return
    }
    if (note.trim().length < 10) {
      setError("重调度核查重点说明不能为空，且至少填写 10 个字。")
      return
    }
    setError(null)
    setConfirmOpen(true)
  }

  const handleFinalConfirm = () => {
    if (!selectedSurveyor) return
    onConfirm(record, selectedSurveyor.id, selectedSurveyor.name, note.trim())
    setConfirmOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>重新发起尽调 · {record.applyNo}</DialogTitle>
            <DialogDescription>{REJECT_POOL_REINIT_DILIGENCE_USER_HINT}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-xs text-amber-900 space-y-1">
              <div>
                <span className="font-semibold">上轮拒单/退回专员：</span>
                {record.lastSurveyorName
                  ? `${record.lastSurveyorName}（${record.rejectHandlerOrg}）`
                  : `${record.rejectHandler}（${record.rejectHandlerOrg}）`}
              </div>
              <div>
                <span className="font-semibold">上轮退回原因：</span>
                {record.lastRejectReason}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                新指派尽调专员 <span className="text-rose-500">*</span>
              </Label>
              <div className="space-y-2">
                {SURVEYOR_OPTIONS.map((surv) => {
                  const isSameAsPrev = Boolean(
                    record.lastSurveyorId && surv.id === record.lastSurveyorId,
                  )
                  const active = surveyorId === surv.id
                  return (
                    <button
                      key={surv.id}
                      type="button"
                      onClick={() => setSurveyorId(surv.id)}
                      className={`flex w-full items-start justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                          <span>{surv.name}</span>
                          <span className="text-[11px] text-muted-foreground">{surv.org}</span>
                          {isSameAsPrev && (
                            <Badge
                              variant="outline"
                              className="border-amber-300 bg-amber-50 text-[10px] text-amber-700"
                            >
                              上轮退回专员
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">擅长：{surv.specialty}</div>
                      </div>
                      <span
                        className={`mt-1 size-4 shrink-0 rounded-full border flex items-center justify-center ${
                          active ? "border-primary bg-primary text-white" : "border-muted-foreground/40"
                        }`}
                      >
                        {active && <CheckCircle2Icon className="size-3" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reinit-note">
                重调度核查重点说明 <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="reinit-note"
                rows={3}
                maxLength={300}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="请写明本轮需重点复核的现场盘点、货权证明或贸易单据要点（不少于 10 个字）"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                <AlertTriangleIcon className="mt-0.5 size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <PrototypeSpecCallout>{REJECT_POOL_REINIT_DILIGENCE_SPEC_NOTE}</PrototypeSpecCallout>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleValidate}>
              发起新一轮尽调
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>二次确认：重新发起尽调</DialogTitle>
            <DialogDescription>
              确认指派「{selectedSurveyor?.name}」重新核查申请单 {record.applyNo}？系统将生成新批次 {nextBatchNo(record.batchNo)}，原批次底稿只读归档留存。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleFinalConfirm}>
              确认生成新尽调批次
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** S04：尽调失败 -> 变更路由直接分配资方（不少于 20 字风控特批 + 曾拒资方标红） */
export function ChangeRouteAssignFunderModal({
  open,
  record,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  record: RejectPoolRecord | null
  onOpenChange: (open: boolean) => void
  onConfirm: (
    record: RejectPoolRecord,
    funderId: string,
    funderName: string,
    approvalReason: string,
  ) => void
}) {
  const [funderId, setFunderId] = useState("")
  const [approvalReason, setApprovalReason] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (open && record) {
      setFunderId("")
      setApprovalReason("")
      setError(null)
      setConfirmOpen(false)
    }
  }, [open, record])

  if (!record) return null

  const selectedFunder = FUNDER_OPTIONS.find((f) => f.id === funderId)
  const isHistoricalRejected = Boolean(
    selectedFunder && record.historicalRejectedFunders.includes(selectedFunder.name),
  )

  const handleValidate = () => {
    if (!selectedFunder) {
      setError("分配失败：请选择一家处于启用状态的合作资金方机构。")
      return
    }
    if (approvalReason.trim().length < 20) {
      setError("跳过尽调直推资方属于特批动作，风控总监特批免尽调说明不少于 20 个字。")
      return
    }
    setError(null)
    setConfirmOpen(true)
  }

  const handleFinalConfirm = () => {
    if (!selectedFunder) return
    onConfirm(record, selectedFunder.id, selectedFunder.name, approvalReason.trim())
    setConfirmOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[580px]">
          <DialogHeader>
            <DialogTitle>变更路由直分资方 · {record.applyNo}</DialogTitle>
            <DialogDescription>{REJECT_POOL_SKIP_DILIGENCE_USER_HINT}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1 max-h-[68vh] overflow-y-auto pr-1">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
              <ShieldAlertIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div>
                <div className="font-semibold">风控路由变更提示</div>
                <div className="mt-0.5">
                  确认提交后，该单据的「需要尽调」标识将由「是」变更为「否」，跳过线下尽调直接推送至授信办理（授信已受理）。
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                目标合作资金方机构 <span className="text-rose-500">*</span>
              </Label>
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {FUNDER_OPTIONS.map((funder) => {
                  const isPrevRejected = record.historicalRejectedFunders.includes(funder.name)
                  const active = funderId === funder.id
                  return (
                    <button
                      key={funder.id}
                      type="button"
                      onClick={() => setFunderId(funder.id)}
                      className={`flex w-full items-start justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-foreground">
                          <span>{funder.name}</span>
                          {isPrevRejected && (
                            <span className="rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600">
                              *历史曾拒
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{funder.preference}</div>
                      </div>
                      <span
                        className={`mt-1 size-4 shrink-0 rounded-full border flex items-center justify-center ${
                          active ? "border-primary bg-primary text-white" : "border-muted-foreground/40"
                        }`}
                      >
                        {active && <CheckCircle2Icon className="size-3" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="skip-reason">
                  风控总监特批免尽调说明 <span className="text-rose-500">*</span>
                </Label>
                <span
                  className={`text-[11px] ${
                    approvalReason.trim().length < 20 ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  已输入 {approvalReason.trim().length} / 至少 20 字
                </span>
              </div>
              <Textarea
                id="skip-reason"
                rows={3}
                maxLength={300}
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                placeholder="请说明特批跳过现场尽调的依据（例如：已核验央企全额保证金或银行承兑汇票质押、风控总监审批文号等，不少于 20 字）"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                <AlertTriangleIcon className="mt-0.5 size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <PrototypeSpecCallout>{REJECT_POOL_SKIP_DILIGENCE_SPEC_NOTE}</PrototypeSpecCallout>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleValidate}>
              特批并直推资方
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>二次确认：跳过尽调直分资方</DialogTitle>
            <DialogDescription>
              确认跳过尽调并将申请单 {record.applyNo} 直接分配给资金方「{selectedFunder?.name}」？系统将更新需要尽调为「否」，并生成新授信批次 {nextBatchNo(record.batchNo)}。
            </DialogDescription>
          </DialogHeader>
          {isHistoricalRejected && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              高风险警示：「{selectedFunder?.name}」曾拒绝过该申请，请确认特批理由充分后再行推送。
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              返回修改
            </Button>
            <Button type="button" onClick={handleFinalConfirm}>
              确认推送至授信已受理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** S05：授信失败 -> 重新分配资方（R02 仅开放此操作 + R03 曾拒资方标红可选 + R04 批次递增） */
export function ReassignFunderModal({
  open,
  record,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  record: RejectPoolRecord | null
  onOpenChange: (open: boolean) => void
  onConfirm: (
    record: RejectPoolRecord,
    funderId: string,
    funderName: string,
    note: string,
  ) => void
}) {
  const [funderId, setFunderId] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (open && record) {
      setFunderId("")
      setNote("")
      setError(null)
      setConfirmOpen(false)
    }
  }, [open, record])

  if (!record) return null

  const selectedFunder = FUNDER_OPTIONS.find((f) => f.id === funderId)
  const isHistoricalRejected = Boolean(
    selectedFunder && record.historicalRejectedFunders.includes(selectedFunder.name),
  )

  const handleValidate = () => {
    if (!selectedFunder) {
      setError("分配失败：请选择有效资金方机构。")
      return
    }
    if (note.trim().length < 5) {
      setError("请填写至少 5 个字的资方改派说明（供内部审计留痕）。")
      return
    }
    setError(null)
    setConfirmOpen(true)
  }

  const handleFinalConfirm = () => {
    if (!selectedFunder) return
    onConfirm(record, selectedFunder.id, selectedFunder.name, note.trim())
    setConfirmOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>重新分配资金方 · {record.applyNo}</DialogTitle>
            <DialogDescription>{REJECT_POOL_REASSIGN_FUNDER_USER_HINT}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1 max-h-[68vh] overflow-y-auto pr-1">
            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2.5 text-xs text-emerald-900">
              <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <div>
                <span className="font-semibold">原尽调结论继续有效：</span>
                {record.needDiligence
                  ? "本单前期现场尽调及货值核验合格报告继续生效，改派新资方无需退回重做尽调。"
                  : "本单为免尽调快速产品，改派后直接进入新资方授信审批队列。"}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                选择重调度目标资方 <span className="text-rose-500">*</span>
              </Label>
              <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {FUNDER_OPTIONS.map((funder) => {
                  const isPrevRejected = record.historicalRejectedFunders.includes(funder.name)
                  const active = funderId === funder.id
                  return (
                    <button
                      key={funder.id}
                      type="button"
                      onClick={() => setFunderId(funder.id)}
                      className={`flex w-full items-start justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-foreground">
                          <span>{funder.name}</span>
                          {isPrevRejected && (
                            <span className="rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600">
                              *历史曾拒
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{funder.preference}</div>
                      </div>
                      <span
                        className={`mt-1 size-4 shrink-0 rounded-full border flex items-center justify-center ${
                          active ? "border-primary bg-primary text-white" : "border-muted-foreground/40"
                        }`}
                      >
                        {active && <CheckCircle2Icon className="size-3" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reassign-funder-note">
                改派说明（内部审计留痕，对新资方脱敏） <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="reassign-funder-note"
                rows={2}
                maxLength={200}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="请简述改派原因或客户增信补充情况（5~200 字，向新资方推送时自动隐藏前序资方批语）"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                <AlertTriangleIcon className="mt-0.5 size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <PrototypeSpecCallout>{REJECT_POOL_REASSIGN_FUNDER_SPEC_NOTE}</PrototypeSpecCallout>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleValidate}>
              确认分配资方
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>二次确认：重新分配合作资方</DialogTitle>
            <DialogDescription>
              确认分配给资金方：{selectedFunder?.name}？系统将生成新授信批次 {nextBatchNo(record.batchNo)}，并推送至授信办理「授信已受理」队列。
            </DialogDescription>
          </DialogHeader>
          {isHistoricalRejected && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              特别提醒：「{selectedFunder?.name}」为历史曾拒机构（*历史曾拒），请确认已补充担保条件或调整额度期望后再提交。
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleFinalConfirm}>
              确认生成新授信批次
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** 线下特批解除 5 次熔断弹窗（原型演示辅助，验证 W02 闭环） */
export function CircuitBreakerUnlockModal({
  open,
  record,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  record: RejectPoolRecord | null
  onOpenChange: (open: boolean) => void
  onConfirm: (record: RejectPoolRecord, ticketNo: string, reason: string) => void
}) {
  const [ticketNo, setTicketNo] = useState("")
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setTicketNo("OA-RISK-20261113-088")
      setReason("")
      setError(null)
    }
  }, [open])

  if (!record) return null

  const handleSubmit = () => {
    if (!ticketNo.trim()) {
      setError("请填写线下特批审批单号。")
      return
    }
    if (reason.trim().length < 10) {
      setError("请填写不少于 10 个字的特批解除说明。")
      return
    }
    onConfirm(record, ticketNo.trim(), reason.trim())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>线下特批解除风控熔断 · {record.applyNo}</DialogTitle>
          <DialogDescription>
            该申请累计入池已达 {record.rejectCount} 次，系统已锁定线上重调度权限。录入首席风控官线下特批工单后可恢复一次重调度资格。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="unlock-ticket">
              线下特批工单号 <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="unlock-ticket"
              value={ticketNo}
              onChange={(e) => setTicketNo(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="unlock-reason">
              特批解封说明 <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="unlock-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请填写线下风控委员会特批纪要（不少于 10 个字）"
            />
          </div>
          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type="button" onClick={handleSubmit}>
            确认特批解锁
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** 附件与营业执照在线预览弹窗 */
export function AttachmentPreviewModal({
  open,
  attachment,
  onOpenChange,
  onDownload,
}: {
  open: boolean
  attachment: AttachmentItem | null
  onOpenChange: (open: boolean) => void
  onDownload: (attachment: AttachmentItem) => void
}) {
  if (!attachment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileTextIcon className="size-4 text-primary" />
            附件预览 · {attachment.category}
          </DialogTitle>
          <DialogDescription>{attachment.fileName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4 text-xs">
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <div>文件类型：{attachment.category}</div>
            <div>文件大小：{attachment.fileSize}</div>
            <div>上传人：{attachment.uploadedBy}</div>
            <div>上传时间：{attachment.uploadedAt}</div>
          </div>
          <div className="rounded-md border border-border bg-card p-4 text-foreground leading-relaxed">
            <div className="mb-1.5 font-semibold text-primary">文件内容摘要（只读预览）</div>
            <p className="text-muted-foreground">{attachment.summary}</p>
            <div className="mt-4 flex h-28 items-center justify-center rounded border border-dashed border-border bg-muted/30 text-muted-foreground">
              [ 电子签章及原始影印件预览区域 · {attachment.fileName} ]
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button type="button" onClick={() => onDownload(attachment)}>
            下载原件
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

