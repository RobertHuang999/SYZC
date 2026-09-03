import type { PermissionRecord } from "../data/permission-records"

/** 6.2 目标态菜单（未上线）；主列表展示，并在「6.2目标菜单」弹窗中提供聚合查看 */
export function is62TargetFeature(record: PermissionRecord): boolean {
  return record.recordStatus === "6.2-target"
}

function normalizeLegacyPath(path: string) {
  return path.replace(/[～~]/g, "/").replace(/\s+/g, "").trim()
}

/** 当前线上路径将按同端口、同原路径关系迁移到 6.2 目标菜单 */
export function is62MigrationSource(record: PermissionRecord, records: PermissionRecord[]): boolean {
  if (record.recordStatus !== "active") return false

  const sourcePath = normalizeLegacyPath(record.legacyPath)
  if (!sourcePath || sourcePath === "-") return false

  return records.some(
    (target) =>
      is62TargetFeature(target) &&
      target.platform === record.platform &&
      normalizeLegacyPath(target.legacyPath) === sourcePath,
  )
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

/** 归档状态条目（待开发 + 已取消 + 6.2 目标态）；具体页面可按展示口径筛选 */
export function isArchivedFeature(record: PermissionRecord): boolean {
  return isPlannedFeature(record) || isCancelledFeature(record) || is62TargetFeature(record)
}

export function countPlannedFeatures(records: PermissionRecord[]) {
  return records.filter(isPlannedFeature).length
}

export function countCancelledFeatures(records: PermissionRecord[]) {
  return records.filter(isCancelledFeature).length
}
