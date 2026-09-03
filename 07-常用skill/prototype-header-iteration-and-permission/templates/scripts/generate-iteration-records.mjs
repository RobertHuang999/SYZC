import fs from "node:fs"
import path from "node:path"

/**
 * 通用迭代记录生成脚本
 * 用法: node generate-iteration-records.mjs <markdownFilePath> <outputTsPath>
 */

const inputPath = process.argv[2] ?? path.resolve(process.cwd(), "templates/data/sample-menu-iteration-records.md")
const outputPath = process.argv[3] ?? path.resolve(process.cwd(), "templates/data/generated-iteration-records.ts")

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const meta = {}
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/)
    if (kv) meta[kv[1]] = kv[2]
  }
  return meta
}

function splitTableRow(line) {
  let trimmed = line.trim()
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1)
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1)

  const cells = []
  let cell = ""
  let escaping = false

  for (let i = 0; i < trimmed.length; i += 1) {
    const char = trimmed[i]
    if (char === "\\") {
      escaping = true
      continue
    }
    if (!escaping && char === "|") {
      cells.push(cell.trim())
      cell = ""
      continue
    }
    cell += char
    escaping = false
  }
  cells.push(cell.trim())
  return cells
}

function isSeparatorRow(line) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line.trim())
}

function normalizeCell(value) {
  const text = value.replace(/\\([\\|])/g, "$1").trim()
  if (text === "—" || text === "-") return ""
  return text
}

function parseMarkdownTable(text) {
  const lines = text.split(/\r?\n/)
  const sectionIndex = lines.findIndex((line) => /^##\s+/.test(line.trim()))
  const startIndex = sectionIndex === -1 ? 0 : sectionIndex + 1

  const tableLines = []
  for (let i = startIndex; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.trim()) {
      if (tableLines.length > 0) break
      continue
    }
    if (!line.trim().startsWith("|")) break
    tableLines.push(line)
  }

  if (tableLines.length < 2) return { headers: {}, rows: [] }

  const headerCells = splitTableRow(tableLines[0])
  const headers = {}
  headerCells.forEach((name, index) => {
    if (name) headers[name] = index
  })

  const rows = []
  for (let i = 1; i < tableLines.length; i += 1) {
    if (isSeparatorRow(tableLines[i])) continue
    const cells = splitTableRow(tableLines[i]).map(normalizeCell)
    if (cells.every((cell) => !cell)) continue
    rows.push(cells)
  }

  return { headers, rows }
}

function cell(row, headers, name) {
  const idx = headers[name]
  if (idx === undefined) return ""
  return row[idx] ?? ""
}

function run() {
  if (!fs.existsSync(inputPath)) {
    console.error(`未找到输入文件: ${inputPath}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(inputPath, "utf8")
  const meta = parseFrontmatter(raw)
  const { headers, rows } = parseMarkdownTable(raw)

  const version = meta.version ?? "V1.0"
  const versionMeta = {
    version,
    name: meta.name ?? `${version} 迭代`,
    summary: meta.summary ?? "",
    docPath: meta.docPath ?? "",
  }

  const entries = rows.map((row, index) => {
    return {
      id: `${version}-${index + 1}`,
      version,
      platform: cell(row, headers, "端") || "PC",
      type: cell(row, headers, "调整类型") || "新增",
      date: cell(row, headers, "日期") || "",
      title: cell(row, headers, "调整项说明") || cell(row, headers, "功能说明") || "",
      before: cell(row, headers, "调整前路径 / 菜单") || "",
      after: cell(row, headers, "调整后路径 / 菜单") || "",
      note: cell(row, headers, "调整原因 / 业务说明") || "",
      sourceDoc: cell(row, headers, "来源 PRD") || "",
    }
  })

  const outDir = path.dirname(outputPath)
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const content = `// 由 generate-iteration-records.mjs 自动生成
import type { IterationRecordEntry, IterationVersionMeta } from "../types"

export const iterationVersions: IterationVersionMeta[] = ${JSON.stringify([versionMeta], null, 2)}

export const iterationRecords: IterationRecordEntry[] = ${JSON.stringify(entries, null, 2)}
`

  fs.writeFileSync(outputPath, content, "utf8")
  console.log(`成功生成迭代记录：${outputPath}（共 ${entries.length} 条）`)
}

run()
