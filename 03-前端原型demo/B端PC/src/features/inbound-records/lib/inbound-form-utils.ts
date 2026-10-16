import type { GoodsLineForm, InboundFormState } from "../domain/form-types"
import {
  resolveOwnerSearchRecord,
  FORM_STOREROOMS,
  type FormStoreroomOption,
  type OwnerSearchRecord,
} from "../mock/inbound-form.mock"
import {
  formatSpecSummary,
  getSkuById,
  measureLabelFromParam,
  type GoodsSkuRecord,
} from "../../../../../shared/goods/goods-sku-catalog"

/** 个人货主身份证号脱敏（420101****3328） */
export function maskInboundIdCardNo(idCard?: string): string {
  if (!idCard) return ""
  const normalized = idCard.trim()
  if (normalized.includes("*")) return normalized
  if (normalized.length >= 10) {
    return `${normalized.slice(0, 6)}****${normalized.slice(-4)}`
  }
  return normalized
}

export function resolvePersonalOwnerIdCardPlain(
  form: Pick<
    InboundFormState,
    "ownerType" | "ownerName" | "ownerIdentifier" | "idCardNo"
  >,
  archive?: OwnerSearchRecord
): string {
  const record =
    archive ??
    resolveOwnerSearchRecord({
      ownerType: form.ownerType,
      ownerName: form.ownerName,
      ownerIdentifier: form.ownerIdentifier,
    })
  return (form.idCardNo || record?.idCardNo || "").trim()
}

export function resolvePersonalOwnerIdCardMasked(
  form: Pick<
    InboundFormState,
    "ownerType" | "ownerName" | "ownerIdentifier" | "idCardNo"
  >,
  archive?: OwnerSearchRecord
): string {
  const record =
    archive ??
    resolveOwnerSearchRecord({
      ownerType: form.ownerType,
      ownerName: form.ownerName,
      ownerIdentifier: form.ownerIdentifier,
    })
  const plain = resolvePersonalOwnerIdCardPlain(form, record)
  if (plain) return maskInboundIdCardNo(plain)
  return record?.idCardMasked ?? ""
}

export type StoreroomAuditTag = FormStoreroomOption["auditTag"]

export const STOREROOM_AUDIT_CONFLICT_MESSAGE =
  "所选库房属性不一致，同一入库单必须全部为免审库房或全部为需审核库房"

export function resolveStoreroomAuditLock(
  selectedIds: string[],
  storerooms: FormStoreroomOption[] = FORM_STOREROOMS
): StoreroomAuditTag | null {
  if (selectedIds.length === 0) return null
  const first = storerooms.find((room) => room.id === selectedIds[0])
  return first?.auditTag ?? null
}

/** 是否允许勾选该库房（R06：同单不可混选需审核与免审） */
export function canToggleStoreroomSelection(
  selectedIds: string[],
  roomId: string,
  storerooms: FormStoreroomOption[]
): boolean {
  if (selectedIds.includes(roomId)) return true
  const lock = resolveStoreroomAuditLock(selectedIds, storerooms)
  if (!lock) return true
  const candidate = storerooms.find((room) => room.id === roomId)
  if (!candidate) return false
  return candidate.auditTag === lock
}

export function validateStoreroomAuditConsistency(
  selectedIds: string[],
  storerooms: FormStoreroomOption[] = FORM_STOREROOMS
): { valid: boolean; message?: string } {
  if (selectedIds.length <= 1) return { valid: true }
  const tags = new Set<StoreroomAuditTag>()
  for (const id of selectedIds) {
    const room = storerooms.find((item) => item.id === id)
    if (room) tags.add(room.auditTag)
  }
  if (tags.size > 1) {
    return { valid: false, message: STOREROOM_AUDIT_CONFLICT_MESSAGE }
  }
  return { valid: true }
}

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
