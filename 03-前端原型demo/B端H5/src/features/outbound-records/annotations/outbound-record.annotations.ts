import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const outboundH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "outbound-h5-list",
    documentRefs: {
      prd: { section: "出库记录主PRD", match: "台账接口固定过滤 APPROVED，不设状态筛选。", element: "text" },
      rules: { section: "【已通过台账专网过滤与不可变快照】(O13)", match: "出库记录列表接口强制硬编码 status = 'APPROVED' 过滤条件。", element: "text" },
    },
    targetId: "outbound-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 仓储 · 出库管理",
    content:
      "移动端出库管理生效归档台账（对齐原路径 货物管理～出库）。接口固定过滤已通过 APPROVED 单据；【单据下载】打开固定样式示意图（A4/A5/针式连续纸、带水印、两页换页，出库单价货值留空），【下载记录】打开与存货管理一致的导出记录列表；不设状态筛选（O13）。",
    details: [
      {
        title: "移动端台账规范",
        items: [
          {
            label: "入口与路由",
            content: "工作台 → 仓储 → 出库管理（/m/workspace/outbound-records）。",
          },
          {
            label: "数据流转图",
            content: `flowchart TD
    A["业务办理 · 出库发起"] --> B["出库审批专网"]
    B -->|通过| C["工作台 · 出库管理（仅已通过）"]
    D["移库 / 转让终审"] -->|联动写入| C
    B -->|驳回 / 撤销| E["我的申请"]
    C --> F["详情 / 单据下载 / 下载记录"]`,
          },
          {
            label: "权限",
            content: "仅展示当前账号授权仓库的单据；货主与提货人信息脱敏 (O14)。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-h5-list-card",
    targetId: "outbound-h5-list",
    number: 2,
    kind: "字段",
    title: "列表卡片字段",
    content:
      "卡片展示出库单号、货主、出库类型、仓库、货物摘要、出库日期与数量；多货品时摘要收起，可展开查看完整清单。",
    documentRefs: {
      fields: { section: "六、展示、筛选与引用规则", match: "列表展示顺序", element: "text" },
    },
    details: [
      {
        title: "卡片字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **出库单号** | 文本 | 系统生成 | 19 位数字串 | 卡片首行，完整展示 |
| **货主名称 / 标识** | 文本 | 必填 | 名称 + 脱敏标识 | 标识浅色 |
| **出库类型** | 文本 | 必填 | 8 种之一 | 单行 |
| **仓库名称** | 文本 | 必填 | 实体监管仓库全称 | 单行 |
| **货物名称** | 文本 | 必填 | 多货品收起，点开看全量 | — |
| **出库日期** | 文本 | 必填 | YYYY-MM-DD HH:mm:ss | 单行 |
| **出库数量** | 文本 | 系统计算 | 数值 + 单位 | 右对齐 |
| **关联单号** | 文本 | 条件必填 | 上游单号；普通出库「—」 | 可穿透 |
| **制单人 / 制单时间** | 文本 | 系统记录 | 姓名(机构) + 时间 | 卡片底部 |`,
          },
        ],
      },
    ],
  },
  {
    id: "outbound-h5-list-actions",
    targetId: "outbound-h5-list",
    number: 3,
    kind: "交互",
    title: "卡片操作与筛选",
    content:
      "卡片底部提供查看详情、单据、下载记录；顶部搜索与筛选抽屉覆盖出库单号、出库日期、货主、出库类型、仓库、货品、制单人、制单时间。",
    documentRefs: {
      prd: { section: "6.1 出库记录 — 列表页", match: "操作列", element: "text" },
    },
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "卡片操作",
            content: `| 操作 | 可见状态 | 点击后发生什么 | 成功提示 |
| :--- | :--- | :--- | :--- |
| **查看详情** | 已通过 | 进入出库详情 | — |
| **单据** | 已通过 | 打开固定样式示意图（两页换页、示意水印） | 「预览仅为样式示意。正式凭证已提交生成，请到【下载记录】下载。」 |
| **下载记录** | 已通过 | 打开导出记录列表 | 异步生成后行内下载 |
| **筛选** | 已通过 | 底部抽屉选择筛选条件 | 无结果展示空态与重置 |`,
          },
        ],
      },
    ],
  },
  {
    id: "outbound-h5-list-approved",
    documentRefs: {
      rules: { section: "【已通过台账专网过滤与不可变快照】(O13)", match: "出库记录列表接口强制硬编码 status = 'APPROVED' 过滤条件。", element: "text" },
    },
    targetId: "outbound-h5-list",
    number: 4,
    kind: "规则",
    title: "只查已通过台账（O13）",
    content:
      "列表固定过滤 APPROVED，不设状态列与状态筛选；审批中与已作废单据只在审批中心或我的申请出现。",
    details: [
      {
        title: "边界",
        items: [
          {
            label: "快照不可变",
            content: "台账内容为审批通过时固化的快照，后续库存调整不回写。",
          },
          {
            label: "加工类不出现在此",
            content: "质押/抵押加工出库只在加工模块留流水，不进本台账。",
          },
        ],
      },
    ],
  },
]

export const outboundH5InitiateAnnotations: PrototypeAnnotation[] = [
  {
    id: "outbound-h5-initiate",
    documentRefs: {
      prd: { section: "出库记录主PRD", match: "❌ (仅制单页发起)", element: "row" },
      rules: { section: "【关联单号带出与行级独立勾选】(O02)", match: "行选择与出库数量输入相互独立；货品品类数按勾选行计数，货品总数量和货物价值只汇总", element: "text" },
    },
    targetId: "outbound-h5-initiate",
    number: 1,
    kind: "页面",
    title: "业务办理 · 业务发起 · 出库发起",
    content:
      "移动端出库发起业务制单页（参考 wrl-agency-native cargo/outbound-goods 与最新基准版 PRD）。支持货主选择、出库类型（普通出库、仓单出库、质押出库、抵押出库）、关联业务单号带出货物、货品勾选与出库数量录入、提货人信息核验与出库现场照片上传；执行先解押后发货硬控，提交前必须核验现场照片与库存可用量（O02/O06/O10）。",
    details: [
      {
        title: "制单风控",
        items: [
          {
            label: "O02 独立勾选",
            content: "首列独立勾选，未勾选不计入汇总，已勾选必须录入有效数量。",
          },
          {
            label: "C06 照片必传",
            content: "必须上传至少 1 张现场实物照片方可提交审核。",
          },
        ],
      },
      {
        title: "制单流转",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["业务办理 → 业务发起 → 出库发起"] --> B["选货主 + 出库类型"]
    B --> C{"是否关联单"}
    C -->|普通出库| D["添加货品：选库位 → 录数量"]
    C -->|仓单/质押/抵押| E["选关联单号 → 带出货品并逐行勾选"]
    D --> F["提货人信息 + 现场照片"]
    E --> F
    F --> G{"提交校验"}
    G -->|库存不足| H["阻断：可用库存不足 (O09)"]
    G -->|未解押| I["阻断：先解押后发货 (O10)"]
    G -->|通过| J["提交审核 → 审批通过后生成提货单"]`,
          },
        ],
      },
    ],
  },
  {
    id: "outbound-h5-initiate-basic",
    targetId: "outbound-h5-initiate",
    number: 2,
    kind: "字段",
    title: "基础信息字段",
    content:
      "货主、出库类型、关联单号、出库日期与仓库构成制单头部；货主必须从货主信息域选择已有档案，不提供快捷建档。",
    documentRefs: {
      fields: { section: "一、单据级业务字段", match: "货主类型", element: "row" },
      rules: { section: "【业务时间合规性】(O04)", match: "严禁选择未来时间", element: "text" },
    },
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "基础信息",
            content: `| 字段名称 | H5 控件 | 必填 | 取值范围与格式 | 校验与提示 |
| :--- | :--- | :---: | :--- | :--- |
| **货主** | 选择器 | 是 | 仅已有档案 | 无档案提示「请先在货主信息中建档」 |
| **出库类型** | 下拉 | 是 | 普通 / 仓单 / 质押 / 抵押 | 变更后清空已选货物 |
| **关联单号** | 选择 | 关联类必填 | 仓单 / 质押 / 抵押单号 | 未选提示「请选择关联单号」 |
| **出库日期** | 日期时间 | 是 | 默认当前，不可选未来 | 选未来时阻断「出库日期不能晚于当前时间」 (O04) |
| **仓库** | 只读带出 | 是 | 实体监管仓库 | 只允许单仓 (O07) |
| **备注** | 多行 | 否 | 最多 140 个字符 | 超长阻断 |`,
          },
        ],
      },
    ],
  },
  {
    id: "outbound-h5-initiate-goods",
    documentRefs: {
      prd: { section: "出库记录主PRD", match: "【关联单号带出与行级独立勾选】(O02)", element: "row" },
      rules: { section: "【关联单号带出与行级独立勾选】(O02)", match: "行选择与出库数量输入相互独立；货品品类数按勾选行计数，货品总数量和货物价值只汇总", element: "text" },
    },
    targetId: "outbound-h5-initiate",
    number: 3,
    kind: "交互",
    title: "货品勾选与数量录入",
    content:
      "普通出库按货品分组选库位；关联出库由单号带出货物，逐行勾选并录数量；未勾选行不计入底栏汇总。",
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "选货交互",
            content: `| 操作 | 前置条件 | 点击后发生什么 | 提示原话 |
| :--- | :--- | :--- | :--- |
| **添加货品** | 已选货主 | 打开选货面板并选库位 | 未选货主提示「请选择货主」 |
| **勾选行** | 关联类出库 | 勾选计入汇总 | 已勾选未填数量提示「请填写出库数量」 (O02) |
| **录入数量** | 已勾选 | 数字键盘输入 | 超可用量提示「出库数量不能超过可用库存」 (O09) |
| **提交** | 照片已传、至少 1 行 | 提交审核 | 未传照片提示「请上传现场照片」 (C06) |`,
          },
        ],
      },
    ],
  },
  {
    id: "outbound-h5-initiate-rules",
    documentRefs: {
      rules: { section: "【库存行级锁与防双花扣减】(O09)", match: "提交或进入审批时建立短时库存锁；锁定库存必须记录单据号、批次、位置、数量、失效时", element: "text" },
    },
    targetId: "outbound-h5-initiate",
    number: 4,
    kind: "规则",
    title: "先解押后发货（O10 / O09）",
    content:
      "质押出库必须先解押再发货；提交时对库存做短时锁定，审批通过才真正扣减。",
    details: [
      {
        title: "拦截口径",
        items: [
          {
            label: "解押前置",
            content: "质押出库未解押时提交即阻断，提示「请先完成解押后再发起出库」(O10)。",
          },
          {
            label: "库存锁定",
            content: "提交瞬间短时锁定可用库存，防止并发双花 (O09)。",
          },
        ],
      },
    ],
  },
]

export const outboundH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "outbound-h5-detail",
    targetId: "outbound-h5-detail",
    number: 1,
    kind: "页面",
    title: "移动端 · 出库详情",
    content:
      "展示出库单号（带一键复制）、绿色【已通过】印章、货主信息、出库类型、货物位置与出库前后数量明细；四 Tab：货物明细（带行数）、提货信息（Tab 角标/圆点提示提货状态）、审核记录、资料管理；提货完成后在【提货信息】Tab 展示提货人登记与现场提货记录（O11/O13）。",
    documentRefs: {
      prd: { section: "6.2 出库单详情页", match: "提货记录", element: "text" },
      rules: { section: "【提货单自动生成与现场影像存证】(O11)", match: "提货记录", element: "text" },
    },
    details: [
      {
        title: "详情结构与数据来源",
        items: [
          {
            label: "信息架构图",
            content: `flowchart TD
    A["顶部：出库单号 + 已通过印章"] --> B["基础信息：货主 / 类型 / 日期 / 仓库"]
    B --> C["Tab 货物明细（带行数）"]
    B --> D["Tab 提货信息（有提货时显示圆点）"]
    B --> E["Tab 审核记录"]
    B --> F["Tab 资料管理"]
    D --> G["提货人登记 + 现场提货记录"]
    C --> H["出库前后数量与库位"]`,
          },
          {
            label: "上下游",
            content: "上游为审批通过的出库申请或移库/转让联动；下游生成提货单并核减库存 (O11)。",
          },
          {
            label: "权限",
            content: "只读查看；仅授权仓库单据可打开；敏感字段按 O14 脱敏。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-h5-detail-fields",
    targetId: "outbound-h5-detail",
    number: 2,
    kind: "字段",
    title: "货物与提货字段",
    content:
      "货物明细展示货物名称、库位、出库前后数量与条码；提货信息展示提货人、证件号、手机号、车牌号与现场照片（提货完成后）。",
    documentRefs: {
      fields: { section: "三、提货与影像字段", match: "提货人姓名", element: "row" },
    },
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "货物与提货",
            content: `| 字段名称 | 展示 | 必填 | 格式 | 说明 |
| :--- | :--- | :---: | :--- | :--- |
| **货物名称** | 明细行 | 是 | 大类-品类-规格 | — |
| **位置** | 明细行 | 是 | 仓库-库房-分区-具体位置 | 未划分显示「--」 |
| **出库前 / 出库后数量** | 明细行 | 是 | 数值 + 单位 | 关联类出库必须展示 |
| **存货条码** | 图标 | 系统生成 | 点击看大图 | 实物批次索引 |
| **提货人类型 / 姓名** | 提货 Tab | 条件 | 个人 / 企业；姓名 | 提货完成后展示 |
| **提货人身份证号 / 手机号** | 提货 Tab | 条件 | 脱敏 | 脱敏中间 4 位 (O14) |
| **车牌号** | 提货 Tab | 条件 | 最多 10 个字符 | — |
| **现场照片** | 提货 Tab | 条件 | 缩略图 + 全屏 | 提货完成后的现场记录 |`,
          },
        ],
      },
    ],
  },
  {
    id: "outbound-h5-detail-pickup",
    documentRefs: {
      prd: { section: "修订记录", match: "出库记录列表、新增、详情", element: "row" },
      rules: { section: "七、修订记录", match: "出库记录全模块", element: "row" },
    },
    targetId: "outbound-h5-detail",
    number: 3,
    kind: "交互",
    title: "提货信息 Tab 与资料管理",
    content:
      "未提货时展示核销引导；已提货展示提货人登记与现场记录；移库/转让出库展示免提货说明。",
    details: [
      {
        title: "Tab 展示矩阵",
        items: [
          {
            label: "操作矩阵",
            content: `| 提货状态 | Tab 展示内容 | 可操作 | 提示 |
| :--- | :--- | :--- | :--- |
| **待提货** | 核销引导说明 | 查看 | 「请提货人到现场核销」 |
| **已提货** | 提货人登记 + 现场照片 + 提货时间 | 查看大图 | — |
| **移库 / 转让出库** | 免提货说明 | 查看 | 「本单为联动出库，无需提货」 |`,
          },
        ],
      },
    ],
  },
  {
    id: "outbound-h5-detail-readonly",
    documentRefs: {
      rules: { section: "【已通过台账专网过滤与不可变快照】(O13)", match: "详情显示归档时快照；后续库存位置或关联单据变化不得反写已归档出库数量。", element: "text" },
    },
    targetId: "outbound-h5-detail",
    number: 4,
    kind: "规则",
    title: "快照只读（O13）",
    content:
      "详情为审批通过时的不可变快照，后续库存变动或关联单据变化不覆盖本页内容。",
    details: [
      {
        title: "边界",
        items: [
          {
            label: "为什么不回写",
            content: "归档单据是对外凭据，必须保持出具时的原始事实。",
          },
        ],
      },
    ],
  },
]
