#!/usr/bin/env node
/**
 * 原型打点体检（报告模式）
 *
 * 用法：
 *   node 03-前端原型demo/tools/check-annotations.mjs
 *   node 03-前端原型demo/tools/check-annotations.mjs --strict   # 有未达标项时退出码 1
 *
 * 判据真源：AGENTS.md 4.2.2 · 03-前端原型demo/原型打点内容标准.md
 * 只做静态扫描（读源码文本），不启动构建、不改文件；明细写入 tools/标注体检报告.md
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, "..") // 03-前端原型demo
const STRICT = process.argv.includes("--strict")

const SCAN_ROOTS = [
  { dir: path.join(ROOT, "shared"), side: "shared" },
  { dir: path.join(ROOT, "B端PC", "src"), side: "PC" },
  { dir: path.join(ROOT, "B端H5", "src"), side: "H5" },
]

const EXCLUDE = [
  /prototype-annotation\.shared-types\.ts$/,
  /annotation\.types\.ts$/,
  /annotation-versions\.ts$/,
  /annotation-bindings\.ts$/,
  /annotationwrapper\.tsx$/i,
  /\.d\.ts$/,
]

const SKIP_DIRS = new Set(["node_modules", "dist", ".git"])

/**
 * 菜单 → 迭代版本（真源：02-PRD文档/B-迭代需求/ 各版本目录 + 菜单迭代记录）
 * 规则：以一个模块最后一次被改造的迭代为准；任何迭代目录里都没有的模块 = 初始化版本。
 */
const VERSION_MAP = {
  // 6.4 仓储单据导出与打印
  "inbound-records": "6.4",
  "outbound-records": "6.4",
  // 6.3 合作方主数据 + 基础配置 + 存量单据协同
  "partner-archives": "6.3",
  "platform-basic-config": "6.3",
  "partner-synergy": "6.3",
  "warehouse-receipts": "6.3", // 6.3 存量协同 P1
  "delivery-orders": "6.3", // 提货单 P0
  "inventory-transfer-records": "6.3", // 转让记录 P0
  "inbound-staging-reg": "6.3",
  "goods-specifications": "6.3",
  "warehouse-management": "6.3",
  "supervision-handling": "6.3",
  "supervision-management": "6.3",
  "menu-permission-config": "6.3",
  "inventory-cross-export": "6.3",
  "migration-schemes": "6.3",
  // 6.2 物联网 / 预警 / 门禁开锁审批
  "device-warning-events": "6.2",
  "collateral-warning-events": "6.2",
  "device-warning-configs": "6.2",
  "order-warning-configs": "6.2",
  "severity-levels": "6.2",
  "access-control-devices": "6.2",
  "unlock-applies": "6.2",
  "unlock-approval-configs": "6.2",
  "mid-loan-risk-control": "6.2",
  "risk-disclosure": "6.2",
  // 6.1 客户融资 + 加工 + 货品规格
  "customer-financing-leads": "6.1",
  "customer-financing-due-diligence": "6.1",
  "customer-financing-credit": "6.1",
  "processing-records": "6.1",
  // 其余（库存、盘点、理货、异动、移库等基准台账）→ 初始化版本
}

function versionOf(module) {
  return VERSION_MAP[module] || "初始化版本"
}

/** 读取某个 feature 挂载的三件套路径集合，用来判断双端是否同一份文档 */
function collectDocSet(featureDir) {
  const set = new Set()
  const dir = path.join(featureDir, "documents")
  if (!fs.existsSync(dir)) return set
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".ts")) continue
    const src = fs.readFileSync(path.join(dir, f), "utf8")
    for (const m of src.matchAll(/@docs\/([^"?]+)/g)) set.add(m[1].trim())
  }
  return set
}
function sameSet(a, b) {
  if (!a || !b || a.size === 0 || b.size === 0) return false
  if (a.size !== b.size) return false
  for (const x of a) if (!b.has(x)) return false
  return true
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.isFile() && /\.tsx?$/.test(entry.name) && !EXCLUDE.some((re) => re.test(entry.name))) out.push(full)
  }
  return out
}

/** 解析单个打点文件的文本指标 */
function parseFile(file) {
  const src = fs.readFileSync(file, "utf8")
  const numbers = [...src.matchAll(/^\s*number:\s*(\d+)/gm)].map((m) => Number(m[1]))
  const kinds = [...src.matchAll(/kind:\s*"([^"]+)"/g)].map((m) => m[1])
  const sharedImport = [
    ...src.matchAll(/from\s+["']([^"']*(?:prototype-annotation\.shared-types|\.annotations\.shared|@prototype\/shared\/)[^"']*)["']/g),
  ].map((m) => m[1])
  const h5Binding = /applyH5PrototypeAnnotationBindings|annotation-bindings/.test(src)
  const documentRefs = (src.match(/documentRefs\s*:/g) || []).length

  return {
    file,
    numbers,
    count: numbers.length,
    kinds,
    kindSet: new Set(kinds),
    reexport: numbers.length === 0 ? sharedImport[0] || null : null,
    sharedImport,
    h5Binding,
    mermaid: /flowchart\s+(TD|TB|LR|RL|BT)|stateDiagram/.test(src),
    table: /\|\s*:?-{3,}/.test(src),
    fieldTable: /\|\s*(\**(业务)?字段名称\**|\**筛选项名称\**|\**列名称\**|\**字段\**)\s*\|/.test(src),
    documentRefs,
    hasPageKind: kinds.includes("页面"),
    hasFieldKind: kinds.includes("字段"),
    hasActionKind: kinds.includes("交互"),
    hasRuleKind: kinds.includes("规则"),
  }
}

/** 由文件名推断页面类型 */
function pageType(file) {
  const base = path.basename(file).toLowerCase()
  if (/list|table/.test(base)) return "列表"
  if (/detail/.test(base)) return "详情"
  if (/form|config|edit|new|dialog/.test(base)) return "表单"
  if (/ops|release|audit|input/.test(base)) return "表单"
  return "其他"
}

/** re-export 文件顺着 import 找到共享正文，合并指标 */
function resolveShared(spec, fromFile) {
  if (!spec) return null
  const candidates = []
  // 别名 @prototype/shared/... → 03-前端原型demo/shared/...
  const m = spec.match(/@prototype\/shared\/(.+)$/)
  if (m) candidates.push(path.join(ROOT, "shared", m[1]))
  // 相对路径：以引用它的文件所在目录为基准
  if (spec.startsWith(".")) candidates.push(path.resolve(path.dirname(fromFile), spec))
  for (const c of candidates) {
    for (const p of [c, c + ".ts", c + ".tsx", c + "/index.ts"]) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return parseFile(p)
    }
  }
  return null
}

const MIN_DOTS = { 列表: 4, 详情: 4, 表单: 4, 其他: 2 }

function judge(metric, type, side, opts = {}) {
  const problems = []
  const mins = MIN_DOTS[type] ?? 2
  if (metric.count < mins) problems.push(`打点仅 ${metric.count} 条，低于下限 ${mins}`)
  if (!metric.hasPageKind) problems.push('缺「页面」类打点')
  if (!metric.mermaid) problems.push("缺 Mermaid 流转图")
  if (type !== "其他") {
    if (!metric.hasFieldKind) problems.push('缺「字段」类打点')
    else if (!metric.fieldTable) problems.push("字段类打点缺字段字典表")
    if (!metric.hasActionKind) problems.push('缺「交互」类打点')
  }
  // 双端同一份三件套时，H5 自写正文记为「提示项」而非未达标：
  // 合并 shared 需要按 H5 页面重排靶点，单独排期处理，不阻断本页内容达标。
  const notes = []
  if (side === "H5" && opts.sameDocs && metric.count > 0 && !metric.h5Binding && metric.sharedImport.length === 0) {
    notes.push("H5 自写正文（双端同一份三件套，宜合并为 shared 正文 + bindings）")
  }
  return { problems, notes }
}

const rows = []
/** 从文件路径推出 feature 目录（.../features/{模块}/annotations/x.ts） */
function featureDirOf(file) {
  const parts = file.split(path.sep)
  const i = parts.indexOf("features")
  return i >= 0 ? parts.slice(0, i + 2).join(path.sep) : null
}

// 先收集双端各 feature 的三件套挂载路径
const docSetByModule = { PC: new Map(), H5: new Map() }
for (const [side, base] of [
  ["PC", path.join(ROOT, "B端PC", "src", "features")],
  ["H5", path.join(ROOT, "B端H5", "src", "features")],
]) {
  if (!fs.existsSync(base)) continue
  for (const name of fs.readdirSync(base)) {
    const dir = path.join(base, name)
    if (fs.statSync(dir).isDirectory()) docSetByModule[side].set(name, collectDocSet(dir))
  }
}

for (const { dir, side } of SCAN_ROOTS) {
  for (const file of walk(dir)) {
    // 只扫 annotations 目录下的业务打点文件
    if (!/[\\/]annotations[\\/]/.test(file)) continue
    let metric = parseFile(file)
    let source = metric.file
    if (metric.reexport) {
      const shared = resolveShared(metric.reexport, file)
      if (shared) {
        metric = { ...shared, file: metric.file, reexport: metric.reexport }
        source = shared.file
      }
    }
    if (metric.count === 0) continue // 纯类型/工具文件
    const type = pageType(file)
    const module = moduleOf(file)
    const sameDocs =
      side === "H5" && sameSet(docSetByModule.PC.get(module), docSetByModule.H5.get(module))
    const { problems, notes } = judge(metric, type, side, { sameDocs })
    rows.push({
      side,
      module,
      version: versionOf(module),
      file: path.relative(ROOT, file),
      source: path.relative(ROOT, source),
      type,
      count: metric.count,
      kinds: [...metric.kindSet].join("/"),
      mermaid: metric.mermaid,
      fieldTable: metric.fieldTable,
      documentRefs: metric.documentRefs,
      problems,
      notes,
    })
  }
}

function moduleOf(file) {
  const rel = file.split(path.sep)
  const i = rel.indexOf("features")
  if (i >= 0) return rel[i + 1]
  const j = rel.indexOf("shared")
  if (j >= 0) return rel[j + 1]
  return path.basename(path.dirname(path.dirname(file)))
}

rows.sort((a, b) => a.side.localeCompare(b.side) || a.module.localeCompare(b.module) || a.file.localeCompare(b.file))

const total = rows.length
const passed = rows.filter((r) => r.problems.length === 0).length
const withTable = rows.filter((r) => r.fieldTable).length
const withMermaid = rows.filter((r) => r.mermaid).length
const withRefs = rows.filter((r) => r.documentRefs > 0).length

function md() {
  const L = []
  L.push("# 原型打点体检报告", "")
  L.push(`> 生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })}`)
  L.push("> 判据：`AGENTS.md` **4.2.2** · [`原型打点内容标准.md`](../原型打点内容标准.md)")
  L.push("> 重新生成：`npm run check:annotations`", "")
  L.push("## 一、总览", "")
  L.push("| 指标 | 数量 | 占比 |")
  L.push("| :--- | ---: | ---: |")
  L.push(`| 打点文件 | ${total} | 100% |`)
  L.push(`| 页面级打点带流转图 | ${withMermaid} | ${pct(withMermaid, total)} |`)
  L.push(`| 有字段字典表 | ${withTable} | ${pct(withTable, total)} |`)
  L.push(`| 配了 documentRefs | ${withRefs} | ${pct(withRefs, total)} |`)
  L.push(`| **完全达标** | ${passed} | ${pct(passed, total)} |`)
  L.push("")

  const versions = ["6.4", "6.3", "6.2", "6.1", "初始化版本"]
  const vs = versions.filter((v) => rows.some((r) => r.version === v))
  if (vs.length) {
    L.push("## 二、按迭代版本", "")
    L.push("> 版本归属真源：`02-PRD文档/B-迭代需求/` 各版本目录；不在任何迭代目录中的模块记为「初始化版本」。", "")
    L.push("| 迭代版本 | 文件数 | 已达标 | 达标率 | 带流转图 | 带字段表 |")
    L.push("| :--- | ---: | ---: | ---: | ---: | ---: |")
    for (const v of vs) {
      const list = rows.filter((r) => r.version === v)
      const ok = list.filter((r) => !r.problems.length).length
      const mm = list.filter((r) => r.mermaid).length
      const tb = list.filter((r) => r.fieldTable).length
      L.push(`| ${v} | ${list.length} | ${ok} | ${pct(ok, list.length)} | ${mm} | ${tb} |`)
    }
    L.push("")
  }

  const sides = ["shared", "PC", "H5"]
  const sideCount = { shared: 0, PC: 0, H5: 0 }
  for (const r of rows) sideCount[r.side] += 1
  L.push(`## 三、明细（共享正文 ${sideCount.shared} · PC ${sideCount.PC} · H5 ${sideCount.H5}）`, "")
  for (const side of sides) {
    const list = rows.filter((r) => r.side === side)
    if (!list.length) continue
    L.push(`### ${sideLabel(side)}（${list.length} 个文件）`, "")
    L.push("| 模块 | 迭代版本 | 文件 | 类型 | 打点 | 类别 | 流转图 | 字段表 | 段落定位 | 结论 |")
    L.push("| :--- | :--- | :--- | :--- | ---: | :--- | :---: | :---: | ---: | :--- |")
    for (const r of list) {
      L.push(
        `| ${r.module} | ${r.version} | \`${path.basename(r.file)}\` | ${r.type} | ${r.count} | ${r.kinds || "—"} | ${yn(r.mermaid)} | ${yn(r.fieldTable)} | ${r.documentRefs} | ${r.problems.length ? "❌ " + r.problems.join("；") : "✅ 达标"} |`,
      )
    }
    L.push("")
  }

  const bad = rows.filter((r) => r.problems.length)
  const noted = rows.filter((r) => (r.notes || []).length)
  if (noted.length) {
    L.push("## 四、双端正文待合并（提示项，不计入未达标）", "")
    L.push("> 这些 H5 文件与 PC 挂同一份三件套，但仍在 H5 里自写正文。合并成 shared 需要按 H5 页面重排靶点，单独排期。", "")
    for (const r of noted) L.push(`- \`${r.file}\` — ${r.notes.join("；")}`)
    L.push("")
  }
  L.push("## 五、待整改清单（按问题聚合）", "")
  const bucket = new Map()
  for (const r of bad) {
    for (const p of r.problems) {
      if (!bucket.has(p)) bucket.set(p, [])
      bucket.get(p).push(r.file)
    }
  }
  for (const [p, files] of [...bucket.entries()].sort((a, b) => b[1].length - a[1].length)) {
    L.push(`### ${p}（${files.length} 处）`, "")
    for (const f of files.slice(0, 40)) L.push(`- \`${f}\``)
    if (files.length > 40) L.push(`- …… 其余 ${files.length - 40} 处见上表`)
    L.push("")
  }
  return L.join("\n")
}

function pct(a, b) {
  return b ? Math.round((a / b) * 100) + "%" : "—"
}
function yn(v) {
  return v ? "有" : "—"
}
function sideLabel(s) {
  return s === "shared" ? "共享正文（shared）" : s === "PC" ? "PC 端" : "H5 端"
}

const reportPath = path.join(HERE, "标注体检报告.md")
fs.writeFileSync(reportPath, md(), "utf8")

const byModule = new Map()
for (const r of rows) {
  const k = `${r.side}/${r.module}`
  const cur = byModule.get(k) || { total: 0, bad: 0 }
  cur.total += 1
  if (r.problems.length) cur.bad += 1
  byModule.set(k, cur)
}

console.log("")
console.log(" 原型打点体检")
console.log(" ────────────────────────────────────────────")
console.log(` 打点文件      ${total}`)
console.log(` 完全达标      ${passed}  (${pct(passed, total)})`)
console.log(` 带流转图      ${withMermaid}  (${pct(withMermaid, total)})`)
console.log(` 带字段字典表  ${withTable}  (${pct(withTable, total)})`)
console.log(` 配段落定位    ${withRefs}  (${pct(withRefs, total)})`)
console.log("")
console.log(" 按迭代版本：")
for (const v of ["6.4", "6.3", "6.2", "6.1", "初始化版本"]) {
  const list = rows.filter((r) => r.version === v)
  if (!list.length) continue
  const ok = list.filter((r) => !r.problems.length).length
  console.log(`   ${v.padEnd(6)} ${String(ok).padStart(3)}/${String(list.length).padEnd(3)} 达标`)
}
console.log("")
const worst = [...byModule.entries()]
  .filter(([, v]) => v.bad > 0)
  .sort((a, b) => b[1].bad - a[1].bad)
  .slice(0, 12)
if (worst.length) {
  console.log(" 缺口最多的模块：")
  for (const [k, v] of worst) console.log(`   ${v.bad}/${v.total}  ${k}`)
  console.log("")
}
console.log(` 明细报告：${path.relative(process.cwd(), reportPath)}`)
console.log("")

if (STRICT && passed !== total) {
  console.error(` 有 ${total - passed} 个文件未达标（--strict 模式）`)
  process.exit(1)
}
