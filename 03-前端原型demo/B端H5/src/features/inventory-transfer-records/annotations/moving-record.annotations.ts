import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

/**
 * 移库管理 · H5 标注正文（与 PC 端 11-移库管理 三件套同源）。
 * 标注编号在「移库记录」菜单内唯一；H5 只描述端上承载差异，不另立业务结论。
 */
export const movingH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "moving-h5-list",
    targetId: "moving-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 移库管理",
    content:
      "已通过移库归档台账：按移库单号/货主名称或标识/货物名称搜索，移库类型、仓库、货品用筛选胶囊，制单人、移库日期、制单日期收进【更多筛选】抽屉；列表字段与 PC 一致（移库单号、货主、移库时间、移库类型、关联单号、仓库、货物、移库数量、制单人、制单时间），只做查询与详情，不在列表页放发起入口。",
    documentRefs: {
      prd: { section: "6.1 列表页功能规格", match: "移库", element: "text" },
      fields: { section: "一、单据级业务字段", match: "移库单号", element: "row" },
      rules: {
        section: "【台账终态归档与禁止反冲正】(R07)",
        match: "R07",
        element: "text",
      },
    },
    details: [],
  },
]

export const movingH5InitiateAnnotations: PrototypeAnnotation[] = [
  {
    id: "moving-h5-initiate",
    targetId: "moving-h5-initiate",
    number: 2,
    kind: "页面",
    title: "业务办理 · 移库发起（第一步：基础信息）",
    content:
      "货主、移库日期、移库类型、关联单号与现场照片；非普通移库必须从系统有效单据中选择关联单号，现场照片至少 1 张方可进入下一步。",
    documentRefs: {
      prd: { section: "6.2 普通移库新增表单规格", match: "基础信息", element: "text" },
      fields: { section: "一、单据级业务字段", match: "移库类型", element: "row" },
      rules: {
        section: "【移库类型来源与仓单移库置灰】(R02)",
        match: "R02",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "moving-h5-initiate-goods",
    targetId: "moving-h5-initiate-goods",
    number: 3,
    kind: "交互",
    title: "移库发起 · 货品明细（第二步）",
    content:
      "按货品汇总移库数量，逐层展开库房/分区/存货条码，为每条存货选择移入位置并录入具体位置；提交前校验每条明细均已选择移入位置。",
    documentRefs: {
      prd: { section: "6.3 抵押 / 质押移库新增表单规格", match: "货品", element: "text" },
      fields: { section: "2.1 普通移库明细字段（折叠树形：一级主行 + 二级展开）", match: "移入", element: "row" },
      rules: {
        section: "【普通移库选货折叠与批量设置】(R03)",
        match: "R03",
        element: "text",
      },
    },
    details: [],
  },
]

export const movingH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "moving-h5-detail",
    targetId: "moving-h5-detail",
    number: 4,
    kind: "页面",
    title: "移库管理 · 详情",
    content:
      "摘要卡展示移库单号（可复制）、已通过状态、移库时间、移库类型、关联单号、仓库名称、货主名称/标识、制单人、制单时间与备注信息；页签固定为移库货品明细、现场凭证、审核记录，明细展示移出/移入位置、入库时间、其他信息、存货条码、可用数量与移库数量。",
    documentRefs: {
      prd: { section: "6.1 列表页功能规格", match: "详情", element: "text" },
      fields: { section: "五、系统、影像与下载审计字段", match: "影像", element: "row" },
      rules: {
        section: "【现场照片必传与设备抓拍】(R08)",
        match: "R08",
        element: "text",
      },
    },
    details: [],
  },
]
