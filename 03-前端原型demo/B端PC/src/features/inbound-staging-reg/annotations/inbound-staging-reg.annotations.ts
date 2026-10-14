import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

const lifecycleMermaid = `\`\`\`mermaid
stateDiagram-v2
  [*] --> 待补全: P02 弱校验保存
  待补全 --> 待补全: 协作补录 P08
  待补全 --> 已转正式: 正式页提交成功 P06/P10
  待补全 --> 已作废: O02 作废
  已转正式 --> 待补全: P10 正式单驳回撤回
  已作废 --> [*]
\`\`\``

export const inboundStagingListAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-list-page",
    targetId: "inbound-staging-list-page",
    number: 1,
    kind: "页面",
    title: "入库暂存登记台账",
    content:
      "独立暂存台账：筛选 4 项+展开、协作编辑、转正与作废；不计库存、不进审批（P01）。",
    documentRefs: { prd: { section: "4.1", match: "PC 列表页", element: "text" } },
    details: [{ title: "状态机", items: [{ label: "P01~P11", content: lifecycleMermaid }] }],
  },
  {
    id: "inbound-staging-list-actions",
    targetId: "inbound-staging-list-actions",
    number: 2,
    kind: "交互",
    title: "转正与仓单路由 P06",
    content: "待补全可转正；仓单类型 PC 弹窗引导 H5 入库发起；普通/质押/抵押/监管走 PC 正式新增预填。",
    documentRefs: { rules: { section: "【转正路由】(P06)", match: "P06", element: "text" } },
    details: [],
  },
]

export const inboundStagingFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-form-page",
    targetId: "inbound-staging-form-page",
    number: 1,
    kind: "页面",
    title: "极速暂存新增/编辑",
    content: "日期+仓库+类型+数量>0 即可保存（P02）；货主一体化 P03；库位默认可折叠 P04；照片选填 P05。",
    documentRefs: { prd: { section: "4.2", match: "新增", element: "text" } },
    details: [],
  },
  {
    id: "inbound-staging-form-save",
    targetId: "inbound-staging-form-save",
    number: 2,
    kind: "交互",
    title: "弱校验保存与 Dirty 拦截",
    content: "保存登记不触发 R03 短信；离开未保存二次确认；P09 从正式页带入 copyFromFormal。",
    documentRefs: { rules: { section: "【暂存弱校验保存】(P02)", match: "P02", element: "text" } },
    details: [],
  },
]

export const inboundStagingDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-detail-page",
    targetId: "inbound-staging-detail-page",
    number: 1,
    kind: "页面",
    title: "暂存详情与审计",
    content: "DetailSection 纵向子板块：基础、货品、附件、生命周期；状态驱动底栏按钮。",
    documentRefs: { prd: { section: "4.3", match: "详情", element: "text" } },
    details: [],
  },
  {
    id: "inbound-staging-detail-actions",
    targetId: "inbound-staging-detail-actions",
    number: 2,
    kind: "交互",
    title: "O02 作废 · O03 转正",
    content: "待补全可编辑/作废/转正；已转正式仅查看正式单；已作废只读。",
    documentRefs: { rules: { section: "【作废登记单】(P07)", match: "P07", element: "text" } },
    details: [],
  },
]
