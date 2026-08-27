import type { WarningStatus } from "./status"

export const WARNING_TYPES = [
  "设备图像识别预警",
  "设备物联预警",
  "智能挂锁预警",
  "人脸门禁预警",
  "设备GPS预警",
  "常规通行与操作事务",
] as const

export type WarningType = (typeof WARNING_TYPES)[number]

export type SnapshotImageStatus = "available" | "none" | "failed"

export type SeverityLevel = {
  severityLevelId: string
  severityCode: string
  severityName: string
  severityColor: string
}

export type DeviceWarningEvent = {
  eventId: string
  ruleName: string
  severityLevelId: string
  severityCode: string
  severityName: string
  severityColor: string
  warningType: WarningType
  location: string
  deviceName: string
  triggerSummary: string
  snapshotImageStatus: SnapshotImageStatus
  firstWarningTime: string
  latestWarningTime: string
  triggerCount: number
  processedTime: string | null
  processedBy: string | null
  warningStatus: WarningStatus
  warehouseName: string
  version: number
}

export type WarningStatusFilter =
  | "全部"
  | "未处理（有效）"
  | "未处理（无效）"
  | "已处理（有效）"

export type TriggerFrequencyFilter = "全部" | "高频（>5 次）"

export type DeviceWarningEventFilters = {
  warningTypes: WarningType[]
  severityLevelIds: string[]
  warningStatus: WarningStatusFilter
  warehouseName: string
  triggerFrequency: TriggerFrequencyFilter
  firstWarningTimeStart: string
  firstWarningTimeEnd: string
}

/** 字段清单第三章 + 详情页专属展示字段 */
export type RuleConfigSnapshot = {
  monitorThreshold: string
  debounceCondition: string
  upgradeStrategy: string
}

export type ReleaseMaterialSnapshot = {
  situationDescription: string | null
  sitePhotos: string[]
  releaseSnapshotImage: string | null
}

export type DeviceWarningEventDetailExtension = {
  eventUuid: string
  warningSubType: string
  warehouseDetail: string
  deviceCode: string
  invalidReason: string | null
  debounceTrace: string | null
  ruleConfigSnapshot: RuleConfigSnapshot
  releaseMaterialSnapshot: ReleaseMaterialSnapshot
  createdAt: string
  updatedAt: string
  dataSource: string
}

export type DeviceWarningEventDetail = DeviceWarningEvent &
  DeviceWarningEventDetailExtension

/** 字段清单第三章 event_trigger_timeline（C02） */
export type TriggerTimelineEntry = {
  sequence: number
  triggeredAt: string
  collectedValue: string
  snapshotAvailable: boolean
}
