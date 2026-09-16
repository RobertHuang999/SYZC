import type { ActiveOrderStrategy, OrderWarningConfigDetail } from "../domain/types"
import { DEFAULT_LTV_PARAMS, buildLtvDetailFields } from "../lib/ltv-utils"
import { getMockCurrentLtv } from "./order-options.mock"

type DetailExtension = Omit<
  OrderWarningConfigDetail,
  keyof import("../domain/types").OrderWarningConfig
>

const detailExtensions: Record<string, DetailExtension> = {
  "owc-001": {
    ruleUuid: "rule-ord-pkg-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    orderCustomer: "江苏某大宗商贸",
    ownerName: "张三",
    ownerPhone: "138****8000",
    goodsDetail: "电解铜 / 1# / 500吨",
    version: 2,
    activeStrategies: [
      {
        key: "priceDrop",
        name: "价格下跌监控",
        fields: [{ label: "下跌比例阈值", value: "10.00 %（较基准货物总价值）" }],
        severityLevelId: "sl-l3",
        notifyChannels: ["短信"],
        notifyTargets: ["张风控", "李客户经理"],
        upgradeStrategy: "持续未解除 3 天后 ➔ 升级通知 风控总监-赵总",
      },
      {
        key: "ltvDual",
        name: "抵/质押率双控预警",
        fields: buildLtvDetailFields(
          DEFAULT_LTV_PARAMS,
          getMockCurrentLtv("PO202608-01")
        ),
        severityLevelId: "sl-l3",
        notifyChannels: ["短信", "邮件"],
        notifyTargets: ["张风控", "王主管"],
        upgradeStrategy: "持续未解除 2 天后 ➔ 升级通知 业务副总裁",
      },
      {
        key: "inspection",
        name: "仓储巡检超期预警",
        fields: [
          {
            label: "巡检人配置",
            value: "孙巡检(仓管部)（每 7 天超期预警）；李四(仓管部)（每 14 天超期预警）",
          },
        ],
        inspectionRows: [
          {
            rowId: "insp-1",
            inspector: "孙巡检(仓管部)",
            cycleDays: "7",
          },
          {
            rowId: "insp-2",
            inspector: "李四(仓管部)",
            cycleDays: "14",
          },
        ],
        severityLevelId: "sl-l2",
        notifyTargets: ["仓储主管-王五"],
      },
    ],
    disabledStrategies: [
      "订单履约超时监控：未启用",
      "盘点账实差异告警：未启用",
      "贷中风控模型预警：未启用",
    ],
    invalidReason: null,
  },
  "owc-002": {
    ruleUuid: "rule-ord-supervision-002",
    orderCustomer: "某钢材贸易",
    ownerName: "李四",
    ownerPhone: "139****5678",
    goodsDetail: "大宗钢材 / HRB400 / 800吨",
    version: 1,
    activeStrategies: [
      {
        key: "inspection",
        name: "仓储巡检超期预警",
        fields: [
          {
            label: "巡检人配置",
            value: "孙巡检(仓管部)（每 14 天超期预警）",
          },
        ],
        inspectionRows: [
          {
            rowId: "insp-1",
            inspector: "孙巡检(仓管部)",
            cycleDays: "14",
          },
        ],
        severityLevelId: "sl-l3",
        notifyTargets: ["仓储主管-王五"],
      },
      {
        key: "timeout",
        name: "监管服务超时监控",
        fields: [],
        timeoutRows: [
          {
            rowId: "batch-steel-800",
            batchId: "batch-steel-800",
            warningType: "监管服务超时",
            qrCode: "QR-ST-20260810-001",
            goodsLabel: "大宗钢材 / HRB400 / 800吨",
            pledgedAt: "2026-08-10 14:00",
            timeoutDays: "45",
            expectedTriggerAt: "2026-09-24 14:00",
          },
        ],
        severityLevelId: "sl-l2",
        notifyChannels: ["短信"],
        notifyTargets: ["张风控", "李客户经理"],
        upgradeStrategy: "持续未解除 5 天后 ➔ 升级通知 风控总监-赵总",
      },
    ],
    disabledStrategies: [
      "价格下跌监控：未启用",
      "抵/质押率双控预警：未启用",
      "盘点账实差异告警：未启用",
      "贷中风控模型预警：未启用",
    ],
    invalidReason: null,
  },
  "owc-005": {
    ruleUuid: "rule-ord-grain-005",
    orderCustomer: "粮油仓储公司",
    ownerName: "陈七",
    ownerPhone: "136****8899",
    goodsDetail: "大豆 / 国标一等 / 1200吨；玉米 / 二等 / 800吨",
    version: 1,
    activeStrategies: [
      {
        key: "timeout",
        name: "监管服务超时监控",
        fields: [],
        timeoutRows: [
          {
            rowId: "batch-soy-1200",
            batchId: "batch-soy-1200",
            warningType: "监管服务超时",
            qrCode: "QR-SOY-20260812-201",
            goodsLabel: "大豆 / 国标一等 / 1200吨",
            pledgedAt: "2026-08-12 08:00",
            timeoutDays: "30",
            expectedTriggerAt: "2026-09-11 08:00",
          },
          {
            rowId: "batch-corn-800",
            batchId: "batch-corn-800",
            warningType: "监管服务超时",
            qrCode: "QR-CORN-20260812-202",
            goodsLabel: "玉米 / 二等 / 800吨",
            pledgedAt: "2026-08-12 08:30",
            timeoutDays: "25",
            expectedTriggerAt: "2026-09-06 08:30",
          },
        ],
        severityLevelId: "sl-l3",
        notifyChannels: [],
        notifyTargets: ["张风控"],
      },
      {
        key: "inventoryDiff",
        name: "盘点账实差异告警",
        fields: [{ label: "监听模式", value: "启用即监听" }],
        severityLevelId: "sl-l2",
        notifyTargets: ["仓储主管-王五"],
      },
    ],
    disabledStrategies: [
      "价格下跌监控：未启用",
      "抵/质押率双控预警：未启用",
      "仓储巡检超期预警：未启用",
      "贷中风控模型预警：未启用",
    ],
    invalidReason: null,
  },
  "owc-004": {
    ruleUuid: "rule-ord-expired-004",
    orderCustomer: "某铝业集团",
    ownerName: "赵六",
    ownerPhone: "139****1234",
    goodsDetail: "铝锭 / A00 / 200吨",
    version: 1,
    activeStrategies: [
      {
        key: "priceDrop",
        name: "价格下跌监控",
        fields: [{ label: "下跌比例阈值", value: "8.00 %" }],
        severityLevelId: "sl-l2",
        notifyChannels: [],
        notifyTargets: ["张风控"],
      },
      {
        key: "inventoryDiff",
        name: "盘点账实差异告警",
        fields: [{ label: "监听模式", value: "启用即监听" }],
        severityLevelId: "sl-l3",
        notifyTargets: ["仓储主管-王五"],
      },
    ],
    disabledStrategies: [
      "抵/质押率双控预警：未启用",
      "仓储巡检超期预警：未启用",
      "订单履约超时监控：未启用",
      "贷中风控模型预警：未启用",
    ],
    invalidReason: "关联订单已办结",
  },
}

function buildDefaultStrategies(
  enabledItems: { type: string; levels: string }[],
  orderNo: string
): ActiveOrderStrategy[] {
  const strategyMap: Record<string, ActiveOrderStrategy> = {
    跌价: {
      key: "priceDrop",
      name: "价格下跌监控",
      fields: [{ label: "下跌比例阈值", value: "10.00 %" }],
      severityLevelId: "sl-l3",
      notifyChannels: [],
      notifyTargets: ["张风控"],
    },
    抵质押率: {
      key: "ltvDual",
      name: "抵/质押率双控预警",
      fields: buildLtvDetailFields(DEFAULT_LTV_PARAMS, getMockCurrentLtv(orderNo)),
      severityLevelId: "sl-l3",
      notifyChannels: [],
      notifyTargets: ["张风控"],
    },
    巡检: {
      key: "inspection",
      name: "仓储巡检超期预警",
      fields: [
        {
          label: "巡检人配置",
          value: "孙巡检(仓管部)（每 7 天超期预警）",
        },
      ],
      inspectionRows: [
        {
          rowId: "insp-1",
          inspector: "孙巡检(仓管部)",
          cycleDays: "7",
        },
      ],
      severityLevelId: "sl-l2",
      notifyTargets: ["仓储主管"],
    },
    超时: {
      key: "timeout",
      name: "订单履约超时监控",
      fields: [{ label: "超时配置", value: "已配置二维码超时阈值" }],
      timeoutRows: [
        {
          rowId: "batch-demo",
          batchId: "batch-demo",
          warningType: "解抵押超时",
          qrCode: "QR-DEMO-001",
          goodsLabel: "示例货物 / 100吨",
          pledgedAt: "2026-08-01 08:00",
          timeoutDays: "30",
          expectedTriggerAt: "2026-08-31 08:00",
        },
      ],
      severityLevelId: "sl-l2",
      notifyChannels: [],
      notifyTargets: ["张风控"],
    },
    盘点: {
      key: "inventoryDiff",
      name: "盘点账实差异告警",
      fields: [{ label: "监听模式", value: "启用即监听" }],
      severityLevelId: "sl-l3",
      notifyTargets: ["仓储主管"],
    },
    贷中: {
      key: "midLoan",
      name: "贷中风控模型预警",
      fields: [{ label: "模型参数", value: "默认风控模型 v2" }],
      severityLevelId: "sl-l3",
      notifyTargets: ["风控专员"],
    },
  }

  return enabledItems
    .map((item) => strategyMap[item.type])
    .filter((item): item is ActiveOrderStrategy => item !== undefined)
}

const allDisabledLabels = [
  "订单履约超时监控：未启用",
  "抵/质押率双控预警：未启用",
  "仓储巡检超期预警：未启用",
  "盘点账实差异告警：未启用",
  "贷中风控模型预警：未启用",
  "价格下跌监控：未启用",
]

export function getOrderWarningConfigDetailExtension(
  configId: string,
  config: import("../domain/types").OrderWarningConfig
): DetailExtension {
  if (detailExtensions[configId]) {
    return detailExtensions[configId]
  }

  const activeKeys = new Set(
    buildDefaultStrategies(config.enabledItems, config.orderNo).map((s) => s.name)
  )
  const disabledStrategies = allDisabledLabels.filter(
    (label) => !activeKeys.has(label.split("：")[0] ?? "")
  )

  const [ownerName = "货主", goodsName = "货物"] =
    config.ownerGoodsSummary.split("/")

  return {
    ruleUuid: `rule-${configId}-uuid`,
    orderCustomer: "示例客户公司",
    ownerName,
    ownerPhone: "138****0000",
    goodsDetail: `${goodsName} / 规格 / 100吨`,
    version: 1,
    activeStrategies: buildDefaultStrategies(config.enabledItems, config.orderNo),
    disabledStrategies:
      disabledStrategies.length > 0
        ? disabledStrategies.slice(0, 3)
        : ["暂无未启用策略"],
    invalidReason: config.status === "已失效" ? "关联订单已办结" : null,
  }
}
