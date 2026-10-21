/** PC 侧栏 · 用户中心 → 合作方档案 四子菜单路径（6.3 方案 B） */
export const PARTNER_ARCHIVE_MENU_LABELS = [
  "货主信息",
  "提货人信息",
  "资金方信息",
  "服务方信息",
] as const

export type PartnerArchiveMenuLabel = (typeof PARTNER_ARCHIVE_MENU_LABELS)[number]

export const PARTNER_ARCHIVE_DEFAULT_MENU: PartnerArchiveMenuLabel = "货主信息"

export const PARTNER_ARCHIVE_LEGACY_LIST_PREFIX = "/用户中心/合作方管理/合作方档案"

const PARTNER_ARCHIVE_GROUP_PREFIX = "/用户中心/合作方档案"

export function partnerArchiveListPath(
  menu: PartnerArchiveMenuLabel = PARTNER_ARCHIVE_DEFAULT_MENU,
): string {
  return `${PARTNER_ARCHIVE_GROUP_PREFIX}/${menu}`
}

export function partnerArchiveDetailPath(
  menu: PartnerArchiveMenuLabel,
  id: string,
): string {
  return `${partnerArchiveListPath(menu)}/详情/${id}`
}

export function partnerArchiveAddPath(menu: PartnerArchiveMenuLabel): string {
  return `${partnerArchiveListPath(menu)}/新增`
}

export function partnerArchiveEditPath(
  menu: PartnerArchiveMenuLabel,
  id: string,
): string {
  return `${partnerArchiveListPath(menu)}/编辑/${id}`
}

export function parsePartnerArchiveMenuFromPathname(
  pathname: string,
): PartnerArchiveMenuLabel {
  const decoded = decodeURIComponent(pathname)
  for (const menu of PARTNER_ARCHIVE_MENU_LABELS) {
    if (decoded.includes(`${PARTNER_ARCHIVE_GROUP_PREFIX}/${menu}`)) {
      return menu
    }
  }
  if (decoded.includes(PARTNER_ARCHIVE_LEGACY_LIST_PREFIX)) {
    return PARTNER_ARCHIVE_DEFAULT_MENU
  }
  return PARTNER_ARCHIVE_DEFAULT_MENU
}

export function partnerArchiveBaseFromPathname(pathname: string): string {
  return partnerArchiveListPath(parsePartnerArchiveMenuFromPathname(pathname))
}

export const partnerArchiveSidebarItems = PARTNER_ARCHIVE_MENU_LABELS.map((label) => ({
  label,
  path: partnerArchiveListPath(label),
}))
