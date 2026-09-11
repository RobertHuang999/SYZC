import { deviceWarningConfigsMock } from "../mock/device-warning-configs.mock"
import { getDeviceWarningConfigDetailExtension } from "../mock/device-warning-config-details.mock"
import type {
  DeviceWarningConfigDetail,
  DeviceWarningConfigFormValues,
} from "../domain/types"
import { getRecommendedDisposition } from "../domain/disposition"
import {
  DEFAULT_METRIC_THRESHOLDS,
  getMetricThresholdForSubType,
  getMetricThresholdKeyForSubType,
} from "../../shared/mock/device-warning-scenarios"

const VERSION_OVERRIDES_STORAGE_KEY = "SYZC_PC_DEVICE_WARNING_CONFIG_VERSIONS_V1"

function loadVersionOverrides(): Record<string, number> {
  try {
    const raw = sessionStorage.getItem(VERSION_OVERRIDES_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

let versionOverrides = loadVersionOverrides()

function persistVersionOverrides() {
  try {
    sessionStorage.setItem(
      VERSION_OVERRIDES_STORAGE_KEY,
      JSON.stringify(versionOverrides)
    )
  } catch {
    /* ignore */
  }
}

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
    base.status,
    base.subTypes ?? []
  )

  return {
    ...base,
    ...extension,
    version: versionOverrides[base.configId] ?? extension.version,
  }
}

export function incrementDeviceWarningConfigVersion(
  configId: string,
  currentVersion: number
): number {
  const nextVersion = Math.max(versionOverrides[configId] ?? currentVersion, currentVersion) + 1
  versionOverrides = { ...versionOverrides, [configId]: nextVersion }
  persistVersionOverrides()
  return nextVersion
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
  const metricThresholds = {
    temperature: {
      min: DEFAULT_METRIC_THRESHOLDS.temperature.min.toString(),
      max: DEFAULT_METRIC_THRESHOLDS.temperature.max.toString(),
    },
    humidity: {
      min: DEFAULT_METRIC_THRESHOLDS.humidity.min.toString(),
      max: DEFAULT_METRIC_THRESHOLDS.humidity.max.toString(),
    },
    co2: {
      min: DEFAULT_METRIC_THRESHOLDS.co2.min.toString(),
      max: DEFAULT_METRIC_THRESHOLDS.co2.max.toString(),
    },
    oxygen: {
      min: DEFAULT_METRIC_THRESHOLDS.oxygen.min.toString(),
      max: DEFAULT_METRIC_THRESHOLDS.oxygen.max.toString(),
    },
  }
  const metricSubType = detail.warningSubTypes.find((subType) =>
    getMetricThresholdForSubType(subType)
  )
  const metricKey = metricSubType
    ? getMetricThresholdKeyForSubType(metricSubType)
    : undefined
  if (metricKey) {
    metricThresholds[metricKey] = {
      min: detail.monitorThresholdMin?.toString() ?? metricThresholds[metricKey].min,
      max: detail.monitorThresholdMax?.toString() ?? metricThresholds[metricKey].max,
    }
  }

  return {
    ruleName: detail.ruleName,
    warningType: detail.warningType,
    warningSubTypes: detail.warningSubTypes,
    dispositionMode: detail.dispositionMode,
    severityLevelId: detail.severityLevelId,
    warehouseFilter: "一号大宗钢材仓",
    selectedDevices: detail.deviceScope,
    newDeviceOnly: detail.newDeviceOnly,
    thresholdMin: detail.monitorThresholdMin?.toString() ?? "",
    thresholdMax: detail.monitorThresholdMax?.toString() ?? "",
    metricThresholds,
    notifyChannels: detail.notifyChannels,
    notifyTargets: detail.notifyTargets,
    upgradeEnabled: detail.upgradeStrategy !== null,
    upgradeDays: detail.upgradeStrategy?.includes("3") ? "3" : "1",
    upgradeTargets: detail.upgradeStrategy ? ["王总监(风控部)"] : [],
    version: detail.version,
  }
}

export function createEmptyFormValues(): DeviceWarningConfigFormValues {
  const defaultSubTypes = ["温度异常"]
  return {
    ruleName: "",
    warningType: "设备物联预警",
    warningSubTypes: defaultSubTypes,
    dispositionMode: getRecommendedDisposition(defaultSubTypes),
    severityLevelId: "sl-l3",
    warehouseFilter: "",
    selectedDevices: "",
    newDeviceOnly: false,
    thresholdMin: "-5",
    thresholdMax: "35",
    metricThresholds: {
      temperature: { min: "-5", max: "35" },
      humidity: { min: "30", max: "80" },
      co2: { min: "400", max: "1500" },
      oxygen: { min: "18.0", max: "23.5" },
    },
    notifyChannels: [],
    notifyTargets: [],
    upgradeEnabled: false,
    upgradeDays: "",
    upgradeTargets: [],
    version: null,
  }
}
