import type { OrderWarningConfigFilters } from "./types"

export const DEFAULT_ORDER_WARNING_CONFIG_FILTERS: OrderWarningConfigFilters = {
  ruleName: "",
  orderNo: "",
  orderType: "全部",
  enabledItems: [],
  status: "全部",
}

export const ORDER_TYPE_OPTIONS = ["全部", "抵/质押", "监管"] as const

export const ORDER_WARNING_CONFIG_STATUS_OPTIONS = ["全部", "生效中", "已失效"] as const

export const PAGE_SIZE = 10

export const ORDER_WARNING_FOOTER_HINT =
  "物联穿透类订单预警不在此配置，由设备规则与空间穿透自动生成"
