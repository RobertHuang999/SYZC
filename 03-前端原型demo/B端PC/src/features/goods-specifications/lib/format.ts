import type { GoodsSku, PriceDisplayUnit, Subcategory } from "../domain/types"

const YUAN_FORMATTER = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
})

const WAN_FORMATTER = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 10,
  maximumFractionDigits: 10,
})

/** 元展示：保留 6 位小数并带千分位 */
export function formatPriceYuan(price: number): string {
  return YUAN_FORMATTER.format(price)
}

/** 万元展示：保留 10 位小数 */
export function formatPriceWan(price: number): string {
  return WAN_FORMATTER.format(price / 10000)
}

export function formatPriceDisplay(
  price: number | undefined,
  unit: string,
  displayUnit: PriceDisplayUnit
): string {
  if (price == null) {
    return "--"
  }
  if (displayUnit === "WAN") {
    return `${formatPriceWan(price)} 万元/${unit}`
  }
  return `${formatPriceYuan(price)} 元/${unit}`
}

/** 按元录入时只保留 2 位小数 */
export function normalizePriceInput(value: number): number {
  return Math.round(value * 100) / 100
}

export function parsePriceInput(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (!/^\d+(\.\d{0,2})?$/.test(trimmed)) return null
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed) || parsed < 0) return null
  return normalizePriceInput(parsed)
}

/** 货品规格摘要，例如：牌号 Q235B · 规格型号 5.75*1500*C */
export function formatSpecSummary(
  sku: GoodsSku,
  subcategory: Subcategory | undefined
): string {
  const dimensions = subcategory?.specDimensions ?? []
  const parts = dimensions
    .map((dimension) => sku.specValues[dimension])
    .filter((value) => Boolean(value && value.trim()))
  if (parts.length === 0) {
    return "未填写规格参数"
  }
  return parts.join(" · ")
}

/** 货品完整识别名，例如：热轧卷板 · Q235B · 5.75*1500*C */
export function formatSkuDisplayName(
  sku: GoodsSku,
  subcategory: Subcategory | undefined
): string {
  const spec = formatSpecSummary(sku, subcategory)
  return subcategory ? `${subcategory.name} · ${spec}` : spec
}

export function formatInboundSummary(sku: GoodsSku): string {
  if (sku.inboundCollect.length === 0) {
    return "未配置"
  }
  const requiredCount = sku.inboundCollect.filter((item) => item.required).length
  return `${sku.inboundCollect.length} 项 · ${requiredCount} 项必填`
}

export function formatCountUnit(count: number, unit: string): string {
  return `${count} ${unit}`
}

/** 生成趋势图用的短日期，例如 10-25 */
export function formatTrendDate(date: string): string {
  const parts = date.split("-")
  if (parts.length < 3) return date
  return `${parts[1]}-${parts[2]}`
}
