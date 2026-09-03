import type { PermissionRecord } from "../data/permission-records"

/** 6.2 目标态菜单（未上线）；主列表隐藏，见「6.2目标菜单」弹窗 */
export function is62TargetFeature(record: PermissionRecord): boolean {
  return record.recordStatus === "6.2-target"
}

/** 备注为「计划中」等、尚未进入研发交付的条目 */
export function isPlannedFeature(record: PermissionRecord): boolean {
  return /计划中/.test(record.changeNote.trim())
}

/** 备注标明菜单/功能已从系统中取消的条目 */
export function isCancelledFeature(record: PermissionRecord): boolean {
  const note = record.changeNote.trim()
  if (!note) return false

  return /版本取消/.test(note) || /取消.*菜单/.test(note) || /^已取消/.test(note)
}

/** 主列表应隐藏的归档条目（待开发 + 已取消 + 6.2 目标态） */
export function isArchivedFeature(record: PermissionRecord): boolean {
  return isPlannedFeature(record) || isCancelledFeature(record) || is62TargetFeature(record)
}

export function countPlannedFeatures(records: PermissionRecord[]) {
  return records.filter(isPlannedFeature).length
}

export function countCancelledFeatures(records: PermissionRecord[]) {
  return records.filter(isCancelledFeature).length
}
