import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  CameraIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HelpCircleIcon,
  PlusIcon,
  QrCodeIcon,
  Trash2Icon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/shared/components/PageHeader"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { PartnerChangeFieldMark } from "@/components/form/PartnerChangeZone"
import { PartnerChangeFocusBanner } from "@/features/partner-synergy/components/PartnerChangeFocusBanner"
import { scrollToPartnerChangeMark } from "@/features/partner-synergy/lib/partner-change-review"
import type { PartnerSelectorValue } from "@/features/partner-archives/components/PartnerArchiveSelector"
import { partnerArchivesMock } from "@/features/partner-archives/mock/partner-archives.mock"
import { OwnerNameSearchSelect } from "@/features/inbound-records/components/OwnerNameSearchSelect"
import { HolderNameSearchSelect } from "./HolderNameSearchSelect"
import {
  SUPERVISION_HOLDER_PARTNER_CHANGE_SPEC,
  SUPERVISION_HOLDER_PARTNER_CHANGE_USER,
  SUPERVISION_OWNER_PARTNER_CHANGE_SPEC,
  SUPERVISION_OWNER_PARTNER_CHANGE_USER,
} from "@prototype/shared/partner-change/partner-change-ui-labels"
import {
  SUPERVISION_DOC_KIND_OPTIONS,
  SUPERVISION_OWNER_ARCHIVE_MENU,
  holderArchiveMenuForDocKind,
  type SupervisionDocKind,
} from "@prototype/shared/partner-archives/supervision-partner-reference"
import {
  calcGoodsSummary,
  DOC_KIND_LABELS,
  GUARANTEE_MODE_LABELS,
  GUARANTEE_MODE_OPTIONS,
  holderLabelsForDocKind,
  isDynamicGuaranteeMode,
  toYuan,
  type AmountUnit,
  type GoodsSkuLine,
  type GuaranteeMode,
  type OwnerKind,
  type SupervisionHandlingRecord,
} from "../domain/types"
import { SelectGoodsModal } from "./SelectGoodsModal"

interface SupervisionHandlingFormProps {
  initialRecord?: SupervisionHandlingRecord | null
  partnerReviewActive?: boolean
  partnerMapId?: string | null
  onResetForm: () => void
  onSubmitRecord: (
    payload: Omit<SupervisionHandlingRecord, "id" | "applyNo" | "submittedAt" | "updatedAt" | "timeline">,
    asDraft: boolean,
  ) => void
  onToast: (msg: string) => void
  onQrPreview: (barcode: string) => void
}

export function SupervisionHandlingForm({
  initialRecord,
  partnerReviewActive = false,
  partnerMapId = null,
  onResetForm,
  onSubmitRecord,
  onToast,
  onQrPreview,
}: SupervisionHandlingFormProps) {
  const [ownerType, setOwnerType] = useState<OwnerKind>(initialRecord?.ownerType ?? "ENTERPRISE")
  const [ownerId, setOwnerId] = useState<string | undefined>(initialRecord?.ownerPartnerId)
  const [ownerSelection, setOwnerSelection] = useState<PartnerSelectorValue | null>(() =>
    initialRecord?.ownerName
      ? {
          partnerId: initialRecord.ownerPartnerId ?? "mock-owner",
          partnerNo: "PT-OWNER-001",
          name: initialRecord.ownerName,
          idNumber: initialRecord.ownerIdentifier,
          idNumberMasked: initialRecord.ownerIdentifier,
          subjectType: initialRecord.ownerType === "INDIVIDUAL" ? "INDIVIDUAL" : "ENTERPRISE",
          roleType: "OWNER",
          roleStatus: "NORMAL",
          subjectStatus: "NORMAL",
          contactPhoneVerified: "VERIFIED",
        }
      : null,
  )

  const [ownerExtra, setOwnerExtra] = useState<{ contactPhone?: string; idCardNo?: string }>({})
  const ownerArchive = useMemo(
    () => (ownerSelection ? partnerArchivesMock.find((p) => p.id === ownerSelection.partnerId) : undefined),
    [ownerSelection],
  )

  const [docKind, setDocKind] = useState<SupervisionDocKind>(initialRecord?.docKind ?? "PLEDGE")
  const [guaranteeMode, setGuaranteeMode] = useState<GuaranteeMode>(
    initialRecord?.guaranteeMode ?? "FLOW_PLEDGE",
  )

  const [loanAmountStr, setLoanAmountStr] = useState(
    initialRecord?.loanAmount !== undefined ? String(initialRecord.loanAmount) : "",
  )
  const [loanUnit, setLoanUnit] = useState<AmountUnit>(initialRecord?.loanUnit ?? "WAN")
  const [loanPeriodsStr, setLoanPeriodsStr] = useState(
    initialRecord?.loanPeriods !== undefined ? String(initialRecord.loanPeriods) : "",
  )
  const [creditAmountStr, setCreditAmountStr] = useState(
    initialRecord?.creditAmount !== undefined ? String(initialRecord.creditAmount) : "",
  )
  const [creditUnit, setCreditUnit] = useState<AmountUnit>(initialRecord?.creditUnit ?? "WAN")
  const [creditPeriodsStr, setCreditPeriodsStr] = useState(
    initialRecord?.creditPeriods !== undefined ? String(initialRecord.creditPeriods) : "",
  )

  const [safetyLineEnabled, setSafetyLineEnabled] = useState(
    initialRecord?.safetyLineEnabled ?? true,
  )
  const [safetyLineAmountStr, setSafetyLineAmountStr] = useState(
    initialRecord?.safetyLineAmount !== undefined ? String(initialRecord.safetyLineAmount) : "",
  )
  const [safetyLineUnit, setSafetyLineUnit] = useState<AmountUnit>(
    initialRecord?.safetyLineUnit ?? "WAN",
  )

  const [holderId, setHolderId] = useState<string | undefined>(initialRecord?.holderPartnerId)
  const [holderSelection, setHolderSelection] = useState<PartnerSelectorValue | null>(() =>
    initialRecord?.holderName
      ? {
          partnerId: initialRecord.holderPartnerId ?? "mock-holder",
          partnerNo: "PT-HOLDER-001",
          name: initialRecord.holderName,
          idNumber: initialRecord.holderIdentifier,
          idNumberMasked: initialRecord.holderIdentifier,
          subjectType: "ENTERPRISE",
          roleType: docKind === "SUPERVISION_SERVICE" ? "SERVICE_PROVIDER" : "FUNDER",
          roleStatus: "NORMAL",
          subjectStatus: "NORMAL",
          contactPhoneVerified: "VERIFIED",
        }
      : null,
  )

  const [contractNo, setContractNo] = useState(initialRecord?.contractNo ?? "")
  const [remark, setRemark] = useState(initialRecord?.remark ?? "")
  const [goodsLines, setGoodsLines] = useState<GoodsSkuLine[]>(initialRecord?.goodsLines ?? [])
  const [expandedSkus, setExpandedSkus] = useState<Record<string, boolean>>(() => {
    const first = initialRecord?.goodsLines[0]
    return first ? { [first.skuId]: true } : {}
  })

  const [selectGoodsOpen, setSelectGoodsOpen] = useState(false)
  const [removeConfirm, setRemoveConfirm] = useState<{
    type: "SKU" | "SLOT"
    skuId: string
    slotId?: string
    label: string
  } | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!partnerReviewActive) return
    const timer = window.setTimeout(() => scrollToPartnerChangeMark("supervision-owner"), 120)
    return () => window.clearTimeout(timer)
  }, [partnerReviewActive])

  const holderArchiveMenu = holderArchiveMenuForDocKind(docKind)
  const holderLabels = holderLabelsForDocKind(docKind)
  const modeOptions = GUARANTEE_MODE_OPTIONS[docKind]
  const showSafetyLine = isDynamicGuaranteeMode(guaranteeMode)
  const summary = useMemo(() => calcGoodsSummary(goodsLines), [goodsLines])

  const handleDocKindChange = (next: SupervisionDocKind) => {
    setDocKind(next)
    setGuaranteeMode(GUARANTEE_MODE_OPTIONS[next][0].value)
    // R14/R15: 切换单据类型清空已选权人以防跨资金方/服务方域混选，但保留已选货品明细
    setHolderId(undefined)
    setHolderSelection(null)
    setFormErrors((prev) => {
      const copy = { ...prev }
      delete copy.holder
      return copy
    })
  }

  const handleSimulateOcr = () => {
    setOwnerType("ENTERPRISE")
    setOwnerId("partner-owner-ocr-1")
    setOwnerSelection({
      partnerId: "partner-owner-ocr-1",
      partnerNo: "PT-OCR-001",
      name: "亮点信息科技有限公司",
      idNumber: "91441400MA52XE5675",
      idNumberMasked: "91441400MA52XE5675",
      subjectType: "ENTERPRISE",
      roleType: "OWNER",
      roleStatus: "NORMAL",
      subjectStatus: "NORMAL",
      contactPhoneVerified: "VERIFIED",
    })
    setFormErrors((prev) => {
      const copy = { ...prev }
      delete copy.owner
      return copy
    })
    onToast("营业执照 OCR 识别成功，已自动带出货主名称、信用代码与联系电话")
  }

  const validateLoanVsCredit = (): string | null => {
    const loanAmt = loanAmountStr.trim() === "" ? undefined : Number(loanAmountStr)
    const creditAmt = creditAmountStr.trim() === "" ? undefined : Number(creditAmountStr)
    if (loanAmt !== undefined && creditAmt !== undefined) {
      if (toYuan(loanAmt, loanUnit) > toYuan(creditAmt, creditUnit)) {
        return "贷款金额不能高于资金方核准的授信金额"
      }
    }
    const loanP = loanPeriodsStr.trim() === "" ? undefined : Number(loanPeriodsStr)
    const creditP = creditPeriodsStr.trim() === "" ? undefined : Number(creditPeriodsStr)
    if (loanP !== undefined && creditP !== undefined && loanP > creditP) {
      return "贷款期数不能高于授信期数"
    }
    return null
  }

  const handleSubmit = (asDraft: boolean) => {
    const errors: Record<string, string> = {}

    if (!ownerSelection) {
      errors.owner = "请检索或选择货主信息"
    }
    if (!holderSelection) {
      errors.holder = `请选择${holderLabels.nameLabel}`
    }

    const loanCreditErr = validateLoanVsCredit()
    if (loanCreditErr) {
      errors.loanCredit = loanCreditErr
    }

    if (showSafetyLine && safetyLineEnabled) {
      const safeNum = Number(safetyLineAmountStr)
      if (!safetyLineAmountStr.trim() || Number.isNaN(safeNum) || safeNum <= 0) {
        errors.safetyLine = "流动/浮动模式下开启安全线后，货值安全线必须大于 0"
      }
    }

    if (!asDraft && summary.categoryCount === 0) {
      errors.goods = "请至少添加并分配 1 项有效货物"
    }

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      const firstMsg = Object.values(errors)[0]
      onToast(`校验未通过：${firstMsg}`)
      return
    }

    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      onSubmitRecord(
        {
          docKind,
          guaranteeMode,
          ownerType,
          ownerPartnerId: ownerId,
          ownerName: ownerSelection!.name,
          ownerIdentifier: ownerSelection!.idNumberMasked || ownerSelection!.idNumber || "91310115MA1K4R892X",
          ownerContact: ownerType === "ENTERPRISE" ? "186****5923" : "420101********4230",
          holderPartnerId: holderId,
          holderName: holderSelection!.name,
          holderIdentifier: holderSelection!.idNumberMasked || holderSelection!.idNumber || "91110108MA01XXXXXX",
          loanAmount: loanAmountStr.trim() ? Number(loanAmountStr) : undefined,
          loanUnit,
          loanPeriods: loanPeriodsStr.trim() ? Number(loanPeriodsStr) : undefined,
          creditAmount: creditAmountStr.trim() ? Number(creditAmountStr) : undefined,
          creditUnit,
          creditPeriods: creditPeriodsStr.trim() ? Number(creditPeriodsStr) : undefined,
          safetyLineEnabled: showSafetyLine ? safetyLineEnabled : false,
          safetyLineAmount:
            showSafetyLine && safetyLineEnabled && safetyLineAmountStr.trim()
              ? Number(safetyLineAmountStr)
              : undefined,
          safetyLineUnit,
          contractNo: contractNo.trim() || undefined,
          remark: remark.trim() || undefined,
          goodsLines,
          categoryCount: summary.categoryCount,
          totalQtyDisplay: summary.totalQtyDisplay,
          totalValueWan: summary.totalValueWan,
          status: asDraft ? "DRAFT" : "PENDING_APPROVAL",
          applicantName: "当前经办人 (SY-1008)",
          relatedInboundNo: initialRecord?.relatedInboundNo ?? "RK-20261108-0019",
          relatedSupervisionOrderNo: initialRecord?.relatedSupervisionOrderNo,
        },
        asDraft,
      )
    }, 350)
  }

  const confirmRemove = () => {
    if (!removeConfirm) return
    if (removeConfirm.type === "SKU") {
      setGoodsLines((prev) => prev.filter((l) => l.skuId !== removeConfirm.skuId))
      onToast(`已移除货品「${removeConfirm.label}」`)
    } else if (removeConfirm.slotId) {
      setGoodsLines((prev) =>
        prev
          .map((l) =>
            l.skuId === removeConfirm.skuId
              ? { ...l, slots: l.slots.filter((s) => s.slotId !== removeConfirm.slotId) }
              : l,
          )
          .filter((l) => l.slots.length > 0),
      )
      onToast(`已移除货位「${removeConfirm.label}」`)
    }
    setRemoveConfirm(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="监管办理"
        description="支持企业/个人货主动态映射、抵押/质押/监管服务单据开立及在库实物货位圈选"
        actions={
          <Button
            type="button"
            className="shrink-0"
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            title={summary.categoryCount === 0 ? "点击后将提示先添加并分配货物" : undefined}
          >
            {submitting ? "提交锁定中..." : "提交审核"}
          </Button>
        }
      />

      {partnerReviewActive && partnerMapId ? (
        <PartnerChangeFocusBanner mapId={partnerMapId} />
      ) : null}

      {/* 一、基础信息区 */}
      <PrototypeAnnotationTarget annotationIds={["supervision-handling-basic-form"]}>
        <Card id="supervision-handling-basic-form">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-base font-semibold">基础信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            {/* 基础信息输入区：严格一行三列，货主标识与证件/联系电话交互对齐【入库记录-新增】 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* 1. 货主类型 */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  <span className="mr-0.5 text-rose-500">*</span>货主类型
                </Label>
                <Select
                  value={ownerType}
                  onValueChange={(v) => {
                    setOwnerType(v as OwnerKind)
                    setOwnerId(undefined)
                    setOwnerSelection(null)
                    setOwnerExtra({})
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="请选择货主类型">
                      {ownerType === "ENTERPRISE" ? "企业" : "个人"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTERPRISE">企业</SelectItem>
                    <SelectItem value="INDIVIDUAL">个人</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 2. 货主名称（复用入库新增页 OwnerNameSearchSelect + OCR 图标按钮） */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  <span className="mr-0.5 text-rose-500">*</span>货主名称
                </Label>
                <PartnerChangeFieldMark
                  markId="supervision-owner"
                  userHint={partnerReviewActive ? SUPERVISION_OWNER_PARTNER_CHANGE_USER : undefined}
                  specNote={partnerReviewActive ? SUPERVISION_OWNER_PARTNER_CHANGE_SPEC : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="min-w-0 flex-1">
                      <OwnerNameSearchSelect
                        ownerType={ownerType === "ENTERPRISE" ? "企业货主" : "个人货主"}
                        ownerName={ownerSelection?.name ?? ""}
                        ownerIdentifier={ownerSelection?.idNumber ?? ""}
                        onSelect={(selection) => {
                          const nextOwnerType: OwnerKind =
                            selection.ownerType === "个人货主" ? "INDIVIDUAL" : "ENTERPRISE"
                          if (nextOwnerType !== ownerType) {
                            setOwnerType(nextOwnerType)
                          }
                          const partnerId = selection.partnerId || `owner-${Date.now()}`
                          setOwnerId(partnerId)
                          setOwnerSelection({
                            partnerId,
                            partnerNo: partnerId,
                            name: selection.ownerName,
                            idNumber: selection.ownerIdentifier ?? "",
                            idNumberMasked: selection.idCardNo
                              ? selection.idCardNo.replace(/^(.{6}).*(.{4})$/, "$1********$2")
                              : selection.ownerIdentifier ?? "",
                            subjectType: nextOwnerType === "INDIVIDUAL" ? "INDIVIDUAL" : "ENTERPRISE",
                            roleType: "OWNER",
                            roleStatus: "NORMAL",
                            subjectStatus: "NORMAL",
                            contactPhoneVerified: selection.contactPhoneVerified ?? "VERIFIED",
                          })
                          setOwnerExtra({
                            contactPhone: selection.contactPhone,
                            idCardNo: selection.idCardNo,
                          })
                          setFormErrors((prev) => {
                            const copy = { ...prev }
                            delete copy.owner
                            return copy
                          })
                        }}
                      />
                    </div>
                    {ownerType === "ENTERPRISE" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 border-primary/30 text-primary hover:bg-primary/5"
                        title="营业执照 OCR 拍照识别（自动回填）"
                        aria-label="营业执照 OCR 识别"
                        onClick={handleSimulateOcr}
                      >
                        <CameraIcon className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                </PartnerChangeFieldMark>
                {formErrors.owner ? (
                  <p className="text-xs text-rose-600">{formErrors.owner}</p>
                ) : null}
              </div>

              {/* 3. 货主标识（对齐入库新增页：反显置灰不可修改） */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  货主标识
                </Label>
                <Input
                  disabled
                  placeholder="选择货主后自动反显"
                  value={
                    ownerSelection
                      ? ownerType === "ENTERPRISE"
                        ? ownerSelection.idNumber || ownerArchive?.idNumber || "91441400MA52XE5675"
                        : (() => {
                            const phone = ownerExtra.contactPhone || ownerArchive?.contactPhone
                            return phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "138****8888"
                          })()
                      : ""
                  }
                  className="h-9 cursor-not-allowed select-none bg-muted/60 text-muted-foreground"
                />
              </div>

              {/* 4. 联系电话（企业） / 身份证号（个人）（对齐入库新增页：脱敏反显置灰） */}
              {ownerType === "INDIVIDUAL" ? (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    身份证号
                  </Label>
                  <Input
                    disabled
                    placeholder="选择货主后自动反显"
                    value={
                      ownerSelection
                        ? (() => {
                            const raw = ownerExtra.idCardNo || ownerSelection.idNumberMasked || ownerArchive?.idNumberMasked || ownerSelection.idNumber
                            if (!raw) return "420101********4230"
                            if (raw.includes("*")) return raw
                            return raw.replace(/^(.{6}).*(.{4})$/, "$1********$2")
                          })()
                        : ""
                    }
                    className="h-9 cursor-not-allowed select-none bg-muted/60 text-muted-foreground"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    联系电话
                  </Label>
                  <Input
                    disabled
                    placeholder="选择货主后自动反显"
                    value={
                      ownerSelection
                        ? (() => {
                            const phone = ownerExtra.contactPhone || ownerArchive?.contactPhone
                            return phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "186****5923"
                          })()
                        : ""
                    }
                    className="h-9 cursor-not-allowed select-none bg-muted/60 text-muted-foreground"
                  />
                </div>
              )}

              {/* 5. 开立单据类型 */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  <span className="mr-0.5 text-rose-500">*</span>开立单据类型
                </Label>
                <Select
                  value={docKind}
                  onValueChange={(v) => handleDocKindChange(v as SupervisionDocKind)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="请选择开立单据类型">
                      {DOC_KIND_LABELS[docKind]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SUPERVISION_DOC_KIND_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 6. 贷款金额 */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">贷款金额</Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={loanAmountStr}
                    onChange={(e) => {
                      setLoanAmountStr(e.target.value)
                      setFormErrors((p) => ({ ...p, loanCredit: "" }))
                    }}
                    placeholder="请输入实际贷款金额"
                    className="h-9"
                  />
                  <Select value={loanUnit} onValueChange={(v) => setLoanUnit(v as AmountUnit)}>
                    <SelectTrigger className="h-9 w-24 shrink-0">
                      <SelectValue>{loanUnit === "WAN" ? "万元" : "元"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WAN">万元</SelectItem>
                      <SelectItem value="YUAN">元</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">贷款期数</Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={1}
                    max={360}
                    value={loanPeriodsStr}
                    onChange={(e) => {
                      setLoanPeriodsStr(e.target.value)
                      setFormErrors((p) => ({ ...p, loanCredit: "" }))
                    }}
                    placeholder="请输入实际贷款期数"
                    className="h-9"
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">期</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">授信金额</Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={creditAmountStr}
                    onChange={(e) => {
                      setCreditAmountStr(e.target.value)
                      setFormErrors((p) => ({ ...p, loanCredit: "" }))
                    }}
                    placeholder="请输入授信金额"
                    className="h-9"
                  />
                  <Select value={creditUnit} onValueChange={(v) => setCreditUnit(v as AmountUnit)}>
                    <SelectTrigger className="h-9 w-24 shrink-0">
                      <SelectValue>{creditUnit === "WAN" ? "万元" : "元"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WAN">万元</SelectItem>
                      <SelectItem value="YUAN">元</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">授信期数</Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={1}
                    max={360}
                    value={creditPeriodsStr}
                    onChange={(e) => {
                      setCreditPeriodsStr(e.target.value)
                      setFormErrors((p) => ({ ...p, loanCredit: "" }))
                    }}
                    placeholder="请输入授信期数"
                    className="h-9"
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">期</span>
                </div>
              </div>
              {formErrors.loanCredit ? (
                <p className="text-xs font-medium text-rose-600 md:col-span-3">{formErrors.loanCredit}</p>
              ) : null}

              {/* 担保方式 + 货值安全线（R03 仅流动/浮动/动态显示，静态/固定彻底隐藏） */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  <span className="mr-0.5 text-rose-500">*</span>
                  {docKind === "MORTGAGE"
                    ? "抵押方式"
                    : docKind === "PLEDGE"
                      ? "质押方式"
                      : "监管方式"}
                </Label>
                <Select
                  value={guaranteeMode}
                  onValueChange={(v) => setGuaranteeMode(v as GuaranteeMode)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue>{GUARANTEE_MODE_LABELS[guaranteeMode]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {modeOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showSafetyLine ? (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">货值安全线开关</Label>
                    <div className="flex h-9 items-center gap-2.5 rounded-md border border-input px-3">
                      <Switch
                        checked={safetyLineEnabled}
                        onCheckedChange={setSafetyLineEnabled}
                      />
                      <span className="text-xs text-muted-foreground">
                        {safetyLineEnabled ? "已开启监控" : "已关闭"}
                      </span>
                    </div>
                  </div>
                  {safetyLineEnabled ? (
                    <div className="space-y-1.5">
                      <Label className="inline-flex items-center gap-1 text-xs font-medium">
                        <span className="text-rose-500">*</span>
                        货值安全线
                        <span
                          className="text-muted-foreground"
                          title="低于该市值阈值时将联动触发补仓预警"
                        >
                          <HelpCircleIcon className="size-3.5" />
                        </span>
                      </Label>
                      <div className="flex items-center gap-1.5">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={safetyLineAmountStr}
                          onChange={(e) => {
                            setSafetyLineAmountStr(e.target.value)
                            setFormErrors((p) => ({ ...p, safetyLine: "" }))
                          }}
                          placeholder="请输入货值安全线（大于 0）"
                          className="h-9"
                        />
                        <Select
                          value={safetyLineUnit}
                          onValueChange={(v) => setSafetyLineUnit(v as AmountUnit)}
                        >
                          <SelectTrigger className="h-9 w-24 shrink-0">
                            <SelectValue>{safetyLineUnit === "WAN" ? "万元" : "元"}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WAN">万元</SelectItem>
                            <SelectItem value="YUAN">元</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formErrors.safetyLine ? (
                        <p className="text-xs text-rose-600">{formErrors.safetyLine}</p>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : null}
              {/* 权人主体类型（恒定企业只读）+ 权人合作方引用（R14/R15 域隔离）+ 合同编号 */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  <span className="mr-0.5 text-rose-500">*</span>
                  {holderLabels.typeLabel}
                </Label>
                <Input readOnly value="企业" className="h-9 bg-muted/40 text-muted-foreground" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  <span className="mr-0.5 text-rose-500">*</span>
                  {holderLabels.nameLabel}
                </Label>
                <PrototypeAnnotationTarget annotationIds={["supervision-handling-holder-picker"]}>
                  <div id="supervision-handling-holder-picker">
                    <PartnerChangeFieldMark
                      markId="supervision-holder"
                      userHint={partnerReviewActive ? SUPERVISION_HOLDER_PARTNER_CHANGE_USER : undefined}
                      specNote={partnerReviewActive ? SUPERVISION_HOLDER_PARTNER_CHANGE_SPEC : undefined}
                    >
                      <HolderNameSearchSelect
                        archiveMenu={holderArchiveMenu}
                        selectedId={holderId}
                        selectedName={holderSelection?.name ?? ""}
                        placeholder={`请输入${holderLabels.nameLabel}或信用代码搜索`}
                        onSelect={(payload) => {
                          setHolderSelection(payload)
                          setHolderId(payload?.partnerId)
                          setFormErrors((prev) => {
                            const copy = { ...prev }
                            delete copy.holder
                            return copy
                          })
                        }}
                      />
                    </PartnerChangeFieldMark>
                  </div>
                </PrototypeAnnotationTarget>
                {formErrors.holder ? (
                  <p className="text-xs text-rose-600">{formErrors.holder}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">合同编号</Label>
                <Input
                  maxLength={50}
                  value={contractNo}
                  onChange={(e) => setContractNo(e.target.value)}
                  placeholder="请输入合同编号（选填，最多50字）"
                  className="h-9"
                />
              </div>
            </div>

            {/* 备注 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">业务备注</Label>
                <span className="text-xs text-muted-foreground">{remark.length}/500</span>
              </div>
              <Textarea
                maxLength={500}
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="请输入备注"
              />
            </div>
          </CardContent>
        </Card>
      </PrototypeAnnotationTarget>

      {/* 二、货品明细区（两级级联表格） */}
      <PrototypeAnnotationTarget annotationIds={["supervision-handling-goods-table"]}>
        <Card id="supervision-handling-goods-table">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            <CardTitle className="text-base font-semibold">货品明细</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/仓储/入库管理/入库记录/新增"
                className="text-xs font-medium text-amber-600 hover:text-amber-700 hover:underline"
              >
                没有我想选的? 去发起入库
              </Link>
              <Button
                type="button"
                size="sm"
                onClick={() => setSelectGoodsOpen(true)}
              >
                <PlusIcon className="size-4" />
                添加货物
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {goodsLines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <p className="text-sm text-muted-foreground">
                  暂未添加抵质押货品明细，请点击右上角「+ 添加货物」从在库合格存货中圈选。
                </p>
                {formErrors.goods ? (
                  <p className="mt-2 text-xs font-medium text-rose-600">{formErrors.goods}</p>
                ) : null}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                      <th className="w-10 px-3 py-2.5 text-center">折</th>
                      <th className="w-12 px-3 py-2.5 text-center">序</th>
                      <th className="whitespace-nowrap px-3 py-2.5">货物名称</th>
                      <th className="whitespace-nowrap px-3 py-2.5 whitespace-nowrap">{holderLabels.qtyLabel}</th>
                      <th className="whitespace-nowrap px-3 py-2.5 whitespace-nowrap">单价(元)</th>
                      <th className="whitespace-nowrap px-3 py-2.5 whitespace-nowrap">总价(元)</th>
                      <th className="w-24 px-3 py-2.5 text-center whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {goodsLines.map((line, idx) => {
                      const isExpanded = Boolean(expandedSkus[line.skuId])
                      const qtySum = line.slots.reduce((s, x) => s + x.allocatedQty, 0)
                      const totalYuan =
                        line.unitPriceYuan !== null ? qtySum * line.unitPriceYuan : null
                      return (
                        <FormSkuGroup
                          key={line.skuId}
                          index={idx + 1}
                          line={line}
                          qtySum={qtySum}
                          totalYuan={totalYuan}
                          qtyLabel={holderLabels.qtyLabel}
                          isExpanded={isExpanded}
                          onToggle={() =>
                            setExpandedSkus((prev) => ({
                              ...prev,
                              [line.skuId]: !prev[line.skuId],
                            }))
                          }
                          onRemoveSku={() =>
                            setRemoveConfirm({
                              type: "SKU",
                              skuId: line.skuId,
                              label: line.skuName,
                            })
                          }
                          onRemoveSlot={(slotId, slotLoc) =>
                            setRemoveConfirm({
                              type: "SLOT",
                              skuId: line.skuId,
                              slotId,
                              label: slotLoc,
                            })
                          }
                          onQrPreview={onQrPreview}
                        />
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 底部汇总栏 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span>
                  货品品类数：<strong className="text-foreground">{summary.categoryCount}</strong>
                </span>
                <span className="text-border">|</span>
                <span>
                  货品总数量：<strong className="text-foreground">{summary.totalQtyDisplay}</strong>
                </span>
                <span className="text-border">|</span>
                <span>
                  货品总价值：
                  <strong className="text-primary">
                    {summary.totalValueWan !== null ? `${summary.totalValueWan}万元` : "--"}
                  </strong>
                  {summary.hasUnpriced ? (
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      （部分未维护单价货品除外）
                    </span>
                  ) : null}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </PrototypeAnnotationTarget>

      <SelectGoodsModal
        open={selectGoodsOpen}
        onOpenChange={setSelectGoodsOpen}
        qtyColumnLabel={holderLabels.qtyLabel}
        initialLines={goodsLines}
        onConfirm={(nextLines) => {
          setGoodsLines(nextLines)
          if (nextLines[0]) {
            setExpandedSkus({ [nextLines[0].skuId]: true })
          }
          setFormErrors((p) => ({ ...p, goods: "" }))
          onToast(`已带入 ${nextLines.length} 个品类货品明细`)
        }}
      />

      <Dialog open={Boolean(removeConfirm)} onOpenChange={(v) => !v && setRemoveConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Trash2Icon className="size-4 text-rose-600" />
              确认移除货品明细
            </DialogTitle>
            <DialogDescription>
              确认从本次监管办理单据中移除「{removeConfirm?.label}」吗？移除后将实时重算底部汇总价值。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRemoveConfirm(null)}>
              取消
            </Button>
            <Button type="button" variant="destructive" onClick={confirmRemove}>
              确认移除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FormSkuGroup({
  index,
  line,
  qtySum,
  totalYuan,
  qtyLabel,
  isExpanded,
  onToggle,
  onRemoveSku,
  onRemoveSlot,
  onQrPreview,
}: {
  index: number
  line: GoodsSkuLine
  qtySum: number
  totalYuan: number | null
  qtyLabel: string
  isExpanded: boolean
  onToggle: () => void
  onRemoveSku: () => void
  onRemoveSlot: (slotId: string, label: string) => void
  onQrPreview: (barcode: string) => void
}) {
  return (
    <>
      <tr className="hover:bg-muted/20">
        <td className="px-3 py-2.5 text-center">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex size-6 items-center justify-center rounded hover:bg-muted"
          >
            {isExpanded ? (
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRightIcon className="size-4 text-muted-foreground" />
            )}
          </button>
        </td>
        <td className="px-3 py-2.5 text-center text-muted-foreground">{index}</td>
        <td className="px-3 py-2.5 font-medium text-foreground">{line.skuName}</td>
        <td className="px-3 py-2.5 whitespace-nowrap">
          {Number(qtySum.toFixed(4))}
          {line.unit}
        </td>
        <td className="px-3 py-2.5 whitespace-nowrap">
          {line.unitPriceYuan !== null ? line.unitPriceYuan.toLocaleString("zh-CN") : "--"}
        </td>
        <td className="px-3 py-2.5 whitespace-nowrap font-medium">
          {totalYuan !== null
            ? totalYuan.toLocaleString("zh-CN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "--"}
        </td>
        <td className="px-3 py-2.5 text-center whitespace-nowrap">
          <button
            type="button"
            onClick={onRemoveSku}
            className="text-xs font-medium text-amber-600 hover:text-amber-700 hover:underline"
          >
            移除
          </button>
        </td>
      </tr>
      {isExpanded ? (
        <tr>
          <td colSpan={7} className="bg-muted/15 px-4 py-2.5">
            <div className="overflow-hidden rounded-md border border-border bg-background">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                    <th className="w-10 px-2.5 py-2 text-center">序</th>
                    <th className="px-2.5 py-2">位置</th>
                    <th className="px-2.5 py-2">具体位置</th>
                    <th className="px-2.5 py-2 whitespace-nowrap">入库时间</th>
                    <th className="px-2.5 py-2">批次扩展信息</th>
                    <th className="px-2.5 py-2 whitespace-nowrap">状态</th>
                    <th className="px-2.5 py-2 whitespace-nowrap">存货条码</th>
                    <th className="px-2.5 py-2 whitespace-nowrap">{qtyLabel}</th>
                    <th className="px-2.5 py-2 whitespace-nowrap">总价(元)</th>
                    <th className="w-20 px-2.5 py-2 text-center whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {line.slots.map((slot, sIdx) => {
                    const slotTotal =
                      line.unitPriceYuan !== null ? slot.allocatedQty * line.unitPriceYuan : null
                    const locText = `${slot.warehouseName}-${slot.storeroomName}-${slot.zoneName}`
                    return (
                      <tr key={slot.slotId}>
                        <td className="px-2.5 py-2 text-center text-muted-foreground">{sIdx + 1}</td>
                        <td className="px-2.5 py-2 text-foreground">{locText}</td>
                        <td className="px-2.5 py-2 text-muted-foreground">{slot.locationCode}</td>
                        <td className="px-2.5 py-2 whitespace-nowrap text-muted-foreground">
                          {slot.inboundTime}
                        </td>
                        <td className="px-2.5 py-2 text-muted-foreground">{slot.batchExtra}</td>
                        <td className="px-2.5 py-2 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700"
                          >
                            {slot.controlStatus}
                          </Badge>
                        </td>
                        <td className="px-2.5 py-2">
                          <button
                            type="button"
                            onClick={() => onQrPreview(slot.barcode)}
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <QrCodeIcon className="size-3.5" />
                            <span>条码</span>
                          </button>
                        </td>
                        <td className="px-2.5 py-2 whitespace-nowrap font-medium">
                          {slot.allocatedQty}
                          {line.unit}
                        </td>
                        <td className="px-2.5 py-2 whitespace-nowrap">
                          {slotTotal !== null
                            ? slotTotal.toLocaleString("zh-CN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "--"}
                        </td>
                        <td className="px-2.5 py-2 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onRemoveSlot(slot.slotId, locText)}
                            className="text-amber-600 hover:text-amber-700 hover:underline"
                          >
                            移除
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}
