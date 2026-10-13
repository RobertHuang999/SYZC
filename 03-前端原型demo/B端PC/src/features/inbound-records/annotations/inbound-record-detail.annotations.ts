import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inboundRecordDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-detail-header",
    targetId: "inbound-detail-header",
    number: 1,
    kind: "页面",
    title: "已生效入库单详情壳层",
    content:
      "详情仅展示审批已通过归档单据；头部含入库单号复制、制单信息、货主与类型字段及绿色「已通过」状态章。",
    documentRefs: {
      prd: { section: "6.2 入库单详情页", match: "已通过", element: "text" },
      rules: { section: "二、状态定义", match: "APPROVED", element: "text" },
    },
    details: [],
  },
  {
    id: "inbound-detail-tabs",
    targetId: "inbound-detail-tabs",
    number: 2,
    kind: "交互",
    title: "三标签页：明细 / 审核 / 修改记录",
    content:
      "入库明细支持货品行展开二级库位堆放；审核记录为时间轴；修改记录展示特权纠偏留痕（无数据时空态）。",
    documentRefs: {
      prd: { section: "6.2", match: "标签页", element: "text" },
    },
    details: [],
  },
  {
    id: "inbound-detail-iot",
    targetId: "inbound-detail-iot",
    number: 3,
    kind: "字段",
    title: "IoT 设备抓拍与降级",
    content:
      "入库明细 Tab 上方展示抓拍卡片；失败记录展示 R18 降级文案，不阻断已通过归档。",
    documentRefs: {
      fields: { section: "设备抓拍图", match: "R18", element: "row" },
    },
    details: [],
  },
]
