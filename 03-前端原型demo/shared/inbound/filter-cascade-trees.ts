/** PC / H5 入库列表筛选级联 Mock 树（对齐现网 digitalAllReposTree + chglStockList） */

export type CascadeLeaf = { id: string; name: string; fullKey: string }

export type CascadeLevel2 = { id: string; name: string; children: CascadeLeaf[] }

export type CascadeLevel1 = { id: string; name: string; children: CascadeLevel2[] }

const GOODS_SPEC_LINES = [
  "冻货-鸡翅-四川-特级-2025",
  "冻货-牛肉-36个月",
  "冻货-鸡腿-四川",
  "水果-苹果-新疆-特级",
  "水果-苹果-新疆红富士-特级",
  "水果-香蕉-海南",
  "有色金属-电解铜-1号标准",
  "钢材-热轧卷板-Q235B-3.0mm",
  "钢材-冷轧卷板-SPCC-1.0mm",
  "有色金属-铝锭-ADC12",
  "橡胶-天然橡胶-20号标胶",
  "化工-聚乙烯-LLDPE-7042",
  "粮食-玉米-国标二等",
  "粮食-小麦-强筋麦",
] as const

function slug(s: string) {
  return s.replace(/\s+/g, "_")
}

export function buildInboundGoodsFilterTree(): CascadeLevel1[] {
  const catMap = new Map<string, Map<string, CascadeLeaf[]>>()
  for (const line of GOODS_SPEC_LINES) {
    const parts = line.split("-")
    if (parts.length < 3) continue
    const category = parts[0]!
    const variety = parts[1]!
    const spec = parts.slice(2).join("-")
    if (!catMap.has(category)) catMap.set(category, new Map())
    const varMap = catMap.get(category)!
    if (!varMap.has(variety)) varMap.set(variety, [])
    varMap.get(variety)!.push({ id: slug(line), name: spec, fullKey: line })
  }
  return [...catMap.entries()].map(([catName, varMap]) => ({
    id: slug(catName),
    name: catName,
    children: [...varMap.entries()].map(([varName, specs]) => ({
      id: slug(`${catName}-${varName}`),
      name: varName,
      children: specs,
    })),
  }))
}

export type WarehouseStoreroomNode = {
  id: string
  name: string
  storerooms: CascadeLeaf[]
}

export const INBOUND_WAREHOUSE_STOREROOM_TREE: WarehouseStoreroomNode[] = [
  {
    id: "wh-hbw",
    name: "海霸王仓库",
    storerooms: [
      { id: "sr-hbw-1", name: "冻库1审核", fullKey: "海霸王仓库|冻库1审核" },
      { id: "sr-hbw-2", name: "常温标准库房", fullKey: "海霸王仓库|常温标准库房" },
    ],
  },
  {
    id: "wh-hbw-c",
    name: "海霸王C仓库",
    storerooms: [{ id: "sr-hbw-c-1", name: "默认库房", fullKey: "海霸王C仓库|默认库房" }],
  },
  {
    id: "wh-sx",
    name: "生鲜仓库",
    storerooms: [
      { id: "sr-sx-1", name: "水果库房审核", fullKey: "生鲜仓库|水果库房审核" },
      { id: "sr-sx-2", name: "蔬菜库房审核", fullKey: "生鲜仓库|蔬菜库房审核" },
    ],
  },
  {
    id: "wh-gl",
    name: "干粮仓库",
    storerooms: [{ id: "sr-gl-1", name: "干粮主库", fullKey: "干粮仓库|干粮主库" }],
  },
]

export const INBOUND_GOODS_FILTER_TREE = buildInboundGoodsFilterTree()
