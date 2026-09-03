/**
 * CSV 行解析与继承行（端/模块/菜单为空时沿用上行）处理。
 */
export function parseCSVRows(text) {
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
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ",") {
      row.push(field)
      field = ""
    } else if (char === "\n" || (char === "\r" && text[i + 1] === "\n")) {
      if (char === "\r") i += 1
      row.push(field)
      if (row.some((cell) => cell.length > 0)) rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    if (row.some((cell) => cell.length > 0)) rows.push(row)
  }

  return rows
}

export function buildHeaderIndex(headerRow, extraAliases = {}) {
  const aliases = {
    移动PC端: "端",
    "移动/PC端": "端",
    二级子功能菜单Tab: "Tab",
    "二级子功能菜单/Tab": "Tab",
    原路径: "旧系统路径",
    "功能按钮/权限分类": "页面功能按钮",
    数据权限描述: "数据可见范围",
    备注说明: "变更说明",
    ...extraAliases,
  }
  const index = new Map()
  headerRow.forEach((cell, i) => {
    const key = aliases[cell.trim()] ?? cell.trim()
    if (key && !index.has(key)) index.set(key, i)
  })
  return index
}

export function pick(row, headerIndex, key) {
  const idx = headerIndex.get(key)
  if (idx === undefined) return ""
  return String(row[idx] ?? "").replace(/\s+/g, " ").trim()
}

/** 解析数据行，自动继承上行的端 / 模块 / 菜单层级 */
export function resolveInheritedRow(row, headerIndex, state) {
  const platformRaw = pick(row, headerIndex, "端")
  const moduleRaw = pick(row, headerIndex, "所属模块")
  const level1Raw = pick(row, headerIndex, "一级菜单")
  const level2Raw = pick(row, headerIndex, "二级菜单")
  const tabRaw = pick(row, headerIndex, "Tab")

  if (platformRaw) state.platform = platformRaw
  if (moduleRaw) state.module = moduleRaw
  if (level1Raw) {
    state.level1 = level1Raw
    state.level2 = level2Raw
  } else if (level2Raw) {
    state.level2 = level2Raw
  }

  return {
    platform: state.platform,
    module: state.module,
    level1: state.level1,
    level2: state.level2,
    tab: tabRaw,
    legacyPath: pick(row, headerIndex, "旧系统路径"),
    actionPermissions: pick(row, headerIndex, "页面功能按钮"),
    dataPermission: pick(row, headerIndex, "数据可见范围"),
    changeNote: pick(row, headerIndex, "变更说明"),
    createdAt: pick(row, headerIndex, "创建时间"),
    updatedAt: pick(row, headerIndex, "修定时间"),
    menuModuleCode: pick(row, headerIndex, "菜单模块编码"),
    topBarModuleLabel: pick(row, headerIndex, "顶栏/底栏模块名"),
    baselineModuleDir: pick(row, headerIndex, "基准模块目录"),
    recordStatus: pick(row, headerIndex, "记录状态"),
  }
}

export function isEmptyDataRow(resolved) {
  return (
    !resolved.level1 &&
    !resolved.level2 &&
    !resolved.tab &&
    !resolved.actionPermissions &&
    !resolved.dataPermission &&
    !resolved.legacyPath &&
    !resolved.changeNote
  )
}

export function normalizePcModule(moduleName) {
  if (moduleName === "1.首页") return "1.工作中心"
  return moduleName
}

export function inferRecordStatus(changeNote) {
  const note = String(changeNote ?? "")
  if (/版本取消|取消.*菜单/.test(note)) return "cancelled"
  if (/计划中/.test(note)) return "planned"
  return "active"
}

export function escapeCSV(value) {
  const text = String(value ?? "")
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}
