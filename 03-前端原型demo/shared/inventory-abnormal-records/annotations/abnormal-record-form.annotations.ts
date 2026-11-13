import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const abnormalRecordFormAnnotations: SharedPrototypeAnnotation[] = [
  {
    id: "abnormal-form-picker",
    targetId: "abnormal-form-picker",
    number: 1,
    kind: "规则",
    title: "普通存货准入边界与在押资产阻断",
    content:
      "新增异动时，系统仅允许对【普通入库】且【存货中】且【可用数量大于0】的自由存货发起申报（R01）。处于抵押、质押或监管状态的在押金融资产严禁在仓储端发起异动，前置强制拦截阻断并引导至融资监管专属通道（R02），坚决守牢金融安全底线。",
    documentRefs: {
      prd: {
        section: "2. 功能范围",
        match: "金融在押资产风控红线硬隔离",
        element: "text",
      },
      fields: {
        section: "三、新增异动存货明细选择弹窗字段",
        match: "状态",
        element: "row",
      },
      rules: {
        section: "1. 存货与货权范围控制规则",
        match: "金融在押存货异动禁入阻断",
        element: "text",
      },
    },
    details: [
      {
        title: "风控隔离",
        items: [
          {
            label: "在押隔离",
            content: "严禁仓储端直接对抵质押资产发起调账。",
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-form-diff",
    targetId: "abnormal-form-diff",
    number: 2,
    kind: "规则",
    title: "异动后可用数量校验与差额动态试算",
    content:
      "异动后可用数量必须严格大于0（R04）。输入时系统动态试算差额 ΔQ = 异动后数量 - 异动前数量（R05）：若大于0显示红色增量（⬆），若小于0显示绿色减量（⬇），若等于0则阻断提交并提示无变动；异动类型单选必填，异动原因限制最多 500 字，支持上传最多 3 张现场照片凭证。",
    documentRefs: {
      prd: {
        section: "6.2 异动申请发起页（P-CKG-013-APPLY）",
        match: "异动申请录入",
        element: "text",
      },
      fields: {
        section: "四、异动申请发起页字段",
        match: "异动后可用数量",
        element: "row",
      },
      rules: {
        section: "2. 差额试算与输入防护规则",
        match: "异动后可用数量严格校验",
        element: "text",
      },
    },
    details: [
      {
        title: "差额试算",
        items: [
          {
            label: "红升绿降",
            content: "增量红字高亮，减量绿字高亮，零差额阻断提交。",
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-form-page",
    documentRefs: {
      prd: { section: "货物异动-异动记录主PRD", match: "提交异动申请", element: "row" },
      rules: { section: "一、单据与能力定位" },
    },
    targetId: "abnormal-form-picker",
    number: 0,
    kind: "页面",
    title: "新增异动申请",
    content: "选择源头单据与货物，录入变动后数量与原因，差额自动试算后提交审批。",
    details: [
      {
        title: "业务流转",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["新增异动申请"] --> B["选择源头单据（存货 / 质押 / 抵押 / 监管）"]
    B --> C["选择货物并录入变动后数量"]
    C --> D["系统试算差额（红升绿降）"]
    D --> E{"差额是否为 0？"}
    E -->|是| F["阻断：变动后数量不能等于变动前"]
    E -->|否| G["填写变动原因 + 现场照片 → 提交审批"]`,
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-form-fields",
    documentRefs: {
      fields: { section: "二、列表表格业务字段", match: "列表独立展示", element: "row" },
      rules: { section: "二、数量核算口径隔离表", match: "期初堆放数量", element: "row" },
    },
    targetId: "abnormal-form-diff",
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
| **源头单据** | 选择器 | 必填 | 存货单 / 质押单 / 抵押单 / 监管业务单 | 选中后带出货物 |
| **货物** | 选择器 | 必填 | 该单据下的在库货品 | 逐件录入 |
| **变动前数量** | 只读数值 | 系统带出 | 数值 + 单位 | 右对齐 |
| **变动后数量** | 数值输入 | 必填 | 大于等于 0 | 超范围阻断 |
| **差额** | 只读数值 | 系统计算 | 正红⬆ / 负绿⬇ | 实时试算 |
| **变动类型** | 下拉 | 必填 | 盘盈 / 盘亏 / 损耗 / 其他 | — |
| **变动原因** | 多行文本 | 必填 | 最多 200 字 | 为空阻断 |
| **现场照片** | 图片上传 | 选填 | 最多 10 张 | — |`,
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-form-actions",
    documentRefs: {
      prd: { section: "5. 状态机与动作能力矩阵", match: "✅ (本菜单行操作)", element: "row" },
    },
    targetId: "abnormal-form-picker",
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
| **提交审批** | 差额非 0、原因已填 | 进入审批专网 | 差额为 0 时「变动后数量不能等于变动前」 |
| **取消** | 有修改时 | 二次确认后离开 | 「离开将丢失已填写内容，确定吗？」 |`,
          },
        ],
      },
    ],
  },
]
