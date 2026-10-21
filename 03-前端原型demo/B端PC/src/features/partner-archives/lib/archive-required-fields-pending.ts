import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import { platformBasicConfigInitialState } from "../../platform-basic-config/mock/platform-basic-config.mock"
import type { PartnerSubject, SubjectType } from "../domain/types"

const PHONE_PATTERN = /^1[3-9]\d{9}$/
const ID_18 = (value: string) => value.trim().length === 18

/** 04-x 必填缺口（用于待补全派生与补全编辑校验） */
export type ArchiveRequiredGap =
  | "name"
  | "idNumber"
  | "contactPhone"
  | "agentName"
  | "agentIdNumber"
  | "certAddress"

export function isEnterpriseOnlyArchiveMenu(menu: PartnerArchiveMenuLabel): boolean {
  return menu === "资金方信息" || menu === "服务方信息"
}

/** 仅货主信息走基础配置 P01 证件地址必填 */
export function readOwnerCertAddressP01Enabled(subjectType: SubjectType): boolean {
  const policy = platformBasicConfigInitialState.partnerAccess
  return subjectType === "ENTERPRISE"
    ? policy.enterprise.certAddressRequired === "是"
    : policy.individual.certAddressRequired === "是"
}

/** 表单是否展示/保存校验证件地址（仅货主 + P01 开启） */
export function isCertAddressSaveRequired(
  menu: PartnerArchiveMenuLabel,
  subjectType: SubjectType,
): boolean {
  if (menu !== "货主信息") {
    return false
  }
  return readOwnerCertAddressP01Enabled(subjectType)
}

/** @deprecated 使用 isCertAddressSaveRequired */
export function isCertAddressRequiredForArchiveMenu(
  menu: PartnerArchiveMenuLabel,
): boolean {
  return menu === "货主信息"
}

export function collectArchiveRequiredGaps(subject: PartnerSubject): ArchiveRequiredGap[] {
  const menu = subject.archiveMenu
  const gaps: ArchiveRequiredGap[] = []
  const nameOk = subject.name.trim().length > 0
  const idOk = ID_18(subject.idNumber)
  const phoneOk = PHONE_PATTERN.test(subject.contactPhone.trim())

  switch (menu) {
    case "货主信息": {
      if (!nameOk) gaps.push("name")
      if (!idOk) gaps.push("idNumber")
      if (!phoneOk) gaps.push("contactPhone")
      if (subject.subjectType === "ENTERPRISE" && !subject.agentName?.trim()) {
        gaps.push("agentName")
      }
      if (
        readOwnerCertAddressP01Enabled(subject.subjectType) &&
        !subject.certAddress.fullAddress.trim()
      ) {
        gaps.push("certAddress")
      }
      break
    }
    case "提货人信息": {
      if (!nameOk) gaps.push("name")
      if (!idOk) gaps.push("idNumber")
      if (!phoneOk) gaps.push("contactPhone")
      if (subject.subjectType === "ENTERPRISE") {
        if (!subject.agentName?.trim()) gaps.push("agentName")
        if (!ID_18(subject.agentIdNumber ?? "")) gaps.push("agentIdNumber")
      }
      break
    }
    case "资金方信息":
    case "服务方信息": {
      if (!nameOk) gaps.push("name")
      if (!idOk) gaps.push("idNumber")
      break
    }
    default:
      break
  }

  return gaps
}

/** 仅「货主信息」子菜单在 P01 缺地址等必填未齐时派生「待补全」；其他页面（提货人/资金方/服务方）一律不派生待补全 */
export function isArchiveRequiredFieldsPending(subject: PartnerSubject): boolean {
  if (subject.archiveMenu !== "货主信息") {
    return false
  }
  return collectArchiveRequiredGaps(subject).length > 0
}

/** 仅「货主信息」在待补全时行操作显示「补全资料」；其他页面一律显示「编辑」 */
export function partnerArchiveEditActionLabel(subject: PartnerSubject): "编辑" | "补全资料" {
  if (subject.archiveMenu !== "货主信息") {
    return "编辑"
  }
  return isArchiveRequiredFieldsPending(subject) ? "补全资料" : "编辑"
}

/** 表单保存前：按菜单校验必填（返回字段级错误文案） */
export function validateArchiveMenuRequiredFields(input: {
  archiveMenu: PartnerArchiveMenuLabel
  subjectType: SubjectType
  name: string
  idNumber: string
  contactPhone: string
  agentName?: string
  agentIdNumber?: string
  certAddressFull?: string
}): Record<string, string> {
  const draft: PartnerSubject = {
    id: "draft",
    archiveMenu: input.archiveMenu,
    partnerNo: "",
    name: input.name,
    subjectType: input.subjectType,
    idNumber: input.idNumber,
    idNumberMasked: "",
    certAddress: {
      province: "",
      city: "",
      district: "",
      detail: "",
      fullAddress: input.certAddressFull ?? "",
    },
    contactPhone: input.contactPhone,
    agentName: input.agentName,
    agentIdNumber: input.agentIdNumber,
    status: "NORMAL",
    roles: [],
    source: "MANUAL",
    createDate: "",
    createTime: "",
    createdBy: "",
    updateTime: "",
    associatedDocs: [],
    auditLogs: [],
  }

  const gaps = collectArchiveRequiredGaps(draft)
  const errors: Record<string, string> = {}

  for (const gap of gaps) {
    switch (gap) {
      case "name":
        errors.name = "请输入主体名称"
        break
      case "idNumber":
        errors.idNumber =
          input.subjectType === "INDIVIDUAL"
            ? "请输入18位居民身份证号"
            : "请输入18位统一社会信用代码"
        break
      case "contactPhone":
        errors.contactPhone =
          input.subjectType === "INDIVIDUAL"
            ? "请输入11位手机号码"
            : "请输入11位联系电话（经办人手机）"
        break
      case "agentName":
        errors.agentName = "请输入经办人姓名"
        break
      case "agentIdNumber":
        errors.agentIdNumber = "请输入18位经办人身份证号"
        break
      case "certAddress":
        errors.detailAddress = "请补全证件登记地址"
        break
      default:
        break
    }
  }

  if (gaps.includes("contactPhone") && input.contactPhone.trim() && !PHONE_PATTERN.test(input.contactPhone.trim())) {
    errors.contactPhone = "请输入11位大陆标准有效手机号码（用于接收短信验证码）"
  }

  return errors
}
