import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const tallyStackingAnnotations: PrototypeAnnotation[] = [
  {
    id: "tally-page",
    number: 1,
    kind: "页面",
    title: "理货堆放管理台账（P-CKG-002）",
    content:
      "仓储资产物理空间堆放与库位精细化核算中枢。以【入库单 × 货品】主码为汇总，以【库房-分区-具体位置】子码为物理承载，打通实物与库位明细追踪。",
    documentRefs: {
      prd: { section: "1. 业务背景与业务痛点", match: "模块定位" },
      fields: { section: "0. 架构模型与字段层级说明", match: "主码与子码双层结构" },
      rules: { section: "5.1 数据模型与台账颗粒度", match: "主码与子码联动模型" },
    },
    details: [
      {
        title: "主子码联动",
        items: [
          {
            label: "主码 (TM)",
            content: "代表入库批次维度，聚合该入库单下该货品的全部堆放总量。",
          },
          {
            label: "子码 (TLS/KC)",
            content: "对应现场物理货位，记录具体库房、分区、垛位上的实物与动态余量。",
          },
        ],
      },
    ],
  },
  {
    id: "tally-filters",
    number: 2,
    kind: "交互",
    title: "多级物理与单据筛选区",
    content:
      "支持按入库单号、仓库、货品大类/规格、货主等多条件精准检索，支持折叠展开高级筛选。",
    documentRefs: {
      rules: { section: "5.4 筛选与查询规则", match: "多级空间联动查询" },
    },
    details: [],
  },
  {
    id: "tally-virtual",
    number: 3,
    kind: "规则",
    title: "虚拟库位兜底机制",
    content:
      "入库填单时若未及时指定具体库位，系统自动落入【未指定库房/未指定分区/虚拟未分配垛位】，确保实物总量守恒不漏记。",
    documentRefs: {
      rules: { section: "5.2 虚拟库位与未分配兜底机制", match: "虚拟库位兜底" },
    },
    details: [],
  },
  {
    id: "tally-qr",
    number: 4,
    kind: "交互",
    title: "主子二维码双轨防伪",
    content:
      "行操作支持【查看二维码】，弹窗内支持主码（入库批次级）与子码（垛位批次级）快速切换，支持现场打印与条码复制。",
    documentRefs: {
      rules: { section: "5.5 主子二维码双轨防伪体系", match: "双轨防伪体系" },
      fields: { section: "四、二维码弹窗与操作字段", match: "主子二维码切换" },
    },
    details: [],
  },
]
