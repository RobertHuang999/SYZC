export const DEVICE_WARNING_TYPES = [
  "设备图像识别预警",
  "设备物联预警",
  "智能挂锁预警",
  "人脸门禁预警",
  "设备GPS预警",
] as const

export type DeviceWarningType = (typeof DEVICE_WARNING_TYPES)[number]

export type DeviceWarningConfigStatus = "生效中" | "停用" | "已失效"

export type DeviceWarningConfig = {
  configId: string
  ruleName: string
  warningType: DeviceWarningType
  severityLevelId: string
  deviceScope: string
  triggerCondition: string
  debounceCondition: string
  status: DeviceWarningConfigStatus
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export type DeviceWarningConfigFilters = {
  ruleName: string
  warningTypes: DeviceWarningType[]
  severityLevelIds: string[]
  status: "全部" | DeviceWarningConfigStatus
}

export type DebounceMode = "按持续时长判定" | "按连续超标次数判定" | "立即触发"
export type DebounceUnit = "分钟" | "秒"

export type DeviceWarningConfigDetail = DeviceWarningConfig & {
  ruleUuid: string
  warningSubTypes: string[]
  deviceScopeDetail: string
  newDeviceOnly: boolean
  monitorThresholdMin: number | null
  monitorThresholdMax: number | null
  monitorThresholdUnit: string | null
  debounceMode: DebounceMode
  debounceConditionDetail: string
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
  debounceMode: DebounceMode
  debounceValue: string
  debounceUnit: DebounceUnit
  notifyChannels: string[]
  notifyTargets: string[]
  upgradeEnabled: boolean
  upgradeDays: string
  upgradeTargets: string[]
  version: number | null
}
