/**
 * 从草稿 CSV 同步到基准版主清单（模块名对齐菜单地图 + 列名对齐原型页 + 继承行）。
 * 用法：node sync-from-draft.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  parseCSVRows,
  buildHeaderIndex,
  pick,
  inferRecordStatus,
  normalizePcModule,
  escapeCSV,
} from "./csv-inheritance.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const baselineDir = path.resolve(__dirname, "..")
const draftCsv = path.resolve(
  baselineDir,
  "../../../00-草稿对话/d-功能:权限清单/功能_权限清单.csv",
)
const outputCsv = path.resolve(baselineDir, "功能与数据权限清单.csv")

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

const PC_MODULE_MAP = {
  "1.首页": { code: "01-工作中心", label: "工作中心", docDir: "B端PC/01-工作中心" },
  "1.工作中心": { code: "01-工作中心", label: "工作中心", docDir: "B端PC/01-工作中心" },
  "2.仓储": { code: "02-仓储", label: "仓储", docDir: "B端PC/02-仓储" },
  "3.融资/监管": { code: "03-融资监管", label: "融资/监管", docDir: "B端PC/03-融资监管" },
  "4.交易": { code: "04-交易", label: "交易", docDir: "B端PC/04-交易" },
  "5.风控": { code: "05-风控", label: "风控", docDir: "B端PC/05-风控" },
  "6.统计/看板": { code: "06-统计", label: "统计/看板", docDir: "B端PC/06-统计" },
  "7.结算": { code: "07-结算", label: "结算", docDir: "B端PC/07-结算" },
  "8.配置管理": { code: "08-配置管理", label: "配置管理", docDir: "B端PC/08-配置管理" },
}

const H5_MODULE_MAP = {
  "1.首页": { code: "01-首页", label: "首页", docDir: "B端H5/01-首页" },
  "2.工作台": { code: "02-工作台", label: "工作台", docDir: "B端H5/02-工作台" },
  "3.业务办理": { code: "03-业务办理", label: "业务办理", docDir: "B端H5/03-业务办理" },
}

function resolveModuleMeta(platform, moduleName) {
  if (platform === "PC") {
    return PC_MODULE_MAP[moduleName] ?? { code: "", label: moduleName, docDir: "" }
  }
  if (platform === "移动") {
    return H5_MODULE_MAP[moduleName] ?? { code: "", label: moduleName, docDir: "" }
  }
  return { code: "", label: moduleName, docDir: "" }
}

const sourceRows = parseCSVRows(fs.readFileSync(draftCsv, "utf8"))
const headerIndex = buildHeaderIndex(sourceRows[0])
const outputRows = [OUTPUT_HEADERS]

const state = { platform: "", module: "", level1: "", level2: "" }

for (const row of sourceRows.slice(1)) {
  const platformRaw = pick(row, headerIndex, "端")
  if (platformRaw) state.platform = platformRaw

  const moduleRaw = pick(row, headerIndex, "所属模块")
  if (moduleRaw) {
    state.module = state.platform === "PC" ? normalizePcModule(moduleRaw) : moduleRaw
  }

  const level1Raw = pick(row, headerIndex, "一级菜单")
  const level2Raw = pick(row, headerIndex, "二级菜单")
  if (level1Raw) {
    state.level1 = level1Raw
    state.level2 = level2Raw
  } else if (level2Raw) {
    state.level2 = level2Raw
  }

  const tab = pick(row, headerIndex, "Tab")
  const legacyPath = pick(row, headerIndex, "旧系统路径")
  const buttons = pick(row, headerIndex, "页面功能按钮")
  const scope = pick(row, headerIndex, "数据可见范围")
  const changeNote = pick(row, headerIndex, "变更说明")
  const createdAt = pick(row, headerIndex, "创建时间")
  const updatedAt = pick(row, headerIndex, "修定时间")

  if (
    !state.platform &&
    !state.level1 &&
    !state.level2 &&
    !tab &&
    !buttons &&
    !scope &&
    !legacyPath &&
    !changeNote
  ) {
    continue
  }

  if (!state.platform || !state.module) continue

  const meta = resolveModuleMeta(state.platform, state.module)

  outputRows.push([
    state.platform,
    state.module,
    state.level1,
    state.level2,
    tab,
    legacyPath,
    buttons,
    scope,
    changeNote,
    createdAt,
    updatedAt,
    meta.code,
    meta.label,
    meta.docDir,
    inferRecordStatus(changeNote),
  ])
}

const csvContent = `${outputRows.map((row) => row.map(escapeCSV).join(",")).join("\n")}\n`
fs.writeFileSync(outputCsv, csvContent, "utf8")
console.log(`Synced ${outputRows.length - 1} rows -> ${outputCsv}`)
