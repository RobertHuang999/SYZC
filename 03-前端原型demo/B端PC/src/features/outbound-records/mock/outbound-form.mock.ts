import type {
  OutboundStockLocationItem,
  OwnerType,
} from "../domain/types"

/** 货主主体选项 */
export interface OwnerCandidate {
  id: string
  name: string
  type: OwnerType
  identifier: string // 统一社会信用代码 或 手机号
  phone: string
  idCard?: string
}

export const OWNER_CANDIDATES: OwnerCandidate[] = [
  {
    id: "OWN-00",
    name: "原原李",
    type: "个人",
    identifier: "185****7112",
    phone: "18571128888",
    idCard: "420101****8682",
  },
  {
    id: "OWN-01",
    name: "四川建龙物资有限公司",
    type: "企业",
    identifier: "91510100MA6XXXXXXX",
    phone: "028-87654321",
  },
  {
    id: "OWN-02",
    name: "四川华西大宗商品供应链管理有限公司",
    type: "企业",
    identifier: "91510100MA6289B51X",
    phone: "028-87654322",
  },
  {
    id: "OWN-03",
    name: "阜阳大象粮油有限公司",
    type: "企业",
    identifier: "91341202MA2U0JHJ3F",
    phone: "0558-2198765",
  },
  {
    id: "OWN-04",
    name: "成都川工重型机械制造有限公司",
    type: "企业",
    identifier: "91510100MA6399C88Y",
    phone: "028-86668888",
  },
  {
    id: "OWN-05",
    name: "张三",
    type: "个人",
    identifier: "13300000001",
    phone: "13300000001",
    idCard: "51010419880912001X",
  },
  {
    id: "OWN-06",
    name: "李四",
    type: "个人",
    identifier: "13800000002",
    phone: "13800000002",
    idCard: "51010519900215002Y",
  },
]

/** 仓库列表 */
export const FORM_WAREHOUSES = [
  { id: "W-01", name: "海霸王仓库" },
  { id: "W-02", name: "生鲜冷链仓库" },
  { id: "W-03", name: "农产品监管仓库" },
  { id: "W-04", name: "青白江国际陆港监管仓" },
]

/** 关联业务单据（仓单、质押、抵押） */
export interface RelatedOrderItem {
  orderNo: string
  type: "仓单出库" | "质押出库" | "抵押出库"
  ownerName: string
  ownerIdentifier: string
  status: string // 存续有效
  warehouseName: string
  items: {
    goodsName: string
    categoryName: string
    subCategoryName: string
    specName: string
    locationPath: string
    warehouseName: string
    storeroomName: string
    partitionName: string
    availableAmount: number
    unit: string
    price: number
    barcode: string
    extraInfo: string
  }[]
}

export const RELATED_ORDER_CANDIDATES: RelatedOrderItem[] = [
  {
    orderNo: "ZY20260528001",
    type: "质押出库",
    ownerName: "四川建龙物资有限公司",
    ownerIdentifier: "91510100MA6XXXXXXX",
    status: "允许出库（已解质）",
    warehouseName: "海霸王仓库",
    items: [
      {
        goodsName: "有色金属-电解铜-国标",
        categoryName: "有色金属",
        subCategoryName: "电解铜",
        specName: "国标",
        locationPath: "海霸王仓库-1号库房-A区",
        warehouseName: "海霸王仓库",
        storeroomName: "1号库房",
        partitionName: "A区",
        availableAmount: 500.0,
        unit: "吨",
        price: 65000,
        barcode: "SYZC-BC-20260510-001",
        extraInfo: "牌号：Cu-CATH-1",
      },
      {
        goodsName: "黑色金属-热轧卷板-Q235",
        categoryName: "黑色金属",
        subCategoryName: "热轧卷板",
        specName: "Q235",
        locationPath: "海霸王仓库-2号库房-B区",
        warehouseName: "海霸王仓库",
        storeroomName: "2号库房",
        partitionName: "B区",
        availableAmount: 200.0,
        unit: "吨",
        price: 3800,
        barcode: "SYZC-BC-20260510-002",
        extraInfo: "厚度：5.75mm",
      },
    ],
  },
  {
    orderNo: "ZY20260601008",
    type: "质押出库",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerIdentifier: "91510100MA6289B51X",
    status: "允许出库（风控核准解质）",
    warehouseName: "海霸王仓库",
    items: [
      {
        goodsName: "有色金属-铝锭-A00",
        categoryName: "有色金属",
        subCategoryName: "铝锭",
        specName: "A00",
        locationPath: "海霸王仓库-1号库房-B区",
        warehouseName: "海霸王仓库",
        storeroomName: "1号库房",
        partitionName: "B区",
        availableAmount: 350.0,
        unit: "吨",
        price: 19800,
        barcode: "SYZC-BC-20260601-108",
        extraInfo: "纯度：99.7%",
      },
    ],
  },
  {
    orderNo: "CD206126414642828",
    type: "仓单出库",
    ownerName: "阜阳大象粮油有限公司",
    ownerIdentifier: "91341202MA2U0JHJ3F",
    status: "允许出库（有效仓单）",
    warehouseName: "海霸王仓库",
    items: [
      {
        goodsName: "农产品-大豆原油-国标一级",
        categoryName: "农产品",
        subCategoryName: "大豆油",
        specName: "国标一级",
        locationPath: "海霸王仓库-3号油罐区",
        warehouseName: "海霸王仓库",
        storeroomName: "油品库",
        partitionName: "3号罐",
        availableAmount: 450.0,
        unit: "吨",
        price: 8200,
        barcode: "SYZC-BC-20260520-101",
        extraInfo: "酸价<=0.2",
      },
    ],
  },
  {
    orderNo: "CD20260605001",
    type: "仓单出库",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerIdentifier: "91510100MA6289B51X",
    status: "允许出库（有效电子仓单）",
    warehouseName: "青白江国际陆港监管仓",
    items: [
      {
        goodsName: "黑色金属-热轧卷板-Q235B",
        categoryName: "黑色金属",
        subCategoryName: "热轧卷板",
        specName: "Q235B",
        locationPath: "青白江国际陆港监管仓-重载仓A-1号区",
        warehouseName: "青白江国际陆港监管仓",
        storeroomName: "重载仓A",
        partitionName: "1号区",
        availableAmount: 280.0,
        unit: "吨",
        price: 3950,
        barcode: "SYZC-BC-20260605-201",
        extraInfo: "规格：5.75*1500*C",
      },
    ],
  },
  {
    orderNo: "DY202605250002",
    type: "抵押出库",
    ownerName: "李四",
    ownerIdentifier: "13800000002",
    status: "允许出库（解抵押放行）",
    warehouseName: "农产品监管仓库",
    items: [
      {
        goodsName: "农产品-白砂糖-特级",
        categoryName: "农产品",
        subCategoryName: "白砂糖",
        specName: "特级",
        locationPath: "农产品监管仓库-干货库-1区",
        warehouseName: "农产品监管仓库",
        storeroomName: "干货库",
        partitionName: "1区",
        availableAmount: 50.0,
        unit: "吨",
        price: 6500,
        barcode: "SYZC-BC-20260501-301",
        extraInfo: "GB/T 317-2018",
      },
    ],
  },
  {
    orderNo: "DY20260608003",
    type: "抵押出库",
    ownerName: "成都川工重型机械制造有限公司",
    ownerIdentifier: "91510100MA6399C88Y",
    status: "允许出库（解抵押授权通过）",
    warehouseName: "青白江国际陆港监管仓",
    items: [
      {
        goodsName: "工程装备-重型锻件-42CrMo",
        categoryName: "黑色金属",
        subCategoryName: "合金钢锻件",
        specName: "42CrMo4",
        locationPath: "青白江国际陆港监管仓-重载仓B-露天垛位",
        warehouseName: "青白江国际陆港监管仓",
        storeroomName: "重载仓B",
        partitionName: "露天垛位",
        availableAmount: 120.0,
        unit: "吨",
        price: 12500,
        barcode: "SYZC-BC-20260608-501",
        extraInfo: "探伤等级：EN10228 Class 3",
      },
    ],
  },
]

/** 普通出库选货池（按货主和仓库可用的在库资产） */
export interface AvailableGoodsStockGroup {
  goodsName: string
  categoryName: string
  subCategoryName: string
  specName: string
  unit: string
  totalAvailable: number
  isSingleWarehouse: boolean // 是否满足单仓条件
  locations: (OutboundStockLocationItem & {
    productionDate: string
    ownerName: string
  })[]
}

export const AVAILABLE_STOCK_GROUPS_MOCK: AvailableGoodsStockGroup[] = [
  // 0. 原原李（个人货主测试数据）可用库存
  {
    goodsName: "有色金属-铝锭-A00",
    categoryName: "有色金属",
    subCategoryName: "铝锭",
    specName: "A00",
    unit: "吨",
    totalAvailable: 300.0,
    isSingleWarehouse: true,
    locations: [
      {
        id: "STK-LOC-YYL-01",
        warehouseName: "海霸王仓库",
        storeroomName: "1号库房",
        partitionName: "A区",
        locationPath: "海霸王仓库-1号库房-A区",
        specificLocation: "货位-02",
        inboundTime: "2026-06-10 10:00:00",
        productionDate: "2026-05-20",
        extraInfo: "牌号：Al99.70",
        barcode: "SYZC-BC-20260610-001",
        status: "存货中",
        availableAmount: 300.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "原原李",
      },
    ],
  },
  // 1. 四川华西大宗（OCR回填货主）可用库存
  {
    goodsName: "有色金属-铝锭-A00",
    categoryName: "有色金属",
    subCategoryName: "铝锭",
    specName: "A00",
    unit: "吨",
    totalAvailable: 800.0,
    isSingleWarehouse: true,
    locations: [
      {
        id: "STK-LOC-HX-01",
        warehouseName: "海霸王仓库",
        storeroomName: "1号库房",
        partitionName: "B区",
        locationPath: "海霸王仓库-1号库房-B区",
        specificLocation: "垛位-03",
        inboundTime: "2026-05-18 10:15:00",
        productionDate: "2026-05-02",
        extraInfo: "牌号：Al99.70",
        barcode: "SYZC-BC-20260518-003",
        status: "存货中",
        availableAmount: 500.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "四川华西大宗商品供应链管理有限公司",
      },
      {
        id: "STK-LOC-HX-02",
        warehouseName: "海霸王仓库",
        storeroomName: "1号库房",
        partitionName: "B区",
        locationPath: "海霸王仓库-1号库房-B区",
        specificLocation: "垛位-04",
        inboundTime: "2026-05-20 14:30:00",
        productionDate: "2026-05-05",
        extraInfo: "牌号：Al99.70",
        barcode: "SYZC-BC-20260520-004",
        status: "存货中",
        availableAmount: 300.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "四川华西大宗商品供应链管理有限公司",
      },
    ],
  },
  {
    goodsName: "黑色金属-热轧卷板-Q235B",
    categoryName: "黑色金属",
    subCategoryName: "热轧卷板",
    specName: "Q235B",
    unit: "吨",
    totalAvailable: 450.0,
    isSingleWarehouse: true,
    locations: [
      {
        id: "STK-LOC-HX-03",
        warehouseName: "青白江国际陆港监管仓",
        storeroomName: "重载仓A",
        partitionName: "1号区",
        locationPath: "青白江国际陆港监管仓-重载仓A-1号区",
        specificLocation: "货位-05",
        inboundTime: "2026-05-22 09:40:00",
        productionDate: "2026-05-10",
        extraInfo: "规格：5.75*1500*C",
        barcode: "SYZC-BC-20260522-005",
        status: "存货中",
        availableAmount: 450.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "四川华西大宗商品供应链管理有限公司",
      },
    ],
  },

  // 2. 四川建龙物资可用库存
  {
    goodsName: "有色金属-电解铜-国标",
    categoryName: "有色金属",
    subCategoryName: "电解铜",
    specName: "国标",
    unit: "吨",
    totalAvailable: 500.0,
    isSingleWarehouse: true,
    locations: [
      {
        id: "STK-LOC-01",
        warehouseName: "海霸王仓库",
        storeroomName: "1号库房",
        partitionName: "A区",
        locationPath: "海霸王仓库-1号库房-A区",
        specificLocation: "垛位-01",
        inboundTime: "2026-05-10 09:30:00",
        productionDate: "2026-04-25",
        extraInfo: "牌号：Cu-CATH-1",
        barcode: "SYZC-BC-20260510-001",
        status: "存货中",
        availableAmount: 500.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "四川建龙物资有限公司",
      },
    ],
  },
  {
    goodsName: "黑色金属-螺纹钢-HRB400",
    categoryName: "黑色金属",
    subCategoryName: "螺纹钢",
    specName: "HRB400E",
    unit: "吨",
    totalAvailable: 1376.7,
    isSingleWarehouse: false, // 跨海霸王与青白江陆港仓，需提示仅允许单个仓库
    locations: [
      {
        id: "STK-LOC-02",
        warehouseName: "海霸王仓库",
        storeroomName: "露天堆场",
        partitionName: "D区",
        locationPath: "海霸王仓库-露天堆场-D区",
        specificLocation: "堆垛-08",
        inboundTime: "2026-05-12 14:00:00",
        productionDate: "2026-05-01",
        extraInfo: "规格：Φ25mm",
        barcode: "SYZC-BC-20260512-008",
        status: "存货中",
        availableAmount: 800.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "四川建龙物资有限公司",
      },
      {
        id: "STK-LOC-03",
        warehouseName: "青白江国际陆港监管仓",
        storeroomName: "重载仓A",
        partitionName: "2号区",
        locationPath: "青白江国际陆港监管仓-重载仓A-2号区",
        specificLocation: "货位-12",
        inboundTime: "2026-05-15 10:20:00",
        productionDate: "2026-05-05",
        extraInfo: "规格：Φ25mm",
        barcode: "SYZC-BC-20260515-012",
        status: "存货中",
        availableAmount: 576.7,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "四川建龙物资有限公司",
      },
    ],
  },

  // 3. 阜阳大象粮油可用库存
  {
    goodsName: "农产品-大豆原油-国标一级",
    categoryName: "农产品",
    subCategoryName: "大豆油",
    specName: "国标一级",
    unit: "吨",
    totalAvailable: 600.0,
    isSingleWarehouse: true,
    locations: [
      {
        id: "STK-LOC-YX-01",
        warehouseName: "海霸王仓库",
        storeroomName: "油品库",
        partitionName: "3号罐",
        locationPath: "海霸王仓库-油品库-3号罐",
        specificLocation: "罐区-03",
        inboundTime: "2026-05-06 11:30:00",
        productionDate: "2026-04-20",
        extraInfo: "酸价<=0.2",
        barcode: "SYZC-BC-20260506-031",
        status: "存货中",
        availableAmount: 600.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "阜阳大象粮油有限公司",
      },
    ],
  },

  // 4. 成都川工重型机械可用库存
  {
    goodsName: "工程装备-重型锻件-42CrMo",
    categoryName: "黑色金属",
    subCategoryName: "合金钢锻件",
    specName: "42CrMo4",
    unit: "吨",
    totalAvailable: 240.0,
    isSingleWarehouse: true,
    locations: [
      {
        id: "STK-LOC-CG-01",
        warehouseName: "青白江国际陆港监管仓",
        storeroomName: "重载仓B",
        partitionName: "露天垛位",
        locationPath: "青白江国际陆港监管仓-重载仓B-露天垛位",
        specificLocation: "垛位-08",
        inboundTime: "2026-05-14 15:20:00",
        productionDate: "2026-05-01",
        extraInfo: "超声波探伤合格",
        barcode: "SYZC-BC-20260514-088",
        status: "存货中",
        availableAmount: 240.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "成都川工重型机械制造有限公司",
      },
    ],
  },

  // 5. 个人货主张三可用库存
  {
    goodsName: "冷链农副-冻牛肉-特级",
    categoryName: "冷链农副",
    subCategoryName: "冻牛肉",
    specName: "特级-36个月",
    unit: "吨",
    totalAvailable: 100.0,
    isSingleWarehouse: true,
    locations: [
      {
        id: "STK-LOC-04",
        warehouseName: "生鲜冷链仓库",
        storeroomName: "低温冷库A",
        partitionName: "1号冷冻区",
        locationPath: "生鲜冷链仓库-低温冷库A-1号冷冻区",
        specificLocation: "冷架-03-A",
        inboundTime: "2026-04-15 11:20:00",
        productionDate: "2026-04-01",
        extraInfo: "批次：BF-20260415",
        barcode: "SYZC-BC-20260415-881",
        status: "存货中",
        availableAmount: 60.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "张三",
      },
      {
        id: "STK-LOC-05",
        warehouseName: "生鲜冷链仓库",
        storeroomName: "低温冷库A",
        partitionName: "2号冷冻区",
        locationPath: "生鲜冷链仓库-低温冷库A-2号冷冻区",
        specificLocation: "冷架-05-B",
        inboundTime: "2026-04-20 09:10:00",
        productionDate: "2026-04-10",
        extraInfo: "批次：BF-20260420",
        barcode: "SYZC-BC-20260420-882",
        status: "存货中",
        availableAmount: 40.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "张三",
      },
    ],
  },

  // 6. 个人货主李四可用库存
  {
    goodsName: "农产品-白砂糖-特级",
    categoryName: "农产品",
    subCategoryName: "白砂糖",
    specName: "特级",
    unit: "吨",
    totalAvailable: 80.0,
    isSingleWarehouse: true,
    locations: [
      {
        id: "STK-LOC-LS-01",
        warehouseName: "农产品监管仓库",
        storeroomName: "干货库",
        partitionName: "1区",
        locationPath: "农产品监管仓库-干货库-1区",
        specificLocation: "托盘-06",
        inboundTime: "2026-05-01 10:00:00",
        productionDate: "2026-04-15",
        extraInfo: "GB/T 317-2018",
        barcode: "SYZC-BC-20260501-301",
        status: "存货中",
        availableAmount: 80.0,
        outboundAmount: 0,
        unit: "吨",
        ownerName: "李四",
      },
    ],
  },
]
