import type { UnlockApprovalConfig } from "../domain/types"

const baseConfigs: UnlockApprovalConfig[] = [
  {
    configNo: "UNLOCK-CFG-001",
    configName: "A库指定挂锁审批",
    deviceCount: 3,
    deviceCodes: ["LK-2024-0082", "LK-0085", "FACE-01"],
    deviceSummary: "LK-2024-0082 / LK-0085 / FACE-01",
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
    configNo: "UNLOCK-CFG-002",
    configName: "华东入口人脸审批",
    deviceCount: 1,
    deviceCodes: ["FACE-01"],
    deviceSummary: "FACE-01",
    approvalMode: "任一人通过",
    timeoutHours: 24,
    configVersion: 1,
    status: "已启用",
    createdBy: "张工（监管运营部）",
    createdAt: "08-28 09:12",
    updatedBy: "张工（监管运营部）",
    updatedAt: "2026-08-28 09:12:18",
  },
  {
    configNo: "UNLOCK-CFG-003",
    configName: "华南监管挂锁审批",
    deviceCount: 5,
    deviceCodes: ["LK-HN-001", "LK-HN-002", "FACE-HN-01", "LK-HB-001", "LK-HB-002"],
    deviceSummary: "LK-HN-001 等 5 台",
    approvalMode: "任一人通过",
    timeoutHours: 48,
    configVersion: 1,
    status: "已停用",
    createdBy: "李运维（设备部）",
    createdAt: "08-20 14:02",
    updatedBy: "李运维（设备部）",
    updatedAt: "2026-08-20 14:02:00",
  },
]

const extraDeviceSets: string[][] = [
  ["LK-2024-0099", "LK-HB-001"],
  ["LK-HB-002", "FACE-HB-01"],
  ["LK-HN-001"],
  ["LK-2024-0082"],
  ["FACE-01", "LK-0085"],
  ["LK-HN-002", "FACE-HN-01"],
  ["LK-HB-001", "LK-HB-002", "FACE-HB-01"],
]

const extraNames = [
  "B库挂锁专项审批",
  "华北人脸通道审批",
  "华南1区挂锁审批",
  "A库东门挂锁审批",
  "华东入口复合审批",
  "华南主库夜间审批",
  "华北三号库联合审批",
]

const statusCycle = ["已启用", "已启用", "已启用", "已停用"] as const

function buildExtraConfigs(): UnlockApprovalConfig[] {
  return extraNames.map((name, index) => {
    const codes = extraDeviceSets[index % extraDeviceSets.length]
    const day = String(10 + (index % 10)).padStart(2, "0")
    const summary =
      codes.length <= 2 ? codes.join(" / ") : `${codes[0]} 等 ${codes.length} 台`

    return {
      configNo: `UNLOCK-CFG-${String(index + 4).padStart(3, "0")}`,
      configName: name,
      deviceCount: codes.length,
      deviceCodes: codes,
      deviceSummary: summary,
      approvalMode: "任一人通过" as const,
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
