import type { ContactPhoneVerifyStatus, PartnerSubject } from "../domain/types"

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

/** 详情展示：显式核验时间；C 端认证默认可用建档时间 */
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

export const CONTACT_PHONE_VERIFY_BADGE_CLASS: Record<ContactPhoneVerifyStatus, string> = {
  VERIFIED: "border-emerald-300 bg-emerald-50 text-emerald-800",
  UNVERIFIED: "border-amber-300 bg-amber-50 text-amber-800",
}
