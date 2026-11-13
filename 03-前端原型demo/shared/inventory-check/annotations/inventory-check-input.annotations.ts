import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const inventoryCheckInputAnnotations: SharedPrototypeAnnotation[] = [
  {
    id: "check-input-header",
    targetId: "check-input-header",
    number: 1,
    kind: "页面",
    title: "待盘点录入总览与操作控制 (R02/R07)",
    content:
      "单据顶部展示盘点单号、状态大印章及基本元数据；右上角提供【返回】、仅制单人在未开始状态可用的红色【撤销】与金色【提交】。",
    documentRefs: {
      prd: {
        section: "6.3 待盘点页 / PC 端盘点录入",
        match: "单据概览",
        element: "text",
      },
      rules: {
        section: "五、待盘点页 / PC端盘点录入业务规则",
        match: "盘点录入与必填项核验",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "check-input-table",
    documentRefs: {
      prd: { section: "货物盘点主PRD", match: "实盘数（或无需盘点）+ 存在/完好/位置三项核验下拉必填，支持上传附件照片", element: "row" },
      rules: { section: "【盘点录入与必填项核验】(R07)", match: "盘点数量录入：", element: "text" },
    },
    targetId: "check-input-table",
    number: 2,
    kind: "交互",
    title: "实盘核验与无需盘点切换控制 (R07)",
    content:
      "实盘数量支持数值录入，勾选【无需盘点】复选框自动清空并置灰输入框；是否存在、是否完好、位置一致三项下拉强校验必填；支持上传现场物证照片。",
    details: [
      {
        title: "盘点录入流程",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["开始盘点（盘点中）"] --> B["逐货品录入实盘数量"]
    B --> C["系统试算差异（正红 / 负绿）"]
    C --> D{"是否录入完整"}
    D -->|否| B
    D -->|是| E["提交盘点结果"]
    E --> F["盘点完成 → 差异进入异常处理"]`,
          },
        ],
      },
      {
        title: "提交完整性校验",
        items: [
          {
            label: "逐行扫描",
            content: "提交时必须所有货品行均完成录入，未完善时系统定位未填行红框报错阻断提交。",
          },
        ],
      },
    ],
  },
  {
    id: "check-input-fields",
    documentRefs: {
      fields: { section: "货物盘点字段清单", match: "展示（本次数量）", element: "row" },
      rules: { section: "3.1 状态定义", match: "状态流转触发条件", element: "row" },
    },
    targetId: "check-input-table",
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
| **货物** | 只读文本 | 必填 | 大类-品类-规格 | 单行 |
| **库位** | 只读文本 | 必填 | 仓库-库房-分区-垛位 | 单行 |
| **账面数量** | 只读数值 | 系统带出 | 数值 + 单位 | 右对齐 |
| **实盘数量** | 数值输入 | 必填 | 大于等于 0 | 未填阻断提交 |
| **差异数量** | 只读数值 | 系统计算 | 正红 / 负绿 | 实时试算 |
| **差异说明** | 多行文本 | 条件必填 | 差异非 0 时必填，最多 200 字 | 为空阻断 |`,
          },
        ],
      },
    ],
  },
  {
    id: "check-input-actions",
    documentRefs: {
      rules: { section: "【基础信息录入与校验】(R03)", match: "盘点时间范围逻辑校验：", element: "text" },
    },
    targetId: "check-input-table",
    number: 0,
    kind: "交互",
    title: "录入操作与提示",
    content: "逐行录入实盘数量，差异实时试算；提交前校验必填与说明。",
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "按钮与提示",
            content: `| 操作 | 前置条件 | 点击后发生什么 | 提示原话 |
| :--- | :--- | :--- | :--- |
| **录入实盘数量** | 盘点中 | 实时试算差异 | 负数时阻断「实盘数量不能小于 0」 |
| **填写差异说明** | 差异非 0 | 保存说明 | 未填提示「差异不为 0 时必须填写说明」 |
| **提交盘点** | 全部行已录 | 生成盘点结果 | 有未填行时提示「请完成全部货物盘点」 |`,
          },
        ],
      },
    ],
  },
]
