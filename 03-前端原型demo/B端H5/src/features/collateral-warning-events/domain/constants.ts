import type {
  CollateralWarningFilters,
  PublicityStatus,
  WarningStatusFilter,
} from "./types"
import { getDefaultDateRange } from "@/shared/lib/date-utils"

const defaultRange = getDefaultDateRange(30)

export const DEFAULT_FILTERS: CollateralWarningFilters = {
  keyword: "",
  warningTypes: [],
  severityLevelIds: [],
  warningSource: "全部",
  warningStatus: "待处置 · 有效",
  publicityStatus: "全部",
  warningTimeStart: defaultRange.start,
  warningTimeEnd: defaultRange.end,
}

export const PAGE_SIZE = 10

// 预警状态（组合枚举，严格对齐《押品预警信息字段清单》）
export const WARNING_STATUS_FILTER_OPTIONS: WarningStatusFilter[] = [
  "全部",
  "待处置 · 有效",
  "已作废",
  "已结案 · 有效",
]

// 是否公示（严格对齐《押品预警信息字段清单》：未公示、已公示、已取消）
export const PUBLICITY_STATUS_FILTER_OPTIONS: ("全部" | PublicityStatus)[] = [
  "全部",
  "未公示",
  "已公示",
  "已取消",
]

// 预警来源（6.2 全新仅包含订单配置触发与物联穿透，历史已归档）
export const WARNING_SOURCE_FILTER_OPTIONS = [
  "全部",
  "订单配置触发",
  "物联穿透",
] as const
