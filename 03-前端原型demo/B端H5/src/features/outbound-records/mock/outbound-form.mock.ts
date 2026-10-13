export interface OwnerCandidate {
  id: string
  name: string
  type: "企业" | "个人"
  identifier: string
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

export const FORM_WAREHOUSES = [
  { id: "W-01", name: "海霸王仓库" },
  { id: "W-02", name: "生鲜冷链仓库" },
  { id: "W-03", name: "农产品监管仓库" },
  { id: "W-04", name: "青白江国际陆港监管仓" },
]

export interface RelatedOrderItem {
  orderNo: string
  type: "仓单出库" | "质押出库" | "抵押出库"
  ownerName: string
  ownerIdentifier: string
  status: string
  warehouseName: string
  items: {
    goodsName: string
    categoryName: string
    specName: string
    locationPath: string
    availableAmount: number
    unit: string
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
    status: "存续有效",
    warehouseName: "海霸王仓库",
    items: [
      {
        goodsName: "有色金属-电解铜-国标",
        categoryName: "有色金属",
        specName: "国标",
        locationPath: "海霸王仓库-1号库房-A区",
        availableAmount: 500,
        unit: "吨",
        barcode: "SYZC-BC-20260510-001",
        extraInfo: "牌号：Cu-CATH-1",
      },
      {
        goodsName: "黑色金属-热轧卷板-Q235",
        categoryName: "黑色金属",
        specName: "Q235",
        locationPath: "海霸王仓库-2号库房-B区",
        availableAmount: 200,
        unit: "吨",
        barcode: "SYZC-BC-20260510-002",
        extraInfo: "厚度：5.75mm",
      },
    ],
  },
  {
    orderNo: "CD20260515002",
    type: "仓单出库",
    ownerName: "四川建龙物资有限公司",
    ownerIdentifier: "91510100MA6XXXXXXX",
    status: "已生效",
    warehouseName: "海霸王仓库",
    items: [
      {
        goodsName: "有色金属-铝锭-A00",
        categoryName: "有色金属",
        specName: "A00",
        locationPath: "海霸王仓库-3号库房-C区",
        availableAmount: 850,
        unit: "吨",
        barcode: "SYZC-BC-20260510-004",
        extraInfo: "纯度：99.7%",
      },
    ],
  },
  {
    orderNo: "DY20260520003",
    type: "抵押出库",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerIdentifier: "91510100MA6289B51X",
    status: "存续有效",
    warehouseName: "青白江国际陆港监管仓",
    items: [
      {
        goodsName: "农产品-白砂糖-一级白砂糖",
        categoryName: "农产品",
        specName: "一级白砂糖",
        locationPath: "青白江国际陆港监管仓-1号库房-A区",
        availableAmount: 620,
        unit: "吨",
        barcode: "SYZC-BC-20260510-005",
        extraInfo: "包装：50kg/袋",
      },
    ],
  },
]

export const COMMON_AVAILABLE_STOCK = [
  {
    goodsName: "有色金属-电解铜-国标",
    categoryName: "有色金属",
    specName: "国标",
    locationPath: "海霸王仓库-1号库房-A区",
    availableAmount: 700,
    unit: "吨",
    barcode: "SYZC-BC-20260510-001",
    extraInfo: "牌号：Cu-CATH-1",
  },
  {
    goodsName: "黑色金属-热轧卷板-Q235",
    categoryName: "黑色金属",
    specName: "Q235",
    locationPath: "海霸王仓库-2号库房-B区",
    availableAmount: 400,
    unit: "吨",
    barcode: "SYZC-BC-20260510-002",
    extraInfo: "厚度：5.75mm",
  },
  {
    goodsName: "有色金属-铝锭-A00",
    categoryName: "有色金属",
    specName: "A00",
    locationPath: "海霸王仓库-3号库房-C区",
    availableAmount: 850,
    unit: "吨",
    barcode: "SYZC-BC-20260510-004",
    extraInfo: "纯度：99.7%",
  },
  {
    goodsName: "农产品-白砂糖-一级白砂糖",
    categoryName: "农产品",
    specName: "一级白砂糖",
    locationPath: "海霸王仓库-4号库房-D区",
    availableAmount: 300,
    unit: "吨",
    barcode: "SYZC-BC-20260510-005",
    extraInfo: "包装：50kg/袋",
  },
]
