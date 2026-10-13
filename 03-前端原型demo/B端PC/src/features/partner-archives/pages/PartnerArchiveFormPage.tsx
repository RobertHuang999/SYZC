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
import { getPartnerArchiveById } from "../lib/detail-utils"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
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

  const isIndividualOwner = useMemo(() => {
    if (!existing) return false
    return (
      existing.subjectType === "INDIVIDUAL" &&
      existing.roles.some((r) => r.roleType === "OWNER")
    )
  }, [existing])

  const submitButtonLabel = isPendingCompletion
    ? "补全并生效"
    : isEdit
      ? "保存修改"
      : "保存并提交"

  const doSave = (changeReason?: string) => {
    if (subjectType === "INDIVIDUAL" && selectedRoles.includes("OWNER")) {
      const isConflict = detailAddress.includes("玄武大道 699 号") && !existing
      if (isConflict) {
        setAccessWarning("已有相同证件地址，不能绑定为该个人货主")
        setIsSubmitting(false)
        return
      }
    }

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
        certAddress: {
          province,
          city,
          district,
          detail: detailAddress.trim(),
          fullAddress: `${province}${city}${district}${detailAddress.trim()}`,
        },
        contactPhone: contactPhone.trim(),
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
            actionName: "人工建档",
            detail: "通过 PA-R04a 短信二元核验后完成合作方主体建档",
          },
        ],
      }
      partnerArchivesMock.unshift(newPartner)
    } else if (existing) {
      const wasPending =
        existing.roles.some((r) => r.roleStatus === "PENDING_COMPLETION") ||
        !existing.certAddress.fullAddress

      if (!isFrozenLimitedEdit) {
        existing.name = name.trim()
        existing.contactPhone = contactPhone.trim()
      }
      existing.certAddress = {
        province,
        city,
        district,
        detail: detailAddress.trim(),
        fullAddress: `${province}${city}${district}${detailAddress.trim()}`,
      }

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
        : "短信身份核验通过，合作方建档成功"
    )
    window.setTimeout(() => navigate(PARTNER_ARCHIVE_LIST_PATH), 800)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setAccessWarning(null)
    const newErrors: Record<string, string> = {}

    if (!isPendingCompletion) {
      if (!name.trim()) {
        newErrors.name = "请输入主体名称"
      }
      if (!idNumber.trim()) {
        newErrors.idNumber =
          subjectType === "INDIVIDUAL"
            ? "请输入18位居民身份证号"
            : "请输入18位统一社会信用代码"
      } else if (idNumber.trim().length !== 18) {
        newErrors.idNumber = "证件号码长度必须为18位字符"
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
    if (!province.trim() || !city.trim() || !district.trim()) {
      newErrors.district = "请选择完整的省/市/区"
    }
    if (!detailAddress.trim()) {
      newErrors.detailAddress = "请输入证件详细地址"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!isEdit) {
      const duplicate = findPartnerByIdNumber(partnerArchivesMock, idNumber)
      if (duplicate) {
        setAccessWarning("该主体已存在，请前往详情追加角色配置")
        return
      }
    }

    const illegalRole = selectedRoles.find((role) => !selectableRoles.includes(role))
    if (!isEdit && illegalRole) {
      setErrors({
        roles: `${ROLE_TYPE_LABELS[illegalRole]}不适用于当前主体类型`,
      })
      return
    }

    setIsSubmitting(true)

    // PA-R06a: 编辑态个人货主改址 Diff 阻断并弹出必填改址原因
    if (isEdit && isIndividualOwner && hasAddressDiff) {
      setChangeAddressDialogOpen(true)
      setIsSubmitting(false)
      return
    }

    // 编辑态修改了手机号：触发短信二元身份核验
    if (isEdit && hasPhoneDiff) {
      setVerifyDialogOpen(true)
      setIsSubmitting(false)
      return
    }

    // 新增合作方：唤起短信二元身份认证弹窗
    if (!isEdit) {
      setVerifyDialogOpen(true)
      setIsSubmitting(false)
      return
    }

    doSave()
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
            </div>
          </PrototypeAnnotationTarget>
        </div>

        {isFrozenLimitedEdit && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            主体处于冻结状态：名称与联系电话不可修改；仅允许在风控授权下纠偏证件登记地址（须过准入与改址原因）。
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
                    <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground">
                        {existing.subjectType === "INDIVIDUAL"
                          ? "业务联系手机"
                          : "联系电话（经办人手机）"}
                      </span>
                      <p className="text-sm font-mono font-medium">{existing.contactPhone || "——"}</p>
                    </div>
                    <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground">
                        {existing.subjectType === "INDIVIDUAL"
                          ? "身份标识（公民身份证号）"
                          : "货主标识（统一社会信用代码）"}
                      </span>
                      <p className="text-sm font-mono font-medium">{existing.idNumber}</p>
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
                        readOnly={isFrozenLimitedEdit}
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

                    {/* 字段 3：手机号（个人） / 联系电话（企业） */}
                    <div className="space-y-2">
                      <Label htmlFor="partner-phone">
                        <span className="mr-1 font-bold text-destructive">*</span>
                        {subjectType === "INDIVIDUAL" ? "手机号" : "联系电话（经办人手机）"}
                      </Label>
                      <Input
                        id="partner-phone"
                        value={contactPhone}
                        maxLength={11}
                        readOnly={isFrozenLimitedEdit}
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

                    {/* 字段 4：身份标识（个人） / 货主标识（信用代码）（企业） */}
                    <div className="space-y-2">
                      <Label htmlFor="partner-idNumber">
                        <span className="mr-1 font-bold text-destructive">*</span>
                        {subjectType === "INDIVIDUAL" ? "身份标识" : "货主标识（信用代码）"}
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
                        className="font-mono"
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
                {subjectType === "INDIVIDUAL" && (
                  <p className="text-xs text-muted-foreground">
                    个人货主证件地址将联动统一准入核验（租户内唯一，PA-R04）。
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
                    placeholder="请输入街道、门牌号等详细地址（≤200 字）"
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
                  <CardTitle>初始业务角色配置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    仅新增建档阶段开放选填；勾选「货主」角色时，提交将即时调用统一准入核验服务。
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
              setVerifyDialogOpen(true)
            } else {
              doSave(reason)
            }
          }}
        />

        <PartnerVerifyDialog
          open={verifyDialogOpen}
          mode={isEdit && hasPhoneDiff ? "CHANGE_PHONE" : "CREATE"}
          oldPhone={isEdit ? existing?.contactPhone : undefined}
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
            doSave(pendingChangeReason)
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
