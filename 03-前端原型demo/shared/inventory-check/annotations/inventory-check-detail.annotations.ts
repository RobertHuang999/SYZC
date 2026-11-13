import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const inventoryCheckDetailAnnotations: SharedPrototypeAnnotation[] = [
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
    details: [],
  },
  {
    id: "check-detail-stats-card",
    documentRefs: {
      rules: { section: "【统计看板与完成率计算】(R12)", match: "货物条码已盘点率：", element: "text" },
      prd: { section: "货物盘点主PRD", match: "4 张统计率看板卡片：货物条码已盘点率、分区盘点完成率、库房盘点完成率、异常货物", element: "text" },
    },
    targetId: "check-detail-stats-card",
    number: 2,
    kind: "规则",
    title: "四张完成率看板与4大异常汇总 (R09/R12)",
    content:
      "库存明细模式下展示货物条码已盘点率、分区完成率、库房完成率、异常货物数看板卡片，以及货物不存在、货物损坏、位置不符、数量不符 4 项细分统计。",
    details: [
      {
        title: "盘点状态机",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["生成盘点任务"] --> B["未开始"]
    B -->|开始盘点| C["盘点中"]
    B -->|超过计划时间| D["已超期（仍可补盘）"]
    C -->|提交盘点结果| E["盘点完成"]
    D -->|补盘提交| E
    E --> F{"账实是否一致"}
    F -->|一致| G["结果正常"]
    F -->|不一致| H["结果异常 → 异常处理<br/>未处理 / 已处理"]`,
          },
        ],
      },
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
    documentRefs: {
      prd: { section: "7. 修订记录", match: "变更内容说明", element: "row" },
      rules: { section: "【报告生成与下载记录导出】(R13)", match: "下载记录弹窗：", element: "text" },
    },
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
  {
    id: "check-detail-fields",
    documentRefs: {
      fields: { section: "货物盘点字段清单", match: "展示（本次数量）", element: "row" },
      rules: { section: "3.1 状态定义", match: "状态流转触发条件", element: "row" },
    },
    targetId: "check-detail-stats-card",
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
| **盘点单号** | 文本 | 系统生成 | 19 位数字串 | 可复制 |
| **任务名称** | 文本 | 必填 | 最多 50 个字符 | 单行 |
| **盘点类型** | 标签 | 必填 | 账面汇总 / 库存明细 | 单行 |
| **账面数量** | 数值 | 系统带出 | 数值 + 单位 | 右对齐 |
| **实盘数量** | 数值 | 录入 | 大于等于 0 | 右对齐 |
| **差异数量** | 数值 | 系统计算 | 正红 / 负绿 | 高亮 |
| **盘点结果** | 标签 | 系统计算 | 正常 / 异常 | — |
| **异常处理状态** | 标签 | 系统维护 | 未处理 / 已处理 | 仅异常展示 |`,
          },
        ],
      },
    ],
  },
]
