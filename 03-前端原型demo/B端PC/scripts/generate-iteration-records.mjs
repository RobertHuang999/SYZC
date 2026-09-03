import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.resolve(
  __dirname,
  "../../../02-PRD文档/🌟🌟🌟-最新基准版/00-功能与数据权限/菜单迭代记录.csv",
)
const outputPath = path.resolve(__dirname, "../src/features/permission-reference/data/iteration-records.ts")

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

function buildHeaderIndex(headerRow) {
  const index = {}
  for (const [i, name] of headerRow.entries()) {
    index[normalize(name)] = i
  }
  return index
}

function cell(row, headerIndex, name) {
  const idx = headerIndex[name]
  if (idx === undefined) return ""
  return normalize(row[idx] ?? "")
}

const csvText = fs.readFileSync(csvPath, "utf8")
const [headerRow, ...dataRows] = parseCSVRows(csvText)
const headerIndex = buildHeaderIndex(headerRow)

const versionMeta = new Map()
const changes = []

for (const row of dataRows) {
  const versionCode = cell(row, headerIndex, "版本号")
  const versionName = cell(row, headerIndex, "版本名称")
  const releasePeriod = cell(row, headerIndex, "交付周期")
  const changeType = cell(row, headerIndex, "变更类型")

  if (versionName || releasePeriod) {
    versionMeta.set(versionCode, {
      versionCode,
      versionName: versionName || versionMeta.get(versionCode)?.versionName || versionCode,
      releasePeriod: releasePeriod || versionMeta.get(versionCode)?.releasePeriod || "",
    })
  }

  if (changeType === "版本摘要") {
    versionMeta.set(versionCode, {
      versionCode,
      versionName: versionName || `${versionCode}版本`,
      releasePeriod,
      summary: cell(row, headerIndex, "说明"),
      sourceDoc: cell(row, headerIndex, "来源文档"),
      updatedAt: cell(row, headerIndex, "变更日期"),
    })
    continue
  }

  changes.push({
    id: `${versionCode}-${changes.length + 1}`,
    versionCode,
    platform: cell(row, headerIndex, "端") || "双端",
    changeType,
    title: cell(row, headerIndex, "标题"),
    before: cell(row, headerIndex, "调整前"),
    after: cell(row, headerIndex, "调整后"),
    note: cell(row, headerIndex, "说明"),
    date: cell(row, headerIndex, "变更日期"),
    sourceDoc: cell(row, headerIndex, "来源文档"),
  })
}

const versions = [...versionMeta.values()].sort((a, b) => b.versionCode.localeCompare(a.versionCode, undefined, { numeric: true }))

const versionOrder = versions.map((v) => v.versionCode)
const groupedChanges = Object.fromEntries(versionOrder.map((code) => [code, changes.filter((c) => c.versionCode === code)]))

const output = `// 自动生成，请勿手工编辑。运行 npm run generate:iterations 更新。
// 数据源：02-PRD文档/🌟🌟🌟-最新基准版/00-功能与数据权限/菜单迭代记录.csv

export type IterationPlatform = "PC" | "移动" | "双端" | ""

export type IterationChangeType =
  | "版本摘要"
  | "新增"
  | "更名"
  | "迁移"
  | "取消"
  | "结构"
  | string

export type IterationVersion = {
  versionCode: string
  versionName: string
  releasePeriod: string
  summary: string
  sourceDoc: string
  updatedAt: string
}

export type IterationChangeEntry = {
  id: string
  versionCode: string
  platform: IterationPlatform
  changeType: IterationChangeType
  title: string
  before: string
  after: string
  note: string
  date: string
  sourceDoc: string
}

export const ITERATION_RECORD_LABEL = "迭代记录"

export const iterationVersions: IterationVersion[] = ${JSON.stringify(versions, null, 2)}

export const iterationChanges: IterationChangeEntry[] = ${JSON.stringify(changes, null, 2)}

export const iterationChangesByVersion: Record<string, IterationChangeEntry[]> = ${JSON.stringify(groupedChanges, null, 2)}
`

fs.writeFileSync(outputPath, output, "utf8")
console.log(
  `Generated ${changes.length} iteration changes across ${versions.length} versions -> ${outputPath}`,
)
