import type { WarningStatus } from "./types"

export const WARNING_STATUS_LABELS: Record<WarningStatus, string> = {
  OPEN_VALID: "未处理（有效）",
  OPEN_INVALID: "未处理（无效）",
  CLOSED_VALID: "已处理（有效）",
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
  filter: "全部" | "未处理（有效）" | "未处理（无效）" | "已处理（有效）"
): WarningStatus | "ALL" {
  switch (filter) {
    case "未处理（有效）":
      return "OPEN_VALID"
    case "未处理（无效）":
      return "OPEN_INVALID"
    case "已处理（有效）":
      return "CLOSED_VALID"
    default:
      return "ALL"
  }
}
