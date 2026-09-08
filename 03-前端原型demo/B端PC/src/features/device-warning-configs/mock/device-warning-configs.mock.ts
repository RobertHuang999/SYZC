import type { DeviceWarningConfig } from "../domain/types"
import {
  DEVICE_WARNING_RULE_SCENARIOS,
  EXTRA_RULE_NAME_SAMPLES,
  formatTriggerCondition,
} from "../../shared/mock/device-warning-scenarios"
import { getRecommendedDisposition } from "../domain/disposition"

function scenarioToConfig(
  scenario: (typeof DEVICE_WARNING_RULE_SCENARIOS)[number],
  meta: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
  }
): DeviceWarningConfig {
  return {
    configId: scenario.configId,
    ruleName: scenario.ruleName,
    warningType: scenario.warningType,
    severityLevelId: scenario.severityLevelId,
    dispositionMode: scenario.dispositionMode,
    deviceScope: scenario.deviceScope,
    triggerCondition: scenario.triggerCondition,
    debounceCondition: scenario.debounceCondition,
    status: scenario.status,
    createdBy: meta.createdBy,
    createdAt: meta.createdAt,
    updatedBy: meta.updatedBy,
    updatedAt: meta.updatedAt,
  }
}

const curatedConfigs: DeviceWarningConfig[] = [
  scenarioToConfig(DEVICE_WARNING_RULE_SCENARIOS[0], {
    createdBy: "张工",
    createdAt: "08-18 09:20",
    updatedBy: "黄k",
    updatedAt: "2026-08-20 16:45:00",
  }),
  scenarioToConfig(DEVICE_WARNING_RULE_SCENARIOS[1], {
    createdBy: "张工",
    createdAt: "08-17 11:10",
    updatedBy: "张工",
    updatedAt: "2026-08-19 14:20:00",
  }),
  scenarioToConfig(DEVICE_WARNING_RULE_SCENARIOS[2], {
    createdBy: "李运维",
    createdAt: "08-16 15:30",
    updatedBy: "李运维",
    updatedAt: "2026-08-16 15:30:00",
  }),
  scenarioToConfig(DEVICE_WARNING_RULE_SCENARIOS[3], {
    createdBy: "李运维",
    createdAt: "08-10 10:00",
    updatedBy: "黄k",
    updatedAt: "2026-08-15 18:00:00",
  }),
  scenarioToConfig(DEVICE_WARNING_RULE_SCENARIOS[4], {
    createdBy: "系统",
    createdAt: "08-01 00:00",
    updatedBy: "系统",
    updatedAt: "2026-08-01 00:00:00",
  }),
  scenarioToConfig(DEVICE_WARNING_RULE_SCENARIOS[5], {
    createdBy: "张工",
    createdAt: "07-20 08:30",
    updatedBy: "系统",
    updatedAt: "2026-08-12 09:00:00",
  }),
  ...DEVICE_WARNING_RULE_SCENARIOS.slice(6).map((scenario, index) =>
    scenarioToConfig(scenario, {
      createdBy: index % 2 === 0 ? "李运维" : "张工",
      createdAt: `08-${String(12 + index).padStart(2, "0")} 10:00`,
      updatedBy: "张工",
      updatedAt: `2026-08-${String(12 + index).padStart(2, "0")} 12:00:00`,
    })
  ),
]

const severityCycle = ["sl-l1", "sl-l2", "sl-l3", "sl-l4", "sl-l5"] as const
const statusCycle = ["生效中", "生效中", "生效中", "停用", "生效中"] as const

function buildExtraConfigs(): DeviceWarningConfig[] {
  return EXTRA_RULE_NAME_SAMPLES.map((sample, index) => {
    const day = String(10 + (index % 10)).padStart(2, "0")
    const hour = String(8 + (index % 12)).padStart(2, "0")
    const status = statusCycle[index % statusCycle.length]
    const subTypes = sample.subTypes

    return {
      configId: `dwc-${String(index + 17).padStart(3, "0")}`,
      ruleName: sample.ruleName,
      warningType: sample.warningType,
      severityLevelId: severityCycle[index % severityCycle.length],
      dispositionMode: sample.dispositionMode ?? getRecommendedDisposition(subTypes),
      deviceScope: subTypes.includes("设备上线")
        ? "仅针对新设备（全局监听）"
        : `已选 ${3 + (index % 10)} 台设备`,
      triggerCondition: formatTriggerCondition(subTypes),
      debounceCondition: subTypes.some((item) =>
        [
          "开锁通知",
          "关锁通知",
          "设备上线",
          "设备移除",
          "拆壳",
          "锁杆被剪",
          "锁舌被卡",
          "非法开箱",
          "拆卡报警",
          "密码错误",
          "关锁异常",
          "非法拆除",
        ].includes(item)
      )
        ? "立即触发"
        : "持续>3分",
      status,
      createdBy: index % 2 === 0 ? "张工" : "李运维",
      createdAt: `08-${day} ${hour}:00`,
      updatedBy: index % 3 === 0 ? "黄k" : "张工",
      updatedAt: `2026-08-${day} ${hour}:30:00`,
    }
  })
}

export const deviceWarningRuleScenarioDetails = DEVICE_WARNING_RULE_SCENARIOS

export const deviceWarningConfigsMock: DeviceWarningConfig[] = [
  ...curatedConfigs,
  ...buildExtraConfigs(),
]
