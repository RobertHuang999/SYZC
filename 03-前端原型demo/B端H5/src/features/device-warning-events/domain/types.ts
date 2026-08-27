export type DeviceWarningStatus = "OPEN_VALID" | "OPEN_INVALID" | "CLOSED_VALID"

// 严格对齐《设备预警信息字段清单》5大类
export type DeviceWarningType =
  | "设备图像识别预警"
  | "设备物联预警"
  | "智能挂锁预警"
  | "人脸门禁预警"
  | "设备 GPS 预警"

export type DeviceWarningFrequency = "全部" | "高频（>5 次）"

export type DeviceWarningEvent = {
  eventId: string // 预警信息唯一标识
  ruleName: string // 预警规则名称
  severityLevelId: string
  warningType: DeviceWarningType // 预警类型（大类）
  warningSubType: string // 预警子类型
  severityCode: string
  severityName: string
  severityColor: string
  deviceName: string // 设备系统内名称
  deviceCode: string // 设备编码
  location: string // 仓库、库房及分区位置
  warningContent: string // 预警内容
  warehouseName: string // 仓库名称
  snapshotImageStatus: "available" | "none" | "failed" // 预警抓拍图状态
  firstWarningTime: string // 首次触发时间
  latestWarningTime: string // 预警时间（最新触发时间）
  triggerCount: number // 累计触发频次
  warningStatus: DeviceWarningStatus // 预警状态
  version: number
  invalidReason: string | null // 记录有效性/失效原因
  triggerHistory: string[]
  ruleSnapshot: {
    monitorThreshold: string // 监控阈值快照
    debounceCondition: string // 防抖条件
    upgradeStrategy: string // 升级策略
  }
  processing: {
    processedTime: string | null // 处理时间
    processedBy: string | null // 处理人
    situationDescription: string | null // 情况说明
    sitePhotos: string[] // 现场照片
    releaseSnapshotImage: string | null // 解除预警抓拍图
  }
}

export type DeviceWarningFilters = {
  keyword: string
  warningTypes: DeviceWarningType[]
  severityLevelIds: string[]
  warningStatus: DeviceWarningStatusFilter
  warehouseName: string
  triggerFrequency: DeviceWarningFrequency
  firstWarningTimeStart: string
  firstWarningTimeEnd: string
}

export type DeviceWarningStatusFilter = "全部" | DeviceWarningStatus

// 组合枚举严格对齐《设备预警信息字段清单》
export const DEVICE_WARNING_STATUS_LABELS: Record<DeviceWarningStatus, string> = {
  OPEN_VALID: "未处理（有效）",
  OPEN_INVALID: "未处理（无效）",
  CLOSED_VALID: "已处理（有效）",
}
