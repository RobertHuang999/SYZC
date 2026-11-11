import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const supervisionManagementListAnnotations: PrototypeAnnotation[] = [
  {
    id: "supervision-management-page",
    targetId: "supervision-management-page",
    number: 1,
    kind: "页面",
    title: "监管管理台账定位与边界",
    content:
      "本页面是监管办理终审生单后的存续期台账，承接抵押订单、质押订单、监管服务订单三类在押资产的货值监控、抵押率重算、风险预警与 24 项存续期操作。列表只做查询与单据操作，开单入口在【监管办理】，本页不设新增。",
    documentRefs: {
      prd: { section: "4. 页面功能说明 (PC 端与移动端)", match: "路径", element: "text" },
      fields: {
        section: "一、主表/头部与基础识别字段 (14 维标准字典)",
        match: "业务大类标签页",
        element: "row",
      },
      rules: { section: "1. 状态机本体与状态定义", match: "ACTIVE", element: "text" },
    },
    details: [
      {
        title: "台账边界",
        items: [
          {
            label: "数据来源",
            content: "来自监管办理终审生单快照：货主、货位条码、评估单价、中仓登登记号开单即固化。",
          },
          {
            label: "旧链路只读",
            content: "旧「供应链监管业务」与旧 H5「监管订单」入口已下线，历史单据只读兼容。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-tabs",
    targetId: "supervision-management-tabs",
    number: 2,
    kind: "交互",
    title: "三大业务单据标签页",
    content:
      "顶部固定三个 Tab：抵押订单（固定抵押 / 浮动抵押）、质押订单（静态质押 / 流动质押）、监管服务订单（固定服务 / 浮动服务）。切换 Tab 时，四大看板、筛选项、列头文案、状态选项与行操作文案同步刷新。",
    documentRefs: {
      prd: { section: "4.1 PC 端列表与看板页规格", match: "顶层业务大类标签页", element: "text" },
      fields: {
        section: "一、主表/头部与基础识别字段 (14 维标准字典)",
        match: "业务大类标签页",
        element: "row",
      },
      rules: { section: "5.1 业务单据类型枚举", match: "抵押", element: "row" },
    },
    details: [
      {
        title: "文案联动",
        items: [
          {
            label: "列头",
            content: "抵押单号/抵押状态/抵押方式/抵押率，切质押或监管服务后同步换名。",
          },
          {
            label: "操作",
            content: "解押类操作随 Tab 变文案：解抵押 / 解质押 / 解除监管。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-stats",
    targetId: "supervision-management-stats",
    number: 3,
    kind: "字段",
    title: "四大统计看板",
    content:
      "全部单据、抵押中（随 Tab 变为质押中/监管中）、货物评估价值总额(万)、存在风险。看板按当前 Tab 的权限内全量数据统计，不随筛选条件变化；点击【存在风险】卡片会把风险预警筛选置为「有风险」并立即查询。",
    documentRefs: {
      prd: { section: "4.1 PC 端列表与看板页规格", match: "四大统计看板", element: "text" },
      fields: {
        section: "三、统计汇总与风控指标字段",
        match: "全部单据",
        element: "row",
      },
      rules: { section: "5.3 风险预警状态枚举", match: "有风险", element: "row" },
    },
    details: [
      {
        title: "口径",
        items: [
          {
            label: "评估价值总额",
            content: "只累计在押有效订单的货物评估价值；未定价货品不计入，鼠标悬浮可见说明。",
          },
          {
            label: "存在风险",
            content: "统计存在未结案待处置预警的订单笔数，点击卡片直接联动筛选。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-filter",
    targetId: "supervision-management-filter",
    number: 4,
    kind: "字段",
    title: "组合查询筛选区",
    content:
      "默认展示 4 项：单号、货主名称/标识、业务状态、业务方式；展开后追加风险预警、货品名称、流程相关机构、业务时间范围。筛选采用草稿态 + 生效态，只有点【查询】才刷新列表，【重置】清空并重新检索。",
    documentRefs: {
      prd: { section: "4.1 PC 端列表与看板页规格", match: "组合查询筛选区", element: "text" },
      fields: {
        section: "一、主表/头部与基础识别字段 (14 维标准字典)",
        match: "货主名称",
        element: "row",
      },
      rules: { section: "5.3 风险预警状态枚举", match: "RiskStatusEnum", element: "text" },
    },
    details: [
      {
        title: "控件与匹配",
        items: [
          {
            label: "单号",
            content: "按当前 Tab 显示抵押单号/质押单号/监管单号，支持模糊匹配。",
          },
          {
            label: "货主名称/标识",
            content: "同时匹配企业全称、统一社会信用代码、个人姓名与手机号。",
          },
          {
            label: "业务时间",
            content: "按终审确权生效时间匹配，开始与结束日期都包含当天。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-order-no",
    targetId: "supervision-management-order-no",
    number: 5,
    kind: "字段",
    title: "业务单号与风险/在途标识",
    content:
      "19 位业务单号完整展示、折两行不截断，点击可进入详情。单号下方按情况出现两种标识：存在未结案预警时亮红色「风险」标签；存在在途审批时亮琥珀色「在途：任务名」标签，此时变更类操作全部置灰。",
    documentRefs: {
      prd: { section: "4.1 PC 端列表与看板页规格", match: "表格展示与列定义", element: "text" },
      fields: {
        section: "一、主表/头部与基础识别字段 (14 维标准字典)",
        match: "风险预警状态",
        element: "row",
      },
      rules: {
        section: "1.2 单据排他并发控制与在途锁机制",
        match: "在途",
        element: "text",
      },
    },
    details: [
      {
        title: "标识规则",
        items: [
          {
            label: "风险标签",
            content:
              "映射【货物盘点账实差异与盘亏联动预警规则】(DZY-R08)，补仓至安全线以上后消除。",
          },
          {
            label: "在途标签",
            content:
              "映射【单据排他互斥锁与防重复规则】(DZY-R01)，审批完结或撤回后自动释放。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-loan",
    targetId: "supervision-management-loan",
    number: 6,
    kind: "字段",
    title: "贷款信息三行结构",
    content:
      "贷款金额、贷款期数、贷款余额三行展示，单位为万元。未完成【贷款结果录入】时三行均显示「--」；贷款余额随【部分结清】自动扣减，并联动重算抵押率。",
    documentRefs: {
      prd: { section: "4.1 PC 端列表与看板页规格", match: "贷款信息", element: "text" },
      fields: {
        section: "一、主表/头部与基础识别字段 (14 维标准字典)",
        match: "贷款余额",
        element: "row",
      },
      rules: {
        section: "3.1 DZY-R 系列：业务风控规则",
        match: "部分结清",
        element: "row",
      },
    },
    details: [
      {
        title: "取值",
        items: [
          {
            label: "贷款金额",
            content: "银行实际出账的借款本金原值，保留 2~6 位小数。",
          },
          {
            label: "贷款余额",
            content: "扣减已还本金后的实时余额，未放款显示「--」。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-rate",
    targetId: "supervision-management-rate",
    number: 7,
    kind: "字段",
    title: "抵押率动态重算",
    content:
      "抵押率 =（贷款余额 ÷ 货物评估价值）× 100%，表头问号悬浮展示公式。未放款或未估值时显示「--」，不做除零计算；列头文案随 Tab 变为质押率、监管业务率。",
    documentRefs: {
      prd: { section: "5. 核心业务规则追溯索引表", match: "安全线管理", element: "row" },
      fields: {
        section: "三、统计汇总与风控指标字段",
        match: "实时抵押率",
        element: "row",
      },
      rules: {
        section: "3.1 DZY-R 系列：业务风控规则",
        match: "安全线管理与动态抵押率",
        element: "row",
      },
    },
    details: [
      {
        title: "兜底",
        items: [
          {
            label: "评估价值为空",
            content: "显示「--」，杜绝除零异常。",
          },
          {
            label: "贷款余额为空",
            content: "显示「--」，待贷款结果录入后自动激活。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-actions",
    targetId: "supervision-management-actions",
    number: 8,
    kind: "交互",
    title: "行操作矩阵与终态熔断",
    content:
      "行操作按 3 个一行排列：常驻查看详情、操作记录、资料管理、部分结清、日常监管 5 项；【更多操作】折叠其余 19 项（含监管报告），合计 24 项。已解押/解质押/解监管的终态订单只保留查看详情与操作记录，其余全部熔断隐藏。",
    documentRefs: {
      prd: { section: "4.1 PC 端列表与看板页规格", match: "行操作列规范", element: "text" },
      fields: {
        section: "一、主表/头部与基础识别字段 (14 维标准字典)",
        match: "抵押状态",
        element: "row",
      },
      rules: {
        section: "3.1 DZY-R 系列：业务风控规则",
        match: "终态订单操作行收缩熔断",
        element: "row",
      },
    },
    details: [
      {
        title: "交互防护",
        items: [
          {
            label: "在途锁",
            content:
              "存在在途审批时，置换、补仓、出库、移库、解押、平仓等变更项置灰，悬浮提示当前在途任务。",
          },
          {
            label: "终态熔断",
            content:
              "映射【终态订单操作行收缩熔断与设备解绑规则】(DZY-R13)，只留只读操作。",
          },
          {
            label: "资料管理",
            content:
              "复用入库、出库详情里的资料管理时间轴，改为弹窗展示：按「监管办理发起 / 补充资料」两个阶段归档，支持搜索、预览、下载与按阶段补充上传。",
          },
          {
            label: "平仓",
            content: "危险操作用红色文字，点击后进入二次确认与处置原因填报。",
          },
        ],
      },
    ],
  },
  {
    id: "supervision-management-export",
    targetId: "supervision-management-export",
    number: 9,
    kind: "交互",
    title: "导出为 Excel",
    content:
      "右上角全局按钮，按当前 Tab 与已生效筛选条件导出全量订单明细。大数据量走异步排队生成，生成完成后在下载中心取文件，不阻塞页面操作。",
    documentRefs: {
      prd: { section: "4.1 PC 端列表与看板页规格", match: "导出为Excel", element: "text" },
      fields: {
        section: "一、主表/头部与基础识别字段 (14 维标准字典)",
        match: "导出为Excel",
        element: "row",
      },
      rules: { section: "1. 状态机本体与状态定义", match: "ACTIVE", element: "text" },
    },
  },
]
