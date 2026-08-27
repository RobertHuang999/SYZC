import type { RiskDisclosureRecordDetail } from "../domain/types"
import { getRiskDisclosureDetailExtension } from "../mock/risk-disclosure-record-details.mock"
import { riskDisclosureRecordsMock } from "../mock/risk-disclosure-records.mock"

export function getRiskDisclosureById(
  recordId: string | undefined
): RiskDisclosureRecordDetail | null {
  if (!recordId) {
    return null
  }

  const record = riskDisclosureRecordsMock.find(
    (item) => item.recordId === recordId
  )
  if (!record) {
    return null
  }

  return {
    ...record,
    ...getRiskDisclosureDetailExtension(record),
  }
}
