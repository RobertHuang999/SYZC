import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const transferRecordListAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-record-list-page",
    targetId: "transfer-record-list-page",
    number: 1,
    kind: "页面",
    title: "移库记录台账定位与终态归档 (R07)",
    content:
      "本页面为已生效/已通过的移库单生效归档与查询台账（P-CKG-011）。接口强制固定过滤 APPROVED 终审通过状态，审批中或已作废单据不在本列表呈现，本列表不设状态列与状态筛选。严禁线上反审批冲正，回移必须反向新发起移库申请。",
    documentRefs: {
      prd: {
        section: "6.1 列表页功能规格（P-CKG-011）",
        match: "移库记录",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段",
        match: "移库单状态",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【台账终态归档与禁止反冲正】(R07)",
        element: "text",
      },
    },
    details: [
      {
        title: "生命周期与台账边界",
        items: [
          {
            label: "数据流向",
            content:
              "申请提交进入审批流并锁定库存，终审通过后原子执行移库出库与移库入库对冲，并自动归档至本台账。",
          },
          {
            label: "路由路径",
            content: "PC 端路径：/仓储/移库管理/移库记录（P-CKG-011）。",
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
    title: "筛选区控件与无重置规范",
    content:
      "筛选区采用 4 列等分栅格（默认露出 4 项：移库单号、移库类型、货主名称/标识、仓库名称；展开 4 项：货品名称、制单人、移库日期、制单时间）。遵循系统统一规范，仅提供金色实心【查询】按钮，不设【重置】按钮。",
    documentRefs: {
      prd: {
        section: "6.1 列表页功能规格（P-CKG-011）",
        match: "检索区设计",
        element: "text",
      },
      fields: {
        section: "六、展示、筛选与引用规则汇总",
        match: "筛选映射规则",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "transfer-record-type-column",
    targetId: "transfer-record-type-column",
    number: 3,
    kind: "规则",
    title: "移库类型与关联单号展示 (R02/R04)",
    content:
      "移库类型列采用双行展示：第一行展示类型文本（质押移库、抵押移库、普通移库、仓单移库），第二行若属于质押/抵押移库则展示橙色关联单号，点击支持跳转单据详情。",
    documentRefs: {
      prd: {
        section: "6.1 列表页功能规格（P-CKG-011）",
        match: "移库类型",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段",
        match: "关联单号",
        element: "row",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【移库类型来源与仓单移库置灰】(R02)",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "transfer-record-table-actions",
    targetId: "transfer-record-table-actions",
    number: 4,
    kind: "按钮",
    title: "行操作：详情、下载记录与单据下载 (R06)",
    content:
      "固定操作列基于规范 TableRowActionPanel 呈现，提供【查看详情】、【下载记录】、【单据下载】三项操作。点击【单据下载】触发异步生成标准 PDF 凭证并计入下载记录；点击【下载记录】弹出历史所有生成快照支持复用下载。",
    documentRefs: {
      prd: {
        section: "6.1 列表页功能规格（P-CKG-011）",
        match: "操作列提供",
        element: "text",
      },
      rules: {
        section: "三、核心业务规则与逻辑规格",
        match: "【凭证生成与下载记录审计】(R06)",
        element: "text",
      },
    },
    details: [],
  },
]
