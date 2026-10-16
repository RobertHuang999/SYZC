export const WORKSPACE_ROUTE = "/m/workspace"

export const PARTNER_ARCHIVE_LIST_ROUTE = "/m/workspace/user-center/partner-archives"
export const PARTNER_ARCHIVE_FORM_ROUTE = "/m/partner-archives/form"

export function partnerArchiveDetailPath(id: string) {
  return `${PARTNER_ARCHIVE_LIST_ROUTE}/${id}`
}

export function partnerArchiveEditPath(id: string) {
  return `${PARTNER_ARCHIVE_FORM_ROUTE}?edit=${encodeURIComponent(id)}`
}
