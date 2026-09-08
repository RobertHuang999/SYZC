import type { DeviceWarningConfigFilters } from "./types"

export const DEFAULT_DEVICE_WARNING_CONFIG_FILTERS: DeviceWarningConfigFilters = {
  ruleName: "",
  warningTypes: [],
  subTypes: [],
  severityLevelIds: [],
  dispositionModes: [],
  status: "全部",
}

export const DEVICE_WARNING_CONFIG_STATUS_OPTIONS = [
  "全部",
  "生效中",
  "停用",
  "已失效",
] as const

export const PAGE_SIZE = 10

/** 附录 A · 线上枚举（2026-09-07 对齐） */
export const DEVICE_WARNING_SUB_TYPES: Record<string, string[]> = {
  "设备图像识别预警": [
    "行人入侵",
    "车辆入侵",
    "物品形态变化",
    "设备离线",
    "设备上线",
    "设备移除",
  ],
  "设备物联预警": [
    "温度异常",
    "湿度异常",
    "烟感异常",
    "二氧化碳异常",
    "氧气异常",
    "设备离线",
    "设备上线",
    "设备移除",
  ],
  "智能挂锁预警": [
    "拆壳",
    "锁舌被卡",
    "锁杆被剪",
    "非法开箱",
    "拆卡报警",
    "密码错误",
    "关锁异常",
    "电量低于20%",
    "开锁通知",
    "关锁通知",
    "设备上线",
    "设备移除",
  ],
  "人脸门禁预警": [
    "门未关",
    "密码错误",
    "设备离线",
    "开锁通知",
    "关锁通知",
    "设备上线",
    "设备移除",
  ],
  "设备GPS预警": [
    "进围栏",
    "出围栏",
    "普通限速",
    "怠速滞留",
    "路线偏离",
    "非法拆除",
    "设备离线",
    "设备上线",
    "设备移除",
  ],
}

/** R14：设备上线须单独成规则 */
export function isDeviceOnlineSubType(subType: string): boolean {
  return subType === "设备上线"
}

export function getDeviceOnlineSubTypeForWarningType(warningType: string): string | undefined {
  const subs = DEVICE_WARNING_SUB_TYPES[warningType] || []
  return subs.includes("设备上线") ? "设备上线" : undefined
}
