export const SCOPE_TYPES = [
  "仓库",
  "库房",
  "分区",
  "指定设备",
  "未绑定位置全局",
] as const

export type ScopeType = (typeof SCOPE_TYPES)[number]

export type ApprovalMode = "任一人通过" | "按顺序审批"

export type ConfigStatus = "已启用" | "已停用"

export type ApproverObjectType = "指定人员" | "指定角色"

export type GlobalSwitch = "开启" | "关闭"

export type ApprovalNode = {
  id: string
  sequence: number
  objectType: ApproverObjectType | ""
  objectLabel: string
}

export type UnlockApprovalConfig = {
  configNo: string
  configName: string
  scopeType: ScopeType
  warehouseName: string | null
  storeroomNames: string[]
  zoneNames: string[]
  deviceCount: number | null
  deviceCodes: string[]
  globalSwitch: GlobalSwitch | null
  scopeSummary: string
  approvalMode: ApprovalMode
  timeoutHours: number
  configVersion: number
  status: ConfigStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export type UnlockApprovalConfigDetail = UnlockApprovalConfig & {
  approvalNodes: ApprovalNode[]
  disableReason: string | null
  version: number
}

export type UnlockApprovalConfigFilters = {
  configName: string
  scopeType: "全部" | ScopeType
  approvalMode: "全部" | ApprovalMode
  status: "全部" | ConfigStatus
  configNo: string
  warehouseName: string
  globalSwitch: "全部" | GlobalSwitch
}

export type UnlockApprovalConfigFormValues = {
  configName: string
  scopeType: ScopeType | ""
  warehouseName: string
  storeroomNames: string[]
  zoneNames: string[]
  warehouseFilter: string
  selectedDeviceIds: string[]
  globalSwitch: GlobalSwitch
  approvalMode: ApprovalMode | ""
  approvalNodes: ApprovalNode[]
  timeoutHours: string
  version: number | null
}
