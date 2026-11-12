import { inboundRecordsMock } from "@/features/inbound-records/mock/inbound-records.mock"
import type { InboundRecord } from "@/features/inbound-records/domain/types"
import { INBOUND_TYPE_LABELS, type InboundTypeLabel } from "@/features/inbound-records/domain/constants"
import { outboundRecordsMock } from "@/features/outbound-records/mock/outbound-records.mock"
import type { OutboundRecord, OutboundTypeCode, OutboundTypeName } from "@/features/outbound-records/domain/types"
import { SHARED_OWNERS, type InventoryTransactionRecord } from "@/features/shared/mock/inventory-shared-seed"

function matchOrderNo(left: string, record: InventoryTransactionRecord) {
  return left === record.orderNo || left === record.businessNo
}

function inboundTypeOf(businessType: string): InboundTypeLabel {
  return INBOUND_TYPE_LABELS.find((item) => item === businessType) ?? "普通入库"
}

const OUTBOUND_TYPE_MAP: Record<string, { type: OutboundTypeName; typeCode: OutboundTypeCode }> = {
  普通出库: { type: "普通出库", typeCode: "NORMAL" },
  仓单出库: { type: "仓单出库", typeCode: "RECEIPT" },
  质押出库: { type: "质押出库", typeCode: "PLEDGE" },
  抵押出库: { type: "抵押出库", typeCode: "MORTGAGE" },
  移库出库: { type: "移库出库", typeCode: "TRANSFER" },
  转让出库: { type: "转让出库", typeCode: "ASSIGNMENT" },
  质押加工出库: { type: "质押加工出库", typeCode: "PLEDGE_PROCESSING" },
  抵押加工出库: { type: "抵押加工出库", typeCode: "MORTGAGE_PROCESSING" },
}

export function resolveInboundRecordFromTransaction(
  record: InventoryTransactionRecord
): InboundRecord {
  const found = inboundRecordsMock.find((item) => matchOrderNo(item.orderNo, record) || item.id === record.orderNo)
  if (found) return found

  const owner = SHARED_OWNERS.find((item) => item.id === record.ownerId)
  const goodsName = `${record.category}-${record.variety}-${record.specification}`
  return {
    id: record.orderNo,
    orderNo: record.orderNo,
    ownerName: record.ownerName,
    ownerType: owner?.ownerType ?? "2",
    ownerIdentifierMasked: owner?.identifierMasked ?? "—",
    inboundType: inboundTypeOf(record.businessType),
    inboundDate: record.businessDate,
    warehouseName: record.warehouseName,
    houseName: record.houseName,
    relatedOrderNo: record.relatedId || null,
    goodsNames: [goodsName],
    goodsLineItems: [{ name: goodsName, amount: record.changeQuantity, unit: record.unit }],
    inboundQuantity: record.changeQuantity,
    unit: record.unit,
    creatorDisplay: `${record.createByName}（${record.warehouseName}）`,
    createByName: record.createByName,
    createOrgName: record.warehouseName,
    createdAt: record.createTime,
    checkStatus: 2,
  }
}

export function resolveOutboundRecordFromTransaction(
  record: InventoryTransactionRecord
): OutboundRecord {
  const found = outboundRecordsMock.find((item) => matchOrderNo(item.orderNo, record) || item.id === record.orderNo)
  if (found) return found

  const owner = SHARED_OWNERS.find((item) => item.id === record.ownerId)
  const mapped = OUTBOUND_TYPE_MAP[record.businessType] ?? {
    type: "普通出库" as const,
    typeCode: "NORMAL" as const,
  }
  const goodsName = `${record.category}-${record.variety}-${record.specification}`
  return {
    id: record.orderNo,
    orderNo: record.orderNo,
    ownerType: owner?.ownerType === "1" ? "个人" : "企业",
    ownerName: record.ownerName,
    ownerIdentifier: owner?.identifierMasked ?? "—",
    type: mapped.type,
    typeCode: mapped.typeCode,
    outboundTime: record.businessDate,
    warehouseName: record.warehouseName,
    relatedNo: record.relatedId || "—",
    status: "已通过",
    statusCode: "APPROVED",
    goodsSummary: goodsName,
    goodsList: [
      {
        id: `${record.id}-g1`,
        categoryName: record.category,
        subCategoryName: record.variety,
        specName: record.specification,
        goodsName,
        totalOutboundAmount: record.changeQuantity,
        unit: record.unit,
      },
    ],
    totalAmount: record.changeQuantity,
    amountUnit: record.unit,
    categoryCount: 1,
    createdByName: record.createByName,
    createdByOrg: record.warehouseName,
    createTime: record.createTime,
    pickCompleted: true,
  }
}
