import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inventoryCheckDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "check-detail-overview",
    targetId: "check-detail-overview",
    number: 1,
    kind: "页面",
    title: "盘点详情总览与彩色大印章 (R02/R10)",
    content:
      "顶部展示盘点单号、复制按钮、返回及状态大圆形印章徽标（未开始/盘点中/已盘点/已超期/已撤销/超期完成）；采用 DetailSection 标准板块呈现元数据。",
    documentRefs: {
      prd: {
        section: "6.4 详情页",
        match: "头部单据信息",
        element: "text",
      },
      rules: {
        section: "六、异常判别算法与解除闭环",
        match: "综合异常状态流转计算",
        element: "text",
      },
    },
  },
  {
    id: "check-detail-stats-card",
    targetId: "check-detail-stats-card",
    number: 2,
    kind: "规则",
    title: "四张完成率看板与4大异常汇总 (R09/R12)",
    content:
      "库存明细模式下展示货物条码已盘点率、分区完成率、库房完成率、异常货物数看板卡片，以及货物不存在、货物损坏、位置不符、数量不符 4 项细分统计。",
    details: [
      {
        title: "判别指标 (R09)",
        items: [
          {
            label: "货物不存在",
            content: "是否存在=否；标红呈现并计入不存在计数。",
          },
          {
            label: "货物损坏",
            content: "是否完好=否；标红呈现并计入损坏计数。",
          },
          {
            label: "位置不符",
            content: "位置一致=否；标红呈现并计入位置不符计数。",
          },
          {
            label: "数量不符",
            content: "实盘数与快照数不一致且非无需盘点；标红呈现并计入数量不符计数。",
          },
        ],
      },
    ],
  },
  {
    id: "check-detail-actions",
    targetId: "check-detail-actions",
    number: 3,
    kind: "交互",
    title: "解除异常闭环与报告存证导出 (R11/R13)",
    content:
      "行操作【解除异常】强制录入 1~200 字处理说明，原子写入历史时间轴；右上角提供【生成报告】与【导出记录】（打开下载记录中心弹窗）。",
    details: [
      {
        title: "审计与司法存证",
        items: [
          {
            label: "解除异常留痕",
            content: "记录解除时间、人员与说明，不可逆归档并在时间轴弹窗可追溯。",
          },
          {
            label: "PDF存证报告",
            content: "异步渲染生成不可篡改 PDF 盘点报告，由下载记录中心统一导出。",
          },
        ],
      },
    ],
  },
]

