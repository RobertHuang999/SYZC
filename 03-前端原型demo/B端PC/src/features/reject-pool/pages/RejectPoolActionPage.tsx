import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  LockIcon,
  PaperclipIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
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
  REJECT_POOL_CIRCUIT_BREAKER_SPEC_NOTE,
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
import { rejectPoolDetailAnnotations } from "../annotations/reject-pool-detail.annotations"
import { rejectPoolDocuments } from "../documents/reject-pool-documents"
import {
  BUSINESS_STATUS_META,
  FUNDER_OPTIONS,
  OVERDUE_HOURS_THRESHOLD,
  REJECT_NODE_BADGE_CLASS,
  REJECT_POOL_LIST_PATH,
  SURVEYOR_OPTIONS,
  formatYuan,
  isCircuitBroken,
  nextBatchNo,
  rejectPoolDetailPath,
  type CollateralType,
  type RejectPoolRecord,
  type RescheduledLogItem,
} from "../domain/types"
import {
  loadRejectPoolRecords,
  loadRescheduledLogs,
  saveRejectPoolRecords,
  saveRescheduledLogs,
} from "./RejectPoolListPage"

export type RejectPoolActionKind =
  | "revive"
  | "routeAssign"
  | "reinitDiligence"
  | "skipDiligence"
  | "reassignFunder"
  | "unlock"

const ACTION_TITLE_MAP: Record<RejectPoolActionKind, string> = {
  revive: "线索被拒 · 重新救活",
  routeAssign: "线索被拒 · 按路由重新指派",
  reinitDiligence: "尽调失败 · 重新发起尽调",
  skipDiligence: "尽调失败 · 变更路由直分资方",
  reassignFunder: "授信失败 · 重新分配资方",
  unlock: "风控熔断 · 线下特批解封",
}

function defaultActionForRecord(record: RejectPoolRecord): RejectPoolActionKind {
  if (isCircuitBroken(record)) return "unlock"
  if (record.tabKey === "CLUE_REJECTED") return "revive"
  if (record.tabKey === "DILIGENCE_FAILED") return "reinitDiligence"
  return "reassignFunder"
}

function nowFormatted(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function RejectPoolActionPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [record, setRecord] = useState<RejectPoolRecord | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // revive 表单字段
  const [applicantName, setApplicantName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [amountInput, setAmountInput] = useState("")
  const [periodsInput, setPeriodsInput] = useState("")
  const [collateralType, setCollateralType] = useState<CollateralType>("INVENTORY")
  const [receiptCode, setReceiptCode] = useState("")
  const [note, setNote] = useState("")
  const [addedFileName, setAddedFileName] = useState<string | null>(null)

  // 指派 / 资方 / 解封字段
  const [selectedSurveyorId, setSelectedSurveyorId] = useState("")
  const [selectedFunderId, setSelectedFunderId] = useState("")
  const [specialReason, setSpecialReason] = useState("")
  const [ticketNo, setTicketNo] = useState("RISK-UNLOCK-20261113-01")
  const [unlockReason, setUnlockReason] = useState("")

  useEffect(() => {
    const list = loadRejectPoolRecords()
    const decoded = id ? decodeURIComponent(id) : ""
    const found =
      list.find((item) => item.id === decoded || item.applyNo === decoded) ??
      list[0] ??
      null
    setRecord(found)
    if (found) {
      setApplicantName(found.applicantName)
      setContactPhone(found.agentPhone || found.applicantPhone || "138****4512")
      setAmountInput(String(found.intendedAmountYuan))
      setPeriodsInput(String(found.intendedPeriods))
      setCollateralType(found.collateralType)
      setReceiptCode(found.warehouseReceiptCodes?.[0] ?? "")
      setNote("")
      setAddedFileName(null)
      setSelectedSurveyorId("")
      setSelectedFunderId("")
      setSpecialReason("")
      setUnlockReason("")
      setError(null)
    }
  }, [id])

  const actionKind: RejectPoolActionKind = useMemo(() => {
    if (!record) return "revive"
    const raw = searchParams.get("action") as RejectPoolActionKind | null
    if (raw && ACTION_TITLE_MAP[raw]) return raw
    return defaultActionForRecord(record)
  }, [record, searchParams])

  const availableActions: { key: RejectPoolActionKind; label: string }[] = useMemo(() => {
    if (!record) return []
    const locked = isCircuitBroken(record)
    if (locked) {
      return [{ key: "unlock", label: "线下特批解封" }]
    }
    if (record.tabKey === "CLUE_REJECTED") {
      return [
        { key: "revive", label: "重新救活" },
        { key: "routeAssign", label: "按路由指派" },
      ]
    }
    if (record.tabKey === "DILIGENCE_FAILED") {
      return [
        { key: "reinitDiligence", label: "重新发起尽调" },
        { key: "skipDiligence", label: "变更路由直分资方" },
      ]
    }
    return [{ key: "reassignFunder", label: "重新分配资方" }]
  }, [record])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3200)
  }

  if (!record) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-8">
        <p className="text-sm text-muted-foreground">
          未找到对应的被拒退回单据或该单据已重调度流出。
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(REJECT_POOL_LIST_PATH)}
        >
          返回被拒退回记录池
        </Button>
      </div>
    )
  }

  const statusMeta = BUSINESS_STATUS_META[record.businessStatus]
  const overdue = record.stagnationHours > OVERDUE_HOURS_THRESHOLD
  const locked = isCircuitBroken(record)

  const selectableSurveyors = SURVEYOR_OPTIONS.filter(
    (s) => s.enabled && (actionKind !== "reinitDiligence" || s.id !== record.lastSurveyorId),
  )

  const selectedSurveyor = SURVEYOR_OPTIONS.find((s) => s.id === selectedSurveyorId)
  const selectedFunder = FUNDER_OPTIONS.find((f) => f.id === selectedFunderId)

  const handleValidateAndOpenConfirm = () => {
    setError(null)
    if (locked && actionKind !== "unlock") {
      setError("该单据已触发 5 次被拒熔断保护，请先执行线下特批解封。")
      return
    }

    if (actionKind === "revive") {
      if (!applicantName.trim()) {
        setError("救活失败：申请人名称不能为空。")
        return
      }
      if (!contactPhone.trim()) {
        setError("救活失败：联系电话不能为空。")
        return
      }
      const amt = Number(amountInput)
      if (!Number.isFinite(amt) || amt <= 0) {
        setError("救活失败：意向融资金额必须大于 0。")
        return
      }
      const periods = Number(periodsInput)
      if (!Number.isInteger(periods) || periods <= 0) {
        setError("救活失败：意向融资期数必须为正整数。")
        return
      }
      if (collateralType === "WAREHOUSE_RECEIPT" && !receiptCode.trim()) {
        setError("救活失败：选择数字仓单时必须填写关联仓单编号。")
        return
      }
      if (note.trim().length < 5) {
        setError("救活失败：资料不符合准入规范（请填写不少于 5 字的补正说明）。")
        return
      }
    } else if (actionKind === "routeAssign") {
      if (record.needDiligence && !selectedSurveyorId) {
        setError("请选择有效的尽调专员。")
        return
      }
      if (!record.needDiligence && !selectedFunderId) {
        setError("请选择有效的合作资金方机构。")
        return
      }
    } else if (actionKind === "reinitDiligence") {
      if (!selectedSurveyorId) {
        setError("发起失败：请选择有效的在职尽调专员。")
        return
      }
    } else if (actionKind === "skipDiligence") {
      if (!selectedFunderId) {
        setError("分配失败：请选择有效的合作资金方机构。")
        return
      }
      if (specialReason.trim().length < 20) {
        setError("特批跳过尽调必须录入不少于 20 字的特批理由。")
        return
      }
    } else if (actionKind === "reassignFunder") {
      if (!selectedFunderId) {
        setError("分配失败：请选择有效的合作资金方机构。")
        return
      }
    } else if (actionKind === "unlock") {
      if (!ticketNo.trim()) {
        setError("请填写线下特批审批工单号。")
        return
      }
      if (unlockReason.trim().length < 5) {
        setError("请填写不少于 5 字的特批解除说明。")
        return
      }
    }

    setConfirmOpen(true)
  }

  const handleConfirmSubmit = () => {
    setConfirmOpen(false)
    const list = loadRejectPoolRecords()

    if (actionKind === "unlock") {
      const updated: RejectPoolRecord = {
        ...record,
        demoUnlocked: true,
        batchHistory: [
          {
            batchNo: record.batchNo,
            nodeName: record.rejectNodeName,
            actionResult: "线下特批解除熔断",
            operatorName: "首席风控官",
            operatorOrg: "森云风控委员会",
            operatedAt: nowFormatted(),
            reasonOrNote: `特批工单 ${ticketNo.trim()}：${unlockReason.trim()}`,
          },
          ...record.batchHistory,
        ],
      }
      saveRejectPoolRecords(
        list.map((item) => (item.id === updated.id ? updated : item)),
      )
      showToast(`已完成特批解除（${ticketNo.trim()}），该单据已恢复重调度权限。`)
      window.setTimeout(() => {
        navigate(rejectPoolDetailPath(updated.id))
      }, 900)
      return
    }

    const nextBatch = nextBatchNo(record.batchNo)
    let actionName = ""
    let targetStatusLabel = ""
    let targetAssignee = ""
    let toastText = ""

    if (actionKind === "revive") {
      actionName = "重新救活"
      targetStatusLabel = "待受理"
      targetAssignee = "客户融资需求线索分配池"
      toastText = `申请单 ${record.applyNo} 已成功救活并恢复「待受理」，即将返回列表。`
    } else if (actionKind === "routeAssign") {
      actionName = "按路由指派"
      targetStatusLabel = record.needDiligence ? "待尽调" : "授信已受理"
      targetAssignee = record.needDiligence
        ? selectedSurveyor?.name ?? "尽调专员"
        : selectedFunder?.name ?? "合作资方"
      toastText = `已按路由指派给「${targetAssignee}」，流转至「${targetStatusLabel}」。`
    } else if (actionKind === "reinitDiligence") {
      actionName = "重新发起尽调"
      targetStatusLabel = "待尽调"
      targetAssignee = selectedSurveyor?.name ?? "尽调专员"
      toastText = `已生成新尽调批次 ${nextBatch}，指派给「${targetAssignee}」。`
    } else if (actionKind === "skipDiligence") {
      actionName = "变更路由直分资方"
      targetStatusLabel = "授信已受理"
      targetAssignee = selectedFunder?.name ?? "合作资方"
      toastText = `特批免尽调生效！已推送至「${targetAssignee}」（授信已受理）。`
    } else if (actionKind === "reassignFunder") {
      actionName = "重新分配资方"
      targetStatusLabel = "授信已受理"
      targetAssignee = selectedFunder?.name ?? "合作资方"
      toastText = `原尽调结论有效！已生成新授信批次 ${nextBatch} 分配给「${targetAssignee}」。`
    }

    saveRejectPoolRecords(list.filter((item) => item.id !== record.id))
    const logItem: RescheduledLogItem = {
      id: `log-${Date.now()}`,
      applyNo: record.applyNo,
      batchNo: nextBatch,
      applicantName: actionKind === "revive" ? applicantName.trim() : record.applicantName,
      productName: record.productName,
      actionName,
      targetStatusLabel,
      targetAssignee,
      operatedAt: nowFormatted(),
    }
    saveRescheduledLogs([logItem, ...loadRescheduledLogs()])

    showToast(toastText)
    window.setTimeout(() => {
      navigate(`${REJECT_POOL_LIST_PATH}?tab=${record.tabKey}`)
    }, 900)
  }

  return (
    <PrototypeAnnotationProvider
      documents={rejectPoolDocuments}
      annotations={rejectPoolDetailAnnotations}
    >
      <div className="space-y-4 font-sans pb-10">
        {toastMessage && (
          <div className="fixed top-5 left-1/2 z-[60] -translate-x-1/2 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl">
            <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <PrototypeAnnotationTarget annotationIds={["reject-pool-detail-header"]}>
          <DetailPageHeader
            title="被拒退回重调度操作"
            number={record.applyNo}
            numberLabel="申请单号"
            onBack={() => navigate(`${REJECT_POOL_LIST_PATH}?tab=${record.tabKey}`)}
            status={
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className={statusMeta.badgeClass}>
                  {statusMeta.label}
                </Badge>
                <Badge
                  variant="outline"
                  className={REJECT_NODE_BADGE_CLASS[record.rejectNodeName]}
                >
                  {record.rejectNodeName}
                </Badge>
                {overdue && (
                  <Badge
                    variant="outline"
                    className="border-rose-200 bg-rose-50 text-rose-700"
                  >
                    超期未调度 ({record.stagnationHours.toFixed(1)}h)
                  </Badge>
                )}
                {locked && (
                  <Badge
                    variant="outline"
                    className="border-rose-300 bg-rose-100 text-rose-800"
                  >
                    <LockIcon className="mr-1 size-3" />
                    已熔断（被拒 {record.rejectCount} 次）
                  </Badge>
                )}
              </div>
            }
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate(rejectPoolDetailPath(record.id))}
              >
                查看完整详情
              </Button>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 上下文快照（DetailSection 上 label 下 value，4 列栅格） */}
        <DetailSection title="单据异常快照">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField label="产品名称" value={record.productName} />
            <DetailField label="申请人名称" value={record.applicantName} />
            <DetailField
              label="意向融资金额 / 期数"
              value={`${formatYuan(record.intendedAmountYuan)} 元 / ${record.intendedPeriods} 期`}
            />
            <DetailField
              label="需要尽调路由"
              value={record.needDiligence ? "是（需尽调）" : "否（免尽调直推）"}
            />
            <DetailField label="当前批次号" value={record.batchNo} />
            <DetailField label="历史被拒次数" value={`${record.rejectCount} 次`} />
            <DetailField
              label="退回处理人 / 时间"
              value={`${record.rejectHandler} · ${record.rejectedAt}`}
            />
            <DetailField label="最后被拒原因" value={record.lastRejectReason} />
          </div>
        </DetailSection>

        {/* 操作类型切换条（同一节点支持多个动作时可切换） */}
        {availableActions.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
            <span className="text-xs font-medium text-muted-foreground mr-1">
              重调度方式：
            </span>
            {availableActions.map((act) => (
              <Button
                key={act.key}
                type="button"
                size="sm"
                variant={actionKind === act.key ? "default" : "outline"}
                onClick={() => {
                  setError(null)
                  setSearchParams({ action: act.key }, { replace: true })
                }}
              >
                {act.label}
              </Button>
            ))}
          </div>
        )}

        {/* 主操作表单卡片 */}
        <Card>
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-base">{ACTION_TITLE_MAP[actionKind]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {actionKind === "revive" && (
              <>
                <ProductFieldHint>{REJECT_POOL_REVIVE_USER_HINT}</ProductFieldHint>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      申请人名称 <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="请输入申请人全称"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      联系电话 <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="请输入经办人或申请人联系电话"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      意向融资金额（元） <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="请输入融资金额"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      意向融资期数（月） <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={periodsInput}
                      onChange={(e) => setPeriodsInput(e.target.value)}
                      placeholder="请输入正整数期数"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">抵/质押物类型</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={collateralType === "INVENTORY" ? "default" : "outline"}
                        onClick={() => setCollateralType("INVENTORY")}
                      >
                        现货存货
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          collateralType === "WAREHOUSE_RECEIPT" ? "default" : "outline"
                        }
                        onClick={() => setCollateralType("WAREHOUSE_RECEIPT")}
                      >
                        数字仓单
                      </Button>
                    </div>
                  </div>
                  {collateralType === "WAREHOUSE_RECEIPT" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        关联仓单编号 <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={receiptCode}
                        onChange={(e) => setReceiptCode(e.target.value)}
                        placeholder="请输入数字仓单编号"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">
                    补充资料与救活说明 <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="请描述客户已补充的贸易合同、完税证明或征信修正情况（不少于 5 字）..."
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-border bg-muted/20 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <PaperclipIcon className="size-4 text-primary" />
                    {addedFileName ? (
                      <span className="font-medium text-foreground">{addedFileName}</span>
                    ) : (
                      <span>可附加客户新提供的贸易合同、入库单或征信说明扫描件</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() =>
                      setAddedFileName(
                        `客户补正材料_${record.applyNo}_${new Date().toISOString().slice(0, 10)}.pdf`,
                      )
                    }
                  >
                    <UploadIcon className="size-3.5" />
                    {addedFileName ? "重新上传补正件" : "上传补正附件"}
                  </Button>
                </div>

                <PrototypeSpecCallout>{REJECT_POOL_REVIVE_SPEC_NOTE}</PrototypeSpecCallout>
              </>
            )}

            {actionKind === "routeAssign" && (
              <>
                <ProductFieldHint>{REJECT_POOL_ROUTE_ASSIGN_USER_HINT}</ProductFieldHint>
                <div className="rounded-md border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900">
                  当前单据路由快照：<strong>需要尽调 = {record.needDiligence ? "是" : "否"}</strong>
                  （{record.needDiligence ? "将分派尽调专员并进入待尽调列表" : "将跳过尽调直推授信已受理"}）
                </div>

                {record.needDiligence ? (
                  <div className="space-y-2">
                    <Label className="text-xs">
                      选择在职尽调专员 <span className="text-rose-500">*</span>
                    </Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      {selectableSurveyors.map((s) => {
                        const selected = selectedSurveyorId === s.id
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedSurveyorId(s.id)}
                            className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                              selected
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-border hover:bg-muted/40"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {s.name}
                                <span className="ml-2 text-xs font-normal text-muted-foreground">
                                  {s.org}
                                </span>
                              </div>
                              <div className="mt-0.5 text-xs text-muted-foreground">
                                擅长方向：{s.specialty}
                              </div>
                            </div>
                            <Badge variant="outline">在职</Badge>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs">
                      选择合作资金方机构 <span className="text-rose-500">*</span>
                    </Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      {FUNDER_OPTIONS.map((f) => {
                        const selected = selectedFunderId === f.id
                        const wasRejected = record.historicalRejectedFunders.includes(f.name)
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setSelectedFunderId(f.id)}
                            className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                              selected
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-border hover:bg-muted/40"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {f.name}
                                </span>
                                {wasRejected && (
                                  <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600">
                                    *历史曾拒
                                  </span>
                                )}
                              </div>
                              <div className="mt-0.5 text-xs text-muted-foreground">
                                {f.preference}
                              </div>
                            </div>
                            <Badge variant="outline">已启用</Badge>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <PrototypeSpecCallout>{REJECT_POOL_ROUTE_ASSIGN_SPEC_NOTE}</PrototypeSpecCallout>
              </>
            )}

            {actionKind === "reinitDiligence" && (
              <>
                <ProductFieldHint>{REJECT_POOL_REINIT_DILIGENCE_USER_HINT}</ProductFieldHint>
                <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                  前序尽调专员：<strong>{record.lastSurveyorName || "智能风控自动审查"}</strong> ·
                  重派后将自动生成递增批次号 <strong className="text-foreground">{nextBatchNo(record.batchNo)}</strong>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">
                    选择新尽调专员 <span className="text-rose-500">*</span>
                  </Label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {selectableSurveyors.map((s) => {
                      const selected = selectedSurveyorId === s.id
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedSurveyorId(s.id)}
                          className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                            selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:bg-muted/40"
                          }`}
                        >
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {s.name}
                              <span className="ml-2 text-xs font-normal text-muted-foreground">
                                {s.org}
                              </span>
                            </div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              擅长方向：{s.specialty}
                            </div>
                          </div>
                          <Badge variant="outline">在职</Badge>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <PrototypeSpecCallout>{REJECT_POOL_REINIT_DILIGENCE_SPEC_NOTE}</PrototypeSpecCallout>
              </>
            )}

            {actionKind === "skipDiligence" && (
              <>
                <ProductFieldHint>{REJECT_POOL_SKIP_DILIGENCE_USER_HINT}</ProductFieldHint>
                <div className="space-y-2">
                  <Label className="text-xs">
                    选择目标资金方机构 <span className="text-rose-500">*</span>
                  </Label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {FUNDER_OPTIONS.map((f) => {
                      const selected = selectedFunderId === f.id
                      const wasRejected = record.historicalRejectedFunders.includes(f.name)
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSelectedFunderId(f.id)}
                          className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                            selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:bg-muted/40"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {f.name}
                              </span>
                              {wasRejected && (
                                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600">
                                  *历史曾拒
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {f.preference}
                            </div>
                          </div>
                          <Badge variant="outline">已启用</Badge>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    风控特批跳过尽调理由 <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    rows={3}
                    value={specialReason}
                    onChange={(e) => setSpecialReason(e.target.value)}
                    placeholder="请详细填写特批依据（例如：借款人补充足额银行承兑汇票质押，经首席风控官审批免现场复核，不少于 20 字）..."
                  />
                </div>
                <PrototypeSpecCallout>{REJECT_POOL_SKIP_DILIGENCE_SPEC_NOTE}</PrototypeSpecCallout>
              </>
            )}

            {actionKind === "reassignFunder" && (
              <>
                <ProductFieldHint>{REJECT_POOL_REASSIGN_FUNDER_USER_HINT}</ProductFieldHint>
                <div className="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
                  原尽调报告与信用结论继续生效，且向新资方推送时将自动脱敏前序资方内部审批评语。
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">
                    选择合作资金方机构 <span className="text-rose-500">*</span>
                  </Label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {FUNDER_OPTIONS.map((f) => {
                      const selected = selectedFunderId === f.id
                      const wasRejected = record.historicalRejectedFunders.includes(f.name)
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSelectedFunderId(f.id)}
                          className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                            selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:bg-muted/40"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {f.name}
                              </span>
                              {wasRejected && (
                                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600">
                                  *历史曾拒
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {f.preference}
                            </div>
                          </div>
                          <Badge variant="outline">已启用</Badge>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <PrototypeSpecCallout>{REJECT_POOL_REASSIGN_FUNDER_SPEC_NOTE}</PrototypeSpecCallout>
              </>
            )}

            {actionKind === "unlock" && (
              <>
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  该单据累计入池已达 {record.rejectCount} 次，已触发「五次被拒熔断保护」。录入线下特批审批工单后可恢复重调度权限。
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      线下特批审批工单号 <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={ticketNo}
                      onChange={(e) => setTicketNo(e.target.value)}
                      placeholder="例如：RISK-UNLOCK-20261113-01"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    特批解除说明 <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    rows={3}
                    value={unlockReason}
                    onChange={(e) => setUnlockReason(e.target.value)}
                    placeholder="请填写线下风险评审会结论及允许继续重调度的依据（不少于 5 字）..."
                  />
                </div>
                <PrototypeSpecCallout>{REJECT_POOL_CIRCUIT_BREAKER_SPEC_NOTE}</PrototypeSpecCallout>
              </>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                <AlertTriangleIcon className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`${REJECT_POOL_LIST_PATH}?tab=${record.tabKey}`)}
              >
                取消并返回列表
              </Button>
              <Button type="button" onClick={handleValidateAndOpenConfirm}>
                提交并确认流转
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 二次确认模态弹窗 */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {actionKind === "skipDiligence" || actionKind === "unlock" ? (
                  <ShieldAlertIcon className="size-5 text-amber-600" />
                ) : (
                  <ShieldCheckIcon className="size-5 text-primary" />
                )}
                确认执行「{ACTION_TITLE_MAP[actionKind]}」？
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed">
                操作单据：<strong>{record.applyNo}</strong>（{record.applicantName}）。
                {actionKind === "unlock"
                  ? "确认后将解除熔断锁定并写入风控审计履历。"
                  : `确认后单据将移出被拒退回池，并生成新批次号 ${nextBatchNo(record.batchNo)}。`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
              >
                取消
              </Button>
              <Button type="button" onClick={handleConfirmSubmit}>
                确认执行
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrototypeAnnotationProvider>
  )
}

