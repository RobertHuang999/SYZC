export interface InventoryDetailFilters {
  /** 入库单号（模糊匹配） */
  inboundOrderNo: string
  /** 入库日期（起至） */
  inboundDateStart: string
  inboundDateEnd: string
  /** 货主名称 / 标识（模糊匹配） */
  ownerKeyword: string
  /** 入库类型（下拉单选） */
  inboundType: string
  /** 仓库名称（仓库 / 库房 / 分区 三级级联） */
  warehouseKeys: string[]
  /** 货品名称（大类 / 品类 / 规格 三级级联） */
  goodsKeys: string[]
  /** 货品状态（下拉单选） */
  goodsStatus: string
  /** 制单人（下拉单选） */
  creator: string
  /** 制单时间（起至） */
  createTimeStart: string
  createTimeEnd: string
  /** 仅查看有库存的（可用数量或冻结数量大于 0） */
  onlyInStock: boolean
  // 穿透锁定标志
  lockedField?: "warehouse" | "goods" | "owner" | null
  lockedValue?: string | null
}
