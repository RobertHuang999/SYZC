import type { OutboundRecordDetailTabKey } from "./outbound-record-detail-ui-labels"

export const OUTBOUND_RECORD_DETAIL_TAB_PARAM = "tab"

const VALID_TABS: OutboundRecordDetailTabKey[] = [
  "goods",
  "pickup",
  "audit",
  "documents",
]

export function parseOutboundRecordDetailTabParam(
  value: string | null | undefined
): OutboundRecordDetailTabKey | undefined {
  if (!value) return undefined
  return VALID_TABS.includes(value as OutboundRecordDetailTabKey)
    ? (value as OutboundRecordDetailTabKey)
    : undefined
}

export function withOutboundRecordDetailTabQuery(
  detailPath: string,
  tab: OutboundRecordDetailTabKey
): string {
  const separator = detailPath.includes("?") ? "&" : "?"
  return `${detailPath}${separator}${OUTBOUND_RECORD_DETAIL_TAB_PARAM}=${encodeURIComponent(tab)}`
}
