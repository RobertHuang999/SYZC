import type { ReceiptPrintHeader } from "./receipt-print-tenant"

export interface InboundReceiptGoodsRow {
  index: number
  goodsName: string
  specModel: string
  quantityFormatted: string
  quantityNum: number
  unit: string
  batchOrExtra: string
  batchOrExtraCompact: string
  remark: string
  remarkContinuous: string
}

export interface InboundReceiptPrintData extends ReceiptPrintHeader {
  orderNo: string
  inboundDate: string
  inboundDateShort: string
  inboundDateChinese: string
  inboundType: string
  warehouseName: string
  relatedOrderNo: string
  creatorName: string
  ownerName: string
  ownerTypeLabel: string
  ownerCredentialPlain: string
  ownerPhonePlain: string
  goodsRows: InboundReceiptGoodsRow[]
  totalSpeciesCount: number
  totalQuantityFormatted: string
  totalQuantityNum: number
  totalUnit: string
  totalQuantityChineseUpper: string
  printTime: string
}

export interface OutboundReceiptGoodsRow {
  index: number
  goodsName: string
  specModel: string
  quantityFormatted: string
  quantityNum: number
  unit: string
  remarkA4: string
  remarkA5: string
  remarkContinuous: string
}

export interface OutboundReceiptPrintData extends ReceiptPrintHeader {
  orderNo: string
  outboundDate: string
  outboundDateShort: string
  outboundDateChinese: string
  outboundType: string
  warehouseName: string
  relatedOrderNo: string
  creatorName: string
  ownerName: string
  ownerTypeLabel: string
  ownerCredentialPlain: string
  ownerPhonePlain: string
  pickupPersonName: string
  pickupPhonePlain: string
  pickupIdCardPlain: string
  pickupPlateNo: string
  deliveryOrderNo: string
  deliveryMethodA4: string
  deliveryMethodCompact: string
  goodsRows: OutboundReceiptGoodsRow[]
  totalSpeciesCount: number
  totalQuantityFormatted: string
  totalQuantityNum: number
  totalUnit: string
  totalQuantityChineseUpper: string
  printTime: string
}
