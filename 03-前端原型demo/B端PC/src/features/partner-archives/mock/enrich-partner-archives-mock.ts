import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import type { BoundAccountInfo, PartnerSubject, RoleType } from "../domain/types"
import { normalizePartnerPlanB } from "../lib/linked-partner-archives"

export type PartnerSubjectMockInput = Omit<PartnerSubject, "archiveMenu"> & {
  archiveMenu?: PartnerArchiveMenuLabel
}

const MENU_BY_ID: Record<string, PartnerArchiveMenuLabel> = {
  "p-05": "提货人信息",
  "p-06": "提货人信息",
  "p-07": "提货人信息",
  "p-08": "资金方信息",
  "p-09": "资金方信息",
  "p-10": "服务方信息",
  "p-11": "服务方信息",
  "p-12": "货主信息",
  "p-13": "提货人信息",
  "p-14": "资金方信息",
  "p-15": "服务方信息",
}

function activeRoleTypes(subject: PartnerSubjectMockInput): RoleType[] {
  return subject.roles
    .filter((role) => role.roleStatus !== "INVALID")
    .map((role) => role.roleType)
}

function inferArchiveMenu(subject: PartnerSubjectMockInput): PartnerArchiveMenuLabel {
  if (subject.archiveMenu) {
    return subject.archiveMenu
  }
  if (MENU_BY_ID[subject.id]) {
    return MENU_BY_ID[subject.id]
  }
  const roles = activeRoleTypes(subject)
  const hasOwner = roles.includes("OWNER")
  const hasPickup = roles.includes("PICKUP_AGENT")
  const hasFunder = roles.includes("FUNDER")
  const hasService = roles.includes("SERVICE_PROVIDER")

  if (hasService && !hasOwner && !hasFunder) {
    return "服务方信息"
  }
  if (hasFunder && !hasOwner) {
    return "资金方信息"
  }
  if (hasPickup && !hasOwner) {
    return "提货人信息"
  }
  return "货主信息"
}

/** C 端注册建档默认 1:1 绑定客户账号（字段清单 Tab 3）；显式 mock 优先 */
function resolveBoundAccount(item: PartnerSubjectMockInput): BoundAccountInfo | undefined {
  if (item.boundAccount) {
    return item.boundAccount
  }
  if (item.source !== "CLIENT_AUTH") {
    return undefined
  }
  const suffix = item.partnerNo.replace(/^PA-/, "") || item.id.replace(/\D/g, "") || "000"
  return {
    accountId: `CU-${suffix}`,
    loginPhone: item.contactPhone,
    authStatus: "AUTHENTICATED",
    bindTime: item.createTime,
  }
}

export function enrichPartnerArchivesMock(raw: PartnerSubjectMockInput[]): PartnerSubject[] {
  return raw.map((item) =>
    normalizePartnerPlanB({
      ...item,
      archiveMenu: inferArchiveMenu(item),
      boundAccount: resolveBoundAccount(item),
    }),
  )
}
