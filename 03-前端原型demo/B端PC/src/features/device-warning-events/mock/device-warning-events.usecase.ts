/**
 * 设备预警信息 · 用例数据推演（Mock 数据源）
 *
 * 依据文档：
 * - 《设备预警信息主PRD》S01~S08
 * - 《设备预警信息_Demo_列表页》ASCII 5 行 + 128 条分页
 * - 《设备预警信息字段清单》第一章
 * - 《设备预警信息业务规则规格》第二~五章
 */
import type { DeviceWarningEvent } from "../domain/types"
import { WARNING_STATUS } from "../domain/status"
import { getSeverityLevelByCode } from "@/shared/mock/severity-levels"
import {
  enrichDeviceWarningEvent,
  type RawDeviceWarningEvent,
} from "../../shared/mock/device-warning-mock-sync"

export const USECASE_WAREHOUSES = {
  WH_A: "一号钢材仓",
  WH_B: "二号粮油仓",
  WH_C: "三号冷链仓",
  WH_D: "四号化工仓",
  WH_E: "五号监管仓",
} as const

function severitySnapshot(code: string) {
  const level = getSeverityLevelByCode(code)
  if (!level) {
    throw new Error(`未找到预警等级：${code}`)
  }
  return {
    severityLevelId: level.severityLevelId,
    severityCode: level.severityCode,
    severityName: level.severityName,
    severityColor: level.severityColor,
  }
}

export const USECASE_SEVERITY = {
  L2: severitySnapshot("L2"),
  L3: severitySnapshot("L3"),
  L4: severitySnapshot("L4"),
  L5: severitySnapshot("L5"),
} as const

/** 用例推演案例与列表 Mock 映射 */
export const USECASE_SCENARIOS = [
  { id: "S01", label: "持续超标待处置", eventId: "evt-001" },
  { id: "S03", label: "人工解除单条归档", eventId: "evt-002" },
  { id: "S05", label: "瞬态通行立即落账", eventId: "evt-003" },
  { id: "S01", label: "持续超标待处置", eventId: "evt-004" },
  { id: "S05", label: "瞬态通行立即落账", eventId: "evt-005" },
  { id: "S07", label: "规则删除置流水无效", eventId: "evt-007" },
  { id: "S04", label: "自动恢复解除", eventId: "evt-010" },
  { id: "S06", label: "超时升级计时中", eventId: "evt-009" },
  { id: "S07", label: "规则删除置流水无效", eventId: "evt-011" },
  { id: "S03", label: "人工解除单条归档", eventId: "evt-012" },
] as const

/**
 * 精编用例记录（18 条，覆盖三态 + Demo ASCII 5 行）
 * 默认筛选「待处置 · 有效」下，前 5 条按预警时间倒序对齐 ASCII。
 */
const rawDeviceWarningEventUseCases: RawDeviceWarningEvent[] = [
  {
    eventId: "evt-001",
    ruleName: "库温超标预警",
    ...USECASE_SEVERITY.L4,
    warningType: "设备物联预警",
    location: "一号钢材仓·A库",
    deviceName: "温湿度TH01",
    triggerSummary: "库温超标 38℃ / 阈值 30℃",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 08:15:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_A,
    version: 24,
  },
  {
    eventId: "evt-002",
    ruleName: "A库人体入侵",
    ...USECASE_SEVERITY.L5,
    warningType: "设备图像识别预警",
    location: "一号钢材仓·B库",
    deviceName: "CAM1",
    triggerSummary: "行人入侵",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 12:40:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_A,
    version: 3,
  },
  {
    eventId: "evt-003",
    ruleName: "门锁开关通知",
    ...USECASE_SEVERITY.L2,
    warningType: "智能挂锁预警",
    location: "二号粮油仓·1号门",
    deviceName: "LK02",
    triggerSummary: "开锁通知",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 11:30:00",
    processedTime: "2026-08-20 11:30:00",
    processedBy: "系统自动处理",
    warningStatus: WARNING_STATUS.CLOSED_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_B,
    version: 1,
  },
  {
    eventId: "evt-004",
    ruleName: "传感器离线",
    ...USECASE_SEVERITY.L3,
    warningType: "设备物联预警",
    location: "三号冷链仓·监测区",
    deviceName: "O2传感器",
    triggerSummary: "设备离线",
    snapshotImageStatus: "none",
    warningTime: "2026-08-20 10:00:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_C,
    version: 1,
  },
  {
    eventId: "evt-005",
    ruleName: "人脸通行通知",
    ...USECASE_SEVERITY.L2,
    warningType: "人脸门禁预警",
    location: "一号钢材仓·主入口",
    deviceName: "FACE1",
    triggerSummary: "开锁通知",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 09:15:00",
    processedTime: "2026-08-20 09:15:00",
    processedBy: "系统自动处理",
    warningStatus: WARNING_STATUS.CLOSED_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_A,
    version: 1,
  },
  {
    eventId: "evt-006",
    ruleName: "湿度超标预警",
    ...USECASE_SEVERITY.L4,
    warningType: "设备物联预警",
    location: "二号粮油仓·C库",
    deviceName: "温湿度TH08",
    triggerSummary: "湿度超标 88% / 阈值 75%",
    snapshotImageStatus: "available",
    warningTime: "2026-08-19 16:20:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_B,
    version: 12,
  },
  {
    eventId: "evt-007",
    ruleName: "烟感异常告警",
    ...USECASE_SEVERITY.L3,
    warningType: "设备物联预警",
    location: "四号化工仓·D库",
    deviceName: "烟感YG03",
    triggerSummary: "烟感异常",
    snapshotImageStatus: "failed",
    warningTime: "2026-08-18 22:10:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_INVALID,
    warehouseName: USECASE_WAREHOUSES.WH_D,
    version: 1,
  },
  {
    eventId: "evt-008",
    ruleName: "GPS设备离线",
    ...USECASE_SEVERITY.L3,
    warningType: "设备GPS预警",
    location: "五号监管仓·运输线",
    deviceName: "GPS-T001",
    triggerSummary: "设备离线",
    snapshotImageStatus: "none",
    warningTime: "2026-08-20 06:30:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_E,
    version: 1,
  },
  {
    eventId: "evt-009",
    ruleName: "门未关告警",
    ...USECASE_SEVERITY.L4,
    warningType: "人脸门禁预警",
    location: "三号冷链仓·2号门",
    deviceName: "DOOR-A2",
    triggerSummary: "门未关 18 分钟",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 05:10:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_C,
    version: 5,
  },
  {
    eventId: "evt-010",
    ruleName: "库温超标预警",
    ...USECASE_SEVERITY.L4,
    warningType: "设备物联预警",
    location: "一号钢材仓·A库",
    deviceName: "温湿度TH01",
    triggerSummary: "库温超标 32℃ / 阈值 30℃",
    snapshotImageStatus: "available",
    warningTime: "2026-08-19 09:00:00",
    processedTime: "2026-08-19 11:25:00",
    processedBy: "系统自动处理",
    warningStatus: WARNING_STATUS.CLOSED_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_A,
    version: 9,
  },
  {
    eventId: "evt-011",
    ruleName: "挂锁防拆报警",
    ...USECASE_SEVERITY.L5,
    warningType: "智能挂锁预警",
    location: "四号化工仓·东门",
    deviceName: "LK15",
    triggerSummary: "拆壳",
    snapshotImageStatus: "available",
    warningTime: "2026-08-17 14:00:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_INVALID,
    warehouseName: USECASE_WAREHOUSES.WH_D,
    version: 1,
  },
  {
    eventId: "evt-012",
    ruleName: "非法开箱告警",
    ...USECASE_SEVERITY.L5,
    warningType: "智能挂锁预警",
    location: "二号粮油仓·3号门",
    deviceName: "LK09",
    triggerSummary: "非法开箱",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 03:20:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_B,
    version: 2,
  },
  {
    eventId: "evt-013",
    ruleName: "高安保门锁需确认",
    ...USECASE_SEVERITY.L3,
    warningType: "智能挂锁预警",
    location: "五号监管仓·侧门",
    deviceName: "LK21",
    triggerSummary: "开锁通知",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 08:05:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_E,
    version: 1,
  },
  {
    eventId: "evt-014",
    ruleName: "GPS进围栏告警",
    ...USECASE_SEVERITY.L4,
    warningType: "设备GPS预警",
    location: "五号监管仓·运输线",
    deviceName: "GPS-T002",
    triggerSummary: "进围栏 1.2km",
    snapshotImageStatus: "none",
    warningTime: "2026-08-19 20:10:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_E,
    version: 6,
  },
  {
    eventId: "evt-015",
    ruleName: "人脸密码错误",
    ...USECASE_SEVERITY.L3,
    warningType: "人脸门禁预警",
    location: "一号钢材仓·主入口",
    deviceName: "FACE1",
    triggerSummary: "密码错误",
    snapshotImageStatus: "available",
    warningTime: "2026-08-19 18:40:00",
    processedTime: "2026-08-20 15:30:00",
    processedBy: "张监管(现场部)",
    warningStatus: WARNING_STATUS.CLOSED_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_A,
    version: 1,
  },
  {
    eventId: "evt-016",
    ruleName: "锁舌被卡告警",
    ...USECASE_SEVERITY.L5,
    warningType: "智能挂锁预警",
    location: "三号冷链仓·1号门",
    deviceName: "LK06",
    triggerSummary: "锁舌被卡",
    snapshotImageStatus: "failed",
    warningTime: "2026-08-16 23:50:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_INVALID,
    warehouseName: USECASE_WAREHOUSES.WH_C,
    version: 1,
  },
  {
    eventId: "evt-017",
    ruleName: "挂锁防拆报警",
    ...USECASE_SEVERITY.L5,
    warningType: "智能挂锁预警",
    location: "一号钢材仓·西门",
    deviceName: "LK11",
    triggerSummary: "锁杆被剪",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 02:10:00",
    processedTime: null,
    processedBy: null,
    warningStatus: WARNING_STATUS.OPEN_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_A,
    version: 4,
  },
  {
    eventId: "evt-018",
    ruleName: "门锁开关通知",
    ...USECASE_SEVERITY.L2,
    warningType: "智能挂锁预警",
    location: "二号粮油仓·2号门",
    deviceName: "LK18",
    triggerSummary: "关锁通知",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 07:20:00",
    processedTime: "2026-08-20 07:20:00",
    processedBy: "系统自动处理",
    warningStatus: WARNING_STATUS.CLOSED_VALID,
    warehouseName: USECASE_WAREHOUSES.WH_B,
    version: 1,
  },
]

/** 注入处置策略快照并与配置侧规则对齐 */
export const deviceWarningEventUseCases: DeviceWarningEvent[] =
  rawDeviceWarningEventUseCases.map((event) => enrichDeviceWarningEvent(event))

export function getUseCaseStatusCoverage() {
  return deviceWarningEventUseCases.reduce<
    Record<string, { count: number; samples: string[] }>
  >((acc, item) => {
    const key = item.warningStatus
    if (!acc[key]) {
      acc[key] = { count: 0, samples: [] }
    }
    acc[key].count += 1
    if (acc[key].samples.length < 3) {
      acc[key].samples.push(item.ruleName)
    }
    return acc
  }, {})
}
