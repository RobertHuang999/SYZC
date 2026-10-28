export type GoodsStatus = "ENABLED" | "DISABLED"

/** 保质期固定单位（来自 07 字段池白名单） */
export type ShelfLifeUnit = "DAY" | "MONTH" | "YEAR"

/**
 * 货品级入库收集项配置。
 * 只保存「货品自己的决定」：引用了哪个收集项、是否必填、保质期固定单位与建议默认数值。
 * 名称、控件类型、单位标签、下拉选项一律实时读取 07 字段池，不在货品端复制一份。
 */
export type GoodsInboundCollectConfig = {
  /** 引用 07 字段池的字段 ID */
  fieldId: string
  required: boolean
  /** 保质期专属：该货品的固定单位 */
  shelfLifeUnit?: ShelfLifeUnit
  /** 保质期专属：建议默认数值（正整数 1~9999） */
  suggestedValue?: string
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

/** 入库收集项标准控件类型（对应字段清单 6.1 节） */
export type InboundCollectControlType =
  | "周期组合项"
  | "日期选择器"
  | "单行文本输入框"
  | "下拉单选框"
  | "数字区间框"
  | "百分比数值框"
  | "省市区三级联动"

/** 入库收集项配置实体 */
export type InboundCollectFieldConfig = {
  id: string
  /** 收集项名称，租户内全局唯一，2~30 字符 */
  name: string
  /** 控件类型 */
  controlType: InboundCollectControlType
  /** 度量单位 / 选项摘要（如“支持: 月 / 天 / 年”、“℃”、“%”、“A级优等品, B级合格品”、“—”） */
  summary: string
  /** 度量单位标签（如“℃”、“%RH”、“%”、“kg”） */
  unitLabel?: string
  /** 下拉单选框选项集合 */
  options?: string[]
  /** 输入提示（最多 50 字符） */
  placeholder?: string
  /** 说明 / 备注（最多 200 字符） */
  remark?: string
  /** 是否系统核心内置项（保质期、生产日期、过期时间等锁定控件且永久禁止删除） */
  isCore: boolean
  /**
   * 是否【保质期】专属项。
   * 判断保质期不能只看控件类型：周期组合项虽为保质期专属，但仍需免疫用户自建同名项，
   * 故用显式标识，避免自建项被误挂【配置单位】入口并改写全局白名单。
   */
  isShelfLife?: boolean
  /** 生效状态 */
  status: GoodsStatus
  /** 创建信息与审计 */
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  version: number
  /** 是否已被下游品类或货品引用（用于编辑锁定与两阶段删除阻断） */
  hasDownstreamRef: boolean
}

/** 保质期专项度量单位白名单配置（R05） */
export type ShelfLifeUnitConfig = {
  /** 允许启用【天】（适用于生鲜、冷链） */
  allowDay: boolean
  /** 允许启用【月】（适用于调味品、粮油） */
  allowMonth: boolean
  /** 允许启用【年】（适用于花椒、中药材） */
  allowYear: boolean
  /** 推荐基准单位 */
  recommendedUnit: "DAY" | "MONTH" | "YEAR"
}

export type InboundCollectFilter = {
  name: string
  controlType: string
  status: "" | GoodsStatus
  createdAtRange?: [string, string]
}

