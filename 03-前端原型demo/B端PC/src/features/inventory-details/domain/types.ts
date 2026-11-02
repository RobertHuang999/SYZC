export interface InventoryDetailFilters {
  warehouseName: string
  houseName: string
  partitionName: string
  goodsCategory: string
  goodsSpec: string
  ownerName: string
  barcode: string
  status: string // ALL | NORMAL | FROZEN
  // 穿透锁定标志
  lockedField?: "warehouse" | "goods" | "owner" | null
  lockedValue?: string | null
}

