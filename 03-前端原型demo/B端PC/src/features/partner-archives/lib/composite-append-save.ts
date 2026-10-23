import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import type { SubjectType } from "../domain/types"
import {
  isCertAddressSaveRequired,
  isEnterpriseOnlyArchiveMenu,
  isPickupEnterpriseAgentNameRequired,
  validateArchiveMenuRequiredFields,
} from "./archive-required-fields-pending"
import {
  findOwnerAddressConflict,
  findPartnerByIdNumber,
  ownerAddressConflictMessage,
} from "./partner-archive-rules"
import { otherArchiveMenus } from "./linked-partner-archives"
import type { PartnerSubject } from "../domain/types"

export type AppendPlanAction = "CREATE_NEW" | "LINK_EXISTING"

export type AppendPlanItem = {
  targetMenu: PartnerArchiveMenuLabel
  action: AppendPlanAction
}

export type CompositePrecheckFailure = {
  scopeLabel: string
  reason: string
}

export type CompositeSaveResultLine = {
  scopeLabel: string
  outcome: "CREATED" | "LINKED"
  detail?: string
}

export type CompositeFormSnapshot = {
  archiveMenu: PartnerArchiveMenuLabel
  subjectType: SubjectType
  name: string
  idNumber: string
  contactPhone: string
  agentName: string
  agentIdNumber: string
  certAddressFull: string
}

export function appendMenusSelectableForSubjectType(
  menus: PartnerArchiveMenuLabel[],
  subjectType: SubjectType,
): PartnerArchiveMenuLabel[] {
  if (subjectType === "INDIVIDUAL") {
    return menus.filter(
      (menu) => menu !== "资金方信息" && menu !== "服务方信息",
    )
  }
  return menus
}

function appendOpenMenusBeforeSubjectFilter(
  partner: PartnerSubject,
): PartnerArchiveMenuLabel[] {
  const linked = new Set(
    (partner.linkedPartnerArchives ?? []).map((item) => item.targetMenu),
  )
  return otherArchiveMenus(partner.archiveMenu).filter((menu) => !linked.has(menu))
}

/** 列表/详情【追加合作方档案】可选目标菜单（已排除当前菜单、已关联项、个人不可选资方/服务方） */
export function appendTargetMenusForPartner(
  partner: PartnerSubject,
): PartnerArchiveMenuLabel[] {
  return appendMenusSelectableForSubjectType(
    appendOpenMenusBeforeSubjectFilter(partner),
    partner.subjectType,
  )
}

/** 个人主体因资方/服务方仅企业而无任何可追加菜单（但仍有未关联的企业专属菜单） */
export function appendTargetMenusEmptyBecauseIndividualEnterpriseOnly(
  partner: PartnerSubject,
): boolean {
  if (partner.subjectType !== "INDIVIDUAL") {
    return false
  }
  const open = appendOpenMenusBeforeSubjectFilter(partner)
  if (open.length === 0) {
    return false
  }
  return appendTargetMenusForPartner(partner).length === 0
}

function scopeLabel(menu: PartnerArchiveMenuLabel, isPrimary: boolean): string {
  return isPrimary ? `【${menu}（本页）】` : `【${menu}（追加）】`
}

function firstFieldErrorMessage(
  archiveMenu: PartnerArchiveMenuLabel,
  snapshot: CompositeFormSnapshot,
): string | undefined {
  const errors = validateArchiveMenuRequiredFields({
    archiveMenu,
    subjectType: snapshot.subjectType,
    name: snapshot.name,
    idNumber: snapshot.idNumber,
    contactPhone: snapshot.contactPhone,
    agentName: isPickupEnterpriseAgentNameRequired(
      archiveMenu,
      snapshot.subjectType,
    )
      ? snapshot.agentName
      : undefined,
    agentIdNumber:
      archiveMenu === "提货人信息" && snapshot.subjectType === "ENTERPRISE"
        ? snapshot.agentIdNumber
        : undefined,
    certAddressFull: snapshot.certAddressFull,
  })
  const first = Object.values(errors)[0]
  return first
}

function precheckTargetMenu(
  list: PartnerSubject[],
  targetMenu: PartnerArchiveMenuLabel,
  snapshot: CompositeFormSnapshot,
): CompositePrecheckFailure | null {
  if (
    snapshot.subjectType === "INDIVIDUAL" &&
    isEnterpriseOnlyArchiveMenu(targetMenu)
  ) {
    return {
      scopeLabel: scopeLabel(targetMenu, false),
      reason: "个人主体不可在资金方信息或服务方信息菜单建档",
    }
  }

  const existing = findPartnerByIdNumber(
    list,
    snapshot.idNumber,
    undefined,
    targetMenu,
  )
  if (existing) {
    return null
  }

  const requiredMsg = firstFieldErrorMessage(targetMenu, snapshot)
  if (requiredMsg) {
    return {
      scopeLabel: scopeLabel(targetMenu, false),
      reason: requiredMsg,
    }
  }

  if (targetMenu === "货主信息" && snapshot.certAddressFull.trim()) {
    const conflict = findOwnerAddressConflict(
      list,
      snapshot.certAddressFull,
      snapshot.subjectType,
    )
    if (conflict) {
      return {
        scopeLabel: scopeLabel(targetMenu, false),
        reason: ownerAddressConflictMessage(snapshot.subjectType),
      }
    }
  }

  if (
    targetMenu === "货主信息" &&
    isCertAddressSaveRequired(targetMenu, snapshot.subjectType) &&
    !snapshot.certAddressFull.trim()
  ) {
    return {
      scopeLabel: scopeLabel(targetMenu, false),
      reason: "请补全证件登记地址",
    }
  }

  return null
}

export function snapshotFromPartner(partner: PartnerSubject): CompositeFormSnapshot {
  return {
    archiveMenu: partner.archiveMenu,
    subjectType: partner.subjectType,
    name: partner.name,
    idNumber: partner.idNumber,
    contactPhone: partner.contactPhone,
    agentName: partner.agentName ?? "",
    agentIdNumber: partner.agentIdNumber ?? "",
    certAddressFull: partner.certAddress.fullAddress,
  }
}

function buildAppendTargetPlan(
  list: PartnerSubject[],
  snapshot: CompositeFormSnapshot,
  appendMenus: PartnerArchiveMenuLabel[],
): { plan: AppendPlanItem[]; failures: CompositePrecheckFailure[] } {
  const failures: CompositePrecheckFailure[] = []
  const plan: AppendPlanItem[] = []

  for (const targetMenu of appendMenus) {
    if (
      snapshot.subjectType === "INDIVIDUAL" &&
      (targetMenu === "资金方信息" || targetMenu === "服务方信息")
    ) {
      failures.push({
        scopeLabel: scopeLabel(targetMenu, false),
        reason: "个人身份不能追加至资金方或服务方（两菜单仅支持企业主体）",
      })
      continue
    }
    const existing = findPartnerByIdNumber(
      list,
      snapshot.idNumber,
      undefined,
      targetMenu,
    )
    if (existing) {
      plan.push({ targetMenu, action: "LINK_EXISTING" })
      continue
    }
    const failure = precheckTargetMenu(list, targetMenu, snapshot)
    if (failure) {
      failures.push(failure)
      continue
    }
    plan.push({ targetMenu, action: "CREATE_NEW" })
  }

  return { plan, failures }
}

/** 列表/详情【追加合作方档案】· 多选目标预检（不含本菜单新建） */
export function buildCompositeAppendPlanForRowAppend(
  list: PartnerSubject[],
  partner: PartnerSubject,
  appendMenus: PartnerArchiveMenuLabel[],
): { plan: AppendPlanItem[]; failures: CompositePrecheckFailure[] } {
  const failures: CompositePrecheckFailure[] = []

  if (partner.status === "FROZEN") {
    failures.push({
      scopeLabel: `【${partner.archiveMenu}】`,
      reason: "主体已冻结，无法追加合作方档案角色",
    })
    return { plan: [], failures }
  }

  const linked = new Set(
    (partner.linkedPartnerArchives ?? []).map((item) => item.targetMenu),
  )
  for (const menu of appendMenus) {
    if (linked.has(menu)) {
      failures.push({
        scopeLabel: scopeLabel(menu, false),
        reason: `已与【${menu}】建立关联，无需重复追加`,
      })
    }
  }
  if (failures.length > 0) {
    return { plan: [], failures }
  }

  return buildAppendTargetPlan(list, snapshotFromPartner(partner), appendMenus)
}

export function successLinesFromAppendPlan(
  plan: AppendPlanItem[],
  options?: { primaryLine?: CompositeSaveResultLine },
): CompositeSaveResultLine[] {
  const lines = options?.primaryLine ? [options.primaryLine] : []
  for (const item of plan) {
    lines.push({
      scopeLabel: `【${item.targetMenu}（追加）】`,
      outcome: item.action === "CREATE_NEW" ? "CREATED" : "LINKED",
    })
  }
  return lines
}

export function buildCompositeAppendPlan(
  list: PartnerSubject[],
  snapshot: CompositeFormSnapshot,
  appendMenus: PartnerArchiveMenuLabel[],
): { plan: AppendPlanItem[]; failures: CompositePrecheckFailure[] } {
  const failures: CompositePrecheckFailure[] = []

  const primaryDuplicate = findPartnerByIdNumber(
    list,
    snapshot.idNumber,
    undefined,
    snapshot.archiveMenu,
  )
  if (primaryDuplicate) {
    failures.push({
      scopeLabel: scopeLabel(snapshot.archiveMenu, true),
      reason: "该主体在本菜单已存在，请前往详情追加合作方档案角色",
    })
  } else {
    const primaryRequired = firstFieldErrorMessage(snapshot.archiveMenu, snapshot)
    if (primaryRequired) {
      failures.push({
        scopeLabel: scopeLabel(snapshot.archiveMenu, true),
        reason: primaryRequired,
      })
    }
    if (
      snapshot.archiveMenu === "货主信息" &&
      snapshot.certAddressFull.trim() &&
      findOwnerAddressConflict(
        list,
        snapshot.certAddressFull,
        snapshot.subjectType,
      )
    ) {
      failures.push({
        scopeLabel: scopeLabel(snapshot.archiveMenu, true),
        reason: ownerAddressConflictMessage(snapshot.subjectType),
      })
    }
  }

  const { plan, failures: appendFailures } = buildAppendTargetPlan(
    list,
    snapshot,
    appendMenus,
  )
  failures.push(...appendFailures)

  return { plan, failures }
}

export function planActionLabel(action: AppendPlanAction): string {
  return action === "CREATE_NEW" ? "新建独立主档" : "关联已有档案（不重复创建）"
}

export function resultOutcomeLabel(outcome: CompositeSaveResultLine["outcome"]): string {
  return outcome === "CREATED" ? "已新建独立主档" : "已关联已有档案"
}
