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
    identifier: "133****0001",
    phone: "133****0001",
    idCard: "51010419880912XXXX",
  },
  {
    id: "OWN-06",
    name: "李四",
    type: "个人",
    identifier: "138****0002",
    phone: "138****0002",
    idCard: "51010519900215XXXX",
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
    orderNo: "CD206126414642828",
    type: "仓单出库",
    ownerName: "阜阳大象粮油有限公司",
    ownerIdentifier: "91341202MA2U0JHJ3F",
    status: "允许出库（有效仓单）",
    warehouseName: "海霸王仓库",
    items: [
      {
        goodsName: "黑色金属-热轧卷板-Q235",
        categoryName: "黑色金属",
        subCategoryName: "热轧卷板",
        specName: "Q235B",
        locationPath: "海霸王仓库-3号库房-C区",
        warehouseName: "海霸王仓库",
        storeroomName: "3号库房",
        partitionName: "C区",
        availableAmount: 300.0,
        unit: "吨",
        price: 3800,
        barcode: "SYZC-BC-20260520-101",
        extraInfo: "材质：Q235B",
      },
    ],
  },
  {
    orderNo: "DY202605250002",
    type: "抵押出库",
    ownerName: "李四",
    ownerIdentifier: "138****0002",
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
]
