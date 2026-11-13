import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const orderWarningConfigDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "order-warning-config-detail-header",
    documentRefs: {
      prd: { section: "订单预警配置主PRD", match: "严重等级与通知升级", element: "row" },
      rules: { section: "订单预警配置 业务规则规格", match: "涉及策略子项", element: "row" },
    },
    targetId: "order-warning-config-detail-header",
    number: 1,
    kind: "页面",
    title: "订单预警配置详情与多策略视图 · 全景风控架构",
    content: "展示单个订单绑定的综合风控策略全貌、各启用子项的阈值、等级与通知升级矩阵。",
    details: [
      {
        title: "页面定位与多策略协同",
        items: [
          {
            label: "订单风控多策略流转图",
            content: `flowchart TD
    A["订单预警综合配置 (1:1 绑定订单)"] --> B["01 价格下跌 (跌价% + 等级)"]
    A --> C["02 监管业务率双控 (双阈值 + 分线解除 + 单等级)"]
    A --> D["03 超时预警 (到期提前天数 + 节点超时)"]
    A --> E["04 盘点异常 (账实差% + 现场复核)"]
    A --> F["05 巡检超期 (巡检周期 + 告警)"]
    A --> G["06 贷中风控 (智风控模型 + 台账)"]
    B & C & D & E & F & G --> H["02/02 押品预警信息流水承接"]`,
          },
          {
            label: "页头操作",
            content: "抵押、质押、监管服务规则按状态提供【返回】、【编辑】与【删除】；旧历史“监管”不在当前列表中。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-detail-base",
    documentRefs: {
      fields: { section: "一、主规则基本信息字段", match: "关联订单的业务货权管控类型", element: "row" },
      rules: { section: "订单预警配置 业务规则规格", match: "规则名称租户内唯一", element: "row" },
    },
    targetId: "order-warning-config-detail-base",
    number: 2,
    kind: "字段",
    title: "基本信息与订单主体信息清单",
    content: "展示规则 UUID、规则名称、关联订单编号、订单业务类型、借款货主企业、联系电话与押品物料明细。",
    details: [
      {
        title: "关联订单字段规格",
        items: [
          {
            label: "订单类型 (order_type)",
            content: "订单类型枚举仅为【抵押】【质押】【监管服务】；旧历史【监管】不展示、不进入新增候选，也不映射为【监管服务】。",
          },
          {
            label: "押品物料明细 (materials)",
            content: "展示品名、规格、总重量/吨数及质押初始估值，辅助风控复核价格基线。",
          },
        ],
      },
      {
        title: "基本信息字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 | 控件类型 | 必填 | 取值范围与格式 | 展示规则 | 说明 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **规则名称** | 只读文本 | 必填 | 最多 50 个字符 | 单行 | 租户内唯一 |
| **关联订单编号** | 只读链接 | 必填 | 有效抵押 / 质押 / 监管服务订单号 | 可穿透 | 一单一配 (R04) |
| **订单类型** | 只读文本 | 必填 | 抵押 / 质押 / 监管服务 | 单行 | 旧「监管」不展示 |
| **借款货主** | 只读文本 | 必填 | 企业全称 + 脱敏信用代码 | 双行 | — |
| **联系电话** | 只读文本 | 系统带出 | 11 位，脱敏中间 4 位 | 单行 | — |
| **押品物料明细** | 只读表格 | 必填 | 品名 / 规格 / 吨数 / 初始估值 | 多行 | 辅助价格基线复核 |
| **规则 Version** | 只读整数 | 系统维护 | 每次保存递增 | 单行 | 风控引擎同步标识 |
| **状态** | 状态标签 | 系统维护 | 生效中 / 停用 / 已删除 | 单行 | 删除后历史流水置已作废 |`,
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-detail-strategies",
    documentRefs: {
      rules: { section: "5.2 六大风控子策略专项配置规则", match: "各策略子项勾选短信或邮件外部通知渠道后，展示「预警通知对象（按组织架构选择）」控", element: "text" },
      prd: { section: "3.3 6 类风控子策略权威配置矩阵", match: "严重等级与通知升级", element: "row" },
    },
    targetId: "order-warning-config-detail-strategies",
    number: 3,
    kind: "规则",
    title: "六大风控策略子项与阈值参数规格",
    content: "卡片化分块展示已启用的各类风控策略的具体判定条件与通知升级参数。",
    details: [
      {
        title: "各策略子项规格说明",
        items: [
          {
            label: "01 超时预警",
            content: "展示解抵押/解质押/监管服务超时天数及多行节点配置表格；二维码/批次、成功时间按整列有值才展示，某行无值时显示「—」。",
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
            content: "以只读表格展示巡检人配置多行快照：序号 / 巡检人（组织架构人员，如孙巡检(仓管部)）/ 巡检周期（如每 7 天超期预警）；允许不同责任人独立周期；超期未巡检分别触发，完成对应巡检后解除；与盘点解耦（R17）。",
          },
          {
            label: "02 监管业务率双控预警",
            content: "双阈值模型：若超过 X% 时触发预警（不含等于）；补仓/平仓分线解除方式；整卡单等级。只读率展示名随订单类型（getLtvRateLabel）；无法计算当前率时详情不展示该参考字段（DZY-R08a）。R13d/R13e 同前。",
          },
          {
            label: "06 贷中风控预警",
            content:
              "展示绑定的风控模型（如仓单尽调产品-版本1）、入参映射数据项（法人、企业名称及统一代码等）以及预警触发判定条件（评分/额度阈值及拒绝结果），并联动贷中台账。",
          },
          {
            label: "通知渠道展示",
            content: "各已启用子项独立展示短信/邮件勾选结果，未配置外部渠道时展示「—」；移动端「押品预警信息」待处置红点不在此配置，预警命中时自动展示；升级督办下发渠道与配置页已选 notify_channels 一致（ORD-R21）。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-detail-actions",
    documentRefs: {
      prd: { section: "7. 核心业务规则索引", match: "业务规则规格 「六、」", element: "row" },
      rules: { section: "订单预警配置 业务规则规格", match: "收口三类订单类型（抵押/质押/监管服务），下线历史“监管”类型。", element: "row" },
    },
    targetId: "order-warning-config-detail-header",
    number: 4,
    kind: "交互",
    title: "页头操作与权限控制",
    content: "当前抵押、质押、监管服务规则支持编辑与软删除；旧历史“监管”不在当前数据集。",
    details: [
      {
        title: "权限与约束",
        items: [
          {
            label: "操作权限",
            content: "具备 R-RISK-MGR 权限人员可编辑和删除当前三类订单配置。",
          },
          {
            label: "删除联动",
            content: "当前订单规则删除后，历史已触发的待处置预警流水自动流转为【已作废】。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-detail-audit",
    documentRefs: {
      fields: { section: "订单预警配置字段清单", match: "综合预警规则的创建落库时间", element: "row" },
      rules: { section: "订单预警配置 业务规则规格", match: "规则处于生效中或已失效状态", element: "row" },
    },
    targetId: "order-warning-config-detail-audit",
    number: 5,
    kind: "字段",
    title: "系统审计信息",
    content: "与设备预警配置统一展示规则 Version、状态、创建人/创建时间与更新人/更新时间；已失效规则追加失效原因。",
    details: [
      {
        title: "配置审计字段",
        items: [
          {
            label: "创建/更新主体与时间",
            content: "创建与最近更新均展示操作主体和完整秒级时间戳，避免订单规则仅显示更新时间。",
          },
          {
            label: "Version",
            content: "综合策略保存后递增，并作为订单规则快照和风控引擎同步的版本标识。",
          },
        ],
      },
    ],
  },
]
