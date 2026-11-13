import type { SupervisionDocKind } from "@prototype/shared/partner-archives/supervision-partner-reference"

export type { SupervisionDocKind }

export type OwnerKind = "ENTERPRISE" | "INDIVIDUAL"

export type GuaranteeMode =
  | "FLOW_PLEDGE"
  | "STATIC_PLEDGE"
  | "FLOATING_MORTGAGE"
  | "FIXED_MORTGAGE"
  | "DYNAMIC_SUPERVISION"
  | "STATIC_SUPERVISION"

export type AmountUnit = "WAN" | "YUAN"

export type SupervisionHandlingStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "EFFECTIVE"
  | "REJECTED"
  | "WITHDRAWN"
  | "RELEASED"

export interface InventorySlotItem {
  slotId: string
  warehouseName: string
  storeroomName: string
  zoneName: string
  locationCode: string
  inboundTime: string
  productionDate: string
  batchExtra: string
  barcode: string
  controlStatus: "存货中" | "质押申请中" | "抵押申请中" | "质押中" | "抵押中"
  availableQty: number
  allocatedQty: number
}

export interface GoodsSkuLine {
  skuId: string
  skuName: string
  unit: string
  unitPriceYuan: number | null
  slots: InventorySlotItem[]
}

export interface SupervisionTimelineItem {
  id: string
  time: string
  action: string
  operator: string
  result: string
  remark?: string
}

export interface SupervisionHandlingRecord {
  id: string
  applyNo: string
  docKind: SupervisionDocKind
  guaranteeMode: GuaranteeMode
  ownerType: OwnerKind
  ownerPartnerId?: string
  ownerName: string
  ownerIdentifier: string
  ownerContact: string
  holderPartnerId?: string
  holderName: string
  holderIdentifier: string
  loanAmount?: number
  loanUnit: AmountUnit
  loanPeriods?: number
  creditAmount?: number
  creditUnit: AmountUnit
  creditPeriods?: number
  safetyLineEnabled: boolean
  safetyLineAmount?: number
  safetyLineUnit: AmountUnit
  contractNo?: string
  remark?: string
  goodsLines: GoodsSkuLine[]
  categoryCount: number
  totalQtyDisplay: string
  totalValueWan: number | null
  status: SupervisionHandlingStatus
  applicantName: string
  submittedAt: string
  updatedAt: string
  relatedInboundNo?: string
  relatedSupervisionOrderNo?: string
  rejectReason?: string
  timeline: SupervisionTimelineItem[]
}

export interface SupervisionHandlingFilters {
  keyword: string
  ownerName: string
  docKind: "ALL" | SupervisionDocKind
  status: "ALL" | SupervisionHandlingStatus
  holderName: string
  guaranteeMode: "ALL" | GuaranteeMode
  dateStart: string
  dateEnd: string
}

export const DEFAULT_SUPERVISION_HANDLING_FILTERS: SupervisionHandlingFilters = {
  keyword: "",
  ownerName: "",
  docKind: "ALL",
  status: "ALL",
  holderName: "",
  guaranteeMode: "ALL",
  dateStart: "",
  dateEnd: "",
}

export const DOC_KIND_LABELS: Record<SupervisionDocKind, string> = {
  PLEDGE: "质押单",
  MORTGAGE: "抵押单",
  SUPERVISION_SERVICE: "监管服务单",
}

export const GUARANTEE_MODE_OPTIONS: Record<
  SupervisionDocKind,
  Array<{ value: GuaranteeMode; label: string; isDynamic: boolean }>
> = {
  PLEDGE: [
    { value: "FLOW_PLEDGE", label: "流动质押", isDynamic: true },
    { value: "STATIC_PLEDGE", label: "静态质押", isDynamic: false },
  ],
  MORTGAGE: [
    { value: "FLOATING_MORTGAGE", label: "浮动抵押", isDynamic: true },
    { value: "FIXED_MORTGAGE", label: "固定抵押", isDynamic: false },
  ],
  SUPERVISION_SERVICE: [
    { value: "DYNAMIC_SUPERVISION", label: "动态监管", isDynamic: true },
    { value: "STATIC_SUPERVISION", label: "静态监管", isDynamic: false },
  ],
}

export const GUARANTEE_MODE_LABELS: Record<GuaranteeMode, string> = {
  FLOW_PLEDGE: "流动质押",
  STATIC_PLEDGE: "静态质押",
  FLOATING_MORTGAGE: "浮动抵押",
  FIXED_MORTGAGE: "固定抵押",
  DYNAMIC_SUPERVISION: "动态监管",
  STATIC_SUPERVISION: "静态监管",
}

export function isDynamicGuaranteeMode(mode: GuaranteeMode): boolean {
  return (
    mode === "FLOW_PLEDGE" ||
    mode === "FLOATING_MORTGAGE" ||
    mode === "DYNAMIC_SUPERVISION"
  )
}

export function holderLabelsForDocKind(docKind: SupervisionDocKind): {
  typeLabel: string
  nameLabel: string
  idLabel: string
  qtyLabel: string
} {
  if (docKind === "MORTGAGE") {
    return {
      typeLabel: "抵押权人类型",
      nameLabel: "抵押权人名称",
      idLabel: "抵押权人证件号",
      qtyLabel: "抵押数量",
    }
  }
  if (docKind === "SUPERVISION_SERVICE") {
    return {
      typeLabel: "质权人（服务方）类型",
      nameLabel: "质权人（服务方）名称",
      idLabel: "质权人（服务方）证件号",
      qtyLabel: "监管数量",
    }
  }
  return {
    typeLabel: "质押权人类型",
    nameLabel: "质押权人名称",
    idLabel: "质押权人证件号",
    qtyLabel: "质押数量",
  }
}

export const HANDLING_STATUS_META: Record<
  SupervisionHandlingStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "草稿",
    className: "border-slate-300 bg-slate-100 text-slate-700",
  },
  PENDING_APPROVAL: {
    label: "审批中",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  EFFECTIVE: {
    label: "已生效",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  REJECTED: {
    label: "已驳回",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  WITHDRAWN: {
    label: "已撤回",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  },
  RELEASED: {
    label: "已解押",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
}

export function toYuan(amount: number | undefined, unit: AmountUnit): number {
  if (amount === undefined || Number.isNaN(amount)) return 0
  return unit === "WAN" ? amount * 10000 : amount
}

export function calcGoodsSummary(lines: GoodsSkuLine[]): {
  categoryCount: number
  totalQtyDisplay: string
  totalValueWan: number | null
  hasUnpriced: boolean
} {
  if (lines.length === 0) {
    return {
      categoryCount: 0,
      totalQtyDisplay: "0",
      totalValueWan: 0,
      hasUnpriced: false,
    }
  }
  const unitMap = new Map<string, number>()
  let totalYuan = 0
  let hasPriced = false
  let hasUnpriced = false

  for (const line of lines) {
    const qtySum = line.slots.reduce((s, slot) => s + slot.allocatedQty, 0)
    if (qtySum <= 0) continue
    unitMap.set(line.unit, (unitMap.get(line.unit) ?? 0) + qtySum)
    if (line.unitPriceYuan !== null && line.unitPriceYuan > 0) {
      hasPriced = true
      totalYuan += qtySum * line.unitPriceYuan
    } else {
      hasUnpriced = true
    }
  }

  const totalQtyDisplay = Array.from(unitMap.entries())
    .map(([unit, qty]) => `${Number(qty.toFixed(4))}${unit}`)
    .join(" + ")

  return {
    categoryCount: lines.filter((l) => l.slots.some((s) => s.allocatedQty > 0)).length,
    totalQtyDisplay: totalQtyDisplay || "0",
    totalValueWan: hasPriced ? Number((totalYuan / 10000).toFixed(6)) : null,
    hasUnpriced,
  }
}

