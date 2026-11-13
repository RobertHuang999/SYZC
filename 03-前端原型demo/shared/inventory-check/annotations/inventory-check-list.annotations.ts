import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const inventoryCheckListAnnotations: SharedPrototypeAnnotation[] = [
  {
    id: "inventory-check-page",
    targetId: "inventory-check-page",
    number: 1,
    kind: "页面",
    title: "货物盘点台账定位与权限并集模型",
    content:
      "面向大宗商品与动产质押现场实物核查的监管核心台账。针对抵质押物验证“货在、货好、位对、数准”，通过四项实物核验指标排查盘亏、破损、移位与虚假库存风险，支持取并集权限模型（R01）与操作矩阵（R02）。",
    documentRefs: {
      prd: {
        section: "2. 功能范围",
        match: "盘点任务列表页",
        element: "text",
      },
      rules: {
        section: "二、数据权限控制规则",
        match: "盘点任务权限判定并集模型",
        element: "text",
      },
    },
    details: [
      {
        title: "盘点状态机",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["生成盘点任务"] --> B["未开始"]
    B -->|开始盘点| C["盘点中"]
    B -->|超过计划时间| D["已超期（仍可补盘）"]
    C -->|提交盘点结果| E["盘点完成"]
    D -->|补盘提交| E
    E --> F{"账实是否一致"}
    F -->|一致| G["结果正常"]
    F -->|不一致| H["结果异常 → 异常处理<br/>未处理 / 已处理"]`,
          },
        ],
      },
      {
        title: "权限并集判定 (R01)",
        items: [
          {
            label: "判定公式",
            content: "当前用户满足「仓库管辖权」∪「任务指派人员」∪「制单人本人」三者之一，即享有该单据完整数据权限。",
          },
          {
            label: "撤销操作约束",
            content: "仅在「未开始」状态且当前用户为「制单人本人」时展示【撤销】按钮；进入盘点中或产生数据后严禁撤销。",
          },
        ],
      },
    ],
  },
  {
    id: "check-filters-panel",
    documentRefs: {
      prd: { section: "5. 典型业务场景故事（User Stories）" },
    },
    targetId: "check-filters-panel",
    number: 2,
    kind: "交互",
    title: "列表 10 项维度筛选与规范对齐",
    content:
      "严格遵循 PC 列表筛选规范（lg:grid-cols-4 默认首行 4 项 + 展开区 6 项）。草稿态与生效态分离，提供金色【查询】与【重置】按钮。",
    details: [
      {
        title: "筛选字段分布",
        items: [
          {
            label: "默认高频 4 项",
            content: "盘点单号（精确匹配）、任务名称（模糊搜索）、盘点状态（6 种状态单选）、盘点类型（全部/账面汇总/库存明细）。",
          },
          {
            label: "展开区 6 项",
            content: "仓库名称（单选）、盘点结果（全部/正常/异常）、实际盘点人（多选）、制单人（单选）、盘点日期（起止）、制单时间（起止）。",
          },
        ],
      },
    ],
  },
  {
    id: "check-table-main",
    documentRefs: {
      fields: { section: "货物盘点字段清单", match: "货物盘点全模块", element: "row" },
      rules: { section: "货物盘点业务规则规格", match: "货物盘点全模块", element: "row" },
    },
    targetId: "check-table-main",
    number: 3,
    kind: "字段",
    title: "14 列标准台账表格与防穿透规范",
    content:
      "遵循《货物盘点字段清单》14 列，固定行高 72px，PingFang SC 苹方字体，单号禁止截断，操作列采用实色背景与阴影防文字横向滚动穿透。",
    details: [
      {
        title: "状态与操作联动 (R02)",
        items: [
          {
            label: "去盘点入口",
            content: "状态为「未开始」、「盘点中」、「已超期」时均展示【盘点】操作，允许超期补盘。",
          },
          {
            label: "结果与异常处理",
            content: "盘点结果展示「正常」或「异常」；当为异常时，「异常处理」列动态呈现「未处理」或「已处理」。",
          },
        ],
      },
    ],
  },
  {
    id: "check-list-fields",
    documentRefs: {
      fields: { section: "货物盘点字段清单", match: "展示（本次数量）", element: "row" },
      rules: { section: "3.1 状态定义", match: "状态流转触发条件", element: "row" },
    },
    targetId: "check-table-main",
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
| **盘点单号** | 文本 | 系统生成 | 精确匹配 | 可复制 |
| **任务名称** | 文本 | 必填 | 模糊搜索 | 单行 |
| **盘点类型** | 标签 | 必填 | 账面汇总 / 库存明细 | 单行 |
| **盘点状态** | 状态标签 | 系统维护 | 未开始 / 盘点中 / 已超期 / 已完成 等 | 彩色标签 |
| **盘点结果** | 标签 | 系统计算 | 正常 / 异常 | 异常标红 |
| **异常处理** | 标签 | — | 未处理 / 已处理 | 仅异常时展示 |
| **制单人** | 文本 | 系统记录 | 姓名(机构) | 单行 |
| **盘点时间** | 日期时间 | 系统记录 | YYYY-MM-DD HH:mm:ss | 单行 |`,
          },
        ],
      },
    ],
  },
]
