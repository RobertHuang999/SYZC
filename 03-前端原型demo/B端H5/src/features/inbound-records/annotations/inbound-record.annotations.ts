import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inboundH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-h5-list",
    targetId: "inbound-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 入库记录",
    content:
      "对齐现网「货物管理～入库」：展示多状态入库单流水，支持状态筛选与关键字检索；右下角「入库」进入业务发起页。",
    documentRefs: {
      prd: { section: "3.1 入库管理列表", match: "全流转状态", element: "text" },
      rules: { section: "【列表全状态展示】(P01)", match: "P01", element: "text" },
    },
    details: [],
  },
]

export const inboundH5InitiateAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-h5-initiate",
    targetId: "inbound-h5-initiate",
    number: 1,
    kind: "页面",
    title: "业务办理 · 入库发起",
    content:
      "移动端入库单填写（参考 wrl-agency-native warehousing-order）：货主信息、入库信息、货品与库位、现场照片；提交前校验未堆放数量清零 R13 与新货主核验 R03。",
    documentRefs: {
      prd: { section: "3.2 入库发起", match: "四步步骤条", element: "text" },
      rules: { section: "【四步步骤条强制顺序】(P03)", match: "P03", element: "text" },
    },
    details: [],
  },
]

export const inboundH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-h5-detail",
    targetId: "inbound-h5-detail",
    number: 1,
    kind: "页面",
    title: "入库详情",
    content: "展示单号、审核状态、货主/仓库/类型及入库明细摘要；审核中支持撤销 Mock。",
    documentRefs: {
      prd: { section: "3.3 入库详情", match: "IoT", element: "text" },
      rules: { section: "【详情 IoT 抓拍只读】(P07)", match: "P07", element: "text" },
    },
    details: [],
  },
]
