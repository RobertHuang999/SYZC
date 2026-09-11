import type { DeviceWarningConfigDetail } from "../domain/types"
import {
  DEVICE_WARNING_RULE_SCENARIOS,
  getMetricThresholdForSubType,
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
  const metricThreshold = scenario.warningSubTypes
    .map((subType) =>
      getMetricThresholdForSubType(subType, scenario.metricThresholds)
    )
    .find((threshold) => threshold)

  return {
    ruleUuid: `rule-${scenario.configId}-uuid`,
    warningSubTypes: [...scenario.warningSubTypes],
    deviceScopeDetail:
      scenario.deviceScope === "仅针对新设备（全局监听）"
        ? "全局监听（所有新接入同类设备）"
        : `${scenario.ruleName} · ${scenario.deviceScope}`,
    newDeviceOnly: isOnlineOnly,
    monitorThresholdMin: metricThreshold?.min ?? null,
    monitorThresholdMax: metricThreshold?.max ?? null,
    monitorThresholdUnit: metricThreshold?.unit ?? null,
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
  warningSubTypes: string[]
): DetailExtension => ({
  ...(() => {
    const metricThreshold = warningSubTypes
      .map((subType) => getMetricThresholdForSubType(subType))
      .find((threshold) => threshold)
    return {
      monitorThresholdMin: metricThreshold?.min ?? null,
      monitorThresholdMax: metricThreshold?.max ?? null,
      monitorThresholdUnit: metricThreshold?.unit ?? null,
    }
  })(),
  ruleUuid: `rule-${configId}-uuid`,
  warningSubTypes: warningSubTypes.length > 0 ? warningSubTypes : ["默认子类型"],
  deviceScopeDetail: "示例仓库 · DEV-001 ~ DEV-003",
  newDeviceOnly: false,
  // 物联事件只有明确匹配到数值型子类型时才展示阈值，避免把 CO2 等指标误标成温度。
  notifyChannels: [],
  notifyTargets: ["张主管(风控部)"],
  upgradeStrategy: "持续未解除 3 天后升级 ➔ 王总监(风控部)",
  version: 1,
  invalidReason: null,
})

export function getDeviceWarningConfigDetailExtension(
  configId: string,
  status: string,
  warningSubTypes: string[] = []
): DetailExtension {
  const scenario = RULE_SCENARIO_BY_ID[configId]
  const base =
    detailExtensions[configId] ??
    (scenario
      ? buildScenarioExtension(scenario)
      : defaultExtension(configId, warningSubTypes))

  if (status === "已失效" && !base.invalidReason) {
    return { ...base, invalidReason: "规则已失效" }
  }
  return base
}
