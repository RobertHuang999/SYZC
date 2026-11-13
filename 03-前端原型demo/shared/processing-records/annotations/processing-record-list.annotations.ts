import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const processingRecordListAnnotations: SharedPrototypeAnnotation[] = [
  {
    id: "processing-record-page",
    targetId: "processing-record-page",
    number: 1,
    kind: "页面",
    title: "加工记录台账定位",
    content:
      "规范存货在仓储监管期间的切割、拆分、熔炼、组装等加工行为，实现计划投入库存锁定、实际消耗扣减、计划余量释放、产出入库、新存货条码生成及抵/质押货权无缝继承的全链路闭环（R01~R36）。",
    documentRefs: {
      prd: {
        section: "2. 功能范围",
        match: "加工记录列表",
        element: "text",
      },
      rules: {
        section: "三、状态定义",
        match: "未完成",
        element: "text",
      },
    },
    details: [
      {
        title: "状态机与流转",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["新增加工申请"] --> B["审批专网"]
    B -->|通过| C["未完成<br/>计划投入已锁定"]
    B -->|驳回 / 撤销| D["审批中心查看（本台账不展示）"]
    C -->|完工登记| E["已完成<br/>实际消耗扣减 + 产出入库"]
    C -->|作废| F["作废（终态）"]
    E --> G["抵押 / 质押加工：新条码货权继承原单据 (R26/R36)"]`,
          },
        ],
      },
      {
        title: "状态机与业务口径",
        items: [
          {
            label: "三态收敛",
            content: "列表严格收敛为未完成 (PENDING_COMPLETION)、已完成 (COMPLETED)、作废 (VOIDED) 三态，审批中过程态在系统通用审批中心查看，本台账不展示中间审批态（R11/R12）。",
          },
          {
            label: "货权继承机制",
            content: "抵押加工或质押加工完成后，系统将原抵质押单被消耗旧条码置为已出库，新生成的产出存货条码追加入原单据物料清单，货权链路不中断（R26/R36）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-filters-panel",
    targetId: "processing-filters-panel",
    number: 2,
    kind: "交互",
    title: "列表筛选区规范 (4列 + 展开)",
    content:
      "严格遵循 PC 列表筛选规范（lg:grid-cols-4 默认首行 4 项 + 展开区 5 项）。严格分离草稿态（draft）与生效态（applied），点【查询】后生效并重置至第 1 页。",
    details: [
      {
        title: "筛选项配置",
        items: [
          {
            label: "默认首行 4 项",
            content: "加工单号（文本模糊匹配）、加工日期（日期范围）、货主名称/标识（复合搜索）、加工类型（下拉单选）。",
          },
          {
            label: "展开区 5 项",
            content: "仓库名称（精确搜索）、货品名称（投入/产出双向匹配）、单据状态（三态单选）、制单人（单选）、制单时间（日期范围）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-record-table",
    documentRefs: {
      fields: { section: "加工管理字段清单", match: "初版加工管理字段清单", element: "row" },
      rules: { section: "加工管理业务规则规格", match: "参考文档：《加工管理主PRD》、《加工管理字段清单》、《14-货品管理字段清单》", element: "text" },
    },
    targetId: "processing-record-page",
    number: 3,
    kind: "字段",
    title: "14 列标准台账表格",
    content:
      "遵循《加工管理字段清单》标准 14 列，固定行高 72px，单号与多行长文本在单元格内折行换行（不截断省略），操作列采用实色背景防文字滚动穿透。",
    details: [
      {
        title: "列定义与展示规则",
        items: [
          {
            label: "单号与货主",
            content: "加工单号为 19 位纯数字，支持悬停一键复制；货主为第 1 行名称、第 2 行信用代码/脱敏手机号双行复合呈现。",
          },
          {
            label: "投入与产出双列",
            content: "计划投入货物、实际投入货物（未完成/作废显示 --）、计划产出货物、实际产出货物（未完成/作废显示 --）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-complete-action",
    documentRefs: {
      rules: { section: "3. 完成加工与产出入库原子事务", match: "#### 【实际产出数量合规性】(R21)", element: "text" },
      fields: { section: "0. 字段层级说明", match: "统计汇总字段：用于试算与展示投入品类数、投入总数量、预计产出总货值、实际产出总货", element: "text" },
    },
    targetId: "processing-complete-action",
    number: 4,
    kind: "规则",
    title: "完成加工并入库原子事务 (R21~R26)",
    content:
      "现场监管员录入实际消耗量（大于0且不超过锁定量，严禁为0 R23）、实际产出数量（大于0 R21）、货物位置与具体位置（必填 R22）、动态采集属性，以及损耗比例和 500 字损耗说明（R25）。提交后原子扣减消耗、自动释放余量（R24）并生成新存货条码（R26）。",
    details: [
      {
        title: "核心拦截规则",
        items: [
          {
            label: "零消耗拦截",
            content: "每条实际消耗必须大于 0；若某条投入完全未使用需作废单据后重新发起（R23）。",
          },
          {
            label: "损耗留痕",
            content: "损耗比例与说明仅作技术指标留痕，不参与库存扣减与货值/安全线计算（R25）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-nullify-action",
    documentRefs: {
      rules: { section: "【未完成单据作废与审计留痕】(R14)", match: "单据处于 未完成 状态时，具备作废权限的人员可点击【作废】；", element: "text" },
      prd: { section: "修订记录" },
    },
    targetId: "processing-nullify-action",
    number: 5,
    kind: "规则",
    title: "未完成单据作废与库存释放 (R14)",
    content:
      "单据处于未完成状态时，授权人员点击唤起【作废确认】黄色警示弹窗，强制录入作废原因（最多 500 字）。确认后全额释放原投入货物的计划锁定库存，状态置为作废，落账至修改记录。",
    details: [
      {
        title: "作废后置影响",
        items: [
          {
            label: "库存全额释放",
            content: "事务内调用库存引擎全额解锁释放计划投入锁定量，恢复在库可用库存。",
          },
          {
            label: "终态留痕",
            content: "单据进入业务终态，详情右上角盖灰色印章，不可二次修改或反作废（R14）。",
          },
        ],
      },
    ],
  },
  {
    id: "processing-list-fields",
    documentRefs: {
      fields: { section: "加工管理字段清单", match: "货品基础信息", element: "row" },
      rules: { section: "【实际产出数量合规性】(R21)", match: "完成加工登记时，每条产出货物的实际产出数量必须 大于 0；允许大于或小于预计产出", element: "text" },
    },
    targetId: "processing-record-page",
    number: 99,
    kind: "字段",
    title: "字段字典",
    content: "展示加工单基础信息、投入与产出数量、状态与审计字段。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "字段",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **加工单号** | 文本 | 系统生成 | 19 位数字串 | 可复制 |
| **加工类型** | 标签 | 必填 | 普通加工 / 质押加工 / 抵押加工 / 监管服务加工 | 单行 |
| **货主** | 文本 | 必填 | 企业全称 / 个人姓名 | 单行 |
| **仓库 / 库房** | 文本 | 必填 | 仓库-库房-分区 | 单行 |
| **投入货品** | 表格 | 必填 | 大类-品类-规格 + 数量 | 两级树形 |
| **产出货品** | 表格 | 必填 | 大类-品类-规格 + 数量 + 新条码 | 单行 |
| **加工日期** | 日期时间 | 必填 | YYYY-MM-DD HH:mm:ss | 单行 |
| **状态** | 状态标签 | 系统维护 | 未完成 / 已完成 / 作废 | 彩色标签 |
| **操作人 / 时间** | 文本 | 系统记录 | 姓名 + 时间 | 双行 |`,
          },
        ],
      },
    ],
  },
]
