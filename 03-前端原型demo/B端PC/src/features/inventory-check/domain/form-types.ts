import type { CheckMode, CheckType, BookSummaryItem, InventoryDetailItem } from "./types"

/** 新增盘点任务表单数据结构 */
export interface CheckTaskFormData {
  taskName: string
  startDate: string
  endDate: string
  checkMode: CheckMode
  plannedUserIds: string[]
  attachments: string[]
  remarks: string
  checkType: CheckType
  warehouseId: string
  warehouseName: string

  // 所选货品明细
  selectedSummaryGoods: Array<{
    id: string
    goodsName: string
    unit: string
    snapshotQty: number
  }>
  selectedDetailGoods: Array<{
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
  }>
}

/** 盘点录入单行数据状态 */
export interface CheckInputRowState {
  id: string
  countedQty: number | null
  isNoNeedCheck: boolean // 是否勾选【无需盘点】
  isExist: '是' | '否' | ''
  isIntact: '是' | '否' | ''
  isLocationMatch: '是' | '否' | ''
  attachments: string[]
}

