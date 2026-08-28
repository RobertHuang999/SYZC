import type { UnlockApplyFilters, UnlockApplyStatus } from "./types"

export const UNLOCK_APPLY_STATUS_LABEL: Record<UnlockApplyStatus, string> = {
  PENDING: "待审批",
  APPROVED: "已通过",
  REJECTED: "已驳回",
  WITHDRAWN: "已撤回",
  EXPIRED: "已失效",
  VOIDED: "已作废",
}

export const DEFAULT_UNLOCK_APPLY_FILTERS: UnlockApplyFilters = {
  keyword: "",
  status: "待审批",
}
