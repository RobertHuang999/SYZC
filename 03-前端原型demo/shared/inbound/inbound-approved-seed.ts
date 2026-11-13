/**
 * PC 入库记录台账 + H5 入库管理列表 + 详情 CANONICAL 共用 Mock 种子（单真源）
 */

import { formatInboundGoodsSummary } from "./inbound-list-format"
import { aggregateQuantitiesByUnit, formatQuantitiesByUnit } from "./inbound-goods-display"

export type SeedGoodsLineItem = {
  name: string
  amount: number
  unit?: string
}

export type InboundApprovedSeed = {
  pcId: string
  mobileId: string
  orderNo: string
  ownerName: string
  ownerType: "1" | "2"
  ownerIdentifierMasked: string
  inboundType: string
  inboundDate: string
  warehouseName: string
  houseName?: string
  relatedOrderNo?: string | null
  goodsNames: string[]
  goodsLineItems?: SeedGoodsLineItem[]
  inboundQuantity: number
  unit: string
  creatorDisplay: string
  createdAt: string
  remark?: string | null
  hasUnprintedQrCode?: boolean
  photoUrls?: string[]
}

/**
 * 入库记录台账：12 种入库类型各一条，不重复凑数。
 * 额外演示叠在对应类型上：6.4 单据打印、混单位、个人货主、暂存转正。
 */
export const INBOUND_APPROVED_SEEDS: InboundApprovedSeed[] = [
  {
    pcId: "inbound-64-benchmark",
    mobileId: "m-inbound-64-benchmark",
    orderNo: "RK202611120005541",
    ownerName: "无锡江南金属材料制造有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91320200MA2ABC8888",
    inboundType: "普通入库",
    inboundDate: "2026-11-12 09:15:00",
    warehouseName: "江苏无锡锡山保税监管仓",
    houseName: "1号有色金属标准库, 2号板卷堆场",
    relatedOrderNo: null,
    goodsNames: [
      "有色金属-电解铜-Cu-CATH-1 99.99%",
      "有色金属-铝锭-Al99.70 AOO",
      "黑色金属-热轧卷-Q235B 9.5*1500*C",
    ],
    goodsLineItems: [
      { name: "有色金属-电解铜-Cu-CATH-1 99.99%", amount: 65.432, unit: "吨" },
      { name: "有色金属-铝锭-Al99.70 AOO", amount: 110.0, unit: "吨" },
      { name: "黑色金属-热轧卷-Q235B 9.5*1500*C", amount: 45.12, unit: "吨" },
    ],
    inboundQuantity: 220.552,
    unit: "吨",
    creatorDisplay: "王五(江苏无锡锡山保税监管仓)",
    createdAt: "2026-11-12 09:15:00",
    remark: "6.4 版本入库单据多介质导出与打印（A4 / A5 / 针式连续纸）标杆验收单据。",
  },
  {
    pcId: "inbound-mixed",
    mobileId: "m-inbound-mixed",
    orderNo: "2108777000011222333",
    ownerName: "川联多元供应链有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510100MA6A8Mixed",
    inboundType: "监管服务入库",
    inboundDate: "2026-06-01 11:20:00",
    warehouseName: "海霸王仓库",
    houseName: "1号冷冻库, 水果监管库, 有色金属库",
    relatedOrderNo: "JG-2026-0601-008",
    goodsNames: [
      "冻货-牛肉-36个月",
      "水果-苹果-新疆红富士-特级",
      "有色金属-电解铜-1号标准",
    ],
    goodsLineItems: [
      { name: "冻货-牛肉-36个月", amount: 182.33, unit: "公斤" },
      { name: "水果-苹果-新疆红富士-特级", amount: 8500, unit: "公斤" },
      { name: "有色金属-电解铜-1号标准", amount: 31.08, unit: "吨" },
    ],
    inboundQuantity: 31.08,
    unit: "吨",
    creatorDisplay: "王监管(华东仓储运营中心)",
    createdAt: "2026-06-01 11:22:18",
    remark: "同一入库单跨冻货、水果、有色金属三类监管货品；计量单位按货品各行取值，公斤与吨不得混加。",
  },
  {
    pcId: "inbound-banana",
    mobileId: "m-inbound-2",
    orderNo: "2105200919292059650",
    ownerName: "梨花",
    ownerType: "1",
    ownerIdentifierMasked: "188****2345",
    inboundType: "抵押入库",
    inboundDate: "2026-09-30 15:38:54",
    warehouseName: "生鲜仓库-水果库房审核",
    houseName: "水果库房审核",
    relatedOrderNo: "2105187903456583681",
    goodsNames: ["水果-香蕉-海南"],
    goodsLineItems: [{ name: "水果-香蕉-海南", amount: 1, unit: "吨" }],
    inboundQuantity: 1,
    unit: "吨",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-09-30 15:39:47",
    hasUnprintedQrCode: true,
    remark: "——",
    photoUrls: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80",
    ],
  },
  {
    pcId: "inbound-staging-reg6",
    mobileId: "m-inbound-staging-reg6",
    orderNo: "2026101015300000123",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510100MA6AHXDemo",
    inboundType: "质押入库",
    inboundDate: "2026-10-14 07:50:00",
    warehouseName: "青白江大宗商品监管1号仓",
    houseName: "2号高位重型库房",
    relatedOrderNo: "ZY20260901-0012",
    goodsNames: ["有色-电解铜-标准阴极铜", "黑色金属-热轧卷板-Q235B"],
    goodsLineItems: [
      { name: "有色-电解铜-标准阴极铜", amount: 300, unit: "吨" },
      { name: "黑色金属-热轧卷板-Q235B", amount: 200, unit: "吨" },
    ],
    inboundQuantity: 500,
    unit: "吨",
    creatorDisplay: "仓库主管-赵六(青白江监管仓)",
    createdAt: "2026-10-14 08:05:00",
    remark: "由暂存 REG-20261014-00006 转正（演示闭环）。",
  },
  {
    pcId: "inbound-7",
    mobileId: "m-inbound-7",
    orderNo: "2109823450912384911",
    ownerName: "上海宝钢大宗贸易发展有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91310113MA1GN0012A",
    inboundType: "仓单入库",
    inboundDate: "2026-05-18 11:05:40",
    warehouseName: "生鲜仓库",
    houseName: "钢材特种堆场",
    relatedOrderNo: "CD-SH-20260518-01",
    goodsNames: ["钢材-热轧卷板-Q235B-3.0mm"],
    inboundQuantity: 850.0,
    unit: "吨",
    creatorDisplay: "王监管(华东仓储运营中心)",
    createdAt: "2026-05-18 11:12:00",
  },
  {
    pcId: "inbound-10",
    mobileId: "m-inbound-10",
    orderNo: "2109823450912384914",
    ownerName: "周强",
    ownerType: "1",
    ownerIdentifierMasked: "139****5678",
    inboundType: "退货入库",
    inboundDate: "2026-05-12 16:30:10",
    warehouseName: "海霸王仓库",
    houseName: "1号冷冻库",
    relatedOrderNo: "20617289020070320130",
    goodsNames: ["冻货-牛肉-36个月"],
    inboundQuantity: 15.0,
    unit: "吨",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-05-12 16:35:45",
  },
  {
    pcId: "inbound-11",
    mobileId: "m-inbound-11",
    orderNo: "2109823450912384915",
    ownerName: "四川川投能源供应链管理有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510100MA6D999900",
    inboundType: "移库入库",
    inboundDate: "2026-05-10 10:00:00",
    warehouseName: "海霸王仓库",
    houseName: "2号常温库",
    relatedOrderNo: "YK202605090001",
    goodsNames: ["有色金属-铝锭-ADC12"],
    inboundQuantity: 250.0,
    unit: "吨",
    creatorDisplay: "张三(森云监管服务有限公司)",
    createdAt: "2026-05-10 10:05:12",
  },
  {
    pcId: "inbound-12",
    mobileId: "m-inbound-12",
    orderNo: "2109823450912384916",
    ownerName: "重庆渝运国际物流有限责任公司",
    ownerType: "2",
    ownerIdentifierMasked: "91500100MA5U667788",
    inboundType: "转让入库",
    inboundDate: "2026-05-08 15:20:00",
    warehouseName: "生鲜仓库",
    houseName: "特种监管库",
    relatedOrderNo: "ZR202605080005",
    goodsNames: ["钢材-冷轧卷板-SPCC-1.0mm"],
    inboundQuantity: 180.0,
    unit: "吨",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-05-08 15:24:50",
  },
  {
    pcId: "inbound-13",
    mobileId: "m-inbound-13",
    orderNo: "2109823450912384917",
    ownerName: "成都市兴融实业发展有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510100MA6K112233",
    inboundType: "存货加工入库",
    inboundDate: "2026-05-05 13:40:20",
    warehouseName: "海霸王仓库",
    houseName: "加工车间成品库",
    relatedOrderNo: "PRO20260504001",
    goodsNames: ["钢材-热轧卷板-Q235B-3.0mm"],
    inboundQuantity: 195.5,
    unit: "吨",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-05-05 13:45:00",
  },
  {
    pcId: "inbound-14",
    mobileId: "m-inbound-14",
    orderNo: "2109823450912384918",
    ownerName: "四川金广特钢贸易有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510100MA6778899Z",
    inboundType: "质押加工入库",
    inboundDate: "2026-05-03 11:10:00",
    warehouseName: "干粮仓库",
    houseName: "特种金属仓",
    relatedOrderNo: "PRO20260502008",
    goodsNames: ["有色金属-电解铜-1号标准"],
    inboundQuantity: 98.2,
    unit: "吨",
    creatorDisplay: "黄k(卡皮银行)",
    createdAt: "2026-05-03 11:15:30",
  },
  {
    pcId: "inbound-15",
    mobileId: "m-inbound-15",
    orderNo: "2109823450912384919",
    ownerName: "绵阳宏达金属冶炼有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510700MA6889900B",
    inboundType: "抵押加工入库",
    inboundDate: "2026-04-29 14:00:00",
    warehouseName: "生鲜仓库",
    houseName: "金属加工库",
    relatedOrderNo: "PRO20260428012",
    goodsNames: ["有色金属-铝锭-ADC12"],
    inboundQuantity: 145.0,
    unit: "吨",
    creatorDisplay: "张三(森云监管服务有限公司)",
    createdAt: "2026-04-29 14:06:18",
  },
  {
    pcId: "inbound-23",
    mobileId: "m-inbound-23",
    orderNo: "2109823450912384927",
    ownerName: "江苏苏储监管服务有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91320100MA27JG0008",
    inboundType: "监管服务加工入库",
    inboundDate: "2026-04-27 09:40:00",
    warehouseName: "海霸王仓库",
    houseName: "加工车间成品库",
    relatedOrderNo: "JG-PRO-20260426-03",
    goodsNames: ["钢材-冷轧卷板-SPCC-1.0mm"],
    inboundQuantity: 76.4,
    unit: "吨",
    creatorDisplay: "王监管(华东仓储运营中心)",
    createdAt: "2026-04-27 09:46:12",
  },
]

export function approvedSeedToListRow(seed: InboundApprovedSeed) {
  return {
    id: seed.pcId,
    orderNo: seed.orderNo,
    ownerName: seed.ownerName,
    ownerType: seed.ownerType,
    ownerIdentifierMasked: seed.ownerIdentifierMasked,
    inboundType: seed.inboundType,
    inboundDate: seed.inboundDate,
    warehouseName: seed.warehouseName,
    houseNames: seed.houseName,
    relatedOrderNo: seed.relatedOrderNo ?? null,
    goodsNames: seed.goodsNames,
    goodsLineItems: seed.goodsLineItems,
    inboundQuantity: seed.inboundQuantity,
    unit: seed.unit,
    creatorDisplay: seed.creatorDisplay,
    createdAt: seed.createdAt,
    checkStatus: 2 as const,
    remark: seed.remark ?? null,
  }
}

export type MobileInboundSeedView = {
  id: string
  orderNo: string
  ownerName: string
  ownerIdentifierMasked: string
  inboundType: string
  inboundDate: string
  warehouseName: string
  goodsSummary: string
  goodsNames: string[]
  goodsKindCount?: number
  quantityLabel: string
  unit: string
  flowStatus: "APPROVED"
  creatorDisplay: string
  createdAt: string
  hasUnprintedQrCode?: boolean
  relatedOrderNo?: string
  remarks?: string
  pcDetailId: string
  photoUrls?: string[]
}

export function approvedSeedToMobileView(seed: InboundApprovedSeed): MobileInboundSeedView {
  const lineItems =
    seed.goodsLineItems && seed.goodsLineItems.length > 0
      ? seed.goodsLineItems
      : [{ amount: seed.inboundQuantity, unit: seed.unit }]
  const unitGroups = aggregateQuantitiesByUnit(lineItems)
  const mixedUnits = unitGroups.length > 1
  return {
    id: seed.mobileId,
    orderNo: seed.orderNo,
    ownerName: seed.ownerName,
    ownerIdentifierMasked: seed.ownerIdentifierMasked,
    inboundType: seed.inboundType,
    inboundDate: seed.inboundDate,
    warehouseName: seed.warehouseName,
    goodsSummary: formatInboundGoodsSummary(seed.goodsNames),
    goodsNames: [...seed.goodsNames],
    goodsKindCount: seed.goodsNames.length > 1 ? seed.goodsNames.length : undefined,
    quantityLabel: mixedUnits ? formatQuantitiesByUnit(lineItems) : String(seed.inboundQuantity),
    unit: mixedUnits ? "" : seed.unit,
    flowStatus: "APPROVED",
    creatorDisplay: seed.creatorDisplay,
    createdAt: seed.createdAt,
    hasUnprintedQrCode: seed.hasUnprintedQrCode,
    relatedOrderNo: seed.relatedOrderNo ?? undefined,
    remarks: seed.remark ?? "--",
    pcDetailId: seed.pcId,
    photoUrls: seed.photoUrls,
  }
}
