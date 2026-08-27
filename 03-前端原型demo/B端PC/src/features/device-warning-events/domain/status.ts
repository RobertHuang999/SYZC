import type { WarningType } from "./types"

export const WARNING_STATUS = {
  OPEN_VALID: "OPEN_VALID",
  OPEN_INVALID: "OPEN_INVALID",
  CLOSED_VALID: "CLOSED_VALID",
} as const

export type WarningStatus =
  (typeof WARNING_STATUS)[keyof typeof WARNING_STATUS]

export const WARNING_STATUS_LABELS: Record<WarningStatus, string> = {
  [WARNING_STATUS.OPEN_VALID]: "未处理（有效）",
  [WARNING_STATUS.OPEN_INVALID]: "未处理（无效）",
  [WARNING_STATUS.CLOSED_VALID]: "已处理（有效）",
}

export const WARNING_STATUS_BADGE_CLASS: Record<WarningStatus, string> = {
  [WARNING_STATUS.OPEN_VALID]:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-300",
  [WARNING_STATUS.OPEN_INVALID]:
    "border-border bg-muted text-muted-foreground",
  [WARNING_STATUS.CLOSED_VALID]:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-300",
}

export function getWarningStatusLabel(
  status: WarningStatus,
  warningType?: WarningType
): string {
  if (
    status === WARNING_STATUS.CLOSED_VALID &&
    warningType === "常规通行与操作事务"
  ) {
    return "已处理"
  }

  return WARNING_STATUS_LABELS[status]
}

export function mapStatusFilterToValue(
  filter: "全部" | "未处理（有效）" | "未处理（无效）" | "已处理（有效）"
): WarningStatus | "ALL" {
  switch (filter) {
    case "未处理（有效）":
      return WARNING_STATUS.OPEN_VALID
    case "未处理（无效）":
      return WARNING_STATUS.OPEN_INVALID
    case "已处理（有效）":
      return WARNING_STATUS.CLOSED_VALID
    default:
      return "ALL"
  }
}
