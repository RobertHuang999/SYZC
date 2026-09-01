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
  { id: "storage", label: "仓储", path: "/仓储/库存查询/存货管理" },
  { id: "finance", label: "融资/监管", path: "/融资/监管/融资管理/客户融资需求线索" },
  { id: "trade", label: "交易", path: "/交易/采购需求管理" },
  { id: "risk", label: "风控", path: "/风控/风控中心/总机构风控管理看板" },
  { id: "device-warning", label: "物联网IOT与预警", path: "/物联网IOT管理" },
  { id: "statistics", label: "统计/看板", path: "/统计/看板/总机构报表看板/业务管理看板" },
  { id: "settlement", label: "结算", path: "/结算/监管结算/项目结算管理" },
  { id: "config", label: "配置管理", path: "/配置管理/门户管理/门户端配置" },
]

export const configModuleSidebarGroups: SidebarGroup[] = [
  {
    id: "business-process",
    label: "业务流程管理",
    items: [
      { label: "开锁审批", path: "/配置管理/业务流程管理/开锁审批" },
    ],
  },
]

export const configSidebarGroups: SidebarGroup[] = [
  {
    id: "device-management",
    label: "物联网IOT管理",
    items: [
      { label: "监控设备", path: "/物联网IOT管理/监控设备" },
      { label: "门禁设备", path: "/物联网IOT管理/门禁设备" },
      { label: "物联设备", path: "/物联网IOT管理/物联设备" },
      { label: "GPS设备", path: "/物联网IOT管理/GPS设备" },
      { label: "人脸配置", path: "/物联网IOT管理/人脸配置" },
    ],
  },
  {
    id: "warning-information",
    label: "预警信息",
    items: [
      { label: "设备预警信息", path: "/预警信息/设备预警信息" },
      { label: "押品预警信息", path: "/预警信息/押品预警信息" },
      { label: "贷中风控管理", path: "/预警信息/贷中风控管理" },
      { label: "风险公示", path: "/预警信息/风险公示" },
    ],
  },
  {
    id: "warning-configuration",
    label: "预警配置",
    items: [
      { label: "预警等级", path: "/预警配置/预警等级" },
      { label: "设备预警配置", path: "/预警配置/设备预警配置" },
      { label: "订单预警配置", path: "/预警配置/订单预警配置" },
    ],
  },
  {
    id: "migration-schemes",
    label: "历史迁移与割接方案",
    items: [
      { label: "历史迁移总索引", path: "/历史迁移与割接/历史迁移总索引" },
      { label: "三旧模块兼容总说明", path: "/历史迁移与割接/三旧模块兼容总说明" },
      { label: "设备侧规则与流水迁移", path: "/历史迁移与割接/设备侧规则与流水迁移" },
      { label: "订单规则与押品流水迁移", path: "/历史迁移与割接/订单规则与押品流水迁移" },
      { label: "门禁与设备事务通知兼容映射", path: "/历史迁移与割接/门禁与设备事务通知兼容映射" },
      { label: "跨域用例数据推演", path: "/历史迁移与割接/跨域用例数据推演" },
    ],
  },
]

const sidebarGroupsByModule: Record<string, SidebarGroup[]> = {
  home: [],
  storage: [
    {
      id: "inventory",
      label: "库存查询",
      items: [
        { label: "存货管理", path: "/仓储/库存查询/存货管理" },
        { label: "理货堆放", path: "/仓储/库存查询/理货堆放" },
        { label: "库存明细", path: "/仓储/库存查询/库存明细" },
        { label: "库存流水", path: "/仓储/库存查询/库存流水" },
      ],
    },
    { id: "warehouse-order", label: "仓单管理", items: [{ label: "仓单管理", path: "/仓储/仓单管理" }] },
    {
      id: "ownership",
      label: "货权管理",
      items: [
        { label: "货权档案", path: "/仓储/货权管理/货权档案" },
        { label: "货权公示", path: "/仓储/货权管理/货权公示" },
        { label: "证据管理", path: "/仓储/货权管理/证据管理" },
      ],
    },
  ],
  finance: [
    {
      id: "financing",
      label: "融资管理",
      items: [{ label: "客户融资需求线索", path: "/融资/监管/融资管理/客户融资需求线索" }],
    },
    {
      id: "pledge",
      label: "抵质押业务",
      items: [
        { label: "抵质押业务办理", path: "/融资/监管/抵质押业务/抵质押业务办理" },
        { label: "抵质押业务管理", path: "/融资/监管/抵质押业务/抵质押业务管理" },
      ],
    },
    { id: "financing-contract", label: "合同管理", items: [{ label: "融资合同管理", path: "/融资/监管/合同管理/融资合同管理" }] },
    {
      id: "supervision",
      label: "监管业务",
      items: [{ label: "供应链监管业务", path: "/融资/监管/监管业务/供应链监管业务" }],
    },
  ],
  trade: [
    {
      id: "trade-demand",
      label: "需求管理",
      items: [
        { label: "采购需求管理", path: "/交易/采购需求管理" },
        { label: "销售需求管理", path: "/交易/销售需求管理" },
      ],
    },
    { id: "trade-contract", label: "合同管理", items: [{ label: "销售合同管理", path: "/交易/合同管理/销售合同管理" }] },
    { id: "customer", label: "客户管理", items: [{ label: "客户管理", path: "/交易/客户管理" }] },
  ],
  risk: [
    {
      id: "risk-center",
      label: "风控中心",
      items: [
        { label: "总机构风控管理看板", path: "/风控/风控中心/总机构风控管理看板" },
        { label: "机构风控管理看板", path: "/风控/风控中心/机构风控管理看板" },
        { label: "总机构数字仓库看板", path: "/风控/风控中心/总机构数字仓库看板" },
        { label: "机构数字仓库看板", path: "/风控/风控中心/机构数字仓库看板" },
      ],
    },
    {
      id: "risk-information",
      label: "风险信息",
      items: [
        { label: "设备预警信息", path: "/风控/风险信息/设备预警信息" },
        { label: "押品预警信息", path: "/风控/风险信息/押品预警信息" },
        { label: "设备事务通知信息", path: "/风控/风险信息/设备事务通知信息" },
        { label: "贷中风控管理", path: "/风控/风险信息/贷中风控管理" },
        { label: "风险公示", path: "/风控/风险信息/风险公示" },
      ],
    },
  ],
  statistics: [
    {
      id: "organization-report",
      label: "总机构报表看板",
      items: [
        { label: "业务管理看板", path: "/统计/看板/总机构报表看板/业务管理看板" },
        { label: "资产管理看板", path: "/统计/看板/总机构报表看板/资产管理看板" },
        { label: "价格走势看板", path: "/统计/看板/总机构报表看板/价格走势看板" },
      ],
    },
    {
      id: "institution-report",
      label: "机构报表看板",
      items: [
        { label: "业务管理看板", path: "/统计/看板/机构报表看板/业务管理看板" },
        { label: "资产管理看板", path: "/统计/看板/机构报表看板/资产管理看板" },
        { label: "价格走势看板", path: "/统计/看板/机构报表看板/价格走势看板" },
      ],
    },
  ],
  settlement: [
    {
      id: "settlement-management",
      label: "监管结算",
      items: [
        { label: "项目结算管理", path: "/结算/监管结算/项目结算管理" },
        { label: "结算汇总", path: "/结算/监管结算/结算汇总" },
      ],
    },
  ],
  "device-warning": configSidebarGroups,
  config: configModuleSidebarGroups,
}

const decodePath = (pathname: string) => {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}

const modulePrefixes: Record<string, string> = {
  home: "/工作中心/审批中心",
  storage: "/仓储",
  finance: "/融资/监管",
  trade: "/交易",
  risk: "/风控",
  "device-warning": "/物联网IOT管理",
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

export function getActiveTopModule(pathname: string): TopModule {
  const currentPath = decodePath(pathname)
  const deviceWarningPathPrefixes = ["/物联网IOT管理", "/预警信息", "/预警配置", "/历史迁移与割接"]

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

export function getSidebarGroups(module: TopModule): SidebarGroup[] {
  return sidebarGroupsByModule[module.id] ?? []
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
  const breadcrumbs = getBreadcrumbs(pathname)
  const last = breadcrumbs.at(-1)
  const previous = breadcrumbs.at(-2)

  if (last && previous && actionLabels[last.label]) {
    return `${previous.label}${last.label}`
  }

  return last?.label ?? "工作中心"
}
