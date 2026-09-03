import fs from "node:fs"
import path from "node:path"

/**
 * 通用 CSV 权限表转 TS 数据脚本
 * 用法: node generate-permission-records.mjs <csvFilePath> <outputTsPath>
 */

const csvPath = process.argv[2] ?? path.resolve(process.cwd(), "templates/data/sample-permission-records.csv")
const outputPath = process.argv[3] ?? path.resolve(process.cwd(), "templates/data/generated-permission-records.ts")

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
  return (value || "").replace(/\s+/g, " ").trim()
}

function normalizeDate(value) {
  const match = normalize(value).match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (!match) return normalize(value)
  const [, year, month, day] = match
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

function buildHeaderIndex(headerRow) {
  const aliases = {
    移动PC端: "端",
    "移动/PC端": "端",
    功能按钮: "功能按钮/权限分类",
    页面功能按钮: "功能按钮/权限分类",
    数据权限: "数据权限描述",
    数据可见范围: "数据权限描述",
    备注: "变更说明",
    备注说明: "变更说明",
    修订日志: "变更说明",
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

function run() {
  if (!fs.existsSync(csvPath)) {
    console.error(`未找到 CSV 输入文件: ${csvPath}`)
    process.exit(1)
  }

  const csvContent = fs.readFileSync(csvPath, "utf8")
  const rows = parseCSVRows(csvContent)
  if (rows.length < 2) {
    console.error("CSV 文件格式不正确或缺少数据行")
    process.exit(1)
  }

  const headerIndex = buildHeaderIndex(rows[0])
  const dataRows = rows.slice(1)

  const records = dataRows.map((row, index) => {
    const pagePathRaw = pick(row, headerIndex, "页面路径")
    const segments = pagePathRaw
      .split(/[\/>]/)
      .map((s) => s.trim())
      .filter(Boolean)

    const changeNote = pick(row, headerIndex, "变更说明")
    let recordStatus = "current"
    if (/计划中|规划中|待开发/.test(changeNote)) {
      recordStatus = "planned"
    } else if (/已取消|取消|作废/.test(changeNote)) {
      recordStatus = "cancelled"
    }

    return {
      id: `perm-${index + 1}`,
      platform: pick(row, headerIndex, "端") || "PC",
      module: pick(row, headerIndex, "一级模块") || "通用模块",
      pagePath: pagePathRaw,
      pagePathSegments: segments,
      legacyPath: pick(row, headerIndex, "旧系统路径") || undefined,
      actionPermissions: pick(row, headerIndex, "功能按钮/权限分类"),
      dataPermission: pick(row, headerIndex, "数据权限描述"),
      createdAt: normalizeDate(pick(row, headerIndex, "创建时间")),
      updatedAt: normalizeDate(pick(row, headerIndex, "修订时间")),
      changeNote,
      recordStatus,
    }
  })

  const outDir = path.dirname(outputPath)
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const content = `// 由 generate-permission-records.mjs 自动生成
import type { PermissionRecord } from "../types"

export const permissionRecords: PermissionRecord[] = ${JSON.stringify(records, null, 2)}
`

  fs.writeFileSync(outputPath, content, "utf8")
  console.log(`成功生成功能与数据权限记录：${outputPath}（共 ${records.length} 条）`)
}

run()
