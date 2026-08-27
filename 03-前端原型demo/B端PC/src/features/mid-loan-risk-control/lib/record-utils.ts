import type { MidLoanRiskFilters, MidLoanRiskRecord } from "../domain/types"

export function filterMidLoanRiskRecords(
  records: MidLoanRiskRecord[],
  filters: MidLoanRiskFilters
): MidLoanRiskRecord[] {
  return records
    .filter((record) => {
      if (
        filters.orderNo.trim() &&
        !record.orderNo.toLowerCase().includes(filters.orderNo.trim().toLowerCase())
      ) {
        return false
      }

      if (
        filters.executionStatus !== "全部" &&
        record.lastExecutionStatus !== filters.executionStatus
      ) {
        return false
      }

      if (
        filters.executability !== "全部" &&
        record.executability !== filters.executability
      ) {
        return false
      }

      return true
    })
    .sort(
      (a, b) =>
        new Date(b.orderCreatedAt.replace(" ", "T")).getTime() -
        new Date(a.orderCreatedAt.replace(" ", "T")).getTime()
    )
}

export function paginateRecords<T>(
  records: T[],
  page: number,
  pageSize: number
): T[] {
  const start = (page - 1) * pageSize
  return records.slice(start, start + pageSize)
}

export function canExecute(record: MidLoanRiskRecord): boolean {
  return record.executability === "可执行"
}
