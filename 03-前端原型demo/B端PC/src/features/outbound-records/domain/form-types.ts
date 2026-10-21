import type {
  OutboundGoodsItem,
  OutboundTypeName,
  OwnerType,
  PickupPersonType,
} from "./types"

export interface OutboundFormState {
  outboundDate: string
  ownerType: OwnerType
  ownerName: string
  ownerIdentifier: string
  contactPhone: string
  ownerIdCard: string
  /** 6.3 合作方引用 · 货主信息域 */
  ownerPartnerId: string
  type: OutboundTypeName
  relatedNo: string
  warehouseName: string
  notes: string
  goodsList: OutboundGoodsItem[]
  pickupPersonType: PickupPersonType
  pickupName: string
  pickupIdCardNo: string
  pickupPhone: string
  pickupIdentity?: string
  pickupOperator?: string
  pickupAgentPartnerId: string
  plateNo: string
  sitePhotos: string[]
}

