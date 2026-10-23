import { useEffect, useMemo, useState } from "react"
import { UserRound } from "lucide-react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { H5_PAGE_BODY } from "@/shared/h5-ui-theme"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"
import { PartnerEnterpriseLicenseOcrButton } from "../components/PartnerEnterpriseLicenseOcrButton"
import {
  demoPartnerEnterpriseLicenseOcr,
  PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_RECOGNIZING,
  PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_SUCCESS,
} from "@prototype/shared/partner-archives/partner-enterprise-license-ocr.demo"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"
import { MobileDownSelectSheet } from "@/features/inbound-records/components/MobileDownSelectSheet"
import {
  PARTNER_FORM_SUBJECT_TYPE_OPTIONS,
} from "@prototype/B端PC/src/features/partner-archives/domain/constants"
import type {
  PartnerSubject,
  SubjectType,
} from "@prototype/B端PC/src/features/partner-archives/domain/types"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { getPartnerArchiveById } from "@prototype/B端PC/src/features/partner-archives/lib/detail-utils"
import { partnerArchivesMock } from "@prototype/B端PC/src/features/partner-archives/mock/partner-archives.mock"
import {
  findOwnerAddressConflict,
  findPartnerByIdNumber,
  ownerAddressConflictMessage,
  maskIdNumber,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-rules"
import {
  appendLinkedPartnerMenus,
  normalizePartnerPlanB,
  otherArchiveMenus,
} from "@prototype/B端PC/src/features/partner-archives/lib/linked-partner-archives"
import {
  appendMenusSelectableForSubjectType,
  buildCompositeAppendPlan,
  type AppendPlanItem,
  type CompositePrecheckFailure,
  type CompositeSaveResultLine,
} from "@prototype/B端PC/src/features/partner-archives/lib/composite-append-save"
import { PartnerCompositeSaveSheet } from "../components/PartnerCompositeSaveSheet"
import type { PartnerCompositeSaveSheetMode } from "../components/PartnerCompositeSaveSheet"
import {
  markContactPhoneVerified,
  requiresPartnerEditPhoneSmsVerify,
  resolveContactPhoneVerified,
} from "@prototype/B端PC/src/features/partner-archives/lib/contact-phone-verify"
import { buildPartnerAddressAuditClauses } from "@prototype/shared/partner-archives/partner-audit-log-detail"
import {
  PARTNER_FORM_ACTION_LABELS,
  PARTNER_FORM_BASE_SECTION_TITLE,
  PARTNER_FORM_ADDRESS_SPEC_NOTE_OWNER,
  PARTNER_FORM_ADDRESS_SPEC_NOTE_OTHER,
  PARTNER_FORM_INITIAL_ROLES_SECTION_TITLE,
  PARTNER_FORM_INITIAL_ROLES_SPEC_NOTE,
  PARTNER_FORM_INITIAL_ROLES_USER_HINT,
  PARTNER_PENDING_COMPLETION_SPEC_NOTE,
  partnerPendingCompletionUserBanner,
  partnerFormAddressUserHint,
  partnerContactPhoneFormLabel,
  partnerFormPageTitle,
  PARTNER_OWNER_ENTERPRISE_AGENT_USER_HINT,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { PartnerVerifySheet } from "../components/PartnerVerifySheet"
import { handleStackBack } from "@/shared/navigation/stack-back"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import {
  PARTNER_FORM_LOCKED_BUTTON_H5,
  PARTNER_FORM_LOCKED_FIELD_H5,
} from "@prototype/shared/partner-archives/partner-form-field-styles"
import {
  ARCHIVE_MENU_SHORT_LABEL,
  implicitRoleForArchiveMenu,
} from "@prototype/shared/partner-archives/partner-archive-domain"
import {
  partnerArchiveDetailRoute,
  partnerArchiveListRoute,
} from "../domain/constants"
import {
  canEditPartnerSubjectIdNumberOnForm,
  canEditPartnerSubjectNameOnForm,
  isArchiveRequiredFieldsPending,
  isCertAddressSaveRequired,
  isEnterpriseOnlyArchiveMenu,
  isPickupEnterpriseAgentNameRequired,
  partnerArchiveMenuForFormValidation,
  validateArchiveMenuRequiredFields,
} from "@prototype/B端PC/src/features/partner-archives/lib/archive-required-fields-pending"

function parseArchiveMenuFromSearch(raw: string | null): PartnerArchiveMenuLabel {
  const map: Record<string, PartnerArchiveMenuLabel> = {
    OWNER: "货主信息",
    PICKUP_PERSON: "提货人信息",
    FUNDER: "资金方信息",
    SERVICE_PROVIDER: "服务方信息",
    货主信息: "货主信息",
    提货人信息: "提货人信息",
    资金方信息: "资金方信息",
    服务方信息: "服务方信息",
  }
  if (raw && map[raw]) return map[raw]
  return "货主信息"
}

function subjectTypeFromLabel(label: string): SubjectType {
  return label === "企业" ? "ENTERPRISE" : "INDIVIDUAL"
}

export function PartnerArchiveFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get("edit")
  const archiveMenuLabel = parseArchiveMenuFromSearch(searchParams.get("archiveMenu"))
  const menuShortLabel = ARCHIVE_MENU_SHORT_LABEL[archiveMenuLabel]
  const existing = useMemo(
    () => (editId ? getPartnerArchiveById(editId) : undefined),
    [editId],
  )
  const isEdit = Boolean(existing)

  const [subjectTypeLabel, setSubjectTypeLabel] = useState(() => {
    if (existing) {
      return existing.subjectType === "ENTERPRISE" ? "企业" : "个人"
    }
    if (isEnterpriseOnlyArchiveMenu(archiveMenuLabel)) {
      return "企业"
    }
    return "个人"
  })
  const subjectType = subjectTypeFromLabel(subjectTypeLabel)
  const [typeOpen, setTypeOpen] = useState(false)

  const [name, setName] = useState(existing?.name ?? "")
  const [idNumber, setIdNumber] = useState(existing?.idNumber ?? "")
  const [contactPhone, setContactPhone] = useState(existing?.contactPhone ?? "")
  const [agentName, setAgentName] = useState(existing?.agentName ?? "")
  const [agentIdNumber, setAgentIdNumber] = useState(existing?.agentIdNumber ?? "")
  const [province, setProvince] = useState(existing?.certAddress.province || (isEdit ? "" : "江苏省"))
  const [city, setCity] = useState(existing?.certAddress.city || (isEdit ? "" : "南京市"))
  const [district, setDistrict] = useState(existing?.certAddress.district || (isEdit ? "" : "鼓楼区"))
  const [detailAddress, setDetailAddress] = useState(existing?.certAddress.detail ?? "")
  const [selectedAppendMenus, setSelectedAppendMenus] = useState<
    PartnerArchiveMenuLabel[]
  >([])
  const [dirty, setDirty] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyMode, setVerifyMode] = useState<"CHANGE_PHONE" | "VERIFY_CONTACT">(
    "VERIFY_CONTACT",
  )
  const [submitting, setSubmitting] = useState(false)
  const [compositeSheetOpen, setCompositeSheetOpen] = useState(false)
  const [compositeSheetMode, setCompositeSheetMode] =
    useState<PartnerCompositeSaveSheetMode>("confirm")
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
    isEdit && existing?.status === "FROZEN" && !isPendingCompletion,
  )

  const menuForValidation = partnerArchiveMenuForFormValidation({
    isEdit,
    routeMenu: archiveMenuLabel,
    existing,
  })

  const addressRequired = isCertAddressSaveRequired(menuForValidation, subjectType)
  const showPickupAgentIdField =
    menuForValidation === "提货人信息" && subjectType === "ENTERPRISE"
  const pickupEnterpriseAgentNameRequired = isPickupEnterpriseAgentNameRequired(
    menuForValidation,
    subjectType,
  )
  /** 货主/提货人菜单：联系电话必填；资金方/服务方仅名称+信用代码必填 */
  const contactPhoneRequired =
    menuForValidation === "货主信息" || menuForValidation === "提货人信息"
  const ownerEnterpriseAgentOptional =
    menuForValidation === "货主信息" && subjectType === "ENTERPRISE"

  const isContactPhoneVerified = Boolean(
    isEdit && existing && resolveContactPhoneVerified(existing) === "VERIFIED",
  )

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

  const coreIdentityLocked = Boolean(isEdit && isContactPhoneVerified && !isPendingCompletion)

  const hasPhoneDiff = Boolean(
    isEdit && existing && contactPhone.trim() !== existing.contactPhone,
  )

  const hasAgentDiff = Boolean(
    isEdit &&
      existing &&
      subjectType === "ENTERPRISE" &&
      agentName.trim() !== (existing.agentName ?? "").trim(),
  )

  const detailTrimmed = detailAddress.trim()
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

  const markDirty = () => setDirty(true)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const toggleAppendMenu = (menu: PartnerArchiveMenuLabel) => {
    markDirty()
    setSelectedAppendMenus((current) =>
      current.includes(menu) ? current.filter((m) => m !== menu) : [...current, menu],
    )
  }

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
      fullAddress: detail ? `${province}${city}${district}${detail}` : "",
    }
  }

  const validate = (): string | null => {
    const certFull = `${province}${city}${district}${detailTrimmed}`
    const fieldErrors = validateArchiveMenuRequiredFields({
      archiveMenu: menuForValidation,
      subjectType,
      name,
      idNumber,
      contactPhone,
      agentName: pickupEnterpriseAgentNameRequired ? agentName : undefined,
      agentIdNumber: showPickupAgentIdField ? agentIdNumber : undefined,
      certAddressFull: certFull,
    })
    const firstMsg = Object.values(fieldErrors)[0]
    if (firstMsg) return firstMsg
    if (!isEdit) {
      const duplicate = findPartnerByIdNumber(
        partnerArchivesMock,
        idNumber,
        undefined,
        archiveMenuLabel,
      )
      if (duplicate) {
        return "该主体已存在，请前往详情追加角色配置"
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
      return ownerAddressConflictMessage(subjectType)
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
        setCompositeSheetMode("failure")
        setCompositeSheetOpen(true)
        return "保存未成功，请查看说明"
      }
    }
    return null
  }

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
    const trimmedId = idNumber.trim()
    const implicitRole = implicitRoleForArchiveMenu(archiveMenuLabel)

    const draft: PartnerSubject = {
      id: `p-${Date.now()}`,
      archiveMenu: archiveMenuLabel,
      partnerNo: `PA-${Date.now()}`,
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
        showPickupAgentIdField && subjectType === "ENTERPRISE"
          ? agentIdNumber.trim()
          : undefined,
      status: "NORMAL",
      roles: [
        {
          roleType: implicitRole,
          roleStatus: "NORMAL",
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
    window.dispatchEvent(new Event("partner-archive-updated"))
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
      setCompositeSheetMode("failure")
      setCompositeSheetOpen(true)
      setSubmitting(false)
      return
    }
    setCompositePlan(plan)
    setPendingSaveOptions(options)
    setCompositeSheetMode("confirm")
    setCompositeSheetOpen(true)
    setSubmitting(false)
  }

  const handleCompositeSaveConfirm = () => {
    setCompositeSheetOpen(false)
    setSubmitting(true)
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
    setCompositeSheetMode("success")
    setCompositeSheetOpen(true)
    setDirty(false)
    setSubmitting(false)
  }

  const doSave = (options?: { verifiedOnCreate?: boolean }) => {
    const phoneChanged = Boolean(isEdit && hasPhoneDiff)
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
        setSubmitting(false)
        showToast("该主体已存在，请前往详情追加角色配置")
        return
      }
      const newPartner = commitNewPartnerRecord(options)
      setDirty(false)
      setSubmitting(false)
      showToast(
        options?.verifiedOnCreate
          ? "合作方建档成功（联系手机已验证）"
          : "合作方建档成功（联系手机未验证）",
      )
      navigate(partnerArchiveDetailRoute(archiveMenuLabel, newPartner.id))
      return
    }

    const wasVerifiedBeforeEdit =
      resolveContactPhoneVerified(existing) === "VERIFIED"
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
      if (showPickupAgentIdField) {
        existing.agentIdNumber = agentIdNumber.trim()
      }
    }
    if (wasVerifiedBeforeEdit && (phoneChanged || hasAgentDiff)) {
      markContactPhoneVerified(existing, now)
    } else if (phoneChanged && !wasVerifiedBeforeEdit) {
      existing.contactPhoneVerified = "UNVERIFIED"
      existing.contactPhoneVerifiedAt = undefined
    }
    existing.certAddress = certAddressAfterSave
    existing.updateTime = now

    const afterSave: PartnerSubject = {
      ...existing,
      certAddress: certAddressAfterSave,
    }
    if (wasPending && !isArchiveRequiredFieldsPending(afterSave)) {
      existing.roles = existing.roles.map((r) =>
        r.roleStatus === "PENDING_COMPLETION" ? { ...r, roleStatus: "NORMAL" } : r,
      )
    }

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

    existing.auditLogs = [
      {
        id: `log-${Date.now()}`,
        opTime: now,
        operator: "当前用户",
        actionType: "EDIT",
        actionName: "修改合作方档案",
        detail: `修改合作方档案：${
          changeParts.length > 0 ? changeParts.join("；") : "更新基础资料"
        }`,
      },
      ...existing.auditLogs,
    ]

    window.dispatchEvent(new Event("partner-archive-updated"))
    setDirty(false)
    setSubmitting(false)
    showToast(
      phoneChanged && wasVerifiedBeforeEdit
        ? "短信身份核验通过，联系手机修改成功"
        : phoneChanged
          ? "联系手机修改成功"
          : wasPending
            ? "资料补全成功，角色已激活为正常"
            : "保存成功",
    )
    navigate(partnerArchiveDetailRoute(existing.archiveMenu, existing.id))
  }

  const proceedAfterValidation = (intent: "SAVE" | "SAVE_AND_VERIFY") => {
    setSubmitting(true)
    setWarning(null)

    const needsPhoneVerify = requiresPartnerEditPhoneSmsVerify({
      isEdit,
      existing,
      hasPhoneDiff,
      hasAgentDiff,
      subjectType,
    })

    if (needsPhoneVerify) {
      setVerifyMode("CHANGE_PHONE")
      setVerifyOpen(true)
      setSubmitting(false)
      return
    }

    if (!isEdit && intent === "SAVE_AND_VERIFY") {
      setVerifyMode("VERIFY_CONTACT")
      setVerifyOpen(true)
      setSubmitting(false)
      return
    }

    queueCreateSave()
  }

  const handleSubmit = () => {
    const err = validate()
    if (err) {
      setWarning(err)
      showToast(err)
      return
    }
    proceedAfterValidation("SAVE")
  }

  const handleSaveAndVerify = () => {
    const err = validate()
    if (err) {
      setWarning(err)
      showToast(err)
      return
    }
    proceedAfterValidation("SAVE_AND_VERIFY")
  }

  const submitLabel = isPendingCompletion
    ? PARTNER_FORM_ACTION_LABELS.saveComplete
    : isEdit
      ? PARTNER_FORM_ACTION_LABELS.saveEdit
      : PARTNER_FORM_ACTION_LABELS.saveSubmit

  const formBackFallback = editId
    ? partnerArchiveDetailRoute(existing?.archiveMenu ?? archiveMenuLabel, editId)
    : partnerArchiveListRoute(archiveMenuLabel)

  const leaveToPrevious = () => {
    handleStackBack(navigate, location, formBackFallback)
  }

  const handleBack = () => {
    if (dirty) {
      setLeaveOpen(true)
      return
    }
    leaveToPrevious()
  }

  const title = partnerFormPageTitle(
    isEdit,
    menuShortLabel,
    existing?.name,
    isPendingCompletion,
  )

  const subjectNameReadOnly = !canEditSubjectName
  const subjectIdReadOnly = !canEditSubjectId
  const subjectTypeLocked = Boolean(
    isEdit || isEnterpriseOnlyArchiveMenu(archiveMenuLabel),
  )
  const agentNameLocked = Boolean(isFrozenLimitedEdit || coreIdentityLocked)
  const enterprisePhoneLocked = Boolean(
    subjectType === "ENTERPRISE" && coreIdentityLocked,
  )
  /** 冻结态仍可改电话；仅已验证企业经办人手机锁定 */
  const contactPhoneLocked = enterprisePhoneLocked

  const h5FieldInputClass = (
    locked: boolean,
    widthClass = "min-w-0 flex-1",
  ) =>
    locked
      ? `text-right text-sm outline-none ${PARTNER_FORM_LOCKED_FIELD_H5}`
      : `${widthClass} bg-transparent text-right text-sm text-[#232D39] outline-none`

  const enterpriseLicenseOcrDisabled =
    subjectType !== "ENTERPRISE" || subjectNameReadOnly

  const runEnterpriseLicenseOcr = () => {
    if (enterpriseLicenseOcrDisabled) return
    showToast(PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_RECOGNIZING)
    window.setTimeout(() => {
      const demo = demoPartnerEnterpriseLicenseOcr(archiveMenuLabel)
      markDirty()
      setName(demo.enterpriseName)
      setIdNumber(demo.unifiedSocialCreditCode)
      showToast(PARTNER_ENTERPRISE_LICENSE_OCR_TOAST_SUCCESS)
    }, 500)
  }

  if (isEdit && existing?.status === "FROZEN") {
    return (
      <MobileShell>
        <NavBar
          title="无法编辑"
          onBack={() =>
            navigate(partnerArchiveDetailRoute(existing.archiveMenu, existing.id))
          }
        />
        <div className={`${H5_PAGE_BODY} px-4 py-10 text-center text-sm leading-relaxed text-amber-950`}>
          该主体已冻结，暂不支持编辑或补全资料。请先解冻后再维护档案。
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <div className={`${H5_PAGE_BODY} bg-gradient-to-b from-blue-50/80 to-[#F2F3F7]`}>
        <PrototypeAnnotationTarget annotationIds={["partner-archive-form-header"]}>
          <NavBar title={title} onBack={handleBack} />
        </PrototypeAnnotationTarget>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-28 pt-2">
          {warning ? (
            <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {warning}
            </div>
          ) : null}

          {isFrozenLimitedEdit ? (
            <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
              主体处于冻结状态：名称与身份标识不可修改；可以维护联系电话。证件地址仅限纠偏，须通过准入校验。
            </div>
          ) : null}

          {isPendingCompletion ? (
            <div className="mb-3 space-y-2">
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
                {partnerPendingCompletionUserBanner(archiveMenuLabel)}
              </div>
              <PrototypeSpecCallout>{PARTNER_PENDING_COMPLETION_SPEC_NOTE}</PrototypeSpecCallout>
            </div>
          ) : null}

          <PrototypeAnnotationTarget annotationIds={["partner-archive-form-base"]}>
          <NativeInfoCard title={PARTNER_FORM_BASE_SECTION_TITLE} icon={<UserRound className="size-5" />}>
            <>
                <NativeFormRow label="主体类型" required>
                  <button
                    type="button"
                    data-partner-form-locked={subjectTypeLocked ? "true" : undefined}
                    className={
                      subjectTypeLocked
                        ? `w-full text-right text-sm ${PARTNER_FORM_LOCKED_BUTTON_H5}`
                        : "w-full text-right text-sm text-[#232D39]"
                    }
                    onClick={() => setTypeOpen(true)}
                    disabled={subjectTypeLocked}
                  >
                    {subjectTypeLabel}
                  </button>
                </NativeFormRow>
                <NativeFormRow label="主体名称" required>
                  <input
                    data-partner-form-locked={subjectNameReadOnly ? "true" : undefined}
                    className={h5FieldInputClass(
                      subjectNameReadOnly,
                      subjectNameReadOnly ? "w-full min-w-0" : "min-w-0 flex-1",
                    )}
                    value={name}
                    maxLength={subjectType === "ENTERPRISE" ? 100 : 30}
                    readOnly={subjectNameReadOnly}
                    disabled={subjectNameReadOnly}
                    placeholder={
                      subjectType === "ENTERPRISE" ? "营业执照标准全称" : undefined
                    }
                    onChange={(e) => {
                      markDirty()
                      setName(e.target.value)
                    }}
                  />
                  {subjectType === "ENTERPRISE" ? (
                    <PartnerEnterpriseLicenseOcrButton
                      disabled={enterpriseLicenseOcrDisabled}
                      onClick={runEnterpriseLicenseOcr}
                    />
                  ) : null}
                </NativeFormRow>
                {subjectType === "ENTERPRISE" ? (
                  <>
                    <NativeFormRow
                      label="经办人姓名"
                      required={pickupEnterpriseAgentNameRequired}
                    >
                      <input
                        data-partner-form-locked={agentNameLocked ? "true" : undefined}
                        className={h5FieldInputClass(agentNameLocked)}
                        value={agentName}
                        maxLength={30}
                        readOnly={agentNameLocked}
                        disabled={agentNameLocked}
                        onChange={(e) => {
                          markDirty()
                          setAgentName(e.target.value)
                        }}
                      />
                    </NativeFormRow>
                    {ownerEnterpriseAgentOptional ? (
                      <div className="border-b border-[#232D39]/10 px-3 pb-3 last:border-b-0">
                        <ProductFieldHint className="text-[#232D39]/55">
                          {PARTNER_OWNER_ENTERPRISE_AGENT_USER_HINT}
                        </ProductFieldHint>
                      </div>
                    ) : null}
                  </>
                ) : null}
                {showPickupAgentIdField ? (
                  <NativeFormRow label="经办人身份证号" required>
                    <input
                      data-partner-form-locked={
                        isFrozenLimitedEdit ? "true" : undefined
                      }
                      className={h5FieldInputClass(isFrozenLimitedEdit)}
                      value={agentIdNumber}
                      maxLength={18}
                      readOnly={isFrozenLimitedEdit}
                      disabled={isFrozenLimitedEdit}
                      onChange={(e) => {
                        markDirty()
                        setAgentIdNumber(e.target.value)
                      }}
                    />
                  </NativeFormRow>
                ) : null}
                <NativeFormRow
                  label={partnerContactPhoneFormLabel(subjectType)}
                  required={contactPhoneRequired}
                >
                  <input
                    data-partner-form-locked={
                      contactPhoneLocked ? "true" : undefined
                    }
                    className={h5FieldInputClass(contactPhoneLocked)}
                    inputMode="numeric"
                    value={contactPhone}
                    maxLength={11}
                    readOnly={contactPhoneLocked}
                    disabled={contactPhoneLocked}
                    onChange={(e) => {
                      markDirty()
                      setContactPhone(e.target.value.replace(/\D/g, ""))
                    }}
                  />
                </NativeFormRow>
                <NativeFormRow
                  label={subjectType === "ENTERPRISE" ? "统一社会信用代码" : "身份标识"}
                  required
                >
                  <input
                    data-partner-form-locked={subjectIdReadOnly ? "true" : undefined}
                    className={h5FieldInputClass(subjectIdReadOnly)}
                    value={idNumber}
                    maxLength={18}
                    readOnly={subjectIdReadOnly}
                    disabled={subjectIdReadOnly}
                    onChange={(e) => {
                      markDirty()
                      setIdNumber(e.target.value)
                    }}
                  />
                </NativeFormRow>
            </>
          </NativeInfoCard>
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget
            annotationIds={["partner-archive-form-address"]}
          >
          <NativeInfoCard title="证件登记地址" icon={<UserRound className="size-5" />}>
            <div className="space-y-2 px-3 pb-2">
              {archiveMenuLabel === "货主信息" ? (
                <ProductFieldHint className="text-[#232D39]/55">
                  {partnerFormAddressUserHint(subjectType, addressRequired)}
                </ProductFieldHint>
              ) : null}
              <PrototypeSpecCallout>
                {archiveMenuLabel === "货主信息"
                  ? PARTNER_FORM_ADDRESS_SPEC_NOTE_OWNER
                  : PARTNER_FORM_ADDRESS_SPEC_NOTE_OTHER}
              </PrototypeSpecCallout>
            </div>
            <NativeFormRow label="省" required={addressRequired}>
              <input
                className="w-full bg-transparent text-right text-sm outline-none"
                value={province}
                onChange={(e) => {
                  markDirty()
                  setProvince(e.target.value)
                }}
              />
            </NativeFormRow>
            <NativeFormRow label="市" required={addressRequired}>
              <input
                className="w-full bg-transparent text-right text-sm outline-none"
                value={city}
                onChange={(e) => {
                  markDirty()
                  setCity(e.target.value)
                }}
              />
            </NativeFormRow>
            <NativeFormRow label="区/县" required={addressRequired}>
              <input
                className="w-full bg-transparent text-right text-sm outline-none"
                value={district}
                onChange={(e) => {
                  markDirty()
                  setDistrict(e.target.value)
                }}
              />
            </NativeFormRow>
            <div className="px-3 pb-1 pt-1">
              <p className="text-xs text-[#232D39]/55">
                {addressRequired ? (
                  <span className="mr-0.5 text-[#EF3E3E]">*</span>
                ) : null}
                证件地址详细
              </p>
            </div>
            <div className="px-3 pb-3">
              <textarea
                className="min-h-[72px] w-full resize-none rounded-lg bg-[#232D39]/5 p-3 text-sm outline-none"
                placeholder="请输入街道、门牌号等详细地址（整段地址不超过 200 字）"
                maxLength={200}
                value={detailAddress}
                onChange={(e) => {
                  markDirty()
                  setDetailAddress(e.target.value)
                }}
              />
            </div>
          </NativeInfoCard>
          </PrototypeAnnotationTarget>

          {!isEdit ? (
            <PrototypeAnnotationTarget annotationIds={["partner-archive-form-roles"]}>
            <NativeInfoCard
              title={PARTNER_FORM_INITIAL_ROLES_SECTION_TITLE}
              icon={<UserRound className="size-5" />}
            >
              <div className="space-y-2 px-3 pb-2">
                <ProductFieldHint className="text-[#232D39]/55">
                  {PARTNER_FORM_INITIAL_ROLES_USER_HINT}
                </ProductFieldHint>
                <PrototypeSpecCallout>{PARTNER_FORM_INITIAL_ROLES_SPEC_NOTE}</PrototypeSpecCallout>
              </div>
              <div className="flex flex-wrap gap-2 px-3 pb-3">
                {appendMenuOptions.map((menu) => {
                  const active = selectedAppendMenus.includes(menu)
                  return (
                    <button
                      key={menu}
                      type="button"
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                        active
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                      onClick={() => toggleAppendMenu(menu)}
                    >
                      {menu}
                    </button>
                  )
                })}
              </div>
            </NativeInfoCard>
            </PrototypeAnnotationTarget>
          ) : null}
        </div>

        <PrototypeAnnotationTarget annotationIds={["partner-archive-form-actions"]}>
        <div className="fixed inset-x-0 bottom-0 border-t border-[#232D39]/10 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {!isEdit ? (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={submitting}
                className="flex-1 rounded-xl border border-blue-600 py-3 text-sm font-semibold text-blue-600 active:bg-blue-50 disabled:opacity-50"
                onClick={handleSaveAndVerify}
              >
                {submitting ? "处理中…" : PARTNER_FORM_ACTION_LABELS.saveVerify}
              </button>
              <button
                type="button"
                disabled={submitting}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white active:bg-blue-700 disabled:opacity-50"
                onClick={handleSubmit}
              >
                {submitting ? "提交中…" : PARTNER_FORM_ACTION_LABELS.saveSubmit}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white active:bg-blue-700 disabled:opacity-50"
              onClick={handleSubmit}
            >
              {submitting ? "提交中…" : submitLabel}
            </button>
          )}
        </div>
        </PrototypeAnnotationTarget>

        <MobileDownSelectSheet
          open={typeOpen}
          title="选择主体类型"
          options={PARTNER_FORM_SUBJECT_TYPE_OPTIONS.map((label) => ({
            id: label,
            label,
          }))}
          selectedId={subjectTypeLabel}
          onClose={() => setTypeOpen(false)}
          onSelect={(opt) => {
            markDirty()
            setSubjectTypeLabel(opt.label)
          }}
        />

        {leaveOpen ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
              <p className="text-base font-semibold text-gray-900">未保存的修改</p>
              <p className="mt-1 text-sm text-gray-500">当前有未保存的修改，确认离开吗？</p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm"
                  onClick={() => setLeaveOpen(false)}
                >
                  继续编辑
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white"
                  onClick={leaveToPrevious}
                >
                  离开
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <PartnerVerifySheet
          open={verifyOpen}
          mode={verifyMode}
          verifyContext={
            verifyMode === "VERIFY_CONTACT" ? "CREATE_ARCHIVE" : undefined
          }
          subjectType={subjectType}
          name={name.trim()}
          idNumber={idNumber.trim()}
          contactPhone={contactPhone.trim()}
          fullAddress={`${province}${city}${district}${detailTrimmed}`}
          roles={
            isEdit
              ? existing?.roles.map((r) => r.roleType)
              : [implicitRoleForArchiveMenu(archiveMenuLabel)]
          }
          agentName={subjectType === "ENTERPRISE" ? agentName.trim() : undefined}
          oldPhone={verifyMode === "CHANGE_PHONE" ? existing?.contactPhone : undefined}
          onClose={() => {
            setVerifyOpen(false)
            setSubmitting(false)
          }}
          onConfirm={() => {
            setVerifyOpen(false)
            setSubmitting(true)
            queueCreateSave(
              verifyMode === "VERIFY_CONTACT" ? { verifiedOnCreate: true } : undefined,
            )
          }}
        />

        <PartnerCompositeSaveSheet
          open={compositeSheetOpen}
          mode={compositeSheetMode}
          currentMenu={archiveMenuLabel}
          plan={compositePlan}
          appendMenus={selectedAppendMenus}
          failures={compositeFailures}
          successLines={compositeSuccessLines}
          verifiedOnCreate={lastSaveVerified}
          onClose={() => setCompositeSheetOpen(false)}
          onConfirmComposite={handleCompositeSaveConfirm}
          onBackToList={() => {
            setCompositeSheetOpen(false)
            navigate(partnerArchiveListRoute(archiveMenuLabel))
          }}
          onViewDetail={() => {
            setCompositeSheetOpen(false)
            if (lastCreatedPartnerId) {
              navigate(partnerArchiveDetailRoute(archiveMenuLabel, lastCreatedPartnerId))
            } else {
              navigate(partnerArchiveListRoute(archiveMenuLabel))
            }
          }}
        />

        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white">
            {toast}
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}
