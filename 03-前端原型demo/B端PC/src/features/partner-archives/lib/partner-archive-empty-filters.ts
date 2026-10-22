import type { PartnerArchiveFilters } from "../domain/types"

export const PARTNER_ARCHIVE_EMPTY_FILTERS: PartnerArchiveFilters = {
  keyword: "",
  contactPhone: "",
  contactPhoneVerified: "全部",
  subjectType: "全部",
  roleType: "全部",
  subjectStatus: "全部",
  roleStatus: "全部",
  createTimeStart: "",
  createTimeEnd: "",
}
