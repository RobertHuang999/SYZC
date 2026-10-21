import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inboundRecordFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-form-page",
    targetId: "inbound-form-page",
    number: 1,
    kind: "页面",
    title: "新增入库 P-CKG-009-ADD",
    content:
      "手工制单入口：基础信息 4 列栅格（企业/个人、关联单号分支）；货品明细卡片；底栏与块内合计使用理货堆放数/无需理货堆放数文案。",
    documentRefs: {
      prd: { section: "6.3 新增入库页", match: "折叠面板", element: "text" },
    },
    details: [],
  },
  {
    id: "inbound-form-basic",
    targetId: "inbound-form-basic",
    number: 2,
    kind: "字段",
    title: "基础信息联动",
    content:
      "企业：货主标识为统一社会信用代码、联系电话；个人：货主标识+身份证号。质押/抵押/仓单唤起关联单选择弹窗。入库库房多选分组「需要审核/不需要审核」，与仓库 R02+R03+F13 同源；同单不可混选（【库房同审核属性强校验】(R06)）。",
    documentRefs: {
      rules: { section: "五、", match: "R02", element: "text" },
    },
    details: [],
  },
  {
    id: "inbound-form-goods",
    targetId: "inbound-form-goods",
    number: 3,
    kind: "交互",
    title: "货品与 R13/R16",
    content:
      "选货：大类→品类→货品 SKU 三列联动（R11）；计量数量可填、单位随 SKU 只读（R11b）；收集项随 SKU。未堆放数量红色试算；现场照片必传；提交前 R13 与新货主 R03。",
    documentRefs: {
      fields: { section: "2.1 一级货品明细", match: "入库货品（SKU）", element: "row" },
      rules: { section: "【货品 SKU 选取与三级联动】(R11)", match: "R11", element: "text" },
    },
    details: [],
  },
]
