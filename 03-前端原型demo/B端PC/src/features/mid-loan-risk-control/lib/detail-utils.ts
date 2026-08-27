import type { MidLoanRiskRecordDetail } from "../domain/types"
import { getMidLoanRiskDetailExtension } from "../mock/mid-loan-risk-record-details.mock"
import { midLoanRiskRecordsMock } from "../mock/mid-loan-risk-records.mock"

export function getMidLoanRiskById(
  recordId: string | undefined
): MidLoanRiskRecordDetail | null {
  if (!recordId) {
    return null
  }

  const record = midLoanRiskRecordsMock.find((item) => item.recordId === recordId)
  if (!record) {
    return null
  }

  return {
    ...record,
    ...getMidLoanRiskDetailExtension(record),
  }
}
