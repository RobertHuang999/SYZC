import type {
  ContactPhoneVerifyStatus,
  PartnerSubject,
  SubjectType,
} from "../domain/types"
import { isArchiveRequiredFieldsPending } from "./archive-required-fields-pending"

export function resolveContactPhoneVerified(
  partner: PartnerSubject
): ContactPhoneVerifyStatus {
  if (partner.contactPhoneVerified) {
    return partner.contactPhoneVerified
  }
  if (partner.source === "CLIENT_AUTH") {
    return "VERIFIED"
  }
  return "UNVERIFIED"
}

export const CONTACT_PHONE_VERIFY_LABELS: Record<ContactPhoneVerifyStatus, string> = {
  VERIFIED: "已验证",
  UNVERIFIED: "未验证",
}

export function formatContactPhoneVerifiedAt(value?: string) {
  if (!value?.trim()) {
    return "——"
  }
  return value.trim()
}

/** 详情展示：显式核验时间；C端注册默认可用建档时间 */
/** 【合作方档案操作权限矩阵】(PA-P02)：详情/列表「验证联系手机」显隐（冻结且非待补全时隐藏） */
export function canShowVerifyContactPhoneAction(partner: PartnerSubject): boolean {
  if (resolveContactPhoneVerified(partner) === "VERIFIED") {
    return false
  }
  if (partner.status === "FROZEN" && !isArchiveRequiredFieldsPending(partner)) {
    return false
  }
  return true
}

export function resolveContactPhoneVerifiedAt(partner: PartnerSubject): string | undefined {
  if (partner.contactPhoneVerifiedAt?.trim()) {
    return partner.contactPhoneVerifiedAt.trim()
  }
  if (resolveContactPhoneVerified(partner) === "VERIFIED" && partner.source === "CLIENT_AUTH") {
    return partner.createTime
  }
  return undefined
}

export function markContactPhoneVerified(
  partner: { contactPhoneVerified?: ContactPhoneVerifyStatus; contactPhoneVerifiedAt?: string },
  at?: string
) {
  const stamp =
    at ?? new Date().toISOString().replace("T", " ").substring(0, 19)
  partner.contactPhoneVerified = "VERIFIED"
  partner.contactPhoneVerifiedAt = stamp
}

/**
 * 编辑保存前是否须短信核验（【编辑修改联系手机二元核验规则】(PA-R04a)）。
 * 联系手机仍为「未验证」时改号直接落库，不弹窗。
 */
export function requiresPartnerEditPhoneSmsVerify(input: {
  isEdit: boolean
  existing?: PartnerSubject | null
  hasPhoneDiff: boolean
  hasAgentDiff: boolean
  subjectType: SubjectType
  /** PC 已验证企业展开【调整经办人信息】后改经办人 */
  adjustAgentMode?: boolean
}): boolean {
  if (!input.isEdit || !input.existing) {
    return false
  }
  if (resolveContactPhoneVerified(input.existing) !== "VERIFIED") {
    return false
  }
  if (input.hasPhoneDiff) {
    return true
  }
  if (
    input.subjectType === "ENTERPRISE" &&
    input.adjustAgentMode &&
    input.hasAgentDiff
  ) {
    return true
  }
  return false
}

export const CONTACT_PHONE_VERIFY_BADGE_CLASS: Record<ContactPhoneVerifyStatus, string> = {
  VERIFIED: "border-emerald-300 bg-emerald-50 text-emerald-800",
  UNVERIFIED: "border-amber-300 bg-amber-50 text-amber-800",
}
