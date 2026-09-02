import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const collateralWarningDetailH5Annotations: PrototypeAnnotation[] = [
  {
    id: "h5-collateral-warning-detail-header",
    targetId: "h5-collateral-warning-detail-header",
    number: 1,
    kind: "页面",
    title: "移动端 · 押品预警详情与穿透溯源",
    content: "展示订单风险事实快照、LTV质押率与跌价指标计算、物联穿透事实及处置流转历史。",
    details: [
      {
        title: "生命周期与处置流程图",
        items: [
          {
            label: "业务流转",
            content: `flowchart TD
    A["商业规则命中 / IoT事件穿透"] --> B["未处理(有效)"]
    B -->|"单据补仓 / 物联核销"| C["已处理(有效)"]
    B -->|"订单结清 / 规则失效"| D["未处理(无效)"]
    C -->|"高危审核通过"| E["风险公示"]`,
          },
        ],
      },
      {
        title: "处置路径分流",
        items: [
          {
            label: "商业类预警",
            content: "引导前往抵质押订单单据完成补仓或赎货解除。",
          },
          {
            label: "物联穿透类",
            content: "引导前往设备预警核销现场物理告警后联动解除。",
          },
        ],
      },
    ],
  },
  {
    id: "h5-collateral-warning-detail-base",
    targetId: "h5-collateral-warning-detail-base",
    number: 2,
    kind: "字段",
    title: "订单基本信息与风险分类",
    content: "展示预警订单号、订单类型（抵押/质押/监管）、预警类型及预警等级色块。",
    details: [
      {
        title: "字段清单",
        items: [
          {
            label: "预警订单号",
            content: "业务单据编号（如 PO202608-01），支持一键复制。",
          },
          {
            label: "预警等级",
            content: "03/01 字典等级快照（如 L4 严重风险 / L5 紧急危险）。",
          },
        ],
      },
    ],
  },
  {
    id: "h5-collateral-warning-detail-facts",
    targetId: "h5-collateral-warning-detail-facts",
    number: 3,
    kind: "规则",
    title: "预警事实与风控计算公式",
    content: "展示触发指标快照及 LTV 质押率与跌价计算模型。",
    details: [
      {
        title: "风控公式",
        items: [
          {
            label: "LTV 质押率",
            content: "LTV = 贷款余额 ÷ (押品在库数量 × 市场实时估值)；警戒线 ≥ 75%，平仓线 ≥ 85%。",
          },
          {
            label: "跌幅比例",
            content: "跌幅 = (基准单价 - 当前估值) ÷ 基准单价 × 100%。",
          },
        ],
      },
    ],
  },
]
