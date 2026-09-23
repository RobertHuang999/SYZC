import { getLtvRateLabel, type LtvOrderType } from "@/shared/lib/ltv-rate-label"

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
