export type GoodsStatus = "ENABLED" | "DISABLED"

/** 入库收集项控件类型（对应字段清单 1.1 节） */
export type InboundCollectControl =
  | "select"
  | "region"
  | "text"
  | "date"
  | "period"
  | "range"
  | "number"

export type InboundCollectGroup = "货品基础类" | "生产质检类" | "仓储要求类"

export type InboundCollectItemDef = {
  key: string
  label: string
  group: InboundCollectGroup
  control: InboundCollectControl
  controlLabel: string
  unit?: string
  options?: readonly string[]
  description: string
}

export type GoodsInboundCollectConfig = {
  key: string
  label: string
  required: boolean
}

export type PriceHistoryEntry = {
  id: string
  price: number
  unit: string
  operator: string
  operatedAt: string
}

export type PriceTrendPoint = {
  date: string
  price: number
}

/** 大类（顶层分类实体） */
export type MajorCategory = {
  id: string
  name: string
  status: GoodsStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  version: number
  /** 是否存在入库业务数据（用于编辑拦截与两阶段删除） */
  hasInboundOrders: boolean
  /** 停用前的下级状态快照：键为品类/货品标识 */
  statusSnapshot?: Record<string, GoodsStatus>
}

/** 品类（分类中层 + 动态规格维度） */
export type Subcategory = {
  id: string
  name: string
  categoryId: string
  /** 货品规格参数维度，1~5 个 */
  specDimensions: string[]
  status: GoodsStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  version: number
  hasInboundOrders: boolean
  /** 停用前的下级货品状态快照 */
  statusSnapshot?: Record<string, GoodsStatus>
}

/** 货品（SKU 主档） */
export type GoodsSku = {
  id: string
  subcategoryId: string
  specValues: Record<string, string>
  measureParam: string
  measureUnit: string
  inboundCollect: GoodsInboundCollectConfig[]
  /** 参考单价（元），按元录入并保留 2 位小数 */
  price?: number
  status: GoodsStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  version: number
  hasInboundOrders: boolean
  priceHistory: PriceHistoryEntry[]
  priceTrend: PriceTrendPoint[]
}

export type MajorCategoryFilter = {
  name: string
  status: "" | GoodsStatus
}

export type SubcategoryFilter = {
  categoryId: string
  name: string
  status: "" | GoodsStatus
}

export type PriceDisplayUnit = "YUAN" | "WAN"
