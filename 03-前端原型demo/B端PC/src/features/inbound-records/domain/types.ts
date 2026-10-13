import type { InboundTypeLabel } from "./constants"

/** 入库申请列表单据（对齐 store-apply.vue） */
export type InboundApply = {
  id: string
  orderNo: string
  ownerName: string
  ownerType: "1" | "2"
  ownerMobile?: string
  ownerNo?: string
  ownerIdentifierMasked: string
  cateName: string
  typeName: string
  concatAttrValue: string
  goodsSpec: string
  amount: number
  unit: string
  inboundType: string
  inboundTypeLabel: string
  repoName: string
  houseName: string
  inboundTime: string
  operator: string
  createByName: string
  createOrgName: string
  createByUserId: string
  revokedTime?: string | null
  checkStatus: 0 | 1 | 2 | 3 | 4
  fromSource: string
}

/** 入库记录列表单据（已通过归档台账，对齐 store-records.vue） */
export type InboundRecord = {
  id: string
  orderNo: string
  ownerName: string
  ownerType: "1" | "2"
  ownerIdentifierMasked: string
  inboundType: InboundTypeLabel
  inboundDate: string
  warehouseName: string
  houseName?: string
  relatedOrderNo: string | null
  /** 列表首项 + tooltip 展示全部 */
  goodsNames: string[]
  inboundQuantity: number
  unit: string
  creatorDisplay: string
  createByName: string
  createOrgName: string
  createdAt: string
  checkStatus: 2
}

export type InboundApplyFilters = {
  ownerKeyword: string
  checkStatus: string
}

export type InboundRecordFilters = {
  orderNo: string
  inboundDateStart: string
  inboundDateEnd: string
  ownerKeyword: string
  inboundType: InboundTypeLabel | "全部"
  warehouseName: string
  goodsSpec: string
  creator: string
  createdAtStart: string
  createdAtEnd: string
}

export type InboundRecordRowAction = "detail" | "downloadExcel" | "downloadPdf"
export type InboundApplyRowAction = "detail" | "revoke"
