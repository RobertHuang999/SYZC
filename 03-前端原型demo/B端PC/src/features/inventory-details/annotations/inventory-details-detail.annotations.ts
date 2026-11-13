import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inventoryDetailsDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "inv-details-detail-page",
    documentRefs: {
      prd: { section: "6.3 库存明细详情页（P-CKG-003-DETAIL）", match: "对应文档：库存明细ASCII详情页.md", element: "text" },
      rules: { section: "库存明细 业务规则规格", match: "浏览器打开新标签页访问 P-CKG-003-DETAIL", element: "row" },
    },
    number: 1,
    kind: "页面",
    title: "库存明细全息详情页（P-CKG-003-DETAIL）",
    content:
      "呈现特定垛位存货批次的物理空间定位、权属关系、三态资产数量、估值金额以及上游单据追溯链。",
    details: [
      {
        title: "详情结构",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["库存明细（只读）"] --> B["批次基础信息与条码"]
    B --> C["堆放位置与数量"]
    B --> D["关联单据穿透（入库 / 出库 / 仓单）"]`,
          },
        ],
      },
    ],
  },
  {
    id: "inv-details-detail-order-link",
    documentRefs: {
      prd: { section: "修订记录", match: "库存明细全模块（列表、条码模态弹窗及详情页）", element: "row" },
      rules: { section: "【入库单号查看穿透联动】(R13)", match: "在库存明细详情页的基础信息区，入库单号右侧高亮提供主题色 【查看】 链接；", element: "text" },
    },
    number: 2,
    kind: "交互",
    title: "源头入库单穿透联动",
    content:
      "单据链中展示源头入库单号，支持直接点击跳转至入库记录详情页 (/仓储/入库管理/入库记录/详情/:id)，追溯原始填报与验收证据。",
    details: [],
  },
  {
    id: "inv-details-detail-fields",
    documentRefs: {
      fields: { section: "二、列表表格业务字段", match: "期初堆放数量", element: "row" },
      prd: { section: "1.1 业务背景" },
    },
    targetId: "inv-details-detail-page",
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
| **货主** | 文本 | 必填 | 名称 + 脱敏标识 | 双行 |
| **货品** | 文本 | 必填 | 大类-品类-规格 | 单行 |
| **堆放位置** | 文本 | 必填 | 仓库-库房-分区-垛位 | 单行 |
| **入库时间** | 日期时间 | 系统记录 | YYYY-MM-DD HH:mm:ss | 单行 |
| **当前可用量 / 冻结量** | 数值 | 系统计算 | 数值 + 单位 | 右对齐 |
| **关联单据** | 链接 | 条件展示 | 入库单 / 出库单 / 仓单号 | 可穿透 |`,
          },
        ],
      },
    ],
  },
  {
    id: "inv-details-detail-actions",
    documentRefs: {
      prd: { section: "5. 状态机与动作能力矩阵", match: "行操作: 详情", element: "row" },
      rules: { section: "【操作防抖与幂等控制】(R18)", match: "【查询】与【重置】按钮具有 1 秒防抖控制，避免连续点击引发的接口拥堵。", element: "text" },
    },
    targetId: "inv-details-detail-page",
    number: 0,
    kind: "交互",
    title: "操作与提示",
    content: "按状态控制按钮可用性，敏感操作二次确认并给出提示原话。",
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "按钮与提示",
            content: `| 操作 | 可见状态 | 点击后发生什么 | 提示原话 |
| :--- | :--- | :--- | :--- |
| **查看二维码** | 全部 | 弹窗展示大图 | — |
| **穿透单据** | 有下游单据 | 跳转对应单据详情 | — |
| **导出** | 全部 | 生成明细文件 | 「文件已生成，开始下载」 |`,
          },
        ],
      },
    ],
  },
]
