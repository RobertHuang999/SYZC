export type RelocationOwnerType = "企业" | "个人"

export type RelocationType = "普通移库" | "质押移库" | "抵押移库"

export interface RelocationGoodsLine {
  id: string
  goodsName: string
  /** 移出位置：仓库-库房-分区 */
  outLocation: string
  /** 移出具体位置（货架/垛位） */
  outSpecific: string
  inboundTime: string
  otherInfo?: string
  barcode: string
  /** 本次移库数量 */
  quantity: number
  unit: string
  /** 该储位可用数量 */
  availableQty: number
  /** 移入库房/分区 */
  inRoomZone: string
  /** 移入具体位置 */
  inSpecific: string
}

export interface RelocationAuditNode {
  id: string
  title: string
  handlerName: string
  handleTime: string
  result: string
  comment?: string
}

export interface RelocationRecord {
  id: string
  moveTime: string
  ownerType: RelocationOwnerType
  ownerName: string
  ownerIdentifier: string
  moveType: RelocationType
  relatedNo?: string
  warehouseName: string
  goodsNameSummary: string
  totalQty: number
  unit: string
  creatorName: string
  creatorOrg: string
  createTime: string
  status: "已通过"
  remark?: string
  goods: RelocationGoodsLine[]
  photos: string[]
  auditNodes: RelocationAuditNode[]
}

export interface RelocationFilters {
  id: string
  moveStartDate: string
  moveEndDate: string
  ownerKeyword: string
  moveType: string
  warehouseName: string
  goodsName: string
  createBy: string
  createStartDate: string
  createEndDate: string
}
