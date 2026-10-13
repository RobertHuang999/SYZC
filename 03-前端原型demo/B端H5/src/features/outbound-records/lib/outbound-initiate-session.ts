import type { OwnerCandidate, RelatedOrderItem } from "../mock/outbound-form.mock"

export interface OutboundGoodsItem {
  id: string
  goodsName: string
  categoryName: string
  specName: string
  locationPath: string
  availableAmount: number
  unit: string
  barcode: string
  extraInfo: string
  selected: boolean
  outboundAmount: number
}

export interface OutboundFormState {
  owner: OwnerCandidate
  outboundType: "普通出库" | "仓单出库" | "质押出库" | "抵押出库"
  warehouseName: string
  relatedOrder: RelatedOrderItem | null
  pickupType: "个人" | "企业"
  pickupName: string
  pickupPhone: string
  pickupIdCard: string
  pickupPlateNo: string
  pickupOperator: string
  sitePhotos: string[]
  notes: string
  goodsList: OutboundGoodsItem[]
}

const SESSION_KEY = "syzc.outbound.initiate.form"

export function loadOutboundInitiateForm(): OutboundFormState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OutboundFormState
  } catch {
    return null
  }
}

export function saveOutboundInitiateForm(form: OutboundFormState): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(form))
}

export function clearOutboundInitiateForm(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
