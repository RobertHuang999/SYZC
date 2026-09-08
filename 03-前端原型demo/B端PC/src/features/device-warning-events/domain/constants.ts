import type { DeviceWarningEventFilters } from "./types"
import {
  WARNING_STATUS,
  WARNING_STATUS_LABELS,
} from "./status"

export const DEFAULT_FILTERS: DeviceWarningEventFilters = {
  warningTypes: [],
  severityLevelIds: [],
  warningStatus: WARNING_STATUS_LABELS[WARNING_STATUS.OPEN_VALID],
  warehouseName: "全部",
  triggerFrequency: "全部",
  firstWarningTimeStart: "",
  firstWarningTimeEnd: "",
}

export const PAGE_SIZE = 10

export const TOTAL_MOCK_COUNT = 128

export { WARNING_STATUS_FILTER_OPTIONS } from "./status"

export const TRIGGER_FREQUENCY_OPTIONS = ["全部", "高频（>5 次）"] as const
