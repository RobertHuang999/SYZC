import type {
  ReceiptChangeRecord,
  ReceiptGoodsGroup,
  ReceiptGoodsLot,
  WarehouseReceipt,
} from "./warehouse-receipt-types"

/**
 * 仓单管理 · 双端同源 Mock 种子
 * 业务真源：02-PRD文档/🌟🌟🌟-最新基准版/B端PC/02-仓储/05-仓单管理（三件套）
 * 货物使用大宗商品与冻品真实业务口径，避免无意义占位符。
 */

const ORG_XIANGYU = "四川享宇科技有限公司"
const ORG_SENYUN = "森云监管服务有限公司"
const ORG_HUADONG = "华东仓储运营中心"

const CREATOR_LXY = `lxy(${ORG_XIANGYU})`
const CREATOR_WANG = `王监管(${ORG_HUADONG})`
const CREATOR_ZHANG = `张三(${ORG_SENYUN})`

const ENTERPRISE_FUYANG = {
  type: "ENTERPRISE" as const,
  name: "阜阳市大数据资产运营有限公司",
  identifier: "91341202MA2U0JHJ3F",
}

const PERSON_LIMIEN = {
  type: "PERSON" as const,
  name: "李米恩",
  identifier: "185****8733",
}

const PERSON_YUANYUAN = {
  type: "PERSON" as const,
  name: "原原李",
  identifier: "185****7112",
}

const ENTERPRISE_WUXI = {
  type: "ENTERPRISE" as const,
  name: "无锡锡通科技有限公司",
  identifier: "91320214MA1X8K9L2P",
}

const ENTERPRISE_HONGDA = {
  type: "ENTERPRISE" as const,
  name: "江苏宏达贸易有限公司",
  identifier: "91320115MA1YQ7T48R",
}

const ENTERPRISE_QINGDAO = {
  type: "ENTERPRISE" as const,
  name: "青岛远洋橡胶有限公司",
  identifier: "91370200MA3N5R6T8W",
}

const ENTERPRISE_SUZHOU_BANK = {
  type: "ENTERPRISE" as const,
  name: "苏州银行股份有限公司",
  identifier: "91320500MA1W3E5R9K",
}

const WAREHOUSE_FRESH = "生鲜仓库"
const WAREHOUSE_HAIBAWANG = "海霸王仓库"
const WAREHOUSE_HUADONG = "华东1号智能立体仓"
const WAREHOUSE_XINAN = "西南大宗物资仓"

function lot(input: Omit<ReceiptGoodsLot, "statusLabel">): ReceiptGoodsLot {
  return { ...input, statusLabel: "仓单中" }
}

function group(
  input: Omit<ReceiptGoodsGroup, "name">,
): ReceiptGoodsGroup {
  return {
    ...input,
    name: `${input.category}-${input.variety}-${input.spec}`,
  }
}

function change(
  id: string,
  changedAt: string,
  changeType: ReceiptChangeRecord["changeType"],
  summary: string,
  operator: string,
  relatedNo?: string,
): ReceiptChangeRecord {
  return { id, changedAt, changeType, summary, operator, relatedNo }
}

/* ------------------------------------------------------------------ */
/* 1. 正常 · 生鲜仓库 · 3 种货品（列表「更多...」悬停样例）              */
/* ------------------------------------------------------------------ */

const receiptWatermelon: ReceiptGoodsGroup = group({
  id: "g-watermelon",
  category: "水果",
  variety: "西瓜",
  spec: "超级-宁夏",
  quantity: 12.0099,
  unit: "公斤",
  lots: [
    lot({
      id: "lot-watermelon-1",
      warehouseName: WAREHOUSE_FRESH,
      houseName: "水果库房2",
      houseAudit: "不审核",
      zoneName: "常见水果分区",
      position: "菊科",
      inboundAt: "2026-09-05 08:32:17",
      otherInfo: ["季节: 卡夫卡", "车辆: 啦啦", "保管地: --"],
      barcode: "SN20260905008892",
      quantity: 9.0099,
      unit: "公斤",
    }),
    lot({
      id: "lot-watermelon-2",
      warehouseName: WAREHOUSE_FRESH,
      houseName: "水果库房2",
      houseAudit: "不审核",
      zoneName: "常见水果分区",
      position: "黄冠",
      inboundAt: "2026-09-05 09:12:40",
      otherInfo: ["无: --"],
      barcode: "SN20260905008910",
      quantity: 3,
      unit: "公斤",
    }),
  ],
})

const receiptChili: ReceiptGoodsGroup = group({
  id: "g-chili",
  category: "蔬菜",
  variety: "辣椒",
  spec: "云南-有机",
  quantity: 10,
  unit: "斤",
  lots: [
    lot({
      id: "lot-chili-1",
      warehouseName: WAREHOUSE_FRESH,
      houseName: "蔬菜库房1",
      houseAudit: "审核",
      zoneName: "叶菜分区",
      position: "32刚刚发",
      inboundAt: "2026-09-06 07:48:05",
      otherInfo: ["季节: 夏季", "保管地: 冷风柜"],
      barcode: "SN20260906001234",
      quantity: 10,
      unit: "斤",
    }),
  ],
})

const receiptBanana: ReceiptGoodsGroup = group({
  id: "g-banana",
  category: "水果",
  variety: "香蕉",
  spec: "进口-一级",
  quantity: 5,
  unit: "箱",
  lots: [
    lot({
      id: "lot-banana-1",
      warehouseName: WAREHOUSE_FRESH,
      houseName: "水果库房2",
      houseAudit: "不审核",
      zoneName: "常见水果分区",
      position: "冰柜2",
      inboundAt: "2026-09-06 10:05:31",
      otherInfo: ["无: --"],
      barcode: "SN20260906001578",
      quantity: 5,
      unit: "箱",
    }),
  ],
})

/* ------------------------------------------------------------------ */
/* 2. 正常 · 海霸王仓库 · 存货人与持有人不一致                          */
/* ------------------------------------------------------------------ */

const receiptBeef: ReceiptGoodsGroup = group({
  id: "g-beef",
  category: "冻货",
  variety: "牛肉",
  spec: "36个月",
  quantity: 1,
  unit: "公斤",
  lots: [
    lot({
      id: "lot-beef-1",
      warehouseName: WAREHOUSE_HAIBAWANG,
      houseName: "冻库",
      houseAudit: "不审核",
      zoneName: "冷冻2",
      position: "位置2",
      inboundAt: "2026-05-13 15:46:00",
      otherInfo: ["无: --"],
      barcode: "SN20260513006601",
      quantity: 1,
      unit: "公斤",
    }),
  ],
})

const receiptWing: ReceiptGoodsGroup = group({
  id: "g-wing",
  category: "冻货",
  variety: "鸡翅",
  spec: "四川-特级-2025",
  quantity: 0.0968,
  unit: "斤",
  lots: [
    lot({
      id: "lot-wing-1",
      warehouseName: WAREHOUSE_HAIBAWANG,
      houseName: "冻库",
      houseAudit: "不审核",
      zoneName: "冷冻1",
      position: "位置1",
      inboundAt: "2026-05-14 11:20:08",
      otherInfo: ["车辆: 川A·8K2X9"],
      barcode: "SN20260514007733",
      quantity: 0.0968,
      unit: "斤",
    }),
  ],
})

/* ------------------------------------------------------------------ */
/* 3. 审批中 / 冻结 / 注销样例                                          */
/* ------------------------------------------------------------------ */

const receiptPendingBeef: ReceiptGoodsGroup = group({
  id: "g-pending-beef",
  category: "冻货",
  variety: "牛肉",
  spec: "36个月",
  quantity: 2.99,
  unit: "斤",
  lots: [
    lot({
      id: "lot-pending-beef-1",
      warehouseName: WAREHOUSE_HAIBAWANG,
      houseName: "冻库",
      houseAudit: "不审核",
      zoneName: "冷冻2",
      position: "位置3",
      inboundAt: "2026-06-28 10:11:39",
      otherInfo: ["无: --"],
      barcode: "SN20260628003112",
      quantity: 2.99,
      unit: "斤",
    }),
  ],
})

const receiptFrozenWing: ReceiptGoodsGroup = group({
  id: "g-frozen-wing",
  category: "冻货",
  variety: "鸡翅",
  spec: "四川-特级-2025",
  quantity: 25.5,
  unit: "公斤",
  lots: [
    lot({
      id: "lot-frozen-wing-1",
      warehouseName: WAREHOUSE_HAIBAWANG,
      houseName: "冻库",
      houseAudit: "不审核",
      zoneName: "冷冻1",
      position: "位置2",
      inboundAt: "2026-07-20 09:42:55",
      otherInfo: ["无: --"],
      barcode: "SN20260720004567",
      quantity: 25.5,
      unit: "公斤",
    }),
  ],
})

const receiptCancelledWatermelon: ReceiptGoodsGroup = group({
  id: "g-cancelled-watermelon",
  category: "水果",
  variety: "西瓜",
  spec: "超级-宁夏",
  quantity: 5,
  unit: "公斤",
  lots: [
    lot({
      id: "lot-cancelled-watermelon-1",
      warehouseName: WAREHOUSE_FRESH,
      houseName: "水果库房2",
      houseAudit: "不审核",
      zoneName: "常见水果分区",
      position: "菊科",
      inboundAt: "2026-07-20 13:15:22",
      otherInfo: ["无: --"],
      barcode: "SN20260720005129",
      quantity: 5,
      unit: "公斤",
    }),
  ],
})

/* ------------------------------------------------------------------ */
/* 4. 正常 · 华东1号智能立体仓 · 三方登记=是 · 在途移库（互斥演示）      */
/* ------------------------------------------------------------------ */

const receiptCopper: ReceiptGoodsGroup = group({
  id: "g-copper",
  category: "金属",
  variety: "电解铜",
  spec: "阴极铜-A级",
  quantity: 120,
  unit: "吨",
  lots: [
    lot({
      id: "lot-copper-1",
      warehouseName: WAREHOUSE_HUADONG,
      houseName: "一号库房",
      houseAudit: "审核",
      zoneName: "A区",
      position: "A-01-03",
      inboundAt: "2026-09-10 08:20:44",
      otherInfo: ["产地: 江西", "批次: LME-2609"],
      barcode: "SN20260910002109",
      quantity: 80,
      unit: "吨",
    }),
    lot({
      id: "lot-copper-2",
      warehouseName: WAREHOUSE_HUADONG,
      houseName: "一号库房",
      houseAudit: "审核",
      zoneName: "A区",
      position: "A-01-04",
      inboundAt: "2026-09-10 09:05:12",
      otherInfo: ["产地: 江西", "批次: LME-2610"],
      barcode: "SN20260910002110",
      quantity: 40,
      unit: "吨",
    }),
  ],
})

const receiptSteel: ReceiptGoodsGroup = group({
  id: "g-steel",
  category: "钢材",
  variety: "热轧卷板",
  spec: "Q235B-3.5*1500*C",
  quantity: 450,
  unit: "吨",
  lots: [
    lot({
      id: "lot-steel-1",
      warehouseName: WAREHOUSE_HUADONG,
      houseName: "二号库房",
      houseAudit: "审核",
      zoneName: "B区",
      position: "B-03-11",
      inboundAt: "2026-09-11 13:38:20",
      otherInfo: ["炉号: 26A-0912", "卷号: 12-18"],
      barcode: "SN20260911002288",
      quantity: 450,
      unit: "吨",
    }),
  ],
})

const receiptAluminum: ReceiptGoodsGroup = group({
  id: "g-aluminum",
  category: "铝锭",
  variety: "铝锭",
  spec: "AL99.70",
  quantity: 60,
  unit: "吨",
  lots: [
    lot({
      id: "lot-aluminum-1",
      warehouseName: WAREHOUSE_HUADONG,
      houseName: "一号库房",
      houseAudit: "审核",
      zoneName: "C区",
      position: "C-02-05",
      inboundAt: "2026-09-12 08:55:03",
      otherInfo: ["产地: 云南"],
      barcode: "SN20260912002345",
      quantity: 60,
      unit: "吨",
    }),
  ],
})

/* ------------------------------------------------------------------ */
/* 5. 正常 · 西南大宗物资仓 · 橡胶                                    */
/* ------------------------------------------------------------------ */

const receiptRubber: ReceiptGoodsGroup = group({
  id: "g-rubber",
  category: "橡胶",
  variety: "天然橡胶",
  spec: "STR20",
  quantity: 300,
  unit: "吨",
  lots: [
    lot({
      id: "lot-rubber-1",
      warehouseName: WAREHOUSE_XINAN,
      houseName: "大宗库房",
      houseAudit: "不审核",
      zoneName: "一号分区",
      position: "垛位-01",
      inboundAt: "2026-09-16 10:30:18",
      otherInfo: ["产地: 泰国", "柜号: TGHU8823109"],
      barcode: "SN20260916003311",
      quantity: 300,
      unit: "吨",
    }),
  ],
})

const receiptAluminumXinan: ReceiptGoodsGroup = group({
  id: "g-aluminum-xinan",
  category: "铝锭",
  variety: "铝锭",
  spec: "AL99.70",
  quantity: 80,
  unit: "吨",
  lots: [
    lot({
      id: "lot-aluminum-xinan-1",
      warehouseName: WAREHOUSE_XINAN,
      houseName: "大宗库房",
      houseAudit: "不审核",
      zoneName: "二号分区",
      position: "垛位-07",
      inboundAt: "2026-09-17 09:12:44",
      otherInfo: ["产地: 新疆"],
      barcode: "SN20260917003456",
      quantity: 80,
      unit: "吨",
    }),
  ],
})

/* ------------------------------------------------------------------ */
/* 6. 冻结 · 质押生效                                                 */
/* ------------------------------------------------------------------ */

const receiptFrozenCopper: ReceiptGoodsGroup = group({
  id: "g-frozen-copper",
  category: "金属",
  variety: "电解铜",
  spec: "阴极铜-A级",
  quantity: 200,
  unit: "吨",
  lots: [
    lot({
      id: "lot-frozen-copper-1",
      warehouseName: WAREHOUSE_HUADONG,
      houseName: "一号库房",
      houseAudit: "审核",
      zoneName: "A区",
      position: "A-02-01",
      inboundAt: "2026-08-01 14:25:37",
      otherInfo: ["批次: ZY-2608"],
      barcode: "SN20260801001902",
      quantity: 200,
      unit: "吨",
    }),
  ],
})

/* ------------------------------------------------------------------ */
/* 7. 个人货主 · 正常                                                 */
/* ------------------------------------------------------------------ */

const receiptPersonalWatermelon: ReceiptGoodsGroup = group({
  id: "g-personal-watermelon",
  category: "水果",
  variety: "西瓜",
  spec: "超级-宁夏",
  quantity: 8.5,
  unit: "公斤",
  lots: [
    lot({
      id: "lot-personal-watermelon-1",
      warehouseName: WAREHOUSE_FRESH,
      houseName: "水果库房2",
      houseAudit: "不审核",
      zoneName: "常见水果分区",
      position: "黄冠",
      inboundAt: "2026-09-19 15:08:11",
      otherInfo: ["无: --"],
      barcode: "SN20260919004012",
      quantity: 8.5,
      unit: "公斤",
    }),
  ],
})

const receiptPersonalChili: ReceiptGoodsGroup = group({
  id: "g-personal-chili",
  category: "蔬菜",
  variety: "辣椒",
  spec: "云南-有机",
  quantity: 20,
  unit: "斤",
  lots: [
    lot({
      id: "lot-personal-chili-1",
      warehouseName: WAREHOUSE_FRESH,
      houseName: "蔬菜库房1",
      houseAudit: "审核",
      zoneName: "叶菜分区",
      position: "--",
      inboundAt: "2026-09-19 16:22:09",
      otherInfo: ["季节: 秋季"],
      barcode: "SN20260919004088",
      quantity: 20,
      unit: "斤",
    }),
  ],
})

/* ------------------------------------------------------------------ */
/* 8. 注销样例                                                        */
/* ------------------------------------------------------------------ */

const receiptCancelledBeef: ReceiptGoodsGroup = group({
  id: "g-cancelled-beef",
  category: "冻货",
  variety: "牛肉",
  spec: "36个月",
  quantity: 12,
  unit: "公斤",
  lots: [
    lot({
      id: "lot-cancelled-beef-1",
      warehouseName: WAREHOUSE_HAIBAWANG,
      houseName: "冻库",
      houseAudit: "不审核",
      zoneName: "冷冻2",
      position: "位置1",
      inboundAt: "2026-06-15 08:40:12",
      otherInfo: ["无: --"],
      barcode: "SN20260615001277",
      quantity: 12,
      unit: "公斤",
    }),
  ],
})

/* ------------------------------------------------------------------ */
/* 仓单台账                                                           */
/* ------------------------------------------------------------------ */

export const warehouseReceiptSeed: WarehouseReceipt[] = [
  {
    id: "r-2096789249539219456",
    code: "CD2096789249539219456",
    owner: ENTERPRISE_FUYANG,
    holder: ENTERPRISE_FUYANG,
    warehouseName: WAREHOUSE_FRESH,
    thirdPartyRegistered: false,
    establishedAt: "2026-09-07 10:34:55",
    status: "NORMAL",
    creatorName: "lxy",
    creatorOrg: ORG_XIANGYU,
    creatorDisplay: CREATOR_LXY,
    createdAt: "2026-09-07 10:34:48",
    goodsGroups: [receiptWatermelon, receiptChili, receiptBanana],
    changes: [
      change(
        "c-1",
        "2026-09-07 10:34:55",
        "仓单开立",
        "实名双因子签署完成，初始开立西瓜 12.0099 公斤、辣椒 10 斤、香蕉 5 箱，共 3 种货品。",
        CREATOR_LXY,
      ),
      change(
        "c-2",
        "2026-09-09 14:20:11",
        "仓单补货",
        "追加同仓未占用库存：香蕉 5 箱，仓单总货品增至 3 种。",
        CREATOR_WANG,
        "BC20260909000121",
      ),
      change(
        "c-3",
        "2026-09-12 09:05:37",
        "仓单出库",
        "出库西瓜 2 公斤，剩余 10.0099 公斤；已生成提货单 TH20260912000087。",
        CREATOR_ZHANG,
        "OUT20260912000087",
      ),
    ],
  },
  {
    id: "r-2061360517577105409",
    code: "CD2061360517577105409",
    owner: ENTERPRISE_FUYANG,
    holder: PERSON_LIMIEN,
    warehouseName: WAREHOUSE_HAIBAWANG,
    thirdPartyRegistered: false,
    establishedAt: "2026-06-01 16:13:46",
    status: "NORMAL",
    creatorName: "lxy",
    creatorOrg: ORG_XIANGYU,
    creatorDisplay: CREATOR_LXY,
    createdAt: "2026-06-01 16:13:40",
    goodsGroups: [receiptBeef, receiptWing],
    changes: [
      change(
        "c-1",
        "2026-06-01 16:13:46",
        "仓单开立",
        "初始实名开立生成数字仓单，包含牛肉、鸡翅 2 种货品。",
        CREATOR_LXY,
      ),
      change(
        "c-2",
        "2026-06-15 10:22:00",
        "持有人变更",
        "仓单持有人由 阜阳市大数据资产运营有限公司 变更为 李米恩。",
        `${CREATOR_ZHANG}`,
        "ZR20260615000321",
      ),
      change(
        "c-3",
        "2026-07-10 14:30:15",
        "仓单出库",
        "出库冻货-鸡翅 0.05 斤，剩余 0.0468 斤。",
        CREATOR_ZHANG,
        "OUT20260710000155",
      ),
    ],
  },
  {
    id: "r-2072612841056083970",
    code: "CD2072612841056083970",
    owner: ENTERPRISE_FUYANG,
    holder: ENTERPRISE_FUYANG,
    warehouseName: WAREHOUSE_HAIBAWANG,
    thirdPartyRegistered: false,
    establishedAt: "2026-07-02 17:26:29",
    status: "PENDING",
    creatorName: "lxy",
    creatorOrg: ORG_XIANGYU,
    creatorDisplay: CREATOR_LXY,
    createdAt: "2026-07-02 17:26:23",
    goodsGroups: [receiptPendingBeef],
    changes: [
      change(
        "c-1",
        "2026-07-02 17:26:29",
        "仓单开立",
        "初始实名开立生成数字仓单，包含冻货-牛肉-36个月 2.99 斤。",
        CREATOR_LXY,
      ),
    ],
  },
  {
    id: "r-2081997105313796098",
    code: "CD2081997105313796098",
    owner: ENTERPRISE_FUYANG,
    holder: ENTERPRISE_FUYANG,
    warehouseName: WAREHOUSE_HAIBAWANG,
    thirdPartyRegistered: false,
    establishedAt: "2026-07-28 14:56:11",
    status: "FROZEN",
    creatorName: "lxy",
    creatorOrg: ORG_XIANGYU,
    creatorDisplay: CREATOR_LXY,
    createdAt: "2026-07-28 14:56:05",
    goodsGroups: [receiptFrozenWing],
    changes: [
      change(
        "c-1",
        "2026-07-28 14:56:11",
        "仓单开立",
        "初始实名开立生成数字仓单，包含冻货-鸡翅 25.5 公斤。",
        CREATOR_LXY,
      ),
    ],
  },
  {
    id: "r-2061684070194343937",
    code: "CD2061684070194343937",
    owner: ENTERPRISE_FUYANG,
    holder: ENTERPRISE_FUYANG,
    warehouseName: WAREHOUSE_FRESH,
    thirdPartyRegistered: false,
    establishedAt: "2026-07-27 18:12:18",
    status: "CANCELLED",
    creatorName: "lxy",
    creatorOrg: ORG_XIANGYU,
    creatorDisplay: CREATOR_LXY,
    createdAt: "2026-07-27 18:12:10",
    cancelledAt: "2026-07-30 09:20:11",
    goodsGroups: [receiptCancelledWatermelon],
    changes: [
      change(
        "c-1",
        "2026-07-27 18:12:18",
        "仓单开立",
        "初始实名开立生成数字仓单，包含水果-西瓜 5 公斤。",
        CREATOR_LXY,
      ),
      change(
        "c-2",
        "2026-07-30 09:20:11",
        "仓单注销",
        "剩余货物已全部清点提货出库，经电子签章审批通过，执行仓单注销。",
        CREATOR_ZHANG,
        "CAN20260730000019",
      ),
    ],
  },
  {
    id: "r-2091023847561102336",
    code: "CD2091023847561102336",
    owner: ENTERPRISE_WUXI,
    holder: ENTERPRISE_HONGDA,
    warehouseName: WAREHOUSE_HUADONG,
    thirdPartyRegistered: true,
    establishedAt: "2026-09-12 09:18:27",
    status: "NORMAL",
    creatorName: "王监管",
    creatorOrg: ORG_HUADONG,
    creatorDisplay: CREATOR_WANG,
    createdAt: "2026-09-12 09:18:20",
    currentFlow: "仓单移库",
    goodsGroups: [receiptCopper, receiptSteel, receiptAluminum],
    changes: [
      change(
        "c-1",
        "2026-09-12 09:18:27",
        "仓单开立",
        "实名双因子签署完成，开立电解铜 120 吨、热轧卷板 450 吨、铝锭 60 吨。",
        CREATOR_WANG,
      ),
      change(
        "c-2",
        "2026-09-15 11:02:19",
        "仓单移库",
        "电解铜 40 吨由 A区-A-01-05 调整至 A区-A-01-04。",
        CREATOR_WANG,
        "YK20260915000033",
      ),
    ],
  },
  {
    id: "r-2092155678901234567",
    code: "CD2092155678901234567",
    owner: ENTERPRISE_QINGDAO,
    holder: ENTERPRISE_QINGDAO,
    warehouseName: WAREHOUSE_XINAN,
    thirdPartyRegistered: true,
    establishedAt: "2026-09-18 14:02:33",
    status: "NORMAL",
    creatorName: "张三",
    creatorOrg: ORG_SENYUN,
    creatorDisplay: CREATOR_ZHANG,
    createdAt: "2026-09-18 14:02:27",
    goodsGroups: [receiptRubber, receiptAluminumXinan],
    changes: [
      change(
        "c-1",
        "2026-09-18 14:02:33",
        "仓单开立",
        "实名双因子签署完成，开立天然橡胶 300 吨、铝锭 80 吨。",
        CREATOR_ZHANG,
      ),
    ],
  },
  {
    id: "r-2088001122334455667",
    code: "CD2088001122334455667",
    owner: ENTERPRISE_WUXI,
    holder: ENTERPRISE_SUZHOU_BANK,
    warehouseName: WAREHOUSE_HUADONG,
    thirdPartyRegistered: true,
    establishedAt: "2026-08-05 11:47:09",
    status: "FROZEN",
    creatorName: "王监管",
    creatorOrg: ORG_HUADONG,
    creatorDisplay: CREATOR_WANG,
    createdAt: "2026-08-05 11:47:03",
    goodsGroups: [receiptFrozenCopper],
    changes: [
      change(
        "c-1",
        "2026-08-05 11:47:09",
        "仓单开立",
        "实名双因子签署完成，开立电解铜 200 吨。",
        CREATOR_WANG,
      ),
      change(
        "c-2",
        "2026-08-12 10:18:45",
        "持有人变更",
        "质押审批通过，仓单持有人变更为 苏州银行股份有限公司，仓单转【冻结】。",
        CREATOR_ZHANG,
        "ZY20260812000108",
      ),
    ],
  },
  {
    id: "r-2093344556677889900",
    code: "CD2093344556677889900",
    owner: PERSON_YUANYUAN,
    holder: PERSON_YUANYUAN,
    warehouseName: WAREHOUSE_FRESH,
    thirdPartyRegistered: false,
    establishedAt: "2026-09-20 16:40:12",
    status: "NORMAL",
    creatorName: "lxy",
    creatorOrg: ORG_XIANGYU,
    creatorDisplay: CREATOR_LXY,
    createdAt: "2026-09-20 16:40:05",
    goodsGroups: [receiptPersonalWatermelon, receiptPersonalChili],
    changes: [
      change(
        "c-1",
        "2026-09-20 16:40:12",
        "仓单开立",
        "个人货主原原李实名签署完成，开立西瓜 8.5 公斤、辣椒 20 斤。",
        CREATOR_LXY,
      ),
    ],
  },
  {
    id: "r-2077009988776655443",
    code: "CD2077009988776655443",
    owner: ENTERPRISE_FUYANG,
    holder: ENTERPRISE_FUYANG,
    warehouseName: WAREHOUSE_HAIBAWANG,
    thirdPartyRegistered: false,
    establishedAt: "2026-06-20 08:15:44",
    status: "CANCELLED",
    creatorName: "lxy",
    creatorOrg: ORG_XIANGYU,
    creatorDisplay: CREATOR_LXY,
    createdAt: "2026-06-20 08:15:38",
    cancelledAt: "2026-07-01 10:08:22",
    goodsGroups: [receiptCancelledBeef],
    changes: [
      change(
        "c-1",
        "2026-06-20 08:15:44",
        "仓单开立",
        "初始实名开立生成数字仓单，包含冻货-牛肉 12 公斤。",
        CREATOR_LXY,
      ),
      change(
        "c-2",
        "2026-07-01 10:08:22",
        "仓单注销",
        "合同到期作废，经电子签章审批通过，执行仓单注销。",
        CREATOR_ZHANG,
        "CAN20260701000042",
      ),
    ],
  },
]

export function findWarehouseReceiptByIdOrCode(value?: string | null) {
  if (!value) return undefined
  return (
    warehouseReceiptSeed.find((item) => item.id === value) ??
    warehouseReceiptSeed.find((item) => item.code === value)
  )
}

export const RECEIPT_WAREHOUSE_OPTIONS = [
  WAREHOUSE_FRESH,
  WAREHOUSE_HAIBAWANG,
  WAREHOUSE_HUADONG,
  WAREHOUSE_XINAN,
]

export const RECEIPT_CREATOR_OPTIONS = [
  CREATOR_LXY,
  CREATOR_WANG,
  CREATOR_ZHANG,
]

/* ------------------------------------------------------------------ */
/* 移动端开立 · 可选在库库存（货主 + 仓库 + 未占用）                     */
/* ------------------------------------------------------------------ */

export type IssuanceCandidate = {
  id: string
  qrcodeId: string
  ownerType: "ENTERPRISE" | "PERSON"
  ownerId: string
  ownerName: string
  ownerIdentifier: string
  warehouseName: string
  houseName: string
  houseAudit: "审核" | "不审核"
  zoneName: string
  position: string
  category: string
  variety: string
  spec: string
  goodsName: string
  remainQuantity: number
  unit: string
  inboundAt: string
  otherInfo: string[]
}

function candidate(input: Omit<IssuanceCandidate, "goodsName">): IssuanceCandidate {
  return {
    ...input,
    goodsName: `${input.category}-${input.variety}-${input.spec}`,
  }
}

export const receiptIssuanceCandidates: IssuanceCandidate[] = [
  candidate({
    id: "iss-1",
    qrcodeId: "QR-FY-0919-001",
    ownerType: "ENTERPRISE",
    ownerId: "owner-fuyang",
    ownerName: "阜阳市大数据资产运营有限公司",
    ownerIdentifier: "91341202MA2U0JHJ3F",
    warehouseName: WAREHOUSE_FRESH,
    houseName: "水果库房2",
    houseAudit: "不审核",
    zoneName: "常见水果分区",
    position: "菊科",
    category: "水果",
    variety: "西瓜",
    spec: "超级-宁夏",
    remainQuantity: 9.0099,
    unit: "公斤",
    inboundAt: "2026-09-19 08:32:17",
    otherInfo: ["季节: 秋季"],
  }),
  candidate({
    id: "iss-2",
    qrcodeId: "QR-FY-0919-002",
    ownerType: "ENTERPRISE",
    ownerId: "owner-fuyang",
    ownerName: "阜阳市大数据资产运营有限公司",
    ownerIdentifier: "91341202MA2U0JHJ3F",
    warehouseName: WAREHOUSE_FRESH,
    houseName: "水果库房2",
    houseAudit: "不审核",
    zoneName: "常见水果分区",
    position: "黄冠",
    category: "水果",
    variety: "西瓜",
    spec: "超级-宁夏",
    remainQuantity: 12.5,
    unit: "公斤",
    inboundAt: "2026-09-19 09:12:40",
    otherInfo: ["无: --"],
  }),
  candidate({
    id: "iss-3",
    qrcodeId: "QR-FY-0919-003",
    ownerType: "ENTERPRISE",
    ownerId: "owner-fuyang",
    ownerName: "阜阳市大数据资产运营有限公司",
    ownerIdentifier: "91341202MA2U0JHJ3F",
    warehouseName: WAREHOUSE_FRESH,
    houseName: "蔬菜库房1",
    houseAudit: "审核",
    zoneName: "叶菜分区",
    position: "32刚刚发",
    category: "蔬菜",
    variety: "辣椒",
    spec: "云南-有机",
    remainQuantity: 30,
    unit: "斤",
    inboundAt: "2026-09-18 07:48:05",
    otherInfo: ["季节: 夏季"],
  }),
  candidate({
    id: "iss-4",
    qrcodeId: "QR-FY-0918-004",
    ownerType: "ENTERPRISE",
    ownerId: "owner-fuyang",
    ownerName: "阜阳市大数据资产运营有限公司",
    ownerIdentifier: "91341202MA2U0JHJ3F",
    warehouseName: WAREHOUSE_HAIBAWANG,
    houseName: "冻库",
    houseAudit: "不审核",
    zoneName: "冷冻1",
    position: "位置3",
    category: "冻货",
    variety: "鸡翅",
    spec: "四川-特级-2025",
    remainQuantity: 18.6,
    unit: "公斤",
    inboundAt: "2026-09-18 13:20:07",
    otherInfo: ["车辆: 川A·8K2X9"],
  }),
  candidate({
    id: "iss-5",
    qrcodeId: "QR-YL-0920-001",
    ownerType: "PERSON",
    ownerId: "owner-yuanyuan",
    ownerName: "原原李",
    ownerIdentifier: "185****7112",
    warehouseName: WAREHOUSE_FRESH,
    houseName: "水果库房2",
    houseAudit: "不审核",
    zoneName: "常见水果分区",
    position: "冰柜2",
    category: "水果",
    variety: "香蕉",
    spec: "进口-一级",
    remainQuantity: 6,
    unit: "箱",
    inboundAt: "2026-09-20 10:05:31",
    otherInfo: ["无: --"],
  }),
  candidate({
    id: "iss-6",
    qrcodeId: "QR-YL-0920-002",
    ownerType: "PERSON",
    ownerId: "owner-yuanyuan",
    ownerName: "原原李",
    ownerIdentifier: "185****7112",
    warehouseName: WAREHOUSE_FRESH,
    houseName: "蔬菜库房1",
    houseAudit: "审核",
    zoneName: "叶菜分区",
    position: "--",
    category: "蔬菜",
    variety: "辣椒",
    spec: "云南-有机",
    remainQuantity: 20,
    unit: "斤",
    inboundAt: "2026-09-20 11:30:15",
    otherInfo: ["无: --"],
  }),
  candidate({
    id: "iss-7",
    qrcodeId: "QR-WX-0912-001",
    ownerType: "ENTERPRISE",
    ownerId: "owner-wuxi",
    ownerName: "无锡锡通科技有限公司",
    ownerIdentifier: "91320214MA1X8K9L2P",
    warehouseName: WAREHOUSE_HUADONG,
    houseName: "一号库房",
    houseAudit: "审核",
    zoneName: "A区",
    position: "A-03-02",
    category: "金属",
    variety: "电解铜",
    spec: "阴极铜-A级",
    remainQuantity: 65,
    unit: "吨",
    inboundAt: "2026-09-12 08:20:44",
    otherInfo: ["产地: 江西", "批次: LME-2611"],
  }),
  candidate({
    id: "iss-8",
    qrcodeId: "QR-WX-0912-002",
    ownerType: "ENTERPRISE",
    ownerId: "owner-wuxi",
    ownerName: "无锡锡通科技有限公司",
    ownerIdentifier: "91320214MA1X8K9L2P",
    warehouseName: WAREHOUSE_HUADONG,
    houseName: "二号库房",
    houseAudit: "审核",
    zoneName: "B区",
    position: "B-04-06",
    category: "钢材",
    variety: "热轧卷板",
    spec: "Q235B-3.5*1500*C",
    remainQuantity: 200,
    unit: "吨",
    inboundAt: "2026-09-11 13:38:20",
    otherInfo: ["炉号: 26A-0912"],
  }),
  candidate({
    id: "iss-9",
    qrcodeId: "QR-QD-0918-001",
    ownerType: "ENTERPRISE",
    ownerId: "owner-qingdao",
    ownerName: "青岛远洋橡胶有限公司",
    ownerIdentifier: "91370200MA3N5R6T8W",
    warehouseName: WAREHOUSE_XINAN,
    houseName: "大宗库房",
    houseAudit: "不审核",
    zoneName: "三号分区",
    position: "垛位-03",
    category: "橡胶",
    variety: "天然橡胶",
    spec: "STR20",
    remainQuantity: 120,
    unit: "吨",
    inboundAt: "2026-09-17 15:42:09",
    otherInfo: ["产地: 泰国"],
  }),
]

/* ------------------------------------------------------------------ */
/* 移动端补货 · 同仓同货主未占用普通库存                                 */
/* ------------------------------------------------------------------ */

export type AvailableStockLot = {
  id: string
  ownerName: string
  warehouseName: string
  houseName: string
  zoneName: string
  position: string
  category: string
  variety: string
  spec: string
  goodsName: string
  availableQuantity: number
  unit: string
  inboundAt: string
  barcode: string
}

function available(input: Omit<AvailableStockLot, "goodsName">): AvailableStockLot {
  return {
    ...input,
    goodsName: `${input.category}-${input.variety}-${input.spec}`,
  }
}

export const receiptAvailableStock: AvailableStockLot[] = [
  available({
    id: "av-1",
    ownerName: "阜阳市大数据资产运营有限公司",
    warehouseName: WAREHOUSE_FRESH,
    houseName: "水果库房2",
    zoneName: "常见水果分区",
    position: "菊科",
    category: "水果",
    variety: "西瓜",
    spec: "超级-宁夏",
    availableQuantity: 6.2,
    unit: "公斤",
    inboundAt: "2026-09-18 08:15:20",
    barcode: "SN20260918004401",
  }),
  available({
    id: "av-2",
    ownerName: "阜阳市大数据资产运营有限公司",
    warehouseName: WAREHOUSE_FRESH,
    houseName: "蔬菜库房1",
    zoneName: "叶菜分区",
    position: "--",
    category: "蔬菜",
    variety: "辣椒",
    spec: "云南-有机",
    availableQuantity: 18,
    unit: "斤",
    inboundAt: "2026-09-18 09:40:11",
    barcode: "SN20260918004402",
  }),
  available({
    id: "av-3",
    ownerName: "阜阳市大数据资产运营有限公司",
    warehouseName: WAREHOUSE_FRESH,
    houseName: "水果库房2",
    zoneName: "常见水果分区",
    position: "冰柜2",
    category: "水果",
    variety: "香蕉",
    spec: "进口-一级",
    availableQuantity: 4,
    unit: "箱",
    inboundAt: "2026-09-19 10:05:31",
    barcode: "SN20260919004455",
  }),
]

/* ------------------------------------------------------------------ */
/* 移动端移库 · 同仓目标库房/分区/垛位                                  */
/* ------------------------------------------------------------------ */

export type ReceiptWarehouseTopology = {
  warehouseName: string
  houses: Array<{
    name: string
    audit: "审核" | "不审核"
    zones: Array<{ name: string; positions: string[] }>
  }>
}

export const RECEIPT_WAREHOUSE_TOPOLOGY: ReceiptWarehouseTopology[] = [
  {
    warehouseName: WAREHOUSE_FRESH,
    houses: [
      {
        name: "水果库房2",
        audit: "不审核",
        zones: [
          { name: "常见水果分区", positions: ["菊科", "黄冠", "冰柜1", "冰柜2"] },
          { name: "精品水果分区", positions: ["A-01", "A-02"] },
        ],
      },
      {
        name: "蔬菜库房1",
        audit: "审核",
        zones: [{ name: "叶菜分区", positions: ["32刚刚发", "B-03"] }],
      },
    ],
  },
  {
    warehouseName: WAREHOUSE_HAIBAWANG,
    houses: [
      {
        name: "冻库",
        audit: "不审核",
        zones: [
          { name: "冷冻1", positions: ["位置1", "位置2"] },
          { name: "冷冻2", positions: ["位置3", "位置4"] },
        ],
      },
    ],
  },
  {
    warehouseName: WAREHOUSE_HUADONG,
    houses: [
      {
        name: "一号库房",
        audit: "审核",
        zones: [
          { name: "A区", positions: ["A-01-03", "A-01-04", "A-02-01", "A-03-02"] },
          { name: "C区", positions: ["C-02-05"] },
        ],
      },
      {
        name: "二号库房",
        audit: "审核",
        zones: [{ name: "B区", positions: ["B-03-11", "B-04-06"] }],
      },
    ],
  },
  {
    warehouseName: WAREHOUSE_XINAN,
    houses: [
      {
        name: "大宗库房",
        audit: "不审核",
        zones: [
          { name: "一号分区", positions: ["垛位-01", "垛位-02"] },
          { name: "二号分区", positions: ["垛位-07"] },
          { name: "三号分区", positions: ["垛位-03"] },
        ],
      },
    ],
  },
]

export function getWarehouseTopology(warehouseName: string) {
  return (
    RECEIPT_WAREHOUSE_TOPOLOGY.find(
      (item) => item.warehouseName === warehouseName,
    ) ?? RECEIPT_WAREHOUSE_TOPOLOGY[0]
  )
}
