import type { GoodsLineForm, InboundFormState } from "../domain/form-types"
import { GOODS_SPEC_TREE } from "../mock/inbound-form.mock"

export function nowInboundDateString(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function createEmptyGoodsLine(): GoodsLineForm {
  const template = GOODS_SPEC_TREE[0]
  return {
    id: `goods-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    category: template.category,
    variety: template.variety,
    spec: template.spec,
    measureValue: "",
    measureUnit: template.defaultUnit,
    measureLabel: template.measureLabel,
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
  }
}

export function formatGoodsCardTitle(line: GoodsLineForm): string {
  return [line.category, line.variety, line.spec].filter(Boolean).join(" - ")
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

export function applySpecTemplate(
  line: GoodsLineForm,
  category: string,
  variety: string,
  spec: string
): GoodsLineForm {
  const template = GOODS_SPEC_TREE.find(
    (item) =>
      item.category === category &&
      item.variety === variety &&
      item.spec === spec
  )
  if (!template) {
    return { ...line, category, variety, spec }
  }
  return {
    ...line,
    category,
    variety,
    spec,
    measureLabel: template.measureLabel,
    measureUnit: template.defaultUnit,
  }
}
