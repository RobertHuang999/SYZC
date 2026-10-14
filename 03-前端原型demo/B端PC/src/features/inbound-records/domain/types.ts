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
  /** 6.3 暂存转正来源登记单号（仅服务端/流程关联，正式单主表不展示 REG） */
  sourceRegId?: string | null
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
  /** 多货品各行计量；详情页按行展示，不传则均分 inboundQuantity */
  goodsLineItems?: { name: string; amount: number; unit?: string }[]
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
  /** 仓库|库房 fullKey 多选；空表示全部 */
  warehouseCascadeKeys: string[]
  /** 大类-品类-规格 fullKey 多选；空表示全部 */
  goodsCascadeKeys: string[]
  creator: string
  createdAtStart: string
  createdAtEnd: string
}

export type InboundRecordRowAction = "detail" | "downloadExcel" | "downloadPdf"
export type InboundApplyRowAction = "detail" | "revoke"
