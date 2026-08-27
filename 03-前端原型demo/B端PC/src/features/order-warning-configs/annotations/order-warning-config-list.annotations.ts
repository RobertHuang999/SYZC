import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const orderWarningConfigListAnnotations: PrototypeAnnotation[] = [
  {
    id: "order-warning-config-page",
    targetId: "order-warning-config-page",
    number: 1,
    kind: "页面",
    title: "订单预警配置定位与一站式多策略",
    content: "订单级商业/金融风控综合策略中枢，支持针对单个订单一站式配置 6 大类风控子策略与差异化预警等级。",
    details: [
      {
        title: "商业风控多策略流转图",
        items: [
          {
            label: "多策略流转图",
            content: `flowchart TD
    A["抵/质押或监管订单"] -->|"一站式多策略配置"| B["订单预警综合规则包"]
    B -->|"指标偏离触发"| C["02/02 押品预警信息 (6类告警)"]
    B -->|"勾选启用贷中风控预警"| D["02/03 贷中风控管理台账"]
    C -->|"订单结清/出库办结"| E["未处理流水自动置无效"]`,
          },
          {
            label: "业务定位",
            content: "一个订单对应一条有效综合规则（1:1）；规则内可同时激活并配置 1~6 个不同风控子项，避免分散建单。",
          },
        ],
      },
      {
        title: "与下游流水协同",
        items: [
          {
            label: "押品预警流水承接",
            content: "命中时固化当时规则版本、03/01 预警等级（ID/编码/名称/颜色/sort_order）及通知/升级策略快照。",
          },
          {
            label: "贷中风控台账同步",
            content: "勾选启用贷中风控预警项时，系统自动在【贷中风控管理】中同步生成或更新订单执行台账。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-filter",
    targetId: "order-warning-config-filter",
    number: 2,
    kind: "交互",
    title: "多维组合检索与新增入口",
    content: "支持规则名称、订单号、订单类型（抵押/质押/监管）、已启用预警项及规则状态组合筛选。",
    details: [
      {
        title: "筛选维度说明",
        items: [
          {
            label: "已启用预警项筛选",
            content: "可按超时、跌价、盘点、巡检、抵质押率、贷中风控快速筛选已开启特定风控项的订单配置。",
          },
          {
            label: "状态筛选",
            content: "生效中、已失效；订单办结或出库后规则自动转为【已失效】。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-table",
    targetId: "order-warning-config-table",
    number: 3,
    kind: "字段",
    title: "表格字段与策略画像汇总",
    content: "展示规则名称、关联订单、订单类型、已启用的风控子项 Tag、预警等级分布与生效状态。",
    details: [
      {
        title: "列定义与展示规范",
        items: [
          {
            label: "已启用预警项 Tag 汇总",
            content: "聚合展示当前订单生效中的风控策略（如【超时】【跌价】【抵质押率】），支持悬浮查看具体阈值参数。",
          },
          {
            label: "预警等级分布",
            content: "展示各子项绑定的 03/01 预警等级色块，直观反映该订单的风险敏感度档位。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-row-actions",
    targetId: "order-warning-config-table",
    number: 4,
    kind: "交互",
    title: "行操作控制与软删除保护",
    content: "提供【编辑】与【删除】操作，受 R-RISK-MGR 权限控制与未处理告警联动约束。",
    details: [
      {
        title: "操作与联动约束",
        items: [
          {
            label: "编辑限制",
            content: "已失效规则禁止编辑；编辑保存后生成新 Version 并幂等同步风控判定引擎。",
          },
          {
            label: "删除联动",
            content: "软删除后该订单所有未处理押品预警自动置为【未处理（无效）】，终止超时升级定时器，历史已处理流水不受影响。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-pagination",
    targetId: "order-warning-config-pagination",
    number: 5,
    kind: "交互",
    title: "分页与页容量设置",
    content: "标准分页组件，支持 10/20/50 条每页切换。",
    details: [
      {
        title: "分页规范",
        items: [
          {
            label: "重置行为",
            content: "检索条件变更或切换分页尺寸时自动重置至第 1 页展示。",
          },
        ],
      },
    ],
  },
]
