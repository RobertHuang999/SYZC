export type OwnerType = "企业货主" | "个人货主"

export type ManualInboundType =
  | "普通入库"
  | "质押入库"
  | "抵押入库"
  | "监管服务入库"
  | ""

export type StackingRow = {
  id: string
  storeroomId: string
  partitionId: string
  locationText: string
  quantity: string
}

export type GoodsLineForm = {
  id: string
  category: string
  variety: string
  spec: string
  measureValue: string
  measureUnit: string
  measureLabel: string
  extraInfo: string
  remark: string
  stackings: StackingRow[]
  sitePhotoCount: number
  supplementCount: number
}

export type InboundFormState = {
  inboundDate: string
  ownerType: OwnerType | ""
  ownerName: string
  ownerIdentifier: string
  contactPhone: string
  idCardNo: string
  inboundType: ManualInboundType
  relatedOrderNo: string
  relatedOrderLabel: string
  warehouseId: string
  storeroomIds: string[]
  remark: string
  goodsLines: GoodsLineForm[]
  isNewOwner: boolean
}

export type RelatedOrderOption = {
  id: string
  orderNo: string
  ownerName: string
  ownerIdentifierMasked: string
  goodsSummary: string[]
  mortgageTime: string
}
