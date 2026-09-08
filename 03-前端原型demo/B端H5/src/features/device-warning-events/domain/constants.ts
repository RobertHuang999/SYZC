import type { DeviceWarningFilters, DeviceWarningType } from "./types"

// 设备预警标准大类（严格对齐《设备预警信息字段清单》）
export const DEVICE_WARNING_TYPES: DeviceWarningType[] = [
  "设备图像识别预警",
  "设备物联预警",
  "智能挂锁预警",
  "人脸门禁预警",
  "设备 GPS 预警",
]

export const DEVICE_WARNING_STATUS_FILTER_OPTIONS = [
  "全部",
  "OPEN_VALID",
  "OPEN_INVALID",
  "CLOSED_VALID",
] as const

export const DEVICE_WARNING_STATUS_LABEL_OPTIONS = {
  全部: "全部",
  OPEN_VALID: "待处置 · 有效",
  OPEN_INVALID: "已作废",
  CLOSED_VALID: "已结案 · 有效",
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
  subTypes: [],
  severityLevelIds: [],
  warningStatus: "OPEN_VALID",
  warehouseName: "全部",
  warningTimeStart: "2026-08-01",
  warningTimeEnd: "2026-08-21",
}

export const DEVICE_WARNING_SUB_TYPES: Record<string, string[]> = {
  设备图像识别预警: ["行人入侵", "车辆入侵", "物品形态变化", "设备离线", "设备上线"],
  设备物联预警: ["温度异常", "湿度异常", "烟感异常", "二氧化碳异常", "氧气异常", "设备离线"],
  智能挂锁预警: ["拆壳", "锁杆被剪", "非法开箱", "密码错误", "电量低于20%", "开锁通知", "关锁通知"],
  人脸门禁预警: ["门未关", "密码错误", "设备离线", "开锁通知", "关锁通知"],
  "设备 GPS 预警": ["进围栏", "出围栏", "普通限速", "怠速滞留", "路线偏离", "非法拆除", "设备离线"],
}
