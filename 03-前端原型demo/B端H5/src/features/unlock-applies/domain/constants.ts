import type { UnlockApplyStatus, CredentialStatus } from "./types"

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

export const DEFAULT_UNLOCK_APPLY_FILTERS = {
  keyword: "",
  status: "全部" as const,
}
