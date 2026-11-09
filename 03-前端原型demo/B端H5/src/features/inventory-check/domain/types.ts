/**
 * 货物盘点 · H5 领域模型
 * 与 PC「16-货物盘点」三件套字段保持一致，仅做移动端展示所需的最小裁剪。
 */

export type CheckMode = "SINGLE_PERSON" | "MULTI_PERSON"
export type CheckType = "BOOK_SUMMARY" | "INVENTORY_DETAIL"

export type CheckStatus =
  | "PENDING_START" // 未开始
  | "IN_PROGRESS" // 盘点中
  | "COMPLETED" // 已盘点
  | "EXPIRED" // 已超期
  | "REVOKED" // 已撤销
  | "EXPIRED_COMPLETED" // 超期完成

export type CheckResult = "NORMAL" | "ABNORMAL" | "EMPTY"
export type AnomalyHandlingStatus = "RESOLVED" | "UNRESOLVED" | "EMPTY"
export type AnomalyItemStatus = "待处理" | "已处理" | "——"

/** 异常解除审计流水 */
export interface AnomalyResolveRecord {
  id: string
  resolveTime: string
  resolveUser: string
  remark: string
}

/** 单条货物的盘点历史节点 */
export interface CheckHistoryNode {
  id: string
  timestamp: string
  actualUser: string
  statusLabel: "异常已处理" | "正常" | "异常待处理"
  isExist: "是" | "否"
  isIntact: "是" | "否"
  isLocationMatch: "是" | "否"
  countedQty: number | "无需盘点"
  snapshotQty: number
  unit: string
  remarks?: string
  attachments?: string[]
  resolveList: AnomalyResolveRecord[]
}

/** 账面汇总明细行 */
export interface BookSummaryItem {
  id: string
  goodsName: string
  unit: string
  snapshotQty: number
  countedQty: number | "无需盘点" | null
  isExist: "是" | "否" | null
  isIntact: "是" | "否" | null
  isLocationMatch: "是" | "否" | null
  actualUser: string
  checkTime: string
  anomalyStatus: AnomalyItemStatus
  attachments: string[]
  historyList: CheckHistoryNode[]
}

/** 库存明细行 */
export interface InventoryDetailItem {
  id: string
  inventoryNo: string
  ownerName: string
  ownerCode: string
  goodsName: string
  unit: string
  snapshotQty: number
  warehouseName: string
  roomName: string
  partitionName: string
  goodsStatus: string
  barcode: string
  qrCodeUrl?: string
  countedQty: number | "无需盘点" | null
  isExist: "是" | "否" | null
  isIntact: "是" | "否" | null
  isLocationMatch: "是" | "否" | null
  actualUser: string
  checkTime: string
  anomalyStatus: AnomalyItemStatus
  attachments: string[]
  historyList: CheckHistoryNode[]
}

/** 盘点单主记录 */
export interface InventoryCheckRecord {
  id: string
  checkNo: string
  taskName: string
  startDate: string
  endDate: string
  checkMode: CheckMode
  checkType: CheckType
  plannedUserIds: string[]
  plannedUsers: string
  actualUsers: string
  warehouseId: string
  warehouseName: string
  status: CheckStatus
  result: CheckResult
  anomalyHandling: AnomalyHandlingStatus
  creatorId: string
  creatorName: string
  createdTime: string
  attachments: string[]
  remarks: string
  bookSummaryItems?: BookSummaryItem[]
  inventoryDetailItems?: InventoryDetailItem[]
}

/** 四类完成率看板 */
export interface InventoryCheckStats {
  barcodeRate: { total: number; counted: number; percentage: number }
  partitionRate: { total: number; counted: number; percentage: number }
  roomRate: { total: number; counted: number; percentage: number }
  anomalyGoodsCount: number
  anomalyBreakdown: {
    notExist: number
    damaged: number
    locationMismatch: number
    qtyMismatch: number
  }
}

/** 列表筛选条件（与 PC 字段清单 10 项一致） */
export interface CheckListFilters {
  checkNo: string
  taskName: string
  checkType: string
  warehouseName: string
  status: string
  result: string
  actualUsers: string[]
  creator: string
  startDate: string
  endDate: string
  createdStartTime: string
  createdEndTime: string
}
