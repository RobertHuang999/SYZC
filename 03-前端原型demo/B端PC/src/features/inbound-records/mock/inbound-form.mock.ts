import type { OwnerType, RelatedOrderOption } from "../domain/form-types"

export type OwnerSearchRecord = {
  id: string
  ownerType: OwnerType
  name: string
  ownerIdentifier: string
  identifierMasked: string
  contactPhone?: string
  idCardNo?: string
}

export function formatOwnerSearchLabel(name: string, identifierMasked: string) {
  if (!name) return ""
  return identifierMasked ? `${name} (${identifierMasked})` : name
}

export const OWNER_SEARCH_RECORDS: OwnerSearchRecord[] = [
  {
    id: "owner-yyl",
    ownerType: "个人货主",
    name: "原原李",
    ownerIdentifier: "18512347112",
    identifierMasked: "185****7112",
    contactPhone: "18512347112",
    idCardNo: "420101199003073328",
  },
  {
    id: "owner-zy",
    ownerType: "个人货主",
    name: "张一",
    ownerIdentifier: "13308000001",
    identifierMasked: "133****0001",
    contactPhone: "13308000001",
    idCardNo: "510104198510123328",
  },
  {
    id: "owner-li-ai",
    ownerType: "个人货主",
    name: "李爱",
    ownerIdentifier: "13308000027",
    identifierMasked: "133****0027",
    contactPhone: "13308000027",
    idCardNo: "510101199208151234",
  },
  {
    id: "owner-wh",
    ownerType: "个人货主",
    name: "王华",
    ownerIdentifier: "13910012345",
    identifierMasked: "139****2345",
    contactPhone: "13910012345",
    idCardNo: "110101198606201518",
  },
  {
    id: "owner-hx",
    ownerType: "企业货主",
    name: "四川华西大宗商品供应链管理有限公司",
    ownerIdentifier: "91510100MA6289B51X",
    identifierMasked: "915101**********1X",
    contactPhone: "028-87654321",
  },
  {
    id: "owner-sy",
    ownerType: "企业货主",
    name: "四川享宇科技有限公司",
    ownerIdentifier: "91510000MA6288881A",
    identifierMasked: "915100**********1A",
    contactPhone: "028-85118888",
  },
  {
    id: "owner-dx",
    ownerType: "企业货主",
    name: "阜阳市大象粮油产运有限公司",
    ownerIdentifier: "91341202MA2U0JHJ3F",
    identifierMasked: "913412**********3F",
    contactPhone: "0558-2233445",
  },
  {
    id: "owner-zj",
    ownerType: "企业货主",
    name: "上海中建物资贸易有限公司",
    ownerIdentifier: "91310000MA1FL2882B",
    identifierMasked: "913100**********2B",
    contactPhone: "021-68886666",
  },
]

export function filterOwnerSearchRecords(
  ownerType: OwnerType | "",
  keyword: string
): OwnerSearchRecord[] {
  const kw = keyword.trim().toLowerCase()
  return OWNER_SEARCH_RECORDS.filter((record) => {
    if (ownerType && record.ownerType !== ownerType) return false
    if (!kw) return true
    const label = formatOwnerSearchLabel(
      record.name,
      record.identifierMasked
    ).toLowerCase()
    return (
      record.name.toLowerCase().includes(kw) ||
      label.includes(kw) ||
      record.identifierMasked.toLowerCase().includes(kw) ||
      record.ownerIdentifier.toLowerCase().includes(kw) ||
      (record.idCardNo ? record.idCardNo.toLowerCase().includes(kw) : false)
    )
  })
}

export type FormWarehouseOption = {
  id: string
  name: string
}

export type FormStoreroomOption = {
  id: string
  warehouseId: string
  name: string
  auditTag: "审核" | "免审"
}

export type GoodsSpecTemplate = {
  category: string
  variety: string
  spec: string
  measureLabel: string
  units: string[]
  defaultUnit: string
}

export const FORM_WAREHOUSES: FormWarehouseOption[] = [
  { id: "wh-1", name: "青白江大宗商品监管1号仓" },
  { id: "wh-2", name: "龙泉驿综合工业备件2号仓" },
  { id: "wh-3", name: "天府现代农产品冷链物流仓" },
]

export const FORM_STOREROOMS: FormStoreroomOption[] = [
  { id: "sr-1", warehouseId: "wh-1", name: "1号常温标准库房", auditTag: "审核" },
  { id: "sr-2", warehouseId: "wh-1", name: "2号高位重型库房", auditTag: "审核" },
  { id: "sr-3", warehouseId: "wh-1", name: "3号露天堆场", auditTag: "免审" },
  { id: "sr-4", warehouseId: "wh-2", name: "A区精密恒温库", auditTag: "审核" },
  { id: "sr-5", warehouseId: "wh-2", name: "B区通用工业库", auditTag: "审核" },
  { id: "sr-6", warehouseId: "wh-3", name: "冷链1号深冷库", auditTag: "审核" },
]

export const GOODS_SPEC_TREE: GoodsSpecTemplate[] = [
  {
    category: "有色金属",
    variety: "电解铜",
    spec: "Cu-CATH-1 99.9935%",
    measureLabel: "入库重量",
    units: ["吨", "公斤"],
    defaultUnit: "吨",
  },
  {
    category: "有色金属",
    variety: "铝锭",
    spec: "A00 (Al99.70%)",
    measureLabel: "入库重量",
    units: ["吨", "公斤"],
    defaultUnit: "吨",
  },
  {
    category: "黑色金属",
    variety: "热轧卷板",
    spec: "Q235B 5.75*1500*C",
    measureLabel: "入库重量",
    units: ["吨"],
    defaultUnit: "吨",
  },
  {
    category: "黑色金属",
    variety: "螺纹钢",
    spec: "HRB400E Φ18-25mm",
    measureLabel: "入库重量",
    units: ["吨"],
    defaultUnit: "吨",
  },
  {
    category: "农产品",
    variety: "玉米",
    spec: "国标二等 黄玉米",
    measureLabel: "入库重量",
    units: ["吨", "公斤"],
    defaultUnit: "吨",
  },
]

export const FORM_PARTITIONS: Record<string, string[]> = {
  "sr-1": ["A区重型货架", "B区地堆区", "C区暂存区"],
  "sr-2": ["1号立体库位", "2号高架区", "3号特货区"],
  "sr-3": ["东侧露天垛位", "西侧集装箱位"],
  "sr-4": ["精密恒温A架", "精密恒温B架"],
  "sr-5": ["重件存放区", "标准货架区"],
  "sr-6": ["冷链排管A区", "冷链低温垛位"],
}

// 关联质押单
export const RELATED_PLEDGE_ORDERS: RelatedOrderOption[] = [
  {
    id: "po-1",
    orderNo: "ZY20260901-0012",
    orderType: "质押单",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerType: "企业货主",
    ownerIdentifier: "91510100MA6289B51X",
    ownerIdentifierMasked: "915101**********1X",
    contactPhone: "028-87654321",
    goodsSummary: ["有色金属 - 电解铜 - 标准阴极铜 (500吨)"],
    businessTime: "2026-09-01 10:20:00",
    warehouseId: "wh-1",
    warehouseName: "青白江大宗商品监管1号仓",
    amountSummary: "500.0000 吨",
  },
  {
    id: "po-2",
    orderNo: "ZY20260905-0045",
    orderType: "质押单",
    ownerName: "张一",
    ownerType: "个人货主",
    ownerIdentifier: "13308000001",
    ownerIdentifierMasked: "133****0001",
    idCardNo: "510104198510123328",
    contactPhone: "13308000001",
    goodsSummary: ["黑色金属 - 热轧卷板 - Q235B (1,200吨)"],
    businessTime: "2026-09-05 14:15:30",
    warehouseId: "wh-1",
    warehouseName: "青白江大宗商品监管1号仓",
    amountSummary: "1,200.0000 吨",
  },
  {
    id: "po-3",
    orderNo: "ZY20260902-0021",
    orderType: "质押单",
    ownerName: "原原李",
    ownerType: "个人货主",
    ownerIdentifier: "18512347112",
    ownerIdentifierMasked: "185****7112",
    idCardNo: "420101199003073328",
    contactPhone: "18512347112",
    goodsSummary: ["有色金属 - 铝锭 - A00 (300吨)"],
    businessTime: "2026-09-02 11:30:00",
    warehouseId: "wh-1",
    warehouseName: "青白江大宗商品监管1号仓",
    amountSummary: "300.0000 吨",
  },
  {
    id: "po-4",
    orderNo: "ZY20260912-0058",
    orderType: "质押单",
    ownerName: "李爱",
    ownerType: "个人货主",
    ownerIdentifier: "13308000027",
    ownerIdentifierMasked: "133****0027",
    idCardNo: "510101199208151234",
    contactPhone: "13308000027",
    goodsSummary: ["化工产品 - 聚丙烯 - PP-T30S (400吨)"],
    businessTime: "2026-09-12 16:10:00",
    warehouseId: "wh-2",
    warehouseName: "龙泉驿综合工业备件2号仓",
    amountSummary: "400.0000 吨",
  },
]

// 关联抵押单
export const RELATED_MORTGAGE_ORDERS: RelatedOrderOption[] = [
  {
    id: "mo-1",
    orderNo: "DY20260818-0056",
    orderType: "抵押单",
    ownerName: "原原李",
    ownerType: "个人货主",
    ownerIdentifier: "18512347112",
    ownerIdentifierMasked: "185****7112",
    idCardNo: "420101199003073328",
    contactPhone: "18512347112",
    goodsSummary: ["有色金属 - 铝锭 - A00 (300吨)"],
    businessTime: "2026-08-18 13:54:50",
    warehouseId: "wh-1",
    warehouseName: "青白江大宗商品监管1号仓",
    amountSummary: "300.0000 吨",
  },
  {
    id: "mo-2",
    orderNo: "DY20260825-0038",
    orderType: "抵押单",
    ownerName: "张一",
    ownerType: "个人货主",
    ownerIdentifier: "13308000001",
    ownerIdentifierMasked: "133****0001",
    idCardNo: "510104198510123328",
    contactPhone: "13308000001",
    goodsSummary: ["黑色金属 - 高线/线材 - HPB300 (600吨)"],
    businessTime: "2026-08-25 15:20:00",
    warehouseId: "wh-2",
    warehouseName: "龙泉驿综合工业备件2号仓",
    amountSummary: "600.0000 吨",
  },
  {
    id: "mo-3",
    orderNo: "DY20260822-0091",
    orderType: "抵押单",
    ownerName: "阜阳市大象粮油产运有限公司",
    ownerType: "企业货主",
    ownerIdentifier: "91341202MA2U0JHJ3F",
    ownerIdentifierMasked: "913412**********3F",
    contactPhone: "0558-2233445",
    goodsSummary: ["农产品 - 玉米 - 国标二等 (2,500吨)"],
    businessTime: "2026-08-22 09:30:15",
    warehouseId: "wh-3",
    warehouseName: "天府现代农产品冷链物流仓",
    amountSummary: "2,500.0000 吨",
  },
  {
    id: "mo-4",
    orderNo: "DY20260830-0044",
    orderType: "抵押单",
    ownerName: "李爱",
    ownerType: "个人货主",
    ownerIdentifier: "13308000027",
    ownerIdentifierMasked: "133****0027",
    idCardNo: "510101199208151234",
    contactPhone: "13308000027",
    goodsSummary: ["化工产品 - 聚乙烯 - PE-HDPE (350吨)"],
    businessTime: "2026-08-30 14:00:00",
    warehouseId: "wh-2",
    warehouseName: "龙泉驿综合工业备件2号仓",
    amountSummary: "350.0000 吨",
  },
]

// 关联监管服务单
export const RELATED_SUPERVISION_ORDERS: RelatedOrderOption[] = [
  {
    id: "jg-1",
    orderNo: "JG20260908-0033",
    orderType: "监管服务单",
    ownerName: "张一",
    ownerType: "个人货主",
    ownerIdentifier: "13308000001",
    ownerIdentifierMasked: "133****0001",
    idCardNo: "510104198510123328",
    contactPhone: "13308000001",
    goodsSummary: ["黑色金属 - 螺纹钢 - HRB400E (800吨)"],
    businessTime: "2026-09-08 11:05:00",
    warehouseId: "wh-2",
    warehouseName: "龙泉驿综合工业备件2号仓",
    amountSummary: "800.0000 吨",
  },
  {
    id: "jg-2",
    orderNo: "JG20260905-0018",
    orderType: "监管服务单",
    ownerName: "原原李",
    ownerType: "个人货主",
    ownerIdentifier: "18512347112",
    ownerIdentifierMasked: "185****7112",
    idCardNo: "420101199003073328",
    contactPhone: "18512347112",
    goodsSummary: ["有色金属 - 铝合金锭 - ADC12 (200吨)"],
    businessTime: "2026-09-05 10:45:00",
    warehouseId: "wh-1",
    warehouseName: "青白江大宗商品监管1号仓",
    amountSummary: "200.0000 吨",
  },
  {
    id: "jg-3",
    orderNo: "JG20260910-0077",
    orderType: "监管服务单",
    ownerName: "上海中建物资贸易有限公司",
    ownerType: "企业货主",
    ownerIdentifier: "91310000MA1FL2882B",
    ownerIdentifierMasked: "913100**********2B",
    contactPhone: "021-68886666",
    goodsSummary: ["黑色金属 - 热轧卷板 - Q235B (1,500吨)"],
    businessTime: "2026-09-10 16:40:00",
    warehouseId: "wh-1",
    warehouseName: "青白江大宗商品监管1号仓",
    amountSummary: "1,500.0000 吨",
  },
  {
    id: "jg-4",
    orderNo: "JG20260901-0015",
    orderType: "监管服务单",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerType: "企业货主",
    ownerIdentifier: "91510100MA6289B51X",
    ownerIdentifierMasked: "915101**********1X",
    contactPhone: "028-87654321",
    goodsSummary: ["有色金属 - 阴极铜 - Cu-CATH-1 (600吨)"],
    businessTime: "2026-09-01 09:15:00",
    warehouseId: "wh-1",
    warehouseName: "青白江大宗商品监管1号仓",
    amountSummary: "600.0000 吨",
  },
]

export function getRelatedOrdersByType(
  inboundType: string
): RelatedOrderOption[] {
  if (inboundType === "抵押入库") return RELATED_MORTGAGE_ORDERS
  if (inboundType === "质押入库") return RELATED_PLEDGE_ORDERS
  if (inboundType === "监管服务入库") return RELATED_SUPERVISION_ORDERS
  // 默认聚合展示所有单据
  return [
    ...RELATED_PLEDGE_ORDERS,
    ...RELATED_MORTGAGE_ORDERS,
    ...RELATED_SUPERVISION_ORDERS,
  ]
}

export const EXISTING_OWNERS = new Set([
  "四川华西大宗商品供应链管理有限公司",
  "四川享宇科技有限公司",
  "阜阳市大象粮油产运有限公司",
  "上海中建物资贸易有限公司",
  "原原李",
  "张一",
  "李爱",
  "王华",
])
