import type {
  CollateralWarningFilters,
  CollateralWarningType,
  PublicityStatus,
  WarningStatusFilter,
} from "./types"
import { getDefaultDateRange } from "@/shared/lib/date-utils"

const defaultRange = getDefaultDateRange(30)

// 押品预警 11 个标准大类（严格对齐《押品预警信息字段清单》）
export const COLLATERAL_WARNING_TYPES: CollateralWarningType[] = [
  "解抵/质押/监管超时",
  "价格下跌",
  "图像识别异常",
  "盘点异常",
  "巡检异常",
  "物联设备",
  "智能挂锁异常",
  "抵/质押率异常",
  "人脸门禁异常",
  "GPS异常",
  "贷中风控预警",
]

export const DEFAULT_FILTERS: CollateralWarningFilters = {
  keyword: "",
  warningTypes: [],
  severityLevelIds: [],
  warningSource: "全部",
  warningStatus: "未处理（有效）",
  publicityStatus: "全部",
  warningTimeStart: defaultRange.start,
  warningTimeEnd: defaultRange.end,
}

export const PAGE_SIZE = 10

// 预警状态（组合枚举，严格对齐《押品预警信息字段清单》）
export const WARNING_STATUS_FILTER_OPTIONS: WarningStatusFilter[] = [
  "全部",
  "未处理（有效）",
  "未处理（无效）",
  "已处理（有效）",
]

// 是否公示（严格对齐《押品预警信息字段清单》：未公示、已公示、已取消）
export const PUBLICITY_STATUS_FILTER_OPTIONS: ("全部" | PublicityStatus)[] = [
  "全部",
  "未公示",
  "已公示",
  "已取消",
]

// 预警来源
export const WARNING_SOURCE_FILTER_OPTIONS = [
  "全部",
  "订单配置触发",
  "物联穿透",
  "历史",
] as const
