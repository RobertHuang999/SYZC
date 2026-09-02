import type { DeviceWarningConfigFilters } from "./types"

export const DEFAULT_DEVICE_WARNING_CONFIG_FILTERS: DeviceWarningConfigFilters = {
  ruleName: "",
  warningTypes: [],
  severityLevelIds: [],
  status: "全部",
}

export const DEVICE_WARNING_CONFIG_STATUS_OPTIONS = [
  "全部",
  "生效中",
  "停用",
  "已失效",
] as const

export const PAGE_SIZE = 10

export const DEVICE_WARNING_SUB_TYPES: Record<string, string[]> = {
  "设备图像识别预警": ["行人入侵", "车辆入侵", "物品形态变化", "摄像头离线", "监控设备上线"],
  "设备物联预警": ["温度异常", "湿度异常", "烟感异常", "CO2异常", "氧气异常", "物联传感器离线", "物联设备上线"],
  "智能挂锁预警": ["拆壳破坏", "剪杆破坏", "撬锁报警", "非法开箱", "低电量", "门锁离线", "门锁设备上线", "正常开关锁事务"],
  "人脸门禁预警": ["门未关超时", "密码错误", "门禁离线", "门禁设备上线", "正常刷脸通行记录"],
  "设备GPS预警": ["进出围栏", "超速", "怠速滞留", "偏离路线", "非法拆除", "GPS设备上线", "GPS离线"],
}

/** 各预警大类「设备上线」子类型（R14 互斥基准） */
export const DEVICE_ONLINE_SUB_TYPES = [
  "监控设备上线",
  "物联设备上线",
  "门锁设备上线",
  "门禁设备上线",
  "GPS设备上线",
] as const

export function isDeviceOnlineSubType(subType: string): boolean {
  return subType.endsWith("设备上线")
}

export function getDeviceOnlineSubTypeForWarningType(warningType: string): string | undefined {
  return (DEVICE_WARNING_SUB_TYPES[warningType] || []).find(isDeviceOnlineSubType)
}

const INSTANT_SUB_TYPES = [
  "剪杆破坏",
  "拆壳破坏",
  "撬锁报警",
  "非法开箱",
  "正常开关锁事务",
  "正常刷脸通行记录",
  "密码错误",
  "非法拆除",
  ...DEVICE_ONLINE_SUB_TYPES,
] as const

export function isInstantTriggerSubType(subType: string): boolean {
  return (
    isDeviceOnlineSubType(subType) ||
    (INSTANT_SUB_TYPES as readonly string[]).includes(subType)
  )
}
