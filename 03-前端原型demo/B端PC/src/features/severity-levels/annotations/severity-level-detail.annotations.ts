import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const severityLevelDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "severity-level-detail-header",
    documentRefs: {
      prd: { section: "预警等级 主PRD", match: "预警等级全模块", element: "row" },
      rules: { section: "预警等级 业务规则规格", match: "预警配置 → 预警等级", element: "row" },
    },
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
    documentRefs: {
      fields: { section: "预警等级 字段清单", match: "同步至订单预警", element: "row" },
      rules: { section: "【严重度排序与权重度量机制】(R02)", match: "大数高危原则：sortorder 设定为正整数，数值越大代表风险严重度越高。", element: "text" },
    },
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
      {
        title: "字段字典清单",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 | 控件类型 | 必填 | 取值范围与格式 | 展示规则 | 说明 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **序号** | 只读数字 | 系统生成 | 正整数 | 首列 | 列表位置编号 |
| **严重度排序** | 只读整数 | 必填 | 1~20，数值越大越严重 | 单行 | 大屏与看板按此排序 |
| **等级编码** | 只读文本 | 必填 | 2~16 位半角字符，租户内唯一 | 单行 | 如 01、L5 |
| **显示名称** | 只读文本 | 必填 | 2~20 位中英文字符，租户内唯一 | 单行 | 如「紧急危险」 |
| **标签颜色** | 色块 + Hex | 必填 | 标准 16 进制色值，如 #E60000 | 色块 + 文本 | 用于列表 Badge 与大屏 |
| **同步至订单预警** | 徽标 | 系统维护 | 是 / 否 | 单行 | 穿透开关 (R11/R12) |
| **等级说明** | 只读多行 | 选填 | 最长 100 字符 | 折行 | 业务适用范围与响应要求 |`,
          },
        ],
      },
    ],
  },
  {
    id: "severity-level-detail-actions",
    documentRefs: {
      prd: { section: "5.2 动作能力控制矩阵", match: "列表行内点击 Switch 快速翻转 synctoorderwarn，热更新风控", element: "row" },
    },
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
  {
    id: "severity-level-detail-protect",
    documentRefs: {
      rules: { section: "【同步至订单预警穿透机制】(R03)", match: "开关独立控制：每个预警等级独立维护一个布尔型「同步至订单预警」开关（syncto", element: "text" },
      prd: { section: "预警等级 主PRD", match: "预警等级全模块", element: "row" },
    },
    targetId: "severity-level-detail-header",
    number: 4,
    kind: "规则",
    title: "删除与停用保护",
    content:
      "等级低于 2 档时禁止删除；被设备预警配置或订单预警配置引用时禁止删除，只能改停用。",
    details: [
      {
        title: "拦截口径",
        items: [
          {
            label: "两档下限",
            content: "租户内等级少于 2 档时，删除按钮直接拦截：至少保留 2 档。",
          },
          {
            label: "被引用保护",
            content: "被任何有效规则引用时强校验拦截，提示改为停用；历史事件快照不受影响。",
          },
          {
            label: "停用影响",
            content: "停用后新规则下拉不可选，既有规则与历史流水保持原状。",
          },
        ],
      },
    ],
  },
]
