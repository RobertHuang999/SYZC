export const COLLATERAL_WARNING_TYPES = [
  "解抵/质押/监管超时",
  "价格下跌",
  "盘点异常",
  "巡检异常",
  "抵/质押率异常",
  "贷中风控预警",
  "物联穿透告警",
] as const

export type CollateralWarningType = (typeof COLLATERAL_WARNING_TYPES)[number]

export const WARNING_SOURCES = [
  "订单配置触发",
  "物联穿透",
  "历史",
] as const

export type WarningSource = (typeof WARNING_SOURCES)[number]

export type SnapshotImageStatus = "available" | "none" | "failed"

export type PublicityStatus = "未公示" | "已公示"

export const WARNING_STATUS = {
  OPEN_VALID: "OPEN_VALID",
  OPEN_INVALID: "OPEN_INVALID",
  CLOSED_VALID: "CLOSED_VALID",
} as const

export type WarningStatus =
  (typeof WARNING_STATUS)[keyof typeof WARNING_STATUS]

export type CollateralWarningEvent = {
  eventId: string
  orderNo: string
  warningType: CollateralWarningType
  severityLevelId: string
  severityCode: string
  severityName: string
  severityColor: string
  warningSource: WarningSource
  warningContent: string
  snapshotImageStatus: SnapshotImageStatus
  warningTime: string
  processedTime: string | null
  publicityStatus: PublicityStatus
  processedBy: string | null
  warningStatus: WarningStatus
  deviceEventId: string | null
}

export type WarningStatusFilter =
  | "全部"
  | "未处理（有效）"
  | "未处理（无效）"
  | "已处理（有效）"

export type PublicityStatusFilter = "全部" | "未公示" | "已公示"

export type WarningSourceFilter = "全部" | WarningSource

export type CollateralWarningFilters = {
  orderNo: string
  warningTypes: CollateralWarningType[]
  severityLevelIds: string[]
  warningSource: WarningSourceFilter
  warningStatus: WarningStatusFilter
  publicityStatus: PublicityStatusFilter
  warningTimeStart: string
  warningTimeEnd: string
}

export type CollateralRowAction =
  | "release"
  | "viewDevice"
  | "publish"
  | "detail"

export type CollateralDetailHeaderAction =
  | "back"
  | "release"
  | "viewDevice"
  | "publish"

export type CollateralPenetrationInfo = {
  triggerDevice: string
  physicalSubType: string
  triggerLocation: string
  relatedEventNo: string
  relatedEventId: string
}

export type CollateralDisposalInfo = {
  situationDescription: string
  sitePhotos: string[]
  releaseSnapshotImage: string | null
}

export type CollateralWarningEventDetailExtension = {
  orderType: "抵/质押" | "监管"
  ruleName: string
  triggerSnapshot: string | null
  snapshotImageUrl: string | null
  invalidReason: string | null
  penetrationInfo: CollateralPenetrationInfo | null
  disposalInfo: CollateralDisposalInfo | null
}

export type CollateralWarningEventDetail = CollateralWarningEvent &
  CollateralWarningEventDetailExtension
