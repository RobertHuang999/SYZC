import type { DeviceWarningEventFilters } from "./types"

export const DEFAULT_FILTERS: DeviceWarningEventFilters = {
  warningTypes: [],
  severityLevelIds: [],
  warningStatus: "未处理（有效）",
  warehouseName: "全部",
  triggerFrequency: "全部",
  firstWarningTimeStart: "",
  firstWarningTimeEnd: "",
}

export const PAGE_SIZE = 10

export const TOTAL_MOCK_COUNT = 128

export const WARNING_STATUS_FILTER_OPTIONS = [
  "全部",
  "未处理（有效）",
  "未处理（无效）",
  "已处理（有效）",
] as const

export const TRIGGER_FREQUENCY_OPTIONS = ["全部", "高频（>5 次）"] as const
