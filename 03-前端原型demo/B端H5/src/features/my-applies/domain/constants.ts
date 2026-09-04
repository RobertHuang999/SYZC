import type { CredentialStatus, UnlockApplyStatus } from "./types"

export const MY_APPLY_LIST_PATH = "/m/my-applies"
export const CURRENT_APPLICANT_ACCOUNT = "zhang3"

export type MyApplyTabKey = "process" | "policy" | "unlock"

export const MY_APPLY_TABS: {
  key: MyApplyTabKey
  label: string
  pcLabel: string
  ready: boolean
}[] = [
  { key: "process", label: "流程申请", pcLabel: "我的流程申请", ready: false },
  { key: "policy", label: "政策资讯", pcLabel: "我的政策资讯申请", ready: false },
  { key: "unlock", label: "开锁审核", pcLabel: "我的开锁申请", ready: true },
]

export function parseMyApplyTabParam(tab: string | null): MyApplyTabKey {
  if (tab === "unlock" || tab === "unlock-applies") return "unlock"
  if (tab === "policy" || tab === "policy-news" || tab === "lease") return "policy"
  return "process"
}

export function myApplyTabSearchParam(tab: MyApplyTabKey): string {
  return tab === "unlock" ? "unlock-applies" : tab
}

export function myApplyListPathWithTab(tab: MyApplyTabKey = "process"): string {
  return `${MY_APPLY_LIST_PATH}?tab=${myApplyTabSearchParam(tab)}`
}

export const PROCESS_APPLY_FILTER_STORAGE_KEY = "SYZC_H5_MY_PROCESS_APPLY_FILTERS"
export const UNLOCK_APPLY_FILTER_STORAGE_KEY = "SYZC_H5_MY_UNLOCK_APPLY_FILTERS"

export const UNLOCK_APPLY_STATUS_LABEL: Record<UnlockApplyStatus, string> = {
  PENDING: "待审批",
  APPROVED: "已通过",
  REJECTED: "已驳回",
  WITHDRAWN: "已撤回",
  EXPIRED: "已失效",
}

export const CREDENTIAL_STATUS_LABEL: Record<CredentialStatus, string> = {
  NOT_GENERATED: "未生成",
  DELIVERED: "已下发",
  GEN_FAILED: "生成失败",
  EXPIRED: "已过期",
  SUPERSEDED: "已失效（被覆盖）",
}

export const MY_APPLY_STATUS_FILTER_OPTIONS: UnlockApplyStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "WITHDRAWN",
  "EXPIRED",
]

export const MY_CREDENTIAL_STATUS_FILTER_OPTIONS: CredentialStatus[] = [
  "NOT_GENERATED",
  "DELIVERED",
  "GEN_FAILED",
  "EXPIRED",
  "SUPERSEDED",
]

export type ProcessApplyFilters = {
  keyword: string
  dateFrom: string
  dateTo: string
}

export type UnlockTabFilters = {
  keyword: string
  dateFrom: string
  dateTo: string
  needsApproval: "全部" | "是" | "否"
  applyStatus: "全部" | UnlockApplyStatus
  credentialStatus: "全部" | CredentialStatus
}

export const DEFAULT_PROCESS_APPLY_FILTERS: ProcessApplyFilters = {
  keyword: "",
  dateFrom: "",
  dateTo: "",
}

export const DEFAULT_UNLOCK_TAB_FILTERS: UnlockTabFilters = {
  keyword: "",
  dateFrom: "",
  dateTo: "",
  needsApproval: "全部",
  applyStatus: "全部",
  credentialStatus: "全部",
}

export function loadCachedProcessApplyFilters(): ProcessApplyFilters {
  try {
    const raw = sessionStorage.getItem(PROCESS_APPLY_FILTER_STORAGE_KEY)
    if (raw) return { ...DEFAULT_PROCESS_APPLY_FILTERS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_PROCESS_APPLY_FILTERS
}

export function saveCachedProcessApplyFilters(filters: ProcessApplyFilters) {
  try {
    sessionStorage.setItem(PROCESS_APPLY_FILTER_STORAGE_KEY, JSON.stringify(filters))
  } catch {}
}

export function loadCachedUnlockTabFilters(): UnlockTabFilters {
  try {
    const raw = sessionStorage.getItem(UNLOCK_APPLY_FILTER_STORAGE_KEY)
    if (raw) return { ...DEFAULT_UNLOCK_TAB_FILTERS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_UNLOCK_TAB_FILTERS
}

export function saveCachedUnlockTabFilters(filters: UnlockTabFilters) {
  try {
    sessionStorage.setItem(UNLOCK_APPLY_FILTER_STORAGE_KEY, JSON.stringify(filters))
  } catch {}
}

/** @deprecated 旧版统一列表筛选，迁移后不再使用 */
export const MY_APPLY_FILTER_STORAGE_KEY = "SYZC_H5_MY_APPLY_FILTERS"

/** @deprecated */
export const DEFAULT_MY_APPLY_FILTERS = {
  keyword: "",
  bizType: "全部" as const,
  dateFrom: "",
  dateTo: "",
  needsApproval: "全部" as const,
}
