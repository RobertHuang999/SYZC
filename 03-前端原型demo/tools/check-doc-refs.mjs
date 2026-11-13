#!/usr/bin/env node
/**
 * 校验段落定位锚点是否真的能在挂载文档里找到：
 *   - section 必须是文档里真实存在的标题
 *   - match（如有）必须能在该章节正文（渲染后的文本）里搜到
 *
 * 用法：node tools/check-doc-refs.mjs [--verbose]
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, "..")
const REPO = path.resolve(ROOT, "..")
const DOCS_ROOT = path.join(REPO, "02-PRD文档")
const VERBOSE = process.argv.includes("--verbose")
const ONLY_GENERATED = process.argv.includes("--generated")
const DROP = process.argv.includes("--drop")

function cleanInline(text) {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim()
}

function parseDoc(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
  const headings = []
  let fence = false
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) fence = !fence
    if (fence) return
    const m = line.match(/^(#{1,6})\s+(.*)$/)
    if (m) headings.push({ level: m[1].length, text: cleanInline(m[2]), start: i, end: lines.length })
  })
  headings.forEach((h, idx) => {
    for (let j = idx + 1; j < headings.length; j += 1) {
      if (headings[j].level <= h.level) { h.end = headings[j].start; break }
    }
  })
  for (const h of headings) {
    const body = []
    let f2 = false
    for (let i = h.start + 1; i < h.end; i += 1) {
      const raw = lines[i]
      if (/^\s*```/.test(raw)) { f2 = !f2; continue }
      if (f2) continue
      const t = raw.trim()
      if (!t || /^\|?\s*:?-{2,}/.test(t) || t.startsWith("```")) continue
      if (t.startsWith("|")) {
        const cells = t.replace(/^\|/, "").replace(/\|$/, "").split("|")
        for (const c of cells) { const cc = cleanInline(c); if (cc) body.push(cc) }
      } else {
        const cc = cleanInline(t.replace(/^>+\s*/, "").replace(/^[-*+]\s+/, "").replace(/^\d+[.)]\s+/, ""))
        if (cc) body.push(cc)
      }
    }
    h.body = body.join(" ")
  }
  return headings
}

function resolveDocPath(spec) { const p = path.join(DOCS_ROOT, spec); return fs.existsSync(p) ? p : null }

function featureDocSets() {
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
    else for (let i = 0; i < Math.min(n.length, 4); i += 1) if (base.includes(n.slice(0, i + 1))) sc = Math.max(sc, 0.5)
    sc += ((set.prd ? 1 : 0) + (set.fields ? 1 : 0) + (set.rules ? 1 : 0)) * 0.1
    if (!best || sc > best.sc) best = { ...set, sc }
  }
  return best || entry.sets[0]
}

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
        if (e.isDirectory()) walk(p)
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

const docSets = featureDocSets()
let total = 0, bad = 0, missingDoc = 0, dropped = 0
const issues = []

for (const { side, file } of annotationFiles()) {
  const module = moduleOf(file)
  const entry = docSets.get(`${side}/${module}`) || docSets.get(`PC/${module}`)
  const docs = entry ? { ...pickDocSet(entry, file), _cache: entry._cache } : null
  const src = fs.readFileSync(file, "utf8")
  const lines = src.split(/\r?\n/)
  const dropRanges = []
  lines.forEach((line, idx) => {
    let blockStart = idx
    let blockEnd = idx
    let blockBad = false
    if (!/documentRefs\s*:/.test(line)) return
    // 收集该 documentRefs 块（到同缩进的 "}," / "}" 结束，避免被字符串里的花括号带偏）
    let block = line
    let j = idx
    const openCount = (line.match(/{/g) || []).length
    const closeCount = (line.match(/}/g) || []).length
    if (openCount <= closeCount) {
      // 单行写法的 documentRefs 已经闭合
    } else {
      while (j + 1 < lines.length) {
        j += 1
        block += "\n" + lines[j]
        if (/^\s*\},?\s*$/.test(lines[j])) break
      }
    }
    const refTexts = []
    for (const bl of block.split("\n")) {
      const km = bl.match(/\b(prd|fields|rules)\s*:\s*(\{(?:[^{}]|\{[^{}]*\})*\})/)
      if (km) refTexts.push([km[1], km[2]])
      else {
        const gm = bl.match(/^\s*(prd|fields|rules)\s*:\s*$/)
        if (gm) {
          const start = block.indexOf(bl) + bl.length
          const rest = block.slice(start)
          const end = rest.indexOf("}")
          if (end !== -1) refTexts.push([gm[1], rest.slice(0, end + 1)])
        }
      }
    }
    for (const m of refTexts.map(([k, v]) => ({ 1: k, 2: v }))) {
      if (ONLY_GENERATED && !/^\{\s*(?:"section"|section\s*:)/.test(m[2])) continue
      total += 1
      const key = m[1]
      let obj
      try {
        const isJson = /^\{\s*"/.test(m[2])
        const jsonish = isJson
          ? m[2].replace(/,\s*}/g, "}")
          : m[2].replace(/(\w+)\s*:/g, '"$1":').replace(/,\s*}/g, "}")
        obj = JSON.parse(jsonish)
      } catch { obj = null }
      if (!obj) { issues.push(`${path.relative(ROOT, file)}:${idx + 1} ${key} 解析失败`); bad += 1; blockBad = true; continue }
      const docFile = docs?.[key]
      if (!docFile) { missingDoc += 1; if (VERBOSE) issues.push(`${path.relative(ROOT, file)}:${idx + 1} ${key} 该页未挂载此文档`); continue }
      const headings = docs._cache[docFile] || (docs._cache[docFile] = parseDoc(docFile))
      const sec = cleanInline(obj.section || "")
      const heading = sec ? headings.find((h) => h.text.includes(sec)) : null
      if (!heading) {
        bad += 1
        blockBad = true
        if (VERBOSE) issues.push(`${path.relative(ROOT, file)}:${idx + 1} ${key} 标题不存在：${obj.section}`)
        continue
      }
      if (obj.match) {
        const mm = cleanInline(obj.match)
        if (!heading.body.includes(mm)) {
          bad += 1
          blockBad = true
          if (VERBOSE) issues.push(`${path.relative(ROOT, file)}:${idx + 1} ${key} 章节内找不到文本：${obj.match}`)
        }
      }
    }
    blockEnd = j
    if (blockBad) dropRanges.push([blockStart, blockEnd])
  })
  if (DROP && dropRanges.length) {
    const kept = []
    let skipUntil = -1
    lines.forEach((l, i) => {
      if (i <= skipUntil) return
      const r = dropRanges.find(([a, b]) => i === a)
      if (r) { skipUntil = r[1]; return }
      kept.push(l)
    })
    fs.writeFileSync(file, kept.join("\n"))
    dropped += dropRanges.length
  }
}

console.log(` 锚点总数 ${total}｜有效 ${total - bad - missingDoc}｜失效 ${bad}｜文档缺失跳过 ${missingDoc}${DROP ? `｜已删除失效块 ${dropped}` : ""}`)
if (bad && !VERBOSE) console.log(" 加 --verbose 看具体失效项")
for (const i of issues.slice(0, 40)) console.log("  -", i)
if (issues.length > 40) console.log(`  …… 其余 ${issues.length - 40} 条`)
