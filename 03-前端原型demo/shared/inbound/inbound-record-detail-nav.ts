import type { InboundRecordDetailTabKey } from "./inbound-record-detail-ui-labels"

export const INBOUND_RECORD_DETAIL_TAB_PARAM = "tab"

const VALID_TABS: InboundRecordDetailTabKey[] = [
  "goods",
  "audit",
  "modify",
  "documents",
]

export function parseInboundRecordDetailTabParam(
  value: string | null | undefined
): InboundRecordDetailTabKey | undefined {
  if (!value) return undefined
  return VALID_TABS.includes(value as InboundRecordDetailTabKey)
    ? (value as InboundRecordDetailTabKey)
    : undefined
}

export function withInboundRecordDetailTabQuery(
  detailPath: string,
  tab: InboundRecordDetailTabKey
): string {
  const separator = detailPath.includes("?") ? "&" : "?"
  return `${detailPath}${separator}${INBOUND_RECORD_DETAIL_TAB_PARAM}=${encodeURIComponent(tab)}`
}
