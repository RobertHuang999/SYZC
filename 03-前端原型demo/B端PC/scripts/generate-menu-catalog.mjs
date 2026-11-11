import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  buildHeaderIndex,
  parseCSVRows,
  resolveInheritedRow,
} from "../../../02-PRD文档/🌟🌟🌟-最新基准版/00-功能与数据权限/scripts/csv-inheritance.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.resolve(
  __dirname,
  "../../../02-PRD文档/🌟🌟🌟-最新基准版/00-功能与数据权限/功能与数据权限清单.csv",
)
const outputPath = path.resolve(__dirname, "../src/config/menu-catalog.generated.ts")

const moduleMap = {
  "1.工作中心": "home",
  "2.用户中心": "user-center",
  "3.仓储": "storage",
  "4.融资/监管": "finance",
  "5.交易": "trade",
  "6.风控": "risk",
  "7.物联网IOT与预警": "device-warning",
  "8.统计/看板": "statistics",
  "9.结算": "settlement",
  "10.配置管理": "config",
  "11.合同签署": "contract",
  // 合流前 CSV 别名（旧编号）
  "2.仓储": "storage",
  "3.融资/监管": "finance",
  "4.交易": "trade",
  "5.风控": "risk",
  "6.物联网IOT与预警": "device-warning",
  "7.统计/看板": "statistics",
  "8.结算": "settlement",
  "9.配置管理": "config",
  "10.用户中心": "user-center",
  "6.统计/看板": "statistics",
  "7.结算": "settlement",
  "8.配置管理": "config",
  "9.物联网IOT与预警": "device-warning",
}

const migratedOnlineGroups = {
  storage: new Set(["设备管理"]),
  risk: new Set(["风险信息"]),
  config: new Set(["预警配置"]),
}

function stripModulePrefix(value) {
  return value.replace(/^\d+\./, "")
}

function slugify(value) {
  return value
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

function buildPath(parts) {
  return `/${parts.join("/")}`
}

function shouldIncludeInPrototypeMenu(resolved, moduleId) {
  if (resolved.recordStatus === "cancelled" || resolved.recordStatus === "planned") return false
  if (resolved.recordStatus === "6.2-target") return true

  if (resolved.recordStatus === "active") {
    if (/【6\.2目标态】/.test(resolved.changeNote ?? "")) return false

    const level1 = stripModulePrefix(resolved.level1)
    if (migratedOnlineGroups[moduleId]?.has(level1)) return false

    return true
  }

  return false
}

/** 一级菜单下 Tab 为页内切换，侧栏只保留单入口（对齐线上「项目监管～监管档案」） */
const SIDEBAR_HUB_ONLY_LEVEL1 = new Set(["监管档案"])
/** 二级菜单下 Tab 为页内切换，侧栏只保留单入口（抵押/质押/监管服务订单） */
const SIDEBAR_HUB_ONLY_LEVEL2 = new Set(["监管管理"])
/** Tab 仅登记权限/路由，不出现在侧栏（已并入父级看板页） */
const SIDEBAR_EXCLUDED_TABS = new Set(["链接分享记录"])

function shouldOmitSidebarCatalogEntry(resolved) {
  const tab = resolved.tab
  return tab && tab !== "-" && SIDEBAR_EXCLUDED_TABS.has(tab)
}

function isHubOnlyLevel1Sidebar(resolved) {
  const level1 = stripModulePrefix(resolved.level1)
  const level2 = resolved.level2
  return SIDEBAR_HUB_ONLY_LEVEL1.has(level1) && (!level2 || level2 === "-")
}

function isHubOnlyLevel2Sidebar(resolved) {
  const level2 = resolved.level2
  const tab = resolved.tab
  return level2 && level2 !== "-" && SIDEBAR_HUB_ONLY_LEVEL2.has(level2) && tab && tab !== "-"
}

function isHubOnlySidebarEntry(resolved) {
  return isHubOnlyLevel1Sidebar(resolved) || isHubOnlyLevel2Sidebar(resolved)
}

function hubRoutePathForSidebar(resolved) {
  const level1 = stripModulePrefix(resolved.level1)
  const level2 = resolved.level2
  if (isHubOnlyLevel1Sidebar(resolved)) {
    return buildPath([stripModulePrefix(resolved.module), level1].filter(Boolean))
  }
  if (isHubOnlyLevel2Sidebar(resolved)) {
    return buildPath([stripModulePrefix(resolved.module), level1, level2].filter(Boolean))
  }
  return buildRoutePath(resolved)
}

function buildRoutePath(resolved) {
  const level1 = stripModulePrefix(resolved.level1)
  const level2 = resolved.level2
  const tab = resolved.tab

  const pathParts = [stripModulePrefix(resolved.module)]
  if (level1) pathParts.push(level1)
  if (level2 && level2 !== "-") pathParts.push(level2)
  if (tab && tab !== "-") pathParts.push(tab)

  return buildPath(pathParts.filter(Boolean))
}

function buildSidebarEntry(resolved) {
  const level1 = stripModulePrefix(resolved.level1)
  const level2 = resolved.level2
  const tab = resolved.tab

  if (isHubOnlyLevel1Sidebar(resolved)) {
    const routePath = buildPath([stripModulePrefix(resolved.module), level1].filter(Boolean))
    return {
      routePath,
      label: level1,
      groupLabel: level1,
      groupId: slugify(level1) || moduleMap[resolved.module] || "menu",
    }
  }

  if (isHubOnlyLevel2Sidebar(resolved)) {
    const routePath = buildPath([stripModulePrefix(resolved.module), level1, level2].filter(Boolean))
    return {
      routePath,
      label: level2,
      groupLabel: level1,
      groupId: slugify(level1) || moduleMap[resolved.module] || "menu",
    }
  }

  const routePath = buildRoutePath(resolved)
  const label =
    tab && tab !== "-"
      ? tab
      : level2 && level2 !== "-"
        ? level2
        : level1 || stripModulePrefix(resolved.module)
  const groupLabel = level1 || "功能入口"
  const groupId = slugify(groupLabel) || moduleMap[resolved.module] || "menu"

  return { routePath, label, groupLabel, groupId }
}

const csv = fs.readFileSync(csvPath, "utf8")
const rows = parseCSVRows(csv)
const headerIndex = buildHeaderIndex(rows[0])

/** @type {Record<string, { groupOrder: string[], groups: Map<string, { id: string, label: string, itemOrder: string[], items: Map<string, string> }> }>} */
const catalog = {}
const inheritanceState = {}
const allRoutePaths = new Set()

for (const row of rows.slice(1)) {
  const resolved = resolveInheritedRow(row, headerIndex, inheritanceState)
  if (resolved.platform !== "PC") continue

  const moduleId = moduleMap[resolved.module]
  if (!moduleId || !shouldIncludeInPrototypeMenu(resolved, moduleId)) continue

  allRoutePaths.add(buildRoutePath(resolved))
  if (isHubOnlySidebarEntry(resolved)) {
    allRoutePaths.add(hubRoutePathForSidebar(resolved))
  }

  if (shouldOmitSidebarCatalogEntry(resolved)) {
    continue
  }

  const { routePath, label, groupLabel, groupId } = buildSidebarEntry(resolved)

  catalog[moduleId] ??= { groupOrder: [], groups: new Map() }
  const moduleCatalog = catalog[moduleId]

  if (!moduleCatalog.groups.has(groupLabel)) {
    moduleCatalog.groups.set(groupLabel, {
      id: groupId,
      label: groupLabel,
      itemOrder: [],
      items: new Map(),
    })
    moduleCatalog.groupOrder.push(groupLabel)
  }

  const group = moduleCatalog.groups.get(groupLabel)
  if (!group.items.has(routePath)) {
    group.itemOrder.push(routePath)
  }
  group.items.set(routePath, label)
}

/** @type {Record<string, Array<{ id: string, label: string, items: Array<{ label: string, path: string }> }>>} */
const serialized = {}

for (const [moduleId, moduleCatalog] of Object.entries(catalog)) {
  serialized[moduleId] = moduleCatalog.groupOrder.map((groupLabel) => {
    const group = moduleCatalog.groups.get(groupLabel)
    return {
      id: group.id,
      label: group.label,
      items: group.itemOrder.map((itemPath) => ({
        label: group.items.get(itemPath),
        path: itemPath,
      })),
    }
  })
}

const allPaths = [...allRoutePaths].sort()

const output = `// AUTO-GENERATED by scripts/generate-menu-catalog.mjs — do not edit manually.
import type { SidebarGroup } from "./navigation"

export const generatedSidebarGroupsByModule: Record<string, SidebarGroup[]> = ${JSON.stringify(serialized, null, 2)} as const

export const generatedMenuPaths: readonly string[] = ${JSON.stringify(allPaths, null, 2)} as const
`

fs.writeFileSync(outputPath, output, "utf8")
console.log(`Wrote ${allPaths.length} menu paths to ${outputPath}`)
