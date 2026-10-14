import { formatInboundGoodsSummary } from "./inbound-list-format"

export type GoodsSkuParts = {
  category: string
  variety: string
  spec: string
}

export function goodsSkuDisplayName(parts: GoodsSkuParts): string {
  const { category, variety, spec } = parts
  if (spec.trim()) {
    return `${category}-${variety}-${spec}`.replace(/^-+/g, "").replace(/-+$/g, "")
  }
  if (variety.trim()) {
    return `${category}-${variety}`.replace(/^-+/g, "").replace(/-+$/g, "")
  }
  return category.trim() || "未命名货品"
}

export function parseGoodsSkuDisplayName(name: string): GoodsSkuParts {
  const trimmed = name.trim()
  if (!trimmed) return { category: "", variety: "", spec: "" }
  const parts = trimmed.split("-")
  if (parts.length >= 3) {
    return { category: parts[0] ?? "", variety: parts[1] ?? "", spec: parts.slice(2).join("-") }
  }
  if (parts.length === 2) {
    return { category: parts[0] ?? "", variety: parts[1] ?? "", spec: "" }
  }
  return { category: trimmed, variety: "", spec: "" }
}

export function buildStagingGoodsFromLines(
  lines: GoodsSkuParts[],
): { goodsNames: string[]; goodsSummary: string } {
  const goodsNames = lines
    .map((line) => goodsSkuDisplayName(line))
    .filter((name) => name && name !== "未命名货品")
  if (goodsNames.length === 0) {
    return { goodsNames: [], goodsSummary: "—" }
  }
  return {
    goodsNames,
    goodsSummary: formatInboundGoodsSummary(goodsNames),
  }
}

export function resolveStagingGoodsNames(reg: {
  goodsSummary: string
  goodsNames?: string[]
}): string[] {
  if (reg.goodsNames?.length) return [...reg.goodsNames]
  const single = reg.goodsSummary.trim()
  return single ? [single] : []
}

export function stagingRegToGoodsLineDrafts(reg: {
  goodsSummary: string
  goodsNames?: string[]
  declaredQty: number
  unit: string
}): Array<GoodsSkuParts & { measureValue: string; measureUnit: string }> {
  const names = resolveStagingGoodsNames(reg)
  if (names.length === 0) {
    return [{ category: "", variety: "", spec: "", measureValue: "0", measureUnit: reg.unit }]
  }
  const perQty =
    names.length > 1
      ? Math.round((reg.declaredQty / names.length) * 100) / 100
      : reg.declaredQty
  return names.map((name) => {
    const sku = parseGoodsSkuDisplayName(name)
    return {
      ...sku,
      measureValue: String(perQty),
      measureUnit: reg.unit,
    }
  })
}
