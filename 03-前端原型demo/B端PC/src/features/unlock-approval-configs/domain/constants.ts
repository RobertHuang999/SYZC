import type { UnlockApprovalConfigFilters } from "./types"

export const DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS: UnlockApprovalConfigFilters = {
  configName: "",
  scopeType: "全部",
  approvalMode: "全部",
  status: "全部",
  configNo: "",
  warehouseName: "全部",
  globalSwitch: "全部",
}

export const SCOPE_TYPE_OPTIONS = ["全部", "仓库", "库房", "分区", "指定设备", "未绑定位置全局"] as const

export const APPROVAL_MODE_OPTIONS = ["全部", "任一人通过", "按顺序审批"] as const

export const STATUS_OPTIONS = ["全部", "已启用", "已停用"] as const

export const GLOBAL_SWITCH_FILTER_OPTIONS = ["全部", "开启", "关闭"] as const

export const PAGE_SIZE = 10

export const LIST_BASE_PATH = "/配置管理/业务流程管理/开锁审批"
