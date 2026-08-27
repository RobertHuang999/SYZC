import { orderWarningConfigsMock } from "../mock/order-warning-configs.mock"
import { getOrderWarningConfigDetailExtension } from "../mock/order-warning-config-details.mock"
import type {
  OrderGoodsBatch,
  OrderType,
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

export const ORDER_STRATEGY_DEFINITIONS: {
  key: OrderWarningStrategyKey
  name: string
  disabledForSupervision?: boolean
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
    disabledForSupervision: true,
    defaultParams: {
      marginCallLtv: "75",
      closeOutLtv: "85",
      releaseMethod: "补仓、部分结清",
    },
  },
  {
    key: "inspection",
    name: "仓储巡检超期预警",
    defaultParams: { inspector: "现场监管员-刘强", cycleDays: "7" },
  },
  {
    key: "timeout",
    name: "解抵/质押/监管超时监控",
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
    disabledForSupervision: true,
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
  return { ...base, ...extension }
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
    notifyChannels: ["站内信"],
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
        acc[def.key].notifyChannels = active.notifyChannels ?? ["站内信"]
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

export type MockOrderOption = {
  orderNo: string
  orderType: OrderType
  customer: string
  ownerName: string
  ownerPhone: string
  goodsDetail: string
  goodsBatches: OrderGoodsBatch[]
}

export const MOCK_ORDERS: MockOrderOption[] = [
  {
    orderNo: "PO202608-1002",
    orderType: "抵/质押",
    customer: "江苏某大宗商贸",
    ownerName: "张三",
    ownerPhone: "138****8000",
    goodsDetail: "电解铜 / 1# / 500吨",
    goodsBatches: [
      {
        batchId: "batch-cu-500",
        qrCode: "QR-CU-20260801-001",
        goodsLabel: "电解铜 / 1# / 500吨",
        pledgedAt: "2026-08-01 08:00",
        defaultWarningType: "解抵/质押超时",
      },
    ],
  },
  {
    orderNo: "PO202608-1003",
    orderType: "抵/质押",
    customer: "华东金属贸易",
    ownerName: "孙九",
    ownerPhone: "137****6622",
    goodsDetail: "电解铜 / 1# / 300吨；电解铝 / A00 / 200吨",
    goodsBatches: [
      {
        batchId: "batch-cu-300",
        qrCode: "QR-CU-20260805-101",
        goodsLabel: "电解铜 / 1# / 300吨",
        pledgedAt: "2026-08-05 09:30",
        defaultWarningType: "解抵/质押超时",
      },
      {
        batchId: "batch-al-200",
        qrCode: "QR-AL-20260805-102",
        goodsLabel: "电解铝 / A00 / 200吨",
        pledgedAt: "2026-08-05 10:15",
        defaultWarningType: "解抵/质押超时",
      },
    ],
  },
  {
    orderNo: "PO202608-88",
    orderType: "监管",
    customer: "某钢材贸易",
    ownerName: "李四",
    ownerPhone: "139****5678",
    goodsDetail: "大宗钢材 / HRB400 / 800吨",
    goodsBatches: [
      {
        batchId: "batch-steel-800",
        qrCode: "QR-ST-20260810-001",
        goodsLabel: "大宗钢材 / HRB400 / 800吨",
        pledgedAt: "2026-08-10 14:00",
        defaultWarningType: "解监管超时",
      },
    ],
  },
  {
    orderNo: "PO202609-20",
    orderType: "监管",
    customer: "粮油仓储公司",
    ownerName: "陈七",
    ownerPhone: "136****8899",
    goodsDetail: "大豆 / 国标一等 / 1200吨；玉米 / 二等 / 800吨",
    goodsBatches: [
      {
        batchId: "batch-soy-1200",
        qrCode: "QR-SOY-20260812-201",
        goodsLabel: "大豆 / 国标一等 / 1200吨",
        pledgedAt: "2026-08-12 08:00",
        defaultWarningType: "解监管超时",
      },
      {
        batchId: "batch-corn-800",
        qrCode: "QR-CORN-20260812-202",
        goodsLabel: "玉米 / 二等 / 800吨",
        pledgedAt: "2026-08-12 08:30",
        defaultWarningType: "解监管超时",
      },
    ],
  },
]

export function getMockOrderByNo(orderNo: string): MockOrderOption | undefined {
  return MOCK_ORDERS.find((item) => item.orderNo === orderNo)
}

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

export { formatTimeoutRowsForDetail }
