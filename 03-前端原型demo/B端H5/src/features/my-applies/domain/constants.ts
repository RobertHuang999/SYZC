import type { CredentialStatus, MyApplyFilters, UnlockApplyStatus } from "./types"

export const MY_APPLY_LIST_PATH = "/m/my-applies"
export const MY_APPLY_FILTER_STORAGE_KEY = "SYZC_H5_MY_APPLY_FILTERS"
export const CURRENT_APPLICANT_ACCOUNT = "zhang3"

export const UNLOCK_APPLY_STATUS_LABEL: Record<UnlockApplyStatus, string> = {
  PENDING: "待审批",
  APPROVED: "已通过",
  REJECTED: "已驳回",
  WITHDRAWN: "已撤回",
  EXPIRED: "已失效",
  VOIDED: "已作废",
}

export const CREDENTIAL_STATUS_LABEL: Record<CredentialStatus, string> = {
  NOT_GENERATED: "未生成",
  GENERATING: "生成中",
  GENERATED: "已生成",
  DELIVERED: "已下发",
  GEN_FAILED: "生成失败",
  DELIVERY_FAILED: "下发失败",
  USED: "已使用",
  EXPIRED: "已过期",
  REVOKED: "已撤销",
  SUPERSEDED: "已失效（被覆盖）",
}

export const DEFAULT_MY_APPLY_FILTERS: MyApplyFilters = {
  keyword: "",
  bizType: "全部",
  dateFrom: "",
  dateTo: "",
  needsApproval: "全部",
}

export function loadCachedMyApplyFilters(): MyApplyFilters {
  try {
    const raw = sessionStorage.getItem(MY_APPLY_FILTER_STORAGE_KEY)
    if (raw) return { ...DEFAULT_MY_APPLY_FILTERS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_MY_APPLY_FILTERS
}

export function saveCachedMyApplyFilters(filters: MyApplyFilters) {
  try {
    sessionStorage.setItem(MY_APPLY_FILTER_STORAGE_KEY, JSON.stringify(filters))
  } catch {}
}

export const DEFAULT_UNLOCK_APPLY_FILTERS = {
  keyword: "",
  status: "全部" as const,
}
