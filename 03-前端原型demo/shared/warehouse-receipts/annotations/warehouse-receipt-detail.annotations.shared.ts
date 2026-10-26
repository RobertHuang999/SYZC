import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

/** 仓单管理 · 详情页标注正文（双端共享真源） */
export const warehouseReceiptDetailAnnotationsShared: SharedPrototypeAnnotation[] = [
  {
    id: "receipt-detail-page",
    targetId: "receipt-detail-page",
    number: 1,
    kind: "页面",
    title: "仓单全息档案（P-CKG-005-DETAIL）",
    content:
      "顶部展示仓单编号与一键复制，右上角返回；正文按「基础信息 + 货物明细 + 变更记录」组织，完整还原数字仓单从开立到注销的全生命周期。",
    documentRefs: {
      prd: { section: "6.2 仓单管理 — 详情页", match: "顶部栏" },
      fields: { section: "六、展示、筛选与引用规则", match: "敏感信息脱敏" },
    },
    details: [
      {
        title: "档案定位",
        items: [
          {
            label: "只读穿透",
            content:
              "详情页对所有状态只读展示，不提供绕过移动端人脸核验的动碰入口。",
          },
          {
            label: "追溯能力",
            content:
              "货物明细可下钻到具体垛位批次与存货条码；变更记录可下载对应版本确认单。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-detail-basic",
    targetId: "receipt-detail-basic",
    number: 2,
    kind: "字段",
    title: "基础信息：制单人 / 存货人 / 持有人 / 仓库",
    content:
      "四行结构化基础信息：制单人 + 制单时间、存货人及标识 + 开立时间、持有人及标识、仓库名称 + 注销时间；未注销时注销时间固定展示「--」。",
    documentRefs: {
      prd: { section: "6.2 仓单管理 — 详情页", match: "基础信息卡片" },
      fields: { section: "一、仓单单据与列表台账字段", match: "注销时间" },
    },
    details: [
      {
        title: "字段口径",
        items: [
          {
            label: "制单人",
            content: "姓名(所属机构全称)，与制单时间分两列展示。",
          },
          {
            label: "主体标识",
            content:
              "企业展示 18 位统一社会信用代码；个人展示脱敏手机号（隐藏中间 4 位）。",
          },
          {
            label: "空值",
            content: "注销时间未产生时统一展示「--」，不使用空白占位。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-detail-seal",
    targetId: "receipt-detail-seal",
    number: 3,
    kind: "规则",
    title: "四态实心大圆章（R-DWR-05）",
    content:
      "详情头部右侧悬挂状态实心圆章：审批中金黄、正常生态绿、冻结深灰蓝、注销中灰；颜色只承载状态语义，不随主题色变化。",
    documentRefs: {
      prd: { section: "5.1 仓单四态生命周期定义", match: "审批中" },
      rules: { section: "2. 规则详细规格", match: "R-DWR-05" },
      fields: { section: "一、仓单单据与列表台账字段", match: "仓单状态" },
    },
    details: [],
  },
  {
    id: "receipt-detail-goods",
    targetId: "receipt-detail-goods",
    number: 4,
    kind: "字段",
    title: "双层嵌套货物明细：货品汇总 → 垛位批次",
    content:
      "一级行按「大类-品类-规格」汇总开立数量；展开后按批次展示位置、具体位置、入库时间、其他信息、存货条码、状态与开立数量，支持多行同时展开。",
    documentRefs: {
      prd: { section: "6.2 仓单管理 — 详情页", match: "货物明细标签页" },
      fields: { section: "三、详情页货物明细字段（双层嵌套结构）", match: "二级微观垛位批次展开表格" },
    },
    details: [
      {
        title: "批次口径",
        items: [
          {
            label: "位置",
            content:
              "展示「仓库-库房(审核标签)-分区」，如「生鲜仓库-水果库房2(不审核)-常见水果分区」。",
          },
          {
            label: "具体位置",
            content: "垛位编号或别名；未划分垛位时展示「--」。",
          },
          {
            label: "其他信息",
            content: "继承入库时的自定义扩展属性；无内容展示「无: --」。",
          },
          {
            label: "数量",
            content: "保留最多 4 位小数并带计量单位，如 9.0099 公斤。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-detail-changes",
    targetId: "receipt-detail-changes",
    number: 5,
    kind: "字段",
    title: "变更记录审计流水",
    content:
      "记录仓单开立、补货、出库、移库、货物移除、持有人变更、注销等全部流转；每行含变更时间、类型、内容摘要、操作人、关联单号与版本下载。",
    documentRefs: {
      prd: { section: "6.2 仓单管理 — 详情页", match: "变更记录标签页" },
      fields: { section: "四、详情页变更记录字段（标签页 2）", match: "变更内容" },
    },
    details: [
      {
        title: "审计要求",
        items: [
          {
            label: "关联单号",
            content:
              "出库单、移库单、质押单等可点击穿透到对应单据详情。",
          },
          {
            label: "快照不可变",
            content:
              "变更内容记录关键字段变更前后摘要，作为司法存证快照，不随主数据编辑而改写。",
          },
        ],
      },
    ],
  },
  {
    id: "receipt-detail-barcode",
    targetId: "receipt-detail-barcode",
    number: 6,
    kind: "交互",
    title: "存货条码现场扫码弹窗",
    content:
      "点击二级批次行的二维码图标，居中弹出存货条码卡片，展示大二维码、条码编号、货品规格、存放位置与入库时间，支持一键复制条码编号。",
    documentRefs: {
      prd: { section: "6.2 仓单管理 — 详情页", match: "存货条码二维码弹窗" },
      fields: { section: "3.2 二级微观垛位批次展开表格", match: "存货条码" },
    },
    details: [],
  },
]
