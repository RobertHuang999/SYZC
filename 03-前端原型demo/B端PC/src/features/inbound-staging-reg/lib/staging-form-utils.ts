import type { InboundFormState } from "@/features/inbound-records/domain/form-types"
import {
  calcFormTotals,
  createEmptyGoodsLine,
  createInitialFormState,
  formHasDirtyFields,
} from "@/features/inbound-records/lib/inbound-form-utils"
import {
  FORM_STOREROOMS,
  FORM_WAREHOUSES,
  getRelatedOrdersByType,
  resolveOwnerSearchRecord,
} from "@/features/inbound-records/mock/inbound-form.mock"
import {
  buildStagingGoodsFromLines,
  stagingRegToGoodsLineDrafts,
} from "@prototype/shared/inbound/staging-goods-display"
import {
  formatStoreroomLabels,
  parseStoreroomLabels,
} from "@prototype/shared/inbound/staging-storeroom-label"
import type { InboundStagingReg, StagingInboundType } from "../domain/types"
import type { SaveStagingRegInput } from "../mock/inbound-staging.mock"

export { formHasDirtyFields, calcFormTotals, createEmptyGoodsLine, createInitialFormState }

export function createStagingInitialForm(): InboundFormState {
  const base = createInitialFormState()
  return {
    ...base,
    isNewOwner: true,
    ownerType: "",
    goodsLines: [createEmptyGoodsLine()],
  }
}

function relatedOrderLabelFromReg(reg: InboundStagingReg): string {
  const no = reg.relatedOrderNo?.trim()
  if (!no) return ""
  const hit = getRelatedOrdersByType(reg.inboundType).find((o) => o.orderNo === no)
  return hit ? `${hit.orderNo} · ${hit.ownerName}` : `${no} · 手填关联单`
}

export function formFromStagingReg(reg: InboundStagingReg): InboundFormState {
  const warehouse =
    FORM_WAREHOUSES.find((w) => w.name === reg.warehouseName) ?? FORM_WAREHOUSES[0]
  const storeroomIds = parseStoreroomLabels(reg.storeroomName, (name) =>
    FORM_STOREROOMS.find((r) => r.warehouseId === warehouse.id && r.name === name)?.id,
  )
  const goodsLines = stagingRegToGoodsLineDrafts(reg).map((draft) => {
    const line = createEmptyGoodsLine()
    line.category = draft.category
    line.variety = draft.variety
    line.spec = draft.spec
    line.measureValue = draft.measureValue
    line.measureUnit = draft.measureUnit
    return line
  })

  const archive = resolveOwnerSearchRecord({
    ownerType: reg.ownerTag === "档案货主" ? "企业货主" : "企业货主",
    ownerName: reg.ownerDisplay,
    ownerIdentifier: "",
  })

  return {
    ...createStagingInitialForm(),
    inboundDate: reg.inboundDate,
    inboundType: reg.inboundType as InboundFormState["inboundType"],
    relatedOrderNo: reg.relatedOrderNo ?? "",
    relatedOrderLabel: relatedOrderLabelFromReg(reg),
    ownerName: reg.ownerDisplay,
    ownerType: reg.ownerTag === "档案货主" ? "企业货主" : "",
    ownerIdentifier: archive?.ownerIdentifier ?? "",
    warehouseId: warehouse.id,
    storeroomIds,
    remark: reg.remark ?? "",
    goodsLines: goodsLines.length ? goodsLines : [createEmptyGoodsLine()],
    isNewOwner: reg.ownerTag !== "档案货主",
  }
}

export function formFromFormalInbound(form: InboundFormState): InboundFormState {
  return {
    ...form,
    goodsLines: form.goodsLines.length ? form.goodsLines : [createEmptyGoodsLine()],
  }
}

export function resolveOwnerTag(form: InboundFormState): SaveStagingRegInput["ownerTag"] {
  const name = form.ownerName.trim()
  if (!name) return undefined
  const matched = resolveOwnerSearchRecord({
    ownerType: form.ownerType || "企业货主",
    ownerName: name,
    ownerIdentifier: form.ownerIdentifier,
  })
  return matched ? "档案货主" : "临时待核"
}

export function buildSavePayload(
  form: InboundFormState,
  editId?: string,
): SaveStagingRegInput | null {
  const totals = calcFormTotals(form.goodsLines)
  const first = form.goodsLines[0]
  if (!form.inboundDate || !form.warehouseId || !form.inboundType) return null
  if (!first || totals.goodsTotal <= 0) return null

  const warehouseName =
    FORM_WAREHOUSES.find((w) => w.id === form.warehouseId)?.name ?? "未命名仓库"
  const { goodsNames, goodsSummary } = buildStagingGoodsFromLines(
    form.goodsLines.map((line) => ({
      category: line.category,
      variety: line.variety,
      spec: line.spec,
    })),
  )

  const storeroomName = formatStoreroomLabels(
    form.storeroomIds
      .map((id) => FORM_STOREROOMS.find((r) => r.id === id)?.name)
      .filter((n): n is string => Boolean(n)),
  )

  return {
    id: editId,
    inboundDate: form.inboundDate,
    warehouseName,
    inboundType: form.inboundType as StagingInboundType,
    ownerDisplay: form.ownerName.trim() || "未填写货主/送货说明",
    ownerTag: resolveOwnerTag(form),
    goodsSummary,
    goodsNames: goodsNames.length ? goodsNames : undefined,
    declaredQty: totals.goodsTotal,
    unit: first.measureUnit || "吨",
    relatedOrderNo: form.relatedOrderNo || undefined,
    remark: form.remark || undefined,
    locationHint: totals.noStackTotal > 0 ? "待理货定垛" : "已分配库位",
    storeroomName,
  }
}

export function validateStagingWeakSave(form: InboundFormState): string | null {
  if (!form.inboundDate) return "请选择入库日期（P02）"
  if (!form.warehouseId) return "请选择入库仓库"
  if (!form.inboundType) return "请选择入库类型"
  const totals = calcFormTotals(form.goodsLines)
  if (totals.goodsTotal <= 0) return "申报数量须大于 0"
  if (form.ownerName.trim().length > 100) return "货主/送货说明最多 100 字"
  return null
}
