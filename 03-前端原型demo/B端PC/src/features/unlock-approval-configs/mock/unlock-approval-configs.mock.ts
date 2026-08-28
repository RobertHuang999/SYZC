import type { UnlockApprovalConfig } from "../domain/types"
import { WAREHOUSE_OPTIONS } from "./reference-data.mock"

const baseConfigs: UnlockApprovalConfig[] = [
  {
    configNo: "UNLOCK-CFG-001",
    configName: "华东一号仓A库开锁审批",
    scopeType: "库房",
    warehouseName: "华东一号仓",
    storeroomNames: ["A库"],
    zoneNames: [],
    deviceCount: null,
    deviceCodes: [],
    globalSwitch: null,
    scopeSummary: "华东一号仓 / A库",
    approvalMode: "按顺序审批",
    timeoutHours: 24,
    configVersion: 1,
    status: "已启用",
    createdBy: "张工（监管运营部）",
    createdAt: "08-28 09:12",
    updatedBy: "张工（监管运营部）",
    updatedAt: "2026-08-28 09:12:18",
  },
  {
    configNo: "UNLOCK-CFG-002",
    configName: "A库指定挂锁审批",
    scopeType: "指定设备",
    warehouseName: "华东一号仓",
    storeroomNames: [],
    zoneNames: [],
    deviceCount: 3,
    deviceCodes: ["LK-2024-0082", "LK-0085", "FACE-01"],
    globalSwitch: null,
    scopeSummary: "华东一号仓 / 已选 3 台",
    approvalMode: "任一人通过",
    timeoutHours: 12,
    configVersion: 2,
    status: "已启用",
    createdBy: "张工（监管运营部）",
    createdAt: "08-27 16:40",
    updatedBy: "张工（监管运营部）",
    updatedAt: "2026-08-27 16:40:00",
  },
  {
    configNo: "UNLOCK-CFG-003",
    configName: "未绑定位置全局审批",
    scopeType: "未绑定位置全局",
    warehouseName: null,
    storeroomNames: [],
    zoneNames: [],
    deviceCount: null,
    deviceCodes: [],
    globalSwitch: "开启",
    scopeSummary: "全局开关=开启",
    approvalMode: "任一人通过",
    timeoutHours: 24,
    configVersion: 1,
    status: "已启用",
    createdBy: "黄k（风控部）",
    createdAt: "08-26 11:08",
    updatedBy: "黄k（风控部）",
    updatedAt: "2026-08-26 11:08:00",
  },
  {
    configNo: "UNLOCK-CFG-004",
    configName: "华南二号仓仓库级审批",
    scopeType: "仓库",
    warehouseName: "华南二号仓",
    storeroomNames: [],
    zoneNames: [],
    deviceCount: null,
    deviceCodes: [],
    globalSwitch: null,
    scopeSummary: "华南二号仓",
    approvalMode: "按顺序审批",
    timeoutHours: 48,
    configVersion: 1,
    status: "已停用",
    createdBy: "李运维（设备部）",
    createdAt: "08-20 14:02",
    updatedBy: "李运维（设备部）",
    updatedAt: "2026-08-20 14:02:00",
  },
  {
    configNo: "UNLOCK-CFG-005",
    configName: "华北三号仓1区开锁审批",
    scopeType: "分区",
    warehouseName: "华北三号仓",
    storeroomNames: ["1号库"],
    zoneNames: ["1区"],
    deviceCount: null,
    deviceCodes: [],
    globalSwitch: null,
    scopeSummary: "华北三号仓 / 1号库 / 1区",
    approvalMode: "任一人通过",
    timeoutHours: 8,
    configVersion: 3,
    status: "已启用",
    createdBy: "张工（监管运营部）",
    createdAt: "08-18 10:25",
    updatedBy: "张工（监管运营部）",
    updatedAt: "2026-08-18 10:25:00",
  },
]

const extraNames = [
  "华东B库夜间审批",
  "华南主库临时审批",
  "华北2号库审批",
  "全局关闭兜底",
  "A库人脸门禁审批",
  "冷链仓专项审批",
  "监管仓挂锁审批",
]

const scopeCycle = ["仓库", "库房", "分区", "指定设备", "未绑定位置全局"] as const
const modeCycle = ["任一人通过", "按顺序审批"] as const
const statusCycle = ["已启用", "已启用", "已启用", "已停用"] as const

function buildExtraConfigs(): UnlockApprovalConfig[] {
  return extraNames.map((name, index) => {
    const scopeType = scopeCycle[index % scopeCycle.length]
    const warehouse = WAREHOUSE_OPTIONS[index % WAREHOUSE_OPTIONS.length]
    const day = String(10 + (index % 10)).padStart(2, "0")

    let scopeSummary: string = warehouse
    if (scopeType === "库房") scopeSummary = `${warehouse} / A库`
    if (scopeType === "分区") scopeSummary = `${warehouse} / 1号库 / 1区`
    if (scopeType === "指定设备") scopeSummary = `${warehouse} / 已选 2 台`
    if (scopeType === "未绑定位置全局") scopeSummary = "全局开关=关闭"

    return {
      configNo: `UNLOCK-CFG-${String(index + 6).padStart(3, "0")}`,
      configName: name,
      scopeType,
      warehouseName: scopeType === "未绑定位置全局" ? null : warehouse,
      storeroomNames: scopeType === "库房" || scopeType === "分区" ? ["A库"] : [],
      zoneNames: scopeType === "分区" ? ["1区"] : [],
      deviceCount: scopeType === "指定设备" ? 2 : null,
      deviceCodes: scopeType === "指定设备" ? ["LK-2024-0082", "LK-0085"] : [],
      globalSwitch: scopeType === "未绑定位置全局" ? "关闭" : null,
      scopeSummary,
      approvalMode: modeCycle[index % modeCycle.length],
      timeoutHours: 12 + (index % 5) * 6,
      configVersion: 1 + (index % 3),
      status: statusCycle[index % statusCycle.length],
      createdBy: index % 2 === 0 ? "张工（监管运营部）" : "李运维（设备部）",
      createdAt: `08-${day} 10:00`,
      updatedBy: "张工（监管运营部）",
      updatedAt: `2026-08-${day} 10:00:00`,
    }
  })
}

export const unlockApprovalConfigsMock: UnlockApprovalConfig[] = [
  ...baseConfigs,
  ...buildExtraConfigs(),
]
