/** 入库记录详情 · Tab 文案真源（PC / H5 对齐） */

export type InboundRecordDetailTabKey = "goods" | "audit" | "modify" | "documents"

export function inboundRecordDetailGoodsTabLabel(goodsLineCount: number): string {
  return `货物明细 (${goodsLineCount})`
}

export const INBOUND_RECORD_DETAIL_TAB_LABELS = {
  audit: "审核记录",
  modify: "修改记录",
  documents: "资料管理",
} as const

export function buildInboundRecordDetailTabEntries(goodsLineCount: number) {
  return [
    ["goods", inboundRecordDetailGoodsTabLabel(goodsLineCount)],
    ["audit", INBOUND_RECORD_DETAIL_TAB_LABELS.audit],
    ["modify", INBOUND_RECORD_DETAIL_TAB_LABELS.modify],
    ["documents", INBOUND_RECORD_DETAIL_TAB_LABELS.documents],
  ] as const
}
