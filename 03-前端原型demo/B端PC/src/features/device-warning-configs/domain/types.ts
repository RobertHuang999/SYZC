export const DEVICE_WARNING_TYPES = [
  "设备图像识别预警",
  "设备物联预警",
  "智能挂锁预警",
  "人脸门禁预警",
  "设备GPS预警",
] as const

export type DeviceWarningType = (typeof DEVICE_WARNING_TYPES)[number]

export type DeviceWarningConfigStatus = "生效中" | "停用" | "已失效"

export type { DispositionMode } from "./disposition"

export type DeviceWarningConfig = {
  configId: string
  ruleName: string
  warningType: DeviceWarningType
  subTypes?: string[]
  severityLevelId: string
  dispositionMode: import("./disposition").DispositionMode
  deviceScope: string
  triggerCondition: string
  status: DeviceWarningConfigStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export type DeviceWarningConfigFilters = {
  ruleName: string
  warningTypes: DeviceWarningType[]
  subTypes: string[]
  severityLevelIds: string[]
  dispositionModes: import("./disposition").DispositionMode[]
  status: "全部" | DeviceWarningConfigStatus
}

export type DeviceWarningConfigDetail = DeviceWarningConfig & {
  ruleUuid: string
  warningSubTypes: string[]
  deviceScopeDetail: string
  newDeviceOnly: boolean
  monitorThresholdMin: number | null
  monitorThresholdMax: number | null
  monitorThresholdUnit: string | null
  notifyChannels: string[]
  notifyTargets: string[]
  upgradeStrategy: string | null
  version: number
  invalidReason: string | null
}

export type MetricThreshold = {
  min: string
  max: string
}

export type DeviceWarningConfigFormValues = {
  ruleName: string
  warningType: DeviceWarningType
  warningSubTypes: string[]
  dispositionMode: import("./disposition").DispositionMode
  severityLevelId: string
  warehouseFilter: string
  selectedDevices: string
  newDeviceOnly: boolean
  thresholdMin: string
  thresholdMax: string
  metricThresholds: {
    temperature: MetricThreshold
    humidity: MetricThreshold
    co2: MetricThreshold
    oxygen: MetricThreshold
  }
  notifyChannels: string[]
  notifyTargets: string[]
  upgradeEnabled: boolean
  upgradeDays: string
  upgradeTargets: string[]
  version: number | null
}
