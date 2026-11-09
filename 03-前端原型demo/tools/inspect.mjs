// 原型页面实测：抓表格、按钮、卡片的关键样式（原型用 div/Tailwind，不是 el-table）
// 用法：node inspect.mjs <url> <name> [route] [pc|h5]
import { chromium } from "playwright"
import path from "node:path"
import fs from "node:fs"
import { OUT, settle } from "./lib.mjs"

const [url, name, route, kind = "pc"] = process.argv.slice(2)
const browser = await chromium.launch({ headless: true, channel: "chrome" })
const page = await browser.newPage({
  viewport: kind === "h5" ? { width: 390, height: 844 } : { width: 1440, height: 900 },
})
await page.goto(route ? new URL(route, url).toString() : url, { waitUntil: "networkidle" }).catch(() => {})
await settle(page)

const data = await page.evaluate(() => {
  const st = (el) => {
    if (!el) return null
    const s = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 20),
      w: Math.round(r.width),
      h: Math.round(r.height),
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      color: s.color,
      bg: s.backgroundColor,
      padding: s.padding,
      radius: s.borderRadius,
      border: s.borderColor,
    }
  }
  const ths = Array.from(document.querySelectorAll("thead th")).map(st)
  const firstRow = Array.from(document.querySelectorAll("tbody tr")[0]?.children ?? []).map(st)
  const btn = (t) => st(Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").includes(t)))
  const cards = Array.from(document.querySelectorAll("[class*='rounded']"))
    .map((el) => ({ ...st(el), cls: String(el.className).slice(0, 70) }))
    .filter((x) => x.h > 60)
    .slice(0, 6)
  return {
    url: location.href,
    ths,
    firstRow,
    queryBtn: btn("查询"),
    addBtn: btn("新增出库"),
    cards,
    rowCount: document.querySelectorAll("tbody tr").length,
  }
})
fs.writeFileSync(path.join(OUT, `${name}-inspect.json`), JSON.stringify(data, null, 2))
console.log(JSON.stringify(data, null, 1).slice(0, 4000))
await browser.close()
