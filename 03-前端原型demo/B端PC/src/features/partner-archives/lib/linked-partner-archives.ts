import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import {
  implicitRoleForArchiveMenu,
  type PartnerImplicitRoleCode,
} from "@prototype/shared/partner-archives/partner-archive-domain"
import type {
  PartnerRoleItem,
  PartnerSubject,
  LinkedPartnerArchive,
  RoleType,
} from "../domain/types"

const SUBJECT_STATUS_LABEL: Record<PartnerSubject["status"], string> = {
  NORMAL: "正常",
  FROZEN: "冻结",
}

export const ROLE_TYPE_TO_ARCHIVE_MENU: Record<
  Exclude<RoleType, "RECEIVER">,
  PartnerArchiveMenuLabel
> = {
  OWNER: "货主信息",
  PICKUP_AGENT: "提货人信息",
  FUNDER: "资金方信息",
  SERVICE_PROVIDER: "服务方信息",
}

export const ARCHIVE_MENU_TO_ROLE_TYPE: Record<
  PartnerArchiveMenuLabel,
  Exclude<RoleType, "RECEIVER">
> = {
  货主信息: "OWNER",
  提货人信息: "PICKUP_AGENT",
  资金方信息: "FUNDER",
  服务方信息: "SERVICE_PROVIDER",
}

export function otherArchiveMenus(
  current: PartnerArchiveMenuLabel,
): PartnerArchiveMenuLabel[] {
  return (Object.keys(ARCHIVE_MENU_TO_ROLE_TYPE) as PartnerArchiveMenuLabel[]).filter(
    (menu) => menu !== current,
  )
}

function roleToLinked(
  role: PartnerRoleItem,
  subject: PartnerSubject,
): LinkedPartnerArchive | null {
  if (role.roleType === "RECEIVER") {
    return null
  }
  const targetMenu = ROLE_TYPE_TO_ARCHIVE_MENU[role.roleType]
  return {
    targetMenu,
    partnerId: `${subject.partnerNo}-${targetMenu.slice(0, 2)}`,
    partnerNo: `${subject.partnerNo}-${targetMenu.slice(0, 2)}`,
    name: subject.name,
    subjectStatus: subject.status,
  }
}

/** 方案 B：同主档仅保留本菜单隐式角色，其余转为「其他合作档案」关联 */
export function normalizePartnerPlanB(subject: PartnerSubject): PartnerSubject {
  const implicit: PartnerImplicitRoleCode = implicitRoleForArchiveMenu(subject.archiveMenu)
  const implicitRole = implicit as Exclude<RoleType, "RECEIVER">

  const extraRoles = subject.roles.filter(
    (r) => r.roleType !== implicitRole && r.roleType !== "RECEIVER" && r.roleStatus !== "INVALID",
  )

  const linkedFromRoles = extraRoles
    .map((r) => roleToLinked(r, subject))
    .filter((x): x is LinkedPartnerArchive => x != null)

  const linkedPartnerArchives =
    subject.linkedPartnerArchives && subject.linkedPartnerArchives.length > 0
      ? subject.linkedPartnerArchives
      : linkedFromRoles

  const implicitRows = subject.roles.filter((r) => r.roleType === implicitRole)
  const roles: PartnerRoleItem[] =
    implicitRows.length > 0
      ? implicitRows
      : [
          {
            roleType: implicitRole,
            roleStatus: "NORMAL",
            sourceDocType: "人工建档",
            sourceDocNo: "——",
            roleEffectiveTime: subject.createTime,
          },
        ]

  return {
    ...subject,
    roles,
    linkedPartnerArchives,
  }
}

export function buildLinkedStub(
  source: PartnerSubject,
  targetMenu: PartnerArchiveMenuLabel,
): LinkedPartnerArchive {
  return {
    targetMenu,
    partnerId: `link-${source.id}-${targetMenu}`,
    partnerNo: `PA-LINK-${Date.now()}`,
    name: source.name,
    subjectStatus: "NORMAL",
  }
}

export function linkedArchiveMenuLabel(item: LinkedPartnerArchive): string {
  return item.targetMenu
}

export function formatLinkedArchiveStatus(item: LinkedPartnerArchive): string {
  return SUBJECT_STATUS_LABEL[item.subjectStatus]
}

export function appendLinkedPartnerMenus(
  source: PartnerSubject,
  targetMenus: PartnerArchiveMenuLabel[],
  auditDetail: string,
): PartnerSubject {
  const linked = source.linkedPartnerArchives ?? []
  const existingMenus = new Set(linked.map((item) => item.targetMenu))
  const stubs = targetMenus
    .filter((menu) => !existingMenus.has(menu))
    .map((menu) => buildLinkedStub(source, menu))

  if (stubs.length === 0) {
    return source
  }

  const now = new Date().toISOString().replace("T", " ").substring(0, 19)
  return normalizePartnerPlanB({
    ...source,
    linkedPartnerArchives: [...linked, ...stubs],
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        opTime: now,
        operator: "当前用户",
        actionType: "APPEND_ROLE",
        actionName: "修改合作方档案",
        detail: `修改合作方档案：${auditDetail}`,
      },
      ...source.auditLogs,
    ],
  })
}
