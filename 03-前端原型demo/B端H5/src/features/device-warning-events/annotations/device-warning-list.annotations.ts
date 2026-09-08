import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const deviceWarningListAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-page",
    targetId: "device-warning-page",
    number: 1,
    kind: "页面",
    title: "移动端 · 设备预警列表",
    content: "设备侧事件流水只读列表，厂商预过滤回调后逐条独立落账；核心任务是筛选、查看单条事实并进入解除处置。",
    details: [
      {
        title: "逐条落账与穿透流程",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    V["设备厂商预过滤回调"] --> R["03/02 规则匹配 + Version 快照"]
    R --> L["02/01 逐条写入 iot_event_ledger (R01)"]
    L --> D{"sync_to_order_warn=是 且在押订单"}
    D -->|是| Y["生成 IOT_PENETRATION 押品预警"]
    D -->|否| N["仅保留设备流水"]`,
          },
          {
            label: "用户目标",
            content: "一线监管人员按类型、等级、状态、仓库和预警时间定位单条事件，再进入详情或人工解除。",
          },
          {
            label: "状态边界",
            content: "待处置 · 有效、已作废、已结案 · 有效；不存在频次聚合或 timeline。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-filter",
    targetId: "device-warning-filter",
    number: 2,
    kind: "交互",
    title: "组合筛选与查询",
    content: "顶部胶囊筛选 + 抽屉扩展预警等级与预警时间范围；关键词搜索实时生效。",
    details: [
      {
        title: "筛选字段",
        items: [
          {
            label: "预警状态 / 类型 / 仓库",
            content: "顶部胶囊下拉快速筛选；默认预警状态为待处置 · 有效。",
          },
          {
            label: "预警等级与子类型",
            content: "抽屉内支持多选预警等级以及根据已选大类联动展开的具体细粒子类型标签。",
          },
          {
            label: "预警时间",
            content: "抽屉内日期范围匹配 warningTime；按预警时间倒序展示。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-table",
    targetId: "device-warning-table",
    number: 3,
    kind: "字段",
    title: "预警卡片字段",
    content: "卡片展示规则名称、等级、状态、设备、仓库、预警内容、抓拍入口与预警时间。",
    details: [
      {
        title: "展示规范",
        items: [
          {
            label: "一事件一条记录",
            content: "不存在预警次数或频次入口；同设备再次触发产生新的独立卡片。",
          },
          {
            label: "预警时间",
            content: "单条流水触发时间 warningTime，同时作为升级计时起点。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-row-actions",
    targetId: "device-warning-row-actions",
    number: 4,
    kind: "规则",
    title: "卡片行操作矩阵",
    content: "详情对所有状态可用；解除仅对待处置 · 有效且 manualReleaseAllowed（R14'）的事件展示。",
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "待处置 · 有效",
            content: "展示详情与解除（R14' 人工解除档）；AUTO_RECOVER/RECORD_ONLY 仅详情。",
          },
          {
            label: "已作废 / 已结案",
            content: "仅展示详情，不可再次解除。",
          },
        ],
      },
    ],
  },
]
