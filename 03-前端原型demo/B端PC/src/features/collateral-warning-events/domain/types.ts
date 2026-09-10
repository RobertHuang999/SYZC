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
] as const

export const ARCHIVE_WARNING_SOURCES = [
  "历史",
] as const

export type WarningSource =
  | (typeof WARNING_SOURCES)[number]
  | (typeof ARCHIVE_WARNING_SOURCES)[number]

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
  | "待处置 · 有效"
  | "已作废"
  | "已结案 · 有效"

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

export type CollateralCargoSnapshot = {
  cargoCategory: string // 货物大类
  cargoName: string // 货物品类
  cargoSpecification: string // 货物规格
  cargoQuantity: string // 货物在押数量
  storageLocation: string // 仓库及货位
}

export type CollateralOrderSnapshot = {
  orderType: "抵/质押" | "监管"
  ownerCompany: string // 货主企业名称
  cargoItems: CollateralCargoSnapshot[] // 货物、数量与库位的逐项快照
  collateralValue: string // 质物评估货值
  loanBalance: string // 贷款余额/敞口
}

export type CollateralTriggerSnapshot = {
  metricName: string // 监控指标名称
  triggerValue: string // 触发时刻实际采集值
  thresholdValue: string // 预警设定阈值
  deviation: string // 偏离/超标说明
  ruleVersion: string // 判定规则版本
}

export type CollateralWarningEventDetailExtension = {
  orderType: "抵/质押" | "监管"
  ruleName: string
  version: number // 乐观锁版本号，对齐字段清单第四章 Version
  orderSnapshot: CollateralOrderSnapshot
  triggerSnapshot: CollateralTriggerSnapshot | null
  snapshotImageUrl: string | null
  invalidReason: string | null
  penetrationInfo: CollateralPenetrationInfo | null
  disposalInfo: CollateralDisposalInfo | null
}

export type CollateralWarningEventDetail = CollateralWarningEvent &
  CollateralWarningEventDetailExtension
