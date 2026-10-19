import type { GoodsLineForm, InboundFormState } from "../domain/form-types"
import {
  formatSpecSummary,
  getSkuById,
  inferSkuIdFromStagingParts,
  measureLabelFromParam,
  type GoodsSkuRecord,
} from "../../../../../shared/goods/goods-sku-catalog"

export function nowInboundDateString(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function createEmptyGoodsLine(): GoodsLineForm {
  return {
    id: `goods-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    skuId: "",
    category: "",
    variety: "",
    spec: "",
    specValues: {},
    collectValues: {},
    measureValue: "",
    measureUnit: "",
    measureLabel: "计量数量",
    extraInfo: "",
    remark: "",
    stackings: [],
    sitePhotoCount: 0,
    supplementCount: 0,
  }
}

export function createInitialFormState(): InboundFormState {
  return {
    inboundDate: nowInboundDateString(),
    ownerType: "",
    ownerName: "",
    ownerIdentifier: "",
    contactPhone: "",
    idCardNo: "",
    inboundType: "",
    relatedOrderNo: "",
    relatedOrderLabel: "",
    warehouseId: "",
    storeroomIds: [],
    remark: "",
    goodsLines: [],
    isNewOwner: false,
    partnerId: "",
  }
}

export function formatGoodsCardTitle(line: GoodsLineForm): string {
  if (!line.category && !line.skuId) return "未选择货品"
  const spec =
    line.spec ||
    (Object.keys(line.specValues).length > 0
      ? formatSpecSummary(line.specValues)
      : "")
  return [line.category, line.variety, spec].filter(Boolean).join(" - ")
}

export function parseQuantity(value: string): number {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

export function unstackedQuantity(line: GoodsLineForm): number {
  const total = parseQuantity(line.measureValue)
  const stacked = line.stackings.reduce(
    (sum, row) => sum + parseQuantity(row.quantity),
    0
  )
  return Math.max(0, total - stacked)
}

export function calcFormTotals(lines: GoodsLineForm[]) {
  const specKeys = new Set(
    lines.map((line) => `${line.category}-${line.variety}-${line.spec}`)
  )
  const goodsTotal = lines.reduce(
    (sum, line) => sum + parseQuantity(line.measureValue),
    0
  )
  const stackedTotal = lines.reduce(
    (sum, line) =>
      sum +
      line.stackings.reduce((s, row) => s + parseQuantity(row.quantity), 0),
    0
  )
  return {
    categoryCount: specKeys.size,
    goodsTotal,
    stackedTotal,
    noStackTotal: 0,
  }
}

export function formHasDirtyFields(form: InboundFormState): boolean {
  return (
    form.ownerName.trim().length > 0 ||
    form.goodsLines.length > 0 ||
    form.remark.trim().length > 0 ||
    form.storeroomIds.length > 0
  )
}

export function findFirstUnstackedLine(
  lines: GoodsLineForm[]
): GoodsLineForm | null {
  return lines.find((line) => unstackedQuantity(line) !== 0) ?? null
}

export function applyGoodsSku(line: GoodsLineForm, sku: GoodsSkuRecord): GoodsLineForm {
  const spec = formatSpecSummary(sku.specValues)
  const collectValues: Record<string, string> = {}
  for (const field of sku.inboundCollect) {
    collectValues[field.fieldKey] = line.collectValues[field.fieldKey] ?? ""
  }
  return {
    ...line,
    skuId: sku.skuId,
    category: sku.category,
    variety: sku.variety,
    spec,
    specValues: { ...sku.specValues },
    collectValues,
    measureLabel: measureLabelFromParam(sku.measureParam),
    measureUnit: sku.measureUnit,
    extraInfo: "",
  }
}

export function applyGoodsSkuById(line: GoodsLineForm, skuId: string): GoodsLineForm {
  const sku = getSkuById(skuId)
  if (!sku) {
    return { ...line, skuId: "" }
  }
  return applyGoodsSku(line, sku)
}

export function resetGoodsLineForCategory(line: GoodsLineForm, category: string): GoodsLineForm {
  return {
    ...line,
    skuId: "",
    category,
    variety: "",
    spec: "",
    specValues: {},
    collectValues: {},
    measureUnit: "",
    measureLabel: "计量数量",
    extraInfo: "",
  }
}

export function resetGoodsLineForVariety(
  line: GoodsLineForm,
  category: string,
  variety: string
): GoodsLineForm {
  return {
    ...resetGoodsLineForCategory(line, category),
    variety,
  }
}

/** 会话里旧版 goodsLines 缺字段时补齐；无 skuId 时保留暂存带入的品类并尝试目录匹配 */
export function normalizeGoodsLine(line: Partial<GoodsLineForm> & { id: string }): GoodsLineForm {
  const empty = createEmptyGoodsLine()
  const merged: GoodsLineForm = {
    ...empty,
    ...line,
    id: line.id,
    specValues: line.specValues ?? {},
    collectValues: line.collectValues ?? {},
    skuId: line.skuId ?? "",
    stackings: line.stackings ?? [],
  }
  if (merged.skuId) {
    return applyGoodsSkuById(merged, merged.skuId)
  }
  const inferred = inferSkuIdFromStagingParts(
    merged.category,
    merged.variety,
    merged.spec,
  )
  if (inferred) {
    return applyGoodsSkuById(merged, inferred)
  }
  return {
    ...merged,
    measureLabel: merged.measureLabel || "计量数量",
    measureValue: merged.measureValue ?? "",
  }
}
