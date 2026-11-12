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
    version: "6.3",
    title: "行操作三列排布与资料管理深链",
    content:
      "操作列一行最多 3 个、最多两行（超过 6 个才收入【更多】）。当前直出【详情】【单据下载】【下载记录】【资料管理】：【详情】跳详情页并定位「货物明细」页签；【单据下载】打开凭证预览弹窗；【下载记录】与库存查询-存货管理【导出记录】同一套弹窗（文件名/操作人/时间/状态/下载，异步生成后行内下载）；【资料管理】跳详情页并定位「资料管理」页签。",
    documentRefs: {
      prd: {
        section: "出库记录主列表页",
        match: "操作列",
        element: "text",
      },
      rules: {
        section: "【并发控制幂等与操作审计】(O15)",
        match: "下载记录和下载凭证",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "outbound-record-pdf-export",
    targetId: "outbound-record-row-actions",
    number: 5,
    kind: "交互",
    version: "6.4",
    title: "多介质【单据下载】与质押单价货值脱敏（REQ-6.4-002 / REQ-6.4-003）",
    content:
      "点击行操作【单据下载】呼出多介质打印预览弹窗，支持 A4 纵向完整版（210×297mm）、A5 横向便携版（210×148mm）、针式连续纸二等分版（241×139.5mm）实时切换，单价与货物价值保留列头数值留空脱敏，货主与提货人证件号及电话明文展示。",
    documentRefs: {
      prd: {
        section: "四、 【出库单】三种纸张排版样式规格",
        match: "出库单 - A4 纵向完整版",
        element: "heading",
      },
      rules: {
        section: "【并发控制幂等与操作审计】(O15)",
        match: "下载记录和下载凭证",
        element: "text",
      },
    },
    details: [
      {
        title: "6.4 出库单据多介质打印与脱敏规则（REQ-6.4-002 / REQ-6.4-003）",
        items: [
          {
            label: "出库金额脱敏",
            content:
              "质押/抵押等出库涉及敏感货值，打印表格保留【单价】与【货物价值】列头但单元格数值留空，对现场承运司机及门卫脱敏，防止商业价格泄露。",
          },
          {
            label: "明文核验与防断针排版",
            content:
              "货主与提货人证件号、联系电话、车牌号明文展示；采用全空白连续纸纯黑实线（1px solid #000），不印条形码/二维码及免责声明，预留仓管、司机、复核/门卫、货权方四方签章框。单据抬头取当前租户系统名称；同一单内货品单位不同时，合计按单位分组展示，禁止混加。",
          },
        ],
      },
    ],
  },
]
