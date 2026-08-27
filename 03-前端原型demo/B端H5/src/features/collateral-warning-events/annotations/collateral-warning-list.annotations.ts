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
    D -->|"处置完成回写"| F["已处理有效状态"]
    E -->|"设备解除联动"| F
    F -->|"满足公示条件"| G["02/04 风险公示"]`,
          },
          {
            label: "业务范围",
            content: "涵盖抵/质押物价值下跌、质押率突破警戒线、解抵/质押超时、盘点巡检缺失、贷中模型拒绝及物理安防入侵穿透告警。",
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
            content: "价格下跌、抵/质押率异常、解抵/质押超时、盘点异常、巡检异常、贷中风控预警、物联穿透告警；支持多选 OR 匹配。",
          },
          {
            label: "预警来源",
            content: "全部、订单配置触发 (ORDER_CONFIG)、物联穿透 (IOT_PENETRATION)。",
          },
          {
            label: "预警状态",
            content: "全部、未处理（有效）、未处理（无效）、已处理（有效）；默认展示未处理（有效）。",
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
    title: "批量风险公示与数据导出",
    content: "支持对已处理（有效）且未公示的预警记录进行批量公示操作，以及筛选结果全量导出。",
    details: [
      {
        title: "操作规则与权限控制",
        items: [
          {
            label: "批量公示风险",
            content: "仅当当前筛选结果中包含【已处理（有效）且 未公示】的数据时按钮激活；点击弹出批量公示确认框并展示候选记录数。",
          },
          {
            label: "导出数据",
            content: "导出当前筛选条件匹配的全部押品预警数据，包含订单号、品类规格、预警类型、等级、处置状态与时间戳。",
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
    content: "展示订单号、抵/质押物信息、预警类型、预警等级快照、固定模板预警内容、状态与公示标记。",
    details: [
      {
        title: "关键列说明",
        items: [
          {
            label: "订单号 / 抵质押物",
            content: "展示订单业务编号及抵质押物【品类-规格-数量单位】，支持点击穿透跳转订单详情。",
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
    targetId: "collateral-warning-row-actions",
    number: 5,
    kind: "规则",
    title: "状态 × 来源 × 行操作能力矩阵",
    content: "不同预警来源和状态具有严格区分的处置跳转与公示能力，禁止穿透类在押品端人工解除。",
    details: [
      {
        title: "操作与流转矩阵",
        items: [
          {
            label: "商业类 · 未处理（有效）",
            content: "展示【解除预警】按钮，点击跳转至【融资监管 → 抵质押订单】详情页，引导用户在单据内完成追加担保或解押审批。",
          },
          {
            label: "物联穿透类 · 未处理（有效）",
            content: "展示【查看设备事件】按钮，点击跳转至【设备预警信息 → 详情页】；严格禁止在押品端人工解除，必须在设备端核销物理告警。",
          },
          {
            label: "商业/穿透类 · 已处理（有效）",
            content: "若尚未公示，展示【公示风险】操作；若已公示则仅保留只读【详情】入口。",
          },
          {
            label: "未处理（无效）",
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
