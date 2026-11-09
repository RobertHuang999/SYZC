import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const abnormalRecordListAnnotations: PrototypeAnnotation[] = [
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
]
