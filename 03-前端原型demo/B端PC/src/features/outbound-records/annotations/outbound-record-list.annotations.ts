import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const outboundRecordListAnnotations: PrototypeAnnotation[] = [
  {
    id: "outbound-record-page",
    targetId: "outbound-record-page",
    number: 1,
    kind: "页面",
    title: "出库记录台账定位",
    content:
      "本页面为已生效/已通过的出库单生效归档与查询台账（P-CKG-010）。接口强制固定过滤 APPROVED 终审状态，审批中或已作废单据不在本列表呈现，本列表不设状态列与状态筛选。纳管 6 类出库单（普通出库、仓单出库、质押出库、抵押出库，以及移库出库、转让出库联动写入）；质押/抵押加工出库仅保留加工模块流水不进入本台账。",
    documentRefs: {
      prd: {
        section: "6.1 出库记录 — 列表页（P-CKG-010）",
        match: "已生效",
        element: "text",
      },
      fields: {
        section: "一、单据级业务字段",
        match: "出库单状态",
        element: "row",
      },
      rules: {
        section: "三、单据状态机与流转定义",
        match: "已通过",
        element: "text",
      },
    },
    details: [
      {
        title: "生命周期与台账边界",
        items: [
          {
            label: "数据流向",
            content: `flowchart LR
    A["PC新增 / 移动端关联发起"] --> B["出库审批专网核验"]
    B -->|通过| C["APPROVED 出库台账 P-CKG-010"]
    D["移库/转让终审"] -->|自动联动写入| C
    B -->|驳回/撤销| E["不在本台账呈现"]`,
          },
          {
            label: "路由路径",
            content: "PC 工作台路径 /仓储/出库管理/出库记录（P-CKG-010）。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-record-filter",
    targetId: "outbound-record-filter",
    number: 2,
    kind: "字段",
    title: "筛选区控件与匹配规格",
    content:
      "两行 8 个筛选维度：出库单号（模糊/精确）、出库日期（日期时间范围）、货主名称/标识（综合匹配）、出库类型（全部/普通/仓单/质押/抵押/移库/转让/质押加工/抵押加工）、仓库名称（权限内下拉）、货品名称（多级联想）、制单人、制单时间。台账固定过滤 APPROVED，不设状态筛选（O13）。",
    documentRefs: {
      fields: {
        section: "六、展示、筛选与引用规则",
        match: "筛选字段与映射关系",
        element: "text",
      },
      rules: {
        section: "【已通过台账专网过滤与不可变快照】(O13)",
        match: "status = 'APPROVED'",
        element: "text",
      },
    },
    details: [
      {
        title: "筛选字段规则",
        items: [
          {
            label: "出库类型",
            content: "支持 8 种枚举；移库/转让为联动入账；加工类仅保留模块流水无结果。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-record-table",
    targetId: "outbound-record-table",
    number: 3,
    kind: "字段",
    title: "表格字段与敏感数据脱敏",
    content:
      "固定 11 列展示：序号、出库单号、货主名称/标识（双行展示脱敏标识）、出库类型、出库日期、仓库名称、关联单号（普通出库展示占位符“—”）、货物名称（多货品时弹出气泡 Tooltip 展示完整清单）、出库数量（带物理计量单位）、制单人（双行：账号机构 + 服务端制单时间）、操作（O02/O14）。",
    documentRefs: {
      fields: {
        section: "六、展示、筛选与引用规则",
        match: "列表展示顺序与默认排序",
        element: "text",
      },
      rules: {
        section: "【敏感数据全链路脱敏】(O14)",
        match: "隐藏中间四位",
        element: "text",
      },
    },
    details: [
      {
        title: "展示与排序",
        items: [
          {
            label: "排序规则",
            content: "默认按出库日期倒序；日期相同时按出库单号倒序。",
          },
        ],
      },
    ],
  },
  {
    id: "outbound-record-row-actions",
    targetId: "outbound-record-row-actions",
    number: 4,
    kind: "交互",
    title: "2×2 行操作与凭证导出审计（6.3 新增【资料管理】）",
    content:
      "四按钮按 2×2 排布：【详情】跳详情页并定位「货物明细」Tab（?tab=goods）；【单据下载】生成正式 PDF 出库凭证；【下载记录】导出 Excel 明细清单（含条码与库存位置）；【资料管理】跳详情页并定位「资料管理」Tab（?tab=documents）。所有下载与查阅行为均受并发令牌控制并写入安全审计日志（O15）。",
    documentRefs: {
      rules: {
        section: "【并发控制幂等与操作审计】(O15)",
        match: "下载记录和下载凭证",
        element: "text",
      },
    },
    details: [
      {
        title: "凭证规范",
        items: [
          {
            label: "PDF凭证",
            content: "包含监管仓库、货主、出库货物明细、提货人信息、双方签字盖章区与电子印章。",
          },
        ],
      },
    ],
  },
]
