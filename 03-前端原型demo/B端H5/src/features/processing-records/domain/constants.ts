import type { ProcessingStatus, ProcessingType } from "./types"

export const PROCESSING_LIST_ROUTE = "/m/workspace/processing-records"
export const WORKSPACE_ROUTE = "/m/workspace"

export function processingDetailRoute(id: string): string {
  return `${PROCESSING_LIST_ROUTE}/${encodeURIComponent(id)}`
}

export const PROCESSING_TYPE_MAP: Record<ProcessingType, string> = {
  INVENTORY: "存货加工",
  PLEDGE: "质押加工",
  MORTGAGE: "抵押加工",
  REGULATORY_SERVICE: "监管服务加工",
}

export const PROCESSING_STATUS_MAP: Record<
  ProcessingStatus,
  { label: string; badgeClass: string; tone: "amber" | "emerald" | "slate" }
> = {
  PENDING_COMPLETION: {
    label: "未完成",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    tone: "amber",
  },
  COMPLETED: {
    label: "已完成",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    tone: "emerald",
  },
  VOIDED: {
    label: "作废",
    badgeClass: "border-slate-200 bg-slate-100 text-slate-600",
    tone: "slate",
  },
}

/** 列表筛选下拉选项（与 PC 筛选项沿用同一口径） */
export const PROCESSING_TYPE_FILTER_OPTIONS = [
  { label: "全部类型", value: "全部" },
  { label: "存货加工", value: "INVENTORY" },
  { label: "质押加工", value: "PLEDGE" },
  { label: "抵押加工", value: "MORTGAGE" },
  { label: "监管服务加工", value: "REGULATORY_SERVICE" },
]

export const PROCESSING_STATUS_FILTER_OPTIONS = [
  { label: "全部状态", value: "全部" },
  { label: "未完成", value: "PENDING_COMPLETION" },
  { label: "已完成", value: "COMPLETED" },
  { label: "作废", value: "VOIDED" },
]

export function formatQty(value: number | undefined | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "—"
  return value.toLocaleString("zh-CN", { maximumFractionDigits: 3 })
}

export function formatMoney(value: number | undefined | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "—"
  return `¥ ${value.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`
}
