import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.resolve(
  __dirname,
  "../../../02-PRD文档/🌟🌟🌟-最新基准版/00-功能与数据权限/功能与数据权限清单.csv",
)
const overlay63Path = path.resolve(
  __dirname,
  "../../../02-PRD文档/B-迭代需求/6.3版本（2026.09）/功能与数据权限-6.3增量.json",
)
const outputPath = path.resolve(__dirname, "../src/features/permission-reference/data/permission-records.ts")

function parseCSVRows(text) {
  const rows = []
  let row = []
  let field = ""
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ",") {
      row.push(field.trim())
      field = ""
    } else if (char === "\n" || (char === "\r" && text[i + 1] === "\n")) {
      if (char === "\r") i += 1
      row.push(field.trim())
      if (row.some((cell) => cell.length > 0)) rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim())
    if (row.some((cell) => cell.length > 0)) rows.push(row)
  }

  return rows
}

function normalize(value) {
  return value.replace(/\s+/g, " ").trim()
}

function normalizeDate(value) {
  const match = normalize(value).match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (!match) return ""
  const [, year, month, day] = match
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

function buildPagePathSegments(level1, level2, tab) {
  return [level1, level2, tab].filter((segment) => segment && segment !== "-")
}

function buildHeaderIndex(headerRow) {
  const aliases = {
    移动PC端: "端",
    "移动/PC端": "端",
    二级子功能菜单Tab: "Tab",
    "二级子功能菜单/Tab": "Tab",
    原路径: "旧系统路径",
    "功能按钮/权限分类": "页面功能按钮",
    数据权限描述: "数据可见范围",
    备注说明: "变更说明",
  }
  const index = new Map()
  headerRow.forEach((cell, i) => {
    const key = aliases[cell.trim()] ?? cell.trim()
    if (key && !index.has(key)) index.set(key, i)
  })
  return index
}

function pick(row, headerIndex, key) {
  const idx = headerIndex.get(key)
  if (idx === undefined) return ""
  return normalize(row[idx] ?? "")
}

const csvContent = fs.readFileSync(csvPath, "utf8")
const rows = parseCSVRows(csvContent)
const headerIndex = buildHeaderIndex(rows[0])
const dataRows = rows.slice(1)

const expectedColumnCount = rows[0]?.length ?? 0
const normalizedDataRows = dataRows.map((row, index) => {
  if (row.length === expectedColumnCount) return row
  if (row.length < expectedColumnCount) {
    console.warn(
      `[permissions CSV] 第 ${index + 2} 行 ${row.length} 列，已补空至 ${expectedColumnCount} 列`,
    )
    return [...row, ...Array(expectedColumnCount - row.length).fill("")]
  }
  console.warn(
    `[permissions CSV] 第 ${index + 2} 行 ${row.length} 列，已截断至 ${expectedColumnCount} 列`,
  )
  return row.slice(0, expectedColumnCount)
})

let currentPlatform = ""
let currentModule = ""
let currentLevel1 = ""
let currentLevel2 = ""

const records = []

for (const row of normalizedDataRows) {
  const platformRaw = pick(row, headerIndex, "端")
  if (platformRaw) currentPlatform = platformRaw

  const moduleName = pick(row, headerIndex, "所属模块")
  const level1 = pick(row, headerIndex, "一级菜单")
  const level2 = pick(row, headerIndex, "二级菜单")
  const tab = pick(row, headerIndex, "Tab")
  const legacyPath = pick(row, headerIndex, "旧系统路径")
  const actionPermissions = pick(row, headerIndex, "页面功能按钮")
  const dataPermission = pick(row, headerIndex, "数据可见范围")
  const changeNote = pick(row, headerIndex, "变更说明")
  const createdAt = normalizeDate(pick(row, headerIndex, "创建时间"))
  const updatedAt = normalizeDate(pick(row, headerIndex, "修定时间"))
  const menuModuleCode = pick(row, headerIndex, "菜单模块编码")
  const topBarModuleLabel = pick(row, headerIndex, "顶栏/底栏模块名")
  const baselineModuleDir = pick(row, headerIndex, "基准模块目录")
  const recordStatus = pick(row, headerIndex, "记录状态") || "active"

  if (
    !currentPlatform &&
    !level1 &&
    !level2 &&
    !tab &&
    !actionPermissions &&
    !dataPermission &&
    !legacyPath &&
    !changeNote
  ) {
    continue
  }

  if (moduleName) currentModule = moduleName
  if (level1) {
    currentLevel1 = level1
    currentLevel2 = level2
  } else if (level2) {
    currentLevel2 = level2
  }

  if (!currentPlatform || !currentModule) continue

  const pagePathSegments = buildPagePathSegments(currentLevel1, currentLevel2, tab === "-" ? "" : tab)

  records.push({
    id: String(records.length + 1),
    platform: currentPlatform,
    module: currentModule,
    topBarModuleLabel,
    menuModuleCode,
    baselineModuleDir,
    recordStatus,
    pagePathSegments,
    pagePath: pagePathSegments.join(" / "),
    legacyPath,
    actionPermissions,
    dataPermission,
    changeNote,
    createdAt,
    updatedAt,
  })
}

function recordMatchesPatch(record, patch) {
  if (patch.platform && record.platform !== patch.platform) return false
  if (patch.pagePath && record.pagePath !== patch.pagePath) return false
  if (patch.level1Menu && record.pagePathSegments[0] !== patch.level1Menu) return false
  if (patch.level2Menu && record.pagePathSegments[1] !== patch.level2Menu) return false
  if (patch.tab && !record.pagePathSegments.includes(patch.tab)) return false
  if (patch.legacyPathIncludes && !record.legacyPath.includes(patch.legacyPathIncludes)) {
    return false
  }
  return true
}

function applyPatch(record, patch) {
  const next = { ...record }
  for (const key of [
    "recordStatus",
    "changeNote",
    "updatedAt",
    "createdAt",
    "actionPermissions",
    "dataPermission",
    "legacyPath",
    "module",
    "topBarModuleLabel",
    "menuModuleCode",
    "baselineModuleDir",
  ]) {
    if (patch[key] !== undefined && patch[key] !== "") {
      next[key] = patch[key]
    }
  }
  return next
}

function appendOverlayRecord(raw) {
  const pagePathSegments = raw.pagePathSegments ?? []
  return {
    platform: raw.platform,
    module: raw.module,
    topBarModuleLabel: raw.topBarModuleLabel ?? "",
    menuModuleCode: raw.menuModuleCode ?? "",
    baselineModuleDir: raw.baselineModuleDir ?? "",
    recordStatus: raw.recordStatus ?? "6.3-delivered",
    pagePathSegments,
    pagePath: pagePathSegments.join(" / "),
    legacyPath: raw.legacyPath ?? "",
    actionPermissions: raw.actionPermissions ?? "",
    dataPermission: raw.dataPermission ?? "",
    changeNote: raw.changeNote ?? "",
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
  }
}

let overlayApplied = { patches: 0, append: 0 }
if (fs.existsSync(overlay63Path)) {
  const overlay = JSON.parse(fs.readFileSync(overlay63Path, "utf8"))
  for (const patch of overlay.patches ?? []) {
    let hit = false
    for (let i = 0; i < records.length; i += 1) {
      if (recordMatchesPatch(records[i], patch)) {
        records[i] = applyPatch(records[i], patch)
        hit = true
        overlayApplied.patches += 1
      }
    }
    if (!hit) {
      console.warn(`[6.3 overlay] 未匹配 patch: ${JSON.stringify(patch)}`)
    }
  }
  for (const raw of overlay.append ?? []) {
    records.push(appendOverlayRecord(raw))
    overlayApplied.append += 1
  }
}

for (let i = 0; i < records.length; i += 1) {
  records[i].id = String(i + 1)
}

const fileContent = `// 自动生成，请勿手工编辑。运行 npm run generate:permissions 更新。
// 数据源：02-PRD文档/🌟🌟🌟-最新基准版/00-功能与数据权限/功能与数据权限清单.csv
// + 02-PRD文档/B-迭代需求/6.3版本（2026.09）/功能与数据权限-6.3增量.json
// CSV 列名与原型页四列对齐：页面路径 / 页面功能按钮 / 数据可见范围 / 变更记录

export type PermissionRecord = {
  id: string
  platform: "PC" | "移动"
  module: string
  topBarModuleLabel: string
  menuModuleCode: string
  baselineModuleDir: string
  recordStatus: "active" | "planned" | "cancelled" | "6.2-target" | "6.3-target" | "6.3-delivered"
  pagePathSegments: string[]
  pagePath: string
  legacyPath: string
  actionPermissions: string
  dataPermission: string
  changeNote: string
  createdAt: string
  updatedAt: string
}

export const permissionRecords: PermissionRecord[] = ${JSON.stringify(records, null, 2)}

export const permissionModuleTree = ${JSON.stringify(
  [...new Set(records.map((record) => record.module))],
  null,
  2,
)}
`

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, fileContent, "utf8")
console.log(
  `Generated ${records.length} permission records (6.3 overlay: ${overlayApplied.patches} patches, ${overlayApplied.append} append) -> ${outputPath}`,
)
