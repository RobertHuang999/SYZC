import { Navigate, useLocation, useParams } from "react-router-dom"
import {
  H5_PARTNER_ARCHIVE_LIST_SLUG,
  h5PartnerArchiveListRoute,
} from "@prototype/shared/partner-archives/partner-archive-domain"

const SLUGS = new Set(Object.values(H5_PARTNER_ARCHIVE_LIST_SLUG))

/** 旧 `/partner-archives` 或 `/partner-archives/:id` → 货主域 */
export function PartnerArchiveH5LegacyRedirect() {
  const { id } = useParams()
  const { search } = useLocation()
  if (id && !SLUGS.has(id)) {
    return (
      <Navigate
        to={`${h5PartnerArchiveListRoute("货主信息")}/${id}${search}`}
        replace
      />
    )
  }
  return <Navigate to={`${h5PartnerArchiveListRoute("货主信息")}${search}`} replace />
}
