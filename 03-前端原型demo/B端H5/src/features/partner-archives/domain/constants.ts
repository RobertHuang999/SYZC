import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import {
  h5PartnerArchiveListRoute,
  H5_PARTNER_ARCHIVE_LIST_BASE,
  parsePartnerArchiveMenuFromH5ListPath,
} from "@prototype/shared/partner-archives/partner-archive-domain"

export { H5_PARTNER_ARCHIVE_LIST_BASE, parsePartnerArchiveMenuFromH5ListPath }

export const PARTNER_ARCHIVE_FORM_ROUTE = "/m/partner-archives/form"

export function partnerArchiveListRoute(menu: PartnerArchiveMenuLabel) {
  return h5PartnerArchiveListRoute(menu)
}

/** @deprecated 请使用 partnerArchiveListRoute(menu) */
export const PARTNER_ARCHIVE_LIST_ROUTE = h5PartnerArchiveListRoute("货主信息")

export function partnerArchiveDetailRoute(menu: PartnerArchiveMenuLabel, id: string) {
  return `${h5PartnerArchiveListRoute(menu)}/${id}`
}

export function partnerArchiveFormRoute(menu: PartnerArchiveMenuLabel, editId?: string) {
  const base = `${PARTNER_ARCHIVE_FORM_ROUTE}?archiveMenu=${encodeURIComponent(menu)}`
  if (!editId) return base
  return `${base}&edit=${encodeURIComponent(editId)}`
}
