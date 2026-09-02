import type {
  ApplyStatusFilter,
  CredentialStatus,
  MyUnlockApplyFilters,
  UnlockApplyFilters,
  UnlockApplyStatus,
} from "./types"

export const LIST_BASE_PATH = "/工作中心/审批中心/其他审批/开锁审核"
export const MY_APPLY_LIST_PATH = "/工作中心/审批中心/我的申请管理"
export const APPROVAL_CENTER_PATH = "/工作中心/审批中心"
export const CURRENT_APPLICANT_ACCOUNT = "zhang3"
export const PAGE_SIZE = 10

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
  DELIVERED: "已下发",
  GEN_FAILED: "生成失败",
  EXPIRED: "已过期",
  SUPERSEDED: "已失效（被覆盖）",
}

export const REASON_OPTIONS = ["全部", "出库", "入库", "移库", "参观", "其他"] as const

export const WAREHOUSE_OPTIONS = [
  "全部",
  "华东一号仓",
  "华南二号仓",
  "华北三号仓",
  "西南四号仓",
] as const

export const APPLY_STATUS_FILTER_OPTIONS: ApplyStatusFilter[] = [
  "全部",
  "待审批",
  "已处理",
  "已通过",
  "已驳回",
  "已撤回",
  "已失效",
  "已作废",
]

export const MY_APPLY_STATUS_OPTIONS: UnlockApplyStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "WITHDRAWN",
  "EXPIRED",
  "VOIDED",
]

export const MY_CREDENTIAL_STATUS_OPTIONS: CredentialStatus[] = [
  "NOT_GENERATED",
  "DELIVERED",
  "GEN_FAILED",
  "EXPIRED",
  "SUPERSEDED",
]

export const DEFAULT_UNLOCK_APPLY_FILTERS: UnlockApplyFilters = {
  applyNo: "",
  deviceKeyword: "",
  warehouseName: "全部",
  applicantKeyword: "",
  reason: "全部",
  applyStatus: "待审批",
  submitTimeFrom: "",
  submitTimeTo: "",
}

export const DEFAULT_MY_UNLOCK_APPLY_FILTERS: MyUnlockApplyFilters = {
  needsApproval: "全部",
  submitTimeFrom: "",
  submitTimeTo: "",
  applyStatuses: [],
  credentialStatuses: [],
  deviceName: "",
  deviceCode: "",
  deviceType: "全部",
  warehouseName: "全部",
  reason: "全部",
  applicantKeyword: "",
  configNo: "",
}

export const PROCESSED_STATUSES: UnlockApplyStatus[] = [
  "APPROVED",
  "REJECTED",
  "WITHDRAWN",
  "EXPIRED",
  "VOIDED",
]
