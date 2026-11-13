#!/usr/bin/env node
/**
 * 段落定位（documentRefs）批量补齐工具
 *
 * 用法：
 *   node tools/generate-doc-refs.mjs           # 试运行，只打印将补多少条
 *   node tools/generate-doc-refs.mjs --write   # 实际写入
 *
 * 规则：
 *   - 页面 → 主 PRD；字段 → 字段清单；规则 → 业务规则规格；交互 → 主 PRD（无则规则规格）
 *   - section 取文档里真实存在的标题原文
 *   - match 取该章节内、渲染后仍能搜到的一段文本（表格取单格文本）
 *   - 找不到合适章节/文本时宁可不加，也不写假锚点
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, "..")
const REPO = path.resolve(ROOT, "..")
const DOCS_ROOT = path.join(REPO, "02-PRD文档")
const WRITE = process.argv.includes("--write")

/* ---------------- 文档解析 ---------------- */

function cleanInline(text) {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function cleanLine(line) {
  let t = line.trim()
  if (!t) return ""
  if (/^```/.test(t)) return ""
  if (/^\|?\s*:?-{2,}/.test(t)) return "" // 表格分隔行
  if (/^\|/.test(t) || (t.match(/\|/g) || []).length >= 2) {
    // 表格行：按单元格拆开，单格单独作为候选
    const cells = t.replace(/^\|/, "").replace(/\|$/, "").split("|").map(cleanInline)
    return cells.filter((c) => c.length >= 2)
  }
  t = t.replace(/^>+\s*/, "").replace(/^[-*+]\s+/, "").replace(/^\d+[.)]\s+/, "")
  return cleanInline(t).replace(/^\d+[.)]\s+/, "")
}

function parseDoc(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
  const headings = [] // { level, text, start, end }
  let inFence = false
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) inFence = !inFence
    if (inFence) return
    const m = line.match(/^(#{1,6})\s+(.*)$/)
    if (m) headings.push({ level: m[1].length, text: cleanInline(m[2]), start: i, end: lines.length })
  })
  headings.forEach((h, idx) => {
    for (let j = idx + 1; j < headings.length; j += 1) {
      if (headings[j].level <= h.level) { h.end = headings[j].start; break }
    }
  })
  // 每节候选：段落文本 + 表格单格
  const sections = headings.map((h) => {
    const cells = []
    let inFence2 = false
    for (let i = h.start + 1; i < h.end; i += 1) {
      const raw = lines[i]
      if (/^\s*```/.test(raw)) { inFence2 = !inFence2; continue }
      if (inFence2) continue
      const cleaned = cleanLine(raw)
      if (!cleaned) continue
      if (Array.isArray(cleaned)) cells.push(...cleaned.map((text) => ({ text, row: true })))
      else cells.push({ text: cleaned, row: false })
    }
    return { ...h, body: cells }
  })
  return { headings, sections, allText: sections.flatMap((s) => s.body.map((b) => b.text)) }
}

/* ---------------- 关键词相关度 ---------------- */

function bigrams(text) {
  const s = text.replace(/[\s\p{P}]/gu, "")
  const out = new Set()
  for (let i = 0; i < s.length - 1; i += 1) out.add(s.slice(i, i + 2))
  return out
}

function score(a, b) {
  const A = bigrams(a)
  const B = bigrams(b)
  if (!A.size || !B.size) return 0
  let hit = 0
  for (const x of A) if (B.has(x)) hit += 1
  return hit / Math.min(A.size, B.size)
}

/* ---------------- 文档挂载 ---------------- */

function resolveDocPath(spec) {
  const p = path.join(DOCS_ROOT, spec)
  return fs.existsSync(p) ? p : null
}

function featureDocSets() {
  // key `side/module` -> { sets: [{ name, prd, fields, rules }], _cache }
  const map = new Map()
  for (const side of ["PC", "H5"]) {
    const base = path.join(ROOT, side === "PC" ? "B端PC" : "B端H5", "src", "features")
    if (!fs.existsSync(base)) continue
    for (const name of fs.readdirSync(base)) {
      const dir = path.join(base, name)
      const docDir = path.join(dir, "documents")
      if (!fs.statSync(dir).isDirectory() || !fs.existsSync(docDir)) continue
      const sets = []
      for (const f of fs.readdirSync(docDir)) {
        if (!f.endsWith(".ts")) continue
        const src = fs.readFileSync(path.join(docDir, f), "utf8")
        const imports = new Map()
        for (const m of src.matchAll(/import\s+(\w+)\s+from\s+"@docs\/([^"?]+)/g)) imports.set(m[1], m[2])
        const arrays = new Map()
        for (const am of src.matchAll(/const (\w+)\s*(?::\s*PrototypeDocument\[\])?\s*=\s*\[([\s\S]*?)\n\]/g)) arrays.set(am[1], am[2])
        for (const em of src.matchAll(/export const (\w+)\s*(?::\s*PrototypeDocument\[\])?\s*=\s*/g)) {
          const name = em[1]
          const from = em.index + em[0].length
          const tail = src.slice(from)
          let body = null
          if (tail.startsWith("[")) {
            const end = tail.indexOf("\n]")
            if (end !== -1) body = tail.slice(1, end)
          }
          if (!body) {
            const stmt = tail.slice(0, 200)
            for (const [v, b] of arrays) if (stmt.includes(v)) { body = b; break }
          }
          if (!body) continue
          const set = { name: name.replace(/Documents$/, "") }
          for (const m of body.matchAll(/id:\s*"(prd|fields|rules)"[\s\S]{0,200}?content:\s*(\w+)/g)) {
            const spec = imports.get(m[2])
            if (spec) set[m[1]] = resolveDocPath(spec)
          }
          if (set.prd || set.fields || set.rules) sets.push(set)
        }
      }
      if (!fs.existsSync(docDir)) continue
      if (sets.length) map.set(`${side}/${name}`, { sets, _cache: {} })
    }
  }
  return map
}

function pickDocSet(entry, annFile) {
  const base = path.basename(annFile).replace(/\.annotations?\.ts$/, "").replace(/\.ts$/, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
  let best = null
  for (const set of entry.sets) {
    const n = set.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
    let sc = 0
    if (base.startsWith(n) && n.length >= 4) sc = 3
    else if (base.includes(n) || n.includes(base)) sc = 2
    else {
      for (let i = 0; i < Math.min(n.length, 4); i += 1) if (base.includes(n.slice(0, i + 1))) sc = Math.max(sc, 0.5)
    }
    sc += ((set.prd ? 1 : 0) + (set.fields ? 1 : 0) + (set.rules ? 1 : 0)) * 0.1
    if (!best || sc > best.sc) best = { ...set, sc }
  }
  return best || entry.sets[0]
}

/* ---------------- 打点文件解析 ---------------- */

function annotationFiles() {
  const out = []
  for (const [side, base] of [
    ["PC", path.join(ROOT, "B端PC", "src", "features")],
    ["H5", path.join(ROOT, "B端H5", "src", "features")],
    ["shared", path.join(ROOT, "shared")],
  ]) {
    if (!fs.existsSync(base)) continue
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name)
        if (e.isDirectory()) { if (e.name !== "node_modules") walk(p) }
        else if (e.isFile() && e.name.endsWith(".ts") && /[\\/]annotations[\\/]/.test(p) && !/binding|shared-types|annotation\.types/.test(e.name)) out.push({ side, file: p })
      }
    }
    walk(base)
  }
  return out
}

function moduleOf(file) {
  const parts = file.split(path.sep)
  const i = parts.indexOf("features")
  if (i >= 0) return parts[i + 1]
  const j = parts.indexOf("shared")
  if (j >= 0) return parts[j + 1]
  return ""
}

function parseAnnotations(src) {
  const lines = src.split(/\r?\n/)
  const items = []
  lines.forEach((line, i) => {
    const m = line.match(/^(\s*)id:\s*"([^"]+)",?\s*$/)
    if (m) items.push({ id: m[2], line: i, indent: m[1] })
  })
  items.forEach((item, idx) => {
    const end = idx + 1 < items.length ? items[idx + 1].line : lines.length
    const chunk = lines.slice(item.line, end).join("\n")
    item.kind = (chunk.match(/kind:\s*"([^"]+)"/) || [])[1] || ""
    item.title = (chunk.match(/title:\s*"([^"]*)"/) || [])[1] || ""
    item.content = (chunk.match(/content:\s*\n?\s*"([^"]*)"/) || [])[1] || ""
    item.hasRefs = /documentRefs\s*:/.test(chunk)
    item.end = end
  })
  return items
}

/* ---------------- 锚点生成 ---------------- */

function pickSection(doc, text) {
  let best = null
  for (const s of doc.sections) {
    if (!s.text || s.text.length < 2) continue
    let sc = score(s.text, text)
    if (s.text && text.includes(s.text)) sc += 0.2
    if (sc > (best?.sc ?? 0)) best = { ...s, sc }
  }
  return best && best.sc > 0.08 ? best : null
}

function pickMatch(section, text) {
  let best = null
  for (const cell of section.body) {
    const len = cell.text.length
    if (len < 6 || len > 60) continue
    const sc = score(cell.text, text)
    if (sc > (best?.sc ?? 0)) best = { ...cell, sc }
  }
  if (!best || best.sc < 0.05) return null
  let m = best.text
  if (m.length > 40) m = m.slice(0, 40)
  return { match: m, element: best.row ? "row" : "text" }
}

function buildRefs(item, docs) {
  const kind = item.kind
  const order =
    kind === "字段" ? ["fields", "rules", "prd"]
    : kind === "规则" ? ["rules", "prd", "fields"]
    : ["prd", "rules", "fields"]
  const text = `${item.title} ${item.content} ${item.id}`
  const refs = {}
  let picked = 0
  for (const key of order) {
    const file = docs[key]
    if (!file) continue
    const doc = docs._cache[file] || (docs._cache[file] = parseDoc(file))
    const section = pickSection(doc, text)
    if (!section) continue
    if (picked > 0 && section.sc < 0.18) continue // 第二个文档须足够相关才挂
    const hit = pickMatch(section, text)
    refs[key] = hit
      ? { section: section.text, match: hit.match, element: hit.element }
      : { section: section.text }
    picked += 1
    if (picked >= 2) break
  }
  return refs
}

/* ---------------- 主流程 ---------------- */

const docSets = featureDocSets()
const report = { updatedFiles: 0, addedRefs: 0, skipped: 0 }

for (const { side, file } of annotationFiles()) {
  const module = moduleOf(file)
  const entry = docSets.get(`${side}/${module}`) || docSets.get(`PC/${module}`)
  if (!entry) continue
  const docs = pickDocSet(entry, file)
  docs._cache = entry._cache
  const src = fs.readFileSync(file, "utf8")
  const items = parseAnnotations(src).filter((it) => !it.hasRefs)
  if (!items.length) continue
  const lines = src.split(/\r?\n/)
  const insertions = []
  for (const item of items) {
    const refs = buildRefs(item, docs)
    if (!Object.keys(refs).length) { report.skipped += 1; continue }
    const body = Object.entries(refs)
      .map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`)
      .join("\n")
    insertions.push({ line: item.line, text: `${item.indent}documentRefs: {\n${body}\n${item.indent}},` })
    report.addedRefs += 1
  }
  if (!insertions.length) continue
  for (const ins of insertions.sort((a, b) => b.line - a.line)) lines.splice(ins.line + 1, 0, ins.text)
  report.updatedFiles += 1
  if (WRITE) fs.writeFileSync(file, lines.join("\n"))
}

console.log(` ${WRITE ? "已写入" : "试运行"}：文件 ${report.updatedFiles} 个，补锚点 ${report.addedRefs} 条，跳过 ${report.skipped} 条`)
if (!WRITE) console.log(" 加 --write 才会真正写入")
