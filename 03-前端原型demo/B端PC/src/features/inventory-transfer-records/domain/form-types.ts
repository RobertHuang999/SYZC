import type { TransferType } from "./types"

export type OwnerType = "ENTERPRISE" | "PERSONAL"

export interface TransferStockCandidate {
  id: string
  warehouseId: string
  warehouseName: string
  roomZone: string // 仓库-库房-分区
  specificLocation: string // 具体货位/垛位
  goodsName: string
  cateName: string
  typeName: string
  specName: string
  inboundTime: string
  productionDate?: string
  otherInfo?: string
  barcode: string
  qrCodeUrl?: string
  status: string
  availableAmount: number
  unit: string
}

export interface GoodsPickerFilterState {
  warehouseIds: string[]
  goodsCategoryIds: string[]
  sortField: "inboundTime" | "availableAmount" | "productionDate"
  sortOrder: "asc" | "desc"
}

export interface SelectedGoodsLine {
  candidateId: string
  transferAmount: number
  targetRoomZone: string
  targetSpecificLocation: string
}

export interface TransferFormGoodsItem {
  id: string
  candidateId: string
  goodsName: string
  cateName: string
  typeName: string
  specName: string
  sourceWarehouseId: string
  sourceWarehouseName: string
  sourceRoomZone: string
  sourceSpecificLocation: string
  inboundTime: string
  otherInfo?: string
  barcode: string
  qrCodeUrl?: string
  availableAmount: number
  transferAmount: number
  unit: string
  targetRoomZone: string
  targetSpecificLocation: string
}

export interface TransferFormGoodsGroup {
  id: string
  goodsName: string
  warehouseId: string
  warehouseName: string
  unit: string
  details: TransferFormGoodsItem[]
  expanded: boolean
}

export interface PledgeGoodsFormItem {
  id: string
  goodsName: string
  sourceWarehouseId: string
  sourceWarehouseName: string
  sourceRoomZone: string
  sourceSpecificLocation: string
  barcode: string
  qrCodeUrl?: string
  availableAmount: number
  transferAmount: number
  unit: string
  targetRoomZone: string
  targetSpecificLocation: string
  selected: boolean
}

export interface TransferFormState {
  transferTime: string
  ownerType: OwnerType
  ownerName: string
  ownerId: string
  ownerIdentity: string
  idCardNo?: string
  transferType: TransferType
  relatedId: string
  remark: string
  normalGroups: TransferFormGoodsGroup[]
  pledgeItems: PledgeGoodsFormItem[]
  scenePhotos: string[]
}

