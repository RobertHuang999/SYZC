import { riskDisclosureRecordsMock } from "../mock/risk-disclosure-records.mock"

export function getRiskDisclosureRecordIdBySourceWarningId(
  sourceWarningId: string
): string | null {
  const record = riskDisclosureRecordsMock.find(
    (item) =>
      item.sourceWarningId === sourceWarningId &&
      item.disclosureStatus === "已公示"
  )
  return record?.recordId ?? null
}

export function getRiskDisclosureRecordIdByOrderNo(
  orderNo: string
): string | null {
  const record = riskDisclosureRecordsMock.find(
    (item) => item.orderNo === orderNo && item.disclosureStatus === "已公示"
  )
  return record?.recordId ?? null
}
