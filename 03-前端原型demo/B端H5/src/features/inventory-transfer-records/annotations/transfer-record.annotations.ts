import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

/**
 * 货物转让 · H5 标注正文（与 PC 端 12-货物转让-转让记录 三件套同源）。
 * H5 只描述端上承载差异，不另立业务结论。
 */
export const transferH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-h5-list",
    targetId: "transfer-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 货物转让",
    content:
      "已终审通过的货权转让归档台账：按单号/货主名称或标识搜索，仓库与制单人用筛选胶囊，转让日期收进【更多筛选】抽屉；转让只发生在仓内货权层面，货物不产生物理位移，因此不设现场照片与设备抓拍。",
    documentRefs: {
      prd: { section: "4. 业务规则索引速查", match: "【台账终态归档与禁止反冲正】(R07)", element: "text" },
      fields: { section: "六、展示、筛选与引用规则汇总", match: "筛选映射规则", element: "row" },
      rules: { section: "三、核心业务规则与逻辑规格", match: "R07", element: "text" },
    },
    details: [],
  },
]

export const transferH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-h5-detail",
    targetId: "transfer-h5-detail",
    number: 2,
    kind: "页面",
    title: "货物转让 · 详情",
    content:
      "摘要卡展示转让单号、已通过状态、制单人时间、转让双方、转让时间、仓库、转让总量与转让原因；货权流向用「出让方 ➔ 受让方」箭头链路表达；页签为转让明细与审核记录，明细按货品规格汇总并展开在仓储位与条码。",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "树形货品明细", element: "text" },
      fields: { section: "二、转让货品明细字段", match: "转让货品明细采用树形结构", element: "row" },
      rules: { section: "三、核心业务规则与逻辑规格", match: "R01", element: "text" },
    },
    details: [],
  },
  {
    id: "transfer-h5-detail-audit",
    targetId: "transfer-h5-detail-audit",
    number: 3,
    kind: "交互",
    title: "审核流转与跨模块入库闭环",
    content:
      "审核记录按时间顺序展示提交、受让方核验、监管风控审查与终审通过；终审通过后系统原子生成原货主转让出库单，并在受让方名下生成转让入库单，完成货权对冲。",
    documentRefs: {
      prd: { section: "4. 业务规则索引速查", match: "【跨模块转让入库联动与货权对冲】(R05)", element: "text" },
      fields: { section: "五、统计汇总、系统与审批审计字段", match: "审核记录", element: "row" },
      rules: { section: "三、核心业务规则与逻辑规格", match: "R05", element: "text" },
    },
    details: [],
  },
]
