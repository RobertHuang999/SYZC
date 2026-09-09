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
    title: "预警基本事实与关键字段",
    content: "展示预警订单号、规则名称、预警类型、预警等级、来源渠道、公示状态、预警时间及预警内容。",
    details: [
      {
        title: "核心字段定义与数据源头",
        items: [
          {
            label: "预警订单 (orderNo)",
            content: "业务单据编号（如 PO202608-01），支持一键复制单号并支持跨模块查询。",
          },
          {
            label: "规则名称 (ruleName)",
            content: "触发预警时刻固化的风控规则名称快照（如“铜价下跌监控”）。",
          },
          {
            label: "预警类型 (warningType)",
            content: "6.2 收敛的 7 大预警类型之一（解抵/质押/监管超时、价格下跌、盘点异常、巡检异常、抵/质押率异常、贷中风控预警、物联穿透告警）。",
          },
          {
            label: "预警等级",
            content: "03/01 预警等级字典快照（如 L4 严重风险 / L5 紧急危险），展示对应彩色色块与等级编码。",
          },
          {
            label: "来源渠道 (warningSource)",
            content: "订单配置触发 (ORDER_CONFIG) 或 物联穿透 (IOT_PENETRATION)。",
          },
          {
            label: "是否公示 (publicityStatus)",
            content: "未公示、已公示、已取消；已处理（有效）记录支持发起公示风险。",
          },
          {
            label: "预警时间 (warningTime)",
            content: "预警实际发生的系统落账时间（YYYY-MM-DD HH:mm:ss）。",
          },
          {
            label: "预警内容 (warningContent)",
            content: "风控引擎拼装的标准化参数事实描述。",
          },
          {
            label: "预警抓拍图",
            content: "现场监控设备联动抓拍画面，点击弹出图片预览 Modal 查看。",
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
    content: "展示参数化预警内容（含触发指标、实际值与阈值对比）、6 大商业类型判定标准及 LTV/跌价计算模型。",
    details: [
      {
        title: "字段来源机制",
        items: [
          {
            label: "货物位置与数量来源",
            content: "来源于订单项下的仓单/WMS货位台账（`orderSnapshot`），触发时刻固化不可变快照，锁定发生风险时的物理仓位与货品标的物明细。",
          },
          {
            label: "预警内容内嵌判定数据",
            content: "监控指标项、实际触发值、规则预警阈值、超标判定结果已内嵌拼接至 `warningContent` 标准模板文本，详情页不再单独展示结构化快照区块。",
          },
        ],
      },
      {
        title: "6 大商业类型预警内容模板",
        items: [
          {
            label: "类型判定矩阵",
            content: `1. 贷中风控：智风控评分 / 准入线 (60分)
2. 抵质押率：当前 LTV / 平仓线 (85%) / 补仓线 (75%)
3. 价格下跌：现货价格跌幅 / 预警阈值 (-12%)
4. 盘点异常：账实盘点差异率 / 允许公差 (2%)
5. 巡检异常：例行巡检时效 / 计划时限
6. 业务超时：存续期限 / 约定期限
7. 物联穿透：现场传感器物理异常联动`,
          },
        ],
      },
      {
        title: "风控计算公式",
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
