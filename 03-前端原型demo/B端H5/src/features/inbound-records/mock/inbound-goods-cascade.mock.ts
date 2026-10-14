/** 对齐 PC 入库记录列表货品筛选与现网 chglStockList 三级结构 */

export type GoodsSpecLeaf = {
  id: string
  name: string
  /** 列表匹配键：大类-品类-规格 全路径 */
  fullKey: string
}

export type GoodsSpecVariety = {
  id: string
  name: string
  specs: GoodsSpecLeaf[]
}

export type GoodsSpecCategory = {
  id: string
  name: string
  varieties: GoodsSpecVariety[]
}

const SPEC_LINES = [
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

export function buildInboundGoodsCascadeTree(): GoodsSpecCategory[] {
  const catMap = new Map<string, Map<string, GoodsSpecLeaf[]>>()

  for (const line of SPEC_LINES) {
    const parts = line.split("-")
    if (parts.length < 3) continue
    const category = parts[0]!
    const variety = parts[1]!
    const spec = parts.slice(2).join("-")
    if (!catMap.has(category)) catMap.set(category, new Map())
    const varMap = catMap.get(category)!
    if (!varMap.has(variety)) varMap.set(variety, [])
    varMap.get(variety)!.push({
      id: slug(line),
      name: spec,
      fullKey: line,
    })
  }

  return [...catMap.entries()].map(([catName, varMap]) => ({
    id: slug(catName),
    name: catName,
    varieties: [...varMap.entries()].map(([varName, specs]) => ({
      id: slug(`${catName}-${varName}`),
      name: varName,
      specs,
    })),
  }))
}

export const INBOUND_GOODS_CASCADE_TREE = buildInboundGoodsCascadeTree()
