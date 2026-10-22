import type { PartnerArchiveFilters } from "./types"
import {
  partnerArchiveListPath,
  PARTNER_ARCHIVE_DEFAULT_MENU,
  PARTNER_ARCHIVE_LEGACY_LIST_PREFIX,
} from "@prototype/shared/partner-archives/partner-archive-routes"

export const PAGE_SIZE = 10

/** 默认货主信息列表；详情/表单返回列表请用 `partnerArchiveBaseFromPathname` */
export const PARTNER_ARCHIVE_LIST_PATH = partnerArchiveListPath(PARTNER_ARCHIVE_DEFAULT_MENU)

/** @deprecated 6.3 废止单页；保留供存量深链重定向 */
export const PARTNER_ARCHIVE_LEGACY_LIST_PATH = PARTNER_ARCHIVE_LEGACY_LIST_PREFIX

/** 筛选项下拉：value 与展示均为中文（对齐订单/设备预警配置） */
export const PARTNER_SUBJECT_TYPE_FILTER_OPTIONS = ["全部", "个人", "企业"] as const
/** 6.3 列表由 archiveMenu 隐式分域，不再提供业务角色筛（字段清单 8.2） */
export const PARTNER_ROLE_TYPE_FILTER_OPTIONS = ["全部", "货主", "提货经办人", "资金方", "服务方"] as const
export const PARTNER_SUBJECT_STATUS_FILTER_OPTIONS = ["全部", "正常", "冻结"] as const
export const PARTNER_OWNER_SUBJECT_STATUS_FILTER_OPTIONS = ["全部", "正常", "待补全", "冻结"] as const

/** 主体状态筛选项：货主信息、提货人信息含「待补全」；资金方/服务方仅「正常/冻结」 */
export function partnerSubjectStatusFilterOptions(menu?: string): readonly string[] {
  if (menu === "货主信息" || menu === "提货人信息") {
    return PARTNER_OWNER_SUBJECT_STATUS_FILTER_OPTIONS
  }
  return PARTNER_SUBJECT_STATUS_FILTER_OPTIONS
}

/** @deprecated 6.3 方案 B 已废止角色状态筛选，状态统一收敛至主体状态 */
export const PARTNER_ROLE_STATUS_FILTER_OPTIONS = [
  "全部",
  "正常",
  "冻结",
] as const

export const PARTNER_CONTACT_PHONE_VERIFY_FILTER_OPTIONS = [
  "全部",
  "已验证",
  "未验证",
] as const

export const DEFAULT_PARTNER_ARCHIVE_FILTERS: PartnerArchiveFilters = {
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

export const PARTNER_FORM_SUBJECT_TYPE_OPTIONS = ["个人", "企业"] as const
