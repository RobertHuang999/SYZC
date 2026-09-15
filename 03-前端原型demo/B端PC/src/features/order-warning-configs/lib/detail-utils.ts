import { orderWarningConfigsMock } from "../mock/order-warning-configs.mock"
import { getOrderWarningConfigDetailExtension } from "../mock/order-warning-config-details.mock"
import {
  MOCK_ORDERS,
  getMockCurrentLtv,
  getMockOrderByNo,
  type MockOrderOption,
} from "../mock/order-options.mock"
import type {
  OrderWarningConfigDetail,
  OrderWarningConfigFormValues,
  OrderWarningStrategyKey,
  OrderStrategyFormState,
  TimeoutConfigRow,
} from "../domain/types"
import {
  createTimeoutRowsFromBatches,
  formatTimeoutRowsForDetail,
} from "./timeout-config-utils"
import {
  DEFAULT_LTV_PARAMS,
  buildLtvDetailFields,
  parseLtvParamsFromDetailFields,
} from "./ltv-utils"

export const ORDER_STRATEGY_DEFINITIONS: {
  key: OrderWarningStrategyKey
  name: string
  defaultParams: Record<string, string>
}[] = [
  {
    key: "priceDrop",
    name: "价格下跌监控",
    defaultParams: { dropThreshold: "10" },
  },
  {
    key: "ltvDual",
    name: "抵/质押率双控预警",
    defaultParams: { ...DEFAULT_LTV_PARAMS },
  },
  {
    key: "inspection",
    name: "仓储巡检超期预警",
    defaultParams: { inspector: "现场监管员-刘强", cycleDays: "7" },
  },
  {
    key: "timeout",
    name: "订单履约超时监控",
    defaultParams: {},
  },
  {
    key: "inventoryDiff",
    name: "盘点账实差异告警",
    defaultParams: { mode: "启用即监听" },
  },
  {
    key: "midLoan",
    name: "贷中风控模型预警",
    defaultParams: { modelVersion: "默认风控模型 v2" },
  },
]

export function getOrderWarningConfigById(
  id: string | undefined
): OrderWarningConfigDetail | undefined {
  if (!id) {
    return undefined
  }

  const base = orderWarningConfigsMock.find((item) => item.configId === id)
  if (!base) {
    return undefined
  }

  const extension = getOrderWarningConfigDetailExtension(base.configId, base)
  return {
    ...base,
    ...extension,
    invalidReason: extension.invalidReason,
  }
}

export function getDetailHeaderActions(
  status: OrderWarningConfigDetail["status"]
): Array<"back" | "edit" | "delete"> {
  return status === "生效中" ? ["back", "edit", "delete"] : ["back", "delete"]
}

function createDefaultStrategyState(
  enabled = false,
  params: Record<string, string> = {},
  timeoutRows: TimeoutConfigRow[] = []
): OrderStrategyFormState {
  return {
    enabled,
    expanded: enabled,
    severityLevelId: "sl-l3",
    notifyChannels: [],
    notifyTargets: [],
    upgradeEnabled: false,
    upgradeDays: "",
    upgradeTargets: [],
    params,
    timeoutRows,
  }
}

export function createEmptyFormValues(): OrderWarningConfigFormValues {
  const strategies = ORDER_STRATEGY_DEFINITIONS.reduce(
    (acc, def) => {
      acc[def.key] = createDefaultStrategyState(false, { ...def.defaultParams })
      return acc
    },
    {} as Record<OrderWarningStrategyKey, OrderStrategyFormState>
  )

  return {
    ruleName: "",
    orderNo: "",
    orderType: "",
    ownerName: "",
    ownerPhone: "",
    goodsDetail: "",
    version: null,
    strategies,
  }
}

export function detailToFormValues(
  detail: OrderWarningConfigDetail
): OrderWarningConfigFormValues {
  const strategies = ORDER_STRATEGY_DEFINITIONS.reduce(
    (acc, def) => {
      const active = detail.activeStrategies.find((s) => s.key === def.key)
      acc[def.key] = createDefaultStrategyState(
        active !== undefined,
        { ...def.defaultParams }
      )
      if (active) {
        acc[def.key].severityLevelId = active.severityLevelId
        acc[def.key].notifyChannels = active.notifyChannels ?? []
        acc[def.key].notifyTargets = active.notifyTargets ?? []
        acc[def.key].upgradeEnabled = active.upgradeStrategy !== undefined
        acc[def.key].upgradeDays = active.upgradeStrategy?.includes("3")
          ? "3"
          : active.upgradeStrategy?.includes("2")
            ? "2"
            : ""
        acc[def.key].upgradeTargets = active.upgradeStrategy
          ? ["风控总监-赵总"]
          : []
        if (def.key === "timeout" && active.timeoutRows) {
          acc[def.key].timeoutRows = active.timeoutRows
        }
        if (def.key === "ltvDual") {
          acc[def.key].params = {
            ...acc[def.key].params,
            ...parseLtvParamsFromDetailFields(active.fields),
          }
        }
      }
      return acc
    },
    {} as Record<OrderWarningStrategyKey, OrderStrategyFormState>
  )

  return {
    ruleName: detail.ruleName,
    orderNo: detail.orderNo,
    orderType: detail.orderType,
    ownerName: detail.ownerName,
    ownerPhone: detail.ownerPhone,
    goodsDetail: detail.goodsDetail,
    version: detail.version,
    strategies,
  }
}

export { MOCK_ORDERS, getMockCurrentLtv, getMockOrderByNo, type MockOrderOption }
export { buildLtvDetailFields }

export function buildTimeoutRowsForOrder(
  orderNo: string,
  existingRows: TimeoutConfigRow[] = []
): TimeoutConfigRow[] {
  const order = getMockOrderByNo(orderNo)
  if (!order) {
    return existingRows
  }
  return createTimeoutRowsFromBatches(order.goodsBatches, existingRows)
}

export function formatNotifyChannels(channels: string[] | undefined): string {
  if (!channels || channels.length === 0) {
    return "—"
  }
  return channels.join("、")
}

export { formatTimeoutRowsForDetail }
