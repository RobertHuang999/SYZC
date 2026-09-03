/**
 * 一次性补丁：写入 9 条新行 + 5 处更新（2026-09-03）
 * 用法：node apply-latest-updates.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.resolve(__dirname, "../功能与数据权限清单.csv")

function parseCSVRows(text) {
  const rows = []
  let row = []
  let field = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 1
        } else inQuotes = false
      } else field += char
      continue
    }
    if (char === '"') inQuotes = true
    else if (char === ",") {
      row.push(field)
      field = ""
    } else if (char === "\n" || (char === "\r" && text[i + 1] === "\n")) {
      if (char === "\r") i += 1
      row.push(field)
      if (row.some((c) => c.length > 0)) rows.push(row)
      row = []
      field = ""
    } else field += char
  }
  if (field.length || row.length) {
    row.push(field)
    if (row.some((c) => c.length > 0)) rows.push(row)
  }
  return rows
}

function escapeCSV(value) {
  const text = String(value ?? "")
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

/** 端 | 所属模块 | 一级菜单 | 二级菜单 | Tab */
function rowKey(cells) {
  return [cells[0], cells[1], cells[2], cells[3], cells[4]].join("|")
}

const rows = parseCSVRows(fs.readFileSync(csvPath, "utf8"))
const data = rows.slice(1)

const UPDATES = {
  "PC|3.融资/监管||客户融资尽调办理|-": {
    buttons:
      "查看页面、查看详情、拒绝、分配任务转交、发起尽调、客户尽调记录、分配给资方、重新尽调",
  },
  "PC|3.融资/监管||客户融资需求分配|-": {
    level2: "客户融资需求分配授信办理",
    buttons:
      "查看(页面)、详情、驳回（操作权限+数据状态为未分配可用）、分配/再次分配任务转交、审核记录",
  },
  "PC|3.融资/监管||客户融资需求分配授信办理|-": {
    buttons:
      "查看(页面)、详情、驳回（操作权限+数据状态为未分配可用）、分配/再次分配任务转交、审核记录",
  },
  "移动|2.工作台||客户融资需求管理|-": {
    level2: "客户融资需求管理授信办理",
    buttons: "查看页面、融资详情、分配任务转交、状态管理、发起抵质押",
  },
  "移动|2.工作台||客户融资需求管理授信办理|-": {
    buttons: "查看页面、融资详情、分配任务转交、状态管理、发起抵质押",
  },
  "移动|2.工作台||客户融资尽调办理|-": {
    buttons: `待受理：查看（页面）、查看详情、拒绝、分配任务转交（待受理、受理通过状态展示）、发起尽调（待受理、受理中状态展示）、下载资料（受理通过、受理拒绝状态展示）

尽调完成：查看（页面）、查看详情、分配给资方（待受理、受理通过状态展示）、重新尽调（尽调失败时展示）、下载资料（受理通过、受理拒绝状态展示）`,
  },
  "移动|3.业务办理||客户融资需求|-": {
    level2: "客户融资需求线索",
    legacy: "项目监管-审批-客户融资需求",
    updated: "2026年7月28日",
  },
  "移动|2.工作台||异动管理）|-": {
    level2: "异动管理",
  },
}

for (const row of data) {
  const patch = UPDATES[rowKey(row)]
  if (!patch) continue
  if (patch.level2 !== undefined) row[3] = patch.level2
  if (patch.buttons !== undefined) row[6] = patch.buttons
  if (patch.legacy !== undefined) row[5] = patch.legacy
  if (patch.updated !== undefined) row[10] = patch.updated
}

const NEW_ROWS = [
  [
    "PC", "2.仓储", "加工管理", "加工记录", "-", "",
    "查看页面、详情、新增加工、撤销加工、完成加工、作废、操作记录",
    "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "", "", "", "02-仓储", "仓储", "B端PC/02-仓储", "active",
  ],
  [
    "PC", "3.融资/监管", "融资管理", "被拒退回记录池", "-", "被拒退回记录池",
    "查看（页面）、重新尽调、重新分配给资方",
    "1、可见数据根据当前登录账号角色的数据权限决定；\n2、分配时可选机构为登录账号归属机构上配置的合作机构 + 本机构所有启用的人员账号；",
    "登录账号数据权限内的数据", "2026年7月28日", "2026年7月28日",
    "03-融资监管", "融资/监管", "B端PC/03-融资监管", "active",
  ],
  [
    "PC", "3.融资/监管", "监管业务", "供应链监管业务", "-", "项目管理～供应链监管订单",
    `监管订单：
查看（页面）、导出为excel、操作记录、查看资料、结算管理
更多操作-加/补仓、提货、解监管、平仓、货物盘点、盘点报告、查看监控、查看风险、设备管理（更多操作对应权限内的操作按钮还需根据订单关联的总流程内是否配置对应子流程决定最终是否展示，包含 加/补仓、提货、解监管、货物估值、平仓）、20280804新增 查看详情（查看抵质押详情）、20250801新增03-2版本内容：监管报告、监管报告-查看详情、监管报告-查看报告、监管报告-下载报告、监管报告-生成盘点监管报告`,
    `数据权限：根据当前登录账号的角色的数据权限决定【任务发起人及任务处理人可看到相关信息，其他无关人员需要有对应数据所属机构的数据权限才能看到】；

盘点 - 盘点人只能盘点自己有仓库权限的货物
当针对没有仓库权限的货物点击扫码盘点

操作记录 - 能看到这笔抵/质押单，就能看到这笔抵/质押单的全部操作记录`,
    "", "2026年3月10日", "", "03-融资监管", "融资/监管", "B端PC/03-融资监管", "active",
  ],
  [
    "PC", "5.风控", "风险信息", "风险公示", "-", "", "",
    "订单数据权限\n登录账号数据权限内的数据（可见订单则可见订单相关的预警消息）",
    "", "", "", "05-风控", "风控", "B端PC/05-风控", "active",
  ],
  [
    "移动", "2.工作台", "仓储", "加工管理", "-", "-",
    "查看页面、详情、新增加工、撤销加工、完成加工、作废、操作记录",
    "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "", "", "", "02-工作台", "工作台", "B端H5/02-工作台", "active",
  ],
  [
    "移动", "2.工作台", "融资/监管", "线上抵质押办理", "-", "",
    "发起抵质押",
    "·有融资申请审核权限的账号可看到所有融资申请信息\n·根据登录账号针对具体任务的操作权限决定；",
    "从【客户融资授信办理】中拆出来", "", "",
    "02-工作台", "工作台", "B端H5/02-工作台", "active",
  ],
  [
    "移动", "2.工作台", "融资/监管", "被拒退回记录池", "-", "被拒退回记录池",
    "查看（页面）、重新尽调（有需要尽调的标识才展示）、重新分配给资方",
    "登录账号数据权限内的数据", "", "2026年7月28日", "",
    "02-工作台", "工作台", "B端H5/02-工作台", "active",
  ],
  [
    "移动", "3.业务办理", "业务发起", "异动申请", "-", "-",
    "查看（页面）", "", "优化页面", "2026年3月10日", "2026年4月14日",
    "03-业务办理", "业务办理", "B端H5/03-业务办理", "active",
  ],
  [
    "移动", "3.业务办理", "业务发起", "盘点发起", "-", "-",
    "查看（页面）", "", "", "2026年4月14日", "2026年4月14日",
    "03-业务办理", "业务办理", "B端H5/03-业务办理", "active",
  ],
]

const existingKeys = new Set(data.map(rowKey))
const toInsert = NEW_ROWS.filter((row) => !existingKeys.has(rowKey(row)))

function insertAfter(matchFn, newRow) {
  const idx = data.findIndex(matchFn)
  if (idx === -1) {
    data.push(newRow)
    return
  }
  data.splice(idx + 1, 0, newRow)
}

for (const newRow of toInsert) {
  const [platform, , level1, level2] = newRow

  if (platform === "PC" && level1 === "加工管理") {
    insertAfter((r) => r[0] === "PC" && r[3] === "异动记录", newRow)
  } else if (platform === "PC" && level2 === "被拒退回记录池") {
    insertAfter(
      (r) =>
        r[0] === "PC" &&
        (r[3] === "客户融资需求分配授信办理" || r[3] === "客户融资需求分配"),
      newRow,
    )
  } else if (platform === "PC" && level2 === "供应链监管业务") {
    insertAfter((r) => r[0] === "PC" && r[3] === "抵质押业务管理", newRow)
  } else if (platform === "PC" && level2 === "风险公示") {
    insertAfter((r) => r[0] === "PC" && r[3] === "贷中风控管理", newRow)
  } else if (platform === "移动" && level2 === "加工管理") {
    insertAfter((r) => r[0] === "移动" && r[3] === "货物盘点", newRow)
  } else if (platform === "移动" && level2 === "线上抵质押办理") {
    insertAfter((r) => r[0] === "移动" && r[3] === "客户融资尽调办理", newRow)
  } else if (platform === "移动" && level2 === "被拒退回记录池") {
    insertAfter((r) => r[0] === "移动" && r[3] === "线上抵质押办理", newRow)
  } else if (platform === "移动" && level2 === "异动申请") {
    insertAfter((r) => r[0] === "移动" && r[3] === "抵质押业务办理", newRow)
  } else if (platform === "移动" && level2 === "盘点发起") {
    insertAfter((r) => r[0] === "移动" && r[3] === "异动申请", newRow)
  } else {
    data.push(newRow)
  }
}

const out = [rows[0], ...data].map((row) => row.map(escapeCSV).join(",")).join("\n") + "\n"
fs.writeFileSync(csvPath, out, "utf8")
console.log(`Patched CSV: ${toInsert.length} inserted, updates applied -> ${csvPath}`)
