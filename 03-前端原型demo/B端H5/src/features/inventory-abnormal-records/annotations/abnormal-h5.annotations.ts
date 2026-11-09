import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

/**
 * 异动管理 · H5 标注正文（与 PC 端 13-货物异动-异动记录三件套同源）。
 * 编号在本菜单内唯一；H5 只描述端上承载差异，不另立业务结论。
 */
export const abnormalH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "abnormal-h5-list",
    targetId: "abnormal-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 异动管理",
    content:
      "已生效归档的异动台账：检索维度与 PC 一致，覆盖异动单号、关联单据、货主名称/标识、单据类型、异动类型、仓库/库房、货物名称、申请时间八项；移动端把单号与货主收进搜索框，仓库用筛选胶囊，其余条件收进【更多筛选】抽屉，单据类型与异动类型支持多选。列表只做查询与详情下钻，不在列表页放发起入口。",
    documentRefs: {
      prd: { section: "6.1 异动记录 — 列表页", match: "异动单号", element: "text" },
      fields: { section: "二、列表表格业务字段", match: "异动单号", element: "row" },
      rules: {
        section: "【默认排序与精准检索】(R11)",
        match: "R11",
        element: "text",
      },
    },
    details: [
      {
        title: "列表卡片字段",
        items: [
          { label: "异动单号", content: "19 位业务单号，卡片头部可点进详情，支持复制" },
          { label: "单据类型", content: "质押单 / 抵押单 / 监管业务单 / 存货单" },
          { label: "货主", content: "货主名称 + 信用代码或脱敏手机号" },
          { label: "异动货品", content: "多货物时展示首项并标注共 N 项，可点开查看全部" },
          { label: "异动类型", content: "盘盈 / 盘亏 / 损耗 / 其他；多货物不同类型时展示「盘盈 | 盘亏」组合" },
          { label: "异动后数量", content: "变动后 ➔ 带符号差额，增量红色 ↑、减量绿色 ↓" },
          { label: "存放位置", content: "仓库-库房-分区，多货物时展示首项并标注共 N 处" },
        ],
      },
    ],
  },
]

export const abnormalH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "abnormal-h5-detail",
    targetId: "abnormal-h5-detail",
    number: 2,
    kind: "页面",
    title: "异动管理 · 详情",
    content:
      "摘要卡展示异动单号、已生效归档状态、关联单据、单据类型、货主、货主标识、申请人、申请时间与审批流程；分页签为调账货品明细、审核记录。审核记录按节点合并展示处理人、时间与任务详情入口。",
    documentRefs: {
      prd: {
        section: "6.2 异动详情多卡片聚合弹窗",
        match: "异动详情",
        element: "text",
      },
      fields: {
        section: "五、异动详情多卡片弹窗字段 (P-CKG-013-DETAIL-MODAL)",
        match: "异动单号",
        element: "row",
      },
      rules: {
        section: "【一单多物多卡片排布】(R13)",
        match: "R13",
        element: "text",
      },
    },
    details: [
      {
        title: "详情字段",
        items: [
          { label: "关联单据", content: "触发异动的源头母单编号，可回查来源业务单据" },
          { label: "单据类型", content: "按货权来源着色：质押玫红、抵押琥珀、监管蓝、存货翠绿" },
          { label: "货主名称 / 标识", content: "企业全称或个人姓名 + 信用代码 / 脱敏手机号" },
          { label: "申请人", content: "姓名（所属机构）" },
          { label: "申请时间", content: "异动申请提交的服务端时间" },
          { label: "审批流程", content: "异动单挂载的流程模板名称" },
        ],
      },
    ],
  },
  {
    id: "abnormal-h5-diff-chain",
    targetId: "abnormal-h5-diff-chain",
    number: 3,
    kind: "交互",
    title: "调账数量链路：变动前 ➔ 变动后",
    content:
      "每一行货品用「变动前数量 ➔ 变动后数量」的箭头链路表达调账结果，并单独展示带符号差额：盘盈或增量用红色向上箭头，盘亏、损耗或减量用绿色向下箭头。差额为 0 时显示「无差额」。",
    documentRefs: {
      prd: {
        section: "6.2 异动详情多卡片聚合弹窗",
        match: "剩余数量",
        element: "text",
      },
      fields: {
        section: "五、异动详情多卡片弹窗字段 (P-CKG-013-DETAIL-MODAL)",
        match: "变动后数量",
        element: "row",
      },
      rules: {
        section: "【差异数量自动试算与红升绿降规则】(R05)",
        match: "R05",
        element: "text",
      },
    },
    details: [
      {
        title: "红升绿降口径",
        items: [
          { label: "增量", content: "变动后大于变动前，红色 ↑ 展示带正号差额" },
          { label: "减量", content: "变动后小于变动前，绿色 ↓ 展示带负号差额" },
          { label: "仓库位置", content: "按仓库-库房-分区完整路径展示" },
          { label: "现场凭据", content: "有照片时展示缩略图，点击可全屏左右切换" },
        ],
      },
    ],
  },
]
