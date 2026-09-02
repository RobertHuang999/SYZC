import { deviceWarningConfigsMock } from "../mock/device-warning-configs.mock"
import type { DeviceWarningConfigFormValues } from "../domain/types"
import { isDeviceOnlineSubType } from "../domain/constants"

const R14_MUTEX_MESSAGE =
  "设备上线通知需单独配置，不可与其他预警子类型组合"

export function validateDeviceWarningConfig(
  values: DeviceWarningConfigFormValues,
  editingConfigId?: string
): string | null {
  const ruleName = values.ruleName.trim()
  if (!ruleName) return "请输入规则名称"
  if (ruleName.length > 50) return "规则名称不能超过 50 个字符"

  const duplicateName = deviceWarningConfigsMock.some(
    (config) =>
      config.configId !== editingConfigId &&
      config.ruleName.trim().toLowerCase() === ruleName.toLowerCase() &&
      config.status !== "已失效"
  )
  if (duplicateName) return "规则名称在当前租户内已存在"

  if (values.warningSubTypes.length === 0 || values.warningSubTypes.every((item) => !item.trim())) {
    return "请选择至少一个预警子类型"
  }
  if (!values.severityLevelId) return "请选择预警等级"
  if (!values.newDeviceOnly && !values.selectedDevices.trim()) {
    return "请选择关联设备，或勾选“仅针对新设备”"
  }
  const normalizedSubTypes = values.warningSubTypes
    .map((item) => item.trim())
    .filter(Boolean)
  const onlineSubTypes = normalizedSubTypes.filter(isDeviceOnlineSubType)
  const nonOnlineSubTypes = normalizedSubTypes.filter((item) => !isDeviceOnlineSubType(item))

  if (onlineSubTypes.length > 0 && nonOnlineSubTypes.length > 0) {
    return R14_MUTEX_MESSAGE
  }
  if (values.newDeviceOnly) {
    if (onlineSubTypes.length !== 1 || normalizedSubTypes.length !== 1) {
      return "勾选「仅针对新设备」时，子类型必须且仅能选择对应的设备上线子类型"
    }
  }
  if (values.newDeviceOnly && !values.warningSubTypes.some(isDeviceOnlineSubType)) {
    return "仅针对新设备仅适用于设备上线子类型"
  }

  const duplicateScope = deviceWarningConfigsMock.some((config) => {
    if (config.configId === editingConfigId || config.status === "已失效") return false
    const sameScope = config.deviceScope === values.selectedDevices.trim()
    return sameScope && normalizedSubTypes.some((subType) => config.triggerCondition.includes(subType))
  })
  if (duplicateScope && !values.newDeviceOnly) {
    return "同一设备与预警子类型只能保留一条生效配置"
  }

  if (!values.newDeviceOnly && values.warningType.includes("物联")) {
    if (values.warningSubTypes.includes("温度异常")) {
      const t = values.metricThresholds?.temperature ?? { min: values.thresholdMin, max: values.thresholdMax }
      if (!t.min.trim() || !t.max.trim()) return "请完整填写温度异常的最低值和最高值"
      const min = Number(t.min)
      const max = Number(t.max)
      if (!Number.isFinite(min) || !Number.isFinite(max)) return "请输入合法的温度数值"
      if (min >= max) return "温度最低值必须小于最高值"
    }
    if (values.warningSubTypes.includes("湿度异常")) {
      const h = values.metricThresholds?.humidity
      if (h && (!h.min.trim() || !h.max.trim())) return "请完整填写湿度异常的最低值和最高值"
      if (h) {
        const min = Number(h.min)
        const max = Number(h.max)
        if (!Number.isFinite(min) || !Number.isFinite(max)) return "请输入合法的湿度数值"
        if (min < 0 || max > 100) return "湿度范围应在 0%RH ~ 100%RH 之间"
        if (min >= max) return "湿度最低值必须小于最高值"
      }
    }
    if (values.warningSubTypes.includes("CO2异常")) {
      const c = values.metricThresholds?.co2
      if (c && !c.max.trim()) return "请填写二氧化碳 (CO2) 浓度告警上限"
      if (c && c.max.trim()) {
        const max = Number(c.max)
        if (!Number.isFinite(max) || max <= 0) return "请输入合法的二氧化碳上限数值 (ppm)"
      }
    }
    if (values.warningSubTypes.includes("氧气异常")) {
      const o = values.metricThresholds?.oxygen
      if (o && (!o.min.trim() || !o.max.trim())) return "请完整填写氧气浓度的安全区间"
      if (o && o.min.trim() && o.max.trim()) {
        const min = Number(o.min)
        const max = Number(o.max)
        if (!Number.isFinite(min) || !Number.isFinite(max)) return "请输入合法的氧气浓度数值 (%Vol)"
        if (min >= max) return "氧气浓度最低值必须小于最高值"
      }
    }
  }

  if (values.notifyTargets.length === 0) return "请选择预警对象"

  if (values.newDeviceOnly && values.upgradeEnabled) {
    return "仅针对新设备的全局规则不允许配置升级预警"
  }
  if (values.upgradeEnabled) {
    const days = Number(values.upgradeDays)
    if (!Number.isInteger(days) || days <= 0) return "升级预警天数必须为正整数"
    if (values.upgradeTargets.length === 0) return "请选择升级预警对象"
  }

  if (values.version !== null && values.version < 1) {
    return "配置版本无效，请刷新后重试"
  }

  return null
}
