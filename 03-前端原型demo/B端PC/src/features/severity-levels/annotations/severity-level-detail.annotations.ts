import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const severityLevelDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "severity-level-detail-header",
    targetId: "severity-level-detail-header",
    number: 1,
    kind: "页面",
    title: "预警等级详情与配置视图 · 全景引用画像",
    content: "展示单个等级档位的完整配置参数、标签颜色效果、同步穿透开关与下游规则引用画像。",
    details: [
      {
        title: "配置定位与下游引用关系",
        items: [
          {
            label: "引用画像流转图",
            content: `flowchart LR
    A["预警等级 (当前字典项)"] --> B["03/02 设备预警配置<br/>(绑定 severity_level_id)"]
    A --> C["03/03 订单预警配置<br/>(绑定补仓/平仓线等级)"]
    B --> D["02/01 设备预警事件<br/>(不可变等级快照)"]
    C --> E["02/02 押品预警事件<br/>(不可变等级快照)"]`,
          },
          {
            label: "业务意义",
            content: "用于管理员查看与核对当前等级字典的生效参数，确认穿透策略与下游规则绑定状态；若已有在途规则引用，删除操作将受到严格阻断保护。",
          },
        ],
      },
    ],
  },
  {
    id: "severity-level-detail-base",
    targetId: "severity-level-detail-base",
    number: 2,
    kind: "字段",
    title: "基本信息与显示属性清单",
    content: "展示序号、严重度排序值、等级编码、显示名称、Hex 颜色值、同步订单预警状态与等级说明。",
    details: [
      {
        title: "字段属性与业务口径",
        items: [
          {
            label: "严重度排序权重 (sort_order)",
            content: "数值越大代表越严重；在预警统计大屏与看板中按此权重排序与聚合着色。",
          },
          {
            label: "同步至订单预警 (sync_to_order_warn)",
            content: "【是】/【否】；开启后将作为设备事件触发物联穿透的关键前置判断条件之一。",
          },
          {
            label: "等级说明 (description)",
            content: "面向业务操作人员的指引说明（如【适用于物理破坏、明火烟雾、暴力破门等最高危告警】）。",
          },
        ],
      },
    ],
  },
  {
    id: "severity-level-detail-actions",
    targetId: "severity-level-detail-header",
    number: 3,
    kind: "交互",
    title: "页头操作与权限控制",
    content: "提供【返回】、【编辑】与【删除】操作，受配置管理员 R-SYS-ADMIN 权限控制。",
    details: [
      {
        title: "操作规范与保护机制",
        items: [
          {
            label: "编辑入口",
            content: "点击跳转编辑页，修改名称、颜色或开关；保存后立即对未来规则配置与新增事件生效。",
          },
          {
            label: "删除弹窗与防误删阻断",
            content: "点击弹出删除确认框，二次校验下游规则引用，存在引用时拦截并引导改停用；低于 2 档时强阻断。",
          },
        ],
      },
    ],
  },
]
