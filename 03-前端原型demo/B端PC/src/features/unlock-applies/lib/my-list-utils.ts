import { CURRENT_APPLICANT_ACCOUNT } from "../domain/constants"
import type { MyUnlockApplyFilters, UnlockApply } from "../domain/types"

export function filterMyUnlockApplies(
  items: UnlockApply[],
  filters: MyUnlockApplyFilters
): UnlockApply[] {
  return items
    .filter((item) => item.applicantAccount === CURRENT_APPLICANT_ACCOUNT)
    .filter((item) => {
      if (filters.needsApproval === "否" && item.needsApproval) return false
      if (filters.needsApproval === "是" && !item.needsApproval) return false

      if (filters.applyStatuses.length > 0 && !filters.applyStatuses.includes(item.status)) {
        return false
      }

      if (
        filters.credentialStatuses.length > 0 &&
        !filters.credentialStatuses.includes(item.credential.status)
      ) {
        return false
      }

      const deviceNameKw = filters.deviceName.trim().toLowerCase()
      if (deviceNameKw && !item.deviceName.toLowerCase().includes(deviceNameKw)) {
        return false
      }

      if (filters.deviceCode.trim() && item.deviceCode !== filters.deviceCode.trim()) {
        return false
      }

      if (filters.deviceType !== "全部" && item.deviceType !== filters.deviceType) {
        return false
      }

      if (filters.warehouseName !== "全部" && item.warehouseName !== filters.warehouseName) {
        return false
      }

      if (filters.reason !== "全部" && item.reason !== filters.reason) return false

      if (
        filters.configNo.trim() &&
        item.configSnapshot.configNo !== filters.configNo.trim()
      ) {
        return false
      }

      if (filters.submitTimeFrom && item.submitTime < `${filters.submitTimeFrom} 00:00:00`) {
        return false
      }
      if (filters.submitTimeTo && item.submitTime > `${filters.submitTimeTo} 23:59:59`) {
        return false
      }

      return true
    })
    .sort((a, b) => b.submitTime.localeCompare(a.submitTime))
}
