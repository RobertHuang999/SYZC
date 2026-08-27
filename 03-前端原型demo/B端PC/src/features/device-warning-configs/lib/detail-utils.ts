import { deviceWarningConfigsMock } from "../mock/device-warning-configs.mock"
import { getDeviceWarningConfigDetailExtension } from "../mock/device-warning-config-details.mock"
import type {
  DeviceWarningConfigDetail,
  DeviceWarningConfigFormValues,
} from "../domain/types"

export function getDeviceWarningConfigById(
  id: string | undefined
): DeviceWarningConfigDetail | undefined {
  if (!id) {
    return undefined
  }

  const base = deviceWarningConfigsMock.find((item) => item.configId === id)
  if (!base) {
    return undefined
  }

  const extension = getDeviceWarningConfigDetailExtension(
    base.configId,
    base.warningType,
    base.status
  )

  return { ...base, ...extension }
}

export function formatNotifyChannels(channels: string[]): string {
  if (channels.length === 0) {
    return "—"
  }
  return channels.join("、")
}

export function formatNotifyTargets(targets: string[]): string {
  if (targets.length === 0) {
    return "—"
  }
  return targets.join("、")
}

export function formatMonitorThreshold(
  min: number | null,
  max: number | null,
  unit: string | null
): string {
  if (min === null && max === null) {
    return "—"
  }
  const unitLabel = unit ?? ""
  return `最低 ${min ?? "—"} ${unitLabel} | 最高 ${max ?? "—"} ${unitLabel}`
}

export function isGlobalNewDeviceRule(detail: DeviceWarningConfigDetail): boolean {
  return detail.newDeviceOnly
}

export function getDetailHeaderActions(
  status: DeviceWarningConfigDetail["status"]
): Array<"back" | "edit" | "disable" | "enable" | "delete"> {
  switch (status) {
    case "生效中":
      return ["back", "edit", "disable", "delete"]
    case "停用":
      return ["back", "edit", "enable", "delete"]
    case "已失效":
      return ["back", "delete"]
  }
}

export function detailToFormValues(
  detail: DeviceWarningConfigDetail
): DeviceWarningConfigFormValues {
  const debounceValue =
    detail.debounceMode === "立即触发"
      ? "0"
      : detail.debounceConditionDetail.includes("3")
        ? "3"
        : "5"

  return {
    ruleName: detail.ruleName,
    warningType: detail.warningType,
    warningSubTypes: detail.warningSubTypes,
    severityLevelId: detail.severityLevelId,
    warehouseFilter: "一号大宗钢材仓",
    selectedDevices: detail.deviceScope,
    newDeviceOnly: detail.newDeviceOnly,
    thresholdMin: detail.monitorThresholdMin?.toString() ?? "",
    thresholdMax: detail.monitorThresholdMax?.toString() ?? "",
    metricThresholds: {
      temperature: {
        min: detail.monitorThresholdMin?.toString() ?? "-5",
        max: detail.monitorThresholdMax?.toString() ?? "35",
      },
      humidity: { min: "30", max: "80" },
      co2: { min: "0", max: "1500" },
      oxygen: { min: "18.0", max: "23.5" },
    },
    debounceMode: detail.debounceMode,
    debounceValue,
    debounceUnit: detail.debounceConditionDetail.includes("秒") ? "秒" : "分钟",
    notifyChannels: detail.notifyChannels,
    notifyTargets: detail.notifyTargets,
    upgradeEnabled: detail.upgradeStrategy !== null,
    upgradeDays: detail.upgradeStrategy?.includes("3") ? "3" : "1",
    upgradeTargets: detail.upgradeStrategy ? ["王总监(风控部)"] : [],
    version: detail.version,
  }
}

export function createEmptyFormValues(): DeviceWarningConfigFormValues {
  return {
    ruleName: "",
    warningType: "设备物联预警",
    warningSubTypes: ["温度异常"],
    severityLevelId: "sl-l3",
    warehouseFilter: "",
    selectedDevices: "",
    newDeviceOnly: false,
    thresholdMin: "-5",
    thresholdMax: "35",
    metricThresholds: {
      temperature: { min: "-5", max: "35" },
      humidity: { min: "30", max: "80" },
      co2: { min: "0", max: "1500" },
      oxygen: { min: "18.0", max: "23.5" },
    },
    debounceMode: "按持续时长判定",
    debounceValue: "3",
    debounceUnit: "分钟",
    notifyChannels: ["站内信"],
    notifyTargets: [],
    upgradeEnabled: false,
    upgradeDays: "",
    upgradeTargets: [],
    version: null,
  }
}
