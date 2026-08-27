// 严格对齐《押品预警信息字段清单》
export const COLLATERAL_WARNING_TYPES = [
  "解抵/质押/监管超时",
  "价格下跌",
  "图像识别异常",
  "盘点异常",
  "巡检异常",
  "物联设备",
  "智能挂锁异常",
  "抵/质押率异常",
  "人脸门禁异常",
  "GPS异常",
  "贷中风控预警",
] as const

export type CollateralWarningType = (typeof COLLATERAL_WARNING_TYPES)[number]

export const WARNING_SOURCES = [
  "订单配置触发",
  "物联穿透",
  "历史",
] as const

export type WarningSource = (typeof WARNING_SOURCES)[number]

export type SnapshotImageStatus = "available" | "none" | "failed"

// 严格对齐字段清单：未公示、已公示、已取消
export type PublicityStatus = "未公示" | "已公示" | "已取消"

// 预警状态严格对齐字段清单组合枚举：未处理（有效）、未处理（无效）、已处理（有效）
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
  ruleName?: string // 预警规则名称
  warningType: CollateralWarningType // 预警类型
  severityLevelId: string
  severityCode: string
  severityName: string
  severityColor: string
  warningSource: WarningSource // 来源渠道
  warningContent: string // 预警内容
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
  | "未处理（有效）"
  | "未处理（无效）"
  | "已处理（有效）"

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
  triggerLocation: string
  relatedEventNo: string
  relatedEventId: string
}

export type CollateralDisposalInfo = {
  situationDescription: string // 情况说明
  sitePhotos: string[] // 现场照片
  releaseSnapshotImage: string | null // 解除预警抓拍图
}

export type CollateralWarningEventDetailExtension = {
  orderType: "抵/质押" | "监管"
  ruleName: string // 预警规则名称
  triggerSnapshot: string | null // 触发数据快照
  snapshotImageUrl: string | null // 预警抓拍图
  invalidReason: string | null // 记录有效性/失效原因
  penetrationInfo: CollateralPenetrationInfo | null
  disposalInfo: CollateralDisposalInfo | null
}

export type CollateralWarningEventDetail = CollateralWarningEvent &
  CollateralWarningEventDetailExtension
