export type DeviceWarningStatus = "OPEN_VALID" | "OPEN_INVALID" | "CLOSED_VALID"

// 严格对齐《设备预警信息字段清单》5 大类 + 合流大类
export type DeviceWarningType =
  | "设备图像识别预警"
  | "设备物联预警"
  | "智能挂锁预警"
  | "人脸门禁预警"
  | "设备 GPS 预警"
  | "常规通行与操作事务"

export type DeviceWarningEvent = {
  eventId: string
  ruleName: string
  severityLevelId: string
  warningType: DeviceWarningType
  warningSubType: string
  severityCode: string
  severityName: string
  severityColor: string
  deviceName: string
  deviceCode: string
  location: string
  warningContent: string
  warehouseName: string
  snapshotImageStatus: "available" | "none" | "failed"
  warningTime: string
  warningStatus: DeviceWarningStatus
  /** 触发时规则处置策略快照 */
  dispositionMode: string
  /** 是否允许人工解除（R14'） */
  manualReleaseAllowed: boolean
  processedTime: string | null
  processedBy: string | null
  version: number
  invalidReason: string | null
  ruleSnapshot: {
    monitorThreshold: string
    dispositionMode: string
    upgradeStrategy: string
    ruleVersion: number
  }
  processing: {
    situationDescription: string | null
    sitePhotos: string[]
    releaseSnapshotImage: string | null
  }
}

export type DeviceWarningFilters = {
  keyword: string
  warningTypes: DeviceWarningType[]
  subTypes?: string[]
  severityLevelIds: string[]
  warningStatus: DeviceWarningStatusFilter
  warehouseName: string
  warningTimeStart: string
  warningTimeEnd: string
}

export type DeviceWarningStatusFilter = "全部" | DeviceWarningStatus

export const DEVICE_WARNING_STATUS_LABELS: Record<DeviceWarningStatus, string> = {
  OPEN_VALID: "待处置 · 有效",
  OPEN_INVALID: "已作废",
  CLOSED_VALID: "已结案 · 有效",
}
