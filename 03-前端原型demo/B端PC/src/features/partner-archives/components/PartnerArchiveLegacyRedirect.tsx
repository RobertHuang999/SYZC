import { Navigate, useLocation } from "react-router-dom"
import {
  PARTNER_ARCHIVE_DEFAULT_MENU,
  PARTNER_ARCHIVE_LEGACY_LIST_PREFIX,
  partnerArchiveListPath,
} from "@prototype/shared/partner-archives/partner-archive-routes"

/** 旧书签 `/用户中心/合作方管理/合作方档案/*` → 货主信息域同后缀路径 */
export function PartnerArchiveLegacyRedirect() {
  const { pathname, search } = useLocation()
  const suffix = pathname.startsWith(PARTNER_ARCHIVE_LEGACY_LIST_PREFIX)
    ? pathname.slice(PARTNER_ARCHIVE_LEGACY_LIST_PREFIX.length)
    : ""
  return (
    <Navigate
      to={`${partnerArchiveListPath(PARTNER_ARCHIVE_DEFAULT_MENU)}${suffix}${search}`}
      replace
    />
  )
}
