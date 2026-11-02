import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inventoryDetailsListAnnotations: PrototypeAnnotation[] = [
  {
    id: "inv-details-list-page",
    number: 1,
    kind: "页面",
    title: "库存明细微观货位台账（P-CKG-003）",
    content:
      "仓储资产最细粒度物理货位查询与批次全生命周期追溯中枢。建立【仓库-库房-分区-垛位】四级空间拓扑，以全局唯一存货条码为数字锚点，解耦可用库存与冻结库存。",
    documentRefs: {
      prd: { section: "1. 业务背景与业务痛点", match: "模块定位" },
      rules: { section: "2. 筛选与排序交互规则", match: "四级空间拓扑" },
    },
    details: [],
  },
  {
    id: "inv-details-penetrate-lock",
    number: 2,
    kind: "规则",
    title: "存货管理穿透与参数只读锁定",
    content:
      "当用户从存货管理 (P-CKG-001) 行操作点击【库存分布】跳转进入时，URL 自动携带主体参数，筛选区对应字段进入【锁定只读状态】并提示锁定来源，点击【解除锁定】可恢复自由筛选。",
    documentRefs: {
      rules: { section: "1. 存货管理穿透联动与参数锁定规则", match: "参数锁定" },
    },
    details: [],
  },
  {
    id: "inv-details-table",
    number: 3,
    kind: "字段",
    title: "细粒度货位存货核算表格",
    content:
      "展示全局唯一存货条码、物理落位（库房/分区/垛位）、货主双元标识、期初堆放量、当前可用量、当前冻结量及流转状态。统一固定 72px 行高与 PingFang SC 字体。",
    documentRefs: {
      rules: { section: "3. 列表呈现与微观交互规则", match: "三态数量核算" },
      fields: { section: "一、基础与物理货位字段", match: "存货条码" },
    },
    details: [],
  },
  {
    id: "inv-details-qr",
    number: 4,
    kind: "交互",
    title: "存货条码防伪二维码",
    content:
      "行操作点击【二维码】弹出条码二维码对话框，展示条码、货品名称、库位落位，并支持条码复制与标签打印。",
    documentRefs: {
      fields: { section: "三、操作与弹窗字段", match: "存货二维码" },
    },
    details: [],
  },
  {
    id: "inv-details-jump",
    number: 5,
    kind: "交互",
    title: "穿透至独立详情页",
    content:
      "行操作点击【详情】跳转至独立的库存明细详情页 (P-CKG-003-DETAIL)，调阅该存货批次的货位全息画像、资产价值估值与源头入库单链条。",
    documentRefs: {
      prd: { section: "6.3 库存明细详情页", match: "独立详情页" },
      rules: { section: "4. 详情页跳转与全息追溯规则", match: "新标签页强制打开" },
    },
    details: [],
  },
]
