import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const orderWarningConfigDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "order-warning-config-detail-header",
    targetId: "order-warning-config-detail-header",
    number: 1,
    kind: "页面",
    title: "订单预警配置详情与多策略视图",
    content: "展示单个订单绑定的综合风控策略全貌、各启用子项的阈值、等级与通知升级矩阵。",
    details: [
      {
        title: "页面定位与操作",
        items: [
          {
            label: "页头操作",
            content: "提供【返回】、【编辑】与【删除】操作；已失效状态下仅支持返回或删除。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-detail-base",
    targetId: "order-warning-config-detail-base",
    number: 2,
    kind: "字段",
    title: "基础识别与订单主体信息",
    content: "展示规则 UUID、规则名称、关联订单编号、订单业务类型、借款货主企业、联系电话与押品物料明细。",
    details: [
      {
        title: "关联订单字段",
        items: [
          {
            label: "订单类型",
            content: "【抵押】【质押】【监管】；类型决定可选风控卡片（监管订单不适用质押率与贷中风控）。",
          },
          {
            label: "押品物料明细",
            content: "展示品名、规格、总重量/吨数及质押初始估值。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-detail-strategies",
    targetId: "order-warning-config-detail-strategies",
    number: 3,
    kind: "规则",
    title: "六大风控策略子项与阈值参数",
    content: "卡片化分块展示已启用的各类风控策略的具体判定条件与通知升级参数。",
    details: [
      {
        title: "各策略子项规格说明",
        items: [
          {
            label: "01 超时预警",
            content: "展示解押/监管到期提前预警天数及多行节点超时配置表格。",
          },
          {
            label: "02 价格下跌预警",
            content: "展示跌价警戒阈值（如较初押均价下跌 >= 15%）与绑定的严重度等级。",
          },
          {
            label: "03 盘点异常预警",
            content: "展示盘亏率/差异率阈值（如账实差 >= 1.5%）与现场复核通知路径。",
          },
          {
            label: "04 巡检超期预警",
            content: "展示巡检周期（如每 7 天一次）及超期 T 天未打卡告警规则。",
          },
          {
            label: "05 抵/质押率预警",
            content: "双阈值模型：补仓线（如 LTV >= 75% 触发中危）与平仓线（如 LTV >= 85% 触发高危）。",
          },
          {
            label: "贷中风控预警",
            content: "展示绑定的智风控模型名称及模型拒绝时的告警策略，并联动贷中台账。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-detail-actions",
    targetId: "order-warning-config-detail-header",
    number: 4,
    kind: "交互",
    title: "页头操作与权限控制",
    content: "支持编辑与软删除，删除时二次确认并说明未处理流处置影响。",
    details: [
      {
        title: "权限与约束",
        items: [
          {
            label: "操作权限",
            content: "具备 R-RISK-MGR 权限人员可编辑和删除配置单据。",
          },
        ],
      },
    ],
  },
]
