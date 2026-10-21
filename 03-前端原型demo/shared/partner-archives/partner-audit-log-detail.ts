import {
  partnerCertAddressFieldsDiff,
  partnerHadSavedCertAddress,
  requiresPartnerChangeAddressReasonDialog,
  type CertAddressLike,
} from "./partner-change-address-pa-r06a"
import type { PartnerArchiveMenuLabel } from "./partner-archive-routes"

type SubjectType = "INDIVIDUAL" | "ENTERPRISE"

/** 待补全场景下首次写入证件地址（用 M03，不用 M04） */
export function isPartnerFirstTimeCertAddressFill(
  wasPendingCompletion: boolean,
  certBefore: CertAddressLike | undefined,
  certAfter: CertAddressLike,
): boolean {
  if (!wasPendingCompletion) return false
  if (partnerHadSavedCertAddress(certBefore)) return false
  return partnerCertAddressFieldsDiff(certBefore, certAfter)
}

function formatFullAddress(cert: CertAddressLike): string {
  if (cert.fullAddress?.trim()) return cert.fullAddress.trim()
  return `${cert.province ?? ""}${cert.city ?? ""}${cert.district ?? ""}${(cert.detail ?? "").trim()}`
}

/** 编辑保存时，地址相关审计子句（M03 / M04 / M05） */
export function buildPartnerAddressAuditClauses(input: {
  archiveMenu: PartnerArchiveMenuLabel
  subjectType: SubjectType
  certBefore: CertAddressLike
  certAfter: CertAddressLike
  wasPendingCompletion: boolean
  changeReason?: string
}): string[] {
  const clauses: string[] = []
  const addressDiff = partnerCertAddressFieldsDiff(input.certBefore, input.certAfter)
  if (!addressDiff) return clauses

  const newFull = formatFullAddress(input.certAfter)
  const oldFull = formatFullAddress(input.certBefore) || "——"

  if (input.changeReason?.trim()) {
    clauses.push(`变更证件登记地址为【${newFull}】，改址原因：${input.changeReason.trim()}`)
    return clauses
  }

  if (
    isPartnerFirstTimeCertAddressFill(
      input.wasPendingCompletion,
      input.certBefore,
      input.certAfter,
    )
  ) {
    clauses.push(`补全证件登记地址【${newFull}】，必填项已齐备`)
    return clauses
  }

  const paR06a = requiresPartnerChangeAddressReasonDialog({
    isEdit: true,
    archiveMenu: input.archiveMenu,
    subjectType: input.subjectType,
    existingCertAddress: input.certBefore,
    nextCertAddress: input.certAfter,
  })
  if (!paR06a) {
    clauses.push(`变更证件登记地址为【${newFull}】（原：${oldFull}）`)
  }

  return clauses
}
