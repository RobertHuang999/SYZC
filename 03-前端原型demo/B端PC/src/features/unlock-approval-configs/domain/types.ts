export type ApprovalMode = "任一人通过" | "按顺序审批"

export type ConfigStatus = "已启用" | "已停用"

export type ApproverObjectType = "指定人员" | "指定角色"

export type ApprovalNode = {
  id: string
  sequence: number
  objectType: ApproverObjectType | ""
  objectLabel: string
}

export type UnlockApprovalConfig = {
  configNo: string
  configName: string
  deviceCount: number
  deviceCodes: string[]
  deviceSummary: string
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
  status: "全部" | ConfigStatus
  configNo: string
}

export type UnlockApprovalConfigFormValues = {
  configName: string
  selectedDeviceIds: string[]
  approvalNodes: ApprovalNode[]
  timeoutHours: string
  version: number | null
}
