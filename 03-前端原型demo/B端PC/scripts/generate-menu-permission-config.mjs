// 解析「系统功能菜单权限全量清单(基于 sys_permit.sql).md」，生成功能与菜单权限配置页的数据文件。
// 用法：npm run generate:menu-permissions
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sourcePath = path.resolve(
  __dirname,
  "../../../00-草稿对话/2026.11.09-系统功能菜单权限全量清单(基于sys_permit.sql).md",
)
const outputPath = path.resolve(
  __dirname,
  "../src/features/menu-permission-config/data/menu-permissions.generated.ts",
)

const CHANNEL_SHORT_LABELS = {
  ap: "机构PC",
  am: "机构移动",
  pp: "平台PC",
  cp: "个人门户PC",
  cm: "个人门户移动",
}

function stripMarkup(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/└─/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function parseName(value) {
  return stripMarkup(value)
}

function parseChannelHeader(line) {
  const match = line.match(/^### 2\.\d+ 【(.+?) \((\w+)\)】/)
  if (!match) return null
  return { label: match[1].trim(), id: match[2] }
}

const text = fs.readFileSync(sourcePath, "utf8")
const lines = text.split(/\r?\n/)

const channels = []
const records = []
let currentChannel = null
let rowIndex = 0

for (const line of lines) {
  const header = parseChannelHeader(line)
  if (header) {
    currentChannel = { ...header, total: 0 }
    channels.push(currentChannel)
    continue
  }

  if (!line.startsWith("| `20")) continue
  if (!currentChannel) continue

  const cells = line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim())

  if (cells.length !== 10) {
    throw new Error(`第 ${rowIndex + 1} 行字段数不是 10：${line.slice(0, 120)}`)
  }

  const [rawId, rawParentId, rawName, rawCode, rawLevel, rawMode, rawClientUri, rawServerUri, rawStatus, rawSort] =
    cells

  const id = stripMarkup(rawId)
  const parentId = stripMarkup(rawParentId)
  const name = parseName(rawName)
  const code = stripMarkup(rawCode)
  const level = stripMarkup(rawLevel)
  const mode = stripMarkup(rawMode)
  const clientUri = stripMarkup(rawClientUri) === "-" ? "" : stripMarkup(rawClientUri)
  const serverUri = stripMarkup(rawServerUri) === "-" ? "" : stripMarkup(rawServerUri)
  const enabled = !rawStatus.includes("停用")
  const sort = Number(stripMarkup(rawSort))

  if (!["模块", "目录", "菜单", "按钮"].includes(level)) {
    throw new Error(`未知级别「${level}」：${id} ${name}`)
  }
  if (!["r", "w", "-"].includes(mode)) {
    throw new Error(`未知模式「${mode}」：${id} ${name}`)
  }

  records.push({
    id,
    parentId,
    channelId: currentChannel.id,
    name,
    code,
    level,
    mode,
    clientUri,
    serverUri,
    enabled,
    sort: Number.isFinite(sort) ? sort : 0,
  })
  currentChannel.total += 1
  rowIndex += 1
}

// 校验：同渠道内父节点必须存在（-1 为根）
const byChannel = new Map()
for (const channel of channels) byChannel.set(channel.id, new Set())
for (const record of records) byChannel.get(record.channelId).add(record.id)

const orphan = records.filter(
  (record) => record.parentId !== "-1" && !byChannel.get(record.channelId).has(record.parentId),
)
if (orphan.length > 0) {
  console.warn(`⚠️ 有 ${orphan.length} 条记录的上级在原始库里不存在，页面会归入「未挂载上级的权限」分组：`)
  for (const record of orphan) {
    console.warn(`   ${record.channelId} ${record.id} ${record.name} -> ${record.parentId}`)
  }
}

const duplicateIds = records.length - new Set(records.map((record) => record.id)).size
if (duplicateIds > 0) {
  throw new Error(`存在 ${duplicateIds} 个重复权限ID`)
}

const outputRecords = records

const banner = `// 自动生成，请勿手工编辑。运行 npm run generate:menu-permissions 更新。
// 数据源：00-草稿对话/2026.11.09-系统功能菜单权限全量清单(基于sys_permit.sql).md
// 说明：扁平存储 5 个终端渠道的 1~7 级菜单与按钮权限，页面内按 parentId 还原树。

export type MenuPermissionLevel = "模块" | "目录" | "菜单" | "按钮"
export type MenuPermissionMode = "r" | "w" | "-"

export type MenuPermissionRecord = {
  id: string
  parentId: string
  channelId: string
  name: string
  code: string
  level: MenuPermissionLevel
  mode: MenuPermissionMode
  clientUri: string
  serverUri: string
  enabled: boolean
  sort: number
}

export type MenuPermissionChannel = {
  id: string
  label: string
  shortLabel: string
  total: number
}

export const menuPermissionChannels: MenuPermissionChannel[] = ${JSON.stringify(
  channels.map((channel) => ({
    id: channel.id,
    label: channel.label,
    shortLabel: CHANNEL_SHORT_LABELS[channel.id] ?? channel.id,
    total: channel.total,
  })),
  null,
  2,
)}

export const menuPermissionRecords: MenuPermissionRecord[] = ${JSON.stringify(outputRecords, null, 2)}
`

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, banner, "utf8")

const enabled = records.filter((record) => record.enabled).length
console.log(
  `✅ 已生成 ${outputRecords.length} 条权限记录（启用 ${enabled} / 停用 ${records.length - enabled}），覆盖 ${channels.length} 个渠道`,
)
for (const channel of channels) {
  console.log(`   ${channel.id} ${channel.label}：${channel.total} 条`)
}
console.log(`   输出：${path.relative(process.cwd(), outputPath)}`)
