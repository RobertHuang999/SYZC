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
    version: "6.3",
    title: "行操作三列排布与资料管理深链",
    content:
      "操作列一行最多 3 个、最多两行（超过 6 个才收入【更多】）。当前直出【详情】【单据下载】【下载记录】【资料管理】：【详情】进详情页并定位「货物明细」页签；【单据下载】预览并下载入库凭证；【下载记录】与库存查询-存货管理【导出记录】同一套弹窗（文件名/操作人/时间/状态/下载，异步生成后行内下载）；【资料管理】进详情页并定位「资料管理」页签。",
    documentRefs: {
      prd: {
        section: "6.1",
        match: "操作列",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "inbound-record-pdf-export",
    targetId: "inbound-record-row-actions",
    number: 5,
    kind: "交互",
    version: "6.4",
    title: "多介质【单据下载】与防断针打印预览（REQ-6.4-001 / REQ-6.4-003）",
    content:
      "点击行操作【单据下载】呼出居中打印预览弹窗，支持切换 A4 纵向归档版（210×297mm）、A5 横向便携版（210×148mm）、针式连续纸二等分版（241×139.5mm），按一级货品汇总平铺（不拆垛位）、货主证号与电话明文展示、纯黑 1 像素实线防断针并导出标准矢量文件。",
    documentRefs: {
      prd: {
        section: "二、 交互层：操作入口与打印预览弹窗",
        match: "单据下载",
        element: "text",
      },
    },
    details: [
      {
        title: "6.4 入库单据多介质打印规则（REQ-6.4-001 / REQ-6.4-003）",
        items: [
          {
            label: "明细深度（一级汇总）",
            content:
              "仅展示大类、品类、规格、数量（4位小数）、单位与批次/扩展收集项，不拆分二级具体垛位，保护监管仓库内部微观库容信息。单据抬头取当前租户系统名称；同一单内货品单位不同时，合计按单位分组展示，禁止混加。",
          },
          {
            label: "明文与防断针约束",
            content:
              "货主统一社会信用代码/身份证号与联系电话明文展示；全单纯黑实线（1px solid #000），严禁灰阶底色、条形码/二维码及冗长免责声明，预留仓管、送货人、货主、监管员手签与盖章框。",
          },
        ],
      },
    ],
  },
]
