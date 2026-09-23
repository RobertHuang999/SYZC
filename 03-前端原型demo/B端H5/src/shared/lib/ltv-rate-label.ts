/** 订单类型 → 配置页/流水内容中的率指标展示名 */
export type LtvOrderType = "抵押" | "质押" | "监管服务" | ""

export function getLtvRateLabel(orderType: LtvOrderType): string {
  switch (orderType) {
    case "抵押":
      return "抵押率"
    case "质押":
      return "质押率"
    case "监管服务":
      return "监管业务率"
    default:
      return "监管业务率"
  }
}
