// 严格对齐《押品预警信息字段清单》
export const COLLATERAL_WARNING_TYPES = [
  "解抵/质押超时",
  "价格下跌",
  "盘点异常",
  "巡检异常",
  "监管业务率异常",
  "贷中风控预警",
  "物联穿透告警",
] as const

export type CollateralWarningType =
  (typeof COLLATERAL_WARNING_TYPES)[number]

export const ORDER_TYPE_OPTIONS = ["抵押", "质押", "监管服务"] as const
export type OrderType = (typeof ORDER_TYPE_OPTIONS)[number]

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

// 严格对齐字段清单：未公示、已公示、已取消
export type PublicityStatus = "未公示" | "已公示" | "已取消"

// 预警状态统一为信息侧词表：待处置、已作废、已结案
export const WARNING_STATUS = {
  OPEN_VALID: "OPEN_VALID",
  OPEN_INVALID: "OPEN_INVALID",
  CLOSED_VALID: "CLOSED_VALID",
} as const

export type WarningStatus =
  (typeof WARNING_STATUS)[keyof typeof WARNING_STATUS]

export type CollateralWarningEvent = {
  eventId: string // 预警信息唯一标识
  orderNo: string // 预警订单
  orderType?: OrderType
  ruleName?: string // 预警规则名称
  warningType: CollateralWarningType // 预警类型
  severityLevelId: string
  severityCode: string
  severityName: string
  severityColor: string
  warningSource: WarningSource // 来源渠道
  warningContent: string // 预警内容
  /** 告警触发时设备厂商自动回传的现场照片（物联穿透继承设备侧，可能多张） */
  vendorSitePhotos: string[]
  snapshotImageStatus: SnapshotImageStatus // 预警抓拍图状态
  warningTime: string // 预警时间
  processedTime: string | null // 处理时间
  publicityStatus: PublicityStatus // 是否公示
  processedBy: string | null // 处理人
  warningStatus: WarningStatus // 预警状态
  deviceEventId: string | null // 来源事件唯一标识 (若关联设备)
  invalidReason?: string | null
  disposalInfo?: CollateralDisposalInfo | null
}

export type WarningStatusFilter =
  | "全部"
  | "待处置"
  | "已作废"
  | "已结案"

export type PublicityStatusFilter = "全部" | PublicityStatus

export type WarningSourceFilter = "全部" | WarningSource

export type CollateralWarningFilters = {
  keyword: string
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
  /** 系统引用：仓库 / 库房 / 分区 */
  triggerLocation: string
  /** 设备台账用户手录安装位置 */
  installLocation: string
  relatedEventNo: string
  relatedEventId: string
}

export type CollateralDisposalInfo = {
  situationDescription: string // 情况说明
  sitePhotos: string[] // 现场照片
  releaseSnapshotImage: string | null // 解除预警抓拍图
}

export type LtvHitSnapshot = {
  hitLine: "补仓线" | "平仓线"
  triggerLtv: string
  marginCallThreshold: string
  closeOutThreshold: string
  allowedReleaseMethods: string[]
}

export type CollateralWarningEventDetailExtension = {
  orderType: OrderType
  ruleName: string // 预警规则名称
  triggerSnapshot: string | null // 触发数据快照
  snapshotImageUrl: string | null // 预警抓拍图
  invalidReason: string | null // 记录有效性/失效原因
  penetrationInfo: CollateralPenetrationInfo | null
  disposalInfo: CollateralDisposalInfo | null
  ltvHitSnapshot: LtvHitSnapshot | null
}

export type CollateralWarningEventDetail = CollateralWarningEvent &
  CollateralWarningEventDetailExtension
