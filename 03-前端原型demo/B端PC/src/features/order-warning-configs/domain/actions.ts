import type { OrderWarningConfigStatus } from "./types"

export const ORDER_WARNING_CONFIG_STATUS_BADGE_CLASS: Record<
  OrderWarningConfigStatus,
  string
> = {
  生效中: "border-emerald-200 bg-emerald-50 text-emerald-700",
  已失效: "border-orange-200 bg-orange-50 text-orange-700",
}

export type OrderWarningConfigAction = "edit" | "detail" | "delete"

export function getOrderWarningConfigActions(
  status: OrderWarningConfigStatus
): OrderWarningConfigAction[] {
  return status === "生效中" ? ["edit", "detail", "delete"] : ["detail", "delete"]
}

export const ORDER_WARNING_ITEM_BADGE_CLASS: Record<string, string> = {
  超时: "border-sky-200 bg-sky-50 text-sky-700",
  跌价: "border-rose-200 bg-rose-50 text-rose-700",
  盘点: "border-violet-200 bg-violet-50 text-violet-700",
  巡检: "border-blue-200 bg-blue-50 text-blue-700",
  抵质押率: "border-amber-200 bg-amber-50 text-amber-700",
  贷中: "border-teal-200 bg-teal-50 text-teal-700",
}
