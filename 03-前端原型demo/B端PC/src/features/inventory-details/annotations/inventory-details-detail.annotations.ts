import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inventoryDetailsDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "inv-details-detail-page",
    number: 1,
    kind: "页面",
    title: "库存明细全息详情页（P-CKG-003-DETAIL）",
    content:
      "呈现特定垛位存货批次的物理空间定位、权属关系、三态资产数量、估值金额以及上游单据追溯链。",
    documentRefs: {
      prd: { section: "6.3 库存明细详情页", match: "核心板块" },
      fields: { section: "二、详情页专属业务字段", match: "详情全景" },
    },
    details: [],
  },
  {
    id: "inv-details-detail-order-link",
    number: 2,
    kind: "交互",
    title: "源头入库单穿透联动",
    content:
      "单据链中展示源头入库单号，支持直接点击跳转至入库记录详情页 (/仓储/入库管理/入库记录/详情/:id)，追溯原始填报与验收证据。",
    documentRefs: {
      rules: { section: "4. 详情页跳转与全息追溯规则", match: "入库单号穿透查看联动" },
    },
    details: [],
  },
]
