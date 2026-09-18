import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const riskDisclosureListAnnotations: PrototypeAnnotation[] = [
  {
    id: "risk-disclosure-page",
    targetId: "risk-disclosure-page",
    number: 1,
    kind: "页面",
    title: "风险公示定位与合规披露流转",
    content: "管理对外已披露和待公示的押品风控处置记录，提供多维度公开信息查询与公示撤回管理。",
    details: [
      {
        title: "风险公示生命周期流转图",
        items: [
          {
            label: "公示流转图",
            content: `flowchart LR
    A["押品预警 (已处理有效)"] -->|"合规审批发起公示"| B["风险公示: 已公示"]
    B -->|"记录发布审计"| D["全链路审计日志"]
    B -->|"合规申诉/风险消除"| C["风险公示: 已取消"]
    C -->|"记录取消理由审计"| D`,
          },
          {
            label: "合规意义",
            content: "对资信严重恶化、多次跌价触及平仓线等重大违约事件对外履行合规公示义务，保障资方与监管穿透。",
          },
        ],
      },
      {
        title: "上下游协同",
        items: [
          {
            label: "上游数据",
            content: "来源于【押品预警信息】中已处置完成的有效告警，继承原预警事实、抓拍图与处置材料快照。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-filter",
    targetId: "risk-disclosure-filter",
    number: 2,
    kind: "交互",
    title: "公示信息检索与多维筛选",
    content: "规则名称、订单号、货主、预警类型四个独立模糊搜索框，条件按 AND 组合；列表固定仅展示已公示记录（RISK-PUB-ST02），不提供公示状态或公示时间日期范围筛选项。",
    details: [
      {
        title: "筛选维度说明",
        items: [
          {
            label: "四字段独立模糊匹配",
            content: "规则名称、订单号、货主、预警类型各占一个输入框；预警类型支持公示确认页自定义文案模糊检索。",
          },
          {
            label: "列表数据范围",
            content: "固定仅展示已公示记录；已取消记录不在列表出现，需从押品预警入口进入详情调阅；不提供公示时间日期范围筛选项。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-table",
    targetId: "risk-disclosure-table",
    number: 3,
    kind: "字段",
    title: "表格字段与公示状态定义",
    content: "对齐 V2.1 台账列：序号、预警订单号、预警类型、公示标题与内容摘要、现场抓拍图、最近一次公示时间、最新操作人、公示状态与详情入口。",
    details: [
      {
        title: "1. 风险公示列表字段字典 (SSOT 真源对齐)",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 / 编码 | 控件与类型 | 展示与格式要求 | 触发动作 / 业务联动 |
| :--- | :--- | :--- | :--- |
| **序号** | 系统计算整数 | 1, 2, 3... 顺序递增 | 翻页重算 |
| **预警订单号**<br>\`order_no\` | 订单文本 | 抵押/质押业务订单编号 | 点击穿透跳转订单详情 |
| **预警类型**<br>\`warning_type\` | 枚举徽章 | 对应触发的 7 大类风控类型或合规编辑文案 | 支持模糊匹配搜索 |
| **公示标题与摘要**<br>\`disclosure_content\` | 文本摘要 | 固化发布时的对外合规披露文案 | 悬浮查看完整披露内容 |
| **现场抓拍图**<br>\`snapshot_url\` | 监控抓拍缩略图 | 点击调起大图预览；私有 OSS 动态时效签名 | 固化司法不可变存证 |
| **最近公示时间**<br>\`publish_time\` | 日期时间文本 | \`YYYY-MM-DD HH:mm:ss\` | 倒序排列；不可变时间戳 |
| **最新操作人**<br>\`operator_name\` | 文本只读 | 格式为“姓名（所属机构）” | 记录发布或取消操作人 |
| **公示状态**<br>\`publish_status\` | 状态 Badge | 列表固定展示【已公示】(绿Badge)；已取消记录在押品端追溯 | 遵循 RISK-PUB-ST02 规则 |
| **操作** | 按钮链接 | 【详情】、【取消公示】 | 调起详情或输入 <=200 字取消理由 |`,
          },
        ],
      },
      {
        title: "2. 操作控制与取消公示约束 (RISK-PUB-C01)",
        items: [
          {
            label: "取消公示权限与审计",
            content: "仅具备 R-RISK-MGR 权限的角色可操作【取消公示】；强制弹出二次确认弹窗并录入 $\le$ 200 字取消理由，全流程留痕并同步回写押品端公示状态为【已取消】。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-pagination",
    targetId: "risk-disclosure-pagination",
    number: 4,
    kind: "交互",
    title: "分页与页容量控制",
    content: "标准分页组件，支持 10/20/50 条每页切换，修改筛选或分页后平滑刷新。",
    details: [
      {
        title: "规范",
        items: [
          {
            label: "重置行为",
            content: "执行查询、重置或切换每页条数时均回到第 1 页展示。",
          },
        ],
      },
    ],
  },
]
