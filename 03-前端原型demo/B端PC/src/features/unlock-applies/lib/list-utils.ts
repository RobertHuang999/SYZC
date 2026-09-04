import {
  PROCESSED_STATUSES,
} from "../domain/constants"
import type { UnlockApply, UnlockApplyFilters } from "../domain/types"

const STATUS_FILTER_TO_CODE: Record<
  UnlockApplyFilters["applyStatus"],
  UnlockApply["status"][] | null
> = {
  全部: null,
  待审批: ["PENDING"],
  已处理: PROCESSED_STATUSES,
  已通过: ["APPROVED"],
  已驳回: ["REJECTED"],
  已撤回: ["WITHDRAWN"],
  已失效: ["EXPIRED"],
}

export function filterUnlockApplies(
  items: UnlockApply[],
  filters: UnlockApplyFilters
): UnlockApply[] {
  const allowedStatuses = STATUS_FILTER_TO_CODE[filters.applyStatus]

  return items
    .filter((item) => {
      if (allowedStatuses && !allowedStatuses.includes(item.status)) {
        return false
      }

      if (filters.applyNo.trim()) {
        if (!item.applyNo.includes(filters.applyNo.trim())) return false
      }

      const deviceKw = filters.deviceKeyword.trim().toLowerCase()
      if (deviceKw) {
        const haystack = `${item.deviceName} ${item.deviceCode}`.toLowerCase()
        if (!haystack.includes(deviceKw)) return false
      }

      if (filters.warehouseName !== "全部" && item.warehouseName !== filters.warehouseName) {
        return false
      }

      const applicantKw = filters.applicantKeyword.trim().toLowerCase()
      if (applicantKw) {
        const haystack = `${item.applicantName} ${item.applicantAccount}`.toLowerCase()
        if (!haystack.includes(applicantKw)) return false
      }

      if (filters.reason !== "全部" && item.reason !== filters.reason) return false

      if (filters.submitTimeFrom && item.submitTime < `${filters.submitTimeFrom} 00:00:00`) {
        return false
      }
      if (filters.submitTimeTo && item.submitTime > `${filters.submitTimeTo} 23:59:59`) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      if (filters.applyStatus === "待审批") {
        return a.submitTime.localeCompare(b.submitTime)
      }
      return b.submitTime.localeCompare(a.submitTime)
    })
}

export function paginateUnlockApplies<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function countPendingForCurrentUser(items: UnlockApply[]): number {
  return items.filter((item) => item.status === "PENDING" && item.eligible).length
}
