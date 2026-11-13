import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

/**
 * 货物转让 · H5 标注正文（与 PC 端 12-货物转让-转让记录 三件套同源）。
 * H5 只描述端上承载差异，不另立业务结论。
 */
export const transferH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-h5-list",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "包含功能范围", element: "row" },
      rules: { section: "【货权转让纯净性约束】(R01)", match: "转让前置解绑规则：", element: "text" },
    },
    targetId: "transfer-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 货物转让",
    content:
      "已终审通过的货权转让归档台账：检索维度与 PC 一致，覆盖转让单号、转让日期、货主名称/标识、仓库、货品名称、制单人、制单时间七项；移动端把单号与货主收进搜索框，仓库/货品/制单人用筛选胶囊，日期范围收进【更多筛选】抽屉。转让只发生在仓内货权层面，货物不产生物理位移，因此不设现场照片与设备抓拍。",
    details: [
      {
        title: "转让链路",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["业务办理 · 货物转让发起"] --> B["提交审核"]
    B -->|驳回 / 撤回| C["我的申请"]
    B -->|终审通过| D["原子货权转移"]
    D --> E["原货主转让出库 + 受让方转让入库 (R05)"]
    D --> F["条码归属变更为新货主"]
    D --> G["进入货物转让台账（仅已通过，R07）"]`,
          },
          {
            label: "移动端形态",
            content: "台账为卡片流，单号与货主收进搜索框，仓库/货品/制单人用筛选胶囊，日期范围在【更多筛选】抽屉。",
          },
        ],
      },
    ],
  },
]

export const transferH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "transfer-h5-detail",
    targetId: "transfer-h5-detail",
    number: 2,
    kind: "页面",
    title: "货物转让 · 详情",
    content:
      "摘要卡字段与 PC 基础信息一致：制单人、制单时间、接收人（含标识）、转让人（含标识）、转让时间、所属仓库、转让原因；货权流向用「转让人 ➔ 接收人」箭头链路表达。页签为转让明细与审核记录：明细按「一级货品 + 二级储位」展示位置、具体位置、入库时间、其他信息、存货条码、状态与转让数量；审核记录展示节点、处理人（含机构）、动作、时间与意见。",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "树形货品明细", element: "text" },
      fields: { section: "二、转让货品明细字段", match: "转让货品明细采用树形结构", element: "row" },
      rules: { section: "三、核心业务规则与逻辑规格", match: "R01", element: "text" },
    },
    details: [],
  },
  {
    id: "transfer-h5-detail-audit",
    documentRefs: {
      prd: { section: "场景 3【审批终审通过自动生成转让入库】(S03)", match: "情境：老李转让给张总的香蕉转让单经老王在审批中心终审通过。", element: "text" },
      rules: { section: "【跨模块转让入库联动与货权对冲】(R05)", match: "终审通过跨模块原子对冲：", element: "text" },
    },
    targetId: "transfer-h5-detail-audit",
    number: 3,
    kind: "交互",
    title: "审核流转与跨模块入库闭环",
    content:
      "审核记录按时间顺序展示提交、受让方核验、监管风控审查与终审通过；终审通过后系统原子生成原货主转让出库单，并在受让方名下生成转让入库单，完成货权对冲。",
    details: [],
  },
]
