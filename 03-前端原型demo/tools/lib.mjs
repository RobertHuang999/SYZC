// 共用能力：页面抓取、点击导航、菜单导出、任务执行。
import path from "node:path"
import fs from "node:fs"

export const OUT = path.join(import.meta.dirname, "out")
export const BASE = "https://senyun-wrl-test4.sylinker.cn"
export const LOGIN = {
  pc: `${BASE}/wrlaa/login`,
  h5: `${BASE}/wrlan/#/pages/login/login`,
}
export const START = { pc: `${BASE}/wrlaa/index`, h5: `${BASE}/wrlan/#/` }
export const VIEW = { pc: { width: 1440, height: 900 }, h5: { width: 390, height: 844 } }

fs.mkdirSync(OUT, { recursive: true })

export const isLoginUrl = (u) => /\/login/i.test(u)

export async function settle(page) {
  await page.waitForLoadState("domcontentloaded").catch(() => {})
  await page.waitForTimeout(1000)
  await page
    .waitForFunction(() => !document.querySelector(".el-loading-mask"), { timeout: 20000 })
    .catch(() => {})
  await page.waitForTimeout(700)
}

export async function clickText(page, text) {
  const byExact = page.getByText(text, { exact: true })
  if ((await byExact.count().catch(() => 0)) > 0) {
    await byExact.first().click({ timeout: 8000 }).catch(async () => {
      await byExact.first().click({ force: true, timeout: 8000 }).catch(() => {})
    })
    return true
  }
  const byPart = page.getByText(text)
  if ((await byPart.count().catch(() => 0)) > 0) {
    await byPart.first().click({ force: true, timeout: 8000 }).catch(() => {})
    return true
  }
  return false
}

export async function dumpMenu(page, kind) {
  await page.goto(START[kind], { waitUntil: "domcontentloaded" }).catch(() => {})
  await settle(page)
  if (isLoginUrl(page.url())) return { expired: true }
  const data = await page.evaluate(() => {
    const text = (el) => (el.textContent || "").replace(/\s+/g, " ").trim()
    const collect = (sel) => Array.from(document.querySelectorAll(sel)).map(text).filter(Boolean)
    return {
      title: document.title,
      topNav: collect("header *, .el-menu--horizontal *, [class*='top-nav'] *").filter(
        (t) => t.length < 12
      ),
      allShort: collect("a, li, span, div")
        .filter((t) => t.length > 1 && t.length < 20)
        .slice(0, 300),
    }
  })
  fs.writeFileSync(path.join(OUT, `menu-${kind}.json`), JSON.stringify(data, null, 2))
  return { expired: false, count: data.allShort.length }
}

const READ_PROPS = [
  "font-size",
  "line-height",
  "font-weight",
  "color",
  "background-color",
  "padding",
  "margin",
  "border-radius",
  "border-color",
  "border-bottom-color",
]

export async function shoot(page, url, name, kind) {
  await page.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {})
  await settle(page)
  if (isLoginUrl(page.url())) return { expired: true }
  await capture(page, name, kind)
  return { expired: false }
}

export async function capture(page, name, kind) {
  const metrics = await page.evaluate((props) => {
    const read = (el) => {
      if (!el) return null
      const s = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      const o = { box: { w: Math.round(r.width), h: Math.round(r.height) } }
      for (const p of props) o[p] = s.getPropertyValue(p)
      o["font-family"] = s.getPropertyValue("font-family")
      return o
    }
    const q = (s) => document.querySelector(s)
    return {
      title: document.title,
      url: location.href,
      viewport: { w: innerWidth, h: innerHeight },
      body: read(document.body),
      card: read(q(".el-card, .van-cell-group")),
      tableHeader: read(q(".el-table th")),
      tableCell: read(q(".el-table td")),
      primaryButton: read(q(".el-button--primary, .van-button--primary")),
      defaultButton: read(q(".el-button:not(.el-button--primary)")),
      input: read(q(".el-input__inner, .van-field__control")),
      formLabel: read(q(".el-form-item__label")),
      pageTitle: read(q(".title-container h3, .van-nav-bar__title")),
      tableColumns: Array.from(
        document.querySelectorAll(".el-table th .cell, table thead th")
      ).map((c) => ({
        text: (c.textContent || "").trim().slice(0, 24),
        width: Math.round(c.getBoundingClientRect().width),
      })),
      buttons: Array.from(document.querySelectorAll(".el-button, .van-button"))
        .map((b) => (b.textContent || "").replace(/\s+/g, "").slice(0, 14))
        .filter(Boolean),
      filterLabels: Array.from(document.querySelectorAll(".el-form-item__label"))
        .map((l) => (l.textContent || "").replace(/\s+/g, "").slice(0, 14))
        .filter(Boolean),
      tabs: Array.from(document.querySelectorAll(".el-tabs__item, .van-tab"))
        .map((t) => (t.textContent || "").replace(/\s+/g, "").slice(0, 14))
        .filter(Boolean),
    }
  }, READ_PROPS)
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true })
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(metrics, null, 2))
  return metrics
}

export async function navShoot(page, clicks, name, kind) {
  for (const t of clicks) {
    if (!(await clickText(page, t))) return { expired: false, missed: t }
    await page.waitForTimeout(1500)
  }
  await settle(page)
  if (isLoginUrl(page.url())) return { expired: true }
  await capture(page, name, kind)
  return { expired: false }
}

export async function runEval(page, js, name) {
  const r = await page.evaluate(`(${js})()`)
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(r, null, 2))
  return { expired: false }
}

export async function runTask(page, t) {
  if (t.type === "menu") return dumpMenu(page, t.kind)
  if (t.type === "nav") return navShoot(page, t.clicks, t.name, t.kind)
  if (t.type === "eval") return runEval(page, t.js, t.name)
  if (t.type === "shot") return capture(page, t.name, t.kind)
  return shoot(page, t.url, t.name, t.kind)
}
