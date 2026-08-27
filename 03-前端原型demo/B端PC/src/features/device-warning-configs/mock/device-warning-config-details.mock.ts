import type { DeviceWarningConfigDetail } from "../domain/types"

type DetailExtension = Omit<
  DeviceWarningConfigDetail,
  keyof import("../domain/types").DeviceWarningConfig
>

const detailExtensions: Record<string, DetailExtension> = {
  "dwc-002": {
    ruleUuid: "rule-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    warningSubTypes: ["温度异常"],
    deviceScopeDetail: "一号大宗钢材仓 · DEV-IOT-01 ~ DEV-IOT-06",
    newDeviceOnly: false,
    monitorThresholdMin: -5,
    monitorThresholdMax: 35,
    monitorThresholdUnit: "℃",
    debounceMode: "按持续时长判定",
    debounceConditionDetail: "超标须持续超过 3 分钟才正式触发有效告警",
    notifyChannels: ["站内信", "短信"],
    notifyTargets: ["张主管(风控部)", "李四(仓管部)"],
    upgradeStrategy: "持续未解除 3 天后升级 ➔ 王总监(风控部)",
    version: 2,
    invalidReason: null,
  },
  "dwc-006": {
    ruleUuid: "rule-sensor-offline-001",
    warningSubTypes: ["物联传感器离线"],
    deviceScopeDetail: "二号冷链仓 · DEV-IOT-11 ~ DEV-IOT-13",
    newDeviceOnly: false,
    monitorThresholdMin: null,
    monitorThresholdMax: null,
    monitorThresholdUnit: null,
    debounceMode: "按持续时长判定",
    debounceConditionDetail: "离线须持续超过 5 分钟才正式触发有效告警",
    notifyChannels: ["站内信"],
    notifyTargets: ["张主管(风控部)"],
    upgradeStrategy: null,
    version: 3,
    invalidReason: "关联设备已全部移除",
  },
  "dwc-005": {
    ruleUuid: "rule-new-device-global-001",
    warningSubTypes: ["监控设备上线"],
    deviceScopeDetail: "全局监听（所有新接入监控设备）",
    newDeviceOnly: true,
    monitorThresholdMin: null,
    monitorThresholdMax: null,
    monitorThresholdUnit: null,
    debounceMode: "立即触发",
    debounceConditionDetail: "立即触发",
    notifyChannels: ["站内信"],
    notifyTargets: ["系统管理员"],
    upgradeStrategy: null,
    version: 1,
    invalidReason: null,
  },
  "dwc-003": {
    ruleUuid: "rule-lock-tamper-001",
    warningSubTypes: ["剪杆/拆壳破坏"],
    deviceScopeDetail: "三号监管仓 · LOCK-01 ~ LOCK-12",
    newDeviceOnly: false,
    monitorThresholdMin: null,
    monitorThresholdMax: null,
    monitorThresholdUnit: null,
    debounceMode: "立即触发",
    debounceConditionDetail: "立即触发",
    notifyChannels: ["站内信", "短信"],
    notifyTargets: ["李运维(设备部)", "张主管(风控部)"],
    upgradeStrategy: "持续未解除 1 天后升级 ➔ 王总监(风控部)",
    version: 1,
    invalidReason: null,
  },
}

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
  notifyChannels: ["站内信"],
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
  const base = detailExtensions[configId] ?? defaultExtension(configId, warningType)
  if (status === "已失效" && !base.invalidReason) {
    return { ...base, invalidReason: "规则已失效" }
  }
  return base
}
