import type { RiskDisclosureFilters, RiskDisclosureRecord } from "../domain/types"

export function filterRiskDisclosureRecords(
  records: RiskDisclosureRecord[],
  filters: RiskDisclosureFilters
): RiskDisclosureRecord[] {
  return records
    .filter((record) => {
      if (
        filters.ruleName.trim() &&
        !record.ruleName
          .toLowerCase()
          .includes(filters.ruleName.trim().toLowerCase())
      ) {
        return false
      }

      if (
        filters.warningType !== "全部" &&
        record.warningType !== filters.warningType
      ) {
        return false
      }

      if (
        filters.orderNo.trim() &&
        !record.orderNo
          .toLowerCase()
          .includes(filters.orderNo.trim().toLowerCase())
      ) {
        return false
      }

      if (
        filters.ownerName.trim() &&
        !record.ownerName
          .toLowerCase()
          .includes(filters.ownerName.trim().toLowerCase())
      ) {
        return false
      }

      if (
        filters.disclosureStatus !== "全部" &&
        record.disclosureStatus !== filters.disclosureStatus
      ) {
        return false
      }

      return true
    })
    .sort(
      (a, b) =>
        new Date(b.lastDisclosureTime.replace(" ", "T")).getTime() -
        new Date(a.lastDisclosureTime.replace(" ", "T")).getTime()
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
