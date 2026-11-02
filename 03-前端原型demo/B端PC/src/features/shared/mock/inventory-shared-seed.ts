/**
 * 仓储四大库存查询模块共享 Mock 数据中心
 * （存货管理、理货堆放、库存明细、库存流水）
 *
 * 遵循大宗商品业务真实感与数据闭环规范：
 * 阴极铜、A00铝锭、热轧卷板、螺纹钢、冷链生鲜及未定价特种合金。
 */

export interface WarehouseItem {
  id: string
  name: string
  type: string
  manager: string
  address: string
  phone: string
  province: string
  city: string
}

export interface GoodsSkuItem {
  id: string
  skuId: string
  category: string // 大类
  variety: string // 品类
  specification: string // 规格全称
  measureUnit: string // 计量单位
  unitPrice: number | null // 单价（万元/单位，null 表示未定价商品）
  pricingNote?: string
}

export interface CargoOwnerItem {
  id: string
  name: string
  ownerType: "1" | "2" // 1: 个人, 2: 企业
  identifier: string // 社会信用代码或身份证/手机号
  identifierMasked: string // 脱敏标识
  contactPhone: string // 联系人电话
  contactPhoneMasked: string // 脱敏电话
  contactPerson: string
}

export interface StackingLocation {
  warehouseId: string
  warehouseName: string
  houseName: string
  houseAuditStatus?: "normal" | "auditing"
  partitionName: string
  locationCode: string // 垛位/货位号，如 "A-01垛位" 或 "虚拟未分配垛位"
  isVirtual?: boolean
}

export interface InventoryDetailRecord {
  id: string
  barcode: string // 存货条码，如 "KC-QBJ-20261010-001"
  warehouseId: string
  warehouseName: string
  houseName: string
  houseAuditStatus?: "normal" | "auditing"
  partitionName: string
  locationCode: string
  isVirtual?: boolean
  ownerId: string
  ownerName: string
  ownerType: "1" | "2"
  ownerIdentifierMasked: string
  ownerPhoneMasked: string
  goodsId: string
  category: string
  variety: string
  specification: string
  unit: string
  unitPrice: number | null
  initialQuantity: number // 期初堆放数量
  availableQuantity: number // 当前可用数量
  frozenQuantity: number // 当前冻结数量
  totalQuantity: number // 总数量 = availableQuantity + frozenQuantity
  totalPrice: number | null // 货值 = totalQuantity * unitPrice
  inboundOrderNo: string // 源头入库单号
  inboundDate: string // 入库时间
  lastMoveDate: string // 最后动碰时间
  status: "NORMAL" | "FROZEN" | "EMPTY" // NORMAL: 正常在库, FROZEN: 审批冻结中, EMPTY: 已出库
  freezeReason?: string // 冻结原因：如 "出库审批中(单号:20617289020070320130)"、"质押申请中" 等
  freezeOrderNo?: string
  rfidTag?: string
}

export interface TallyStackingSubItem {
  subId: string
  subCode: string // 子码存货条码
  houseName: string
  houseAuditStatus?: "normal" | "auditing"
  partitionName: string
  locationCode: string
  isVirtual?: boolean
  initialQuantity: number
  availableQuantity: number
  frozenQuantity: number
  totalQuantity: number
  unit: string
  statusText: string
}

export interface TallyStackingMainItem {
  id: string
  mainCode: string // 主码
  inboundOrderNo: string // 入库单号
  warehouseId: string
  warehouseName: string
  ownerId: string
  ownerName: string
  ownerIdentifierMasked: string
  goodsId: string
  category: string
  variety: string
  specification: string
  unit: string
  unitPrice: number | null
  inboundDate: string
  initialQuantity: number // 入库批次量
  availableQuantity: number // 当前可用量
  frozenQuantity: number // 冻结量
  totalQuantity: number // 合计
  subItems: TallyStackingSubItem[]
}

export interface InventoryTransactionRecord {
  id: string
  transactionNo: string // 流水号，如 "LS-20260901-0001"
  direction: "IN" | "OUT" // IN: 入库, OUT: 出库
  businessType: string // 细分业务类型（共19种）
  orderNo: string // 单据编号，关联入库单或出库单
  warehouseId: string
  warehouseName: string
  ownerId: string
  ownerName: string
  goodsId: string
  category: string
  variety: string
  specification: string
  changeQuantity: number // 变动数量（正数）
  balanceQuantity: number // 变动后结存
  unit: string
  businessDate: string // 业务发生时间
  createTime: string // 系统制单时间
  operatorName: string // 经办人
  remark?: string
  hasPdf: boolean
}

// 1. 真实仓库主档
export const SHARED_WAREHOUSES: WarehouseItem[] = [
  {
    id: "WH001",
    name: "青白江大宗商品监管1号仓",
    type: "大宗金属平房重载仓",
    manager: "四川华西物流集团有限公司",
    address: "四川省成都市青白江区弥牟镇港城大道888号",
    phone: "028-83668899",
    province: "四川省",
    city: "成都市",
  },
  {
    id: "WH002",
    name: "海霸王仓库",
    type: "大型冷链综合温控仓",
    manager: "成都海霸王物流园区发展有限公司",
    address: "四川省成都市郫都区安德街道川西工业园区",
    phone: "028-87995566",
    province: "四川省",
    city: "成都市",
  },
  {
    id: "WH003",
    name: "德阳金属型材专储仓",
    type: "工业型材重型立体仓",
    manager: "德阳利达物流仓储有限公司",
    address: "四川省德阳市旌阳区天元镇工业园B区",
    phone: "0838-2559811",
    province: "四川省",
    city: "德阳市",
  },
  {
    id: "WH004",
    name: "生鲜冷链仓库",
    type: "气调保鲜果蔬专用仓",
    manager: "川联多元供应链管理有限公司",
    address: "四川省成都市龙泉驿区成龙大道二段168号",
    phone: "028-84881122",
    province: "四川省",
    city: "成都市",
  },
]

// 2. 货品与规格主档
export const SHARED_GOODS: GoodsSkuItem[] = [
  {
    id: "G001",
    skuId: "SKU-CU-001",
    category: "有色金属",
    variety: "阴极铜",
    specification: "阴极铜 Cu-CATH-1 (GB/T 467-2010)",
    measureUnit: "吨",
    unitPrice: 7.45,
  },
  {
    id: "G002",
    skuId: "SKU-AL-002",
    category: "有色金属",
    variety: "铝锭",
    specification: "A00铝锭 Al99.70 (GB/T 1196-2017)",
    measureUnit: "吨",
    unitPrice: 2.08,
  },
  {
    id: "G003",
    skuId: "SKU-STEEL-003",
    category: "黑色金属",
    variety: "热轧卷板",
    specification: "热轧卷板 Q235B 5.75*1500*C",
    measureUnit: "吨",
    unitPrice: 0.38,
  },
  {
    id: "G004",
    skuId: "SKU-REBAR-004",
    category: "黑色金属",
    variety: "螺纹钢",
    specification: "HRB400E Φ20mm 抗震螺纹钢",
    measureUnit: "吨",
    unitPrice: 0.36,
  },
  {
    id: "G005",
    skuId: "SKU-BEEF-005",
    category: "冷链生鲜",
    variety: "冷冻牛肉",
    specification: "澳洲安格斯冷冻牛腩 -18℃ 冻肉",
    measureUnit: "吨",
    unitPrice: 5.8,
  },
  {
    id: "G006",
    skuId: "SKU-TI-006",
    category: "特种金属",
    variety: "钛合金棒材",
    specification: "定制合金棒材 TC4-X（航空级待点价）",
    measureUnit: "吨",
    unitPrice: null, // 未定价商品，触发顶部感叹号
    pricingNote: "暂定价待点价结算中，货值暂不计入总价",
  },
]

// 3. 货主主档
export const SHARED_OWNERS: CargoOwnerItem[] = [
  {
    id: "OWN001",
    name: "四川华西大宗商品供应链管理有限公司",
    ownerType: "2",
    identifier: "91510100MA6XXXXXX1",
    identifierMasked: "91510100MA6XXXXXX1",
    contactPerson: "张建国",
    contactPhone: "13880018801",
    contactPhoneMasked: "138****8801",
  },
  {
    id: "OWN002",
    name: "德阳市利达金属型材有限公司",
    ownerType: "2",
    identifier: "91510600MA6XXXXXX2",
    identifierMasked: "91510600MA6XXXXXX2",
    contactPerson: "李立达",
    contactPhone: "13981111234",
    contactPhoneMasked: "139****1234",
  },
  {
    id: "OWN003",
    name: "成都锦城冷链物流有限公司",
    ownerType: "2",
    identifier: "91510104MA62XXXXX",
    identifierMasked: "91510104MA62XXXXX",
    contactPerson: "王经理",
    contactPhone: "18080005678",
    contactPhoneMasked: "180****5678",
  },
  {
    id: "OWN004",
    name: "乐富",
    ownerType: "1",
    identifier: "51010419850612XXXX",
    identifierMasked: "135****9988",
    contactPerson: "乐富",
    contactPhone: "13580009988",
    contactPhoneMasked: "135****9988",
  },
  {
    id: "OWN005",
    name: "梨花",
    ownerType: "1",
    identifier: "51010519900825XXXX",
    identifierMasked: "137****6622",
    contactPerson: "梨花",
    contactPhone: "13780006622",
    contactPhoneMasked: "137****6622",
  },
]

// 4. 库存明细全息种子数据（支持最细粒度物理货位）
export const SHARED_INVENTORY_DETAILS: InventoryDetailRecord[] = [
  {
    id: "INV-DET-001",
    barcode: "KC-QBJ-20261010-001",
    warehouseId: "WH001",
    warehouseName: "青白江大宗商品监管1号仓",
    houseName: "1号金属库房",
    houseAuditStatus: "normal",
    partitionName: "A区重载区",
    locationCode: "A-01垛位",
    ownerId: "OWN001",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510100MA6XXXXXX1",
    ownerPhoneMasked: "138****8801",
    goodsId: "G001",
    category: "有色金属",
    variety: "阴极铜",
    specification: "阴极铜 Cu-CATH-1 (GB/T 467-2010)",
    unit: "吨",
    unitPrice: 7.45,
    initialQuantity: 120.0,
    availableQuantity: 80.0,
    frozenQuantity: 40.0,
    totalQuantity: 120.0,
    totalPrice: 894.0, // 120 * 7.45
    inboundOrderNo: "2026101015300000123",
    inboundDate: "2026-10-10 15:30:00",
    lastMoveDate: "2026-10-15 11:20:00",
    status: "FROZEN",
    freezeReason: "质押登记申请中(单号:ZY-20261015-001)",
    freezeOrderNo: "ZY-20261015-001",
    rfidTag: "RFID-CU-882101",
  },
  {
    id: "INV-DET-002",
    barcode: "KC-QBJ-20261010-002",
    warehouseId: "WH001",
    warehouseName: "青白江大宗商品监管1号仓",
    houseName: "1号金属库房",
    houseAuditStatus: "normal",
    partitionName: "A区重载区",
    locationCode: "A-02垛位",
    ownerId: "OWN001",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510100MA6XXXXXX1",
    ownerPhoneMasked: "138****8801",
    goodsId: "G002",
    category: "有色金属",
    variety: "铝锭",
    specification: "A00铝锭 Al99.70 (GB/T 1196-2017)",
    unit: "吨",
    unitPrice: 2.08,
    initialQuantity: 80.0,
    availableQuantity: 80.0,
    frozenQuantity: 0.0,
    totalQuantity: 80.0,
    totalPrice: 166.4, // 80 * 2.08
    inboundOrderNo: "2108777000011222333",
    inboundDate: "2026-09-18 10:15:00",
    lastMoveDate: "2026-09-18 10:15:00",
    status: "NORMAL",
    rfidTag: "RFID-AL-551022",
  },
  {
    id: "INV-DET-003",
    barcode: "KC-DY-20260901-001",
    warehouseId: "WH003",
    warehouseName: "德阳金属型材专储仓",
    houseName: "1号型材库",
    houseAuditStatus: "normal",
    partitionName: "重型货架区",
    locationCode: "H-01垛位",
    ownerId: "OWN002",
    ownerName: "德阳市利达金属型材有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510600MA6XXXXXX2",
    ownerPhoneMasked: "139****1234",
    goodsId: "G003",
    category: "黑色金属",
    variety: "热轧卷板",
    specification: "热轧卷板 Q235B 5.75*1500*C",
    unit: "吨",
    unitPrice: 0.38,
    initialQuantity: 250.0,
    availableQuantity: 150.0,
    frozenQuantity: 100.0,
    totalQuantity: 250.0,
    totalPrice: 95.0, // 250 * 0.38
    inboundOrderNo: "2109823450912384923",
    inboundDate: "2026-09-01 14:00:00",
    lastMoveDate: "2026-09-20 16:45:00",
    status: "FROZEN",
    freezeReason: "出库申请审核中(单号:20617289020070320130)",
    freezeOrderNo: "20617289020070320130",
    rfidTag: "RFID-ST-991201",
  },
  {
    id: "INV-DET-004",
    barcode: "KC-HBN-20260603-001",
    warehouseId: "WH002",
    warehouseName: "海霸王仓库",
    houseName: "1号冷冻库",
    houseAuditStatus: "normal",
    partitionName: "冻库A区",
    locationCode: "F-01垛位",
    ownerId: "OWN003",
    ownerName: "成都锦城冷链物流有限公司",
    ownerType: "2",
    ownerIdentifierMasked: "91510104MA62XXXXX",
    ownerPhoneMasked: "180****5678",
    goodsId: "G005",
    category: "冷链生鲜",
    variety: "冷冻牛肉",
    specification: "澳洲安格斯冷冻牛腩 -18℃ 冻肉",
    unit: "吨",
    unitPrice: 5.8,
    initialQuantity: 45.0,
    availableQuantity: 30.0,
    frozenQuantity: 15.0,
    totalQuantity: 45.0,
    totalPrice: 261.0, // 45 * 5.8
    inboundOrderNo: "2108438504322834432",
    inboundDate: "2026-06-03 09:48:22",
    lastMoveDate: "2026-08-11 14:10:00",
    status: "FROZEN",
    freezeReason: "移库审批中(单号:YK-20260811-001)",
    freezeOrderNo: "YK-20260811-001",
    rfidTag: "RFID-BF-332011",
  },
  {
    id: "INV-DET-005",
    barcode: "KC-HBN-20260603-002",
    warehouseId: "WH002",
    warehouseName: "海霸王仓库",
    houseName: "3号冷藏库",
    houseAuditStatus: "normal",
    partitionName: "保鲜B区",
    locationCode: "C-01垛位",
    ownerId: "OWN004",
    ownerName: "乐富",
    ownerType: "1",
    ownerIdentifierMasked: "135****9988",
    ownerPhoneMasked: "135****9988",
    goodsId: "G004",
    category: "黑色金属",
    variety: "螺纹钢",
    specification: "HRB400E Φ20mm 抗震螺纹钢",
    unit: "吨",
    unitPrice: 0.36,
    initialQuantity: 60.0,
    availableQuantity: 40.0,
    frozenQuantity: 20.0,
    totalQuantity: 60.0,
    totalPrice: 21.6, // 60 * 0.36
    inboundOrderNo: "2108438504322834433",
    inboundDate: "2026-06-03 11:20:00",
    lastMoveDate: "2026-07-15 09:30:00",
    status: "FROZEN",
    freezeReason: "仓单开立审核中(单号:CD-20260715-001)",
    freezeOrderNo: "CD-20260715-001",
    rfidTag: "RFID-RB-441122",
  },
  {
    id: "INV-DET-006",
    barcode: "KC-WH-VIRTUAL-001",
    warehouseId: "WH004",
    warehouseName: "生鲜冷链仓库",
    houseName: "未分配库房",
    houseAuditStatus: "auditing",
    partitionName: "未指定分区",
    locationCode: "虚拟未指定垛位",
    isVirtual: true,
    ownerId: "OWN005",
    ownerName: "梨花",
    ownerType: "1",
    ownerIdentifierMasked: "137****6622",
    ownerPhoneMasked: "137****6622",
    goodsId: "G006",
    category: "特种金属",
    variety: "钛合金棒材",
    specification: "定制合金棒材 TC4-X（航空级待点价）",
    unit: "吨",
    unitPrice: null, // 未定价
    initialQuantity: 15.0,
    availableQuantity: 15.0,
    frozenQuantity: 0.0,
    totalQuantity: 15.0,
    totalPrice: null, // 未定价，不计入货值
    inboundOrderNo: "2105200919292059650",
    inboundDate: "2026-05-20 09:19:29",
    lastMoveDate: "2026-05-20 09:19:29",
    status: "NORMAL",
    rfidTag: "RFID-TI-009988",
  },
]

// 5. 理货堆放种子数据（主码 × 子码联动）
export const SHARED_TALLY_STACKING: TallyStackingMainItem[] = [
  {
    id: "TL-001",
    mainCode: "TM-20261010-001",
    inboundOrderNo: "2026101015300000123",
    warehouseId: "WH001",
    warehouseName: "青白江大宗商品监管1号仓",
    ownerId: "OWN001",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerIdentifierMasked: "91510100MA6XXXXXX1",
    goodsId: "G001",
    category: "有色金属",
    variety: "阴极铜",
    specification: "阴极铜 Cu-CATH-1 (GB/T 467-2010)",
    unit: "吨",
    unitPrice: 7.45,
    inboundDate: "2026-10-10 15:30:00",
    initialQuantity: 120.0,
    availableQuantity: 80.0,
    frozenQuantity: 40.0,
    totalQuantity: 120.0,
    subItems: [
      {
        subId: "TLS-001-1",
        subCode: "KC-QBJ-20261010-001",
        houseName: "1号金属库房",
        houseAuditStatus: "normal",
        partitionName: "A区重载区",
        locationCode: "A-01垛位",
        initialQuantity: 120.0,
        availableQuantity: 80.0,
        frozenQuantity: 40.0,
        totalQuantity: 120.0,
        unit: "吨",
        statusText: "质押流转冻结(40吨)",
      },
    ],
  },
  {
    id: "TL-002",
    mainCode: "TM-20260901-002",
    inboundOrderNo: "2109823450912384923",
    warehouseId: "WH003",
    warehouseName: "德阳金属型材专储仓",
    ownerId: "OWN002",
    ownerName: "德阳市利达金属型材有限公司",
    ownerIdentifierMasked: "91510600MA6XXXXXX2",
    goodsId: "G003",
    category: "黑色金属",
    variety: "热轧卷板",
    specification: "热轧卷板 Q235B 5.75*1500*C",
    unit: "吨",
    unitPrice: 0.38,
    inboundDate: "2026-09-01 14:00:00",
    initialQuantity: 250.0,
    availableQuantity: 150.0,
    frozenQuantity: 100.0,
    totalQuantity: 250.0,
    subItems: [
      {
        subId: "TLS-002-1",
        subCode: "KC-DY-20260901-001",
        houseName: "1号型材库",
        houseAuditStatus: "normal",
        partitionName: "重型货架区",
        locationCode: "H-01垛位",
        initialQuantity: 150.0,
        availableQuantity: 100.0,
        frozenQuantity: 50.0,
        totalQuantity: 150.0,
        unit: "吨",
        statusText: "出库申请冻结(50吨)",
      },
      {
        subId: "TLS-002-2",
        subCode: "KC-DY-20260901-002",
        houseName: "1号型材库",
        houseAuditStatus: "normal",
        partitionName: "重型货架区",
        locationCode: "H-02垛位",
        initialQuantity: 100.0,
        availableQuantity: 50.0,
        frozenQuantity: 50.0,
        totalQuantity: 100.0,
        unit: "吨",
        statusText: "出库申请冻结(50吨)",
      },
    ],
  },
  {
    id: "TL-003",
    mainCode: "TM-20260603-003",
    inboundOrderNo: "2108438504322834432",
    warehouseId: "WH002",
    warehouseName: "海霸王仓库",
    ownerId: "OWN003",
    ownerName: "成都锦城冷链物流有限公司",
    ownerIdentifierMasked: "91510104MA62XXXXX",
    goodsId: "G005",
    category: "冷链生鲜",
    variety: "冷冻牛肉",
    specification: "澳洲安格斯冷冻牛腩 -18℃ 冻肉",
    unit: "吨",
    unitPrice: 5.8,
    inboundDate: "2026-06-03 09:48:22",
    initialQuantity: 45.0,
    availableQuantity: 30.0,
    frozenQuantity: 15.0,
    totalQuantity: 45.0,
    subItems: [
      {
        subId: "TLS-003-1",
        subCode: "KC-HBN-20260603-001",
        houseName: "1号冷冻库",
        houseAuditStatus: "normal",
        partitionName: "冻库A区",
        locationCode: "F-01垛位",
        initialQuantity: 45.0,
        availableQuantity: 30.0,
        frozenQuantity: 15.0,
        totalQuantity: 45.0,
        unit: "吨",
        statusText: "移库审批冻结(15吨)",
      },
    ],
  },
  {
    id: "TL-004",
    mainCode: "TM-20260520-004",
    inboundOrderNo: "2105200919292059650",
    warehouseId: "WH004",
    warehouseName: "生鲜冷链仓库",
    ownerId: "OWN005",
    ownerName: "梨花",
    ownerIdentifierMasked: "137****6622",
    goodsId: "G006",
    category: "特种金属",
    variety: "钛合金棒材",
    specification: "定制合金棒材 TC4-X（航空级待点价）",
    unit: "吨",
    unitPrice: null,
    inboundDate: "2026-05-20 09:19:29",
    initialQuantity: 15.0,
    availableQuantity: 15.0,
    frozenQuantity: 0.0,
    totalQuantity: 15.0,
    subItems: [
      {
        subId: "TLS-004-1",
        subCode: "KC-WH-VIRTUAL-001",
        houseName: "未分配库房",
        houseAuditStatus: "auditing",
        partitionName: "未指定分区",
        locationCode: "虚拟未指定垛位",
        isVirtual: true,
        initialQuantity: 15.0,
        availableQuantity: 15.0,
        frozenQuantity: 0.0,
        totalQuantity: 15.0,
        unit: "吨",
        statusText: "正常在库(未指定垛位)",
      },
    ],
  },
]

// 6. 出入库合并流水种子数据（19 种细分业务归集）
export const SHARED_INVENTORY_TRANSACTIONS: InventoryTransactionRecord[] = [
  {
    id: "TX-001",
    transactionNo: "LS-20261010-0001",
    direction: "IN",
    businessType: "普通入库",
    orderNo: "2026101015300000123",
    warehouseId: "WH001",
    warehouseName: "青白江大宗商品监管1号仓",
    ownerId: "OWN001",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    goodsId: "G001",
    category: "有色金属",
    variety: "阴极铜",
    specification: "阴极铜 Cu-CATH-1 (GB/T 467-2010)",
    changeQuantity: 120.0,
    balanceQuantity: 120.0,
    unit: "吨",
    businessDate: "2026-10-10",
    createTime: "2026-10-10 15:30:00",
    operatorName: "李晓云(仓管员)",
    remark: "国贸采购批次整批入库验收合格",
    hasPdf: true,
  },
  {
    id: "TX-002",
    transactionNo: "LS-20260918-0002",
    direction: "IN",
    businessType: "质押入库",
    orderNo: "2108777000011222333",
    warehouseId: "WH001",
    warehouseName: "青白江大宗商品监管1号仓",
    ownerId: "OWN001",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    goodsId: "G002",
    category: "有色金属",
    variety: "铝锭",
    specification: "A00铝锭 Al99.70 (GB/T 1196-2017)",
    changeQuantity: 80.0,
    balanceQuantity: 80.0,
    unit: "吨",
    businessDate: "2026-09-18",
    createTime: "2026-09-18 10:15:00",
    operatorName: "陈伟(复核员)",
    remark: "浙商银行存货质押监管入库核实",
    hasPdf: true,
  },
  {
    id: "TX-003",
    transactionNo: "LS-20260901-0003",
    direction: "IN",
    businessType: "采购入库",
    orderNo: "2109823450912384923",
    warehouseId: "WH003",
    warehouseName: "德阳金属型材专储仓",
    ownerId: "OWN002",
    ownerName: "德阳市利达金属型材有限公司",
    goodsId: "G003",
    category: "黑色金属",
    variety: "热轧卷板",
    specification: "热轧卷板 Q235B 5.75*1500*C",
    changeQuantity: 250.0,
    balanceQuantity: 250.0,
    unit: "吨",
    businessDate: "2026-09-01",
    createTime: "2026-09-01 14:00:00",
    operatorName: "张建(理货员)",
    remark: "攀钢大批量卷板直运入库",
    hasPdf: true,
  },
  {
    id: "TX-004",
    transactionNo: "LS-20260905-0004",
    direction: "OUT",
    businessType: "提货出库",
    orderNo: "20617289020070320130",
    warehouseId: "WH002",
    warehouseName: "海霸王仓库",
    ownerId: "OWN003",
    ownerName: "成都锦城冷链物流有限公司",
    goodsId: "G005",
    category: "冷链生鲜",
    variety: "冷冻牛肉",
    specification: "澳洲安格斯冷冻牛腩 -18℃ 冻肉",
    changeQuantity: 15.0,
    balanceQuantity: 30.0,
    unit: "吨",
    businessDate: "2026-09-05",
    createTime: "2026-09-05 16:20:00",
    operatorName: "王强调度",
    remark: "提货单出库现场验货放行",
    hasPdf: true,
  },
  {
    id: "TX-005",
    transactionNo: "LS-20260820-0005",
    direction: "OUT",
    businessType: "移库出库",
    orderNo: "2061264633286291458",
    warehouseId: "WH002",
    warehouseName: "海霸王仓库",
    ownerId: "OWN004",
    ownerName: "乐富",
    goodsId: "G004",
    category: "黑色金属",
    variety: "螺纹钢",
    specification: "HRB400E Φ20mm 抗震螺纹钢",
    changeQuantity: 20.0,
    balanceQuantity: 40.0,
    unit: "吨",
    businessDate: "2026-08-20",
    createTime: "2026-08-20 11:30:00",
    operatorName: "赵刚(主管)",
    remark: "库内整理移至3号冷藏库",
    hasPdf: true,
  },
  {
    id: "TX-006",
    transactionNo: "LS-20260603-0006",
    direction: "IN",
    businessType: "普通入库",
    orderNo: "2108438504322834432",
    warehouseId: "WH002",
    warehouseName: "海霸王仓库",
    ownerId: "OWN003",
    ownerName: "成都锦城冷链物流有限公司",
    goodsId: "G005",
    category: "冷链生鲜",
    variety: "冷冻牛肉",
    specification: "澳洲安格斯冷冻牛腩 -18℃ 冻肉",
    changeQuantity: 45.0,
    balanceQuantity: 45.0,
    unit: "吨",
    businessDate: "2026-06-03",
    createTime: "2026-06-03 09:48:22",
    operatorName: "李晓云(仓管员)",
    remark: "进口冷冻牛肉入库检验合格",
    hasPdf: true,
  },
  {
    id: "TX-007",
    transactionNo: "LS-20260520-0007",
    direction: "IN",
    businessType: "加工入库",
    orderNo: "2105200919292059650",
    warehouseId: "WH004",
    warehouseName: "生鲜冷链仓库",
    ownerId: "OWN005",
    ownerName: "梨花",
    goodsId: "G006",
    category: "特种金属",
    variety: "钛合金棒材",
    specification: "定制合金棒材 TC4-X（航空级待点价）",
    changeQuantity: 15.0,
    balanceQuantity: 15.0,
    unit: "吨",
    businessDate: "2026-05-20",
    createTime: "2026-05-20 09:19:29",
    operatorName: "张理货",
    remark: "特种合金暂存入库，待点价结算",
    hasPdf: true,
  },
]

