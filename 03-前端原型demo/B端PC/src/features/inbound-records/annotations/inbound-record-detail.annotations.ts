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
    title: "四标签页：明细 / 审核 / 修改记录 / 资料管理（6.3 新增）",
    content:
      "入库明细支持货品行展开二级库位堆放；审核记录为时间轴；修改记录展示特权纠偏留痕（无数据时空态）；资料管理按流程阶段归档凭证，只有普通入库可后补资料。",
    documentRefs: {
      prd: { section: "6.2", match: "标签页", element: "text" },
    },
    details: [],
  },
  {
    id: "inbound-detail-attachments",
    targetId: "inbound-detail-tabs",
    number: 3,
    kind: "交互",
    title: "货品行【查看附件】与 IoT 抓拍",
    content:
      "入库明细一级表【附件信息】列【查看附件】按货品行弹出三分区弹窗：现场照片(R16)、补充资料(R17)、设备抓拍(R18，goodsLines[].iotCaptures)；无抓拍时空态「抓图失败或无监控设备接入」，不阻断归档查阅；与 H5 货品行三块同口径。",
    documentRefs: {
      prd: { section: "6.2", match: "查看附件", element: "text" },
      fields: { section: "设备抓拍图", match: "R18", element: "row" },
      rules: { section: "【物联网摄像头自动抓拍与容错】(R18)", match: "R18", element: "text" },
    },
    details: [],
  },
]
