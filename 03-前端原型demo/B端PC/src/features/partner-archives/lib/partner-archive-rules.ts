import type { AssociatedDocItem, PartnerSubject, RoleType, SubjectType } from "../domain/types"

const ACTIVE_DOC_STATUS = /待审批|待处理|进行中|审批中|待提货|待审核|处理中/

const ROLE_RELATED_DOC_TYPES: Record<RoleType, AssociatedDocItem["docType"][]> = {
  OWNER: ["INBOUND", "RESERVATION", "TRANSFER", "WARRANT"],
  PICKUP_AGENT: ["OUTBOUND"],
  RECEIVER: ["TRANSFER"],
  FUNDER: ["WARRANT"],
}

export function rolesAllowedForSubjectType(subjectType: SubjectType): RoleType[] {
  const common: RoleType[] = ["OWNER", "RECEIVER"]
  if (subjectType === "INDIVIDUAL") {
    return [...common, "PICKUP_AGENT"]
  }
  return [...common, "FUNDER"]
}

export function findPartnerByIdNumber(
  list: PartnerSubject[],
  idNumber: string,
  excludeId?: string
) {
  const normalized = idNumber.trim().toUpperCase()
  return list.find(
    (item) =>
      item.idNumber.trim().toUpperCase() === normalized &&
      (!excludeId || item.id !== excludeId)
  )
}

/** PA-R05：移除非货主角色前扫描在途关联业务（原型按单据状态近似） */
export function hasActiveBusinessForRole(
  partner: PartnerSubject,
  roleType: RoleType
): boolean {
  const relatedTypes = ROLE_RELATED_DOC_TYPES[roleType]
  return partner.associatedDocs.some(
    (doc) =>
      relatedTypes.includes(doc.docType) && ACTIVE_DOC_STATUS.test(doc.statusName)
  )
}

export function maskIdNumber(idNumber: string): string {
  if (idNumber.length !== 18) {
    return idNumber
  }
  return `${idNumber.slice(0, 6)}********${idNumber.slice(-4)}`
}
