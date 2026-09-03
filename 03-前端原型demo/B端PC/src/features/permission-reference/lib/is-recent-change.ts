import type { PermissionRecord } from "../data/permission-records"

/** 是否存在修订日期或变更备注 */
export function isRecentChange(record: PermissionRecord): boolean {
  if (record.changeNote.trim()) return true
  if (record.updatedAt && record.updatedAt !== record.createdAt) return true
  return false
}

export function countRecentChanges(records: PermissionRecord[]) {
  return records.filter(isRecentChange).length
}
