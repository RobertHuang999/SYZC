import type { DeviceWarningType } from "../../device-warning-configs/domain/types"
import type { DispositionMode } from "../../device-warning-configs/domain/disposition"
import { DEVICE_WARNING_SUB_TYPES } from "../../device-warning-configs/domain/constants"

/** 配置侧 · 基准规则（与预警信息精编用例一一对应） */
export type DeviceWarningRuleScenario = {
  configId: string
  ruleName: string
  warningType: DeviceWarningType
  severityLevelId: string
  deviceScope: string
  warningSubTypes: string[]
  dispositionMode: DispositionMode
  triggerCondition: string
  status: "生效中" | "停用" | "已失效"
  linkedEventIds: string[]
}

export const DEVICE_WARNING_RULE_SCENARIOS: DeviceWarningRuleScenario[] = [
  {
    configId: "dwc-001",
    ruleName: "A库人体入侵",
    warningType: "设备图像识别预警",
    severityLevelId: "sl-l5",
    deviceScope: "已选 4 台摄像头",
    warningSubTypes: ["行人入侵", "车辆入侵"],
    dispositionMode: "ACTION_REQUIRED",
    triggerCondition: "行人入侵/车辆入侵",
        status: "生效中",
    linkedEventIds: ["evt-002"],
  },
  {
    configId: "dwc-002",
    ruleName: "库温超标预警",
    warningType: "设备物联预警",
    severityLevelId: "sl-l4",
    deviceScope: "已选 6 台温湿度计",
    warningSubTypes: ["温度异常"],
    dispositionMode: "AUTO_RECOVER",
    triggerCondition: "温度异常",
        status: "生效中",
    linkedEventIds: ["evt-001", "evt-010"],
  },
  {
    configId: "dwc-003",
    ruleName: "挂锁防拆报警",
    warningType: "智能挂锁预警",
    severityLevelId: "sl-l5",
    deviceScope: "已选 12 把挂锁",
    warningSubTypes: ["锁杆被剪", "拆壳"],
    dispositionMode: "ACTION_REQUIRED",
    triggerCondition: "锁杆被剪/拆壳",
        status: "生效中",
    linkedEventIds: ["evt-011", "evt-017"],
  },
  {
    configId: "dwc-004",
    ruleName: "门锁开关通知",
    warningType: "智能挂锁预警",
    severityLevelId: "sl-l2",
    deviceScope: "已选 8 把挂锁",
    warningSubTypes: ["开锁通知", "关锁通知"],
    dispositionMode: "RECORD_ONLY",
    triggerCondition: "开锁通知/关锁通知",
        status: "停用",
    linkedEventIds: ["evt-003", "evt-018"],
  },
  {
    configId: "dwc-005",
    ruleName: "新监控上线通知",
    warningType: "设备图像识别预警",
    severityLevelId: "sl-l1",
    deviceScope: "仅针对新设备（全局监听）",
    warningSubTypes: ["设备上线"],
    dispositionMode: "RECORD_ONLY",
    triggerCondition: "设备上线",
        status: "生效中",
    linkedEventIds: [],
  },
  {
    configId: "dwc-006",
    ruleName: "传感器离线",
    warningType: "设备物联预警",
    severityLevelId: "sl-l3",
    deviceScope: "已选 3 台传感器",
    warningSubTypes: ["设备离线"],
    dispositionMode: "ACTION_REQUIRED",
    triggerCondition: "设备离线",
        status: "已失效",
    linkedEventIds: ["evt-004"],
  },
  {
    configId: "dwc-007",
    ruleName: "人脸通行通知",
    warningType: "人脸门禁预警",
    severityLevelId: "sl-l2",
    deviceScope: "已选 3 台人脸门禁",
    warningSubTypes: ["开锁通知", "关锁通知"],
    dispositionMode: "RECORD_ONLY",
    triggerCondition: "开锁通知/关锁通知",
        status: "生效中",
    linkedEventIds: ["evt-005"],
  },
  {
    configId: "dwc-008",
    ruleName: "门未关告警",
    warningType: "人脸门禁预警",
    severityLevelId: "sl-l4",
    deviceScope: "已选 5 台人脸门禁",
    warningSubTypes: ["门未关"],
    dispositionMode: "ACTION_REQUIRED",
    triggerCondition: "门未关",
        status: "生效中",
    linkedEventIds: ["evt-009"],
  },
  {
    configId: "dwc-009",
    ruleName: "GPS进围栏告警",
    warningType: "设备GPS预警",
    severityLevelId: "sl-l4",
    deviceScope: "已选 6 台 GPS",
    warningSubTypes: ["进围栏", "出围栏"],
    dispositionMode: "AUTO_RECOVER",
    triggerCondition: "进围栏/出围栏",
        status: "生效中",
    linkedEventIds: ["evt-014"],
  },
  {
    configId: "dwc-010",
    ruleName: "GPS设备离线",
    warningType: "设备GPS预警",
    severityLevelId: "sl-l3",
    deviceScope: "已选 4 台 GPS",
    warningSubTypes: ["设备离线"],
    dispositionMode: "AUTO_RECOVER",
    triggerCondition: "设备离线",
        status: "生效中",
    linkedEventIds: ["evt-008"],
  },
  {
    configId: "dwc-011",
    ruleName: "非法开箱告警",
    warningType: "智能挂锁预警",
    severityLevelId: "sl-l5",
    deviceScope: "已选 6 把挂锁",
    warningSubTypes: ["非法开箱"],
    dispositionMode: "ACTION_REQUIRED",
    triggerCondition: "非法开箱",
        status: "生效中",
    linkedEventIds: ["evt-012"],
  },
  {
    configId: "dwc-012",
    ruleName: "锁舌被卡告警",
    warningType: "智能挂锁预警",
    severityLevelId: "sl-l5",
    deviceScope: "已选 10 把挂锁",
    warningSubTypes: ["锁舌被卡"],
    dispositionMode: "ACTION_REQUIRED",
    triggerCondition: "锁舌被卡",
        status: "生效中",
    linkedEventIds: ["evt-016"],
  },
  {
    configId: "dwc-013",
    ruleName: "人脸密码错误",
    warningType: "人脸门禁预警",
    severityLevelId: "sl-l3",
    deviceScope: "已选 2 台人脸门禁",
    warningSubTypes: ["密码错误"],
    dispositionMode: "ACTION_REQUIRED",
    triggerCondition: "密码错误",
        status: "生效中",
    linkedEventIds: ["evt-015"],
  },
  {
    configId: "dwc-014",
    ruleName: "湿度超标预警",
    warningType: "设备物联预警",
    severityLevelId: "sl-l4",
    deviceScope: "已选 4 台温湿度计",
    warningSubTypes: ["湿度异常"],
    dispositionMode: "AUTO_RECOVER",
    triggerCondition: "湿度异常",
        status: "生效中",
    linkedEventIds: ["evt-006"],
  },
  {
    configId: "dwc-015",
    ruleName: "烟感异常告警",
    warningType: "设备物联预警",
    severityLevelId: "sl-l3",
    deviceScope: "已选 2 台烟感",
    warningSubTypes: ["烟感异常"],
    dispositionMode: "AUTO_RECOVER",
    triggerCondition: "烟感异常",
        status: "已失效",
    linkedEventIds: ["evt-007"],
  },
  {
    configId: "dwc-016",
    ruleName: "高安保门锁需确认",
    warningType: "智能挂锁预警",
    severityLevelId: "sl-l3",
    deviceScope: "已选 2 把挂锁（五号监管仓）",
    warningSubTypes: ["开锁通知"],
    dispositionMode: "ACTION_REQUIRED",
    triggerCondition: "开锁通知",
        status: "生效中",
    linkedEventIds: ["evt-013"],
  },
]

export const RULE_SCENARIO_BY_ID = Object.fromEntries(
  DEVICE_WARNING_RULE_SCENARIOS.map((item) => [item.configId, item])
) as Record<string, DeviceWarningRuleScenario>

export const RULE_SCENARIO_BY_EVENT_ID = DEVICE_WARNING_RULE_SCENARIOS.reduce<
  Record<string, DeviceWarningRuleScenario>
>((acc, scenario) => {
  for (const eventId of scenario.linkedEventIds) {
    acc[eventId] = scenario
  }
  return acc
}, {})

/** 扩展列表 · 可选 dispositionMode 表示用户自定义（偏离系统推荐） */
export type ExtraRuleSample = {
  ruleName: string
  warningType: DeviceWarningType
  subTypes: string[]
  dispositionMode?: DispositionMode
}

/** 扩展列表页 Mock：按大类轮换子类型展示 */
export const EXTRA_RULE_NAME_SAMPLES: ExtraRuleSample[] = [
  {
    ruleName: "拆壳仅通知规则",
    warningType: "智能挂锁预警",
    subTypes: ["拆壳"],
    dispositionMode: "RECORD_ONLY",
  },
  {
    ruleName: "库温人工核查",
    warningType: "设备物联预警",
    subTypes: ["温度异常"],
    dispositionMode: "ACTION_REQUIRED",
  },
  { ruleName: "B库夜间入侵", warningType: "设备图像识别预警", subTypes: ["行人入侵"] },
  { ruleName: "人脸密码错误", warningType: "人脸门禁预警", subTypes: ["密码错误"] },
  { ruleName: "GPS普通限速", warningType: "设备GPS预警", subTypes: ["普通限速"] },
  { ruleName: "挂锁低电量", warningType: "智能挂锁预警", subTypes: ["电量低于20%"] },
  { ruleName: "摄像头设备离线", warningType: "设备图像识别预警", subTypes: ["设备离线"] },
  { ruleName: "拆卡报警规则", warningType: "智能挂锁预警", subTypes: ["拆卡报警"] },
  { ruleName: "关锁异常监测", warningType: "智能挂锁预警", subTypes: ["关锁异常"] },
  { ruleName: "二氧化碳异常", warningType: "设备物联预警", subTypes: ["二氧化碳异常"] },
  { ruleName: "氧气异常监测", warningType: "设备物联预警", subTypes: ["氧气异常"] },
  { ruleName: "GPS路线偏离", warningType: "设备GPS预警", subTypes: ["路线偏离"] },
  { ruleName: "GPS非法拆除", warningType: "设备GPS预警", subTypes: ["非法拆除"] },
  { ruleName: "新门禁上线通知", warningType: "人脸门禁预警", subTypes: ["设备上线"] },
  { ruleName: "挂锁设备移除通知", warningType: "智能挂锁预警", subTypes: ["设备移除"] },
  { ruleName: "物品形态变化", warningType: "设备图像识别预警", subTypes: ["物品形态变化"] },
  { ruleName: "GPS怠速滞留", warningType: "设备GPS预警", subTypes: ["怠速滞留"] },
  { ruleName: "挂锁密码错误", warningType: "智能挂锁预警", subTypes: ["密码错误"] },
  { ruleName: "人脸关锁通知", warningType: "人脸门禁预警", subTypes: ["关锁通知"] },
  { ruleName: "物联设备上线", warningType: "设备物联预警", subTypes: ["设备上线"] },
  { ruleName: "GPS设备移除", warningType: "设备GPS预警", subTypes: ["设备移除"] },
  { ruleName: "人脸设备离线", warningType: "人脸门禁预警", subTypes: ["设备离线"] },
  { ruleName: "车辆入侵监测", warningType: "设备图像识别预警", subTypes: ["车辆入侵"] },
  { ruleName: "GPS出围栏告警", warningType: "设备GPS预警", subTypes: ["出围栏"] },
]

export function formatTriggerCondition(subTypes: string[]): string {
  return subTypes.join("/")
}

export function pickSubTypesForWarningType(
  warningType: DeviceWarningType,
  count = 1
): string[] {
  const options = DEVICE_WARNING_SUB_TYPES[warningType] ?? []
  return options.slice(0, Math.max(1, count))
}
