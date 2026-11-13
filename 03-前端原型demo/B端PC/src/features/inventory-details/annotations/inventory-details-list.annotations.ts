import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { buildInventoryCrossExportAnnotations } from "@/features/shared/inventory-cross-export/inventory-cross-export.annotations"

const inventoryDetailsListBaseAnnotations: PrototypeAnnotation[] = [
  {
    id: "inv-details-list-page",
    documentRefs: {
      prd: { section: "6.1 库存明细 — 列表页（P-CKG-003）", match: "对应文档：库存明细ASCII列表页.md", element: "text" },
      rules: { section: "库存明细 业务规则规格", match: "查看存货条码", element: "row" },
    },
    number: 1,
    kind: "页面",
    title: "库存明细微观货位台账（P-CKG-003）",
    content:
      "仓储资产最细粒度物理货位查询与批次全生命周期追溯中枢。建立【仓库-库房-分区-垛位】四级空间拓扑，以全局唯一存货条码为数字锚点，解耦可用库存与冻结库存。",
    details: [
      {
        title: "数据来源与穿透",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["入库审批通过"] --> B["生成存货条码与库存明细"]
    B --> C["库存明细台账（只读）"]
    C -->|存货管理行操作【库存分布】| D["带参进入并锁定筛选"]
    C -->|存货管理行操作【库存流水】| E["库存流水查看"]`,
          },
        ],
      },
    ],
  },
  {
    id: "inv-details-penetrate-lock",
    documentRefs: {
      rules: { section: "1. 存货管理穿透联动与参数锁定规则", match: "当用户从《存货管理》（P-CKG-001）仓库标签页点击某行【库存分布】进入本页", element: "text" },
      prd: { section: "6.1 库存明细 — 列表页（P-CKG-003）", match: "对应文档：库存明细ASCII列表页.md", element: "text" },
    },
    number: 2,
    kind: "规则",
    title: "存货管理穿透与参数只读锁定",
    content:
      "当用户从存货管理 (P-CKG-001) 行操作点击【库存分布】跳转进入时，URL 自动携带主体参数，筛选区对应字段进入【锁定只读状态】并提示锁定来源，点击【解除锁定】可恢复自由筛选。",
    details: [],
  },
  {
    id: "inv-details-table",
    documentRefs: {
      fields: { section: "二、列表表格业务字段", match: "期初堆放数量", element: "row" },
      rules: { section: "【存货条码弹窗交互】(R09)", match: "弹窗内展示存货全局唯一字符串条码（支持一键复制），下方渲染高清二维码图形；", element: "text" },
    },
    number: 3,
    kind: "字段",
    title: "细粒度货位存货核算表格",
    content:
      "展示全局唯一存货条码、物理落位（库房/分区/垛位）、货主双元标识、期初堆放量、当前可用量、当前冻结量及流转状态。统一固定 72px 行高与 PingFang SC 字体。",
    details: [],
  },
  {
    id: "inv-details-qr",
    documentRefs: {
      prd: { section: "6.2 存货条码 — 现场扫码模态弹窗", match: "列表点击二维码图标居中呼出；", element: "text" },
      rules: { section: "【存货条码弹窗交互】(R09)", match: "点击列表中的二维码图标，居中弹出【存货条码】小弹窗；", element: "text" },
    },
    number: 4,
    kind: "交互",
    title: "存货条码防伪二维码",
    content:
      "行操作点击【二维码】弹出条码二维码对话框，展示条码、货品名称、库位落位，并支持条码复制与标签打印。",
    details: [],
  },
  {
    id: "inv-details-jump",
    documentRefs: {
      prd: { section: "6.3 库存明细详情页（P-CKG-003-DETAIL）", match: "对应文档：库存明细ASCII详情页.md", element: "text" },
      rules: { section: "库存明细 业务规则规格", match: "穿透入库单详情", element: "row" },
    },
    number: 5,
    kind: "交互",
    title: "穿透至独立详情页",
    content:
      "行操作点击【详情】跳转至独立的库存明细详情页 (P-CKG-003-DETAIL)，调阅该存货批次的货位全息画像、资产价值估值与源头入库单链条。",
    details: [],
  },
  {
    id: "inv-details-fields",
    documentRefs: {
      fields: { section: "二、列表表格业务字段", match: "期初堆放数量", element: "row" },
      prd: { section: "1.1 业务背景" },
    },
    targetId: "inv-details-table",
    number: 0,
    kind: "字段",
    title: "字段字典",
    content: "展示业务字段、数量口径与状态。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "字段",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **存货条码** | 二维码 | 系统生成 | 全局唯一 | 点击看大图 |
| **物理落位** | 文本 | 必填 | 库房-分区-垛位 | 单行 |
| **货主** | 文本 | 必填 | 双元标识（名称 + 脱敏标识） | 双行 |
| **期初堆放量** | 数值 | 系统记录 | 数值 + 单位 | 右对齐 |
| **当前可用量** | 数值 | 系统计算 | 数值 + 单位 | 右对齐 |
| **当前冻结量** | 数值 | 系统计算 | 数值 + 单位 | 右对齐 |
| **流转状态** | 标签 | 系统维护 | 存货中 / 仓单中 / 已出库 等 | 彩色标签 |`,
          },
        ],
      },
    ],
  },
]

export const inventoryDetailsListAnnotations: PrototypeAnnotation[] =
  inventoryDetailsListBaseAnnotations.concat(buildInventoryCrossExportAnnotations(6))
