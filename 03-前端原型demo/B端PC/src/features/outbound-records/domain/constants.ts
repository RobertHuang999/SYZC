import type { OutboundRecordDetailTabKey } from "@prototype/shared/outbound/outbound-record-detail-ui-labels"
import { withOutboundRecordDetailTabQuery } from "@prototype/shared/outbound/outbound-record-detail-nav"
import type { OutboundRecordFilters, OutboundTypeName } from "./types"

export const OUTBOUND_RECORD_LIST_PATH = "/仓储/出库管理/出库记录"
export const OUTBOUND_RECORD_ADD_PATH = "/仓储/出库管理/出库记录/新增"
export const OUTBOUND_RECORD_DETAIL_PREFIX = "/仓储/出库管理/出库记录/详情"
export function outboundRecordDetailPath(id: string, tab?: OutboundRecordDetailTabKey) {
  const base = `${OUTBOUND_RECORD_DETAIL_PREFIX}/${id}`
  if (!tab) return base
  return withOutboundRecordDetailTabQuery(base, tab)
}

export const PAGE_SIZE = 10

/** 台账收录出库类型选项（6类实际入账 + 2类仅加工流水） */
export const OUTBOUND_TYPE_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "全部", value: "全部" },
  { label: "普通出库", value: "普通出库" },
  { label: "仓单出库", value: "仓单出库" },
  { label: "质押出库", value: "质押出库" },
  { label: "抵押出库", value: "抵押出库" },
  { label: "移库出库", value: "移库出库" },
  { label: "转让出库", value: "转让出库" },
  { label: "质押加工出库", value: "质押加工出库" },
  { label: "抵押加工出库", value: "抵押加工出库" },
]

/** 新增页手工/关联可选出库类型（严禁手工选择移库出库和转让出库） */
export const MANUAL_OUTBOUND_TYPE_OPTIONS: OutboundTypeName[] = [
  "普通出库",
  "仓单出库",
  "质押出库",
  "抵押出库",
]

export const DEFAULT_OUTBOUND_RECORD_FILTERS: OutboundRecordFilters = {
  orderNo: "",
  outboundStartDate: "",
  outboundEndDate: "",
  ownerKeyword: "",
  type: "全部",
  warehouseName: "全部",
  goodsName: "",
  createdBy: "全部",
  createStartDate: "",
  createEndDate: "",
}
