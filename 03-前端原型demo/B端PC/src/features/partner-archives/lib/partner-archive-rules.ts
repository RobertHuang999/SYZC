import type {
  AssociatedDocItem,
  PartnerRoleItem,
  PartnerSubject,
  RoleStatus,
  RoleType,
  SubjectType,
} from "../domain/types"

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

/** 地址唯一比对：去空白，页面不展示比较串 */
export function normalizeCertAddress(value: string) {
  return value.replace(/[\s\u3000]/g, "")
}

/** 个人货主正常或冻结仍占活跃池（冻结不释放） */
export function individualOwnerOccupiesAddressPool(partner: PartnerSubject) {
  if (partner.subjectType !== "INDIVIDUAL") {
    return false
  }
  if (!partner.certAddress.fullAddress.trim()) {
    return false
  }
  return partner.roles.some(
    (role) =>
      role.roleType === "OWNER" &&
      (role.roleStatus === "NORMAL" || role.roleStatus === "FROZEN")
  )
}

export function findIndividualOwnerAddressConflict(
  list: PartnerSubject[],
  fullAddress: string,
  excludeId?: string
) {
  const normalized = normalizeCertAddress(fullAddress)
  if (!normalized) {
    return undefined
  }
  return list.find(
    (item) =>
      item.id !== excludeId &&
      individualOwnerOccupiesAddressPool(item) &&
      normalizeCertAddress(item.certAddress.fullAddress) === normalized
  )
}

/** 追加货主且个人证件地址为空时记为待补全，其余追加为正常 */
export function appendRoleInitialStatus(
  partner: PartnerSubject,
  roleType: RoleType
): RoleStatus {
  if (
    roleType === "OWNER" &&
    partner.subjectType === "INDIVIDUAL" &&
    !partner.certAddress.fullAddress.trim()
  ) {
    return "PENDING_COMPLETION"
  }
  return "NORMAL"
}

export function buildAppendedRole(
  partner: PartnerSubject,
  roleType: RoleType,
  now: string
): PartnerRoleItem {
  const roleStatus = appendRoleInitialStatus(partner, roleType)
  return {
    roleType,
    roleStatus,
    sourceDocType: "人工建档",
    sourceDocNo: "——",
    roleEffectiveTime: roleStatus === "NORMAL" ? now : "——",
  }
}

export function maskIdNumber(idNumber: string): string {
  if (idNumber.length !== 18) {
    return idNumber
  }
  return `${idNumber.slice(0, 6)}********${idNumber.slice(-4)}`
}
