import type { DeviceWarningFilters, DeviceWarningType } from "./types"

// 设备预警 5 个标准大类（严格对齐《设备预警信息字段清单》）
export const DEVICE_WARNING_TYPES: DeviceWarningType[] = [
  "设备图像识别预警",
  "设备物联预警",
  "智能挂锁预警",
  "人脸门禁预警",
  "设备 GPS 预警",
]

// 预警状态（组合枚举，严格对齐《设备预警信息字段清单》）
export const DEVICE_WARNING_STATUS_FILTER_OPTIONS = [
  "全部",
  "OPEN_VALID",
  "OPEN_INVALID",
  "CLOSED_VALID",
] as const

export const DEVICE_WARNING_STATUS_LABEL_OPTIONS = {
  全部: "全部",
  OPEN_VALID: "未处理（有效）",
  OPEN_INVALID: "未处理（无效）",
  CLOSED_VALID: "已处理（有效）",
} as const

export const DEVICE_WARNING_WAREHOUSES = [
  "全部",
  "一号钢材仓",
  "二号粮油仓",
  "三号冷链仓",
  "四号化工仓",
] as const

export const DEFAULT_DEVICE_WARNING_FILTERS: DeviceWarningFilters = {
  keyword: "",
  warningTypes: [],
  severityLevelIds: [],
  warningStatus: "OPEN_VALID",
  warehouseName: "全部",
  triggerFrequency: "全部",
  firstWarningTimeStart: "2026-08-01",
  firstWarningTimeEnd: "2026-08-21",
}
