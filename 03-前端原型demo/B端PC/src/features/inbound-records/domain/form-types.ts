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
  /** 货品管理 SKU 主键；选定后带出大类/品类/动态规格与入库收集项 */
  skuId: string
  category: string
  variety: string
  /** 规格展示摘要（动态规格取值拼接，如 新疆-特级） */
  spec: string
  specValues: Record<string, string>
  collectValues: Record<string, string>
  measureValue: string
  measureUnit: string
  measureLabel: string
  /** @deprecated 已由 collectValues 承接；保留兼容旧 Mock */
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
  orderType: string
  ownerName: string
  ownerType: OwnerType
  ownerIdentifier: string
  ownerIdentifierMasked: string
  idCardNo?: string
  contactPhone?: string
  goodsSummary: string[]
  businessTime: string
  warehouseId?: string
  warehouseName?: string
  amountSummary?: string
}
