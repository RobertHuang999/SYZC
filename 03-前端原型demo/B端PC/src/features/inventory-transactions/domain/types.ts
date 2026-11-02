export interface InventoryTransactionFilters {
  startDate: string
  endDate: string
  direction: "ALL" | "IN" | "OUT"
  businessType: string
  warehouseName: string
  goodsSpec: string
  ownerName: string
  orderNo: string
  // 穿透锁定标志
  lockedField?: "warehouse" | "goods" | "owner" | null
  lockedValue?: string | null
}

