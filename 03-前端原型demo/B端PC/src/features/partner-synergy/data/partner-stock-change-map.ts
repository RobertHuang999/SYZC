/** 6.3 合作方存量改造地图 · 研发索引（非业务 SSOT；真源 05 协同规格 + 08 范围） */

export type PartnerChangeLevel =
  | "must-change"
  | "fk-snapshot"
  | "read-only"
  | "doc-only"
  | "out-of-scope"
  | "tentative"

export type PartnerPrototypeStatus =
  | "delivered-63"
  | "placeholder"
  | "doc-only"
  | "meta"

export type PartnerStockChangeMapRow = {
  id: string
  sector: string
  menuLabel: string
  menuPath: string
  priority: "P0" | "P1" | "P2" | "—" | "暂定"
  changeLevel: PartnerChangeLevel
  archiveMenus: string[]
  summaryBullets: string[]
  doNot?: string[]
  prototypeRoute?: string
  prototypeStatus: PartnerPrototypeStatus
  specHint?: string
  acceptanceIds?: string[]
}

export const PARTNER_CHANGE_LEVEL_LABEL: Record<PartnerChangeLevel, string> = {
  "must-change": "必改交互",
  "fk-snapshot": "外键+快照",
  "read-only": "只读继承",
  "doc-only": "文档验收",
  "out-of-scope": "本期不做",
  tentative: "暂定开发",
}

export const PARTNER_PROTOTYPE_STATUS_LABEL: Record<PartnerPrototypeStatus, string> = {
  "delivered-63": "6.3 原型已交付",
  placeholder: "占位页",
  "doc-only": "仅文档",
  meta: "说明页",
}

export const partnerStockChangeMapRows: PartnerStockChangeMapRow[] = [
  {
    id: "archive-four-menus",
    sector: "用户中心",
    menuLabel: "合作方档案 · 四子菜单",
    menuPath: "用户中心 / 合作方档案",
    priority: "P0",
    changeLevel: "must-change",
    archiveMenus: ["货主信息", "提货人信息", "资金方信息", "服务方信息"],
    summaryBullets: [
      "方案 B：分菜单独立主档，选择器按 archiveMenu 硬过滤",
      "管理端保存可未验证；改址走 PA-R06a，不回写历史快照",
    ],
    prototypeRoute: "/用户中心/合作方档案/货主信息",
    prototypeStatus: "delivered-63",
    specHint: "04 公共三件套 + 04-1~04-4",
    acceptanceIds: ["PA-V03", "PA-V07d"],
  },
  {
    id: "platform-admission",
    sector: "配置管理",
    menuLabel: "基础配置 · 货主准入策略",
    menuPath: "配置管理 / 平台管理 / 基础配置",
    priority: "P0",
    changeLevel: "must-change",
    archiveMenus: ["货主信息"],
    summaryBullets: ["P01~P09 仅货主域；P02 开唯一前须 P03 历史冲突治理"],
    prototypeRoute: "/配置管理/平台管理/基础配置",
    prototypeStatus: "delivered-63",
    specHint: "02-基础配置三件套",
  },
  {
    id: "inbound-record",
    sector: "仓储",
    menuLabel: "入库记录",
    menuPath: "仓储 / 入库管理 / 入库记录",
    priority: "P0",
    changeLevel: "must-change",
    archiveMenus: ["货主信息"],
    summaryBullets: [
      "货主 owner_partner_id；作业嵌入快捷建档（QCP），不在提交时原子建档",
      "普通入库未验证货主零短信；金融类 PA-R04b 补验",
      "审批通过写库存前固化货主快照",
    ],
    doNot: ["主表平铺证件地址", "提交时再新建货主"],
    prototypeRoute: "/仓储/入库管理/入库记录/新增",
    prototypeStatus: "delivered-63",
    specHint: "05 §3.1 · 10-入库记录",
    acceptanceIds: ["SYN-V01", "SYN-V16", "SYN-V11"],
  },
  {
    id: "outbound-record",
    sector: "仓储",
    menuLabel: "出库记录",
    menuPath: "仓储 / 出库管理 / 出库记录",
    priority: "P0",
    changeLevel: "must-change",
    archiveMenus: ["货主信息", "提货人信息"],
    summaryBullets: [
      "货主仅选已有档案，制单页不提供快捷新建货主",
      "提货经办人提货人信息域 + O06a 快捷建档",
      "经办人不触发货主 P02",
    ],
    doNot: ["出库页快捷新建货主", "失焦静默沉淀提货人"],
    prototypeRoute: "/仓储/出库管理/出库记录/新增",
    prototypeStatus: "delivered-63",
    specHint: "05 §3.3 · 11-出库记录",
    acceptanceIds: ["SYN-V17", "SYN-V05"],
  },
  {
    id: "pickup-order",
    sector: "仓储",
    menuLabel: "提货单",
    menuPath: "仓储 / 提货单",
    priority: "P0",
    changeLevel: "fk-snapshot",
    archiveMenus: ["提货人信息"],
    summaryBullets: [
      "核销引用 pickup_agent_partner_id",
      "身份证/手机检索经办人；冻结拦截核销",
    ],
    prototypeRoute: "/仓储/提货单",
    prototypeStatus: "placeholder",
    specHint: "05 §3.3 · 基准提货单三件套",
    acceptanceIds: ["SYN-V06"],
  },
  {
    id: "transfer",
    sector: "仓储",
    menuLabel: "货物转让记录",
    menuPath: "仓储 / 货物转让",
    priority: "P0",
    changeLevel: "must-change",
    archiveMenus: ["货主信息"],
    summaryBullets: [
      "受让人挂货主信息域，废止接收方/待生效",
      "申请不校 P02；生效校 P02；驳回保留主档 PA-V07",
    ],
    prototypeStatus: "doc-only",
    specHint: "05 §3.4 · 基准转让三件套",
    acceptanceIds: ["SYN-V07", "SYN-V08", "SYN-V18"],
  },
  {
    id: "warehouse-receipt",
    sector: "仓储",
    menuLabel: "仓单管理",
    menuPath: "仓储 / 仓单管理",
    priority: "P1",
    changeLevel: "fk-snapshot",
    archiveMenus: ["货主信息"],
    summaryBullets: ["P0 切片：存货人复用入库货主引用", "P1：持有人时点流水与质押联动"],
    prototypeRoute: "/仓储/仓单管理",
    prototypeStatus: "placeholder",
    specHint: "05 §3.5",
    acceptanceIds: ["SYN-V12"],
  },
  {
    id: "inbound-staging",
    sector: "仓储",
    menuLabel: "入库暂存登记",
    menuPath: "仓储 / 入库暂存登记",
    priority: "暂定",
    changeLevel: "tentative",
    archiveMenus: ["货主信息"],
    summaryBullets: [
      "暂存可档案货主或临时文本，不发短信",
      "转正/正式页须 owner_partner_id + R03",
    ],
    prototypeStatus: "doc-only",
    specHint: "09 三件套 · 05 暂存联动说明",
  },
  {
    id: "customer-mgmt",
    sector: "交易",
    menuLabel: "客户管理",
    menuPath: "交易 / 客户管理",
    priority: "P0",
    changeLevel: "must-change",
    archiveMenus: ["货主信息"],
    summaryBullets: [
      "C 端账号 1:1 绑定合作方",
      "实名认证写地址并走准入；默认开通货主",
    ],
    prototypeRoute: "/交易/客户管理",
    prototypeStatus: "placeholder",
    specHint: "05 §3.6 · 基准客户管理",
    acceptanceIds: ["SYN-V09"],
  },
  {
    id: "supervision-handling",
    sector: "融资监管",
    menuLabel: "监管办理",
    menuPath: "融资 / 监管 / 监管业务 / 监管办理",
    priority: "P0",
    changeLevel: "must-change",
    archiveMenus: ["货主信息", "资金方信息", "服务方信息"],
    summaryBullets: [
      "抵押/质押权人→资金方信息；监管服务质权人→服务方信息",
      "货主→货主信息；生单快照，主档变更不回写",
    ],
    doNot: ["监管服务界面称「资金方」", "跨域混选权人"],
    prototypeRoute: "/融资/监管/监管业务/监管办理",
    prototypeStatus: "delivered-63",
    specHint: "12 · 05 第八节 · 基准办理三件套",
    acceptanceIds: ["MIG-V12"],
  },
  {
    id: "supervision-mgmt",
    sector: "融资监管",
    menuLabel: "监管管理",
    menuPath: "融资 / 监管 / 监管业务 / 监管管理",
    priority: "P0",
    changeLevel: "read-only",
    archiveMenus: ["货主信息", "资金方信息", "服务方信息"],
    summaryBullets: ["列表/详情展示开单快照", "跳转合作方详情须带 archiveMenu"],
    prototypeRoute: "/融资/监管/监管业务/监管管理",
    prototypeStatus: "placeholder",
    specHint: "12 · DZY-R14",
  },
  {
    id: "customer-inbound-appointment",
    sector: "工作中心",
    menuLabel: "客户入库预约",
    menuPath: "工作中心 / 客户需求审批 / 客户入库预约",
    priority: "—",
    changeLevel: "out-of-scope",
    archiveMenus: [],
    summaryBullets: ["C 端预约域，6.3 不做合作方引用改造"],
    prototypeStatus: "doc-only",
    specHint: "05 §3.2 归档",
  },
  {
    id: "rights-readonly",
    sector: "仓储",
    menuLabel: "货权档案 / 库存查询等",
    menuPath: "仓储 / 货权管理 · 库存查询 · 移库/加工/盘点",
    priority: "—",
    changeLevel: "read-only",
    archiveMenus: [],
    summaryBullets: ["不新增合作方选择器", "消费上游单据快照或库存货主"],
    prototypeStatus: "doc-only",
    specHint: "05 §2.1 只读下游",
  },
  {
    id: "financing-pa-r04b",
    sector: "风控 / 融资",
    menuLabel: "贷中风控 / 独立融资制单",
    menuPath: "各模块以 PRD 为准",
    priority: "—",
    changeLevel: "out-of-scope",
    archiveMenus: ["货主信息"],
    summaryBullets: ["6.3 不改菜单交互", "若引用货主且未验证，挂载 PA-R04b"],
    prototypeStatus: "doc-only",
    specHint: "04 公共规则 PA-R04b",
  },
  {
    id: "migration",
    sector: "割接",
    menuLabel: "合作方主数据迁移与切流",
    menuPath: "历史迁移与割接",
    priority: "P0",
    changeLevel: "fk-snapshot",
    archiveMenus: ["货主信息", "提货人信息", "资金方信息", "服务方信息"],
    summaryBullets: ["W2~W4 + W3b 监管权人回填", "MIG-V01~15 上线前必过"],
    prototypeRoute: "/历史迁移与割接/合作方主数据迁移",
    prototypeStatus: "meta",
    specHint: "05 迁移真源",
    acceptanceIds: ["MIG-V02", "MIG-V04", "MIG-V12"],
  },
]

export function countMapStats(rows: PartnerStockChangeMapRow[]) {
  const p0MustChange = rows.filter(
    (r) => r.priority === "P0" && (r.changeLevel === "must-change" || r.changeLevel === "fk-snapshot")
  ).length
  const delivered = rows.filter((r) => r.prototypeStatus === "delivered-63").length
  const docOnly = rows.filter(
    (r) => r.prototypeStatus === "doc-only" || r.prototypeStatus === "placeholder"
  ).length
  const outOfScope = rows.filter((r) => r.changeLevel === "out-of-scope").length
  return { p0MustChange, delivered, docOnly, outOfScope, total: rows.length }
}
