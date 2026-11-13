import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const transferRecordListAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-record-list-page",
    documentRefs: {
      prd: { section: "转让记录主PRD", match: "转让单终审通过", element: "row" },
      rules: { section: "【台账终态归档与禁止反冲正】(R07)", match: "禁止线上反审批冲正：", element: "text" },
    },
    targetId: "transfer-record-list-page",
    number: 1,
    kind: "页面",
    title: "转让记录台账定位与终态归档 (R07)",
    content:
      "本页面为已生效/已通过的转让单归档与查询台账（P-CKG-012）。接口强制过滤 APPROVED 终审通过状态，审批中或已驳回单据不在本列表呈现。严禁线上反审批撤销，回退须反向新发起转让申请。",
    details: [
      {
        title: "生命周期与台账边界",
        items: [
          {
            label: "业务定位",
            content:
              "货权法定转移台账。终审通过后原子触发原货主转让出库扣减，受让方名下自动生成转让入库单，条码资产归属原子变更 (R05)。",
          },
          {
            label: "路由路径",
            content: "PC 端路径：/仓储/货物转让/转让记录（P-CKG-012）。",
          },
        ],
      },
      {
        title: "转让全链路流转",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["新增转让申请<br/>仅限无权利负担的普通自有存货 (R01)"] --> B["提交审核"]
    B -->|驳回 / 撤回| C["我的申请"]
    B -->|终审通过| D["原子执行货权转移"]
    D --> E["原货主侧：转让出库单（扣减）"]
    D --> F["受让方侧：转让入库单（新增）"]
    D --> G["条码资产归属变更为新货主 (R05)"]
    D --> H["进入转让记录台账（仅已通过，R07）"]
    H -->|需要回退| I["反向新发起一笔转让申请<br/>禁止反审批撤销 (R07)"]`,
          },
          {
            label: "上下游与权限",
            content:
              "上游来自新增转让申请；下游联动原货主转让出库与受让方转让入库。仅具备货权操作权限的账号可发起；数据按仓库权限隔离。",
          },
        ],
      },
    ],
  },
  {
    id: "transfer-record-filters",
    targetId: "transfer-record-list-page",
    number: 2,
    kind: "字段",
    title: "检索区控件与纯净筛选 (R01)",
    content:
      "检索区支持 7 项检索条件：转让单号、转让日期范围、货主名称/标识、仓库名称、货品名称、制单人、制单时间范围。货物转让仅支持自有普通存货，不设“转让类型”筛选，亦不设状态筛选（R01）。",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "列表多维检索", element: "text" },
      fields: { section: "六、展示、筛选与引用规则汇总", match: "筛选映射规则", element: "text" },
      rules: { section: "三、核心业务规则与逻辑规格", match: "R01", element: "text" },
    },
    details: [
      {
        title: "筛选字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 筛选项名称 | 控件类型 | 必填 | 取值与默认值 | 校验与提示 |
| :--- | :--- | :---: | :--- | :--- |
| **转让单号** | 单行文本 | 否 | 空；模糊匹配 | 自动去首尾空格，支持回车查询 |
| **转让日期** | 日期范围 | 否 | 空 | 开始日期晚于结束日期时阻断 |
| **货主名称/标识** | 单行文本 | 否 | 空；综合匹配 | — |
| **仓库名称** | 下拉单选 | 否 | 默认「全部」；仅授权仓库 | 超出仓库权限时隐藏 |
| **货品名称** | 下拉单选 | 否 | 默认「全部」；大类 → 品类 → 规格 | — |
| **制单人** | 下拉单选 | 否 | 默认「全部」 | 支持拼音或中文模糊 |
| **制单时间** | 日期范围 | 否 | 空 | 开始日期晚于结束日期时阻断 |
| ~~转让类型 / 状态~~ | — | — | **不提供** | 转让仅限普通自有存货；台账只收已通过 (R01) |`,
          },
        ],
      },
    ],
  },
  {
    id: "transfer-record-table",
    targetId: "transfer-record-table",
    number: 3,
    kind: "字段",
    title: "列表 10 列展示与操作极简收敛",
    content:
      "列表展示 10 列：序号、转让单号、转让人(双行含标识)、转让时间(双行)、转让数量、接收人(双行含标识)、仓库名称、货物名称(超出2行更多Popover)、制单人、操作列。操作列仅保留【查看详情】，不设单据下载或下载记录。",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "10 列展示（操作列仅查看详情）", element: "text" },
      fields: { section: "六、展示、筛选与引用规则汇总", match: "列表固定展示顺序与默认排序", element: "text" },
      rules: { section: "三、核心业务规则与逻辑规格", match: "R07", element: "text" },
    },
    details: [
      {
        title: "列表列字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 列名称 | 控件类型 | 必填 | 取值范围与格式 | 展示规则 | 说明 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **转让单号** | 文本（可复制） | 系统生成 | 19 位数字串 | 单行完整展示、不截断 | — |
| **转让人** | 双行复合 | 必填 | 名称 + 脱敏标识 | 两行 | 原货主 |
| **转让时间** | 日期时间 | 必填 | YYYY-MM-DD HH:mm:ss | 两行展示 | 终审通过时间 |
| **转让数量** | 数值 | 系统计算 | 数值 + 单位 | 右对齐 | 各货品汇总 |
| **接收人** | 双行复合 | 必填 | 名称 + 脱敏标识 | 两行 | 受让新货主 |
| **仓库名称** | 文本 | 必填 | 实体监管仓库全称 | 单行 | 单仓强约束 (R02) |
| **货物名称** | 多行折叠 | 必填 | 大类-品类-规格 | 超过 2 行显示【更多】，悬停 Popover 看全 | — |
| **制单人** | 文本 | 系统记录 | 姓名(所属机构) | 单行 | — |
| **操作** | 行操作按钮 | — | 仅【查看详情】 | 不设单据下载与下载记录 | — |`,
          },
        ],
      },
    ],
  },
  {
    id: "transfer-record-row-actions",
    targetId: "transfer-record-table",
    number: 4,
    kind: "交互",
    title: "行操作与回退路径提示",
    content:
      "台账只保留查看详情；需要回退时不得在本页反审批，必须反向新发起转让申请。",
    documentRefs: {
      rules: { section: "三、核心业务规则与逻辑规格", match: "R07", element: "text" },
    },
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "按钮与提示",
            content: `| 操作 | 可见状态 | 点击后发生什么 | 提示原话 |
| :--- | :--- | :--- | :--- |
| **查看详情** | 已通过 | 打开转让单详情 | — |
| **下载 / 下载记录** | — | **不提供** | 转让记录不生成单据凭证 |
| **回退** | 已通过 | 不提供反审批入口 | 「转让已生效，如需回退请反向新发起一笔转让申请」 (R07) |`,
          },
        ],
      },
    ],
  },
]
