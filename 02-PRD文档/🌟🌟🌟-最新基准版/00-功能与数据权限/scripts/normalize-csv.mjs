/**
 * 将功能与数据权限清单 CSV 规范化为与原型页四列对齐的字段结构。
 * 用法：node normalize-csv.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.resolve(__dirname, "../功能与数据权限清单.csv")

const OUTPUT_HEADERS = [
  "端",
  "所属模块",
  "一级菜单",
  "二级菜单",
  "Tab",
  "旧系统路径",
  "页面功能按钮",
  "数据可见范围",
  "变更说明",
  "创建时间",
  "修定时间",
  "菜单模块编码",
  "顶栏/底栏模块名",
  "基准模块目录",
  "记录状态",
]

/** 旧版列名 → 新版列名（兼容历史 CSV） */
const LEGACY_HEADER_ALIASES = {
  移动PC端: "端",
  "移动/PC端": "端",
  二级子功能菜单Tab: "Tab",
  "二级子功能菜单/Tab": "Tab",
  原路径: "旧系统路径",
  "功能按钮/权限分类": "页面功能按钮",
  数据权限描述: "数据可见范围",
  备注说明: "变更说明",
}

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
    if (char === '"') inQuotes = true
    else if (char === ",") {
      row.push(field)
      field = ""
    } else if (char === "\n" || (char === "\r" && text[i + 1] === "\n")) {
      if (char === "\r") i += 1
      row.push(field)
      if (row.some((cell) => cell.length > 0)) rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    if (row.some((cell) => cell.length > 0)) rows.push(row)
  }
  return rows
}

function escapeCSV(value) {
  const text = String(value ?? "")
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function normalizeHeaderName(name) {
  const trimmed = name.trim()
  return LEGACY_HEADER_ALIASES[trimmed] ?? trimmed
}

function buildHeaderIndex(headerRow) {
  const index = new Map()
  headerRow.forEach((cell, i) => {
    const key = normalizeHeaderName(cell)
    if (key && !index.has(key)) index.set(key, i)
  })
  return index
}

function pick(row, headerIndex, key) {
  const idx = headerIndex.get(key)
  if (idx === undefined) return ""
  return (row[idx] ?? "").trim()
}

const sourceRows = parseCSVRows(fs.readFileSync(csvPath, "utf8"))
const headerIndex = buildHeaderIndex(sourceRows[0])
const outputRows = [OUTPUT_HEADERS]

for (const row of sourceRows.slice(1)) {
  const platform = pick(row, headerIndex, "端")
  if (!platform) continue

  outputRows.push([
    platform,
    pick(row, headerIndex, "所属模块"),
    pick(row, headerIndex, "一级菜单"),
    pick(row, headerIndex, "二级菜单"),
    pick(row, headerIndex, "Tab"),
    pick(row, headerIndex, "旧系统路径"),
    pick(row, headerIndex, "页面功能按钮"),
    pick(row, headerIndex, "数据可见范围"),
    pick(row, headerIndex, "变更说明"),
    pick(row, headerIndex, "创建时间"),
    pick(row, headerIndex, "修定时间"),
    pick(row, headerIndex, "菜单模块编码"),
    pick(row, headerIndex, "顶栏/底栏模块名"),
    pick(row, headerIndex, "基准模块目录"),
    pick(row, headerIndex, "记录状态"),
  ])
}

const csvContent = `${outputRows.map((row) => row.map(escapeCSV).join(",")).join("\n")}\n`
fs.writeFileSync(csvPath, csvContent, "utf8")
console.log(`Normalized ${outputRows.length - 1} rows -> ${csvPath}`)
