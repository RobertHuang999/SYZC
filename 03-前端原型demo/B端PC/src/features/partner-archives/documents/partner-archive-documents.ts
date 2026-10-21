import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import { buildPartnerArchiveDocuments } from "@prototype/shared/partner-archives/partner-archive-documents.shared"
import { PARTNER_ARCHIVE_DEFAULT_MENU } from "@prototype/shared/partner-archives/partner-archive-routes"

export function getPartnerArchiveDocuments(
  archiveMenu: PartnerArchiveMenuLabel = PARTNER_ARCHIVE_DEFAULT_MENU,
) {
  return buildPartnerArchiveDocuments(archiveMenu)
}

/** @deprecated 请使用 getPartnerArchiveDocuments(archiveMenu) */
export const partnerArchiveDocuments = getPartnerArchiveDocuments()
