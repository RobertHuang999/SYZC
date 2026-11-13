import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const abnormalRecordListAnnotations: SharedPrototypeAnnotation[] = [
  {
    id: "abnormal-record-page",
    targetId: "abnormal-record-page",
    number: 1,
    kind: "页面",
    title: "异动记录归档台账定位",
    content:
      "本页面为已审批通过生效的货物异动终态归档台账（P-CKG-013）。统一纳管仓储普通存货与抵质押金融资产由于磅差、挥发、装卸货损及盘点校准产生的调账凭据。审批中或已撤销单据不在本台账呈现，记录永久固化为法律不可变凭据，严禁手工篡改或物理删除。",
    documentRefs: {
      prd: {
        section: "2. 功能范围",
        match: "异动归档台账全息展示",
        element: "text",
      },
      fields: {
        section: "二、列表表格业务字段",
        match: "异动单号",
        element: "row",
      },
      rules: {
        section: "1. 存货与货权范围控制规则",
        match: "普通存货自主发起边界",
        element: "text",
      },
    },
    details: [
      {
        title: "异动生命周期",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["异动申请（盘盈 / 盘亏 / 损耗 / 其他）"] --> B["审批专网"]
    B -->|审批通过| C["生效归档（本台账，不可篡改）"]
    B -->|驳回 / 撤销| D["审批中心查看"]
    C --> E["联动库存数量调账<br/>红升绿降差额留痕"]`,
          },
        ],
      },
      {
        title: "核心审计原则",
        items: [
          {
            label: "账实相符与司法存证",
            content: "全面承接实物损溢核算，红升绿降差额直观呈现，全生命周期审计留痕，实现调账合规与司法可存证。",
          },
          {
            label: "数据路由",
            content: "PC 路由路径 /仓储/货物异动/异动记录（P-CKG-013）。",
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-record-filter",
    targetId: "abnormal-record-filter",
    number: 2,
    kind: "字段",
    title: "列表筛选区与多维联动",
    content:
      "支持 8 个检索维度：异动单号、关联单据（监管业务单号或入库单号）、单据类型（多选：质押单/抵押单/监管业务单/存货单）、货主名称或标识、异动类型（多选：盘盈/盘亏/损耗/其他）、仓库库房级联、货物名称、申请时间日期范围。支持一键重置与查询。",
    documentRefs: {
      prd: {
        section: "6.1 列表页（P-CKG-013）",
        match: "筛选区",
        element: "text",
      },
      fields: {
        section: "一、列表筛选区字段",
        match: "异动单号",
        element: "row",
      },
      rules: {
        section: "4. 异动类型聚合与可见性穿透规则",
        match: "异动类型组合展示规则",
        element: "text",
      },
    },
    details: [
      {
        title: "匹配规则",
        items: [
          {
            label: "单据类型多选",
            content: "支持质押单、抵押单、监管业务单、存货单多选筛选。",
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-record-table",
    targetId: "abnormal-record-table",
    number: 3,
    kind: "规则",
    title: "列表表格与红升绿降呈现",
    content:
      "列表表格统一固定行高 72px，异动单号完整可见并支持一键复制；异动后数量单元格同步展示带符号差额，正增量采用红色箭头（⬆）高亮标红，负减量采用绿色箭头（⬇）高亮标绿；一张单据包含多件货物时在行内清晰换行对应排布。",
    documentRefs: {
      prd: {
        section: "6.1 列表页（P-CKG-013）",
        match: "差异数量自动试算与红升绿降规则",
        element: "text",
      },
      fields: {
        section: "二、列表表格业务字段",
        match: "异动后数量",
        element: "row",
      },
      rules: {
        section: "2. 差额试算与输入防护规则",
        match: "差异数量自动试算与红升绿降规则",
        element: "text",
      },
    },
    details: [
      {
        title: "排版规范",
        items: [
          {
            label: "固定行高",
            content: "统一固定行高 72px，多货物换行展示，操作列实色投影防穿透。",
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-record-table-fields",
    documentRefs: {
      fields: { section: "二、列表表格业务字段", match: "列表独立展示", element: "row" },
      rules: { section: "二、数量核算口径隔离表", match: "期初堆放数量", element: "row" },
    },
    targetId: "abnormal-record-table",
    number: 0,
    kind: "字段",
    title: "字段字典",
    content: "展示业务字段、数量口径与状态。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "字段",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **异动单号** | 文本 | 系统生成 | 19 位数字串 | 完整展示、可复制 |
| **单据类型** | 标签 | 必填 | 存货单 / 质押单 / 抵押单 / 监管业务单 | 单行 |
| **货主** | 文本 | 必填 | 名称 + 脱敏标识 | 双行 |
| **仓库 / 库房** | 文本 | 必填 | 仓库-库房-分区 | 单行 |
| **货品** | 文本 | 必填 | 大类-品类-规格 | 多行折行 |
| **变动前 / 变动后数量** | 数值 | 系统记录 | 数值 + 单位 | 右对齐 |
| **差额** | 数值 | 系统计算 | 正数标红⬆、负数标绿⬇ | 高亮 |
| **异动类型** | 标签 | 必填 | 盘盈 / 盘亏 / 损耗 / 其他 | 彩色标签 |
| **申请时间** | 日期时间 | 系统记录 | YYYY-MM-DD HH:mm:ss | 单行 |`,
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-record-ops-actions",
    documentRefs: {
      prd: { section: "5. 状态机与动作能力矩阵", match: "✅ (本菜单行操作)", element: "row" },
    },
    targetId: "abnormal-record-page",
    number: 0,
    kind: "交互",
    title: "操作与提示",
    content: "按状态控制按钮可用性，敏感操作二次确认并给出提示原话。",
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "按钮与提示",
            content: `| 操作 | 可见状态 | 点击后发生什么 | 提示原话 |
| :--- | :--- | :--- | :--- |
| **查看详情** | 全部 | 打开多卡片详情 | — |
| **复制单号** | 全部 | 写入剪贴板 | 「异动单号已复制」 |
| **撤销 / 删除** | — | **不提供** | 归档即固化，需反向发起新单 |`,
          },
        ],
      },
    ],
  },
]
