import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inboundH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-h5-list",
    targetId: "inbound-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 入库管理",
    content:
      "已通过入库归档台账（对齐现网 store-record）：货主搜索、四筛、未打印二维码开关；卡片含下载记录/单据/详情。流程中单据不在此列表。",
    documentRefs: {
      prd: { section: "3.1 入库管理列表", match: "仅已通过", element: "text" },
      rules: { section: "【入库管理已通过台账】(P01)", match: "P01", element: "text" },
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
      "独立制单入口（warehousing-order）：货主与入库信息、货品库位、现场照片；提交前 R13 未堆放清零与新货主 R03 核验。",
    documentRefs: {
      prd: { section: "3.2 入库发起", match: "两步步骤条", element: "text" },
      rules: { section: "【两步步骤条强制顺序】(P03)", match: "P03", element: "text" },
    },
    details: [],
  },
  {
    id: "inbound-h5-initiate-goods",
    targetId: "inbound-h5-initiate-goods",
    number: 2,
    kind: "交互",
    title: "货品明细 · P08 / R11",
    content:
      "单行【入库货品】打开三列级联 Sheet（大类/品类/SKU）；计量数量可填，单位随 SKU 只读（R11b）；收集项随 SKU；附件纵向；R13 未堆放试算。",
    documentRefs: {
      fields: { section: "2.1 货品明细卡片", match: "入库货品", element: "row" },
      rules: { section: "【入库货品三列级联选货】(P08)", match: "P08", element: "text" },
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
    title: "入库管理 · 详情",
    content:
      "仅已通过归档单：货物明细 Tab 按货品行展示现场照片(R16)、补充资料(R17含PDF预览)、设备抓拍(R18/P07)；Tab 名带货品行数；与 PC 查看附件弹窗三分区同口径；不提供撤销。",
    documentRefs: {
      prd: { section: "3.3 入库管理详情", match: "已通过", element: "text" },
      rules: { section: "【详情货品行附件与 IoT 只读】(P07)", match: "P07", element: "text" },
    },
    details: [],
  },
]
