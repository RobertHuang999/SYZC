import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const transferRecordListAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-record-list-page",
    targetId: "transfer-record-list-page",
    number: 1,
    kind: "页面",
    title: "转让记录台账定位与终态归档 (R07)",
    content:
      "本页面为已生效/已通过的转让单归档与查询台账（P-CKG-012）。接口强制过滤 APPROVED 终审通过状态，审批中或已驳回单据不在本列表呈现。严禁线上反审批撤销，回退须反向新发起转让申请。",
    documentRefs: {
      prd: {
        section: "4. 业务规则索引速查",
        match: "【台账终态归档与禁止反冲正】(R07)",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段",
        match: "转让单状态",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "R07",
        element: "text",
      },
    },
    details: [
      {
        title: "生命周期与台账边界",
        items: [
          {
            label: "业务定位",
            content:
              "货权法定转移台账。终审通过后原子触发原货主转让出库扣减，受让方名下自动生成转让入库单，条码资产归属原子变更（R05）。",
          },
          {
            label: "路由路径",
            content: "PC 端路径：/仓储/货物转让/转让记录（P-CKG-012）。",
          },
        ],
      },
    ],
  },
  {
    id: "transfer-record-filters",
    targetId: "transfer-record-filters",
    number: 2,
    kind: "字段",
    title: "检索区控件与纯净筛选 (R01)",
    content:
      "检索区支持 7 项检索条件：转让单号、转让日期范围、货主名称/标识、仓库名称、货品名称、制单人、制单时间范围。货物转让仅支持自有普通存货，不设“转让类型”筛选，亦不设状态筛选（R01）。",
    documentRefs: {
      prd: {
        section: "2. 功能范围",
        match: "列表多维检索",
        element: "text",
      },
      fields: {
        section: "六、展示、筛选与引用规则汇总",
        match: "筛选映射规则",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "R01",
        element: "text",
      },
    },
  },
  {
    id: "transfer-record-table",
    targetId: "transfer-record-table",
    number: 3,
    kind: "字段",
    title: "列表 10 列展示与操作极简收敛",
    content:
      "列表展示 10 列：序号、转让单号、转让人(双行含标识)、转让时间(双行)、转让数量、接收人(双行含标识)、仓库名称、货物名称(超出2行更多Popover)、制单人、操作列。操作列仅保留【查看详情】，不设单据下载或下载记录。",
    documentRefs: {
      prd: {
        section: "2. 功能范围",
        match: "10 列展示（操作列仅查看详情）",
        element: "text",
      },
      fields: {
        section: "六、展示、筛选与引用规则汇总",
        match: "列表固定展示顺序与默认排序",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "R07",
        element: "text",
      },
    },
  },
]
