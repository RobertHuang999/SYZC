export type InboundFlowStatus =
  | "PENDING"
  | "PROCESSING"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN"

export type MobileStorageLocation = {
  locationName: string
  quantityLabel: string
  qrCodeNo: string
}

export type MobileInboundRecord = {
  id: string
  orderNo: string
  ownerName: string
  ownerIdentifierMasked: string
  inboundType: string
  inboundDate: string
  warehouseName: string
  goodsSummary: string
  /** 与 PC `goodsNames` 一致，多货品详情/清单弹层 */
  goodsNames: string[]
  /** 多货品时种类数，用于列表「等 N 种」 */
  goodsKindCount?: number
  quantityLabel: string
  /** 主计量单位，与详情 totalQuantityLabel 一致 */
  unit?: string
  flowStatus: InboundFlowStatus
  creatorDisplay: string
  createdAt: string
  /** 仅查看未打印二维码订单开关对应标志 */
  hasUnprintedQrCode?: boolean
  /** 关联单号 */
  relatedOrderNo?: string
  /** 备注信息 */
  remarks?: string
  /** 保质期 */
  shelfLife?: string
  /** 垛位/堆放位置明细 */
  storageLocations?: MobileStorageLocation[]
  /** 现场照片 */
  photoUrls?: string[]
  /** 与 PC 详情 Mock id 对齐（已通过单） */
  pcDetailId?: string
}

export type InboundFlowStatusFilter = InboundFlowStatus | "全部"
