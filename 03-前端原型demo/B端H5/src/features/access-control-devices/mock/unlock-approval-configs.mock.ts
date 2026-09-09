/** 与 PC unlock-approval-configs mock 对齐，供 H5 审批路由匹配 */
export type UnlockApprovalConfig = {
  configNo: string
  configName: string
  deviceCodes: string[]
  approvalMode: "任一人通过"
  timeoutHours: number
  configVersion: number
  status: "已启用" | "已停用"
}

export const unlockApprovalConfigsMock: UnlockApprovalConfig[] = [
  {
    configNo: "UNLOCK-CFG-001",
    configName: "A库指定挂锁审批",
    deviceCodes: ["LK-2024-0082", "LK-0085", "FACE-01"],
    approvalMode: "任一人通过",
    timeoutHours: 12,
    configVersion: 2,
    status: "已启用",
  },
  {
    configNo: "UNLOCK-CFG-002",
    configName: "华东入口人脸审批",
    deviceCodes: ["FACE-01"],
    approvalMode: "任一人通过",
    timeoutHours: 24,
    configVersion: 1,
    status: "已启用",
  },
  {
    configNo: "UNLOCK-CFG-003",
    configName: "华南监管挂锁审批",
    deviceCodes: ["LK-HN-001", "LK-HN-002", "FACE-HN-01", "LK-HB-001", "LK-HB-002"],
    approvalMode: "任一人通过",
    timeoutHours: 48,
    configVersion: 1,
    status: "已停用",
  },
]
