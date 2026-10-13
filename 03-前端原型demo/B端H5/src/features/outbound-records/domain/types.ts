export type MobileOutboundType =
  | "普通出库"
  | "仓单出库"
  | "质押出库"
  | "抵押出库"
  | "移库出库"
  | "转让出库"

export type MobileOwnerType = "企业" | "个人"

export interface MobileStockLocation {
  id: string
  locationPath: string // 例如：海霸王仓库-1号库房-A区
  specificLocation?: string
  inboundTime: string
  extraInfo?: string
  barcode: string
  status: string
  availableAmount: number
  outboundAmount: number
  unit: string
}

export interface MobileOutboundGoodsItem {
  id: string
  goodsName: string
  categoryName: string
  specName: string
  extraInfo?: string
  totalOutboundAmount: number
  unit: string
  price?: number
  selected?: boolean
  availableAmount?: number
  locationPath?: string
  warehouseName?: string
  storeroomName?: string
  partitionName?: string
  beforeAmount?: number
  afterAmount?: number
  barcode?: string
  locations?: MobileStockLocation[]
}

export interface MobileOutboundRecord {
  id: string
  orderNo: string
  ownerType: MobileOwnerType
  ownerName: string
  ownerIdentifier: string
  type: MobileOutboundType
  outboundTime: string
  warehouseName: string
  relatedNo: string
  goodsSummary: string
  goodsList: MobileOutboundGoodsItem[]
  totalAmount: number
  amountUnit: string
  categoryCount: number
  createdByName: string
  createdByOrg: string
  createTime: string
  notes?: string
  status: "已通过"
  statusCode: "APPROVED"
  pickCompleted: boolean
  pickupInfo?: {
    personType: "个人" | "企业"
    name: string
    idCardNo: string
    phone: string
    plateNo?: string
    sitePhotos: string[]
    deviceSnapshots: string[]
  }
  pickupRecord?: {
    operatorName: string
    pickupTime: string
    isSelfPickup: boolean
    notes?: string
    sitePhotos: string[]
    deviceSnapshots: string[]
  }
  auditHistory?: Array<{
    nodeName: string
    handlerName: string
    actionTime: string
    actionName: string
    comment?: string
  }>
}
