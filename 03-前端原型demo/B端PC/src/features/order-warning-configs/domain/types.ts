export const ORDER_WARNING_ITEM_TYPES = [
  "超时",
  "跌价",
  "盘点",
  "巡检",
  "抵质押率",
  "贷中",
] as const

export type OrderWarningItemType = (typeof ORDER_WARNING_ITEM_TYPES)[number]

export type OrderType = "抵/质押" | "监管"

export type OrderWarningConfigStatus = "生效中" | "已失效"

export type OrderWarningItemBadge = {
  type: OrderWarningItemType
  levels: string
}

export type OrderWarningConfig = {
  configId: string
  ruleName: string
  orderNo: string
  orderType: OrderType
  ownerGoodsSummary: string
  enabledItems: OrderWarningItemBadge[]
  status: OrderWarningConfigStatus
  updatedAt: string
}

export type OrderWarningConfigFilters = {
  ruleName: string
  orderNo: string
  orderType: "全部" | OrderType
  enabledItems: OrderWarningItemType[]
  status: "全部" | OrderWarningConfigStatus
}

export type OrderWarningStrategyKey =
  | "priceDrop"
  | "ltvDual"
  | "inspection"
  | "timeout"
  | "inventoryDiff"
  | "midLoan"

export type TimeoutWarningType = "解抵/质押超时" | "解监管超时"

export type OrderGoodsBatch = {
  batchId: string
  qrCode: string
  goodsLabel: string
  pledgedAt: string
  defaultWarningType: TimeoutWarningType
}

export type TimeoutConfigRow = {
  rowId: string
  batchId: string
  warningType: TimeoutWarningType
  qrCode: string
  goodsLabel: string
  pledgedAt: string
  timeoutDays: string
  expectedTriggerAt: string | null
}

export type ActiveOrderStrategy = {
  key: OrderWarningStrategyKey
  name: string
  fields: { label: string; value: string }[]
  timeoutRows?: TimeoutConfigRow[]
  severityLevelId: string
  notifyChannels?: string[]
  notifyTargets?: string[]
  upgradeStrategy?: string
}

export type OrderWarningConfigDetail = OrderWarningConfig & {
  ruleUuid: string
  orderCustomer: string
  ownerName: string
  ownerPhone: string
  goodsDetail: string
  version: number
  activeStrategies: ActiveOrderStrategy[]
  disabledStrategies: string[]
  invalidReason: string | null
  createdBy: string
  createdAt: string
}

export type OrderStrategyFormState = {
  enabled: boolean
  expanded: boolean
  severityLevelId: string
  notifyChannels: string[]
  notifyTargets: string[]
  upgradeEnabled: boolean
  upgradeDays: string
  upgradeTargets: string[]
  params: Record<string, string>
  timeoutRows: TimeoutConfigRow[]
}

export type OrderWarningConfigFormValues = {
  ruleName: string
  orderNo: string
  orderType: OrderType | ""
  ownerName: string
  ownerPhone: string
  goodsDetail: string
  version: number | null
  strategies: Record<OrderWarningStrategyKey, OrderStrategyFormState>
}
