import {
  buildGoodsDetailLineFromFormSnapshot,
  buildInboundRecordDetail,
  CANONICAL_APPROVED_ROWS,
  getCanonicalRowByOrderNo,
  type InboundListRowForDetail,
  type InboundRecordDetail,
} from "../../../../../shared/inbound/build-inbound-detail"
import type { MobileInboundRecord } from "../domain/types"
import type { InboundFormState } from "../domain/form-types"
import { FORM_STOREROOMS, FORM_WAREHOUSES } from "../mock/inbound-form.mock"
import { formatInboundGoodsLineName } from "../../../../../shared/inbound/inbound-goods-display"
import {
  getMobileInboundById,
  mobileInboundRecordsMock,
} from "../mock/inbound-records.mock"
import { calcFormTotals } from "./inbound-form-utils"

const detailOverrides = new Map<string, InboundRecordDetail>()

export function registerMobileInboundDetailOverride(
  id: string,
  detail: InboundRecordDetail
) {
  detailOverrides.set(id, detail)
}

function mobileToListRow(mobile: MobileInboundRecord): InboundListRowForDetail {
  return {
    id: mobile.pcDetailId ?? mobile.id,
    orderNo: mobile.orderNo,
    ownerName: mobile.ownerName,
    ownerIdentifierMasked: mobile.ownerIdentifierMasked,
    inboundType: mobile.inboundType,
    inboundDate: mobile.inboundDate,
    warehouseName: mobile.warehouseName,
    houseNames: mobile.storageLocations?.[0]?.locationName?.split("-").slice(-2).join("-"),
    relatedOrderNo: mobile.relatedOrderNo ?? null,
    goodsNames:
      mobile.goodsNames?.length > 0 ? mobile.goodsNames : [mobile.goodsSummary],
    inboundQuantity: Number.parseFloat(mobile.quantityLabel) || 0,
    unit: mobile.unit ?? "吨",
    creatorDisplay: mobile.creatorDisplay,
    createdAt: mobile.createdAt,
    checkStatus: 2,
    remark: mobile.remarks ?? null,
  }
}

export function getMobileInboundDetailById(
  id: string | undefined
): InboundRecordDetail | undefined {
  if (id && detailOverrides.has(id)) {
    return detailOverrides.get(id)
  }

  const mobile =
    getMobileInboundById(id) ?? mobileInboundRecordsMock[1] ?? mobileInboundRecordsMock[0]
  if (!mobile) return undefined

  const canonical =
    CANONICAL_APPROVED_ROWS.find((r) => r.id === mobile.pcDetailId) ??
    getCanonicalRowByOrderNo(mobile.orderNo)

  const listRow: InboundListRowForDetail = canonical
    ? {
        ...canonical,
        orderNo: mobile.orderNo,
        inboundDate: mobile.inboundDate,
        ownerName: mobile.ownerName,
        ownerIdentifierMasked: mobile.ownerIdentifierMasked,
        inboundType: mobile.inboundType,
        warehouseName: mobile.warehouseName,
        relatedOrderNo: mobile.relatedOrderNo ?? canonical.relatedOrderNo,
        creatorDisplay: mobile.creatorDisplay,
        createdAt: mobile.createdAt,
        remark: mobile.remarks ?? canonical.remark,
        goodsLineItems: canonical.goodsLineItems,
      }
    : mobileToListRow(mobile)

  const detail = buildInboundRecordDetail(listRow)

  if (mobile.storageLocations?.length && detail.goodsLines[0]) {
    const line = detail.goodsLines[0]
    const loc = mobile.storageLocations[0]
    line.stacks = [
      {
        id: `${line.id}-stack-0`,
        storeroom: mobile.warehouseName,
        zone: loc.locationName.split("-").pop() ?? "审核分区",
        position: loc.locationName,
        amount: line.amount,
        unit: line.unit,
        quantityLabel: loc.quantityLabel.includes(" ")
          ? loc.quantityLabel
          : `${loc.quantityLabel.replace(/[^\d.]/g, "")} ${line.unit}`,
        qrCodeNo: loc.qrCodeNo,
        qrCodeUrl:
          "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + loc.qrCodeNo,
      },
    ]
    if (mobile.photoUrls?.length) {
      line.scenePhotos = mobile.photoUrls
    }
  }

  return detail
}

export function buildMobileDetailFromInitiateForm(
  form: InboundFormState,
  orderNo: string
): InboundRecordDetail {
  const warehouse = FORM_WAREHOUSES.find((w) => w.id === form.warehouseId)
  const storeroomLabels = form.storeroomIds.map((sid) => {
    const room = FORM_STOREROOMS.find((s) => s.id === sid)
    return room?.name ?? sid
  })

  const listRow: InboundListRowForDetail = {
    id: `m-submit-${Date.now()}`,
    orderNo,
    ownerName: form.ownerName,
    ownerType: form.ownerType === "个人货主" ? "1" : "2",
    ownerIdentifierMasked: form.ownerIdentifier,
    inboundType: form.inboundType || "普通入库",
    inboundDate: form.inboundDate,
    warehouseName: warehouse?.name ?? "",
    houseNames: storeroomLabels.join(", "),
    relatedOrderNo: form.relatedOrderNo || null,
    goodsNames: form.goodsLines.map((g) =>
      formatInboundGoodsLineName({
        category: g.category,
        variety: g.variety,
        spec: g.spec,
      })
    ),
    inboundQuantity: form.goodsLines.reduce(
      (sum, g) => sum + (Number.parseFloat(g.measureValue) || 0),
      0
    ),
    unit: form.goodsLines[0]?.measureUnit ?? "吨",
    creatorDisplay: "当前用户(原型)",
    createdAt: form.inboundDate,
    checkStatus: 2,
    remark: form.remark || null,
  }

  const base = buildInboundRecordDetail(listRow)
  base.goodsLines = form.goodsLines.map((line, index) =>
    buildGoodsDetailLineFromFormSnapshot(listRow, {
      id: line.id,
      skuId: line.skuId,
      category: line.category,
      variety: line.variety,
      spec: line.spec,
      measureValue: line.measureValue,
      measureUnit: line.measureUnit,
      measureLabel: line.measureLabel,
      collectValues: line.collectValues,
      remark: line.remark,
      stackings: line.stackings.map((stack) => {
        const room = FORM_STOREROOMS.find((s) => s.id === stack.storeroomId)
        return {
          storeroomLabel: room?.name ?? stack.storeroomId,
          partitionLabel: stack.partitionId,
          locationText: stack.locationText,
          quantity: stack.quantity,
        }
      }),
      sitePhotoCount: line.sitePhotoCount,
      supplementCount: line.supplementCount,
    }, index)
  )
  return base
}

export function prependMobileInboundListItem(
  form: InboundFormState,
  orderNo: string,
  listId: string
) {
  const warehouse = FORM_WAREHOUSES.find((w) => w.id === form.warehouseId)
  const first = form.goodsLines[0]
  const totals = calcFormTotals(form.goodsLines)
  const goodsSummary = first
    ? formatInboundGoodsLineName({
        category: first.category,
        variety: first.variety,
        spec: first.spec,
      })
    : "—"
  const summary =
    form.goodsLines.length > 1
      ? `${goodsSummary} 等 ${form.goodsLines.length} 种`
      : goodsSummary

  const goodsNames = form.goodsLines.map((g) =>
    formatInboundGoodsLineName({
      category: g.category,
      variety: g.variety,
      spec: g.spec,
    })
  )

  mobileInboundRecordsMock.unshift({
    id: listId,
    orderNo,
    ownerName: form.ownerName,
    ownerIdentifierMasked: form.ownerIdentifier,
    inboundType: form.inboundType || "普通入库",
    inboundDate: form.inboundDate,
    warehouseName: warehouse?.name ?? "",
    goodsSummary: summary,
    goodsNames,
    goodsKindCount: form.goodsLines.length > 1 ? form.goodsLines.length : undefined,
    quantityLabel: totals.goodsTotal.toFixed(4).replace(/\.?0+$/, "") || "0",
    unit: first?.measureUnit ?? "吨",
    flowStatus: "APPROVED",
    creatorDisplay: "当前用户(原型)",
    createdAt: form.inboundDate,
    relatedOrderNo: form.relatedOrderNo || undefined,
    remarks: form.remark || "--",
  })
}
