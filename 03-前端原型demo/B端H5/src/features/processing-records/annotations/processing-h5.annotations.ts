import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

/**
 * 加工管理 · H5 标注正文（与 PC 14-加工管理-加工记录三件套同源）。
 * H5 只描述端上承载差异，不另立业务结论。
 */
export const processingH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "processing-h5-list",
    targetId: "processing-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 加工管理",
    content:
      "加工记录台账：检索维度与 PC 九项一致，覆盖加工单号、加工日期、货主名称/标识、加工类型、仓库、货品名称、单据状态、制单人、制单时间；移动端把单号/货主/货物收进搜索框，类型、状态、仓库用首屏胶囊，货品名称、制单人、加工日期与制单时间收进【更多筛选】抽屉。卡片按 PC 列表口径展示计划/实际投入与计划/实际产出，列表只做查询与单据操作，不放开立入口。",
    documentRefs: {
      prd: { section: "6. 页面与字段规则", match: "列表", element: "text" },
      fields: { section: "一、单据级业务字段", match: "加工单号", element: "row" },
      rules: {
        section: "【操作审计与详情四标签页】(R35)",
        match: "R35",
        element: "text",
      },
    },
    details: [],
  },
]

export const processingH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "processing-h5-detail",
    targetId: "processing-h5-detail",
    number: 2,
    kind: "页面",
    title: "加工管理 · 详情",
    content:
      "摘要卡字段与 PC 一致：制单人/制单时间、货主名称、货主标识、加工日期、加工类型、所属仓库、关联融资单号、单据业务状态、加工原因；已完成单据补充损耗比例与原因。分页签顺序与 PC 一致：凭证与附件、投入货物、产出货物、审核记录、修改记录，投入与产出均保留计划/实际两套数量口径。",
    documentRefs: {
      prd: { section: "6. 页面与字段规则", match: "详情", element: "text" },
      fields: { section: "二、投入货物明细字段（行级）", match: "计划投入", element: "row" },
      rules: {
        section: "【新条码生成与货权无缝继承】(R26)",
        match: "R26",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "processing-h5-flow",
    targetId: "processing-h5-detail",
    number: 3,
    kind: "交互",
    title: "加工流转链路与数量口径",
    content:
      "移动端用「投入原料 ➔ 加工转化（损耗率）➔ 产出成品」一条链路讲清业务流向：未完成只展示计划投入与预计产出；完成加工后回写实际消耗、自动释放余量、实际产出与新存货条码，计划口径不覆盖。",
    documentRefs: {
      prd: { section: "5. 状态机与动作能力矩阵", match: "未完成", element: "text" },
      fields: { section: "三、产出货物明细字段（行级）", match: "实际数量", element: "row" },
      rules: {
        section: "【计划余量自动释放机制】(R24)",
        match: "R24",
        element: "text",
      },
    },
    details: [],
  },
]
