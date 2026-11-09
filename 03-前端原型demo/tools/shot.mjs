// 截取任意本地/远程页面（原型用），产出 out/<name>.png 与 .json
// 用法：node shot.mjs <url> <name> [pc|h5] [route]
//   route: 前端路由（hash 或 path），会在打开后跳转，用于 SPA
import { chromium } from "playwright"
import { capture, settle } from "./lib.mjs"
import path from "node:path"

const [url, name, kind = "pc", route] = process.argv.slice(2)
if (!url || !name) {
  console.log("用法: node shot.mjs <url> <name> [pc|h5] [route]")
  process.exit(2)
}

const browser = await chromium.launch({ headless: true, channel: "chrome" })
const page = await browser.newPage({
  viewport: kind === "h5" ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})

const target = route ? new URL(route, url).toString() : url
await page.goto(target, { waitUntil: "networkidle" }).catch(() => {})
await settle(page)
await capture(page, name, kind)
console.log(`OK ${name} ${target}`)
await browser.close()
