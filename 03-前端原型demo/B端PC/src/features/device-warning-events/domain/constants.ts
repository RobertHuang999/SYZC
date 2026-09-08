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
  "常规通行与操作事务": [
    "获取密码成功",
    "获取密码失败",
    "密码认证成功",
    "密码认证失败",
    "人脸认证成功",
    "人脸认证失败",
    "蓝牙开锁成功",
    "蓝牙关锁成功",
    "远程开锁成功",
    "远程关锁成功",
  ],
}
