import type { WarningStatus, WarningStatusFilter } from "./status"
import type { DispositionMode } from "../../device-warning-configs/domain/disposition"

export const WARNING_TYPES = [
  "设备图像识别预警",
  "设备物联预警",
  "智能挂锁预警",
  "人脸门禁预警",
  "设备GPS预警",
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
  subType?: string
  /** 系统引用：仓库 + 库房 + 分区拼接快照 */
  warehouseDetail: string
  /** 用户手动录入的安装/触发位置描述 */
  location: string
  deviceName: string
  triggerSummary: string
  snapshotImageStatus: SnapshotImageStatus
  warningTime: string
  processedTime: string | null
  processedBy: string | null
  warningStatus: WarningStatus
  /** 所属仓库（一级），用于筛选与数据权限 */
  warehouseName: string
  /** 触发时规则处置策略快照 */
  dispositionMode: DispositionMode
  /** 是否允许人工解除（R14'） */
  manualReleaseAllowed: boolean
  version: number
}

export type { WarningStatusFilter } from "./status"

export type DeviceWarningEventFilters = {
  warningTypes: WarningType[]
  subTypes: string[]
  severityLevelIds: string[]
  warningStatus: WarningStatusFilter
  warehouseName: string
  warningTimeStart: string
  warningTimeEnd: string
}

/** 字段清单第三章 + 详情页专属展示字段 */
export type RuleConfigSnapshot = {
  dispositionMode: string
  monitorThreshold: string
  upgradeStrategy: string
  ruleVersion: number
}

export type ReleaseMaterialSnapshot = {
  situationDescription: string | null
  sitePhotos: string[]
  releaseSnapshotImage: string | null
}

export type DeviceWarningEventDetailExtension = {
  eventUuid: string
  warningSubType: string
  deviceCode: string
  invalidReason: string | null
  ruleConfigSnapshot: RuleConfigSnapshot
  releaseMaterialSnapshot: ReleaseMaterialSnapshot
  createdAt: string
  updatedAt: string
  dataSource: string
}

export type DeviceWarningEventDetail = DeviceWarningEvent &
  DeviceWarningEventDetailExtension
