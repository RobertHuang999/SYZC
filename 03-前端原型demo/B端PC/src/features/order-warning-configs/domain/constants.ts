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

/** 6.2 外部通知渠道枚举（与 03/02 设备预警配置一致） */
export const NOTIFY_CHANNEL_OPTIONS = ["短信", "邮件"] as const
