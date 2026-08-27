import type { CollateralWarningFilters } from "./types"
import { getDefaultDateRange } from "@/shared/lib/date-utils"

const defaultRange = getDefaultDateRange(30)

export const DEFAULT_FILTERS: CollateralWarningFilters = {
  orderNo: "",
  warningTypes: [],
  severityLevelIds: [],
  warningSource: "全部",
  warningStatus: "未处理（有效）",
  publicityStatus: "全部",
  warningTimeStart: defaultRange.start,
  warningTimeEnd: defaultRange.end,
}

export const PAGE_SIZE = 10

export const TOTAL_MOCK_COUNT = 56

export const WARNING_STATUS_FILTER_OPTIONS = [
  "全部",
  "未处理（有效）",
  "未处理（无效）",
  "已处理（有效）",
] as const

export const PUBLICITY_STATUS_FILTER_OPTIONS = ["全部", "未公示", "已公示"] as const

export const WARNING_SOURCE_FILTER_OPTIONS = [
  "全部",
  "订单配置触发",
  "物联穿透",
  "历史",
] as const
