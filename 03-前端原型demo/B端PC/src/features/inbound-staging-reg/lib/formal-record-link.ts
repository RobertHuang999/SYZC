import {
  inboundApplyDetailPath,
  inboundRecordDetailPath,
} from "@/features/inbound-records/domain/constants"
import { inboundRecordsMock } from "@/features/inbound-records/mock/inbound-records.mock"
import { resolveFormalInboundByOrderNo } from "@prototype/shared/inbound/formal-inbound-link"

export function resolveFormalInboundDetailPath(
  orderNo: string | null | undefined,
): string | null {
  if (!orderNo?.trim()) return null
  const trimmed = orderNo.trim()

  const catalog = resolveFormalInboundByOrderNo(trimmed)
  if (catalog?.kind === "approved-record") {
    return inboundRecordDetailPath(catalog.pcId)
  }
  if (catalog?.kind === "demo-apply") {
    return inboundApplyDetailPath(catalog.applyId)
  }

  const fromRecord = inboundRecordsMock.find((row) => row.orderNo === trimmed)
  if (fromRecord) return inboundRecordDetailPath(fromRecord.id)

  return null
}
