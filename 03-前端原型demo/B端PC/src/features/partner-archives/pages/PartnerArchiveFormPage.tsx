import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react"
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
import { partnerArchiveDocuments } from "../documents/partner-archive-documents"
import { partnerArchiveFormAnnotations } from "../annotations/partner-archive-form.annotations"
import { PartnerConfirmDialog } from "../components/PartnerConfirmDialog"
import { PartnerVerifyDialog } from "../components/PartnerVerifyDialog"
import {
  PARTNER_ARCHIVE_LIST_PATH,
  PARTNER_FORM_SUBJECT_TYPE_OPTIONS,
} from "../domain/constants"
import {
  SUBJECT_STATUS_BADGE_CLASS,
  SUBJECT_STATUS_LABELS,
} from "../domain/actions"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
  markContactPhoneVerified,
  resolveContactPhoneVerified,
} from "../lib/contact-phone-verify"
import { getPartnerArchiveById } from "../lib/detail-utils"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
  findIndividualOwnerAddressConflict,
  findPartnerByIdNumber,
  maskIdNumber,
  rolesAllowedForSubjectType,
} from "../lib/partner-archive-rules"
import {
  ROLE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
  type PartnerSubject,
  type RoleType,
  type SubjectType,
} from "../domain/types"
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
  const isEdit = Boolean(id)
  const existing = useMemo(() => (isEdit ? getPartnerArchiveById(id) : undefined), [id, isEdit])

  const [subjectTypeLabel, setSubjectTypeLabel] = useState(
    subjectTypeToLabel(existing?.subjectType ?? "INDIVIDUAL")
  )
  const subjectType = subjectTypeFromLabel(subjectTypeLabel)

  const [name, setName] = useState(existing?.name ?? "")
  const [idNumber, setIdNumber] = useState(existing?.idNumber ?? "")
  const [contactPhone, setContactPhone] = useState(existing?.contactPhone ?? "")
  const [agentName, setAgentName] = useState(existing?.agentName ?? "")
  const [adjustAgentMode, setAdjustAgentMode] = useState(false)
  const [province, setProvince] = useState(existing?.certAddress.province || (isEdit ? "" : "江苏省"))
  const [city, setCity] = useState(existing?.certAddress.city || (isEdit ? "" : "南京市"))
  const [district, setDistrict] = useState(existing?.certAddress.district || (isEdit ? "" : "鼓楼区"))
  const [detailAddress, setDetailAddress] = useState(existing?.certAddress.detail ?? "")
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>(
    existing ? existing.roles.map((role) => role.roleType) : ["OWNER"]
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [accessWarning, setAccessWarning] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [changeAddressDialogOpen, setChangeAddressDialogOpen] = useState(false)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [verifyDialogMode, setVerifyDialogMode] = useState<
    "CHANGE_PHONE" | "VERIFY_CONTACT"
  >("CHANGE_PHONE")
  const [pendingChangeReason, setPendingChangeReason] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectableRoles = useMemo(
    () => rolesAllowedForSubjectType(subjectType),
    [subjectType]
  )

  const isPendingCompletion = useMemo(() => {
    if (!existing) return false
    return (
      existing.roles.some((r) => r.roleStatus === "PENDING_COMPLETION") ||
      !existing.certAddress.fullAddress
    )
  }, [existing])

  const isFrozenLimitedEdit = Boolean(
    isEdit && existing?.status === "FROZEN" && !isPendingCompletion
  )

  const isContactPhoneVerified = Boolean(
    isEdit && existing && resolveContactPhoneVerified(existing) === "VERIFIED"
  )

  const coreIdentityLocked = Boolean(isEdit && isContactPhoneVerified && !isPendingCompletion)

  useEffect(() => {
    if (isEdit) {
      return
    }
    setSelectedRoles((prev) => prev.filter((role) => selectableRoles.includes(role)))
  }, [isEdit, selectableRoles])

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

  if (isEdit && !existing) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="outline" onClick={() => navigate(PARTNER_ARCHIVE_LIST_PATH)}>
          <ArrowLeftIcon />
          返回
        </Button>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的合作方档案
        </div>
      </div>
    )
  }

  const pageTitle = isEdit
    ? isPendingCompletion
      ? `补全合作方档案 — ${existing?.name ?? ""}`
      : `编辑合作方档案 — ${existing?.name ?? ""}`
    : "新增合作方档案"

  const markDirty = () => setDirty(true)

  const toggleRole = (role: RoleType) => {
    markDirty()
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((item) => item !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
    setErrors((prev) => ({ ...prev, roles: "" }))
  }

  const handleNavigateAway = () => {
    if (dirty && !window.confirm("当前有未保存的修改，确认离开吗？")) {
      return
    }
    navigate(PARTNER_ARCHIVE_LIST_PATH)
  }

  const hasAddressDiff = useMemo(() => {
    if (!existing || !existing.certAddress.fullAddress) return false
    return (
      existing.certAddress.province !== province ||
      existing.certAddress.city !== city ||
      existing.certAddress.district !== district ||
      existing.certAddress.detail.trim() !== detailAddress.trim()
    )
  }, [existing, province, city, district, detailAddress])

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

  const hasIndividualOwnerRole = useMemo(() => {
    if (existing) {
      return existing.roles.some(
        (role) => role.roleType === "OWNER" && role.roleStatus !== "INVALID"
      )
    }
    return selectedRoles.includes("OWNER")
  }, [existing, selectedRoles])

  const isIndividualOwner = Boolean(
    subjectType === "INDIVIDUAL" && isEdit && hasIndividualOwnerRole
  )

  const addressRequired =
    isPendingCompletion ||
    subjectType === "ENTERPRISE" ||
    (subjectType === "INDIVIDUAL" && hasIndividualOwnerRole)

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

  const doSave = (
    changeReason?: string,
    options?: { verifiedOnCreate?: boolean }
  ) => {
    const phoneChanged = Boolean(isEdit && hasPhoneDiff)
    const oldPhoneVal = existing?.contactPhone
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const today = now.substring(0, 10)

    if (!existing) {
      const duplicate = findPartnerByIdNumber(partnerArchivesMock, idNumber)
      if (duplicate) {
        setAccessWarning("该主体已存在，请前往详情追加角色配置")
        setIsSubmitting(false)
        return
      }

      const newId = `p-${Date.now()}`
      const trimmedId = idNumber.trim()
      const newPartner: PartnerSubject = {
        id: newId,
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
    } else if (existing) {
      const wasPending =
        existing.roles.some((r) => r.roleStatus === "PENDING_COMPLETION") ||
        !existing.certAddress.fullAddress

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
        markContactPhoneVerified(existing)
      }
      existing.certAddress = buildCertAddress()

      if (wasPending) {
        existing.roles = existing.roles.map((r) =>
          r.roleStatus === "PENDING_COMPLETION"
            ? { ...r, roleStatus: "NORMAL" }
            : r
        )
      }

      const changeParts: string[] = []
      if (phoneChanged) {
        changeParts.push(
          `变更业务联系电话为【${contactPhone.trim()}】（原：${oldPhoneVal}，短信二元核验通过）`
        )
      }
      if (changeReason) {
        changeParts.push(
          `变更证件地址为【${province}${city}${district}${detailAddress.trim()}】，改址原因：${changeReason}`
        )
      } else if (hasAddressDiff) {
        changeParts.push(
          `变更证件地址为【${province}${city}${district}${detailAddress.trim()}】`
        )
      }

      const logDetail =
        changeParts.length > 0
          ? changeParts.join("；")
          : wasPending
            ? `补全证件登记地址【${province}${city}${district}${detailAddress.trim()}】，关联角色自动生效激活为正常`
            : `更新合作方档案基础资料`

      existing.auditLogs = [
        {
          id: `log-${Date.now()}`,
          opTime: new Date().toISOString().replace("T", " ").substring(0, 19),
          operator: "当前用户",
          actionType: "EDIT",
          actionName: wasPending ? "完善档案资料" : "编辑合作方档案",
          detail: logDetail,
        },
        ...existing.auditLogs,
      ]
    }

    setDirty(false)
    setIsSubmitting(false)
    setToastMessage(
      isEdit
        ? phoneChanged
          ? "短信身份核验通过，联系手机修改成功"
          : changeReason
            ? "改址成功并已生效"
            : isPendingCompletion
              ? "资料补全成功，角色已激活为正常"
              : "保存成功"
        : options?.verifiedOnCreate
          ? "合作方建档成功（联系手机已验证）"
          : "合作方建档成功（联系手机未验证）"
    )
    window.setTimeout(() => navigate(PARTNER_ARCHIVE_LIST_PATH), 800)
  }

  const validateForm = (): boolean => {
    setAccessWarning(null)
    const newErrors: Record<string, string> = {}

    if (!isPendingCompletion) {
      const nameMax = subjectType === "ENTERPRISE" ? 100 : 30
      if (!name.trim()) {
        newErrors.name = "请输入主体名称"
      } else if (name.trim().length > nameMax) {
        newErrors.name =
          subjectType === "ENTERPRISE"
            ? "企业全称不超过 100 字"
            : "姓名不超过 30 字"
      }
      if (!idNumber.trim()) {
        newErrors.idNumber =
          subjectType === "INDIVIDUAL"
            ? "请输入18位居民身份证号"
            : "请输入18位统一社会信用代码"
      } else if (idNumber.trim().length !== 18) {
        newErrors.idNumber = "证件号码长度必须为18位字符"
      }
      if (subjectType === "ENTERPRISE" && !agentName.trim()) {
        newErrors.agentName = "请输入经办人姓名"
      } else if (subjectType === "ENTERPRISE" && agentName.trim().length > 30) {
        newErrors.agentName = "经办人姓名不超过 30 字"
      }
      if (!contactPhone.trim()) {
        newErrors.contactPhone =
          subjectType === "INDIVIDUAL"
            ? "请输入11位手机号码"
            : "请输入11位联系电话（经办人手机）"
      } else if (!/^1[3-9]\d{9}$/.test(contactPhone.trim())) {
        newErrors.contactPhone = "请输入11位大陆标准有效手机号码（用于接收短信验证码）"
      }
    }
    const detailTrimmed = detailAddress.trim()
    const addressTouched = Boolean(detailTrimmed)
    if (addressRequired || addressTouched) {
      if (!province.trim() || !city.trim() || !district.trim()) {
        newErrors.district = "请选择完整的省/市/区"
      }
      if (!detailTrimmed) {
        newErrors.detailAddress = "请输入证件详细地址"
      } else if (`${province}${city}${district}${detailTrimmed}`.length > 200) {
        newErrors.detailAddress = "证件地址不超过 200 字"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    if (!isEdit) {
      const duplicate = findPartnerByIdNumber(partnerArchivesMock, idNumber)
      if (duplicate) {
        setAccessWarning("该主体已存在，请前往详情追加角色配置")
        return false
      }
    }

    const illegalRole = selectedRoles.find((role) => !selectableRoles.includes(role))
    if (!isEdit && illegalRole) {
      setErrors({
        roles: `${ROLE_TYPE_LABELS[illegalRole]}不适用于当前主体类型`,
      })
      return false
    }

    if (
      subjectType === "INDIVIDUAL" &&
      hasIndividualOwnerRole &&
      detailTrimmed &&
      findIndividualOwnerAddressConflict(
        partnerArchivesMock,
        `${province}${city}${district}${detailTrimmed}`,
        existing?.id
      )
    ) {
      setAccessWarning("已有相同证件地址，不能绑定为该个人货主")
      return false
    }

    return true
  }

  const proceedAfterValidation = (intent: "SAVE" | "SAVE_AND_VERIFY") => {
    setIsSubmitting(true)

    if (isEdit && isIndividualOwner && hasAddressDiff) {
      setChangeAddressDialogOpen(true)
      setIsSubmitting(false)
      return
    }

    const needsPhoneVerify =
      isEdit &&
      (hasPhoneDiff ||
        (subjectType === "ENTERPRISE" &&
          adjustAgentMode &&
          (hasPhoneDiff || hasAgentDiff)))

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

    doSave()
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
      setPendingChangeReason(undefined)
    }
  }

  return (
    <PrototypeAnnotationProvider
      title={`${pageTitle} · 原型批注`}
      annotations={partnerArchiveFormAnnotations}
      documents={partnerArchiveDocuments}
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
            主体处于冻结状态：名称与身份标识不可修改；可以维护联系电话。证件地址仅限纠偏，须通过准入并填写改址原因。
          </div>
        )}

        {isPendingCompletion && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">该合作方档案处于「待补全」状态</p>
              <p className="text-xs leading-relaxed text-amber-800">
                当前主体由单据静默沉淀生成，证件登记地址为空，关联角色限制发起业务。请在此完善省市区及详细门牌地址；保存并通过统一准入校验后，角色将自动激活转为【正常】。
              </p>
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
                {isPendingCompletion && existing ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground">主体类型</span>
                      <p className="text-sm font-medium">{SUBJECT_TYPE_LABELS[existing.subjectType]}</p>
                    </div>
                    <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground">主体名称</span>
                      <p className="text-sm font-medium">{existing.name}</p>
                    </div>
                    {existing.subjectType === "ENTERPRISE" && (
                      <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
                        <span className="text-xs text-muted-foreground">经办人姓名</span>
                        <p className="text-sm font-medium">{existing.agentName || "——"}</p>
                      </div>
                    )}
                    <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground">
                        {existing.subjectType === "INDIVIDUAL"
                          ? "手机号"
                          : "联系电话（经办人手机）"}
                      </span>
                      <p className="text-sm font-medium">{existing.contactPhone || "——"}</p>
                    </div>
                    <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground">
                        {existing.subjectType === "INDIVIDUAL"
                          ? "身份标识（公民身份证号）"
                          : "统一社会信用代码"}
                      </span>
                      <p className="text-sm font-medium">{existing.idNumber}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* 字段 1：主体类型 */}
                    <div className="space-y-2">
                      <Label>
                        <span className="mr-1 font-bold text-destructive">*</span>
                        主体类型
                      </Label>
                      <Select
                        value={subjectTypeLabel}
                        disabled={isEdit}
                        onValueChange={(next) => {
                          if (!next) return
                          markDirty()
                          setSubjectTypeLabel(next)
                        }}
                      >
                        <SelectTrigger className="w-full">
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
                      <Input
                        id="partner-name"
                        value={name}
                        maxLength={subjectType === "ENTERPRISE" ? 100 : 30}
                        readOnly={isFrozenLimitedEdit || coreIdentityLocked}
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
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    {subjectType === "ENTERPRISE" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label htmlFor="partner-agent">
                            <span className="mr-1 font-bold text-destructive">*</span>
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
                          value={agentName}
                          maxLength={30}
                          readOnly={
                            isFrozenLimitedEdit ||
                            (coreIdentityLocked && !adjustAgentMode)
                          }
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
                      </div>
                    )}

                    {/* 手机号（个人） / 联系电话（企业经办人手机） */}
                    <div className="space-y-2">
                      <Label htmlFor="partner-phone">
                        <span className="mr-1 font-bold text-destructive">*</span>
                        {subjectType === "INDIVIDUAL" ? "手机号" : "联系电话（经办人手机）"}
                      </Label>
                      <Input
                        id="partner-phone"
                        value={contactPhone}
                        maxLength={11}
                        readOnly={
                          subjectType === "ENTERPRISE" &&
                          coreIdentityLocked &&
                          !adjustAgentMode
                        }
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
                        value={idNumber}
                        readOnly={isEdit}
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
                )}
              </CardContent>
            </Card>
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget
            annotationIds={[
              "partner-archive-form-address",
              "partner-archive-form-change-address",
            ]}
          >
            <Card>
              <CardHeader>
                <CardTitle>证件登记地址</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectType === "INDIVIDUAL" && hasIndividualOwnerRole && (
                  <p className="text-xs text-muted-foreground">
                    个人货主证件地址将联动统一准入核验，租户内不能与其他个人货主相同。
                  </p>
                )}
                {subjectType === "INDIVIDUAL" && !hasIndividualOwnerRole && !isPendingCompletion && (
                  <p className="text-xs text-muted-foreground">
                    未挂接货主时，证件地址可以不填。
                  </p>
                )}
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
                  <CardTitle>业务角色（首次挂接）</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    保存时将挂接所选角色；未选则仅创建主体，稍后在详情【追加角色】维护。勾选「货主」时将调用统一准入核验（PA-R04）。
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectableRoles.map((role) => {
                      const isSelected = selectedRoles.includes(role)
                      return (
                        <Button
                          key={role}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={cn(!isSelected && "bg-background")}
                          onClick={() => toggleRole(role)}
                        >
                          {ROLE_TYPE_LABELS[role]}
                        </Button>
                      )
                    })}
                  </div>
                  {errors.roles && <p className="text-xs text-destructive">{errors.roles}</p>}
                </CardContent>
              </Card>
            </PrototypeAnnotationTarget>
          )}
        </form>

        <PartnerConfirmDialog
          open={changeAddressDialogOpen}
          title="确认变更证件地址"
          description="检测到个人货主证件登记地址已发生变动。依据 PA-R06a 规则，改址须经统一准入校验，保存后原旧地址释放出池、新地址进入活跃池，并记录不可变审计日志。请录入改址原因。"
          confirmLabel="确认改址并保存"
          reasonRequired
          reasonLabel="改址原因"
          reasonPlaceholder="请输入改址原因（1～200 字，如搬迁、证件登记信息变更等）"
          onOpenChange={(open) => setChangeAddressDialogOpen(open)}
          onConfirm={(reason) => {
            setChangeAddressDialogOpen(false)
            if (hasPhoneDiff) {
              setPendingChangeReason(reason)
              setVerifyDialogMode("CHANGE_PHONE")
              setVerifyDialogOpen(true)
            } else {
              doSave(reason)
            }
          }}
        />

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
          roles={selectedRoles}
          onOpenChange={handleVerifyOpenChange}
          onConfirm={() => {
            setVerifyDialogOpen(false)
            setIsSubmitting(true)
            doSave(
              pendingChangeReason,
              verifyDialogMode === "VERIFY_CONTACT" ? { verifiedOnCreate: true } : undefined
            )
            setPendingChangeReason(undefined)
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
