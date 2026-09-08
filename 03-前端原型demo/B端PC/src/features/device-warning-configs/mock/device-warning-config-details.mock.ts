import type { DeviceWarningConfigDetail } from "../domain/types"
import {
  DEVICE_WARNING_RULE_SCENARIOS,
  RULE_SCENARIO_BY_ID,
} from "../../shared/mock/device-warning-scenarios"
import { resolveDispositionEffects } from "../domain/disposition"

type DetailExtension = Omit<
  DeviceWarningConfigDetail,
  keyof import("../domain/types").DeviceWarningConfig
>

function buildScenarioExtension(
  scenario: (typeof DEVICE_WARNING_RULE_SCENARIOS)[number]
): DetailExtension {
  const { hideUpgrade } = resolveDispositionEffects(scenario.dispositionMode)
  const isOnlineOnly =
    scenario.warningSubTypes.length === 1 && scenario.warningSubTypes[0] === "设备上线"
  const hasTemperature = scenario.warningSubTypes.includes("温度异常")

  return {
    ruleUuid: `rule-${scenario.configId}-uuid`,
    warningSubTypes: [...scenario.warningSubTypes],
    deviceScopeDetail:
      scenario.deviceScope === "仅针对新设备（全局监听）"
        ? "全局监听（所有新接入同类设备）"
        : `${scenario.ruleName} · ${scenario.deviceScope}`,
    newDeviceOnly: isOnlineOnly,
    monitorThresholdMin: hasTemperature ? -5 : null,
    monitorThresholdMax: hasTemperature ? 35 : null,
    monitorThresholdUnit: hasTemperature ? "℃" : null,
    debounceMode:
      scenario.debounceCondition === "立即触发" ? "立即触发" : "按持续时长判定",
    debounceConditionDetail:
      scenario.debounceCondition === "立即触发"
        ? "立即触发"
        : "超标须持续超过 3 分钟才正式触发有效告警",
    notifyChannels: ["短信"],
    notifyTargets:
      scenario.dispositionMode === "RECORD_ONLY"
        ? ["李运维(设备部)"]
        : ["张主管(风控部)", "李四(仓管部)"],
    upgradeStrategy:
      hideUpgrade || isOnlineOnly
        ? null
        : "持续未解除 3 天后升级 ➔ 王总监(风控部)",
    version: scenario.status === "已失效" ? 3 : 1,
    invalidReason: scenario.status === "已失效" ? "关联设备已全部移除" : null,
  }
}

const detailExtensions: Record<string, DetailExtension> = Object.fromEntries(
  DEVICE_WARNING_RULE_SCENARIOS.map((scenario) => [
    scenario.configId,
    buildScenarioExtension(scenario),
  ])
)

const defaultExtension = (
  configId: string,
  warningType: string
): DetailExtension => ({
  ruleUuid: `rule-${configId}-uuid`,
  warningSubTypes: ["默认子类型"],
  deviceScopeDetail: "示例仓库 · DEV-001 ~ DEV-003",
  newDeviceOnly: false,
  monitorThresholdMin: warningType.includes("物联") ? 0 : null,
  monitorThresholdMax: warningType.includes("物联") ? 100 : null,
  monitorThresholdUnit: warningType.includes("物联") ? "℃" : null,
  debounceMode: "按持续时长判定",
  debounceConditionDetail: "持续超过 3 分钟",
  notifyChannels: [],
  notifyTargets: ["张主管(风控部)"],
  upgradeStrategy: "持续未解除 3 天后升级 ➔ 王总监(风控部)",
  version: 1,
  invalidReason: null,
})

export function getDeviceWarningConfigDetailExtension(
  configId: string,
  warningType: string,
  status: string
): DetailExtension {
  const scenario = RULE_SCENARIO_BY_ID[configId]
  const base =
    detailExtensions[configId] ??
    (scenario ? buildScenarioExtension(scenario) : defaultExtension(configId, warningType))

  if (status === "已失效" && !base.invalidReason) {
    return { ...base, invalidReason: "规则已失效" }
  }
  return base
}
