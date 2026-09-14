import type { DeviceWarningEventFilters } from "./types"
import {
  WARNING_STATUS,
  WARNING_STATUS_LABELS,
} from "./status"
import { DEVICE_WARNING_SUB_TYPES } from "../../device-warning-configs/domain/constants"

export const DEFAULT_FILTERS: DeviceWarningEventFilters = {
  warningTypes: [],
  subTypes: [],
  severityLevelIds: [],
  warningStatus: WARNING_STATUS_LABELS[WARNING_STATUS.OPEN_VALID],
  warehouseName: "全部",
  warningTimeStart: "",
  warningTimeEnd: "",
}

export const PAGE_SIZE = 10

export const TOTAL_MOCK_COUNT = 128

export { WARNING_STATUS_FILTER_OPTIONS } from "./status"

export const DEVICE_WARNING_EVENT_SUB_TYPES: Record<string, string[]> = {
  ...DEVICE_WARNING_SUB_TYPES,
}
