import type { TransferStockCandidate, PledgeGoodsFormItem } from "../domain/form-types"

export interface OwnerMockItem {
  id: string
  name: string
  type: "ENTERPRISE" | "PERSONAL"
  identity: string
  idCardNo?: string
}

export const ownersMock: OwnerMockItem[] = [
  {
    id: "OWN-01",
    name: "上海物产金属国际贸易有限公司",
    type: "ENTERPRISE",
    identity: "91310000717865432X",
  },
  {
    id: "OWN-02",
    name: "山东宏泰铝业新材料发展有限公司",
    type: "ENTERPRISE",
    identity: "91370100789123456Y",
  },
  {
    id: "OWN-03",
    name: "张建国",
    type: "PERSONAL",
    identity: "138****6688",
    idCardNo: "320202198005126618",
  },
  {
    id: "OWN-04",
    name: "江苏新时代造船物流发展集团",
    type: "ENTERPRISE",
    identity: "91320000765432109Z",
  },
  {
    id: "OWN-05",
    name: "李红梅",
    type: "PERSONAL",
    identity: "139****1122",
    idCardNo: "320404198503201142",
  },
]

export interface WarehouseZoneOption {
  id: string
  name: string
  rooms: {
    id: string
    name: string
    zones: {
      id: string
      name: string
    }[]
  }[]
}

export const warehouseZonesMock: WarehouseZoneOption[] = [
  {
    id: "WH-WX-001",
    name: "无锡中储大宗商品中心仓",
    rooms: [
      {
        id: "ROOM-01",
        name: "1号重载库房",
        zones: [
          { id: "ZONE-01", name: "铜材A区" },
          { id: "ZONE-02", name: "卷板C区" },
        ],
      },
      {
        id: "ROOM-03",
        name: "3号重载库房",
        zones: [
          { id: "ZONE-03", name: "重载B区" },
          { id: "ZONE-04", name: "重载C区" },
        ],
      },
      {
        id: "ROOM-04",
        name: "4号露天特种堆场",
        zones: [{ id: "ZONE-05", name: "特种钢板堆场" }],
      },
    ],
  },
  {
    id: "WH-CZ-002",
    name: "常州绿色生鲜冷链示范仓",
    rooms: [
      {
        id: "ROOM-11",
        name: "1号低温冷冻库",
        zones: [{ id: "ZONE-11", name: "西瓜区" }],
      },
      {
        id: "ROOM-12",
        name: "2号恒温保鲜库",
        zones: [
          { id: "ZONE-12", name: "综合果蔬区" },
          { id: "ZONE-13", name: "特种冷藏区" },
        ],
      },
    ],
  },
  {
    id: "WH-QD-003",
    name: "青岛港国际物流保税库区",
    rooms: [
      {
        id: "ROOM-21",
        name: "1号普通库房",
        zones: [{ id: "ZONE-21", name: "普通堆位" }],
      },
      {
        id: "ROOM-22",
        name: "2号高标监管库",
        zones: [
          { id: "ZONE-22", name: "高标监管区" },
          { id: "ZONE-23", name: "贵金属锁控区" },
        ],
      },
    ],
  },
]

export const stockCandidatesMock: TransferStockCandidate[] = [
  {
    id: "CAND-01",
    warehouseId: "WH-WX-001",
    warehouseName: "无锡中储大宗商品中心仓",
    roomZone: "无锡中储大宗商品中心仓-1号重载库房-铜材A区",
    specificLocation: "A-01-08",
    goodsName: "有色金属-电解铜-高纯阴极铜-Cu-CATH-1",
    cateName: "有色金属",
    typeName: "电解铜",
    specName: "高纯阴极铜-Cu-CATH-1",
    inboundTime: "2026-05-12 10:20:00",
    productionDate: "2026-05-01",
    otherInfo: "批号: CU20260510-01",
    barcode: "BAR-CU-20260512-001",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAR-CU-20260512-001",
    status: "存货中",
    availableAmount: 60.5,
    unit: "吨",
  },
  {
    id: "CAND-02",
    warehouseId: "WH-WX-001",
    warehouseName: "无锡中储大宗商品中心仓",
    roomZone: "无锡中储大宗商品中心仓-1号重载库房-铜材A区",
    specificLocation: "A-01-09",
    goodsName: "有色金属-电解铜-高纯阴极铜-Cu-CATH-1",
    cateName: "有色金属",
    typeName: "电解铜",
    specName: "高纯阴极铜-Cu-CATH-1",
    inboundTime: "2026-05-15 14:10:00",
    productionDate: "2026-05-05",
    otherInfo: "批号: CU20260510-02",
    barcode: "BAR-CU-20260515-002",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAR-CU-20260515-002",
    status: "存货中",
    availableAmount: 40.0,
    unit: "吨",
  },
  {
    id: "CAND-03",
    warehouseId: "WH-CZ-002",
    warehouseName: "常州绿色生鲜冷链示范仓",
    roomZone: "常州绿色生鲜冷链示范仓-1号低温冷冻库-西瓜区",
    specificLocation: "XG-01-A",
    goodsName: "果蔬生鲜-西瓜-超级早熟-宁夏硒砂",
    cateName: "果蔬生鲜",
    typeName: "西瓜",
    specName: "超级早熟-宁夏硒砂",
    inboundTime: "2026-07-20 08:30:00",
    productionDate: "2026-07-18",
    otherInfo: "产地: 宁夏中卫",
    barcode: "BAR-XG-20260720-001",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAR-XG-20260720-001",
    status: "存货中",
    availableAmount: 18.0,
    unit: "吨",
  },
  {
    id: "CAND-04",
    warehouseId: "WH-CZ-002",
    warehouseName: "常州绿色生鲜冷链示范仓",
    roomZone: "常州绿色生鲜冷链示范仓-1号低温冷冻库-西瓜区",
    specificLocation: "XG-01-B",
    goodsName: "果蔬生鲜-西瓜-超级早熟-宁夏硒砂",
    cateName: "果蔬生鲜",
    typeName: "西瓜",
    specName: "超级早熟-宁夏硒砂",
    inboundTime: "2026-07-21 09:15:00",
    productionDate: "2026-07-19",
    otherInfo: "产地: 宁夏中卫",
    barcode: "BAR-XG-20260721-002",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAR-XG-20260721-002",
    status: "存货中",
    availableAmount: 14.8,
    unit: "吨",
  },
  {
    id: "CAND-05",
    warehouseId: "WH-QD-003",
    warehouseName: "青岛港国际物流保税库区",
    roomZone: "青岛港国际物流保税库区-1号普通库房-普通堆位",
    specificLocation: "QD-01-99",
    goodsName: "有色金属-铝锭-原铝重熔铝锭-Al99.70",
    cateName: "有色金属",
    typeName: "铝锭",
    specName: "原铝重熔铝锭-Al99.70",
    inboundTime: "2026-06-01 11:00:00",
    productionDate: "2026-05-25",
    otherInfo: "国标: GB/T 1196-2017",
    barcode: "BAR-AL-20260601-088",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAR-AL-20260601-088",
    status: "存货中",
    availableAmount: 120.0,
    unit: "吨",
  },
  // 跨仓对比模拟项：同规格水果同时在无锡中储仓也有库存，用于触发跨仓置灰阻断
  {
    id: "CAND-06",
    warehouseId: "WH-WX-001",
    warehouseName: "无锡中储大宗商品中心仓",
    roomZone: "无锡中储大宗商品中心仓-3号重载库房-重载B区",
    specificLocation: "WX-XG-01",
    goodsName: "果蔬生鲜-西瓜-超级早熟-宁夏硒砂",
    cateName: "果蔬生鲜",
    typeName: "西瓜",
    specName: "超级早熟-宁夏硒砂",
    inboundTime: "2026-07-22 10:00:00",
    productionDate: "2026-07-20",
    otherInfo: "外仓测试调拨",
    barcode: "BAR-XG-20260722-099",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAR-XG-20260722-099",
    status: "存货中",
    availableAmount: 25.0,
    unit: "吨",
  },
]

export interface RelatedOrderMock {
  orderNo: string
  orderType: "PLEDGE" | "MORTGAGE"
  ownerName: string
  bankName: string
  items: PledgeGoodsFormItem[]
}

export const relatedOrdersMock: RelatedOrderMock[] = [
  {
    orderNo: "ZY202607150089",
    orderType: "PLEDGE",
    ownerName: "上海物产金属国际贸易有限公司",
    bankName: "招商银行上海分行",
    items: [
      {
        id: "PLG-01",
        goodsName: "有色金属-电解铜-高纯阴极铜-Cu-CATH-1",
        sourceWarehouseId: "WH-WX-001",
        sourceWarehouseName: "无锡中储大宗商品中心仓",
        sourceRoomZone: "无锡中储大宗商品中心仓-1号重载库房-铜材A区",
        sourceSpecificLocation: "A-01-08",
        barcode: "BAR-CU-20260512-001",
        qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAR-CU-20260512-001",
        availableAmount: 60.5,
        transferAmount: 60.5,
        unit: "吨",
        targetRoomZone: "",
        targetSpecificLocation: "",
        selected: true,
      },
      {
        id: "PLG-02",
        goodsName: "黑色金属-热轧卷板-Q235B-5.75*1500*C",
        sourceWarehouseId: "WH-WX-001",
        sourceWarehouseName: "无锡中储大宗商品中心仓",
        sourceRoomZone: "无锡中储大宗商品中心仓-1号重载库房-卷板C区",
        sourceSpecificLocation: "C-02-15",
        barcode: "BAR-RZ-20260618-002",
        qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAR-RZ-20260618-002",
        availableAmount: 85.2,
        transferAmount: 85.2,
        unit: "吨",
        targetRoomZone: "",
        targetSpecificLocation: "",
        selected: true,
      },
    ],
  },
  {
    orderNo: "DY202607100034",
    orderType: "MORTGAGE",
    ownerName: "山东宏泰铝业新材料发展有限公司",
    bankName: "青岛银行自贸区分行",
    items: [
      {
        id: "MOR-01",
        goodsName: "有色金属-铝锭-原铝重熔铝锭-Al99.70",
        sourceWarehouseId: "WH-QD-003",
        sourceWarehouseName: "青岛港国际物流保税库区",
        sourceRoomZone: "青岛港国际物流保税库区-1号普通库房-普通堆位",
        sourceSpecificLocation: "QD-01-99",
        barcode: "BAR-AL-20260601-088",
        qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAR-AL-20260601-088",
        availableAmount: 120.0,
        transferAmount: 120.0,
        unit: "吨",
        targetRoomZone: "",
        targetSpecificLocation: "",
        selected: true,
      },
    ],
  },
]

