// 一次性探针：登录 + 执行任务，跑完即关（登录态存 sessionStorage，关窗失效）。
// 日常请用 agent.mjs 常驻模式，避免反复登录。
import { chromium } from "playwright"
import path from "node:path"
import fs from "node:fs"
import { LOGIN, VIEW, isLoginUrl, runTask } from "./lib.mjs"

const PROFILE = path.join(import.meta.dirname, ".profile")
const log = (m) => console.log(`[probe] ${m}`)

const taskFile = process.argv[2]
if (!taskFile) {
  console.log("用法: node probe.mjs tasks/xxx.json")
  process.exit(2)
}
const plan = JSON.parse(fs.readFileSync(taskFile, "utf8"))

const ctx = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: "chrome",
  viewport: VIEW.pc,
  locale: "zh-CN",
})
const pages = {}

for (const kind of plan.login ?? []) {
  const p = await ctx.newPage()
  await p.setViewportSize(VIEW[kind])
  await p.goto(LOGIN[kind], { waitUntil: "domcontentloaded" }).catch(() => {})
  log(`STEP 请在窗口里登录 ${kind.toUpperCase()} 端`)
  const start = Date.now()
  while (Date.now() - start < 20 * 60 * 1000 && isLoginUrl(p.url())) {
    if (p.isClosed()) break
    await p.waitForTimeout(1500)
  }
  if (isLoginUrl(p.url())) {
    log(`FAIL ${kind} 未登录`)
    await ctx.close()
    process.exit(1)
  }
  log(`OK ${kind} 已登录 ${p.url()}`)
  pages[kind] = p
}

let expired = false
for (const t of plan.tasks ?? []) {
  const page = pages[t.kind ?? "pc"] ?? (await ctx.newPage())
  pages[t.kind ?? "pc"] = page
  const r = await runTask(page, t)
  if (r?.expired) {
    log(`EXPIRED ${t.name ?? t.type}`)
    expired = true
    break
  }
  if (r?.missed) log(`MISS ${t.name} text=${r.missed}`)
  else log(`OK ${t.name ?? t.type}`)
}

log(expired ? "DONE_EXPIRED" : "DONE_OK")
await ctx.close()
process.exit(expired ? 9 : 0)
