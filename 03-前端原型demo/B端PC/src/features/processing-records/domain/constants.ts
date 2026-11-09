import type { ProcessingRecordFilters, ProcessingStatus, ProcessingType } from "./types"

export const PROCESSING_RECORD_LIST_PATH = "/仓储/加工管理/加工记录"
export const PROCESSING_RECORD_ADD_PATH = "/仓储/加工管理/加工记录/新增"

export function processingRecordDetailPath(id: string): string {
  return `/仓储/加工管理/加工记录/详情/${encodeURIComponent(id)}`
}

export const PAGE_SIZE = 10

/** 加工类型选项字典 */
export const PROCESSING_TYPE_OPTIONS: Array<{
  value: ProcessingType | ""
  label: string
}> = [
  { value: "", label: "全部" },
  { value: "INVENTORY", label: "存货加工" },
  { value: "PLEDGE", label: "质押加工" },
  { value: "MORTGAGE", label: "抵押加工" },
  { value: "REGULATORY_SERVICE", label: "监管服务加工" },
]

export const PROCESSING_TYPE_MAP: Record<ProcessingType, string> = {
  INVENTORY: "存货加工",
  PLEDGE: "质押加工",
  MORTGAGE: "抵押加工",
  REGULATORY_SERVICE: "监管服务加工",
}

/** 单据状态选项字典（三态收敛） */
export const PROCESSING_STATUS_OPTIONS: Array<{
  value: ProcessingStatus | ""
  label: string
}> = [
  { value: "", label: "全部" },
  { value: "PENDING_COMPLETION", label: "未完成" },
  { value: "COMPLETED", label: "已完成" },
  { value: "VOIDED", label: "作废" },
]

export const PROCESSING_STATUS_MAP: Record<
  ProcessingStatus,
  { label: string; badgeClass: string; stampClass: string }
> = {
  PENDING_COMPLETION: {
    label: "未完成",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    stampClass: "text-amber-600 border-amber-500",
  },
  COMPLETED: {
    label: "已完成",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    stampClass: "text-emerald-600 border-emerald-500",
  },
  VOIDED: {
    label: "作废",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    stampClass: "text-slate-400 border-slate-300",
  },
}

export const DEFAULT_PROCESSING_RECORD_FILTERS: ProcessingRecordFilters = {
  id: "",
  processingTimeRange: undefined,
  ownerKeyword: "",
  processingType: "",
  warehouseName: "",
  goodsKeyword: "",
  status: "",
  createBy: "",
  createTimeRange: undefined,
}

