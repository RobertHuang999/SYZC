/** 与 PC unlock-approval-configs mock 对齐的子集，供 H5 审批路由匹配 */
export type UnlockApprovalConfig = {
  configNo: string
  scopeType: "仓库" | "库房" | "分区" | "指定设备" | "未绑定位置全局"
  warehouseName: string | null
  storeroomNames: string[]
  zoneNames: string[]
  deviceCodes: string[]
  globalSwitch: "开启" | "关闭" | null
  status: "已启用" | "已停用"
}

export const unlockApprovalConfigsMock: UnlockApprovalConfig[] = [
  {
    configNo: "UNLOCK-CFG-001",
    scopeType: "库房",
    warehouseName: "华东一号仓",
    storeroomNames: ["A库"],
    zoneNames: [],
    deviceCodes: [],
    globalSwitch: null,
    status: "已启用",
  },
  {
    configNo: "UNLOCK-CFG-002",
    scopeType: "指定设备",
    warehouseName: "华东一号仓",
    storeroomNames: [],
    zoneNames: [],
    deviceCodes: ["LK-2024-0082", "LK-0085", "FACE-01"],
    globalSwitch: null,
    status: "已启用",
  },
  {
    configNo: "UNLOCK-CFG-003",
    scopeType: "未绑定位置全局",
    warehouseName: null,
    storeroomNames: [],
    zoneNames: [],
    deviceCodes: [],
    globalSwitch: "开启",
    status: "已启用",
  },
  {
    configNo: "UNLOCK-CFG-004",
    scopeType: "仓库",
    warehouseName: "华南二号仓",
    storeroomNames: [],
    zoneNames: [],
    deviceCodes: [],
    globalSwitch: null,
    status: "已停用",
  },
]
