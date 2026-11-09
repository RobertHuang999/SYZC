import type { DynamicCollectAttr, InputGoodsLocationDetail, OwnerType, ProcessingType } from "../domain/types"

/** 货主主体选项 */
export interface OwnerOption {
  id: string
  name: string
  type: OwnerType
  identity: string
  idCardNo?: string
  phone?: string
}

export const KNOWN_OWNERS_MOCK: OwnerOption[] = [
  {
    id: "OWN-01",
    name: "四川万向金属材料有限公司",
    type: "ENTERPRISE",
    identity: "91510100MA6XXXXX01",
    phone: "028-85998801",
  },
  {
    id: "OWN-02",
    name: "上海中储有色金属供应链有限公司",
    type: "ENTERPRISE",
    identity: "91310115MA1XXXXX99",
    phone: "021-68997722",
  },
  {
    id: "OWN-03",
    name: "山东鲁泰铝业有限公司",
    type: "ENTERPRISE",
    identity: "91370300MA3XXXXX88",
    phone: "0533-2899011",
  },
  {
    id: "OWN-04",
    name: "张卫东",
    type: "PERSONAL",
    identity: "138****8899",
    idCardNo: "420101********8682",
    phone: "13800138899",
  },
  {
    id: "OWN-05",
    name: "李成",
    type: "PERSONAL",
    identity: "135****6611",
    idCardNo: "310104********1519",
    phone: "13501986611",
  },
]

/** 候选关联单号（仅限正常在押单据，不含已开仓单货物） */
export interface AssociatedOrderOption {
  orderId: string
  ownerId: string
  processingType: ProcessingType
  goodsSummary: string
  warehouseId: string
  warehouseName: string
}

export const KNOWN_ASSOCIATED_ORDERS_MOCK: AssociatedOrderOption[] = [
  {
    orderId: "ZY-20260715-0089",
    ownerId: "OWN-01",
    processingType: "PLEDGE",
    goodsSummary: "热轧卷板(Q235B) 175.5吨",
    warehouseId: "WH-BS01",
    warehouseName: "宝山大宗金属1号仓",
  },
  {
    orderId: "DY-20260801-0012",
    ownerId: "OWN-02",
    processingType: "MORTGAGE",
    goodsSummary: "阴极电解铜 60.0吨",
    warehouseId: "WH-QD01",
    warehouseName: "青岛前湾港保税仓",
  },
  {
    orderId: "JG-20260725-0033",
    ownerId: "OWN-03",
    processingType: "REGULATORY_SERVICE",
    goodsSummary: "重熔用铝锭 150.0吨",
    warehouseId: "WH-QD01",
    warehouseName: "青岛前湾港保税仓",
  },
]

/** 可用库存货物明细候选（用于添加投入货品） */
export interface CandidateStockItem extends InputGoodsLocationDetail {
  ownerId: string
  goodsId: string
  goodsName: string
  specModel: string
  processingType: ProcessingType
  associatedOrderId?: string
  hasReceipt?: boolean // 是否已开具数字仓单
}

export const CANDIDATE_STOCKS_MOCK: CandidateStockItem[] = [
  {
    id: "CAND-01",
    ownerId: "OWN-01",
    goodsId: "GD-RZ-01",
    goodsName: "金属-钢材-热轧卷板(Q235B)",
    specModel: "Q235B 5.75*1500*C",
    warehouseId: "WH-BS01",
    warehouseName: "宝山大宗金属1号仓",
    roomZone: "宝山大宗金属1号仓-A库房-重型钢卷区",
    specificLocation: "A-01-08",
    inboundTime: "2026-06-10 09:30:00",
    otherInfo: "炉批号: 26A8901; 质量等级: 一级品",
    barcode: "TM-20260610-RZ01",
    availableAmount: 85.5,
    planAmount: 0,
    unit: "吨",
    processingType: "PLEDGE",
    associatedOrderId: "ZY-20260715-0089",
    hasReceipt: false,
  },
  {
    id: "CAND-02",
    ownerId: "OWN-01",
    goodsId: "GD-RZ-01",
    goodsName: "金属-钢材-热轧卷板(Q235B)",
    specModel: "Q235B 5.75*1500*C",
    warehouseId: "WH-BS01",
    warehouseName: "宝山大宗金属1号仓",
    roomZone: "宝山大宗金属1号仓-A库房-重型钢卷区",
    specificLocation: "A-01-09",
    inboundTime: "2026-06-10 10:15:00",
    otherInfo: "炉批号: 26A8902; 质量等级: 一级品",
    barcode: "TM-20260610-RZ02",
    availableAmount: 90.0,
    planAmount: 0,
    unit: "吨",
    processingType: "PLEDGE",
    associatedOrderId: "ZY-20260715-0089",
    hasReceipt: false,
  },
  {
    id: "CAND-03",
    ownerId: "OWN-01",
    goodsId: "GD-RZ-02",
    goodsName: "金属-钢材-花纹热轧卷板(Q235B)",
    specModel: "Q235B 4.0*1250*C",
    warehouseId: "WH-BS01",
    warehouseName: "宝山大宗金属1号仓",
    roomZone: "宝山大宗金属1号仓-A库房-花纹板区",
    specificLocation: "A-02-01",
    inboundTime: "2026-06-12 11:00:00",
    otherInfo: "炉批号: 26A9901",
    barcode: "TM-20260612-RZ03",
    availableAmount: 45.0,
    planAmount: 0,
    unit: "吨",
    processingType: "INVENTORY",
    hasReceipt: false,
  },
  {
    id: "CAND-04",
    ownerId: "OWN-02",
    goodsId: "GD-CU-01",
    goodsName: "有色金属-铜-高纯阴极电解铜(Cu-CATH-1)",
    specModel: "Cu ≥ 99.9935%",
    warehouseId: "WH-QD01",
    warehouseName: "青岛前湾港保税仓",
    roomZone: "青岛前湾港保税仓-1号恒温库-有色贵金属区",
    specificLocation: "W1-05-12",
    inboundTime: "2026-07-02 14:20:00",
    otherInfo: "产地: 江铜; 捆号: JT26-08",
    barcode: "TM-20260702-CU01",
    availableAmount: 60.0,
    planAmount: 0,
    unit: "吨",
    processingType: "MORTGAGE",
    associatedOrderId: "DY-20260801-0012",
    hasReceipt: false,
  },
  {
    id: "CAND-05",
    ownerId: "OWN-04",
    goodsId: "GD-NR-01",
    goodsName: "生鲜冷冻-牛肉-整牛原肉(进口)",
    specModel: "A级四分体 散装",
    warehouseId: "WH-HBW",
    warehouseName: "海霸王大宗冷链仓",
    roomZone: "海霸王大宗冷链仓-深冷2号库-进口肉类区",
    specificLocation: "C-02-15",
    inboundTime: "2026-07-20 11:00:00",
    otherInfo: "检验检疫证明: JQ20260720-99",
    barcode: "TM-20260720-NR01",
    availableAmount: 12000,
    planAmount: 0,
    unit: "千克",
    processingType: "INVENTORY",
    hasReceipt: false,
  },
  {
    id: "CAND-06",
    ownerId: "OWN-01",
    goodsId: "GD-LOCK-01",
    goodsName: "金属-钢材-热轧卷板(已开仓单)",
    specModel: "Q235B 5.75*1500*C",
    warehouseId: "WH-BS01",
    warehouseName: "宝山大宗金属1号仓",
    roomZone: "宝山大宗金属1号仓-A库房-质押监管区",
    specificLocation: "A-09-01",
    inboundTime: "2026-06-01 10:00:00",
    otherInfo: "数字仓单已签发: CD-202606-001",
    barcode: "TM-20260601-CD01",
    availableAmount: 50.0,
    planAmount: 0,
    unit: "吨",
    processingType: "PLEDGE",
    associatedOrderId: "ZY-20260715-0089",
    hasReceipt: true, // 已开数字仓单，将被强行阻断选择 (R04)
  },
]

/** 候选产出货品主档（带参考单价和品类动态采集属性模板） */
export interface CandidateOutputProduct {
  goodsId: string
  goodsName: string
  specModel: string
  unit: string
  price: number | null
  collectAttrTemplates: DynamicCollectAttr[]
}

export const CANDIDATE_OUTPUT_PRODUCTS_MOCK: CandidateOutputProduct[] = [
  {
    goodsId: "OUT-P1",
    goodsName: "金属-钢材-开平热轧钢板(Q235B)",
    specModel: "Q235B 5.75*1500*6000",
    unit: "吨",
    price: 3850.0,
    collectAttrTemplates: [
      { key: "packType", label: "包装形式", type: "select", options: ["裸装打捆", "防锈纸精包装", "托盘包装"], required: true },
      { key: "heatBatchNo", label: "熔炼炉号", type: "text", required: true },
      { key: "tensileStrength", label: "抗拉强度(MPa)", type: "number", unit: "MPa" },
    ],
  },
  {
    goodsId: "OUT-P2",
    goodsName: "金属-钢材-冷硬带钢卷(SPCC)",
    specModel: "SPCC 1.2*500*C",
    unit: "吨",
    price: 4320.0,
    collectAttrTemplates: [
      { key: "packType", label: "包装形式", type: "select", options: ["防锈油纸包装", "铁皮精包"], required: true },
      { key: "edgeStatus", label: "边缘状态", type: "select", options: ["切边", "毛边"] },
    ],
  },
  {
    goodsId: "OUT-P3",
    goodsName: "有色金属-铜材-高导电电工铜排(T2)",
    specModel: "T2 10*100*4000",
    unit: "吨",
    price: 74500.0,
    collectAttrTemplates: [
      { key: "conductivity", label: "导电率(%IACS)", type: "number", unit: "%", required: true },
      { key: "surfaceFinish", label: "表面光洁度", type: "select", options: ["光亮面", "普通面"] },
    ],
  },
  {
    goodsId: "OUT-P4",
    goodsName: "有色金属-铝材-工业铝合金建筑型材(6063-T5)",
    specModel: "6063-T5 氧化阳极银白",
    unit: "吨",
    price: 21500.0,
    collectAttrTemplates: [
      { key: "filmThickness", label: "膜厚级别", type: "select", options: ["AA10", "AA15", "AA20"], required: true },
      { key: "hardness", label: "韦氏硬度(HW)", type: "number", unit: "HW" },
    ],
  },
  {
    goodsId: "OUT-P5",
    goodsName: "生鲜冷冻-牛肉-精选牛腩块",
    specModel: "真空袋装 2.5kg/袋",
    unit: "千克",
    price: 58.0,
    collectAttrTemplates: [
      { key: "packDate", label: "包装日期", type: "date", required: true },
      { key: "shelfLife", label: "保质期(月)", type: "number", unit: "月" },
    ],
  },
  {
    goodsId: "OUT-P6",
    goodsName: "金属-钢材-定制异型钢构件(待定价)",
    specModel: "定制焊接异型件",
    unit: "吨",
    price: null, // 未定价，用于验证缺价警示
    collectAttrTemplates: [
      { key: "weldGrade", label: "焊缝探伤等级", type: "select", options: ["一级焊缝", "二级焊缝", "普通焊缝"] },
    ],
  },
]

