import type {
  ExportRecordItem,
  InventoryCrossExportTargetId,
  InventoryExportSourceMenu,
} from "@/features/inventory-management/domain/types"

export type { InventoryCrossExportTargetId, InventoryExportSourceMenu, ExportRecordItem }

export const ALL_CROSS_EXPORT_TARGETS: InventoryCrossExportTargetId[] = [
  "STAT_REPO",
  "STAT_GOODS",
  "STAT_OWNER",
  "DETAIL",
  "FLOW",
]

const EMPTY_SELECTION: Record<InventoryCrossExportTargetId, boolean> = {
  STAT_REPO: false,
  STAT_GOODS: false,
  STAT_OWNER: false,
  DETAIL: false,
  FLOW: false,
}

/** 本菜单 / 其他菜单分组（用于弹窗分区展示） */
export function getCrossExportMenuGroups(sourceMenu: InventoryExportSourceMenu): {
  currentMenuLabel: string
  current: InventoryCrossExportTargetId[]
  other: InventoryCrossExportTargetId[]
} {
  if (sourceMenu === "存货管理") {
    return {
      currentMenuLabel: "存货管理",
      current: ["STAT_REPO", "STAT_GOODS", "STAT_OWNER"],
      other: ["DETAIL", "FLOW"],
    }
  }
  if (sourceMenu === "库存明细") {
    return {
      currentMenuLabel: "库存明细",
      current: ["DETAIL"],
      other: ["STAT_REPO", "STAT_GOODS", "STAT_OWNER", "FLOW"],
    }
  }
  return {
    currentMenuLabel: "库存流水",
    current: ["FLOW"],
    other: ["STAT_REPO", "STAT_GOODS", "STAT_OWNER", "DETAIL"],
  }
}

/** 默认仅勾选「本菜单」项（IE-R01 原型口径） */
export function createDefaultCrossExportSelection(
  sourceMenu: InventoryExportSourceMenu
): Record<InventoryCrossExportTargetId, boolean> {
  const { current } = getCrossExportMenuGroups(sourceMenu)
  const next = { ...EMPTY_SELECTION }
  current.forEach((id) => {
    next[id] = true
  })
  return next
}

export function buildContentSummary(targets: InventoryCrossExportTargetId[]): string {
  const short: Record<InventoryCrossExportTargetId, string> = {
    STAT_REPO: "仓库",
    STAT_GOODS: "货物",
    STAT_OWNER: "货主",
    DETAIL: "明细",
    FLOW: "流水",
  }
  return targets.map((id) => short[id]).join("+")
}

/** 是否跨菜单（存货管理 / 库存明细 / 库存流水 三类中选了 2 类及以上） */
export function isCrossMenuExport(targets: InventoryCrossExportTargetId[]): boolean {
  const hasStat = targets.some((id) => id.startsWith("STAT_"))
  const hasDetail = targets.includes("DETAIL")
  const hasFlow = targets.includes("FLOW")
  return [hasStat, hasDetail, hasFlow].filter(Boolean).length >= 2
}

export function resolveCombinedExportFileName(
  targets: InventoryCrossExportTargetId[],
  compactTimestamp: string
): string {
  const base = `库存组合导出-${compactTimestamp}`
  return isCrossMenuExport(targets) ? `${base}.zip` : `${base}.xlsx`
}

export function createCombinedExportRecord(
  targets: InventoryCrossExportTargetId[],
  sourceMenu: InventoryExportSourceMenu
): ExportRecordItem {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, "0")
  const compact = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const createTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const crossMenu = isCrossMenuExport(targets)

  return {
    id: `EXP-CMB-${compact}`,
    fileName: resolveCombinedExportFileName(targets, compact),
    viewDimension: crossMenu ? "跨菜单组合导出" : "单菜单导出",
    filterSummary: crossMenu
      ? "跨菜单；权限内全量；明细仅含仍有库存余量的记录；交付 Zip 压缩包"
      : "权限内全量；明细仅含仍有库存余量的记录",
    recordCount: 0,
    fileSize: "—",
    creator: "李晓云",
    creatorOrg: "四川享宇科技有限公司",
    createTime,
    status: "GENERATING",
    downloadUrl: "#",
    exportKind: "combined",
    contentSummary: buildContentSummary(targets),
    sourceMenu,
    selectedTargets: targets,
    crossMenuPackaged: crossMenu,
  }
}
