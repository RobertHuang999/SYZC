/**
 * 存货管理 Mock 数据源
 * 严格对齐森云科技大宗商品质押监管业务真源（阴极铜、铝锭、热轧卷板、特种钛材等）
 * 包含规范仓库、真实企业货主及真实大宗商品规格
 */

export interface RepoRowData {
  id: string
  warehouseName: string
  totalQty: string
  totalVal: string
  availQty: string
  availVal: string
  frozenQty: string
  frozenVal: string
  periodInQty: string
  periodOutQty: string
}

export interface GoodsRowData {
  id: string
  goodsName: string
  unitPrice: string
  unit: string
  totalQty: string
  totalVal: string
  availQty: string
  availVal: string
  frozenQty: string
  frozenVal: string
  periodInQty: string
  periodOutQty: string
}

export interface OwnerRowData {
  id: string
  ownerName: string
  ownerCode: string
  contact: string
  totalQty: string
  totalVal: string
  availQty: string
  availVal: string
  frozenQty: string
  frozenVal: string
  periodInQty: string
  periodOutQty: string
}

// 1. 仓库视图数据（标准大宗商品监管仓库）
export const REPO_ROWS_MOCK: RepoRowData[] = [
  {
    id: "r-1",
    warehouseName: "青白江大宗商品监管1号仓",
    totalQty: "1,850.5000",
    totalVal: "9,642.7250 万元",
    availQty: "1,520.5000",
    availVal: "7,925.7250 万元",
    frozenQty: "330.0000",
    frozenVal: "1,717.0000 万元",
    periodInQty: "350.0000",
    periodOutQty: "120.0000",
  },
  {
    id: "r-2",
    warehouseName: "德阳金属型材专储仓",
    totalQty: "3,420.0000",
    totalVal: "1,299.6000 万元",
    availQty: "2,620.0000",
    availVal: "995.6000 万元",
    frozenQty: "800.0000",
    frozenVal: "304.0000 万元",
    periodInQty: "600.0000",
    periodOutQty: "150.0000",
  },
  {
    id: "r-3",
    warehouseName: "海霸王大宗冷链监管仓",
    totalQty: "680.2500",
    totalVal: "2,857.0500 万元",
    availQty: "620.2500",
    availVal: "2,605.0500 万元",
    frozenQty: "60.0000",
    frozenVal: "252.0000 万元",
    periodInQty: "120.0000",
    periodOutQty: "45.0000",
  },
  {
    id: "r-4",
    warehouseName: "攀西特种有色金属仓",
    totalQty: "125.8000",
    totalVal: "--", // 含有特种钛合金未定价物资
    availQty: "125.8000",
    availVal: "--",
    frozenQty: "0.0000",
    frozenVal: "--",
    periodInQty: "50.0000",
    periodOutQty: "0.0000",
  },
  {
    id: "r-5",
    warehouseName: "乐山高新硅业原料监管仓",
    totalQty: "2,150.0000",
    totalVal: "2,472.5000 万元",
    availQty: "1,850.0000",
    availVal: "2,127.5000 万元",
    frozenQty: "300.0000",
    frozenVal: "345.0000 万元",
    periodInQty: "400.0000",
    periodOutQty: "80.0000",
  },
  {
    id: "r-6",
    warehouseName: "成都双流综合保税监管仓",
    totalQty: "920.0000",
    totalVal: "1,821.6000 万元",
    availQty: "820.0000",
    availVal: "1,623.6000 万元",
    frozenQty: "100.0000",
    frozenVal: "198.0000 万元",
    periodInQty: "180.0000",
    periodOutQty: "60.0000",
  },
  {
    id: "r-7",
    warehouseName: "重庆果园港沿江大宗枢纽仓",
    totalQty: "1,450.0000",
    totalVal: "551.0000 万元",
    availQty: "1,200.0000",
    availVal: "456.0000 万元",
    frozenQty: "250.0000",
    frozenVal: "95.0000 万元",
    periodInQty: "300.0000",
    periodOutQty: "90.0000",
  },
]

// 2. 货物视图数据（真实大宗品类）
export const GOODS_ROWS_MOCK: GoodsRowData[] = [
  {
    id: "g-1",
    goodsName: "有色金属-阴极铜-Cu-CATH-1",
    unitPrice: "7.45 万元",
    unit: "吨",
    totalQty: "1,150.5000",
    totalVal: "8,571.2250 万元",
    availQty: "920.5000",
    availVal: "6,857.7250 万元",
    frozenQty: "230.0000",
    frozenVal: "1,713.5000 万元",
    periodInQty: "250.0000",
    periodOutQty: "80.0000",
  },
  {
    id: "g-2",
    goodsName: "有色金属-A00铝锭-Al99.70",
    unitPrice: "1.98 万元",
    unit: "吨",
    totalQty: "1,620.0000",
    totalVal: "3,207.6000 万元",
    availQty: "1,420.0000",
    availVal: "2,811.6000 万元",
    frozenQty: "200.0000",
    frozenVal: "396.0000 万元",
    periodInQty: "280.0000",
    periodOutQty: "70.0000",
  },
  {
    id: "g-3",
    goodsName: "黑色金属-热轧卷板-Q235B",
    unitPrice: "0.38 万元",
    unit: "吨",
    totalQty: "2,450.0000",
    totalVal: "931.0000 万元",
    availQty: "1,900.0000",
    availVal: "722.0000 万元",
    frozenQty: "550.0000",
    frozenVal: "209.0000 万元",
    periodInQty: "420.0000",
    periodOutQty: "110.0000",
  },
  {
    id: "g-4",
    goodsName: "黑色金属-螺纹钢-HRB400E",
    unitPrice: "0.36 万元",
    unit: "吨",
    totalQty: "1,950.0000",
    totalVal: "702.0000 万元",
    availQty: "1,450.0000",
    availVal: "522.0000 万元",
    frozenQty: "500.0000",
    frozenVal: "180.0000 万元",
    periodInQty: "360.0000",
    periodOutQty: "95.0000",
  },
  {
    id: "g-5",
    goodsName: "冷链大宗-新西兰冷冻原切牛肉卷-Grade-A",
    unitPrice: "4.20 万元",
    unit: "吨",
    totalQty: "680.2500",
    totalVal: "2,857.0500 万元",
    availQty: "620.2500",
    availVal: "2,605.0500 万元",
    frozenQty: "60.0000",
    frozenVal: "252.0000 万元",
    periodInQty: "120.0000",
    periodOutQty: "45.0000",
  },
  {
    id: "g-6",
    goodsName: "能源化工-工业硅-Si5530",
    unitPrice: "1.15 万元",
    unit: "吨",
    totalQty: "2,150.0000",
    totalVal: "2,472.5000 万元",
    availQty: "1,850.0000",
    availVal: "2,127.5000 万元",
    frozenQty: "300.0000",
    frozenVal: "345.0000 万元",
    periodInQty: "400.0000",
    periodOutQty: "80.0000",
  },
  {
    id: "g-7",
    goodsName: "稀有金属-航空钛合金棒材-TC4-X",
    unitPrice: "--", // 特种未定价物资
    unit: "吨",
    totalQty: "125.8000",
    totalVal: "--",
    availQty: "125.8000",
    availVal: "--",
    frozenQty: "0.0000",
    frozenVal: "--",
    periodInQty: "50.0000",
    periodOutQty: "0.0000",
  },
  {
    id: "g-8",
    goodsName: "有色金属-锌锭-Zn99.995",
    unitPrice: "2.25 万元",
    unit: "吨",
    totalQty: "450.0000",
    totalVal: "1,012.5000 万元",
    availQty: "400.0000",
    availVal: "900.0000 万元",
    frozenQty: "50.0000",
    frozenVal: "112.5000 万元",
    periodInQty: "120.0000",
    periodOutQty: "30.0000",
  },
]

// 3. 货主视图数据（真实大宗贸易及加工企业）
export const OWNER_ROWS_MOCK: OwnerRowData[] = [
  {
    id: "o-1",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerCode: "91510100MA6XXXXXX1",
    contact: "138****8801",
    totalQty: "2,450.5000",
    totalVal: "10,245.5250 万元",
    availQty: "2,050.5000",
    availVal: "8,458.5250 万元",
    frozenQty: "400.0000",
    frozenVal: "1,787.0000 万元",
    periodInQty: "450.0000",
    periodOutQty: "120.0000",
  },
  {
    id: "o-2",
    ownerName: "德阳利达金属材料制造有限公司",
    ownerCode: "91510600MA4XXXXXX2",
    contact: "139****1202",
    totalQty: "3,120.0000",
    totalVal: "1,185.6000 万元",
    availQty: "2,420.0000",
    availVal: "919.6000 万元",
    frozenQty: "700.0000",
    frozenVal: "266.0000 万元",
    periodInQty: "520.0000",
    periodOutQty: "140.0000",
  },
  {
    id: "o-3",
    ownerName: "成都锦城大宗冷链商贸有限公司",
    ownerCode: "91510100MA7XXXXXX3",
    contact: "137****3403",
    totalQty: "680.2500",
    totalVal: "2,857.0500 万元",
    availQty: "620.2500",
    availVal: "2,605.0500 万元",
    frozenQty: "60.0000",
    frozenVal: "252.0000 万元",
    periodInQty: "120.0000",
    periodOutQty: "45.0000",
  },
  {
    id: "o-4",
    ownerName: "攀西特种金属新材料科技有限公司",
    ownerCode: "91510400MA6XXXXXX4",
    contact: "136****5604",
    totalQty: "125.8000",
    totalVal: "--", // 对应 TC4-X 航空钛合金未定价
    availQty: "125.8000",
    availVal: "--",
    frozenQty: "0.0000",
    frozenVal: "--",
    periodInQty: "50.0000",
    periodOutQty: "0.0000",
  },
  {
    id: "o-5",
    ownerName: "重庆渝融金属材料有限责任公司",
    ownerCode: "91500000MA5XXXXXX5",
    contact: "135****7805",
    totalQty: "1,850.0000",
    totalVal: "1,984.2000 万元",
    availQty: "1,500.0000",
    availVal: "1,608.2000 万元",
    frozenQty: "350.0000",
    frozenVal: "376.0000 万元",
    periodInQty: "380.0000",
    periodOutQty: "105.0000",
  },
  {
    id: "o-6",
    ownerName: "乐山硅谷实业开发集团有限公司",
    ownerCode: "91511100MA6XXXXXX6",
    contact: "133****9906",
    totalQty: "2,350.0000",
    totalVal: "2,702.5000 万元",
    availQty: "2,020.0000",
    availVal: "2,323.5000 万元",
    frozenQty: "330.0000",
    frozenVal: "379.0000 万元",
    periodInQty: "430.0000",
    periodOutQty: "85.0000",
  },
  {
    id: "o-7",
    ownerName: "李国胜（个体工商特种金属经营部）",
    ownerCode: "510104198205******",
    contact: "185****7962",
    totalQty: "200.0000",
    totalVal: "782.5000 万元",
    availQty: "180.0000",
    availVal: "704.5000 万元",
    frozenQty: "20.0000",
    frozenVal: "78.0000 万元",
    periodInQty: "50.0000",
    periodOutQty: "15.0000",
  },
]
