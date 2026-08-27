import type {
  OrderWarningConfigFormValues,
  OrderWarningStrategyKey,
} from "../domain/types"
import { ORDER_STRATEGY_DEFINITIONS, MOCK_ORDERS } from "./detail-utils"
import { orderWarningConfigsMock } from "../mock/order-warning-configs.mock"
import { validateTimeoutRows } from "./timeout-config-utils"

function validateStrategy(
  key: OrderWarningStrategyKey,
  values: OrderWarningConfigFormValues
): string | null {
  const strategy = values.strategies[key]
  if (!strategy.enabled) return null
  if (!strategy.severityLevelId) return "每个已启用策略都必须选择预警等级"
  if (strategy.notifyTargets.length === 0) return `${key}策略请选择预警对象`

  if (strategy.upgradeEnabled) {
    const days = Number(strategy.upgradeDays)
    if (!Number.isInteger(days) || days <= 0) return `${key}策略升级天数必须为正整数`
    if (strategy.upgradeTargets.length === 0) return `${key}策略请选择升级对象`
  }

  if (key === "priceDrop") {
    const threshold = Number(strategy.params.dropThreshold)
    if (!Number.isFinite(threshold) || threshold <= 0 || threshold >= 100) {
      return "价格下跌阈值必须大于 0 且小于 100%"
    }
  }

  if (key === "ltvDual") {
    const marginCall = Number(strategy.params.marginCallLtv)
    const closeOut = Number(strategy.params.closeOutLtv)
    if (!Number.isFinite(marginCall) || !Number.isFinite(closeOut)) {
      return "请填写完整的抵/质押率阈值"
    }
    if (closeOut <= marginCall) return "平仓线必须高于补仓线"
    if (!strategy.params.releaseMethod?.trim()) return "请选择抵/质押率解除方式"
  }

  if (key === "inspection") {
    if (!strategy.params.inspector?.trim()) return "请填写巡检人"
    const cycleDays = Number(strategy.params.cycleDays)
    if (!Number.isInteger(cycleDays) || cycleDays <= 0) return "巡检周期必须为正整数"
  }

  if (key === "timeout") {
    if (!values.orderNo) return "请先选择关联订单"
    const timeoutError = validateTimeoutRows(strategy.timeoutRows)
    if (timeoutError) return timeoutError
  }

  if (key === "midLoan" && !strategy.params.modelVersion?.trim()) {
    return "请选择贷中风控模型"
  }

  return null
}

export function validateOrderWarningConfig(
  values: OrderWarningConfigFormValues,
  editingConfigId?: string
): string | null {
  const ruleName = values.ruleName.trim()
  if (!ruleName) return "请输入规则名称"
  if (ruleName.length > 50) return "规则名称不能超过 50 个字符"
  if (!values.orderNo) return "请选择关联订单"

  const order = MOCK_ORDERS.find((item) => item.orderNo === values.orderNo)
  if (!order) return "关联订单不存在或已失效"

  const duplicateOrder = orderWarningConfigsMock.some(
    (config) =>
      config.configId !== editingConfigId &&
      config.orderNo === values.orderNo &&
      config.status === "生效中"
  )
  if (duplicateOrder) return "该订单已有生效中的预警配置，不能重复配置"

  const duplicateName = orderWarningConfigsMock.some(
    (config) =>
      config.configId !== editingConfigId &&
      config.ruleName.trim().toLowerCase() === ruleName.toLowerCase() &&
      config.status === "生效中"
  )
  if (duplicateName) return "规则名称在当前租户内已存在"

  const enabledDefinitions = ORDER_STRATEGY_DEFINITIONS.filter(
    (definition) => values.strategies[definition.key].enabled
  )
  if (enabledDefinitions.length === 0) return "请至少启用一项预警策略"

  for (const definition of enabledDefinitions) {
    if (definition.disabledForSupervision && order.orderType === "监管") {
      return `${definition.name}不适用于监管订单`
    }
    const error = validateStrategy(definition.key, values)
    if (error) return error
  }

  if (values.version !== null && values.version < 1) {
    return "配置版本无效，请刷新后重试"
  }

  return null
}
