// 常驻探针：浏览器窗口一直开着，登录一次可反复派任务。
// 登录态失效时会打印 NEED_LOGIN，使用者在同一个窗口里重新登录即可继续。
//
// 用法：node agent.mjs
// 派任务：把 json 写进 tools/cmd/ 目录（内容同 probe.mjs 的任务文件，多一个 "kind" 字段）
// 取结果：out/<name>.png / out/<name>.json，控制台打印 RESULT 行
import { chromium } from "playwright"
import path from "node:path"
import fs from "node:fs"
import { LOGIN, START, VIEW, isLoginUrl, runTask } from "./lib.mjs"

const HERE = import.meta.dirname
const PROFILE = path.join(HERE, ".profile")
const CMD_DIR = path.join(HERE, "cmd")
const DONE_DIR = path.join(CMD_DIR, "done")
fs.mkdirSync(DONE_DIR, { recursive: true })

const log = (m) => console.log(`[agent] ${m}`)

const ctx = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: "chrome",
  viewport: VIEW.pc,
  locale: "zh-CN",
})

const pages = {}

async function ensureLogged(kind) {
  let page = pages[kind]
  if (!page || page.isClosed()) {
    page = await ctx.newPage()
    await page.setViewportSize(VIEW[kind])
    pages[kind] = page
  }
  if (!isLoginUrl(page.url())) return page
  // 停在登录页，等人登
  log(`NEED_LOGIN ${kind} —— 请在窗口里登录 ${kind.toUpperCase()} 端`)
  const start = Date.now()
  while (Date.now() - start < 40 * 60 * 1000) {
    if (page.isClosed()) {
      page = await ctx.newPage()
      await page.setViewportSize(VIEW[kind])
      pages[kind] = page
      await page.goto(LOGIN[kind]).catch(() => {})
    }
    if (!isLoginUrl(page.url())) {
      log(`LOGIN_OK ${kind}`)
      return page
    }
    await page.waitForTimeout(1500)
  }
  throw new Error(`登录等待超时：${kind}`)
}

// 开局：PC 与 H5 各开一页，能复用 sessionStorage 就复用
for (const kind of ["pc", "h5"]) {
  const p = await ctx.newPage()
  await p.setViewportSize(VIEW[kind])
  await p.goto(START[kind], { waitUntil: "domcontentloaded" }).catch(() => {})
  pages[kind] = p
}
await new Promise((r) => setTimeout(r, 2500))
log("READY")

let stop = false
process.on("SIGTERM", () => (stop = true))
process.on("SIGINT", () => (stop = true))

while (!stop) {
  const files = fs
    .readdirSync(CMD_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
  if (!files.length) {
    if (fs.existsSync(path.join(CMD_DIR, "stop"))) break
    await new Promise((r) => setTimeout(r, 1500))
    continue
  }
  const file = files[0]
  const full = path.join(CMD_DIR, file)
  let plan
  try {
    plan = JSON.parse(fs.readFileSync(full, "utf8"))
  } catch (e) {
    log(`BAD_JSON ${file} ${e.message}`)
    fs.renameSync(full, path.join(DONE_DIR, file))
    continue
  }
  fs.renameSync(full, path.join(DONE_DIR, file))
  log(`CMD ${file}`)
  const kinds = new Set((plan.tasks ?? []).map((t) => t.kind ?? "pc"))
  try {
    for (const kind of kinds) await ensureLogged(kind)
    let expired = false
    for (const t of plan.tasks ?? []) {
      const page = await ensureLogged(t.kind ?? "pc")
      const r = await runTask(page, t)
      if (r?.expired) {
        log(`EXPIRED ${t.name ?? t.type}`)
        expired = true
        break
      }
      if (r?.missed) log(`MISS ${t.name} text=${r.missed}`)
    }
    log(expired ? `RESULT ${file} EXPIRED` : `RESULT ${file} OK`)
  } catch (e) {
    log(`RESULT ${file} ERROR ${e.message}`)
  }
}

log("BYE")
await ctx.close().catch(() => {})
process.exit(0)
