import type { PermissionRecord } from "../types"

/** 是否为规划中特性（尚未交付/尚未进入研发） */
export function isPlannedFeature(record: PermissionRecord): boolean {
  if (record.recordStatus === "planned") return true
  return /计划中|规划中|待开发/.test(record.changeNote.trim())
}

/** 是否为已取消特性（已从系统或规划中废弃） */
export function isCancelledFeature(record: PermissionRecord): boolean {
  if (record.recordStatus === "cancelled") return true
  const note = record.changeNote.trim()
  if (!note) return false
  return /取消|已取消|作废|废弃/.test(note)
}

/** 是否为下一目标版本特性（如 6.2 目标态等） */
export function isTargetVersionFeature(record: PermissionRecord, targetVersionKeyword = "目标态"): boolean {
  if (record.recordStatus === "target-feature") return true
  return record.changeNote.trim().includes(targetVersionKeyword)
}

/** 主列表常态下应隐藏的条目（规划中 + 已取消） */
export function isArchivedFeature(record: PermissionRecord): boolean {
  return isPlannedFeature(record) || isCancelledFeature(record)
}

/** 是否存在近期修订日期或变更说明 */
export function isRecentChange(record: PermissionRecord): boolean {
  if (record.changeNote.trim()) return true
  if (record.updatedAt && record.updatedAt !== record.createdAt) return true
  return false
}

export function countPlannedFeatures(records: PermissionRecord[]) {
  return records.filter(isPlannedFeature).length
}

export function countCancelledFeatures(records: PermissionRecord[]) {
  return records.filter(isCancelledFeature).length
}

export function countRecentChanges(records: PermissionRecord[]) {
  return records.filter(isRecentChange).length
}
