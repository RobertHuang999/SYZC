export type InboundFlowStatus =
  | "PENDING"
  | "PROCESSING"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN"

export type MobileInboundRecord = {
  id: string
  orderNo: string
  ownerName: string
  ownerIdentifierMasked: string
  inboundType: string
  inboundDate: string
  warehouseName: string
  goodsSummary: string
  quantityLabel: string
  flowStatus: InboundFlowStatus
  creatorDisplay: string
  createdAt: string
  /** 与 PC 详情 Mock id 对齐（已通过单） */
  pcDetailId?: string
}

export type InboundFlowStatusFilter = InboundFlowStatus | "全部"
