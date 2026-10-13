import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inboundRecordListAnnotations: PrototypeAnnotation[] = [
  {
    id: "inbound-record-page",
    targetId: "inbound-record-page",
    number: 1,
    kind: "页面",
    title: "入库记录台账定位",
    content:
      "本菜单仅展示审批已通过并归档生效的入库单，不提供状态筛选与行内编辑；默认按入库日期倒序。",
    documentRefs: {
      prd: {
        section: "6.1 入库记录 — 列表页",
        match: "已生效",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段",
        match: "入库单状态",
        element: "row",
      },
      rules: {
        section: "二、状态定义",
        match: "已通过",
        element: "text",
      },
    },
    details: [
      {
        title: "生命周期（列表视角）",
        items: [
          {
            label: "台账边界",
            content: `flowchart LR
    A["制单提交"] --> B["审批专网"]
    B -->|通过| C["APPROVED 入库记录列表"]
    B -->|驳回/撤销| D["不在本列表展示"]`,
          },
          {
            label: "路由",
            content: "PC 原型路径 /仓储/入库管理/入库记录（P-CKG-009）。",
          },
        ],
      },
    ],
  },
  {
    id: "inbound-record-filter",
    targetId: "inbound-record-filter",
    number: 2,
    kind: "字段",
    title: "筛选区两行十项",
    content:
      "默认一行四列：入库单号、货主名称/标识、入库类型、仓库名称；展开后补充入库日期、货品名称、制单人、制单时间。顶栏与预警配置一致：【新增入库】outline 按钮、收起/展开、重置、查询。",
    documentRefs: {
      fields: {
        section: "五、展示、筛选与引用规则",
        match: "筛选字段",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "inbound-record-table",
    targetId: "inbound-record-table",
    number: 3,
    kind: "字段",
    title: "11 列台账表格",
    content:
      "货主名称/标识、入库日期、制单时间为紧凑双行（日期+时分秒）；货物名称多规格以顿号拼接，最多展示两行，超出 hover 看全（R15）。操作列右侧冻结并带浅底。",
    documentRefs: {
      fields: {
        section: "五、展示、筛选与引用规则",
        match: "列表业务字段展示顺序",
        element: "text",
      },
      rules: {
        section: "五、",
        match: "R15",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "inbound-record-row-actions",
    targetId: "inbound-record-row-actions",
    number: 4,
    kind: "交互",
    title: "行操作三件套",
    content:
      "查看详情进入详情页；下载记录导出堆放明细 Excel；单据下载导出 PDF 凭证（原型 Mock 提示）。",
    documentRefs: {
      prd: {
        section: "6.1 入库记录 — 列表页",
        match: "行操作",
        element: "text",
      },
    },
    details: [],
  },
]
