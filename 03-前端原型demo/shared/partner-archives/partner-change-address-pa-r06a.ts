import type { PartnerArchiveMenuLabel } from "./partner-archive-routes"

type SubjectType = "INDIVIDUAL" | "ENTERPRISE"

export type CertAddressLike = {
  province?: string
  city?: string
  district?: string
  detail?: string
  fullAddress?: string
}

/** 主档是否已有「保存过的」证件地址（非待补全首次补录） */
export function partnerHadSavedCertAddress(cert: CertAddressLike | undefined): boolean {
  if (!cert) return false
  if (cert.fullAddress?.trim()) return true
  if (cert.detail?.trim()) return true
  return Boolean(cert.province?.trim() && cert.city?.trim())
}

/** 编辑保存前，省市区/detail 相对原值是否有变更 */
export function partnerCertAddressFieldsDiff(
  existing: CertAddressLike | undefined,
  next: CertAddressLike,
): boolean {
  if (!existing) return false
  return (
    (existing.province ?? "") !== (next.province ?? "") ||
    (existing.city ?? "") !== (next.city ?? "") ||
    (existing.district ?? "") !== (next.district ?? "") ||
    (existing.detail ?? "").trim() !== (next.detail ?? "").trim()
  )
}

/** 个人货主编辑改址（非待补全首次补地址）时，保存后走 PA-R06a 活跃池切换。 */
export function isPartnerIndividualOwnerCertAddressChange(input: {
  isEdit: boolean
  archiveMenu: PartnerArchiveMenuLabel
  subjectType: SubjectType
  existingCertAddress: CertAddressLike | undefined
  nextCertAddress: CertAddressLike
}): boolean {
  if (!input.isEdit) return false
  if (input.archiveMenu !== "货主信息" || input.subjectType !== "INDIVIDUAL") {
    return false
  }
  if (!partnerHadSavedCertAddress(input.existingCertAddress)) {
    return false
  }
  return partnerCertAddressFieldsDiff(input.existingCertAddress, input.nextCertAddress)
}
