import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { partnerArchiveBaseFromPathname } from "@prototype/shared/partner-archives/partner-archive-routes"
import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react"
import {
  demoPartnerEnterpriseLicenseOcr,
  PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_RECOGNIZING,
  PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_SUCCESS,
} from "@prototype/shared/partner-archives/partner-enterprise-license-ocr.demo"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { getPartnerArchiveDocuments } from "../documents/partner-archive-documents"
import {
  parsePartnerArchiveMenuFromPathname,
  type PartnerArchiveMenuLabel,
} from "@prototype/shared/partner-archives/partner-archive-routes"
import {
  ARCHIVE_MENU_SHORT_LABEL,
  implicitRoleForArchiveMenu,
} from "@prototype/shared/partner-archives/partner-archive-domain"
import { partnerArchiveFormAnnotations } from "../annotations/partner-archive-form.annotations"
import { PartnerEnterpriseLicenseOcrButton } from "../components/PartnerEnterpriseLicenseOcrButton"
import { PartnerCompositeSaveDialog } from "../components/PartnerCompositeSaveDialog"
import type { PartnerCompositeSaveDialogMode } from "../components/PartnerCompositeSaveDialog"
import { PartnerVerifyDialog } from "../components/PartnerVerifyDialog"
import { PARTNER_FORM_SUBJECT_TYPE_OPTIONS } from "../domain/constants"
import {
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
} from "../domain/actions"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
  markContactPhoneVerified,
  requiresPartnerEditPhoneSmsVerify,
  resolveContactPhoneVerified,
} from "../lib/contact-phone-verify"
import { getPartnerArchiveById } from "../lib/detail-utils"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
  findOwnerAddressConflict,
  ownerAddressConflictMessage,
  findPartnerByIdNumber,
  maskIdNumber,
} from "../lib/partner-archive-rules"
import {
  PARTNER_FORM_ADDRESS_SPEC_NOTE_OWNER,
  PARTNER_FORM_ADDRESS_SPEC_NOTE_OTHER,
  PARTNER_FORM_INITIAL_ROLES_SECTION_TITLE,
  PARTNER_FORM_INITIAL_ROLES_SPEC_NOTE,
  PARTNER_FORM_INITIAL_ROLES_USER_HINT,
  partnerFormAddressUserHint,
  partnerPendingCompletionUserBanner,
  PARTNER_PENDING_COMPLETION_SPEC_NOTE,
  PARTNER_OWNER_ENTERPRISE_AGENT_USER_HINT,
  partnerEnterpriseAgentIdSpecNote,
  partnerEnterpriseAgentIdUserHint,
  partnerFormPageTitle,
} from "../lib/partner-archive-ui-labels"
import type { PartnerSubject, SubjectType } from "../domain/types"
import {
  appendLinkedPartnerMenus,
  normalizePartnerPlanB,
  otherArchiveMenus,
} from "../lib/linked-partner-archives"
import {
  appendMenusSelectableForSubjectType,
  buildCompositeAppendPlan,
  type AppendPlanItem,
  type CompositePrecheckFailure,
  type CompositeSaveResultLine,
} from "../lib/composite-append-save"
import { buildPartnerAddressAuditClauses } from "@prototype/shared/partner-archives/partner-audit-log-detail"
import {
  canEditPartnerSubjectIdNumberOnForm,
  canEditPartnerSubjectNameOnForm,
  isArchiveRequiredFieldsPending,
  isCertAddressSaveRequired,
  isEnterpriseOnlyArchiveMenu,
  isPickupEnterpriseAgentIdRequired,
  isPickupEnterpriseAgentNameRequired,
  partnerArchiveMenuForFormValidation,
  showEnterpriseAgentIdNumberField,
  validateArchiveMenuRequiredFields,
} from "../lib/archive-required-fields-pending"
import { PARTNER_FORM_LOCKED_FIELD_PC } from "@prototype/shared/partner-archives/partner-form-field-styles"
import { cn } from "@/lib/utils"

function subjectTypeFromLabel(label: string): SubjectType {
  return label === "企业" ? "ENTERPRISE" : "INDIVIDUAL"
}

function subjectTypeToLabel(type: SubjectType) {
  return type === "ENTERPRISE" ? "企业" : "个人"
}

export function PartnerArchiveFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const listPath = partnerArchiveBaseFromPathname(location.pathname)
  const archiveMenuLabel = parsePartnerArchiveMenuFromPathname(location.pathname)
  const menuShortLabel = ARCHIVE_MENU_SHORT_LABEL[archiveMenuLabel]
  const archiveDocuments = useMemo(
    () => getPartnerArchiveDocuments(archiveMenuLabel),
    [archiveMenuLabel],
  )
  const isEdit = Boolean(id)
  const existing = useMemo(() => (isEdit ? getPartnerArchiveById(id) : undefined), [id, isEdit])

  const defaultSubjectTypeLabel = useMemo(() => {
    if (existing) {
      return subjectTypeToLabel(existing.subjectType)
    }
    if (isEnterpriseOnlyArchiveMenu(archiveMenuLabel)) {
      return "企业"
    }
    return "个人"
  }, [existing, archiveMenuLabel])

  const [subjectTypeLabel, setSubjectTypeLabel] = useState(defaultSubjectTypeLabel)
  const subjectType = subjectTypeFromLabel(subjectTypeLabel)

  const [name, setName] = useState(existing?.name ?? "")
  const [idNumber, setIdNumber] = useState(existing?.idNumber ?? "")
  const [contactPhone, setContactPhone] = useState(existing?.contactPhone ?? "")
  const [agentName, setAgentName] = useState(existing?.agentName ?? "")
  const [agentIdNumber, setAgentIdNumber] = useState(existing?.agentIdNumber ?? "")
  const [adjustAgentMode, setAdjustAgentMode] = useState(false)
  const [province, setProvince] = useState(existing?.certAddress.province || (isEdit ? "" : "江苏省"))
  const [city, setCity] = useState(existing?.certAddress.city || (isEdit ? "" : "南京市"))
  const [district, setDistrict] = useState(existing?.certAddress.district || (isEdit ? "" : "鼓楼区"))
  const [detailAddress, setDetailAddress] = useState(existing?.certAddress.detail ?? "")
  const [selectedAppendMenus, setSelectedAppendMenus] = useState<PartnerArchiveMenuLabel[]>(
    [],
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [accessWarning, setAccessWarning] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [verifyDialogMode, setVerifyDialogMode] = useState<
    "CHANGE_PHONE" | "VERIFY_CONTACT"
  >("CHANGE_PHONE")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [compositeDialogOpen, setCompositeDialogOpen] = useState(false)
  const [compositeDialogMode, setCompositeDialogMode] =
    useState<PartnerCompositeSaveDialogMode>("confirm")
  const [compositePlan, setCompositePlan] = useState<AppendPlanItem[]>([])
  const [compositeFailures, setCompositeFailures] = useState<CompositePrecheckFailure[]>(
    [],
  )
  const [compositeSuccessLines, setCompositeSuccessLines] = useState<
    CompositeSaveResultLine[]
  >([])
  const [pendingSaveOptions, setPendingSaveOptions] = useState<
    { verifiedOnCreate?: boolean } | undefined
  >(undefined)
  const [lastCreatedPartnerId, setLastCreatedPartnerId] = useState<string | null>(null)
  const [lastSaveVerified, setLastSaveVerified] = useState(false)

  const appendMenuOptions = useMemo(
    () =>
      appendMenusSelectableForSubjectType(
        otherArchiveMenus(archiveMenuLabel),
        subjectType,
      ),
    [archiveMenuLabel, subjectType],
  )

  useEffect(() => {
    setSelectedAppendMenus((current) =>
      current.filter((menu) => appendMenuOptions.includes(menu)),
    )
  }, [appendMenuOptions])

  const isPendingCompletion = useMemo(() => {
    if (!existing) return false
    return isArchiveRequiredFieldsPending(existing)
  }, [existing])

  const isFrozenLimitedEdit = Boolean(
    isEdit && existing?.status === "FROZEN" && !isPendingCompletion
  )

  const isContactPhoneVerified = Boolean(
    isEdit && existing && resolveContactPhoneVerified(existing) === "VERIFIED"
  )

  const coreIdentityLocked = Boolean(isEdit && isContactPhoneVerified && !isPendingCompletion)

  const menuForValidation = partnerArchiveMenuForFormValidation({
    isEdit,
    routeMenu: archiveMenuLabel,
    existing,
  })

  const canEditSubjectName = canEditPartnerSubjectNameOnForm({
    isEdit,
    isFrozenLimitedEdit,
    isContactPhoneVerified,
  })
  const canEditSubjectId = canEditPartnerSubjectIdNumberOnForm({
    isEdit,
    isFrozenLimitedEdit,
    isContactPhoneVerified,
  })

  const subjectNameReadOnly = !canEditSubjectName
  const subjectIdReadOnly = !canEditSubjectId
  const subjectTypeLocked = Boolean(
    isEdit || isEnterpriseOnlyArchiveMenu(archiveMenuLabel),
  )
  const agentNameLocked = Boolean(
    isFrozenLimitedEdit || (coreIdentityLocked && !adjustAgentMode),
  )
  const enterprisePhoneLocked = Boolean(
    subjectType === "ENTERPRISE" && coreIdentityLocked && !adjustAgentMode,
  )
  const enterpriseLicenseOcrDisabled =
    subjectType !== "ENTERPRISE" || subjectNameReadOnly

  const runEnterpriseLicenseOcr = () => {
    if (enterpriseLicenseOcrDisabled) return
    setToastMessage(PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_RECOGNIZING)
    window.setTimeout(() => {
      const demo = demoPartnerEnterpriseLicenseOcr(archiveMenuLabel)
      markDirty()
      setName(demo.enterpriseName)
      setIdNumber(demo.unifiedSocialCreditCode)
      setErrors((prev) => ({ ...prev, name: "", idNumber: "" }))
      setToastMessage(PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_SUCCESS)
      window.setTimeout(() => setToastMessage(null), 2800)
    }, 500)
  }

  useEffect(() => {
    if (!dirty) {
      return
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [dirty])

  const hasPhoneDiff = useMemo(() => {
    if (!existing || isPendingCompletion) return false
    return existing.contactPhone.trim() !== contactPhone.trim()
  }, [existing, isPendingCompletion, contactPhone])

  const hasAgentDiff = useMemo(() => {
    if (!existing || subjectType !== "ENTERPRISE") {
      return false
    }
    return (existing.agentName ?? "").trim() !== agentName.trim()
  }, [existing, subjectType, agentName])

  const touchesOwnerDomainForP02 = useMemo(() => {
    if (archiveMenuLabel === "货主信息") {
      if (existing) {
        return existing.roles.some(
          (role) => role.roleType === "OWNER" && role.roleStatus !== "INVALID",
        )
      }
      return true
    }
    return selectedAppendMenus.includes("货主信息")
  }, [existing, archiveMenuLabel, selectedAppendMenus])

  if (isEdit && !existing) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="outline" onClick={() => navigate(listPath)}>
          <ArrowLeftIcon />
          返回
        </Button>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的合作方档案
        </div>
      </div>
    )
  }

  if (isEdit && existing?.status === "FROZEN") {
    return (
      <div className="space-y-4 p-6">
        <Button variant="outline" onClick={() => navigate(`${listPath}/详情/${existing.id}`)}>
          <ArrowLeftIcon />
          返回详情
        </Button>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-950">
          该主体已冻结，暂不支持编辑或补全资料。请先解冻后再维护档案。
        </div>
      </div>
    )
  }

  const pageTitle = partnerFormPageTitle(
    isEdit,
    menuShortLabel,
    existing?.name,
    isPendingCompletion,
  )

  const markDirty = () => setDirty(true)

  const toggleAppendMenu = (menu: PartnerArchiveMenuLabel) => {
    markDirty()
    setSelectedAppendMenus((current) =>
      current.includes(menu) ? current.filter((item) => item !== menu) : [...current, menu],
    )
  }

  const handleNavigateAway = () => {
    if (dirty && !window.confirm("当前有未保存的修改，确认离开吗？")) {
      return
    }
    navigate(listPath)
  }

  /** 仅货主信息 + 基础配置 P01 开启时保存必录证件地址 */
  const addressRequired = isCertAddressSaveRequired(archiveMenuLabel, subjectType)
  const showEnterpriseAgentIdField = showEnterpriseAgentIdNumberField(subjectType)
  const pickupEnterpriseAgentIdRequired = isPickupEnterpriseAgentIdRequired(
    menuForValidation,
    subjectType,
  )
  const pickupEnterpriseAgentNameRequired = isPickupEnterpriseAgentNameRequired(
    menuForValidation,
    subjectType,
  )
  const ownerEnterpriseAgentOptional =
    menuForValidation === "货主信息" && subjectType === "ENTERPRISE"

  const buildCertAddress = () => {
    const detail = detailAddress.trim()
    if (!addressRequired && !detail) {
      return {
        province: "",
        city: "",
        district: "",
        detail: "",
        fullAddress: "",
      }
    }
    return {
      province,
      city,
      district,
      detail,
      fullAddress: `${province}${city}${district}${detail}`,
    }
  }

  const submitButtonLabel = isPendingCompletion
    ? "补全并生效"
    : isEdit
      ? "保存修改"
      : "保存并提交"

  const buildFormSnapshot = () => {
    const cert = buildCertAddress()
    return {
      archiveMenu: archiveMenuLabel,
      subjectType,
      name: name.trim(),
      idNumber: idNumber.trim(),
      contactPhone: contactPhone.trim(),
      agentName: agentName.trim(),
      agentIdNumber: agentIdNumber.trim(),
      certAddressFull: cert.fullAddress,
    }
  }

  const commitNewPartnerRecord = (options?: { verifiedOnCreate?: boolean }) => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const today = now.substring(0, 10)
    const newId = `p-${Date.now()}`
    const trimmedId = idNumber.trim()
    const implicitRole = implicitRoleForArchiveMenu(archiveMenuLabel)
    const partnerNo = `PA-${Date.now()}`

    const draft: PartnerSubject = {
      id: newId,
      archiveMenu: archiveMenuLabel,
      partnerNo,
      name: name.trim(),
      subjectType,
      idNumber: trimmedId,
      idNumberMasked: maskIdNumber(trimmedId),
      certAddress: buildCertAddress(),
      contactPhone: contactPhone.trim(),
      contactPhoneVerified: options?.verifiedOnCreate ? "VERIFIED" : "UNVERIFIED",
      contactPhoneVerifiedAt: options?.verifiedOnCreate ? now : undefined,
      agentName: subjectType === "ENTERPRISE" ? agentName.trim() : undefined,
      agentIdNumber:
        showEnterpriseAgentIdField ? agentIdNumber.trim() || undefined : undefined,
      status: "NORMAL",
      roles: [
        {
          roleType: implicitRole,
          roleStatus: "NORMAL" as const,
          sourceDocType: "人工建档",
          sourceDocNo: "——",
          roleEffectiveTime: now,
        },
      ],
      linkedPartnerArchives: [],
      source: "MANUAL",
      createDate: today,
      createTime: now,
      createdBy: "当前用户",
      updateTime: now,
      associatedDocs: [],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          opTime: now,
          operator: "当前用户",
          actionType: "CREATE",
          actionName: "创建合作方档案",
          detail: options?.verifiedOnCreate
            ? "管理端人工创建：联系手机已验证并完成短信核验"
            : "管理端人工创建：联系手机未验证",
        },
      ],
    }
    let created = normalizePartnerPlanB(draft)
    if (selectedAppendMenus.length > 0) {
      created = appendLinkedPartnerMenus(
        created,
        selectedAppendMenus,
        "新增页一并保存追加合作方档案",
      )
    }
    partnerArchivesMock.unshift(created)
    return created
  }

  const queueCreateSave = (options?: { verifiedOnCreate?: boolean }) => {
    if (isEdit) {
      doSave(options)
      return
    }
    if (selectedAppendMenus.length === 0) {
      doSave(options)
      return
    }

    const { plan, failures } = buildCompositeAppendPlan(
      partnerArchivesMock,
      buildFormSnapshot(),
      selectedAppendMenus,
    )
    if (failures.length > 0) {
      setCompositePlan(plan)
      setCompositeFailures(failures)
      setCompositeDialogMode("failure")
      setCompositeDialogOpen(true)
      setIsSubmitting(false)
      return
    }
    setCompositePlan(plan)
    setPendingSaveOptions(options)
    setCompositeDialogMode("confirm")
    setCompositeDialogOpen(true)
    setIsSubmitting(false)
  }

  const handleCompositeSaveConfirm = () => {
    setCompositeDialogOpen(false)
    setIsSubmitting(true)
    const options = pendingSaveOptions
    const created = commitNewPartnerRecord(options)
    const verifyLabel = options?.verifiedOnCreate
      ? "联系手机已验证"
      : "联系手机未验证"
    const lines: CompositeSaveResultLine[] = [
      {
        scopeLabel: `【${archiveMenuLabel}（本页）】`,
        outcome: "CREATED",
        detail: `${created.name} · ${verifyLabel}`,
      },
      ...compositePlan.map((item) => ({
        scopeLabel: `【${item.targetMenu}（追加）】`,
        outcome: item.action === "CREATE_NEW" ? ("CREATED" as const) : ("LINKED" as const),
      })),
    ]
    setLastCreatedPartnerId(created.id)
    setLastSaveVerified(Boolean(options?.verifiedOnCreate))
    setCompositeSuccessLines(lines)
    setCompositeDialogMode("success")
    setCompositeDialogOpen(true)
    setDirty(false)
    setIsSubmitting(false)
  }

  const doSave = (options?: { verifiedOnCreate?: boolean }) => {
    const phoneChanged = Boolean(isEdit && hasPhoneDiff)
    const wasVerifiedBeforeEdit = Boolean(
      existing && resolveContactPhoneVerified(existing) === "VERIFIED",
    )
    const oldPhoneVal = existing?.contactPhone
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)

    if (!existing) {
      const duplicate = findPartnerByIdNumber(
        partnerArchivesMock,
        idNumber,
        undefined,
        archiveMenuLabel,
      )
      if (duplicate) {
        setAccessWarning("该主体在本菜单已存在，请前往详情追加合作方档案角色")
        setIsSubmitting(false)
        return
      }
      commitNewPartnerRecord(options)
    } else if (existing) {
      const wasPending = isArchiveRequiredFieldsPending(existing)
      const certAddressBeforeSave = { ...existing.certAddress }
      const certAddressAfterSave = buildCertAddress()

      if (canEditSubjectName) {
        existing.name = name.trim()
      }
      if (canEditSubjectId) {
        const trimmedId = idNumber.trim()
        existing.idNumber = trimmedId
        existing.idNumberMasked = maskIdNumber(trimmedId)
      }
      if (!isFrozenLimitedEdit) {
        existing.contactPhone = contactPhone.trim()
      }
      if (!isFrozenLimitedEdit && subjectType === "ENTERPRISE") {
        existing.agentName = agentName.trim()
        if (showEnterpriseAgentIdField) {
          const trimmedAgentId = agentIdNumber.trim()
          existing.agentIdNumber = trimmedAgentId || undefined
        }
      }
      if (
        wasVerifiedBeforeEdit &&
        (phoneChanged || (adjustAgentMode && hasAgentDiff))
      ) {
        markContactPhoneVerified(existing)
      } else if (phoneChanged && !wasVerifiedBeforeEdit) {
        existing.contactPhoneVerified = "UNVERIFIED"
        existing.contactPhoneVerifiedAt = undefined
      }
      existing.certAddress = certAddressAfterSave

      const afterSave: PartnerSubject = {
        ...existing,
        certAddress: certAddressAfterSave,
      }
      if (wasPending && !isArchiveRequiredFieldsPending(afterSave)) {
        existing.roles = existing.roles.map((r) =>
          r.roleStatus === "PENDING_COMPLETION"
            ? { ...r, roleStatus: "NORMAL" as const }
            : r,
        )
      }
      Object.assign(existing, normalizePartnerPlanB(existing))

      const changeParts: string[] = []
      if (phoneChanged) {
        changeParts.push(
          wasVerifiedBeforeEdit
            ? `变更业务联系电话为【${contactPhone.trim()}】（原：${oldPhoneVal}，短信二元核验通过）`
            : `变更业务联系电话为【${contactPhone.trim()}】（原：${oldPhoneVal}）`,
        )
      }
      changeParts.push(
        ...buildPartnerAddressAuditClauses({
          archiveMenu: archiveMenuLabel,
          subjectType,
          certBefore: certAddressBeforeSave,
          certAfter: certAddressAfterSave,
          wasPendingCompletion: wasPending,
        }),
      )

      const changeBody =
        changeParts.length > 0 ? changeParts.join("；") : "更新基础资料"

      existing.auditLogs = [
        {
          id: `log-${Date.now()}`,
          opTime: now,
          operator: "当前用户",
          actionType: "EDIT",
          actionName: "修改合作方档案",
          detail: `修改合作方档案：${changeBody}`,
        },
        ...existing.auditLogs,
      ]
    }

    setDirty(false)
    setIsSubmitting(false)
    setToastMessage(
      isEdit
        ? phoneChanged && wasVerifiedBeforeEdit
          ? "短信身份核验通过，联系手机修改成功"
          : phoneChanged
            ? "联系手机修改成功"
            : isPendingCompletion
              ? "资料补全成功，主档已完备"
              : "保存成功"
        : options?.verifiedOnCreate
          ? "合作方建档成功（联系手机已验证）"
          : "合作方建档成功（联系手机未验证）"
    )
    window.setTimeout(() => navigate(listPath), 800)
  }

  const validateForm = (): boolean => {
    setAccessWarning(null)
    const certFull = `${province}${city}${district}${detailAddress.trim()}`
    const newErrors = validateArchiveMenuRequiredFields({
      archiveMenu: menuForValidation,
      subjectType,
      name,
      idNumber,
      contactPhone,
      agentName: pickupEnterpriseAgentNameRequired ? agentName : undefined,
      agentIdNumber: showEnterpriseAgentIdField ? agentIdNumber : undefined,
      certAddressFull: certFull,
    })

    const nameMax = subjectType === "ENTERPRISE" ? 100 : 30
    if (name.trim() && name.trim().length > nameMax) {
      newErrors.name =
        subjectType === "ENTERPRISE" ? "企业全称不超过 100 字" : "姓名不超过 30 字"
    }
    if (idNumber.trim() && idNumber.trim().length !== 18) {
      newErrors.idNumber = "证件号码长度必须为18位字符"
    }
    if (pickupEnterpriseAgentNameRequired && agentName.trim().length > 30) {
      newErrors.agentName = "经办人姓名不超过 30 字"
    }
    if (
      contactPhone.trim() &&
      !newErrors.contactPhone &&
      !/^1[3-9]\d{9}$/.test(contactPhone.trim()) &&
      (archiveMenuLabel === "货主信息" || archiveMenuLabel === "提货人信息")
    ) {
      newErrors.contactPhone = "请输入11位大陆标准有效手机号码（用于接收短信验证码）"
    }

    const detailTrimmed = detailAddress.trim()
    const addressTouched = Boolean(detailTrimmed)
    if (addressRequired || addressTouched) {
      if (!province.trim() || !city.trim() || !district.trim()) {
        newErrors.district = "请选择完整的省/市/区"
      }
      if (addressRequired && !detailTrimmed) {
        newErrors.detailAddress = "请补全证件登记地址"
      } else if (detailTrimmed && `${province}${city}${district}${detailTrimmed}`.length > 200) {
        newErrors.detailAddress = "证件地址不超过 200 字"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    if (!isEdit) {
      const duplicate = findPartnerByIdNumber(
        partnerArchivesMock,
        idNumber,
        undefined,
        archiveMenuLabel,
      )
      if (duplicate) {
        setAccessWarning("该主体在本菜单已存在，请前往详情追加合作方档案角色")
        return false
      }
    }

    if (
      touchesOwnerDomainForP02 &&
      detailTrimmed &&
      findOwnerAddressConflict(
        partnerArchivesMock,
        `${province}${city}${district}${detailTrimmed}`,
        subjectType,
        existing?.id,
      )
    ) {
      setAccessWarning(ownerAddressConflictMessage(subjectType))
      return false
    }

    if (!isEdit && selectedAppendMenus.length > 0) {
      const { failures } = buildCompositeAppendPlan(
        partnerArchivesMock,
        {
          archiveMenu: archiveMenuLabel,
          subjectType,
          name: name.trim(),
          idNumber: idNumber.trim(),
          contactPhone: contactPhone.trim(),
          agentName: agentName.trim(),
          agentIdNumber: agentIdNumber.trim(),
          certAddressFull: `${province}${city}${district}${detailTrimmed}`,
        },
        selectedAppendMenus,
      )
      if (failures.length > 0) {
        setCompositeFailures(failures)
        setCompositePlan([])
        setCompositeDialogMode("failure")
        setCompositeDialogOpen(true)
        return false
      }
    }

    return true
  }

  const proceedAfterValidation = (intent: "SAVE" | "SAVE_AND_VERIFY") => {
    setIsSubmitting(true)

    const needsPhoneVerify = requiresPartnerEditPhoneSmsVerify({
      isEdit,
      existing,
      hasPhoneDiff,
      hasAgentDiff,
      subjectType,
      adjustAgentMode,
    })

    if (needsPhoneVerify) {
      setVerifyDialogMode("CHANGE_PHONE")
      setVerifyDialogOpen(true)
      setIsSubmitting(false)
      return
    }

    if (!isEdit && intent === "SAVE_AND_VERIFY") {
      setVerifyDialogMode("VERIFY_CONTACT")
      setVerifyDialogOpen(true)
      setIsSubmitting(false)
      return
    }

    queueCreateSave()
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm()) {
      return
    }
    proceedAfterValidation("SAVE")
  }

  const handleSaveAndVerify = () => {
    if (!validateForm()) {
      return
    }
    proceedAfterValidation("SAVE_AND_VERIFY")
  }

  const handleVerifyOpenChange = (open: boolean) => {
    setVerifyDialogOpen(open)
    if (!open) {
      setIsSubmitting(false)
    }
  }

  return (
    <PrototypeAnnotationProvider
      title={`${pageTitle} · 原型批注`}
      annotations={partnerArchiveFormAnnotations}
      documents={archiveDocuments}
    >
      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <PrototypeAnnotationTarget annotationIds={["partner-archive-form-header"]}>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
              {isEdit && existing && (
                <Badge
                  variant="outline"
                  className={SUBJECT_STATUS_BADGE_CLASS[existing.status]}
                >
                  {SUBJECT_STATUS_LABELS[existing.status]}
                </Badge>
              )}
              {isPendingCompletion && (
                <Badge variant="outline" className="border-sky-300 bg-sky-50 text-sky-700">
                  待补全
                </Badge>
              )}
              {isEdit && existing && (
                <Badge
                  variant="outline"
                  className={
                    CONTACT_PHONE_VERIFY_BADGE_CLASS[
                      resolveContactPhoneVerified(existing)
                    ]
                  }
                >
                  {
                    CONTACT_PHONE_VERIFY_LABELS[
                      resolveContactPhoneVerified(existing)
                    ]
                  }
                </Badge>
              )}
            </div>
          </PrototypeAnnotationTarget>
          <PrototypeAnnotationTarget annotationIds={["partner-archive-form-actions"]}>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handleNavigateAway}>
                <ArrowLeftIcon />
                取消
              </Button>
              <Button type="submit" form="partner-archive-form" disabled={isSubmitting}>
                {isSubmitting ? "提交中…" : submitButtonLabel}
              </Button>
              {!isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={handleSaveAndVerify}
                >
                  {isSubmitting ? "处理中…" : "保存并验证"}
                </Button>
              )}
            </div>
          </PrototypeAnnotationTarget>
        </div>

        {isFrozenLimitedEdit && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            主体处于冻结状态：名称与身份标识不可修改；可以维护联系电话。证件地址仅限纠偏，须通过准入校验。
          </div>
        )}

        {isPendingCompletion && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">该合作方档案处于「待补全」状态</p>
              <p className="text-xs leading-relaxed text-amber-800">
                {partnerPendingCompletionUserBanner(archiveMenuLabel)}
              </p>
              <PrototypeSpecCallout className="mt-2">
                {PARTNER_PENDING_COMPLETION_SPEC_NOTE}
              </PrototypeSpecCallout>
            </div>
          </div>
        )}

        {accessWarning && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {accessWarning}
          </div>
        )}

        <form id="partner-archive-form" onSubmit={handleSubmit} className="space-y-4">
          <PrototypeAnnotationTarget annotationIds={["partner-archive-form-base"]}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>基础档案资料</CardTitle>
                  {isPendingCompletion && (
                    <span className="text-xs text-muted-foreground">
                      已由单据沉淀固化，仅供核对不可更改
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* 字段 1：主体类型 */}
                    <div className="space-y-2">
                      <Label>
                        <span className="mr-1 font-bold text-destructive">*</span>
                        主体类型
                      </Label>
                      <Select
                        value={subjectTypeLabel}
                        disabled={isEdit || isEnterpriseOnlyArchiveMenu(archiveMenuLabel)}
                        onValueChange={(next) => {
                          if (!next) return
                          markDirty()
                          setSubjectTypeLabel(next)
                        }}
                      >
                        <SelectTrigger
                          data-partner-form-locked={subjectTypeLocked ? "true" : undefined}
                          className={cn(
                            "w-full",
                            subjectTypeLocked && PARTNER_FORM_LOCKED_FIELD_PC,
                          )}
                        >
                          <SelectValue placeholder="请选择主体类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {PARTNER_FORM_SUBJECT_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 字段 2：主体名称 */}
                    <div className="space-y-2">
                      <Label htmlFor="partner-name">
                        <span className="mr-1 font-bold text-destructive">*</span>
                        主体名称
                      </Label>
                      <div className="flex gap-1.5">
                        <Input
                          id="partner-name"
                          data-partner-form-locked={
                            subjectNameReadOnly ? "true" : undefined
                          }
                          className={cn(
                            "min-w-0 flex-1",
                            subjectNameReadOnly && PARTNER_FORM_LOCKED_FIELD_PC,
                          )}
                          value={name}
                          maxLength={subjectType === "ENTERPRISE" ? 100 : 30}
                          readOnly={subjectNameReadOnly}
                          disabled={subjectNameReadOnly}
                          placeholder={
                            subjectType === "INDIVIDUAL"
                              ? "请输入居民身份证姓名"
                              : "请输入营业执照标准全称"
                          }
                          onChange={(event) => {
                            markDirty()
                            setName(event.target.value)
                            setErrors((prev) => ({ ...prev, name: "" }))
                          }}
                        />
                        {subjectType === "ENTERPRISE" ? (
                          <PartnerEnterpriseLicenseOcrButton
                            disabled={enterpriseLicenseOcrDisabled}
                            onClick={runEnterpriseLicenseOcr}
                          />
                        ) : null}
                      </div>
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    {subjectType === "ENTERPRISE" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label htmlFor="partner-agent">
                            {pickupEnterpriseAgentNameRequired && (
                              <span className="mr-1 font-bold text-destructive">*</span>
                            )}
                            经办人姓名
                          </Label>
                          {coreIdentityLocked && !adjustAgentMode && (
                            <Button
                              type="button"
                              variant="link"
                              className="h-auto px-0 text-xs"
                              onClick={() => {
                                setAdjustAgentMode(true)
                                markDirty()
                              }}
                            >
                              调整经办人信息
                            </Button>
                          )}
                        </div>
                        <Input
                          id="partner-agent"
                          data-partner-form-locked={agentNameLocked ? "true" : undefined}
                          value={agentName}
                          maxLength={30}
                          readOnly={agentNameLocked}
                          disabled={agentNameLocked}
                          className={cn(agentNameLocked && PARTNER_FORM_LOCKED_FIELD_PC)}
                          placeholder="请输入企业业务对接人姓名"
                          onChange={(event) => {
                            markDirty()
                            setAgentName(event.target.value)
                            setErrors((prev) => ({ ...prev, agentName: "" }))
                          }}
                        />
                        {errors.agentName && (
                          <p className="text-xs text-destructive">{errors.agentName}</p>
                        )}
                        {ownerEnterpriseAgentOptional ? (
                          <ProductFieldHint>
                            {PARTNER_OWNER_ENTERPRISE_AGENT_USER_HINT}
                          </ProductFieldHint>
                        ) : null}
                      </div>
                    )}

                    {showEnterpriseAgentIdField && (
                      <div className="space-y-2">
                        <Label htmlFor="partner-agent-id">
                          {pickupEnterpriseAgentIdRequired && (
                            <span className="mr-1 font-bold text-destructive">*</span>
                          )}
                          经办人身份证号
                        </Label>
                        <Input
                          id="partner-agent-id"
                          data-partner-form-locked={
                            isFrozenLimitedEdit ? "true" : undefined
                          }
                          value={agentIdNumber}
                          maxLength={18}
                          readOnly={isFrozenLimitedEdit}
                          disabled={isFrozenLimitedEdit}
                          className={cn(
                            isFrozenLimitedEdit && PARTNER_FORM_LOCKED_FIELD_PC,
                          )}
                          placeholder="请输入18位经办人居民身份证号"
                          onChange={(event) => {
                            markDirty()
                            setAgentIdNumber(event.target.value)
                            setErrors((prev) => ({ ...prev, agentIdNumber: "" }))
                          }}
                        />
                        {errors.agentIdNumber && (
                          <p className="text-xs text-destructive">{errors.agentIdNumber}</p>
                        )}
                        <ProductFieldHint>
                          {partnerEnterpriseAgentIdUserHint(menuForValidation)}
                        </ProductFieldHint>
                        <PrototypeSpecCallout>
                          {partnerEnterpriseAgentIdSpecNote(menuForValidation)}
                        </PrototypeSpecCallout>
                      </div>
                    )}

                    {/* 手机号（个人） / 联系电话（企业经办人手机） */}
                    <div className="space-y-2">
                      <Label htmlFor="partner-phone">
                        {(archiveMenuLabel === "货主信息" ||
                          archiveMenuLabel === "提货人信息") && (
                          <span className="mr-1 font-bold text-destructive">*</span>
                        )}
                        {subjectType === "INDIVIDUAL" ? "手机号" : "联系电话（经办人手机）"}
                      </Label>
                      <Input
                        id="partner-phone"
                        data-partner-form-locked={
                          enterprisePhoneLocked ? "true" : undefined
                        }
                        value={contactPhone}
                        maxLength={11}
                        readOnly={enterprisePhoneLocked}
                        disabled={enterprisePhoneLocked}
                        className={cn(
                          enterprisePhoneLocked && PARTNER_FORM_LOCKED_FIELD_PC,
                        )}
                        placeholder={
                          subjectType === "INDIVIDUAL"
                            ? "请输入11位手机号码"
                            : "请输入11位经办人手机号码（用于接收验证码）"
                        }
                        onChange={(event) => {
                          markDirty()
                          setContactPhone(event.target.value)
                          setErrors((prev) => ({ ...prev, contactPhone: "" }))
                        }}
                      />
                      {errors.contactPhone && (
                        <p className="text-xs text-destructive">{errors.contactPhone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="partner-idNumber">
                        <span className="mr-1 font-bold text-destructive">*</span>
                        {subjectType === "INDIVIDUAL" ? "身份标识" : "统一社会信用代码"}
                      </Label>
                      <Input
                        id="partner-idNumber"
                        data-partner-form-locked={
                          subjectIdReadOnly ? "true" : undefined
                        }
                        value={idNumber}
                        readOnly={subjectIdReadOnly}
                        disabled={subjectIdReadOnly}
                        className={cn(
                          subjectIdReadOnly && PARTNER_FORM_LOCKED_FIELD_PC,
                        )}
                        placeholder={
                          subjectType === "INDIVIDUAL"
                            ? "请输入18位居民身份证号"
                            : "请输入18位统一社会信用代码"
                        }
                        onChange={(event) => {
                          markDirty()
                          setIdNumber(event.target.value)
                          setErrors((prev) => ({ ...prev, idNumber: "" }))
                        }}
                      />
                      {errors.idNumber && (
                        <p className="text-xs text-destructive">{errors.idNumber}</p>
                      )}
                    </div>
                  </div>
              </CardContent>
            </Card>
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["partner-archive-form-address"]}>
            <Card>
              <CardHeader>
                <CardTitle>证件登记地址</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {archiveMenuLabel === "货主信息" ? (
                  <ProductFieldHint>
                    {partnerFormAddressUserHint(subjectType, addressRequired)}
                  </ProductFieldHint>
                ) : null}
                <PrototypeSpecCallout>
                  {archiveMenuLabel === "货主信息"
                    ? PARTNER_FORM_ADDRESS_SPEC_NOTE_OWNER
                    : PARTNER_FORM_ADDRESS_SPEC_NOTE_OTHER}
                </PrototypeSpecCallout>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="sr-only">省</Label>
                    <Select
                      value={province}
                      onValueChange={(val) => {
                        if (!val) return
                        markDirty()
                        setProvince(val)
                        setErrors((prev) => ({ ...prev, district: "" }))
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择省份" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="江苏省">江苏省</SelectItem>
                        <SelectItem value="浙江省">浙江省</SelectItem>
                        <SelectItem value="上海市">上海市</SelectItem>
                        <SelectItem value="安徽省">安徽省</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="sr-only">市</Label>
                    <Select
                      value={city}
                      onValueChange={(val) => {
                        if (!val) return
                        markDirty()
                        setCity(val)
                        setErrors((prev) => ({ ...prev, district: "" }))
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择城市" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="南京市">南京市</SelectItem>
                        <SelectItem value="无锡市">无锡市</SelectItem>
                        <SelectItem value="苏州市">苏州市</SelectItem>
                        <SelectItem value="杭州市">杭州市</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="sr-only">区</Label>
                    <Select
                      value={district}
                      onValueChange={(val) => {
                        if (!val) return
                        markDirty()
                        setDistrict(val)
                        setErrors((prev) => ({ ...prev, district: "" }))
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择区县" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="鼓楼区">鼓楼区</SelectItem>
                        <SelectItem value="玄武区">玄武区</SelectItem>
                        <SelectItem value="新吴区">新吴区</SelectItem>
                        <SelectItem value="工业园区">工业园区</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {errors.district && (
                  <p className="text-xs text-destructive">{errors.district}</p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="partner-detailAddress" className="sr-only">
                    证件地址详细
                  </Label>
                  <Input
                    id="partner-detailAddress"
                    value={detailAddress}
                    maxLength={200}
                    placeholder="请输入街道、门牌号等详细地址（整段地址不超过 200 字）"
                    onChange={(event) => {
                      markDirty()
                      setDetailAddress(event.target.value)
                      setErrors((prev) => ({ ...prev, detailAddress: "" }))
                    }}
                  />
                  {errors.detailAddress && (
                    <p className="text-xs text-destructive">{errors.detailAddress}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </PrototypeAnnotationTarget>

          {!isEdit && (
            <PrototypeAnnotationTarget annotationIds={["partner-archive-form-roles"]}>
              <Card>
                <CardHeader>
                  <CardTitle>{PARTNER_FORM_INITIAL_ROLES_SECTION_TITLE}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ProductFieldHint>{PARTNER_FORM_INITIAL_ROLES_USER_HINT}</ProductFieldHint>
                  <PrototypeSpecCallout>{PARTNER_FORM_INITIAL_ROLES_SPEC_NOTE}</PrototypeSpecCallout>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {appendMenuOptions.map((menu) => {
                      const isSelected = selectedAppendMenus.includes(menu)
                      return (
                        <Button
                          key={menu}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={cn(!isSelected && "bg-background")}
                          onClick={() => toggleAppendMenu(menu)}
                        >
                          {menu}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </PrototypeAnnotationTarget>
          )}
        </form>

        <PartnerVerifyDialog
          open={verifyDialogOpen}
          mode={verifyDialogMode}
          verifyContext={
            verifyDialogMode === "VERIFY_CONTACT" ? "CREATE_ARCHIVE" : undefined
          }
          agentName={subjectType === "ENTERPRISE" ? agentName.trim() : undefined}
          oldPhone={
            verifyDialogMode === "CHANGE_PHONE" && isEdit
              ? existing?.contactPhone
              : undefined
          }
          subjectType={subjectType}
          name={name.trim()}
          idNumber={idNumber.trim()}
          contactPhone={contactPhone.trim()}
          fullAddress={`${province}${city}${district}${detailAddress.trim()}`}
          roles={[implicitRoleForArchiveMenu(archiveMenuLabel)]}
          onOpenChange={handleVerifyOpenChange}
          onConfirm={() => {
            setVerifyDialogOpen(false)
            setIsSubmitting(true)
            queueCreateSave(
              verifyDialogMode === "VERIFY_CONTACT" ? { verifiedOnCreate: true } : undefined,
            )
          }}
        />

        <PartnerCompositeSaveDialog
          open={compositeDialogOpen}
          mode={compositeDialogMode}
          currentMenu={archiveMenuLabel}
          plan={compositePlan}
          appendMenus={selectedAppendMenus}
          failures={compositeFailures}
          successLines={compositeSuccessLines}
          verifiedOnCreate={lastSaveVerified}
          onOpenChange={setCompositeDialogOpen}
          onConfirmComposite={handleCompositeSaveConfirm}
          onBackToList={() => {
            setCompositeDialogOpen(false)
            navigate(listPath)
          }}
          onViewDetail={() => {
            setCompositeDialogOpen(false)
            if (lastCreatedPartnerId) {
              navigate(`${listPath}/详情/${lastCreatedPartnerId}`)
            } else {
              navigate(listPath)
            }
          }}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
