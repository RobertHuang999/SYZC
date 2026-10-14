import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inboundStagingH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-h5-list",
    targetId: "inbound-staging-h5-list",
    number: 1,
    kind: "页面",
    title: "H5 暂存台账",
    content: "工作台仓储入口；状态 Tab + 搜索；卡片转正跳转入库发起 sourceRegId（P06/P08）。",
    documentRefs: { prd: { section: "4.4", match: "H5 列表", element: "text" } },
    details: [],
  },
]

export const inboundStagingH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-h5-detail",
    targetId: "inbound-staging-h5-detail",
    number: 1,
    kind: "页面",
    title: "H5 暂存详情",
    content: "待补全底栏转正；已转正式展示关联 19 位单号；作废与编辑在后续迭代可扩展。",
    documentRefs: { prd: { section: "4.5", match: "H5 详情", element: "text" } },
    details: [],
  },
]

export const inboundStagingH5FormAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-staging-h5-form",
    targetId: "inbound-staging-h5-form",
    number: 1,
    kind: "页面",
    title: "H5 极速暂存新增",
    content: "业务发起磁贴 biz-init-inbound-reg；弱校验保存 P02；支持拍照占位 P05（Mock）。",
    documentRefs: { rules: { section: "【暂存弱校验保存】(P02)", match: "P02", element: "text" } },
    details: [],
  },
]
