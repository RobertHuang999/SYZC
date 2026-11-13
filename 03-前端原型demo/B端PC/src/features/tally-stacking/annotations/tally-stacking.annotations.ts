import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const tallyStackingAnnotations: PrototypeAnnotation[] = [
  {
    id: "tally-page",
    documentRefs: {
      prd: { section: "理货堆放主PRD", match: "### 6.1 理货堆放列表页", element: "text" },
      rules: { section: "理货堆放业务规则规格", match: "P-CKG-009", element: "row" },
    },
    number: 1,
    kind: "页面",
    title: "理货堆放管理台账（P-CKG-002）",
    content:
      "仓储资产物理空间堆放与库位精细化核算中枢。以【入库单 × 货品】主码为汇总，以【库房-分区-具体位置】子码为物理承载，打通实物与库位明细追踪。",
    details: [
      {
        title: "理货堆放流转",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["入库审批通过"] --> B["待理货堆放"]
    B -->|理货员分配库位| C["已堆放"]
    C -->|扫码核对| D["生成 / 补打存货条码"]
    C --> E["虚拟堆放与实物堆放区分展示"]`,
          },
        ],
      },
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
    documentRefs: {
      prd: { section: "6.3 二维码双轨弹窗交互规格", match: "字段规格：详见 理货堆放字段清单.md 5.1 节。", element: "text" },
      rules: { section: "【列表颗粒度为入库单货品项】(R01)", match: "理货堆放列表每条数据记录的物理主键为 【入库单号 + 货品 ID】（主码）；", element: "text" },
    },
    number: 2,
    kind: "交互",
    title: "多级物理与单据筛选区",
    content:
      "支持按入库单号、仓库、货品大类/规格、货主等多条件精准检索，支持折叠展开高级筛选。",
    details: [],
  },
  {
    id: "tally-virtual",
    documentRefs: {
      rules: { section: "5.2 虚拟库位与未分配兜底机制", match: "单库房未分配（未指定分区）：", element: "text" },
    },
    number: 3,
    kind: "规则",
    title: "虚拟库位兜底机制",
    content:
      "入库填单时若未及时指定具体库位，系统自动落入【未指定库房/未指定分区/虚拟未分配垛位】，确保实物总量守恒不漏记。",
    details: [],
  },
  {
    id: "tally-qr",
    documentRefs: {
      prd: { section: "6.3 二维码双轨弹窗交互规格", match: "#### 6.3.2 【子二维码信息】弹窗（详情页触发）", element: "text" },
      rules: { section: "5.5 主子二维码双轨防伪体系", match: "#### 【详情页【子二维码信息】弹窗交互】(R10)", element: "text" },
    },
    number: 4,
    kind: "交互",
    title: "主子二维码双轨防伪",
    content:
      "行操作支持【查看二维码】，弹窗内支持主码（入库批次级）与子码（垛位批次级）快速切换，支持现场打印与条码复制。",
    details: [],
  },
]
