import type { OutboundRecordDetailTabKey } from "@prototype/shared/outbound/outbound-record-detail-ui-labels"
import { withOutboundRecordDetailTabQuery } from "@prototype/shared/outbound/outbound-record-detail-nav"

export const WORKSPACE_ROUTE = "/m/workspace"
export const TASKS_ROUTE = "/m/tasks"
export const OUTBOUND_MGR_ROUTE = "/m/workspace/outbound-records"

export function outboundDetailRoute(id: string, tab?: OutboundRecordDetailTabKey) {
  const base = `${OUTBOUND_MGR_ROUTE}/${id}`
  if (!tab) return base
  return withOutboundRecordDetailTabQuery(base, tab)
}
export const OUTBOUND_INITIATE_ROUTE = "/m/outbound/initiate"
export const OUTBOUND_INITIATE_GOODS_ROUTE = "/m/outbound/initiate/goods"

export const MOBILE_OUTBOUND_TYPE_OPTIONS = [
  "全部",
  "普通出库",
  "仓单出库",
  "质押出库",
  "抵押出库",
  "移库出库",
  "转让出库",
] as const

export const MOBILE_MANUAL_OUTBOUND_TYPES = [
  "普通出库",
  "仓单出库",
  "质押出库",
  "抵押出库",
] as const
