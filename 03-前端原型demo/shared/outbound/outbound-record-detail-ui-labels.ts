/** 出库记录详情 · Tab 文案真源（PC / H5 对齐） */

export type OutboundRecordDetailTabKey = "goods" | "pickup" | "audit" | "documents"

export function outboundRecordDetailGoodsTabLabel(goodsCount: number): string {
  return `货物明细 (${goodsCount})`
}

export const OUTBOUND_RECORD_DETAIL_TAB_LABELS = {
  pickup: "提货信息",
  audit: "审核记录",
  documents: "资料管理",
} as const

/** Tab 内区块标题（与「审核记录」Tab 名一致） */
export const OUTBOUND_RECORD_DETAIL_AUDIT_SECTION_TITLE =
  OUTBOUND_RECORD_DETAIL_TAB_LABELS.audit

export function buildOutboundRecordDetailTabEntries(goodsCount: number) {
  return [
    ["goods", outboundRecordDetailGoodsTabLabel(goodsCount)],
    ["pickup", OUTBOUND_RECORD_DETAIL_TAB_LABELS.pickup],
    ["audit", OUTBOUND_RECORD_DETAIL_TAB_LABELS.audit],
    ["documents", OUTBOUND_RECORD_DETAIL_TAB_LABELS.documents],
  ] as const
}
