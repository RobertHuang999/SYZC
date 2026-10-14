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
  plateNo: string
  sitePhotos: string[]
}

