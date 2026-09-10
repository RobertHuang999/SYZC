import type { WarningStatus } from "./types"

export const WARNING_STATUS_LABELS: Record<WarningStatus, string> = {
  OPEN_VALID: "待处置 · 有效",
  OPEN_INVALID: "已作废",
  CLOSED_VALID: "已结案 · 有效",
}

export const WARNING_STATUS_BADGE_CLASS: Record<WarningStatus, string> = {
  OPEN_VALID:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-300",
  OPEN_INVALID:
    "border-border bg-muted text-muted-foreground",
  CLOSED_VALID:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-300",
}

export function mapStatusFilterToValue(
  filter: "全部" | "待处置 · 有效" | "已作废" | "已结案 · 有效"
): WarningStatus | "ALL" {
  switch (filter) {
    case "待处置 · 有效":
      return "OPEN_VALID"
    case "已作废":
      return "OPEN_INVALID"
    case "已结案 · 有效":
      return "CLOSED_VALID"
    default:
      return "ALL"
  }
}

export type WarningStatusFilter =
  | "全部"
  | "待处置 · 有效"
  | "已作废"
  | "已结案 · 有效"

/** 将旧版押品预警筛选缓存迁移到统一状态词表。 */
export function normalizeWarningStatusFilter(
  value: unknown
): WarningStatusFilter {
  switch (value) {
    case "未处理（有效）":
      return "待处置 · 有效"
    case "未处理（无效）":
      return "已作废"
    case "已处理（有效）":
      return "已结案 · 有效"
    case "全部":
    case "待处置 · 有效":
    case "已作废":
    case "已结案 · 有效":
      return value
    default:
      return "待处置 · 有效"
  }
}
