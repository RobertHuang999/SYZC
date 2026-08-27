export const RISK_DISCLOSURE_WARNING_TYPES = [
  "解抵/质押/监管超时",
  "价格下跌",
  "盘点异常",
  "巡检异常",
  "抵/质押率异常",
  "贷中风控预警",
  "物联穿透告警",
  "图像识别异常",
  "物联设备",
  "智能挂锁异常",
  "人脸门禁异常",
  "GPS异常",
] as const

export type RiskDisclosureWarningType =
  (typeof RISK_DISCLOSURE_WARNING_TYPES)[number]

export type DisclosureStatus = "未公示" | "已公示" | "已取消"

export type SnapshotImageStatus = "available" | "none" | "failed"

export type RiskDisclosureRecord = {
  recordId: string
  ruleName: string
  orderNo: string
  ownerName: string
  warningType: RiskDisclosureWarningType
  warningContent: string
  snapshotImageStatus: SnapshotImageStatus
  warningTime: string
  processedTime: string
  processedBy: string
  disclosureStatus: DisclosureStatus
  lastDisclosureTime: string
  lastOperator: string
}

export type DisclosureStatusFilter = "全部" | "已公示" | "已取消"

export type RiskDisclosureFilters = {
  ruleName: string
  warningType: "全部" | RiskDisclosureWarningType
  orderNo: string
  ownerName: string
  disclosureStatus: DisclosureStatusFilter
}

export type OriginalWarningSnapshot = {
  warningType: string
  warningContent: string
  warningTime: string
  processedTime: string
  processedBy: string
  snapshotImageStatus: SnapshotImageStatus
}

export type OperationHistoryEntry = {
  action: string
  operator: string
  operatedAt: string
  remark: string | null
}

export type RiskDisclosureRecordDetailExtension = {
  disclosureTitle: string
  disclosureContent: string
  originalWarning: OriginalWarningSnapshot
  operationHistory: OperationHistoryEntry[]
  cancelReason: string | null
}

export type RiskDisclosureRecordDetail = RiskDisclosureRecord &
  RiskDisclosureRecordDetailExtension
