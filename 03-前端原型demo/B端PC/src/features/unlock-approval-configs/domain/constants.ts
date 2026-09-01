import type { UnlockApprovalConfigFilters } from "./types"

export const DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS: UnlockApprovalConfigFilters = {
  configName: "",
  status: "全部",
  configNo: "",
}

export const STATUS_OPTIONS = ["全部", "已启用", "已停用"] as const

export const PAGE_SIZE = 10

export const LIST_BASE_PATH = "/配置管理/业务流程管理/开锁审批"

/** 6.2 固定审批方式，前端只读展示 */
export const FIXED_APPROVAL_MODE = "任一人通过" as const
