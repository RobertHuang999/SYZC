import type { InboundRecordDetailTabKey } from "@prototype/shared/inbound/inbound-record-detail-ui-labels"
import { withInboundRecordDetailTabQuery } from "@prototype/shared/inbound/inbound-record-detail-nav"
import type { InboundFlowStatusFilter } from "./types"

export const WORKSPACE_ROUTE = "/m/workspace"
export const TASKS_ROUTE = "/m/tasks"
export const INBOUND_LIST_ROUTE = "/m/workspace/inbound-records"
export const INBOUND_INITIATE_ROUTE = "/m/inbound/initiate"
export const INBOUND_INITIATE_GOODS_ROUTE = "/m/inbound/initiate/goods"

/** 从步骤二返回步骤一时携带，允许恢复 Session 草稿（P03） */
export const INBOUND_INITIATE_RESUME_STATE = {
  resumeInboundDraft: true,
} as const

export function inboundDetailRoute(id: string, tab?: InboundRecordDetailTabKey) {
  const base = `/m/workspace/inbound-records/${id}`
  if (!tab) return base
  return withInboundRecordDetailTabQuery(base, tab)
}

export const FLOW_STATUS_LABEL: Record<
  Exclude<InboundFlowStatusFilter, "全部">,
  string
> = {
  PENDING: "待审核",
  PROCESSING: "审核中",
  APPROVED: "已通过",
  REJECTED: "未通过",
  WITHDRAWN: "已撤销",
}

export const FLOW_STATUS_FILTER_OPTIONS: InboundFlowStatusFilter[] = [
  "全部",
  "PENDING",
  "PROCESSING",
  "APPROVED",
  "REJECTED",
  "WITHDRAWN",
]

export const MOBILE_INBOUND_TYPES = [
  "普通入库",
  "质押入库",
  "抵押入库",
  "监管服务入库",
  "仓单入库",
] as const
