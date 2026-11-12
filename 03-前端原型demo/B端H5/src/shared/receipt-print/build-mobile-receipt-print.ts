import { INBOUND_APPROVED_SEEDS } from "@prototype/shared/inbound/inbound-approved-seed"
import {
  aggregateQuantitiesByUnit,
  formatQuantitiesByUnit,
} from "@prototype/shared/inbound/inbound-goods-display"
import { getCurrentTenantPrintIdentity } from "@prototype/B端PC/src/shared/receipt-print/receipt-print-tenant"
import type {
  InboundReceiptGoodsRow,
  InboundReceiptPrintData,
  OutboundReceiptGoodsRow,
  OutboundReceiptPrintData,
} from "@prototype/B端PC/src/shared/receipt-print/receipt-print-types"
import type { MobileInboundRecord } from "@/features/inbound-records/domain/types"
import type { MobileOutboundRecord } from "@/features/outbound-records/domain/types"

export type H5ReceiptPrintData =
  | { kind: "inbound"; data: InboundReceiptPrintData }
  | { kind: "outbound"; data: OutboundReceiptPrintData }

function splitGoods(fullName: string): { goodsName: string; specModel: string } {
  const parts = fullName
    .split(/[-/]/)
    .map((item) => item.trim())
    .filter(Boolean)
  if (parts.length >= 3) {
    return { goodsName: `${parts[0]} / ${parts[1]}`, specModel: parts.slice(2).join(" ") }
  }
  if (parts.length === 2) {
    return { goodsName: `${parts[0]} / ${parts[1]}`, specModel: "国标标准件" }
  }
  return { goodsName: fullName || "存货", specModel: "—" }
}

function cleanCreatorName(display: string): string {
  if (!display) return "制单人"
  const matched = display.match(/^([^(（]+)/)
  return (matched ? matched[1] : display).trim()
}

function toShortDateTime(dt: string): string {
  const trimmed = dt.trim()
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed.slice(0, 16)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return `${trimmed} 08:00`
  return trimmed
}

function toChineseDate(dt: string): string {
  const matched = dt.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!matched) return dt
  return `${matched[1]}年${matched[2]}月${matched[3]}日`
}

function summarizeTotals(rows: Array<{ quantityNum: number; unit: string }>): {
  totalQuantityFormatted: string
  totalQuantityNum: number
  totalUnit: string
  totalQuantityChineseUpper: string
} {
  const groups = aggregateQuantitiesByUnit(
    rows.map((row) => ({ amount: row.quantityNum, unit: row.unit }))
  )
  if (groups.length <= 1) {
    const only = groups[0]
    if (!only) {
      return {
        totalQuantityFormatted: "0.0000",
        totalQuantityNum: 0,
        totalUnit: "吨",
        totalQuantityChineseUpper: "零吨整",
      }
    }
    return {
      totalQuantityFormatted: only.amount.toFixed(4),
      totalQuantityNum: only.amount,
      totalUnit: only.unit,
      totalQuantityChineseUpper: `${formatQuantitiesByUnit([only])}整`.replace(" ", ""),
    }
  }
  return {
    totalQuantityFormatted: groups
      .map((item) => `${item.amount.toFixed(4)} ${item.unit}`)
      .join(" / "),
    totalQuantityNum: 0,
    totalUnit: "--",
    totalQuantityChineseUpper: formatQuantitiesByUnit(groups),
  }
}

export function buildH5InboundReceiptPrintData(
  record: MobileInboundRecord
): H5ReceiptPrintData {
  const seed = INBOUND_APPROVED_SEEDS.find(
    (item) => item.orderNo === record.orderNo || item.pcId === record.pcDetailId
  )
  const lineItems =
    seed?.goodsLineItems && seed.goodsLineItems.length > 0
      ? seed.goodsLineItems
      : record.goodsNames.map((name, index, list) => ({
          name,
          amount:
            list.length === 1
              ? Number.parseFloat(record.quantityLabel.replace(/,/g, "")) || 0
              : 0,
          unit: record.unit || "吨",
        }))
  const goodsRows: InboundReceiptGoodsRow[] = lineItems.map((item, index) => {
    const parsed = splitGoods(item.name)
    const extra = index === 0 ? "批次：202611-A01" : "现场过磅核验"
    const remark = index === 0 ? "进场验收外观完好" : "捆包完好"
    return {
      index: index + 1,
      goodsName: parsed.goodsName,
      specModel: parsed.specModel,
      quantityFormatted: item.amount.toFixed(4),
      quantityNum: item.amount,
      unit: item.unit || record.unit || "吨",
      batchOrExtra: extra,
      batchOrExtraCompact: extra,
      remark,
      remarkContinuous: remark,
    }
  })
  const totals = summarizeTotals(goodsRows)
  return {
    kind: "inbound",
    data: {
      ...getCurrentTenantPrintIdentity(),
      orderNo: record.orderNo,
      inboundDate: record.inboundDate,
      inboundDateShort: toShortDateTime(record.inboundDate),
      inboundDateChinese: toChineseDate(record.inboundDate),
      inboundType: record.inboundType,
      warehouseName: record.warehouseName,
      relatedOrderNo: record.relatedOrderNo || "--",
      creatorName: cleanCreatorName(record.creatorDisplay),
      ownerName: record.ownerName,
      ownerTypeLabel: seed?.ownerType === "1" ? "个人货主" : "企业货主",
      ownerCredentialPlain: record.ownerIdentifierMasked.includes("*")
        ? "91320200MA2ABC8888"
        : record.ownerIdentifierMasked,
      ownerPhonePlain: "13766668888",
      goodsRows,
      totalSpeciesCount: goodsRows.length,
      ...totals,
      printTime: "2026-11-12 14:15",
    },
  }
}

export function buildH5OutboundReceiptPrintData(
  record: MobileOutboundRecord
): H5ReceiptPrintData {
  const goodsRows: OutboundReceiptGoodsRow[] = record.goodsList.map((item, index) => {
    const parsed = splitGoods(item.goodsName)
    const goodsName =
      item.categoryName && item.goodsName
        ? `${item.categoryName} / ${item.specName || item.goodsName}`
        : parsed.goodsName
    const remark = index === 0 ? "捆包完好" : "现场过磅核验"
    return {
      index: index + 1,
      goodsName,
      specModel: item.specName || parsed.specModel,
      quantityFormatted: item.totalOutboundAmount.toFixed(4),
      quantityNum: item.totalOutboundAmount,
      unit: item.unit || record.amountUnit || "吨",
      remarkA4: remark,
      remarkA5: remark,
      remarkContinuous: remark,
    }
  })
  const totals = summarizeTotals(goodsRows)
  const pickup = record.pickupInfo
  return {
    kind: "outbound",
    data: {
      ...getCurrentTenantPrintIdentity(),
      orderNo: record.orderNo,
      outboundDate: record.outboundTime,
      outboundDateShort: toShortDateTime(record.outboundTime),
      outboundDateChinese: toChineseDate(record.outboundTime),
      outboundType: record.type,
      warehouseName: record.warehouseName,
      relatedOrderNo: record.relatedNo && record.relatedNo !== "—" ? record.relatedNo : "--",
      creatorName: record.createdByName,
      ownerName: record.ownerName,
      ownerTypeLabel: `${record.ownerType}货主`,
      ownerCredentialPlain: record.ownerIdentifier.includes("*")
        ? "91310000MA1FL88888"
        : record.ownerIdentifier,
      ownerPhonePlain: "13812345678",
      pickupPersonName: pickup?.name || "--",
      pickupPhonePlain: pickup?.phone || "--",
      pickupIdCardPlain: pickup?.idCardNo || "--",
      pickupPlateNo: pickup?.plateNo || "--",
      deliveryOrderNo: record.relatedNo && record.relatedNo !== "—" ? record.relatedNo : "--",
      deliveryMethodA4: pickup?.personType === "企业" ? "企业授权提货" : "现场自提",
      deliveryMethodCompact: pickup?.personType === "企业" ? "企业提货" : "自提",
      goodsRows,
      totalSpeciesCount: goodsRows.length,
      ...totals,
      printTime: "2026-11-12 14:15",
    },
  }
}
