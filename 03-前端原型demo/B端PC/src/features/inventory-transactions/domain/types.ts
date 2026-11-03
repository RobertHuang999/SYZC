export interface InventoryTransactionFilters {
  /** 业务单号（模糊匹配） */
  orderNo: string
  /** 业务日期（起至） */
  startDate: string
  endDate: string
  /** 货主名称 / 标识（模糊匹配） */
  ownerKeyword: string
  /** 仓库名称（仓库 / 库房 / 分区 三级级联） */
  warehouseKeys: string[]
  /** 货品名称（大类 / 品类 / 规格 三级级联） */
  goodsKeys: string[]
  /** 业务类型（下拉单选） */
  businessType: string
  /** 制单时间（起至） */
  createTimeStart: string
  createTimeEnd: string
  // 穿透锁定标志
  lockedField?: "warehouse" | "goods" | "owner" | null
  lockedValue?: string | null
}
