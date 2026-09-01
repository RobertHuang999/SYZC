/** 与 PC unlock-approval-configs mock 对齐，供 H5 审批路由匹配 */
export type UnlockApprovalConfig = {
  configNo: string
  deviceCodes: string[]
  status: "已启用" | "已停用"
}

export const unlockApprovalConfigsMock: UnlockApprovalConfig[] = [
  {
    configNo: "UNLOCK-CFG-001",
    deviceCodes: ["LK-2024-0082", "LK-0085", "FACE-01"],
    status: "已启用",
  },
  {
    configNo: "UNLOCK-CFG-002",
    deviceCodes: ["FACE-01"],
    status: "已启用",
  },
  {
    configNo: "UNLOCK-CFG-003",
    deviceCodes: ["LK-HN-001", "LK-HN-002", "FACE-HN-01", "LK-HB-001", "LK-HB-002"],
    status: "已停用",
  },
]
