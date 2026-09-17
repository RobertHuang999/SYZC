import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

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
    content: "列表行首复选框勾选多条【已结案 · 有效且未公示】预警，点击顶部【批量公示风险】逐条独立落库。",
    details: [
      {
        title: "操作规则与权限控制",
        items: [
          {
            label: "复选框准入 (RISK-PUB-B01/B02)",
            content: "仅【已结案 · 有效】且【未公示】、有效抵/质押订单可勾选；【已公示】行展示禁用复选框且不可选中；待处置、已作废、监管服务、历史兼容行显示 —。已选集合在公示状态变化后自动剔除不可选项。",
          },
          {
            label: "批量公示风险",
            content: "勾选 ≥1 条后按钮激活；弹窗确认候选清单后点击「去编辑公示内容」，进入批量公示确认页（左候选列表 + 右单条同款编辑表单），支持上一条/下一条切换，全部校验通过后「提交全部公示」。",
          },
          {
            label: "批量公示流转图",
            content: `flowchart LR
    A["勾选已结案·有效且未公示行"] --> B["点击批量公示风险"]
    B --> C["确认弹窗 · 展示候选清单"]
    C --> D["批量公示确认页 · 逐条编辑快照"]
    D --> E["提交全部 · 服务端逐条复核 B03"]
    E --> F["逐条独立落库 B04 · Toast 汇总 B05"]`,
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
    title: "表格字段、快照与展示格式",
    content: "展示订单号、订单类型（抵押/质押/监管服务）、抵/质押物信息、预警类型、预警等级快照、固定模板预警内容、状态与公示标记。",
    details: [
      {
        title: "关键列说明",
        items: [
          {
            label: "订单号 / 抵质押物",
            content: "展示订单业务编号及抵质押物【品类-规格-数量单位】，支持点击穿透跳转订单详情。",
          },
          {
            label: "订单类型",
            content: "展示触发快照中的订单类型，仅允许抵押、质押、监管服务；旧历史“监管”不展示，也不映射为“监管服务”。",
          },
          {
            label: "预警等级",
            content: "展示触发时固化的 03/01 预警等级色块与名称（如高危红/中危橙），历史记录不随后续等级字典变更而改写。",
          },
          {
            label: "预警内容模板",
            content: "采用标准参数化模板填充（如【当前抵质押物 螺纹钢 HRB400 现价 3200元/吨，较初始基准价跌幅 18.5% 已达预警线】）。",
          },
          {
            label: "预警状态 & 公示标记",
            content: "三态标签显示；已公示记录显示专属绿色【已公示】Tag，便于追踪对外风险披露进展。",
          },
        ],
      },
    ],
  },
  {
    id: "collateral-warning-row-actions",
    targetId: "collateral-warning-table",
    number: 5,
    kind: "规则",
    title: "状态 × 来源 × 行操作能力矩阵",
    content: "不同预警来源和状态具有严格区分的处置跳转与公示能力，禁止穿透类在押品端人工解除。",
    details: [
      {
        title: "操作与流转矩阵",
        items: [
          {
            label: "商业类 · 待处置 · 有效",
            content: "展示【解除预警】按钮；抵/质押率类先弹出 ReleasePromptDialog 展示命中线与可用解除方式（R13e），确认后跳转【融资监管 → 抵质押订单】详情页办理。",
          },
          {
            label: "物联穿透类 · 待处置 · 有效",
            content: "展示【查看设备事件】按钮，点击跳转至【设备预警信息 → 详情页】；严格禁止在押品端人工解除，必须在设备端核销物理告警。",
          },
          {
            label: "商业/穿透类 · 已结案 · 有效",
            content: "未公示且抵/质押订单展示【公示风险】；已公示/已取消展示【查看公示】（跳转公示详情）；监管服务订单不展示公示入口。",
          },
          {
            label: "已作废",
            content: "仅支持查看详情，通常因上游订单已结清或规则失效而自动置无效。",
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
