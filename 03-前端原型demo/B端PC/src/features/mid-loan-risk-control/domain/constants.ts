import type { MidLoanRiskFilters } from "./types"

export const DEFAULT_FILTERS: MidLoanRiskFilters = {
  orderNo: "",
  executionStatus: "全部",
  executability: "可执行",
}

export const PAGE_SIZE = 10

export const EXECUTION_STATUS_FILTER_OPTIONS = [
  "全部",
  "未执行",
  "提交中",
  "提交成功（处理中）",
  "提交失败",
  "触发预警",
  "未触发预警",
] as const

export const EXECUTABILITY_FILTER_OPTIONS = ["全部", "可执行", "不可执行"] as const

export const EXECUTION_STATUS_BADGE_CLASS: Record<string, string> = {
  未执行: "border-border bg-muted text-muted-foreground",
  提交中: "border-blue-200 bg-blue-50 text-blue-700",
  "提交成功（处理中）": "border-blue-200 bg-blue-50 text-blue-700",
  提交失败: "border-red-200 bg-red-50 text-red-700",
  触发预警: "border-orange-200 bg-orange-50 text-orange-700",
  未触发预警: "border-green-200 bg-green-50 text-green-700",
}
