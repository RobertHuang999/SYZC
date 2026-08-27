import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const collateralWarningDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "collateral-warning-detail-header",
    targetId: "collateral-warning-detail-header",
    number: 1,
    kind: "页面",
    title: "押品预警详情与处置流转",
    content: "展示订单级风险事实、动态风控计算指标、物联穿透关联详情与处置公示全流程。",
    details: [
      {
        title: "预警生命周期与处置流程图",
        items: [
          {
            label: "业务流转图",
            content: `┌──────────────────┐     规则命中/物联穿透     ┌──────────────────┐     商业类单据处置/物联核销     ┌──────────────────┐
│  商业规则/IoT事件 │ ──────────────────────> │  未处理(有效)    │ ──────────────────────────────> │  已处理(有效)    │
└──────────────────┘                          └──────────────────┘                                └──────────────────┘
                                                       │                                                   │
                                                       │ 订单结清/规则失效                                 │ 满足公示条件
                                                       v                                                   v
                                              ┌──────────────────┐                                ┌──────────────────┐
                                              │  未处理(无效)    │                                │     风险公示     │
                                              └──────────────────┘                                └──────────────────┘`,
          },
          {
            label: "处置路径分流",
            content: "商业类预警引导跳转抵质押订单单据完成补仓/解押；物联穿透类需跳转设备预警核销物理告警后联动解除。",
          },
        ],
      },
      {
        title: "上下游依赖与数据快照",
        items: [
          {
            label: "订单与估值上游",
            content: "关联订单主数据、仓单数据与大宗商品实时行情估值模型，计算质押率与跌价幅度。",
          },
          {
            label: "下游风险公示",
            content: "高危处置记录审核通过后投递至风险公示模块，公示状态实时回写押品预警流水。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-detail-base",
    targetId: "collateral-warning-detail-base",
    number: 2,
    kind: "字段",
    title: "订单基本信息与风险分类",
    content: "展示预警订单编号、订单类型、预警类型分类、预警等级快照与触发规则归属。",
    details: [
      {
        title: "核心字段定义",
        items: [
          {
            label: "预警订单号",
            content: "关联的抵质押业务单据编号（如 PO202608-01），支持跨模块穿透。",
          },
          {
            label: "订单类型",
            content: "抵/质押订单、监管订单、标准仓单质押等不同供应链金融模式。",
          },
          {
            label: "预警类型 / 等级",
            content: "7 大预警类型之一；等级展示 03/01 启用档快照（如 L4 严重风险 / L5 紧急危险）。",
          },
          {
            label: "预警来源",
            content: "订单配置触发 (ORDER_CONFIG) 或 物联穿透 (IOT_PENETRATION)。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-detail-facts",
    targetId: "collateral-warning-detail-facts",
    number: 3,
    kind: "规则",
    title: "预警事实与风控计算公式",
    content: "展示参数化模板文本、触发时指标快照与质押率（LTV）/跌价实时计算公式。",
    details: [
      {
        title: "风控公式与参数快照",
        items: [
          {
            label: "质押率（LTV）计算公式",
            content: `LTV = 贷款余额 ÷ 押品实时总市值
其中：押品实时总市值 = 押品在库数量 × 当前市场估值单价
预警条件：
• 警戒线预警：LTV ≥ 预警线（如 75%）
• 平仓线告警：LTV ≥ 平仓线（如 85%）`,
          },
          {
            label: "跌价幅度计算公式",
            content: `跌幅比例 = (基准估值单价 - 当前市场估值单价) ÷ 基准估值单价 × 100%
预警条件：跌幅比例 ≥ 配置跌幅阈值（如 15%）`,
          },
          {
            label: "预警抓拍凭证",
            content: "若存在安防或盘点联动抓拍，展示时效图片预览入口（受 P05 权限控制）。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-detail-penetration",
    targetId: "collateral-warning-detail-penetration",
    number: 4,
    kind: "规则",
    title: "物联穿透关联信息与核销约束",
    content: "展示触发穿透的物理设备编号、位置、抓拍画面与唯一核销流转路径。",
    details: [
      {
        title: "穿透机制与协同",
        items: [
          {
            label: "关联设备事件 ID",
            content: "精准关联至设备告警物理流水（如 dev-evt-2026082001），禁止使用设备编号模糊关联。",
          },
          {
            label: "禁止直接人工解除",
            content: "物联穿透告警禁止在押品详情页人工点击解除；必须前往设备预警详情页核销物理隐患，由系统发布 DeviceEventReleased 事件联动回写已处理。",
          },
          {
            label: "空间重合匹配",
            content: "仅当处于在押监管状态且物理空间完全重合（同仓同库区）的设备高危告警才触发押品穿透告警。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-detail-disposal",
    targetId: "collateral-warning-detail-disposal",
    number: 5,
    kind: "规则",
    title: "处置记录、留痕与风险公示",
    content: "展示处置时间、处理人、处置方式说明、公示状态与公示历史。",
    details: [
      {
        title: "合规处置与公示联动",
        items: [
          {
            label: "处置记录",
            content: "已处理（有效）状态下展示处理人、处理时间与处置说明（如已追加保证金 500 万元，LTV 降至 65%）。",
          },
          {
            label: "公示风险流程",
            content: "点击【公示风险】调起确认对话框，录入公示理由与公示范围，提交后进入风险公示审批流。",
          },
          {
            label: "已公示状态",
            content: "已公示记录展示公示流水号与发布时间，不提供重复公示入口。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-detail-actions",
    targetId: "collateral-warning-detail-header",
    number: 6,
    kind: "交互",
    title: "页头动作差异与权限控制",
    content: "根据预警来源与状态动态呈现【返回】、【解除预警】、【查看设备事件】、【公示风险】。",
    details: [
      {
        title: "动作矩阵",
        items: [
          {
            label: "商业类 · 未处理",
            content: "展示【解除预警】，点击跳转对应抵质押订单信息页进行处置。",
          },
          {
            label: "物联类 · 未处理",
            content: "展示【查看设备事件】，点击跳转设备预警详情页查看物理事实。",
          },
          {
            label: "已处理 · 未公示",
            content: "展示【公示风险】，具备 R-RISK-MGR 权限人员可点击发起单条风险公示。",
          },
        ],
      },
    ],
  },
]
