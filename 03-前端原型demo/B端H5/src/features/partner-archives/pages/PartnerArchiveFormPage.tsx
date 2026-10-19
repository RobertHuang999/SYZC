import { useEffect, useMemo, useState } from "react"
import { UserRound } from "lucide-react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { H5_PAGE_BODY } from "@/shared/h5-ui-theme"
import { NativeFormRow } from "@/features/inbound-records/components/NativeFormRow"
import { NativeInfoCard } from "@/features/inbound-records/components/NativeInfoCard"
import { MobileDownSelectSheet } from "@/features/inbound-records/components/MobileDownSelectSheet"
import {
  PARTNER_FORM_SUBJECT_TYPE_OPTIONS,
} from "@prototype/B端PC/src/features/partner-archives/domain/constants"
import {
  ROLE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
  type RoleType,
  type SubjectType,
} from "@prototype/B端PC/src/features/partner-archives/domain/types"
import { ProductFieldHint } from "@prototype/B端PC/src/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@prototype/B端PC/src/components/form/PrototypeSpecCallout"
import { getPartnerArchiveById } from "@prototype/B端PC/src/features/partner-archives/lib/detail-utils"
import { partnerArchivesMock } from "@prototype/B端PC/src/features/partner-archives/mock/partner-archives.mock"
import {
  findOwnerAddressConflict,
  findPartnerByIdNumber,
  ownerAddressConflictMessage,
  maskIdNumber,
  rolesAllowedForSubjectType,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-rules"
import {
  markContactPhoneVerified,
  resolveContactPhoneVerified,
} from "@prototype/B端PC/src/features/partner-archives/lib/contact-phone-verify"
import {
  PARTNER_CHANGE_ADDRESS_DIALOG,
  PARTNER_FORM_ACTION_LABELS,
  PARTNER_FORM_BASE_SECTION_TITLE,
  PARTNER_FORM_ADDRESS_SPEC_NOTE,
  PARTNER_FORM_INITIAL_ROLES_SECTION_TITLE,
  PARTNER_FORM_INITIAL_ROLES_SPEC_NOTE,
  PARTNER_FORM_INITIAL_ROLES_USER_HINT,
  PARTNER_PENDING_COMPLETION_SPEC_NOTE,
  PARTNER_PENDING_COMPLETION_USER_BANNER,
  partnerFormAddressUserHint,
  partnerContactPhoneFormLabel,
  partnerContactPhoneDetailLabel,
  partnerFormPageTitle,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { PartnerConfirmSheet } from "../components/PartnerConfirmSheet"
import { PartnerVerifySheet } from "../components/PartnerVerifySheet"
import { handleStackBack } from "@/shared/navigation/stack-back"
import {
  PARTNER_ARCHIVE_LIST_ROUTE,
  partnerArchiveDetailPath,
} from "../domain/constants"

function subjectTypeFromLabel(label: string): SubjectType {
  return label === "企业" ? "ENTERPRISE" : "INDIVIDUAL"
}

export function PartnerArchiveFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get("edit")
  const existing = useMemo(
    () => (editId ? getPartnerArchiveById(editId) : undefined),
    [editId],
  )
  const isEdit = Boolean(existing)

  const [subjectTypeLabel, setSubjectTypeLabel] = useState(
    existing?.subjectType === "ENTERPRISE" ? "企业" : "个人",
  )
  const subjectType = subjectTypeFromLabel(subjectTypeLabel)
  const [typeOpen, setTypeOpen] = useState(false)

  const [name, setName] = useState(existing?.name ?? "")
  const [idNumber, setIdNumber] = useState(existing?.idNumber ?? "")
  const [contactPhone, setContactPhone] = useState(existing?.contactPhone ?? "")
  const [agentName, setAgentName] = useState(existing?.agentName ?? "")
  const [province, setProvince] = useState(existing?.certAddress.province || (isEdit ? "" : "江苏省"))
  const [city, setCity] = useState(existing?.certAddress.city || (isEdit ? "" : "南京市"))
  const [district, setDistrict] = useState(existing?.certAddress.district || (isEdit ? "" : "鼓楼区"))
  const [detailAddress, setDetailAddress] = useState(existing?.certAddress.detail ?? "")
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>(
    existing ? existing.roles.map((r) => r.roleType) : ["OWNER"],
  )
  const [dirty, setDirty] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyMode, setVerifyMode] = useState<"CHANGE_PHONE" | "VERIFY_CONTACT">(
    "VERIFY_CONTACT",
  )
  const [changeAddressOpen, setChangeAddressOpen] = useState(false)
  const [pendingChangeReason, setPendingChangeReason] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const isPendingCompletion = useMemo(() => {
    if (!existing) return false
    return (
      existing.roles.some((r) => r.roleStatus === "PENDING_COMPLETION") ||
      !existing.certAddress.fullAddress
    )
  }, [existing])

  const isFrozenLimitedEdit = Boolean(
    isEdit && existing?.status === "FROZEN" && !isPendingCompletion,
  )

  const coreIdentityLocked = Boolean(
    isEdit &&
      existing &&
      resolveContactPhoneVerified(existing) === "VERIFIED" &&
      !isPendingCompletion,
  )

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
  const hasAddressDiff = Boolean(
    isEdit &&
      existing &&
      `${province}${city}${district}${detailTrimmed}` !== existing.certAddress.fullAddress,
  )

  const hasIndividualOwnerRole = Boolean(
    existing?.roles.some((r) => r.roleType === "OWNER") ||
      (!isEdit && selectedRoles.includes("OWNER")),
  )

  const selectableRoles = useMemo(
    () => rolesAllowedForSubjectType(subjectType),
    [subjectType],
  )

  useEffect(() => {
    setSelectedRoles((prev) => prev.filter((r) => selectableRoles.includes(r)))
  }, [selectableRoles])

  const markDirty = () => setDirty(true)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const toggleRole = (role: RoleType) => {
    markDirty()
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )
  }

  const buildCertAddress = () => {
    const detail = detailAddress.trim()
    return {
      province,
      city,
      district,
      detail,
      fullAddress: detail ? `${province}${city}${district}${detail}` : "",
    }
  }

  const validate = (): string | null => {
    if (!isPendingCompletion) {
      if (!name.trim()) return "请填写主体名称"
      if (!idNumber.trim() || idNumber.trim().length !== 18) {
        return "证件号码长度必须为18位字符"
      }
      if (subjectType === "ENTERPRISE" && !agentName.trim()) {
        return "企业主体请填写经办人姓名"
      }
      if (!contactPhone.trim() || !/^1[3-9]\d{9}$/.test(contactPhone.trim())) {
        return subjectType === "INDIVIDUAL"
          ? "请输入11位手机号码"
          : "请输入11位联系电话（经办人手机）"
      }
    }
    if (!isEdit && selectedRoles.length === 0) return "请至少选择一个业务角色"
    const needAddress =
      subjectType === "ENTERPRISE" || hasIndividualOwnerRole || isPendingCompletion
    if (needAddress && !detailTrimmed) {
      return "货主或企业主体须填写证件登记地址"
    }
    if (!isEdit) {
      const duplicate = findPartnerByIdNumber(partnerArchivesMock, idNumber)
      if (duplicate) {
        return "该主体已存在，请前往详情追加角色配置"
      }
    }
    if (
      hasIndividualOwnerRole &&
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
    return null
  }

  const doSave = (changeReason?: string, options?: { verifiedOnCreate?: boolean }) => {
    const phoneChanged = Boolean(isEdit && hasPhoneDiff)
    const oldPhoneVal = existing?.contactPhone
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const today = now.substring(0, 10)

    if (!existing) {
      const trimmedId = idNumber.trim()
      const newPartner: PartnerSubject = {
        id: `p-${Date.now()}`,
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
        status: "NORMAL",
        roles: selectedRoles.map((roleType) => ({
          roleType,
          roleStatus: "NORMAL" as const,
          sourceDocType: "人工建档",
          sourceDocNo: "——",
          roleEffectiveTime: now,
        })),
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
            actionName: options?.verifiedOnCreate ? "联系手机核验" : "人工建档",
            detail: options?.verifiedOnCreate
              ? "人工建档并短信验证成功（联系手机已验证，PA-R04c 已生效）"
              : "人工建档保存成功（联系手机未验证，金融场景提交前须补验）",
          },
        ],
      }
      partnerArchivesMock.unshift(newPartner)
      window.dispatchEvent(new Event("partner-archive-updated"))
      setDirty(false)
      setSubmitting(false)
      showToast(
        options?.verifiedOnCreate
          ? "合作方建档成功（联系手机已验证）"
          : "合作方建档成功（联系手机未验证）",
      )
      navigate(partnerArchiveDetailPath(newPartner.id))
      return
    }

    const wasPending = isPendingCompletion
    if (!isFrozenLimitedEdit && !coreIdentityLocked) {
      existing.name = name.trim()
    }
    if (!isPendingCompletion) {
      existing.contactPhone = contactPhone.trim()
    }
    if (!isFrozenLimitedEdit && subjectType === "ENTERPRISE") {
      existing.agentName = agentName.trim()
    }
    if (phoneChanged || hasAgentDiff) {
      markContactPhoneVerified(existing, now)
    }
    existing.certAddress = buildCertAddress()
    existing.updateTime = now

    if (wasPending) {
      existing.roles = existing.roles.map((r) =>
        r.roleStatus === "PENDING_COMPLETION" ? { ...r, roleStatus: "NORMAL" } : r,
      )
    }

    const changeParts: string[] = []
    if (phoneChanged) {
      changeParts.push(
        `变更业务联系电话为【${contactPhone.trim()}】（原：${oldPhoneVal}，短信二元核验通过）`,
      )
    }
    if (changeReason) {
      changeParts.push(
        `变更证件地址为【${province}${city}${district}${detailTrimmed}】，改址原因：${changeReason}`,
      )
    } else if (hasAddressDiff) {
      changeParts.push(`变更证件地址为【${province}${city}${district}${detailTrimmed}】`)
    }

    existing.auditLogs = [
      {
        id: `log-${Date.now()}`,
        opTime: now,
        operator: "当前用户",
        actionType: "EDIT",
        actionName: wasPending ? "完善档案资料" : "编辑合作方档案",
        detail:
          changeParts.length > 0
            ? changeParts.join("；")
            : wasPending
              ? `补全证件登记地址【${province}${city}${district}${detailTrimmed}】，关联角色自动生效激活为正常`
              : "更新合作方档案基础资料",
      },
      ...existing.auditLogs,
    ]

    window.dispatchEvent(new Event("partner-archive-updated"))
    setDirty(false)
    setSubmitting(false)
    showToast(
      phoneChanged
        ? "短信身份核验通过，联系手机修改成功"
        : changeReason
          ? "改址成功并已生效"
          : wasPending
            ? "资料补全成功，角色已激活为正常"
            : "保存成功",
    )
    navigate(partnerArchiveDetailPath(existing.id))
  }

  const proceedAfterValidation = (intent: "SAVE" | "SAVE_AND_VERIFY") => {
    setSubmitting(true)
    setWarning(null)

    if (
      isEdit &&
      subjectType === "INDIVIDUAL" &&
      hasIndividualOwnerRole &&
      hasAddressDiff
    ) {
      setChangeAddressOpen(true)
      setSubmitting(false)
      return
    }

    const needsPhoneVerify =
      isEdit && (hasPhoneDiff || (subjectType === "ENTERPRISE" && hasAgentDiff))

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

    doSave()
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
    ? partnerArchiveDetailPath(editId)
    : PARTNER_ARCHIVE_LIST_ROUTE

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

  const title = partnerFormPageTitle(isEdit, existing?.name, isPendingCompletion)

  const identityReadOnly =
    isPendingCompletion || isFrozenLimitedEdit || coreIdentityLocked

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
              主体处于冻结状态：名称与身份标识不可修改；可以维护联系电话。证件地址仅限纠偏，须通过准入并填写改址原因。
            </div>
          ) : null}

          {isPendingCompletion ? (
            <div className="mb-3 space-y-2">
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
                {PARTNER_PENDING_COMPLETION_USER_BANNER}
              </div>
              <PrototypeSpecCallout>{PARTNER_PENDING_COMPLETION_SPEC_NOTE}</PrototypeSpecCallout>
            </div>
          ) : null}

          <PrototypeAnnotationTarget annotationIds={["partner-archive-form-base"]}>
          <NativeInfoCard title={PARTNER_FORM_BASE_SECTION_TITLE} icon={<UserRound className="size-5" />}>
            {isPendingCompletion && existing ? (
              <div className="space-y-2 px-3 pb-3 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-[#232D39]/55">主体类型</span>
                  <span>{SUBJECT_TYPE_LABELS[existing.subjectType]}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#232D39]/55">主体名称</span>
                  <span className="font-medium">{existing.name}</span>
                </div>
                {existing.subjectType === "ENTERPRISE" ? (
                  <div className="flex justify-between gap-2">
                    <span className="text-[#232D39]/55">经办人姓名</span>
                    <span>{existing.agentName || "——"}</span>
                  </div>
                ) : null}
                <div className="flex justify-between gap-2">
                  <span className="text-[#232D39]/55">
                    {partnerContactPhoneDetailLabel(existing.subjectType)}
                  </span>
                  <span>{existing.contactPhone || "——"}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#232D39]/55">
                    {existing.subjectType === "ENTERPRISE" ? "统一社会信用代码" : "身份标识"}
                  </span>
                  <span>{existing.idNumberMasked}</span>
                </div>
              </div>
            ) : (
              <>
                <NativeFormRow label="主体类型">
                  <button
                    type="button"
                    className="w-full text-right text-sm text-[#232D39] disabled:opacity-50"
                    onClick={() => setTypeOpen(true)}
                    disabled={isEdit}
                  >
                    {subjectTypeLabel}
                  </button>
                </NativeFormRow>
                <NativeFormRow label="主体名称">
                  <input
                    className="w-full bg-transparent text-right text-sm outline-none disabled:opacity-50"
                    value={name}
                    maxLength={subjectType === "ENTERPRISE" ? 100 : 30}
                    readOnly={identityReadOnly}
                    onChange={(e) => {
                      markDirty()
                      setName(e.target.value)
                    }}
                  />
                </NativeFormRow>
                {subjectType === "ENTERPRISE" ? (
                  <NativeFormRow label="经办人姓名">
                    <input
                      className="w-full bg-transparent text-right text-sm outline-none disabled:opacity-50"
                      value={agentName}
                      maxLength={30}
                      readOnly={isFrozenLimitedEdit || coreIdentityLocked}
                      onChange={(e) => {
                        markDirty()
                        setAgentName(e.target.value)
                      }}
                    />
                  </NativeFormRow>
                ) : null}
                <NativeFormRow label={partnerContactPhoneFormLabel(subjectType)}>
                  <input
                    className="w-full bg-transparent text-right text-sm outline-none disabled:opacity-50"
                    inputMode="numeric"
                    value={contactPhone}
                    maxLength={11}
                    readOnly={isPendingCompletion}
                    onChange={(e) => {
                      markDirty()
                      setContactPhone(e.target.value.replace(/\D/g, ""))
                    }}
                  />
                </NativeFormRow>
                <NativeFormRow
                  label={subjectType === "ENTERPRISE" ? "统一社会信用代码" : "身份标识"}
                >
                  <input
                    className="w-full bg-transparent text-right text-sm outline-none disabled:opacity-50"
                    value={idNumber}
                    maxLength={18}
                    disabled={isEdit}
                    readOnly={coreIdentityLocked && isEdit}
                    onChange={(e) => {
                      markDirty()
                      setIdNumber(e.target.value)
                    }}
                  />
                </NativeFormRow>
              </>
            )}
          </NativeInfoCard>
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget
            annotationIds={[
              "partner-archive-form-address",
              "partner-archive-form-change-address",
            ]}
          >
          <NativeInfoCard title="证件登记地址" icon={<UserRound className="size-5" />}>
            <div className="space-y-2 px-3 pb-2">
              <ProductFieldHint className="text-[#232D39]/55">
                {partnerFormAddressUserHint(subjectType)}
              </ProductFieldHint>
              <PrototypeSpecCallout>{PARTNER_FORM_ADDRESS_SPEC_NOTE}</PrototypeSpecCallout>
            </div>
            <NativeFormRow label="省">
              <input
                className="w-full bg-transparent text-right text-sm outline-none"
                value={province}
                onChange={(e) => {
                  markDirty()
                  setProvince(e.target.value)
                }}
              />
            </NativeFormRow>
            <NativeFormRow label="市">
              <input
                className="w-full bg-transparent text-right text-sm outline-none"
                value={city}
                onChange={(e) => {
                  markDirty()
                  setCity(e.target.value)
                }}
              />
            </NativeFormRow>
            <NativeFormRow label="区/县">
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
              <p className="text-xs text-[#232D39]/55">证件地址详细</p>
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
                {selectableRoles.map((role) => {
                  const active = selectedRoles.includes(role)
                  return (
                    <button
                      key={role}
                      type="button"
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                        active
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                      onClick={() => toggleRole(role)}
                    >
                      {ROLE_TYPE_LABELS[role]}
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

        <PartnerConfirmSheet
          open={changeAddressOpen}
          title={PARTNER_CHANGE_ADDRESS_DIALOG.title}
          description={PARTNER_CHANGE_ADDRESS_DIALOG.descriptionUser}
          specNote={PARTNER_CHANGE_ADDRESS_DIALOG.descriptionSpec}
          confirmLabel={PARTNER_CHANGE_ADDRESS_DIALOG.confirmLabel}
          reasonRequired
          reasonLabel={PARTNER_CHANGE_ADDRESS_DIALOG.reasonLabel}
          reasonPlaceholder={PARTNER_CHANGE_ADDRESS_DIALOG.reasonPlaceholder}
          onClose={() => setChangeAddressOpen(false)}
          onConfirm={(reason) => {
            setChangeAddressOpen(false)
            if (hasPhoneDiff || hasAgentDiff) {
              setPendingChangeReason(reason)
              setVerifyMode("CHANGE_PHONE")
              setVerifyOpen(true)
            } else {
              doSave(reason)
            }
          }}
        />

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
          roles={isEdit ? existing?.roles.map((r) => r.roleType) : selectedRoles}
          agentName={subjectType === "ENTERPRISE" ? agentName.trim() : undefined}
          oldPhone={verifyMode === "CHANGE_PHONE" ? existing?.contactPhone : undefined}
          onClose={() => {
            setVerifyOpen(false)
            setSubmitting(false)
            setPendingChangeReason(undefined)
          }}
          onConfirm={() => {
            setVerifyOpen(false)
            doSave(
              pendingChangeReason,
              verifyMode === "VERIFY_CONTACT" ? { verifiedOnCreate: true } : undefined,
            )
            setPendingChangeReason(undefined)
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
