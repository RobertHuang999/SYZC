import type { PartnerArchiveFilters } from "./types"

export const PAGE_SIZE = 10

export const PARTNER_ARCHIVE_LIST_PATH = "/用户中心/合作方管理/合作方档案"

/** 筛选项下拉：value 与展示均为中文（对齐订单/设备预警配置） */
export const PARTNER_SUBJECT_TYPE_FILTER_OPTIONS = ["全部", "个人", "企业"] as const
export const PARTNER_ROLE_TYPE_FILTER_OPTIONS = [
  "全部",
  "货主",
  "提货经办人",
  "接收方",
  "资金方",
] as const
export const PARTNER_SUBJECT_STATUS_FILTER_OPTIONS = ["全部", "正常", "冻结"] as const
export const PARTNER_ROLE_STATUS_FILTER_OPTIONS = [
  "全部",
  "待补全",
  "待生效",
  "正常",
  "冻结",
  "失效",
] as const
export const PARTNER_SOURCE_FILTER_OPTIONS = [
  "全部",
  "人工建档",
  "C端认证",
  "单据沉淀",
] as const

export const DEFAULT_PARTNER_ARCHIVE_FILTERS: PartnerArchiveFilters = {
  keyword: "",
  contactPhone: "",
  subjectType: "全部",
  roleType: "全部",
  subjectStatus: "全部",
  roleStatus: "全部",
  source: "全部",
  createTimeStart: "",
  createTimeEnd: "",
}

export const PARTNER_FORM_SUBJECT_TYPE_OPTIONS = ["个人", "企业"] as const
