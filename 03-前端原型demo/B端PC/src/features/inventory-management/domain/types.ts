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

export type InventoryExportSourceMenu = "存货管理" | "库存明细" | "库存流水"

export type InventoryCrossExportTargetId =
  | "STAT_REPO"
  | "STAT_GOODS"
  | "STAT_OWNER"
  | "DETAIL"
  | "FLOW"

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
  /** 6.3 组合导出（服务端审计字段，导出记录弹窗不展示） */
  exportKind?: "combined" | "legacy"
  contentSummary?: string
  sourceMenu?: InventoryExportSourceMenu
  selectedTargets?: InventoryCrossExportTargetId[]
  /** 6.3 跨菜单时为 true，文件名为 .zip */
  crossMenuPackaged?: boolean
}

