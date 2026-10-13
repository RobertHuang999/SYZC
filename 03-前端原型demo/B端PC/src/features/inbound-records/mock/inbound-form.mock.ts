import type { OwnerType, RelatedOrderOption } from "../domain/form-types"

export type OwnerSearchRecord = {
  id: string
  ownerType: OwnerType
  name: string
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
    identifierMasked: "185****7112",
    contactPhone: "185****7112",
    idCardNo: "420101********3328",
  },
  {
    id: "owner-zy",
    ownerType: "个人货主",
    name: "张一",
    identifierMasked: "133****0001",
    contactPhone: "133****0001",
    idCardNo: "420101****3328",
  },
  {
    id: "owner-li-ai",
    ownerType: "个人货主",
    name: "李爱",
    identifierMasked: "133****0027",
    contactPhone: "133****0027",
    idCardNo: "510101********1234",
  },
  {
    id: "owner-sy",
    ownerType: "企业货主",
    name: "四川享宇科技有限公司",
    identifierMasked: "915100**********1A",
    contactPhone: "028****8888",
  },
  {
    id: "owner-li-supervise",
    ownerType: "企业货主",
    name: "李一监督",
    identifierMasked: "913100**********2B",
    contactPhone: "021****6666",
  },
]

export function filterOwnerSearchRecords(
  ownerType: OwnerType | "",
  keyword: string
): OwnerSearchRecord[] {
  if (!ownerType) return []
  const kw = keyword.trim().toLowerCase()
  return OWNER_SEARCH_RECORDS.filter((record) => {
    if (record.ownerType !== ownerType) return false
    if (!kw) return true
    const label = formatOwnerSearchLabel(
      record.name,
      record.identifierMasked
    ).toLowerCase()
    return (
      record.name.toLowerCase().includes(kw) ||
      label.includes(kw) ||
      record.identifierMasked.toLowerCase().includes(kw)
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
  { id: "wh-fresh", name: "生鲜仓库" },
  { id: "wh-hbw", name: "海霸王仓库" },
  { id: "wh-dry", name: "干粮仓库" },
]

export const FORM_STOREROOMS: FormStoreroomOption[] = [
  {
    id: "sr-veg-a",
    warehouseId: "wh-fresh",
    name: "蔬菜库房审核",
    auditTag: "审核",
  },
  {
    id: "sr-veg-b",
    warehouseId: "wh-fresh",
    name: "蔬菜库房不审核",
    auditTag: "免审",
  },
  {
    id: "sr-fruit-b",
    warehouseId: "wh-fresh",
    name: "水果库房不审核",
    auditTag: "免审",
  },
  {
    id: "sr-fruit-2",
    warehouseId: "wh-fresh",
    name: "水果库房2",
    auditTag: "审核",
  },
  {
    id: "sr-fruit-a",
    warehouseId: "wh-fresh",
    name: "水果库房审核",
    auditTag: "审核",
  },
  {
    id: "sr-free",
    warehouseId: "wh-hbw",
    name: "常温库房免审",
    auditTag: "免审",
  },
]

export const GOODS_SPEC_TREE: GoodsSpecTemplate[] = [
  {
    category: "水果",
    variety: "苹果",
    spec: "新疆-特级",
    measureLabel: "重量",
    units: ["箱", "吨", "公斤"],
    defaultUnit: "箱",
  },
  {
    category: "干果",
    variety: "瓜子饼干",
    spec: "24个月",
    measureLabel: "重量",
    units: ["kg", "箱"],
    defaultUnit: "kg",
  },
  {
    category: "冻货",
    variety: "鸡翅",
    spec: "四川-特级-2025",
    measureLabel: "重量",
    units: ["吨", "公斤", "斤"],
    defaultUnit: "吨",
  },
  {
    category: "有色金属",
    variety: "电解铜",
    spec: "1号标准",
    measureLabel: "重量",
    units: ["吨", "公斤"],
    defaultUnit: "吨",
  },
]

export const FORM_PARTITIONS: Record<string, string[]> = {
  "sr-veg-a": ["绿叶分区", "超棒分区"],
  "sr-veg-b": ["B区冷藏", "B区常温"],
  "sr-fruit-b": ["荔枝分区", "苹果分区"],
  "sr-fruit-2": ["2号分区", "3号分区"],
  "sr-fruit-a": ["荔枝分区", "苹果分区"],
  "sr-free": ["A区", "B区"],
}

export const RELATED_MORTGAGE_ORDERS: RelatedOrderOption[] = [
  {
    id: "mo-1",
    orderNo: "1981237772635082753",
    ownerName: "原原李",
    ownerIdentifierMasked: "185****7112",
    goodsSummary: [
      "蔬菜-辣椒-云南-有机-12斤",
      "蔬菜-辣椒-陕西-无机-90公斤",
      "蔬菜-辣椒-四川-特级-500箱",
    ],
    mortgageTime: "2025-10-23 13:54:50",
  },
]

export const RELATED_PLEDGE_ORDERS: RelatedOrderOption[] = [
  {
    id: "po-1",
    orderNo: "2056657552510107649",
    ownerName: "李爱",
    ownerIdentifierMasked: "133****0027",
    goodsSummary: ["水果-苹果-新疆-特级"],
    mortgageTime: "2025-09-12 10:20:00",
  },
]

export const RELATED_WAREHOUSE_RECEIPT_ORDERS: RelatedOrderOption[] = [
  {
    id: "cd-1",
    orderNo: "CD2061264146428280353",
    ownerName: "阜阳市大象粮油产运有限公司",
    ownerIdentifierMasked: "91341202MA2U0JHJ3F",
    goodsSummary: ["粮食-玉米-国标二等", "粮食-小麦-强筋麦"],
    mortgageTime: "2026-06-01 09:40:00",
  },
]

export function getRelatedOrdersByType(
  inboundType: string
): RelatedOrderOption[] {
  if (inboundType === "抵押入库") return RELATED_MORTGAGE_ORDERS
  if (inboundType === "质押入库") return RELATED_PLEDGE_ORDERS
  return []
}

export const EXISTING_OWNERS = new Set([
  "四川享宇科技有限公司",
  "李一监督",
  "张一",
  "原原李",
])

