import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inboundH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-h5-list",
    documentRefs: {
      prd: { section: "入库管理主PRD（B端H5）", match: "入库管理 ws-inbound-mgr：工作台 → 仓储 → 入库管理 → 已通", element: "text" },
      rules: { section: "【入库管理已通过台账】(P01)" },
    },
    targetId: "inbound-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 入库管理",
    content:
      "已通过入库归档台账（对齐现网 store-record）：货主搜索、四筛、未打印二维码开关；卡片【单据下载】打开固定样式示意图（A4/A5/针式连续纸、带水印、两页换页），【下载记录】打开与存货管理一致的导出记录列表。流程中单据不在此列表。",
    details: [
      {
        title: "移动端台账结构",
        items: [
          {
            label: "数据流转图",
            content: `flowchart TD
    A["业务办理 · 入库发起"] --> B["审批专网"]
    B -->|通过| C["工作台 · 入库管理（仅已通过）"]
    B -->|驳回 / 撤销| D["我的申请 / 审批中心"]
    C --> E["卡片：入库单号 · 货主 · 货品摘要 · 入库日期"]
    E --> F["详情 / 单据下载 / 下载记录"]`,
          },
          {
            label: "入口与路由",
            content: "工作台 → 仓储 → 入库管理（模块 ws-inbound-mgr）；发起入口独立在「业务办理 → 业务发起 → 入库发起」。",
          },
          {
            label: "权限",
            content: "仅展示当前账号授权仓库的已通过单据；货主标识与手机号脱敏展示。",
          },
        ],
      },
    ],
  },
  {
    id: "inbound-h5-list-card",
    documentRefs: {
      fields: { section: "一、入库管理 — 列表卡片（对齐现网 store-record）", match: "入库货品摘要", element: "row" },
      rules: { section: "【列表多货品摘要与完整清单】(P09)" },
    },
    targetId: "inbound-h5-list",
    number: 2,
    kind: "字段",
    title: "列表卡片字段",
    content:
      "卡片展示入库单号、货主、入库类型、仓库、货品摘要、入库日期与数量；多货品时摘要显示「首规格 + 等 N 种」，可点开底部 Sheet 看全量清单（P09）。",
    details: [
      {
        title: "卡片字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **入库单号** | 文本 | 系统生成 | 19 位数字串 | 卡片首行，完整展示 |
| **货主名称 / 标识** | 文本 | 必填 | 名称 + 脱敏标识 | 同行或双行，标识浅色 |
| **入库类型** | 文本 | 必填 | 12 类字典展示名 | 单行 |
| **仓库名称** | 文本 | 必填 | 实体监管仓库全称 | 单行 |
| **入库货品摘要** | 文本 | 必填 | 首规格 +「等 N 种」 | 多货品时可点开 Sheet (P09) |
| **入库日期** | 文本 | 必填 | YYYY-MM-DD HH:mm:ss | 单行 |
| **入库数量** | 文本 | 系统计算 | 数值 + 单位 | 右对齐 |
| **制单人 / 制单时间** | 文本 | 系统记录 | 姓名(机构) + 时间 | 卡片底部 |
| **未打印二维码标识** | 图标 | — | 已打印 / 未打印 | 配合筛选开关 |`,
          },
        ],
      },
    ],
  },
  {
    id: "inbound-h5-list-actions",
    targetId: "inbound-h5-list",
    number: 3,
    kind: "交互",
    title: "卡片操作与筛选",
    content:
      "卡片底部三个操作：下载记录、单据、查看详情；顶部搜索 + 漏斗筛选（入库日期、制单时间、货物三级联选、仓库、入库类型、制单人、未打印二维码开关）。",
    documentRefs: {
      prd: { section: "3.1 入库管理列表", match: "行操作", element: "text" },
      fields: { section: "一、入库管理 — 列表卡片", match: "筛选", element: "text" },
    },
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "卡片操作",
            content: `| 操作 | 可见状态 | 点击后发生什么 | 成功提示 |
| :--- | :--- | :--- | :--- |
| **查看详情** | 已通过 | 进入详情页 | — |
| **单据** | 已通过 | 打开固定样式示意图（两页换页、示意水印） | 「预览仅为样式示意。正式凭证已提交生成，请到【下载记录】下载。」 |
| **下载记录** | 已通过 | 打开导出记录列表 | 异步生成后行内下载 |
| **筛选** | 已通过 | 底部抽屉：入库日期、制单时间、货物、仓库、入库类型、制单人、未打印开关 | 无结果时展示空态与重置 |`,
          },
        ],
      },
    ],
  },
  {
    id: "inbound-h5-list-approved",
    targetId: "inbound-h5-list",
    number: 4,
    kind: "规则",
    title: "只查已通过台账（P01 / P02）",
    content:
      "列表接口固定过滤已通过（APPROVED），不设状态 Badge 与状态下拉；发起入口与查询入口职责分离，发起统一走「业务办理 → 业务发起」。",
    documentRefs: {
      rules: { section: "【入库管理已通过台账】(P01)", match: "APPROVED", element: "text" },
    },
    details: [
      {
        title: "边界",
        items: [
          {
            label: "流程中单据去哪看",
            content: "审批中、驳回、撤销单据在审批中心或我的申请处理，本列表不展示。",
          },
          {
            label: "发起入口",
            content: "入库发起不在本列表，统一在「业务办理 → 业务发起 → 入库发起」(P02)。",
          },
        ],
      },
    ],
  },
]

export const inboundH5InitiateAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-h5-initiate",
    documentRefs: {
      prd: { section: "3.2 入库发起（P-H5-INBOUND-INIT）", match: "路径：/m/inbound/initiate → /m/inbound/init", element: "text" },
      rules: { section: "【新货主核验弹层】(P05)", match: "未建档货主在 提交审核 时唤起核验弹层（R03）；Mock 环境验证码 1234", element: "text" },
    },
    targetId: "inbound-h5-initiate",
    number: 1,
    kind: "页面",
    title: "业务办理 · 入库发起",
    content:
      "独立制单入口（warehousing-order）：货主与入库信息、货品库位、现场照片；提交前 R13 未堆放清零与新货主 R03 核验。",
    details: [
      {
        title: "两步制单流程",
        items: [
          {
            label: "步骤与校验",
            content: `flowchart TD
    A["业务办理 → 业务发起 → 入库发起"] --> B["第 1 步 基础信息<br/>货主 · 入库类型 · 关联单号 · 库房 · 照片"]
    B -->|校验通过| C["第 2 步 货品明细<br/>选 SKU · 录数量 · 分配堆放位置"]
    C --> D{"未堆放数量 = 0 ?"}
    D -->|否| C
    D -->|是| E["提交 → 审批专网"]
    E -->|通过| F["生成入库单号并归档到入库管理"]`,
          },
          {
            label: "上下游与权限",
            content:
              "货主来自合作方档案；库房来自仓库管理；移动端可发起普通、质押、抵押、仓单、监管服务入库 (R04f)；仅授权仓库可制单。",
          },
        ],
      },
    ],
  },
  {
    id: "inbound-h5-initiate-basic",
    documentRefs: {
      fields: { section: "二、入库发起 — 基础信息与货品（R04f）", match: "现场照片 / 补充资料", element: "row" },
      rules: { section: "【发起字段与 PC 新增对齐】(P04)" },
    },
    targetId: "inbound-h5-initiate",
    number: 2,
    kind: "字段",
    title: "基础信息字段",
    content:
      "货主类型、货主、入库类型、关联单号、入库库房与现场照片构成第一步；字段口径与 PC 新增页一致（P04）。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "基础信息",
            content: `| 字段名称 | H5 控件 | 必填 | 取值范围与格式 | 校验与提示 |
| :--- | :--- | :---: | :--- | :--- |
| **货主类型** | 双按钮 | 是 | 企业 / 个人 | 切换后清空已选货主 |
| **货主名称** | 输入 + 候选 | 是 | 按名称或手机检索 | 无档案时唤起快捷建档 (P05) |
| **入库类型** | 下拉 | 是 | 普通 / 质押 / 抵押 / 仓单 / 监管服务 | 选仓单入库需先选关联仓单 |
| **关联单号** | 选择 | 非普通必填 | 上游业务单号 | 未选时提示「请选择关联单号」 |
| **入库库房** | 多选 | 是 | 分组「需要审核 / 不审核」 | 混选时 Toast「同单库房审核属性必须一致」 (P06) |
| **现场照片** | 上传 | 是 | 最多 10 张，jpg/png | 未传提示「请上传现场照片」 |
| **补充资料** | 上传 | 否 | 图片 + PDF 合计 10 个 | — |`,
          },
        ],
      },
    ],
  },
  {
    id: "inbound-h5-initiate-goods",
    documentRefs: {
      prd: { section: "入库管理主PRD（B端H5）", match: "路径：/m/inbound/initiate → /m/inbound/init", element: "text" },
      rules: { section: "【入库货品三列级联选货】(P08)" },
    },
    targetId: "inbound-h5-initiate-goods",
    number: 3,
    kind: "交互",
    title: "货品明细 · P08 / R11",
    content:
      "单行【入库货品】打开三列级联 Sheet（大类/品类/SKU）；计量数量可填，单位随 SKU 只读（R11b）；收集项随 SKU；附件纵向；R13 未堆放试算。",
    details: [
      {
        title: "选货与堆放交互",
        items: [
          {
            label: "操作矩阵",
            content: `| 操作 | 前置条件 | 点击后发生什么 | 提示原话 |
| :--- | :--- | :--- | :--- |
| **选择入库货品** | — | 底部弹出三列级联 Sheet，选完回填摘要 | 未选全时提示「请选择完整的货品规格」 |
| **录入数量** | 已选 SKU | 数字键盘输入，单位只读灰底块 | 单位不可切换 (R11b) |
| **添加堆放位置** | 已录数量 | 逐行选择库房 / 分区 / 位置并填数量 | 超出剩余量提示「堆放数量不能超过未堆放数量」 |
| **提交** | 未堆放为 0、照片已传 | 进入审批 | 「存在未堆放货物，请分配完堆放位置后再提交」 (R13) |`,
          },
        ],
      },
    ],
  },
  {
    id: "inbound-h5-initiate-rules",
    documentRefs: {
      rules: { section: "【新货主核验弹层】(P05)", match: "未建档货主在 提交审核 时唤起核验弹层（R03）；Mock 环境验证码 1234", element: "text" },
    },
    targetId: "inbound-h5-initiate-goods",
    number: 4,
    kind: "规则",
    title: "提交前核验（R13 / P05）",
    content:
      "未堆放数量必须清零，新货主须完成短信核验；任一项不通过不允许提交。",
    details: [
      {
        title: "拦截口径",
        items: [
          {
            label: "未堆放清零",
            content: "所有货品未堆放数量严格等于 0 才可提交 (R13)。",
          },
          {
            label: "新货主核验",
            content: "新货主弹出身份确认 Sheet，短信核验通过后才可提交 (P05 / R03)。",
          },
        ],
      },
    ],
  },
]

export const inboundH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-h5-detail",
    documentRefs: {
      prd: { section: "入库管理主PRD（B端H5）", match: "数据前提：均为 已通过 归档单据。", element: "text" },
      rules: { section: "【入库管理已通过台账】(P01)" },
    },
    targetId: "inbound-h5-detail",
    number: 1,
    kind: "页面",
    title: "入库管理 · 详情",
    content:
      "仅已通过归档单：货物明细 Tab 按货品行展示现场照片(R16)、补充资料(R17含PDF预览)、设备抓拍(R18/P07)；Tab 名带货品行数；与 PC 查看附件弹窗三分区同口径；不提供撤销。",
    details: [
      {
        title: "详情结构",
        items: [
          {
            label: "信息架构图",
            content: `flowchart TD
    A["顶部：入库单号 + 已通过状态章"] --> B["基础信息：货主 / 类型 / 日期 / 仓库"]
    B --> C["Tab 货物明细（带货品行数）"]
    C --> D["货品行：货品 · 数量 · 堆放位置"]
    D --> E["附件：现场照片 / 补充资料 / 设备抓拍"]
    B --> F["Tab 审核记录"]
    B --> G["Tab 修改记录（仅特权纠偏时）"]`,
          },
          {
            label: "权限与边界",
            content: "只读查看，不提供撤销或编辑；仅授权仓库的单据可打开。",
          },
        ],
      },
    ],
  },
  {
    id: "inbound-h5-detail-card",
    targetId: "inbound-h5-detail",
    number: 2,
    kind: "字段",
    title: "货品行字段",
    content:
      "货品行展示货品规格、计量数量、其他收集信息、货品备注与堆放位置；堆放位置以嵌套卡片展示库房-分区-位置与堆放数量。",
    documentRefs: {
      fields: { section: "三、入库管理 — 详情（仅已通过）", match: "堆放位置", element: "row" },
    },
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "货品行字段",
            content: `| 字段名称 | 展示 | 必填 | 格式 | 说明 |
| :--- | :--- | :---: | :--- | :--- |
| **入库货品** | 卡片标题 / 明细行 | 是 | 大类 · 品类 · 规格 | 与发起 P08 一致 |
| **计量数量** | 明细行 | 是 | 数值 + 单位（空格分隔） | 标签随 SKU (R11b) |
| **其他收集信息** | 明细行 | 否 | 键值对 | 发起页快照 |
| **备注信息** | 明细行 | 否 | 最多 140 个字符 | 货品行备注，非单据头 |
| **堆放位置** | 嵌套卡片 | 条件 | 库房-分区-位置 + 数量 | 多位置逐条列出 |
| **现场照片 / 补充资料 / 设备抓拍** | 展开区 | 照片必填 | 缩略图 + 全屏相册 | R16 / R17 / R18 |`,
          },
        ],
      },
    ],
  },
  {
    id: "inbound-h5-detail-attachments",
    targetId: "inbound-h5-detail",
    number: 3,
    kind: "交互",
    title: "货品行附件查看",
    content:
      "货品行展开后分三块：现场照片缩略图（全屏相册）、补充资料（图片 + PDF 预览）、设备抓拍（设备名/时间/缩略图）；无抓拍显示「抓图失败或无监控设备接入」。",
    documentRefs: {
      rules: { section: "【详情货品行附件与 IoT 只读】(P07)", match: "抓图失败", element: "text" },
    },
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "附件交互",
            content: `| 区域 | 内容 | 操作 | 空态 / 提示 |
| :--- | :--- | :--- | :--- |
| **现场照片** | 缩略图网格 | 点击全屏相册、左右滑动 | 无照片时显示「暂无照片」 |
| **补充资料** | 图片缩略图 + PDF 行 | 图片看大图、PDF【预览】 | 无资料时显示「暂无补充资料」 |
| **设备抓拍** | 设备名、抓拍时间、缩略图 | 点击看大图 | 「抓图失败或无监控设备接入」 |`,
          },
        ],
      },
    ],
  },
  {
    id: "inbound-h5-detail-readonly",
    documentRefs: {
      rules: { section: "【详情货品行附件与 IoT 只读】(P07)" },
      fields: { section: "三、入库管理 — 详情（仅已通过）", match: "不含：撤销按钮、流程编辑。", element: "text" },
    },
    targetId: "inbound-h5-detail",
    number: 4,
    kind: "规则",
    title: "归档后只读（P07）",
    content:
      "详情仅已通过单据，全部字段只读；附件与抓拍用于事后查阅与存证，不提供撤销、编辑或重新抓拍。",
    details: [
      {
        title: "为什么只读",
        items: [
          {
            label: "存证要求",
            content: "归档即固化现场事实，任何修改都会破坏证据链，所以只开放查看。",
          },
        ],
      },
    ],
  },
]
