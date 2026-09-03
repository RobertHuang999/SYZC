import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iterationRoot = path.resolve(__dirname, "../../../02-PRD文档/B-迭代需求")
const recordFileName = "00-菜单迭代记录.md"
const outputPath = path.resolve(
  __dirname,
  "../src/features/permission-reference/data/menu-iteration-records.ts",
)

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

function parseMarkdownTable(text, sectionTitle = "菜单调整明细") {
  const lines = text.split(/\r?\n/)
  const sectionIndex = lines.findIndex((line) =>
    new RegExp(`^##\\s+${sectionTitle}\\s*$`).test(line.trim()),
  )
  if (sectionIndex === -1) return { headers: {}, rows: [] }

  const tableLines = []
  for (let i = sectionIndex + 1; i < lines.length; i += 1) {
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

function discoverVersionRecords() {
  const entries = []
  const dirNames = fs
    .readdirSync(iterationRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /版本/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => b.localeCompare(a, "zh-CN"))

  for (const dirName of dirNames) {
    const filePath = path.join(iterationRoot, dirName, recordFileName)
    if (!fs.existsSync(filePath)) continue

    const text = fs.readFileSync(filePath, "utf8")
    const meta = parseFrontmatter(text)
    const { headers, rows } = parseMarkdownTable(text)

    entries.push({
      dirName,
      filePath: path.relative(path.resolve(iterationRoot, ".."), filePath).replace(/\\/g, "/"),
      meta,
      headers,
      rows,
    })
  }

  return entries
}

const discovered = discoverVersionRecords()

const iterationVersions = discovered.map(({ meta, filePath }) => ({
  version: meta.version ?? "",
  name: meta.name ?? "",
  period: meta.period ?? "",
  summary: meta.summary ?? "",
  docPath: meta.docPath ?? filePath.replace("/00-菜单迭代记录.md", "/README.md"),
  recordPath: filePath,
}))

const iterationRecords = []
let recordId = 0

for (const item of discovered) {
  const version = item.meta.version ?? ""
  for (const row of item.rows) {
    recordId += 1
    iterationRecords.push({
      id: String(recordId),
      version,
      platform: cell(row, item.headers, "端"),
      type: cell(row, item.headers, "变更类型"),
      title: cell(row, item.headers, "标题"),
      before: cell(row, item.headers, "调整前"),
      after: cell(row, item.headers, "调整后"),
      note: cell(row, item.headers, "说明"),
      date: cell(row, item.headers, "日期"),
      sourceDoc: cell(row, item.headers, "来源文档"),
    })
  }
}

const output = `// 自动生成，请勿手工编辑。运行 npm run generate:iterations 更新。
// 数据源：02-PRD文档/B-迭代需求/{版本}/00-菜单迭代记录.md
// 索引说明：02-PRD文档/B-迭代需求/00-菜单迭代记录/README.md

export type IterationPlatform = "PC" | "移动" | "双端"

export type IterationChangeType = "新增" | "更名" | "迁移" | "取消" | "结构"

export type IterationVersionMeta = {
  version: string
  name: string
  period: string
  summary: string
  docPath: string
  recordPath: string
}

export type IterationRecordEntry = {
  id: string
  version: string
  platform: IterationPlatform
  type: IterationChangeType
  title: string
  before: string
  after: string
  note: string
  date: string
  sourceDoc: string
}

export const ITERATION_RECORD_LABEL = "迭代记录"

export const iterationVersions: IterationVersionMeta[] = ${JSON.stringify(iterationVersions, null, 2)}

export const iterationRecords: IterationRecordEntry[] = ${JSON.stringify(iterationRecords, null, 2)}
`

fs.writeFileSync(outputPath, output, "utf8")
console.log(
  `Generated ${iterationVersions.length} versions, ${iterationRecords.length} iteration records from B-迭代需求 Markdown -> ${outputPath}`,
)
