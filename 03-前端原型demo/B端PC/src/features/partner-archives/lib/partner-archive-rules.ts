import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
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
  SERVICE_PROVIDER: ["WARRANT"],
}

export function rolesAllowedForSubjectType(subjectType: SubjectType): RoleType[] {
  const common: RoleType[] = ["OWNER", "PICKUP_AGENT", "FUNDER", "SERVICE_PROVIDER"]
  if (subjectType === "INDIVIDUAL") {
    return common.filter((role) => role !== "FUNDER" && role !== "SERVICE_PROVIDER")
  }
  return common.filter((role) => role !== "PICKUP_AGENT")
}

export function findPartnerByIdNumber(
  list: PartnerSubject[],
  idNumber: string,
  excludeId?: string,
  archiveMenu?: PartnerArchiveMenuLabel,
) {
  const normalized = idNumber.trim().toUpperCase()
  return list.find(
    (item) =>
      item.idNumber.trim().toUpperCase() === normalized &&
      (!excludeId || item.id !== excludeId) &&
      (!archiveMenu || item.archiveMenu === archiveMenu),
  )
}

/** 预留：移除非货主角色前扫描在途（6.3 不提供角色移除/解除关联 UI） */
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

function ownerOccupiesAddressPool(partner: PartnerSubject) {
  if (!partner.certAddress.fullAddress.trim()) {
    return false
  }
  return partner.roles.some(
    (role) =>
      role.roleType === "OWNER" &&
      (role.roleStatus === "NORMAL" || role.roleStatus === "FROZEN")
  )
}

/** 个人货主正常或冻结仍占活跃池（冻结不释放） */
export function individualOwnerOccupiesAddressPool(partner: PartnerSubject) {
  return partner.subjectType === "INDIVIDUAL" && ownerOccupiesAddressPool(partner)
}

/** 企业货主正常或冻结仍占活跃池（与个人分池比对） */
export function enterpriseOwnerOccupiesAddressPool(partner: PartnerSubject) {
  return partner.subjectType === "ENTERPRISE" && ownerOccupiesAddressPool(partner)
}

/** 【证件登记地址防重复唯一校验与同步阻断规则】(P02) 冲突提示 */
export function ownerAddressConflictMessage(subjectType: SubjectType) {
  return subjectType === "ENTERPRISE"
    ? "已有相同证件地址，不能绑定为该货主企业"
    : "已有相同证件地址，不能绑定为该个人货主"
}

export function findOwnerAddressConflict(
  list: PartnerSubject[],
  fullAddress: string,
  subjectType: SubjectType,
  excludeId?: string
) {
  const normalized = normalizeCertAddress(fullAddress)
  if (!normalized) {
    return undefined
  }
  return list.find(
    (item) =>
      item.id !== excludeId &&
      item.subjectType === subjectType &&
      ownerOccupiesAddressPool(item) &&
      normalizeCertAddress(item.certAddress.fullAddress) === normalized
  )
}

export function findIndividualOwnerAddressConflict(
  list: PartnerSubject[],
  fullAddress: string,
  excludeId?: string
) {
  return findOwnerAddressConflict(list, fullAddress, "INDIVIDUAL", excludeId)
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

export type FreezeBlockReason = {
  canFreeze: boolean
  title?: string
  reason?: string
  detail?: string
  guide?: string
  blockingDocs: AssociatedDocItem[]
}

/**
 * 【分菜单主体冻结与在途在库前置校验规则】(PA-R02)
 * 1. 货主信息：如果在系统中有货（在库库存或在押仓单），不能冻结
 * 2. 提货人信息：名下有待提货的单据，也不能动（禁止冻结）
 * 3. 资金方/服务方信息：名下有进行中的单据时，有进行中的单据也不能冻结
 */
export function checkPartnerSubjectFreezeEligibility(
  partner: PartnerSubject
): FreezeBlockReason {
  if (partner.status === "FROZEN") {
    return {
      canFreeze: false,
      title: "主体已处于冻结状态",
      reason: "该主体当前已经是冻结状态，无需重复操作",
      detail: "如需恢复业务资格，请点击操作列的「解冻」或详情页的「解冻主体」。",
      guide: "如需调整资料，可直接点击「编辑」进行非关键字段维护。",
      blockingDocs: [],
    }
  }

  // 1. 货主信息：有货不能冻结
  if (partner.archiveMenu === "货主信息") {
    const stockDocs = (partner.associatedDocs ?? []).filter((doc) => {
      if (doc.docType === "WARRANT" && !/已解押|已注销|已作废|已关闭/.test(doc.statusName)) {
        return true
      }
      if (doc.docType === "INBOUND") {
        if (/已作废|已取消|已关闭|已出清/.test(doc.statusName)) {
          return false
        }
        if (/已完成|审批中|待审批|处理中|未出清/.test(doc.statusName)) {
          return true
        }
      }
      return false
    })

    if (stockDocs.length > 0) {
      return {
        canFreeze: false,
        title: "无法冻结该货主主体",
        reason:
          "该货主名下仍有在库或在押货物，无法执行冻结。请先办理货物出库转让或解除质押，确保名下库存清零后再行冻结。",
        detail:
          "遵循【分菜单主体冻结与在途在库前置校验规则】(PA-R02)：命中在库库存、未出清入库单或有效在押仓单时强阻断，禁止进入冻结原因录入步骤。",
        guide: "请先办理存货出库、货物转让或仓单解押/注销，待名下在库与在押清零后再点击【冻结】。",
        blockingDocs: stockDocs,
      }
    }
  }

  // 2. 提货人信息：名下有待提货的单据，也不能动
  if (partner.archiveMenu === "提货人信息") {
    const pendingPickupDocs = (partner.associatedDocs ?? []).filter(
      (doc) => doc.statusName === "待提货" || doc.statusName.includes("待提货")
    )

    if (pendingPickupDocs.length > 0) {
      return {
        canFreeze: false,
        title: "无法冻结该提货人主体",
        reason: "该提货人名下存在处于「待提货」状态的出库单据，暂不支持冻结",
        detail:
          "遵循【分菜单主体冻结与在途在库前置校验规则】(PA-R02)，为防范现场提货履约中断或身份鉴权异常，名下存在待提货单据的提货人禁止冻结。",
        guide: "请等待现场出库提货作业全部完成，或作废未执行的出库单据后再执行冻结操作。",
        blockingDocs: pendingPickupDocs,
      }
    }
  }

  // 3. 资金方信息：名下有进行中的单据时不能冻结
  if (partner.archiveMenu === "资金方信息") {
    const activeDocs = (partner.associatedDocs ?? []).filter((doc) =>
      /进行中|生效中|有效在押|审批中|待审批|待处理|处理中/.test(doc.statusName)
    )

    if (activeDocs.length > 0) {
      return {
        canFreeze: false,
        title: "无法冻结该资金方主体",
        reason: "该资金方名下存在进行中或在押中的融资业务单据，暂不支持冻结",
        detail:
          "遵循【分菜单主体冻结与在途在库前置校验规则】(PA-R02)，为保障存续抵质押担保与资方权益合规完整，进行中融资单据未结清前禁止冻结资金方。",
        guide: "请先完成抵质押单据业务结清、解押注销或等待终审结案后再执行冻结操作。",
        blockingDocs: activeDocs,
      }
    }
  }

  // 4. 服务方信息：名下有进行中的单据时不能冻结
  if (partner.archiveMenu === "服务方信息") {
    const activeDocs = (partner.associatedDocs ?? []).filter((doc) =>
      /进行中|生效中|有效在押|审批中|待审批|待处理|处理中/.test(doc.statusName)
    )

    if (activeDocs.length > 0) {
      return {
        canFreeze: false,
        title: "无法冻结该服务方主体",
        reason: "该服务方名下存在进行中或生效中的监管服务单据，暂不支持冻结",
        detail:
          "遵循【分菜单主体冻结与在途在库前置校验规则】(PA-R02)，为保障监管服务协议履约与质权人监管责任闭环，存续监管单据未结清前禁止冻结服务方。",
        guide: "请先完成监管服务单结案或协议到期终止后再执行冻结操作。",
        blockingDocs: activeDocs,
      }
    }
  }

  return {
    canFreeze: true,
    blockingDocs: [],
  }
}

