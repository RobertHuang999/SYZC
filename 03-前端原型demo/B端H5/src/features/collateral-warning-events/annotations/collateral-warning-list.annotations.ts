import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const collateralWarningListAnnotations: PrototypeAnnotation[] = [
  {
    id: "collateral-warning-page",
    targetId: "collateral-warning-page",
    number: 1,
    kind: "页面",
    title: "押品预警定位与流转中枢",
    content: "承接 6 类商业订单风控预警与 1 类物联穿透告警，作为押品风险流水的承接中枢与处置工作台。",
    details: [
      {
        title: "系统业务链路流转图",
        items: [
          {
            label: "数据与处置流向",
            content: `flowchart TD
    A["03/03 订单预警配置<br/>(6类商业风控规则)"] --> C["02/02 押品预警信息中枢<br/>(流水承接 + 处置工作台)"]
    B["02/01 设备预警信息<br/>(物联穿透事件)"] --> C
    C -->|"商业类预警"| D["抵质押单据 / 补保处置"]
    C -->|"物联穿透类"| E["跳转设备预警现场核销"]
    D -->|"处置完成回写"| F["已结案 · 有效"]
    E -->|"设备解除联动"| F
    F -->|"满足公示条件"| G["02/04 风险公示"]`,
          },
          {
            label: "业务范围",
            content: "涵盖抵押/质押物价值下跌、质押率突破警戒线、抵押/质押/监管服务超时、盘点巡检缺失、贷中模型拒绝及物理安防入侵穿透告警。",
          },
        ],
      },
      {
        title: "上下游协同与数据边界",
        items: [
          {
            label: "上游数据源",
            content: "订单预警配置引擎提供 6 类商业规则命中结果；设备预警系统在 sync_to_order_warn=是 时生成物联穿透记录。",
          },
          {
            label: "下游处理",
            content: "商业类点击【解除预警】跳转对应抵质押订单完成补仓/平仓/解押；物联穿透类由设备物理台账核销后联动解除。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-filter",
    targetId: "collateral-warning-filter",
    number: 2,
    kind: "交互",
    title: "7 类预警复合筛选与组合规则",
    content: "支持订单号、预警类型（7类）、预警等级（03/01 启用档）、预警来源、预警状态、公示状态与时间范围组合检索。",
    details: [
      {
        title: "筛选条件与逻辑",
        items: [
          {
            label: "顶部搜索框（keyword）",
            content: "placeholder「请输入预警订单号」；仅对预警订单号 (order_no) 做模糊匹配，不支持按预警内容、货品名称检索；与字段清单筛选区「预警订单」口径一致。",
          },
          {
            label: "预警类型（7类）",
            content: "价格下跌、抵/质押率异常、解抵/质押超时、盘点异常、巡检异常、贷中风控预警、物联穿透告警；支持多选 OR 匹配。订单类型统一为抵押、质押、监管服务。",
          },
          {
            label: "预警来源",
            content: "全部、订单配置触发 (ORDER_CONFIG)、物联穿透 (IOT_PENETRATION)。",
          },
          {
            label: "预警状态",
            content: "全部、待处置 · 有效、已作废、已结案 · 有效；默认展示待处置 · 有效。",
          },
          {
            label: "公示状态",
            content: "全部、未公示、已公示；用于快速定位待公示的高危处置记录。",
          },
          {
            label: "查询与重置",
            content: "不同筛选维度按 AND 组合；点击查询或重置均强制将页码归一到第 1 页并按最近预警时间倒序排列。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-toolbar",
    targetId: "collateral-warning-toolbar",
    number: 3,
    kind: "交互",
    title: "批量风险公示",
    content: "NavBar「批量公示」进入勾选模式；仅【已结案 · 有效且未公示】卡片可勾选，【已公示】复选框禁用。",
    details: [
      {
        title: "操作规则与权限控制",
        items: [
          {
            label: "复选框准入 (RISK-PUB-B01/B02)",
            content: "仅【已结案 · 有效】且【未公示】、有效抵/质押订单可勾选；【已公示】行展示禁用复选框且不可选中；待处置、已作废、监管服务、历史兼容行不可选。已选集合在公示状态变化后自动剔除不可选项。",
          },
          {
            label: "批量公示确认",
            content: "底栏「下一步：确认公示」→ Bottom Sheet 展示候选清单 →「去编辑公示内容」进入批量公示确认页（订单 Pill 切换 + 单条同款表单 + 上一条/下一条），全部校验通过后「提交全部公示」。",
          },
          {
            label: "批量公示流转图",
            content: `flowchart LR
    A["NavBar 批量公示 · 勾选候选"] --> B["Bottom Sheet 确认清单"]
    B --> C["批量公示确认页 · 逐条编辑快照"]
    C --> D["提交全部 · 服务端逐条复核 B03"]
    D --> E["逐条独立落库 B04 · Toast 汇总 B05"]`,
          },
          {
            label: "权限控制",
            content: "批量公示需要具备 R-RISK-MGR（风控经理）权限；普通业务员仅具备只读查看权限。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-table",
    targetId: "collateral-warning-table",
    number: 4,
    kind: "字段",
    title: "列表字段字典与快照规格",
    content: "展示订单号、订单类型（抵押/质押/监管服务）、抵质押物信息、7类预警类型、预警等级快照、固定模板预警内容、状态与公示标记。",
    details: [
      {
        title: "1. 押品预警移动端字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 / 编码 | 控件与类型 | 展示与格式要求 | 触发动作 / 业务联动 |
| :--- | :--- | :--- | :--- |
| **复选框** | 行首多选框 | 勾选/取消；受 COL-R21 门控 (仅已结案且未公示可选) | 批量公示勾选联动 |
| **预警订单号**<br>\`order_no\` | 订单文本 | 抵押/质押/监管服务单号 | 点击跳转详情 (旧监管不展示) |
| **订单类型**<br>\`order_type\` | 枚举 Tag | \`抵押\`、\`质押\`、\`监管服务\` | 精确匹配筛选 |
| **预警类型**<br>\`warning_type\` | 枚举 Tag | 7 大类风控类型；物联穿透统一收敛 | 多选 OR 匹配 |
| **预警等级**<br>\`severity_level_id\` | 枚举徽章 | 固化触发时 03/01 等级色块与名称 | 筛选联动；带穿透标记 |
| **预警来源**<br>\`warn_source\` | 枚举徽标 | \`ORDER_CONFIG\` / \`IOT_PENETRATION\` | 区分处置路径 |
| **预警内容**<br>\`warning_content\` | 参数化文本 | 依据参数化模板拼接事实与数值差值 | 贷中展示评分，质押率展示LTV |
| **预警抓拍图**<br>\`snapshot_url\` | 监控缩略图 | 点击调起大图预览；私有 OSS 签名 | 司法存证快照 |
| **预警状态**<br>\`status\` | 状态 Badge | 待处置·有效(橙) / 已结案·有效(绿) / 已作废(灰) | 严格三态标准词表 |
| **是否公示**<br>\`is_publicized\` | 公示 Tag | \`未公示\` (灰) / \`已公示\` (绿) / \`已取消\` (橙) | 联动公示入口 |`,
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-row-actions",
    targetId: "collateral-warning-row-actions",
    number: 5,
    kind: "规则",
    title: "来源 × 状态 × 卡片操作控制矩阵",
    content: "不同预警来源和状态具有严格区分的处置跳转与公示能力，禁止穿透类在押品端人工解除。",
    details: [
      {
        title: "1. 卡片操作状态化控制矩阵",
        items: [
          {
            label: "状态与动作对照表",
            content: `| 预警来源 | 预警状态 | 公示状态 | 移动端可用操作 | 业务逻辑与权限门禁 |
| :--- | :--- | :--- | :--- | :--- |
| **ORDER_CONFIG** (商业类) | **待处置 · 有效** | 未公示 | 【解除预警】、【详情】 | 点击跳转融资监管抵质押订单详情办理补仓/平仓/解押 |
| **IOT_PENETRATION** (物联穿透) | **待处置 · 有效** | 未公示 | 【查看设备事件】、【详情】 | **押品端禁止人工解除**；点击跳转设备预警详情，设备端核销后自动联动回写 |
| **全部来源** | **已结案 · 有效** | 未公示 | 【公示风险】、【详情】 | 需具备 R-RISK-MGR 权限；点击进入移动端公示确认页 |
| **全部来源** | **已结案 · 有效** | 已公示 / 已取消 | 【查看公示】、【详情】 | 点击跳转风险公示详情页 |
| **全部来源** | **已作废** | — | 【详情】 | 订单结清或规则失效置作废，仅供审计追溯 |`,
          },
        ],
      },
      {
        title: "2. 跨域穿透闭环机制 (COL-C01)",
        items: [
          {
            label: "物联穿透闭环流转",
            content: "当设备预警等级配置 sync_to_order_warn=true 且触发物理告警时，若设备所在库区存在在押订单，自动生成 warn_source=IOT_PENETRATION 押品预警；在现场设备台账核销结案后，系统发布领域事件联动回写押品预警为【已结案 · 有效】。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-pagination",
    targetId: "collateral-warning-pagination",
    number: 6,
    kind: "交互",
    title: "分页与页容量控制",
    content: "支持 10/20/50 条每页切换与页码快速跳转，切换页容量自动重置至第 1 页。",
    details: [
      {
        title: "行为规范",
        items: [
          {
            label: "页容量切换",
            content: "支持 10、20、50 条/页；修改每页条数后回到第 1 页，重新计算总页数。",
          },
          {
            label: "空态与异常",
            content: "无匹配记录时显示【暂无押品预警数据】，分页组件保持稳定展示但不提供翻页动作。",
          },
        ],
      },
    ],
  },
]
