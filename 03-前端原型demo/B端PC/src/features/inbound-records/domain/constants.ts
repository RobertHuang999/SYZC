import type { InboundRecordFilters, InboundApplyFilters } from "./types"

export const PAGE_SIZE = 10

/** 路由常量 */
export const INBOUND_APPLY_LIST_PATH = "/仓储/入库管理/入库申请"
export const INBOUND_RECORD_LIST_PATH = "/仓储/入库管理/入库记录"
export const INBOUND_APPLY_ADD_PATH = "/仓储/入库管理/入库申请/新增"
export const INBOUND_RECORD_ADD_PATH = "/仓储/入库管理/入库记录/新增"

export function inboundApplyDetailPath(id: string) {
  return `/仓储/入库管理/入库申请/详情/${id}`
}

export function inboundRecordDetailPath(id: string) {
  return `/仓储/入库管理/入库记录/详情/${id}`
}

/** 11yuanma 现网 12 种入库类型 */
export const INBOUND_TYPE_OPTIONS = [
  { label: "全部", value: "" },
  { label: "质押入库", value: "PLEDGE" },
  { label: "抵押入库", value: "MORTGAGE" },
  { label: "仓单入库", value: "CD" },
  { label: "退货入库", value: "RETURN" },
  { label: "转让入库", value: "ASSIGN" },
  { label: "普通入库", value: "NORMAL" },
  { label: "移库入库", value: "TRANSFER" },
  { label: "存货加工入库", value: "PROCESS" },
  { label: "质押加工入库", value: "PLEDGE_PROCESS" },
  { label: "抵押加工入库", value: "MORTGAGE_PROCESS" },
  { label: "监管服务加工入库", value: "SUPERVISION_PROCESS" },
  { label: "监管服务入库", value: "SUPERVISION_SERVICE" },
] as const

export const INBOUND_TYPE_LABELS = [
  "质押入库",
  "抵押入库",
  "仓单入库",
  "退货入库",
  "转让入库",
  "普通入库",
  "移库入库",
  "存货加工入库",
  "质押加工入库",
  "抵押加工入库",
  "监管服务加工入库",
  "监管服务入库",
] as const

export type InboundTypeLabel = (typeof INBOUND_TYPE_LABELS)[number]

export const INBOUND_TYPE_FILTER_OPTIONS: Array<InboundTypeLabel | "全部"> = [
  "全部",
  ...INBOUND_TYPE_LABELS,
]

/** 审核状态枚举与选项（对齐 store-apply.vue） */
export const CHECK_STATUS_OPTIONS = [
  { label: "全部", value: "" },
  { label: "待审核", value: "0" },
  { label: "审核中", value: "1" },
  { label: "已通过", value: "2" },
  { label: "未通过", value: "3" },
  { label: "已撤销", value: "4" },
] as const

export const CHECK_STATUS_LABEL_MAP: Record<number, string> = {
  0: "待审核",
  1: "审核中",
  2: "已通过",
  3: "未通过",
  4: "已撤销",
}

export const DEFAULT_INBOUND_RECORD_FILTERS: InboundRecordFilters = {
  orderNo: "",
  inboundDateStart: "",
  inboundDateEnd: "",
  ownerKeyword: "",
  inboundType: "全部",
  warehouseCascadeKeys: [],
  goodsCascadeKeys: [],
  creator: "全部",
  createdAtStart: "",
  createdAtEnd: "",
}

export const DEFAULT_INBOUND_APPLY_FILTERS: InboundApplyFilters = {
  ownerKeyword: "",
  checkStatus: "",
}
