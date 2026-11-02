export type InventoryViewMode = "repo" | "goods" | "owner"

export interface InventoryManagementFilters {
  viewMode: InventoryViewMode
  startDate: string
  endDate: string
  warehouseName: string
  goodsCategory: string
  goodsVariety: string
  goodsSpec: string
  ownerName: string
}

export interface RepoViewRow {
  warehouseId: string
  warehouseName: string
  warehouseType: string
  warehouseManager: string
  warehouseAddress: string
  warehousePhone: string
  varietyCount: number
  totalQuantity: number
  availableQuantity: number
  frozenQuantity: number
  totalValue: number | null
  periodInQuantity: number
  periodOutQuantity: number
  hasUnpricedGoods?: boolean
}

export interface GoodsViewRow {
  goodsId: string
  category: string
  variety: string
  specification: string
  unit: string
  unitPrice: number | null
  totalQuantity: number
  availableQuantity: number
  frozenQuantity: number
  totalValue: number | null
  periodInQuantity: number
  periodOutQuantity: number
  pricingNote?: string
}

export interface OwnerViewRow {
  ownerId: string
  ownerName: string
  ownerType: "1" | "2"
  identifierMasked: string
  contactPhoneMasked: string
  totalQuantity: number
  availableQuantity: number
  frozenQuantity: number
  totalValue: number | null
  periodInQuantity: number
  periodOutQuantity: number
  hasUnpricedGoods?: boolean
}

export interface ExportRecordItem {
  id: string
  fileName: string
  viewDimension: string
  filterSummary: string
  recordCount: number
  fileSize: string
  creator: string
  creatorOrg: string
  createTime: string
  status: "SUCCESS" | "GENERATING" | "FAILED"
  downloadUrl?: string
}

