import { generatedSidebarGroupsByModule } from "./menu-catalog.generated"
import {
  INBOUND_STAGING_PROTOTYPE_RELEASED,
  INBOUND_STAGING_PC_MENU_PATH,
} from "@prototype/shared/inbound/inbound-633-delivery"
import {
  partnerArchiveListPath,
  partnerArchiveSidebarItems,
  PARTNER_ARCHIVE_DEFAULT_MENU,
} from "@prototype/shared/partner-archives/partner-archive-routes"

export const PERMISSION_REFERENCE_PATH = "/系统参考/功能与数据权限"
/** 旧路由保留重定向，避免书签失效 */
export const ITERATION_RECORD_LEGACY_PATH = "/系统参考/菜单迭代记录"
export const ITERATION_RECORD_PATH = "/系统参考/迭代记录"
export const ITERATION_RECORD_LABEL = "迭代记录"

function isIterationRecordPath(currentPath: string) {
  return (
    currentPath === ITERATION_RECORD_PATH ||
    currentPath.startsWith(`${ITERATION_RECORD_PATH}/`) ||
    currentPath === ITERATION_RECORD_LEGACY_PATH ||
    currentPath.startsWith(`${ITERATION_RECORD_LEGACY_PATH}/`)
  )
}

export const IOT_WARNING_MODULE_PREFIX = "/物联网IOT与预警"

export type TopModule = {
  id: string
  label: string
  path: string
}

export type SidebarItem = {
  label: string
  path: string
}

export type SidebarGroup = {
  id: string
  label: string
  items: SidebarItem[]
}

export type BreadcrumbItem = {
  label: string
}

export const topModules: TopModule[] = [
  { id: "home", label: "工作中心", path: "/工作中心/审批中心" },
  {
    id: "user-center",
    label: "用户中心",
    path: partnerArchiveListPath(PARTNER_ARCHIVE_DEFAULT_MENU),
  },
  { id: "storage", label: "仓储", path: "/仓储/库存查询/存货管理" },
  { id: "finance", label: "融资/监管", path: "/融资/监管/融资管理/客户融资需求线索" },
  { id: "trade", label: "交易", path: "/交易/采购管理/采购需求管理" },
  { id: "risk", label: "风控", path: "/风控/风控中心/总机构风控管理看板" },
  {
    id: "device-warning",
    label: "物联网IOT与预警",
    path: `${IOT_WARNING_MODULE_PREFIX}/物联网IOT管理/监控设备`,
  },
  { id: "statistics", label: "统计/看板", path: "/统计/看板/总机构报表看板/业务管理看板" },
  { id: "settlement", label: "结算", path: "/结算/监管结算/项目结算管理" },
  { id: "config", label: "配置管理", path: "/配置管理/门户管理/门户端配置" },
]

const migrationSidebarGroup: SidebarGroup = {
  id: "migration-schemes",
  label: "历史迁移与割接方案",
  items: [
    { label: "历史迁移总索引", path: "/历史迁移与割接/历史迁移总索引" },
    { label: "三旧模块兼容总说明", path: "/历史迁移与割接/三旧模块兼容总说明" },
    { label: "设备侧规则与流水迁移", path: "/历史迁移与割接/设备侧规则与流水迁移" },
    { label: "订单规则与押品流水迁移", path: "/历史迁移与割接/订单规则与押品流水迁移" },
    { label: "门禁与设备事务通知兼容映射", path: "/历史迁移与割接/门禁与设备事务通知兼容映射" },
    { label: "跨域用例数据推演", path: "/历史迁移与割接/跨域用例数据推演" },
    { label: "合作方主数据迁移（6.3）", path: "/历史迁移与割接/合作方主数据迁移" },
  ],
}

const configSidebarGroupsWith63: SidebarGroup[] = (
  generatedSidebarGroupsByModule["config"] ?? []
).map((group) => {
  if (group.id === "货品规格管理" || group.label === "货品规格管理") {
    const items = [...group.items]
    const hasFieldPool = items.some((item) => item.label === "入库收集项配置")
    if (!hasFieldPool) {
      const goodsIndex = items.findIndex((item) => item.label === "货品管理")
      const insertIndex = goodsIndex >= 0 ? goodsIndex + 1 : items.length
      items.splice(insertIndex, 0, {
        label: "入库收集项配置",
        path: "/配置管理/货品规格管理/入库收集项配置",
      })
      return {
        ...group,
        items,
      }
    }
  }

  return group
})

const sidebarGroupsByModule: Record<string, SidebarGroup[]> = {
  ...generatedSidebarGroupsByModule,
  "user-center": [
    {
      id: "partner-archive",
      label: "合作方档案",
      items: partnerArchiveSidebarItems,
    },
    {
      id: "synergy-spec",
      label: "业务协同与说明",
      items: [
        {
          label: "合作方档案存量改造地图",
          path: "/用户中心/业务协同/合作方档案存量改造地图",
        },
        {
          label: "存量协同规格全文",
          path: "/用户中心/业务协同/存量业务单据协同",
        },
      ],
    },
  ],
  "device-warning": [
    ...(generatedSidebarGroupsByModule["device-warning"] ?? []),
    migrationSidebarGroup,
  ],
  config: configSidebarGroupsWith63,
}

const decodePath = (pathname: string) => {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}

export function isSystemReferencePath(pathname: string) {
  const currentPath = decodePath(pathname)
  return (
    currentPath === PERMISSION_REFERENCE_PATH ||
    currentPath.startsWith(`${PERMISSION_REFERENCE_PATH}/`) ||
    isIterationRecordPath(currentPath)
  )
}

export function getSystemReferenceTab(pathname: string): "permission" | "iteration" | null {
  const currentPath = decodePath(pathname)
  if (isIterationRecordPath(currentPath)) {
    return "iteration"
  }
  if (
    currentPath === PERMISSION_REFERENCE_PATH ||
    currentPath.startsWith(`${PERMISSION_REFERENCE_PATH}/`)
  ) {
    return "permission"
  }
  return null
}

const modulePrefixes: Record<string, string> = {
  home: "/工作中心",
  "user-center": "/用户中心",
  storage: "/仓储",
  finance: "/融资/监管",
  trade: "/交易",
  risk: "/风控",
  "device-warning": IOT_WARNING_MODULE_PREFIX,
  statistics: "/统计/看板",
  settlement: "/结算",
  config: "/配置管理",
}

const actionLabels: Record<string, string> = {
  详情: "详情",
  新增: "新增",
  编辑: "编辑",
  解除: "解除",
}

/** 顶栏 Tab 文案覆盖（与线上一致的产品命名） */
const PAGE_TAB_TITLE_OVERRIDES: Record<string, string> = {
  "/仓储/入库管理/入库申请/新增": "新增入库",
  "/仓储/入库管理/入库记录/新增": "新增入库",
  "/仓储/入库管理/入库暂存登记/新增": "新增暂存登记",
  "/仓储/出库管理/出库记录/新增": "新增出库",
  "/仓储/仓单管理": "仓单管理",
}

function inboundDetailTabTitle(pathname: string): string | undefined {
  const decoded = decodeURIComponent(pathname)
  if (
    decoded.includes("/仓储/入库管理/入库记录/详情/") ||
    decoded.includes("/仓储/入库管理/入库申请/详情/")
  ) {
    return "入库单详情"
  }
  if (decoded.includes("/仓储/出库管理/出库记录/详情/")) {
    return "出库单详情"
  }
  if (decoded.includes("/仓储/仓单管理/详情/")) {
    return "仓单详情"
  }
  return undefined
}

export function getActiveTopModule(pathname: string): TopModule {
  const currentPath = decodePath(pathname)
  const deviceWarningPathPrefixes = [IOT_WARNING_MODULE_PREFIX, "/历史迁移与割接"]

  if (deviceWarningPathPrefixes.some((prefix) => currentPath === prefix || currentPath.startsWith(`${prefix}/`))) {
    return topModules.find((module) => module.id === "device-warning")!
  }

  return (
    topModules.find((module) => {
      const prefix = modulePrefixes[module.id]
      return currentPath === prefix || currentPath.startsWith(`${prefix}/`)
    }) ?? topModules[0]
  )
}

export function shouldShowConfigSidebar(pathname: string) {
  return getActiveTopModule(pathname).id === "device-warning"
}

/** 工作中心为审批中心卡片聚合页，无左侧树形菜单（见 07-审批中心 ASCII） */
export function shouldShowSidebar(pathname: string) {
  if (isSystemReferencePath(pathname)) {
    return false
  }

  return getActiveTopModule(pathname).id !== "home"
}

export function getAllMenuPaths(): string[] {
  const paths = Object.values(sidebarGroupsByModule).flatMap((groups) =>
    groups.flatMap((group) => group.items.map((item) => item.path)),
  )
  return [...new Set(paths)]
}

function filterInboundStagingSidebarGroups(groups: SidebarGroup[]): SidebarGroup[] {
  if (INBOUND_STAGING_PROTOTYPE_RELEASED) {
    return groups
  }
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.path !== INBOUND_STAGING_PC_MENU_PATH &&
          !item.path.startsWith(`${INBOUND_STAGING_PC_MENU_PATH}/`),
      ),
    }))
    .filter((group) => group.items.length > 0)
}

export function getSidebarGroups(module: TopModule): SidebarGroup[] {
  return filterInboundStagingSidebarGroups(sidebarGroupsByModule[module.id] ?? [])
}

export function getActiveSidebarGroup(pathname: string): SidebarGroup {
  const activeModule = getActiveTopModule(pathname)
  const currentPath = decodePath(pathname)
  const groups = getSidebarGroups(activeModule)

  return (
    groups.find((group) =>
      group.items.some((item) => currentPath === item.path || currentPath.startsWith(`${item.path}/`)),
    ) ?? groups[0] ?? { id: "current", label: activeModule.label, items: [] }
  )
}

export function getPageTitle(pathname: string) {
  const currentPath = decodePath(pathname).replace(/\/$/, "")

  if (getSystemReferenceTab(pathname) === "iteration") {
    return ITERATION_RECORD_LABEL
  }
  if (getSystemReferenceTab(pathname) === "permission") {
    return "功能与数据权限"
  }

  const allItems = Object.values(sidebarGroupsByModule).flatMap((groups) => groups.flatMap((group) => group.items))
  const matchedItem = allItems.find((item) => currentPath === item.path || currentPath.startsWith(`${item.path}/`))

  if (matchedItem) {
    return matchedItem.label
  }

  const activeModule = getActiveTopModule(pathname)
  const matchedModule = topModules.find((module) => module.id === activeModule.id)
  return matchedModule?.label ?? "首页"
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const currentPath = decodePath(pathname).replace(/\/$/, "") || "/"

  if (getSystemReferenceTab(pathname) === "iteration") {
    return [{ label: "系统参考" }, { label: ITERATION_RECORD_LABEL }]
  }
  if (getSystemReferenceTab(pathname) === "permission") {
    return [{ label: "系统参考" }, { label: "功能与数据权限" }]
  }

  const activeModule = getActiveTopModule(pathname)
  const breadcrumbs: BreadcrumbItem[] = [{ label: activeModule.label }]
  const groups = getSidebarGroups(activeModule)
  const matchedGroup = groups.find((group) =>
    group.items.some((item) => currentPath === item.path || currentPath.startsWith(`${item.path}/`)),
  )
  const matchedItem = matchedGroup?.items.find(
    (item) => currentPath === item.path || currentPath.startsWith(`${item.path}/`),
  )

  if (matchedGroup) {
    breadcrumbs.push({ label: matchedGroup.label })
  }

  if (matchedItem) {
    breadcrumbs.push({ label: matchedItem.label })

    const restPath = currentPath.slice(matchedItem.path.length)
    const action = restPath.split("/").filter(Boolean).find((segment) => actionLabels[segment])

    if (action) {
      breadcrumbs.push({ label: actionLabels[action] })
    }
  } else {
    const modulePrefix = modulePrefixes[activeModule.id]
    const relativePath = modulePrefix && currentPath.startsWith(modulePrefix)
      ? currentPath.slice(modulePrefix.length)
      : currentPath

    for (const segment of relativePath.split("/").filter(Boolean)) {
      if (actionLabels[segment]) {
        breadcrumbs.push({ label: actionLabels[segment] })
      } else if (!/^\d+$/.test(segment) && !segment.startsWith("evt-")) {
        breadcrumbs.push({ label: segment })
      }
    }
  }

  return breadcrumbs
}

export function getPageTabTitle(pathname: string) {
  const currentPath = decodePath(pathname).replace(/\/$/, "")
  const detailTitle = inboundDetailTabTitle(currentPath)
  if (detailTitle) return detailTitle
  const override = PAGE_TAB_TITLE_OVERRIDES[currentPath]
  if (override) return override

  const breadcrumbs = getBreadcrumbs(pathname)
  const last = breadcrumbs.at(-1)
  const previous = breadcrumbs.at(-2)

  if (last && previous && actionLabels[last.label]) {
    return `${previous.label}${last.label}`
  }

  return last?.label ?? "工作中心"
}
