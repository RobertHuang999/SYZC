import { getLtvRateLabel, type LtvOrderType } from "@/shared/lib/ltv-rate-label"

/** 02/02 预警类型枚举（7 大类之一，与订单类型无关） */
export const LTV_WARNING_TYPE_LABEL = "监管业务率异常"

export function formatLtvTriggerRatePhrase(
  orderType: LtvOrderType,
  rateValue: string
): string {
  return `当前${getLtvRateLabel(orderType)} ${rateValue}`
}

export function formatLtvMetricName(orderType: LtvOrderType): string {
  return `当前${getLtvRateLabel(orderType)}`
}
