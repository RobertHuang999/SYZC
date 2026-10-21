import type { PartnerArchiveMenuLabel } from "./partner-archive-routes"

export type PartnerImplicitRoleCode =
  | "OWNER"
  | "PICKUP_AGENT"
  | "FUNDER"
  | "SERVICE_PROVIDER"

/** 子菜单 → 本菜单隐式业务角色（PA-R12） */
export const IMPLICIT_ROLE_BY_ARCHIVE_MENU: Record<
  PartnerArchiveMenuLabel,
  PartnerImplicitRoleCode
> = {
  货主信息: "OWNER",
  提货人信息: "PICKUP_AGENT",
  资金方信息: "FUNDER",
  服务方信息: "SERVICE_PROVIDER",
}

export function implicitRoleForArchiveMenu(
  menu: PartnerArchiveMenuLabel,
): PartnerImplicitRoleCode {
  return IMPLICIT_ROLE_BY_ARCHIVE_MENU[menu]
}

/** 子菜单简称（表单标题、FAB 等） */
export const ARCHIVE_MENU_SHORT_LABEL: Record<PartnerArchiveMenuLabel, string> = {
  货主信息: "货主",
  提货人信息: "提货人",
  资金方信息: "资金方",
  服务方信息: "服务方",
}

/** H5 列表路由 slug（字段清单 8.8.0） */
export const H5_PARTNER_ARCHIVE_LIST_SLUG: Record<PartnerArchiveMenuLabel, string> = {
  货主信息: "owner",
  提货人信息: "pickup-person",
  资金方信息: "funder",
  服务方信息: "service-provider",
}

export const H5_PARTNER_ARCHIVE_LIST_BASE = "/m/workspace/user-center/partner-archives"

export function h5PartnerArchiveListRoute(menu: PartnerArchiveMenuLabel): string {
  return `${H5_PARTNER_ARCHIVE_LIST_BASE}/${H5_PARTNER_ARCHIVE_LIST_SLUG[menu]}`
}

export function parsePartnerArchiveMenuFromH5ListPath(pathname: string): PartnerArchiveMenuLabel | null {
  const decoded = decodeURIComponent(pathname)
  for (const menu of Object.keys(H5_PARTNER_ARCHIVE_LIST_SLUG) as PartnerArchiveMenuLabel[]) {
    const slug = H5_PARTNER_ARCHIVE_LIST_SLUG[menu]
    if (decoded.includes(`${H5_PARTNER_ARCHIVE_LIST_BASE}/${slug}`)) {
      return menu
    }
  }
  if (decoded === H5_PARTNER_ARCHIVE_LIST_BASE || decoded.startsWith(`${H5_PARTNER_ARCHIVE_LIST_BASE}?`)) {
    return "货主信息"
  }
  return null
}
