/**
 * PC 入库记录台账 + H5 入库管理列表 + 详情 CANONICAL 共用 Mock 种子（单真源）
 */

import { formatInboundGoodsSummary } from "./inbound-list-format"

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

/** 与 PC/H5 原型首屏演示顺序一致：多货品在前，单货品在后 */
export const INBOUND_APPROVED_SEEDS: InboundApprovedSeed[] = [
  {
    pcId: "inbound-2",
    mobileId: "m-inbound-multi",
    orderNo: "2108438504322834432",
    ownerName: "成都锦城冷链物流有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510104MA62XXXXX",
    inboundType: "普通入库",
    inboundDate: "2026-06-03 09:48:22",
    warehouseName: "海霸王仓库",
    houseName: "1号冷冻库, 3号冷藏库",
    relatedOrderNo: null,
    goodsNames: [
      "冻货-鸡翅-四川-特级-2025",
      "冻货-牛肉-36个月",
      "冻货-鸡腿-四川",
    ],
    goodsLineItems: [
      { name: "冻货-鸡翅-四川-特级-2025", amount: 520.5, unit: "吨" },
      { name: "冻货-牛肉-36个月", amount: 580, unit: "吨" },
      { name: "冻货-鸡腿-四川", amount: 180, unit: "吨" },
    ],
    inboundQuantity: 1280.5,
    unit: "吨",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-06-03 09:49:01",
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
      { name: "冻货-牛肉-36个月", amount: 36.5, unit: "吨" },
      { name: "水果-苹果-新疆红富士-特级", amount: 18, unit: "吨" },
      { name: "有色金属-电解铜-1号标准", amount: 31.08, unit: "吨" },
    ],
    inboundQuantity: 85.58,
    unit: "吨",
    creatorDisplay: "王监管(华东仓储运营中心)",
    createdAt: "2026-06-01 11:22:18",
    remark: "同一入库单跨冻货、水果、有色金属三类监管货品。",
  },
  {
    pcId: "inbound-19",
    mobileId: "m-inbound-4",
    orderNo: "2109823450912384923",
    ownerName: "德阳市利达金属型材有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510600MA6223344E",
    inboundType: "质押入库",
    inboundDate: "2026-04-18 15:45:00",
    warehouseName: "海霸王仓库",
    houseName: "特种监管库",
    relatedOrderNo: "ZY202604180022",
    goodsNames: ["钢材-热轧卷板-Q235B-3.0mm", "钢材-冷轧卷板-SPCC-1.0mm"],
    goodsLineItems: [
      { name: "钢材-热轧卷板-Q235B-3.0mm", amount: 420, unit: "吨" },
      { name: "钢材-冷轧卷板-SPCC-1.0mm", amount: 220, unit: "吨" },
    ],
    inboundQuantity: 640,
    unit: "吨",
    creatorDisplay: "黄k(卡皮银行)",
    createdAt: "2026-04-18 15:50:00",
    remark: "热轧+冷轧双规格同单质押入库。",
  },
  {
    pcId: "inbound-1",
    mobileId: "m-inbound-1",
    orderNo: "2108438504322834433",
    ownerName: "乐富",
    ownerType: "1",
    ownerIdentifierMasked: "187****8900",
    inboundType: "普通入库",
    inboundDate: "2026-06-03 10:12:08",
    warehouseName: "海霸王仓库",
    houseName: "1号冷冻库",
    relatedOrderNo: null,
    goodsNames: ["冻货-鸡翅-四川-特级-2025"],
    goodsLineItems: [{ name: "冻货-鸡翅-四川-特级-2025", amount: 24.5, unit: "吨" }],
    inboundQuantity: 24.5,
    unit: "吨",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-06-03 10:12:36",
    hasUnprintedQrCode: true,
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
    pcId: "inbound-3",
    mobileId: "m-inbound-3",
    orderNo: "2059897000077811713",
    ownerName: "李爱",
    ownerType: "1",
    ownerIdentifierMasked: "133****0027",
    inboundType: "普通入库",
    inboundDate: "2026-05-28 15:15:39",
    warehouseName: "海霸王仓库-冻库1审核",
    houseName: "冻库1审核",
    relatedOrderNo: null,
    goodsNames: ["冻货-牛肉-36个月"],
    goodsLineItems: [{ name: "冻货-牛肉-36个月", amount: 182.33, unit: "公斤" }],
    inboundQuantity: 182.33,
    unit: "公斤",
    creatorDisplay: "lxy(四川享宇科技有限公司)",
    createdAt: "2026-05-28 15:18:12",
  },
  {
    pcId: "inbound-5-single",
    mobileId: "m-inbound-5",
    orderNo: "2108399988776655443",
    ownerName: "成都锦城冷链",
    ownerType: "2",
    ownerIdentifierMasked: "91510104MA62XXXXX",
    inboundType: "监管服务入库",
    inboundDate: "2026-05-18 14:02:11",
    warehouseName: "生鲜仓库",
    houseName: "2号保鲜库",
    relatedOrderNo: null,
    goodsNames: ["冻货-鸡腿-四川"],
    goodsLineItems: [{ name: "冻货-鸡腿-四川", amount: 860, unit: "吨" }],
    inboundQuantity: 860,
    unit: "吨",
    creatorDisplay: "张三(森云监管服务有限公司)",
    createdAt: "2026-05-18 14:03:00",
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
    quantityLabel: String(seed.inboundQuantity),
    unit: seed.unit,
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
