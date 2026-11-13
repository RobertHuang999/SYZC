import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const partnerStockChangeMapAnnotations: PrototypeAnnotation[] = [
  {
    id: "change-map-scope",
    documentRefs: {
      prd: { section: "05 · 存量改造与关联业务协同（文档索引）", match: "合作方档案存量改造地图", element: "row" },
      rules: { section: "6.3 版本范围与里程碑（SSOT）", match: "合作方档案存量改造地图", element: "row" },
    },
    targetId: "change-map-scope",
    number: 1,
    kind: "页面",
    title: "合作方档案存量改造地图 · 研发索引",
    content: "6.3 菜单级改造索引；业务 SSOT 仍为 05 协同规格与 08 里程碑。",
    details: [
      {
        title: "阅读路径",
        items: [
          {
            label: "流转关系",
            content: `flowchart LR
  MAP["改造地图"] --> SPEC["05 协同规格全文"]
  MAP --> DEMO["6.3 已交付原型"]
  MAP --> MIG["数据迁移阅读页"]
  SPEC --> TRIPLE["各菜单三件套"]`,
          },
          {
            label: "维护顺序",
            content:
              "先改三件套或 05 协同规格 → 同步 partner-stock-change-map.ts → 再改本页 UI（见 05/README 第四节）。",
          },
        ],
      },
    ],
  },
  {
    id: "change-map-stats",
    documentRefs: {
      prd: { section: "三、原型阅读入口（PC Demo）" },
      rules: { section: "六、文档与原型索引（联调速查）", match: "6.3 原型", element: "row" },
    },
    targetId: "change-map-stats",
    number: 2,
    kind: "页面",
    title: "统计口径",
    content: "顶部四格数字帮助研发快速判断工作量与原型覆盖。",
    details: [
      {
        title: "计数规则",
        items: [
          {
            label: "P0 改造项",
            content: "含「必改交互」与「外键+快照」等级且优先级为 P0 的菜单行。",
          },
          {
            label: "文档/占位验收",
            content: "对齐 08 第 6.1 节原型裁切：文档仍为 P0，但 Demo 未建完整交互。",
          },
        ],
      },
    ],
  },
  {
    id: "change-map-table",
    documentRefs: {
      prd: { section: "二、与各菜单 6.3 副本的关系", match: "待 6.3 副本落地时以协同规格为准", element: "row" },
      fields: { section: "五、附录 A · 按菜单字段与引用改造检查表", match: "6.3 增量字段/改造要点", element: "row" },
    },
    targetId: "change-map-table",
    number: 3,
    kind: "页面",
    title: "改造清单表格",
    content: "「说明」抽屉为用户向摘要；字段编码以各菜单字段清单为准。",
    details: [
      {
        title: "操作列",
        items: [
          {
            label: "原型链接",
            content: "仅「6.3 原型已交付」行展示快捷跳转（入库/出库/监管办理/四子菜单等）。",
          },
          {
            label: "验收编号",
            content: "抽屉内列出 SYN-V / MIG-V 编号，完整步骤见 05 附录 B 与迁移真源第六节。",
          },
        ],
      },
    ],
  },
]
