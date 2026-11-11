import type { SupervisionOrderItem, SupervisionOrderLogItem } from "../domain/types"

function buildLogs(
  orderNo: string,
  pledgeTime: string,
  ownerName: string,
  extra?: { action: string; detail: string; notes?: string }[],
): SupervisionOrderLogItem[] {
  const base: SupervisionOrderLogItem[] = [
    {
      id: `${orderNo}-LOG-2`,
      action: "抵质押资料归档",
      operatorName: "资料管理员-周敏",
      time: pledgeTime,
      detail: "监管办理终审后自动归档：权属证明、评估报告、中仓登登记回执已入库。",
      notes: "资料管理入口可查看并补充影像件。",
    },
    {
      id: `${orderNo}-LOG-1`,
      action: "监管办理终审生单",
      operatorName: "系统自动",
      time: pledgeTime,
      detail: `经办人完成监管办理终审，系统固化货主「${ownerName}」与货位快照，订单进入履约监管存续期。`,
    },
  ]
  const extras = (extra ?? []).map((item, index) => ({
    id: `${orderNo}-LOG-X${index + 1}`,
    action: item.action,
    operatorName: "业务经办人-李行",
    time: pledgeTime,
    detail: item.detail,
    notes: item.notes,
  }))
  return [...extras, ...base]
}

/**
 * 监管管理 Mock：每个业务场景只保留一条，不重复。
 *
 * 抵押订单：
 *  1. 个人正常在押
 *  2. 企业正常在押（货品超过 2 种，出现「更多...」）
 *  3. 有风险订单（红标 + 按钮不禁用）
 *  4. 有在途审批（移库在途，变更类操作置灰）
 *  5. 未定价货品（行业参考价缺失并告警）
 *  6. 电子仓单订单（CD 开头的仓单号）
 *  7. 已解押终态（操作熔断，只剩查看详情与操作记录）
 *
 * 质押订单：
 *  8. 个人静态质押正常
 *  9. 企业流动质押 + 风险 + 出库在途（三个场景合并一条）
 * 10. 已解质押终态
 *
 * 监管服务订单：
 * 11. 企业固定服务正常
 * 12. 企业浮动服务有风险
 * 13. 已解监管终态
 */
export const supervisionOrdersMock: SupervisionOrderItem[] = [
  // 1. 个人正常在押
  {
    id: "SM-M-001",
    tab: "MORTGAGE",
    orderNo: "2115703474879283201",
    ownerType: "个人",
    ownerName: "张一",
    ownerIdentity: "133****0001",
    ownerIdentityFull: "13312340001",
    goodsList: [
      { name: "冻货-牛丸-36个月-0.9999-公斤" },
      { name: "冻货-牛丸-36个月-0.0001-公斤" },
    ],
    pledgeTime: "2026-10-29 15:13:11",
    status: "抵押中",
    businessMode: "浮动抵押",
    loanAmount: 2,
    loanPeriods: 23,
    loanBalance: 1,
    safetyLine: 2,
    industryPrice: 0.010023,
    appraisedValue: 0.010023,
    processName: "抵质押简单总流程",
    relatedOrgs: ["卡皮评估", "卡皮银行", "四川享宇科技有限公司", "监管公司2号"],
    hasRisk: false,
    logs: buildLogs("2115703474879283201", "2026-10-29 15:13:11", "张一"),
  },

  // 2. 企业正常在押（货品超过 2 种）
  {
    id: "SM-M-002",
    tab: "MORTGAGE",
    orderNo: "2101234567890123456",
    ownerType: "企业",
    ownerName: "四川果香农业有限公司",
    ownerIdentity: "91510100MA6C8F2X3Y",
    goodsList: [
      { name: "冻品-鸡翅-四川-特级-1-公斤" },
      { name: "冻品-牛肉-阿根廷-特级-1-公斤" },
      { name: "冻品-带鱼-舟山-特级-1-公斤" },
    ],
    pledgeTime: "2026-10-25 10:12:36",
    status: "抵押中",
    businessMode: "浮动抵押",
    loanAmount: 1200,
    loanPeriods: 24,
    loanBalance: 860,
    safetyLine: 900,
    industryPrice: 1258.4,
    appraisedValue: 1320,
    processName: "抵质押简单总流程",
    relatedOrgs: ["卡皮评估", "卡皮银行", "四川享宇科技有限公司"],
    hasRisk: false,
    logs: buildLogs("2101234567890123456", "2026-10-25 10:12:36", "四川果香农业有限公司"),
  },

  // 3. 有风险订单
  {
    id: "SM-M-003",
    tab: "MORTGAGE",
    orderNo: "2101234567890123459",
    ownerType: "企业",
    ownerName: "云南铝业股份有限公司",
    ownerIdentity: "91530000MA6K9P2Q7W",
    goodsList: [
      { name: "铝锭-重熔用铝锭-Al99.70-吨" },
      { name: "铝棒-6063-吨" },
    ],
    pledgeTime: "2026-10-15 11:05:44",
    status: "抵押中",
    businessMode: "浮动抵押",
    loanAmount: 800,
    loanPeriods: 24,
    loanBalance: 500,
    safetyLine: 620,
    industryPrice: 910,
    appraisedValue: 950,
    processName: "抵质押简单总流程",
    relatedOrgs: ["卡皮评估", "卡皮银行", "四川享宇科技有限公司"],
    hasRisk: true,
    logs: buildLogs("2101234567890123459", "2026-10-15 11:05:44", "云南铝业股份有限公司", [
      {
        action: "现货行情跌价预警",
        detail: "铝锭行情连续下跌，货物评估价值接近安全线，触发补仓提醒。",
        notes: "补仓至安全线以上后消除订单红标。",
      },
    ]),
  },

  // 4. 有在途审批（移库在途）
  {
    id: "SM-M-004",
    tab: "MORTGAGE",
    orderNo: "2105187903456583681",
    ownerType: "个人",
    ownerName: "梨花",
    ownerIdentity: "188****2345",
    ownerIdentityFull: "18812342345",
    goodsList: [
      { name: "水果-苹果-新疆-特级-5-箱" },
      { name: "水果-香蕉-海南-0.9900-斤" },
    ],
    pledgeTime: "2026-09-30 14:48:03",
    status: "抵押中",
    businessMode: "浮动抵押",
    loanAmount: 1,
    loanPeriods: 2,
    loanBalance: 0.9998,
    safetyLine: 5,
    industryPrice: 3.080198,
    appraisedValue: 3.080198,
    processName: "抵质押简单总流程",
    relatedOrgs: ["卡皮评估", "卡皮银行", "四川享宇科技有限公司", "监管公司2号"],
    hasRisk: false,
    lockedTask: "货物移库",
    logs: buildLogs("2105187903456583681", "2026-09-30 14:48:03", "梨花", [
      {
        action: "发起货物移库申请",
        detail: "同仓内货位调整：A-01-03 → B-02-07，现场抓拍存证已上传，等待资方风控审批。",
        notes: "在途审批期间，置换、补仓、出库、解押、平仓等变更操作全部阻断。",
      },
    ]),
  },

  // 5. 未定价货品
  {
    id: "SM-M-005",
    tab: "MORTGAGE",
    orderNo: "2108109714795843586",
    ownerType: "个人",
    ownerName: "原原李",
    ownerIdentity: "185****7112",
    ownerIdentityFull: "18512347112",
    goodsList: [
      { name: "干果-水果-苹果干-33-克" },
      { name: "干果-水果-苹果干-10-克" },
    ],
    pledgeTime: "2026-10-08 16:18:17",
    status: "抵押中",
    businessMode: "浮动抵押",
    loanAmount: 1,
    loanPeriods: 2,
    loanBalance: 1.9997,
    safetyLine: 1,
    appraisedValue: 0.000899,
    processName: "抵质押简单总流程",
    relatedOrgs: ["卡皮评估", "卡皮银行", "四川享宇科技有限公司"],
    hasRisk: false,
    unpriced: true,
    logs: buildLogs("2108109714795843586", "2026-10-08 16:18:17", "原原李", [
      {
        action: "货物估值缺少行情价",
        detail: "货品暂无权威行情指导价，系统按未定价处理，该部分不计入货值总额。",
      },
    ]),
  },

  // 6. 电子仓单订单
  {
    id: "SM-M-006",
    tab: "MORTGAGE",
    orderNo: "2101234567890123457",
    ownerType: "企业",
    ownerName: "重庆渝铜贸易有限公司",
    ownerIdentity: "91500000MA5U7X9K2P",
    goodsList: [{ name: "CD202608260001" }],
    pledgeTime: "2026-10-22 09:30:18",
    status: "抵押中",
    businessMode: "固定抵押",
    loanAmount: 300,
    loanPeriods: 12,
    loanBalance: 210,
    safetyLine: 240,
    industryPrice: 2050,
    appraisedValue: 2100,
    processName: "抵质押简单总流程",
    relatedOrgs: ["卡皮评估", "卡皮银行", "四川享宇科技有限公司"],
    hasRisk: false,
    logs: buildLogs("2101234567890123457", "2026-10-22 09:30:18", "重庆渝铜贸易有限公司"),
  },

  // 7. 已解押终态（操作熔断）
  {
    id: "SM-M-007",
    tab: "MORTGAGE",
    orderNo: "2115334109961072641",
    ownerType: "个人",
    ownerName: "张三",
    ownerIdentity: "133****0003",
    ownerIdentityFull: "13312340003",
    goodsList: [{ name: "干粮-方便面-康师傅-酸菜-1-桶" }],
    pledgeTime: "2026-10-28 14:45:27",
    status: "解抵押",
    businessMode: "固定抵押",
    processName: "Cico总流程最简抵质押",
    relatedOrgs: ["卡皮银行", "四川享宇科技有限公司"],
    hasRisk: false,
    logs: buildLogs("2115334109961072641", "2026-10-28 14:45:27", "张三", [
      {
        action: "解抵押终审通过",
        detail: "贷款结清核验通过，四方电子签章完成，中仓登质权注销，IoT 设备已解绑。",
      },
    ]),
  },

  // 8. 个人静态质押正常
  {
    id: "SM-P-001",
    tab: "PLEDGE",
    orderNo: "2102222222222222201",
    ownerType: "个人",
    ownerName: "梨花",
    ownerIdentity: "188****2345",
    ownerIdentityFull: "18812342345",
    goodsList: [{ name: "电解铜-阴极铜-Cu-CATH-1-吨" }],
    pledgeTime: "2026-10-27 13:21:09",
    status: "质押中",
    businessMode: "静态质押",
    loanAmount: 300,
    loanPeriods: 12,
    loanBalance: 180,
    safetyLine: 200,
    industryPrice: 1300,
    appraisedValue: 1350,
    processName: "抵质押简单总流程",
    relatedOrgs: ["卡皮评估", "卡皮银行", "四川享宇科技有限公司"],
    hasRisk: false,
    logs: buildLogs("2102222222222222201", "2026-10-27 13:21:09", "梨花"),
  },

  // 9. 企业流动质押 + 风险 + 出库在途
  {
    id: "SM-P-002",
    tab: "PLEDGE",
    orderNo: "2102222222222222202",
    ownerType: "企业",
    ownerName: "四川果香农业有限公司",
    ownerIdentity: "91510100MA6C8F2X3Y",
    goodsList: [
      { name: "水果-苹果-新疆-特级-5-箱" },
      { name: "水果-香蕉-海南-0.9900-斤" },
    ],
    pledgeTime: "2026-10-24 10:08:52",
    status: "质押中",
    businessMode: "流动质押",
    loanAmount: 200,
    loanPeriods: 12,
    loanBalance: 120,
    safetyLine: 160,
    industryPrice: 260,
    appraisedValue: 280,
    processName: "抵质押简单总流程",
    relatedOrgs: ["卡皮评估", "卡皮银行", "四川享宇科技有限公司"],
    hasRisk: true,
    lockedTask: "货物出库",
    logs: buildLogs("2102222222222222202", "2026-10-24 10:08:52", "四川果香农业有限公司", [
      {
        action: "发起货物出库申请",
        detail: "部分提货申请已提交，拟出库 1,200 箱，等待资方风控审批。",
        notes: "在途审批期间，其他变更类操作全部阻断。",
      },
      {
        action: "盘点盘亏触发押品预警",
        detail: "现场盘点实盘数量小于账面数量，系统写入风险流水并点亮订单红标。",
      },
    ]),
  },

  // 10. 已解质押终态
  {
    id: "SM-P-003",
    tab: "PLEDGE",
    orderNo: "2102222222222222205",
    ownerType: "个人",
    ownerName: "王五",
    ownerIdentity: "139****5566",
    ownerIdentityFull: "13912345566",
    goodsList: [{ name: "冻货-带鱼-舟山-特级-1-公斤" }],
    pledgeTime: "2026-09-20 11:42:18",
    status: "解质押",
    businessMode: "静态质押",
    processName: "抵质押简单总流程",
    relatedOrgs: ["卡皮银行"],
    hasRisk: false,
    logs: buildLogs("2102222222222222205", "2026-09-20 11:42:18", "王五", [
      { action: "解质押终审通过", detail: "贷款结清，质权注销，设备解绑。" },
    ]),
  },

  // 11. 企业固定服务正常
  {
    id: "SM-S-001",
    tab: "SERVICE",
    orderNo: "2103333333333333301",
    ownerType: "企业",
    ownerName: "四川果香农业有限公司",
    ownerIdentity: "91510100MA6C8F2X3Y",
    goodsList: [
      { name: "冻品-鸡翅-四川-特级-1-公斤" },
      { name: "冻品-牛肉-阿根廷-特级-1-公斤" },
    ],
    pledgeTime: "2026-10-26 10:33:12",
    status: "监管中",
    businessMode: "固定服务",
    loanAmount: 1000,
    loanPeriods: 12,
    loanBalance: 700,
    safetyLine: 750,
    industryPrice: 760,
    appraisedValue: 800,
    processName: "监管服务总流程",
    relatedOrgs: ["森云监管", "卡皮银行", "四川享宇科技有限公司"],
    hasRisk: false,
    logs: buildLogs("2103333333333333301", "2026-10-26 10:33:12", "四川果香农业有限公司"),
  },

  // 12. 企业浮动服务有风险
  {
    id: "SM-S-002",
    tab: "SERVICE",
    orderNo: "2103333333333333302",
    ownerType: "企业",
    ownerName: "成都橡胶产业集团有限公司",
    ownerIdentity: "91510100MA6B2Y8L5R",
    goodsList: [{ name: "橡胶-天然橡胶-STR20-吨" }],
    pledgeTime: "2026-10-20 16:05:38",
    status: "监管中",
    businessMode: "浮动服务",
    loanAmount: 500,
    loanPeriods: 12,
    loanBalance: 300,
    safetyLine: 350,
    industryPrice: 360,
    appraisedValue: 380,
    processName: "监管服务总流程",
    relatedOrgs: ["森云监管", "卡皮银行"],
    hasRisk: true,
    logs: buildLogs("2103333333333333302", "2026-10-20 16:05:38", "成都橡胶产业集团有限公司", [
      {
        action: "日常监管异常上报",
        detail: "现场巡检发现库区温湿度超阈值，已生成风险预警并通知监管员复核。",
      },
    ]),
  },

  // 13. 已解监管终态
  {
    id: "SM-S-003",
    tab: "SERVICE",
    orderNo: "2103333333333333304",
    ownerType: "企业",
    ownerName: "重庆渝铜贸易有限公司",
    ownerIdentity: "91500000MA5U7X9K2P",
    goodsList: [{ name: "电解铜-阴极铜-Cu-CATH-1-吨" }],
    pledgeTime: "2026-09-08 11:20:06",
    status: "解监管",
    businessMode: "固定服务",
    processName: "监管服务总流程",
    relatedOrgs: ["森云监管", "卡皮银行"],
    hasRisk: false,
    logs: buildLogs("2103333333333333304", "2026-09-08 11:20:06", "重庆渝铜贸易有限公司", [
      { action: "解除监管终审通过", detail: "监管服务到期，现场交接完成，IoT 设备解绑。" },
    ]),
  },
]
