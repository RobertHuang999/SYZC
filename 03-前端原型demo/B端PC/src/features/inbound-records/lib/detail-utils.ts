import {
  buildInboundRecordDetail,
  type InboundRecordDetail,
  type InboundListRowForDetail,
} from "@prototype/shared/inbound/build-inbound-detail"
import { inboundAppliesMock, inboundRecordsMock } from "../mock/inbound-records.mock"

export type { InboundRecordDetail } from "@prototype/shared/inbound/build-inbound-detail"
export type {
  InboundGoodsDetailLine,
  InboundIotCapture,
  InboundModifyLog,
} from "@prototype/shared/inbound/build-inbound-detail"

export function getInboundRecordDetailById(
  id: string | undefined
): InboundRecordDetail | undefined {
  if (!id) return undefined

  // 优先在入库申请中查找
  const apply = inboundAppliesMock.find((row) => row.id === id || row.orderNo === id)
  if (apply) {
    const rowForDetail: InboundListRowForDetail = {
      id: apply.id,
      orderNo: apply.orderNo,
      ownerName: apply.ownerName,
      ownerType: apply.ownerType,
      ownerIdentifierMasked: apply.ownerIdentifierMasked,
      inboundType: apply.inboundTypeLabel,
      inboundDate: apply.inboundTime,
      warehouseName: apply.repoName,
      houseNames: apply.houseName,
      relatedOrderNo: null,
      goodsNames: [apply.goodsSpec],
      inboundQuantity: apply.amount,
      unit: apply.unit,
      creatorDisplay: apply.operator,
      createdAt: apply.inboundTime,
      checkStatus: apply.checkStatus,
      revokedTime: apply.revokedTime,
      remark: "现场验收核对一致，符合入库条件。",
    }
    return buildInboundRecordDetail(rowForDetail)
  }

  // 其次在入库记录中查找
  const record = inboundRecordsMock.find((row) => row.id === id || row.orderNo === id)
  if (record) {
    const rowForDetail: InboundListRowForDetail = {
      id: record.id,
      orderNo: record.orderNo,
      ownerName: record.ownerName,
      ownerType: record.ownerType,
      ownerIdentifierMasked: record.ownerIdentifierMasked,
      inboundType: record.inboundType,
      inboundDate: record.inboundDate,
      warehouseName: record.warehouseName,
      houseNames: record.houseName,
      relatedOrderNo: record.relatedOrderNo,
      goodsNames: record.goodsNames,
      goodsLineItems: record.goodsLineItems,
      inboundQuantity: record.inboundQuantity,
      unit: record.unit,
      creatorDisplay: record.creatorDisplay,
      createdAt: record.createdAt,
      checkStatus: 2,
      remark: "进场已按供应链金融存货质押指引完成验收核对。",
    }
    return buildInboundRecordDetail(rowForDetail)
  }

  return undefined
}
