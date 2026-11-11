// 自动生成，请勿手工编辑。运行 npm run generate:permissions 更新。
// 数据源：02-PRD文档/🌟🌟🌟-最新基准版/00-功能与数据权限/功能与数据权限清单.csv
// + 02-PRD文档/B-迭代需求/6.3版本（2026.09）/功能与数据权限-6.3增量.json
// CSV 列名与原型页四列对齐：页面路径 / 页面功能按钮 / 数据可见范围 / 变更记录

export type PermissionRecord = {
  id: string
  platform: "PC" | "移动" | "C端PC" | "C端H5" | "SAAS"
  module: string
  topBarModuleLabel: string
  menuModuleCode: string
  baselineModuleDir: string
  recordStatus: "active" | "planned" | "cancelled" | "6.2-target" | "6.3-target" | "6.3-delivered"
  pagePathSegments: string[]
  pagePath: string
  legacyPath: string
  actionPermissions: string
  dataPermission: string
  changeNote: string
  createdAt: string
  updatedAt: string
}

export const permissionRecords: PermissionRecord[] = [
  {
    "id": "1",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "业务管理审批",
      "待处理"
    ],
    "pagePath": "审批中心 / 业务管理审批 / 待处理",
    "legacyPath": "审批～我的待办审批～待处理",
    "actionPermissions": "设置监管报告",
    "dataPermission": "根据当前登录用户针对对应任务的权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "2",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "业务管理审批",
      "已处理"
    ],
    "pagePath": "审批中心 / 业务管理审批 / 已处理",
    "legacyPath": "审批～我的待办审批～已处理",
    "actionPermissions": "查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "3",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "业务管理审批",
      "抄送我的"
    ],
    "pagePath": "审批中心 / 业务管理审批 / 抄送我的",
    "legacyPath": "审批～我的待办审批～抄送我的",
    "actionPermissions": "查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "4",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "业务管理审批",
      "我的申请管理"
    ],
    "pagePath": "审批中心 / 业务管理审批 / 我的申请管理",
    "legacyPath": "审批～我的申请管理",
    "actionPermissions": "查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "5",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "业务管理审批",
      "业务申请管理"
    ],
    "pagePath": "审批中心 / 业务管理审批 / 业务申请管理",
    "legacyPath": "审批～业务申请管理",
    "actionPermissions": "查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "6",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "审批中心",
      "业务管理审批",
      "监管委托受理"
    ],
    "pagePath": "审批中心 / 业务管理审批 / 监管委托受理",
    "legacyPath": "审批～监管委托受理",
    "actionPermissions": "查看页面",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-09-11"
  },
  {
    "id": "7",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "监管委托受理",
      "抵押信息确认任务"
    ],
    "pagePath": "审批中心 / 监管委托受理 / 抵押信息确认任务",
    "legacyPath": "-",
    "actionPermissions": "查看页面、查看详情、去处理、审核记录",
    "dataPermission": "任务数据权限（监管服务方）",
    "changeNote": "2026-11-10 按TSV补齐监管委托受理确认任务",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "8",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "监管委托受理",
      "质押信息确认任务"
    ],
    "pagePath": "审批中心 / 监管委托受理 / 质押信息确认任务",
    "legacyPath": "-",
    "actionPermissions": "查看页面、查看详情、去处理、审核记录",
    "dataPermission": "任务数据权限（监管服务方）",
    "changeNote": "2026-11-10 按TSV补齐监管委托受理确认任务",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "9",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "监管委托受理",
      "监管服务信息确认任务"
    ],
    "pagePath": "审批中心 / 监管委托受理 / 监管服务信息确认任务",
    "legacyPath": "-",
    "actionPermissions": "查看页面、查看详情、去处理、审核记录",
    "dataPermission": "任务数据权限（监管服务方）",
    "changeNote": "2026-11-10 按TSV补齐监管委托受理确认任务",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "10",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "审批中心",
      "客户需求审批",
      "客户入库需求"
    ],
    "pagePath": "审批中心 / 客户需求审批 / 客户入库需求",
    "legacyPath": "审批～客户入库需求",
    "actionPermissions": "查看页面、详情、处理",
    "dataPermission": "根据当前登录用户针对对应任务的权限决定；",
    "changeNote": "5.4.3版本取消",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "11",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "客户需求审批",
      "客户入库预约"
    ],
    "pagePath": "审批中心 / 客户需求审批 / 客户入库预约",
    "legacyPath": "",
    "actionPermissions": "查看页面、查看详情、去处理",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "2026-05-13",
    "updatedAt": ""
  },
  {
    "id": "12",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "审批中心",
      "客户需求审批",
      "客户出库需求"
    ],
    "pagePath": "审批中心 / 客户需求审批 / 客户出库需求",
    "legacyPath": "审批～客户出库需求",
    "actionPermissions": "查看页面、详情、处理",
    "dataPermission": "根据当前登录用户针对对应任务的权限决定；",
    "changeNote": "5.4.3版本取消",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "13",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "客户需求审批",
      "客户出库预约"
    ],
    "pagePath": "审批中心 / 客户需求审批 / 客户出库预约",
    "legacyPath": "",
    "actionPermissions": "查看页面、查看详情、去处理",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "2026-05-13",
    "updatedAt": ""
  },
  {
    "id": "14",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "客户需求审批",
      "客户融资需求"
    ],
    "pagePath": "审批中心 / 客户需求审批 / 客户融资需求",
    "legacyPath": "审批～客户融资需求",
    "actionPermissions": "查看页面、详情、驳回（操作权限+数据状态为未分配可用）、分配/再次分配、审核记录、任务详情、任务驳回、任务分配",
    "dataPermission": "·有融资申请审核权限的账号可看到所有融资申请信息 ·根据登录账号针对具体任务的操作权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "15",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "客户需求审批",
      "融资尽调"
    ],
    "pagePath": "审批中心 / 客户需求审批 / 融资尽调",
    "legacyPath": "",
    "actionPermissions": "查看页面、查看详情、尽调办理",
    "dataPermission": "",
    "changeNote": "仅作为联登智风控入口，联登成功后跳转到智风控平台任务列表页面",
    "createdAt": "2026-05-12",
    "updatedAt": ""
  },
  {
    "id": "16",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "客户需求审批",
      "客户销售需求"
    ],
    "pagePath": "审批中心 / 客户需求审批 / 客户销售需求",
    "legacyPath": "审批～客户销售需求",
    "actionPermissions": "查看页面、详情、处理、审核记录、任务详情、任务处理、查看详情",
    "dataPermission": "·有菜单权限的账号可看到所有线索； ·登录账号的操作权限决定操作权限，且 去处理 按钮还需要根据线索审核状态为已处理则不允许再次处理",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "17",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "客户需求审批",
      "客户采购需求"
    ],
    "pagePath": "审批中心 / 客户需求审批 / 客户采购需求",
    "legacyPath": "审批～客户采购需求",
    "actionPermissions": "查看页面、详情、处理、审核记录、任务详情、任务处理、查看详情",
    "dataPermission": "·有菜单权限的账号可看到所有采购需求申请； ·登录账号的操作权限决定操作权限，且 去处理 按钮还需要根据采购需求申请审核状态为已处理则不允许再次处理",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "18",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "其他审批",
      "政策资讯审核"
    ],
    "pagePath": "审批中心 / 其他审批 / 政策资讯审核",
    "legacyPath": "审批～政策资讯审核",
    "actionPermissions": "查看页面、详情、处理、审核记录、任务详情、任务处理、查看详情",
    "dataPermission": "·有菜单权限的账号可看到所有线索； ·登录账号的操作权限决定操作权限，且 去处理 按钮还需要根据资讯审核状态为已处理则不允许再次处理",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "19",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "其他审批",
      "开锁审核"
    ],
    "pagePath": "审批中心 / 其他审批 / 开锁审核",
    "legacyPath": "审批～开锁审核",
    "actionPermissions": "查看页面、详情、通过、驳回、审核记录、查看详情、去处理",
    "dataPermission": "须为 eligible 审批人且具备门禁仓库数据权限；列表按租户与仓库过滤",
    "changeNote": "6.2 新增；不进常规待处理池",
    "createdAt": "2026-08-25",
    "updatedAt": "2026-08-31"
  },
  {
    "id": "20",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "审批中心",
      "其他审批",
      "贷中风控处理"
    ],
    "pagePath": "审批中心 / 其他审批 / 贷中风控处理",
    "legacyPath": "",
    "actionPermissions": "查看页面、查看详情、去处理",
    "dataPermission": "",
    "changeNote": "仅作为联登智风控入口，联登成功后跳转到智风控平台任务列表页面",
    "createdAt": "2026-05-12",
    "updatedAt": ""
  },
  {
    "id": "21",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "数据一览",
      "客户总数",
      "客户数"
    ],
    "pagePath": "数据一览 / 客户总数 / 客户数",
    "legacyPath": "项目管理～监管档案货主列表",
    "actionPermissions": "查看页面、详情、客户总数、数据报表、监管单信息",
    "dataPermission": "仓库权限；客户总数与监管单信息对平台运营方、仓储服务方开放；整体运营数据（仓库数量、融资金额等）仅平台运营方可见",
    "changeNote": "2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "22",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "数据一览",
      "数据报表"
    ],
    "pagePath": "数据一览 / 数据报表",
    "legacyPath": "工作台（上部分）",
    "actionPermissions": "此处仅限制是否可见该功能板块、客户总数、数据报表、监管单信息",
    "dataPermission": "",
    "changeNote": "数据一览回归工作中心口径",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "23",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "外链平台"
    ],
    "pagePath": "外链平台",
    "legacyPath": "-",
    "actionPermissions": "查看页面、查看详情",
    "dataPermission": "账号所在的机构",
    "changeNote": "菜单更名",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "24",
    "platform": "PC",
    "module": "1.工作中心",
    "topBarModuleLabel": "工作中心",
    "menuModuleCode": "01-工作中心",
    "baselineModuleDir": "B端PC/01-工作中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "数据走势"
    ],
    "pagePath": "数据走势",
    "legacyPath": "工作台（下部们）",
    "actionPermissions": "此处仅限制是否可见该功能板块、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "菜单更名",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "25",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "库存查询",
      "存货管理"
    ],
    "pagePath": "库存查询 / 存货管理",
    "legacyPath": "货物管理～存货管理",
    "actionPermissions": "查看页面、存货详情、批量导出、导出记录",
    "dataPermission": "1、可见数据为账号上赋予的仓库权限决定；2、货品价格为登录账号归属机构设置的单价；3、组合导出全量为权限内全量，不受当前列表筛选（明细 Sheet 同「仅查看有库存的」）",
    "changeNote": "6.3 P1：跨菜单批量导出弹窗（本菜单/其他菜单，默认仅本菜单）；与库存明细、库存流水共用导出记录队列；跨多类菜单为 zip",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-04"
  },
  {
    "id": "26",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "库存查询",
      "理货堆放"
    ],
    "pagePath": "库存查询 / 理货堆放",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、理货堆放、拆分",
    "dataPermission": "仓库权限",
    "changeNote": "",
    "createdAt": "2026-04-14",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "27",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "库存查询",
      "库存明细"
    ],
    "pagePath": "库存查询 / 库存明细",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、批量导出、导出记录",
    "dataPermission": "仓库权限；组合导出全量为权限内仍有库存余量的明细，不受当前列表筛选",
    "changeNote": "6.3 P1：新增批量导出与导出记录；跨菜单组合导出与存货管理、库存流水共用任务队列",
    "createdAt": "2026-04-14",
    "updatedAt": "2026-11-04"
  },
  {
    "id": "28",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "库存查询",
      "库存流水"
    ],
    "pagePath": "库存查询 / 库存流水",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、批量导出、导出记录",
    "dataPermission": "仓库权限；组合导出全量为权限内流水全量，不受当前列表筛选（与行级【下载记录】区分）",
    "changeNote": "6.3 P1：新增批量导出与导出记录；跨菜单组合导出与存货管理、库存明细共用任务队列",
    "createdAt": "",
    "updatedAt": "2026-11-04"
  },
  {
    "id": "29",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓单管理"
    ],
    "pagePath": "仓单管理",
    "legacyPath": "仓单管理～仓单管理",
    "actionPermissions": "查看页面、详情、仓单开立、下载（列表下载及变更记录中的下载）、货物移除、变更记录、仓单补货、仓单出库、仓单移库、仓单注销、查看详情、下载、仓单入库",
    "dataPermission": "1、开立申请可选仓库为账号权限内的仓库； 2、可见数据为账号上赋予的仓库权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "30",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "货权管理",
      "货权档案"
    ],
    "pagePath": "货权管理 / 货权档案",
    "legacyPath": "货权管理～货权档案",
    "actionPermissions": "查看页面、详情、移交档案、确认结束、批量移交、档案详情、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定； 档案移交人员的列表为当前子机构下的所有人员清单 (只展示同级机构，上一级机构和下一级机构都无法展示)",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "31",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "货权管理",
      "货权公示"
    ],
    "pagePath": "货权管理 / 货权公示",
    "legacyPath": "货权管理～货权公示",
    "actionPermissions": "查看页面、生成系统货权牌、生成中仓登货权牌、中登网登记、公示页面、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "32",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "货权管理",
      "证据管理"
    ],
    "pagePath": "货权管理 / 证据管理",
    "legacyPath": "货权管理～证据管理",
    "actionPermissions": "查看页面、存证报告、原文件、货物详情、导出、生成系统货权牌、生成中仓登货权牌、中登网登记、公示页面、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "33",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "入库管理",
      "入库申请"
    ],
    "pagePath": "入库管理 / 入库申请",
    "legacyPath": "货物管理～入库申请",
    "actionPermissions": "查看页面、详情、新增入库、撤销入库、操作记录",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3 原型已交付入库申请；0504 线上曾取消菜单，6.3 与入库记录双轨",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-19"
  },
  {
    "id": "34",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "入库管理",
      "入库记录"
    ],
    "pagePath": "入库管理 / 入库记录",
    "legacyPath": "货物管理～入库记录",
    "actionPermissions": "查看页面、详情、新增入库、分配二维码、下载记录、单据下载、快速添加货主",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3 P0：合作方货主快捷建档（R03）；暂存登记暂定开发，R32 随迭代放开",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-19"
  },
  {
    "id": "35",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储/10-入库管理-入库暂存登记",
    "recordStatus": "6.3-target",
    "pagePathSegments": [
      "入库管理",
      "入库暂存登记"
    ],
    "pagePath": "入库管理 / 入库暂存登记",
    "legacyPath": "货物管理～入库暂存登记",
    "actionPermissions": "查看页面、新增登记、编辑、转为正式入库、作废",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3 暂定开发：三件套已定，菜单/路由随研发迭代放开",
    "createdAt": "2026-10-14",
    "updatedAt": "2026-10-19"
  },
  {
    "id": "36",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "出库管理",
      "出库申请"
    ],
    "pagePath": "出库管理 / 出库申请",
    "legacyPath": "货物管理～出库申请",
    "actionPermissions": "查看页面、详情、新增出库、撤销出库、操作记录",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "0504：取消出库申请菜单",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "37",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "出库管理",
      "出库记录"
    ],
    "pagePath": "出库管理 / 出库记录",
    "legacyPath": "货物管理～出库记录",
    "actionPermissions": "查看页面、详情、新增出库、下载记录、单据下载、快速添加提货经办人",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3 P0：货主信息域仅选已有档案（无货主快捷建档·O05）；提货人信息域+O06a",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-20"
  },
  {
    "id": "38",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "移库管理",
      "移库申请"
    ],
    "pagePath": "移库管理 / 移库申请",
    "legacyPath": "货物管理～移库申请",
    "actionPermissions": "查看详情、详情、新增移库、撤销移库、操作记录",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "0504：取消移库申请菜单",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "39",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "移库管理",
      "移库记录"
    ],
    "pagePath": "移库管理 / 移库记录",
    "legacyPath": "货物管理～移库记录",
    "actionPermissions": "查看页面、详情、下载记录、单据下载、新增移库、撤销移库、操作记录、移库详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "0504：移库申请入口修改、详情页面优化",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "40",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "货物转让",
      "转让申请"
    ],
    "pagePath": "货物转让 / 转让申请",
    "legacyPath": "货物管理～转让申请",
    "actionPermissions": "查看页面、详情、新增转让、撤销转让",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "0504：取消转让申请菜单",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "41",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "货物转让",
      "转让记录"
    ],
    "pagePath": "货物转让 / 转让记录",
    "legacyPath": "货物管理～转让记录",
    "actionPermissions": "查看页面、详情、新增转让、撤销转让",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3 P0：货主信息域引用/挂接；转让生效执行 P02（无接收方/待生效）",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-20"
  },
  {
    "id": "42",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "货物异动",
      "异动申请"
    ],
    "pagePath": "货物异动 / 异动申请",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增异动、撤销异动、操作记录",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "0504：取消移动申请菜单",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "43",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "货物异动",
      "异动记录"
    ],
    "pagePath": "货物异动 / 异动记录",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增异动、撤销异动、操作记录、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "0504：异动申请入口修改、详情页面优化",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "44",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "加工管理",
      "加工记录"
    ],
    "pagePath": "加工管理 / 加工记录",
    "legacyPath": "",
    "actionPermissions": "查看页面、详情、新增加工、撤销加工、完成加工、作废、操作记录、新增",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": "45",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "提货单"
    ],
    "pagePath": "提货单",
    "legacyPath": "货物管理～提货单",
    "actionPermissions": "查看页面、详情、取消提货、重置提货码、提货码核销、操作记录、确认提货、查看详情、核销提货码",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3 P0：提货人引用合作方，支持身份证/手机号检索",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-09-20"
  },
  {
    "id": "46",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "货物盘点"
    ],
    "pagePath": "货物盘点",
    "legacyPath": "货物管理～货物盘点",
    "actionPermissions": "查看页面、详情、生成报告、生成记录、异常处理、新增盘点、撤销盘点、查看详情、去盘点",
    "dataPermission": "1.可见数据根据当前登录账号的角色的【仓库】权限决定； 2.解除异常根据配置的权限决定",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "47",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "设备管理",
      "监控设备"
    ],
    "pagePath": "设备管理 / 监控设备",
    "legacyPath": "设备管理～监控设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、查看直播、查看回放、图像锚点、移除设备",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备所有登录账号可见",
    "changeNote": "【6.2目标态】迁至 物联网IOT与预警 / 物联网IOT管理 / 监控设备；【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/01-物联网IOT管理/01监控设备",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "48",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "设备管理",
      "门禁设备"
    ],
    "pagePath": "设备管理 / 门禁设备",
    "legacyPath": "设备管理～门禁设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、设备数据、获取密码、移除设备、人脸管理",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备所有登录账号可见",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/01-物联网IOT管理/02门禁设备",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "49",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "设备管理",
      "物联设备"
    ],
    "pagePath": "设备管理 / 物联设备",
    "legacyPath": "设备管理～物联设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、设备数据、移除设备",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备所有登录账号可见",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/01-物联网IOT管理/03物联设备",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "50",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "设备管理",
      "GPS设备"
    ],
    "pagePath": "设备管理 / GPS设备",
    "legacyPath": "设备管理～GPS设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、实时定位、运动轨迹、移除设备、GPS平台规则配置、GPS平台基础数据",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备所有登录账号可见",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/01-物联网IOT管理/04GPS设备",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "51",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "设备管理",
      "门禁事务记录"
    ],
    "pagePath": "设备管理 / 门禁事务记录",
    "legacyPath": "设备管理～门禁事务记录",
    "actionPermissions": "查看页面",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备事务记录所有登录账号可见",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "52",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "设备管理",
      "人脸配置"
    ],
    "pagePath": "设备管理 / 人脸配置",
    "legacyPath": "设备管理～人脸配置",
    "actionPermissions": "查看(页面)、上传人脸、分配门禁",
    "dataPermission": "1.分配门禁用：仓库权限可见 2.人员列表：机构数据权限",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/01-物联网IOT管理/05人脸配置",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "53",
    "platform": "PC",
    "module": "3.仓储",
    "topBarModuleLabel": "仓储",
    "menuModuleCode": "03-仓储",
    "baselineModuleDir": "B端PC/03-仓储",
    "recordStatus": "active",
    "pagePathSegments": [
      "合同管理",
      "仓储合同管理"
    ],
    "pagePath": "合同管理 / 仓储合同管理",
    "legacyPath": "合同管理～合同列表",
    "actionPermissions": "查看页面、合同下载、下载记录",
    "dataPermission": "1、合同创建人账号归属机构为该份合同的归属机构； 2、C端产生的合同挂靠顶级机构； 3、登录账号有对应数据权限可查看权限内数据；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "54",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资管理",
      "客户融资需求线索"
    ],
    "pagePath": "融资管理 / 客户融资需求线索",
    "legacyPath": "审批～监管委托受理 原审批～客户融资需求",
    "actionPermissions": "查看页面、详情、驳回（操作权限+数据状态为未分配可用）、分配/再次分配、审核记录、任务详情、任务驳回、任务分配",
    "dataPermission": "·有融资申请审核权限的账号可看到所有融资申请信息 ·根据登录账号针对具体任务的操作权限决定；",
    "changeNote": "原审批～客户融资需求 1.门户端的C端用户发起的融资信息 2.平台方：融资客户线索分配给资方",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "55",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资管理",
      "客户融资尽调办理"
    ],
    "pagePath": "融资管理 / 客户融资尽调办理",
    "legacyPath": "",
    "actionPermissions": "查看页面、查看详情、拒绝、分配任务转交、发起尽调、客户尽调记录、分配给资方、重新尽调、任务详情、任务拒绝、任务分配、下载资料、尽调办理、去处理",
    "dataPermission": "1、可见数据根据当前登录账号角色的数据权限决定； 2、分配时可选机构为登录账号归属机构上配置的合作机构 + 本机构所有启用的人员账号；",
    "changeNote": "客户尽调记录仅作为联登智风控入口，联登成功后跳转到智风控平台运营统计列表页面",
    "createdAt": "2026-05-11",
    "updatedAt": ""
  },
  {
    "id": "56",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资管理",
      "客户融资授信办理"
    ],
    "pagePath": "融资管理 / 客户融资授信办理",
    "legacyPath": "需求管理～监管委托需求",
    "actionPermissions": "查看(页面)、详情、驳回（操作权限+数据状态为未分配可用）、分配/再次分配任务转交、审核记录、融资详情、融资分配、状态管理、导出为Excel、查看详情、授信办理、授信审批、授信记录、授信确认、查看授信",
    "dataPermission": "1、可见数据根据当前登录账号角色的数据权限决定； 2、分配时可选机构为登录账号归属机构上配置的合作机构 + 本机构所有启用的人员账号；",
    "changeNote": "原：需求管理～监管委托需求：用于银行内部管理与分配。（注：不能有发起抵质押申请的按钮【抵质押信息确认】）",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "57",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资管理",
      "被拒退回记录池"
    ],
    "pagePath": "融资管理 / 被拒退回记录池",
    "legacyPath": "被拒退回记录池",
    "actionPermissions": "查看（页面）、重新尽调、重新分配给资方、查看详情、重新分配资方",
    "dataPermission": "1、可见数据根据当前登录账号角色的数据权限决定； 2、分配时可选机构为登录账号归属机构上配置的合作机构 + 本机构所有启用的人员账号；",
    "changeNote": "登录账号数据权限内的数据",
    "createdAt": "2026-07-28",
    "updatedAt": "2026-07-28"
  },
  {
    "id": "58",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资管理",
      "线上监管业务办理"
    ],
    "pagePath": "融资管理 / 线上监管业务办理",
    "legacyPath": "需求管理～监管委托需求",
    "actionPermissions": "查看(页面)、详情、分配、状态管理、20250627修改发起抵/质押、抵/质押信息确认、20250702新增：导出为Excel、监管业务信息确认、导出为Excel、业务办理、业务发起、办理记录",
    "dataPermission": "1、可见数据根据当前登录账号角色的数据权限决定； 2、分配时可选机构为登录账号归属机构上配置的合作机构 + 本机构所有启用的人员账号；",
    "changeNote": "同上页面路径，只有状态为申请成功的单据，操作中只有【抵质押信息确认】按钮",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "59",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管业务",
      "监管管理",
      "抵押订单"
    ],
    "pagePath": "监管业务 / 监管管理 / 抵押订单",
    "legacyPath": "项目管理～抵质押监管订单（无开立按钮）",
    "actionPermissions": "查看页面、导出、操作记录、资料管理、资料上传、置换抵/质押、加/补仓、出库、解抵/质押、货物估值、货物盘点、盘点报告、移库、查看监控、平仓、查看风险、设备管理、贷款结果录入、查看详情、监管报告（撤销申请、下载报告、重新申请、生成盘点监管报告、查看报告）、部分结清、安全线管理、货物异动、抵押入库、日常监管、风险公示、加工管理、资料管理（上传资料）、监管报告（撤销申请/下载报告/查看详情/重新申请/生成盘点监管报告/查看报告）、部分结清查看、风险公示查看",
    "dataPermission": "数据权限：根据当前登录账号的角色的数据权限决定【任务发起人及任务处理人可看到相关信息，其他无关人员需要有对应数据所属机构的数据权限才能看到】； 盘点 - 盘点人只能盘点自己有仓库权限的货物 当针对没有仓库权限的货物点击扫码盘点 操作记录 - 能看到这笔抵/质押单，就能看到这笔抵/质押单的全部操作记录； 资金服务方仅保留贷款结果录入/服务结果录入、部分结清/服务结算查看与风险公示查看；仓储服务方仅保留保管责任货位查验与监控查看",
    "changeNote": "2026-11-10 按TSV拆分监管订单页",
    "createdAt": "2026-09-11",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "60",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管业务",
      "监管管理",
      "质押订单"
    ],
    "pagePath": "监管业务 / 监管管理 / 质押订单",
    "legacyPath": "项目管理～抵质押监管订单（无开立按钮）",
    "actionPermissions": "查看页面、导出、操作记录、资料管理、资料上传、置换抵/质押、加/补仓、出库、解抵/质押、货物估值、货物盘点、盘点报告、移库、查看监控、平仓、查看风险、设备管理、贷款结果录入、查看详情、监管报告（撤销申请、下载报告、重新申请、生成盘点监管报告、查看报告）、部分结清、安全线管理、货物异动、质押入库、日常监管、风险公示、加工管理、资料管理（上传资料）、监管报告（撤销申请/下载报告/查看详情/重新申请/生成盘点监管报告/查看报告）、部分结清查看、风险公示查看",
    "dataPermission": "数据权限：根据当前登录账号的角色的数据权限决定【任务发起人及任务处理人可看到相关信息，其他无关人员需要有对应数据所属机构的数据权限才能看到】； 盘点 - 盘点人只能盘点自己有仓库权限的货物 当针对没有仓库权限的货物点击扫码盘点 操作记录 - 能看到这笔抵/质押单，就能看到这笔抵/质押单的全部操作记录； 资金服务方仅保留贷款结果录入/服务结果录入、部分结清/服务结算查看与风险公示查看；仓储服务方仅保留保管责任货位查验与监控查看",
    "changeNote": "2026-11-10 按TSV拆分监管订单页",
    "createdAt": "2026-09-11",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "61",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管业务",
      "监管管理",
      "监管服务订单"
    ],
    "pagePath": "监管业务 / 监管管理 / 监管服务订单",
    "legacyPath": "项目管理～抵质押监管订单（无开立按钮）",
    "actionPermissions": "查看页面、导出、操作记录、资料管理、资料上传、置换抵/质押、加/补仓、出库、解抵/质押、货物估值、货物盘点、盘点报告、移库、查看监控、平仓、查看风险、设备管理、服务结果录入、查看详情、监管报告（撤销申请、下载报告、重新申请、生成盘点监管报告、查看报告）、部分结清、安全线管理、货物异动、监管服务入库、日常监管、风险公示、加工管理、资料管理（上传资料）、监管报告（撤销申请/下载报告/查看详情/重新申请/生成盘点监管报告/查看报告）、服务结算、服务结算查看、风险公示查看",
    "dataPermission": "数据权限：根据当前登录账号的角色的数据权限决定【任务发起人及任务处理人可看到相关信息，其他无关人员需要有对应数据所属机构的数据权限才能看到】； 盘点 - 盘点人只能盘点自己有仓库权限的货物 当针对没有仓库权限的货物点击扫码盘点 操作记录 - 能看到这笔抵/质押单，就能看到这笔抵/质押单的全部操作记录； 资金服务方仅保留贷款结果录入/服务结果录入、部分结清/服务结算查看与风险公示查看；仓储服务方仅保留保管责任货位查验与监控查看",
    "changeNote": "2026-11-10 按TSV拆分监管订单页",
    "createdAt": "2026-09-11",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "62",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "监管业务",
      "供应链监管业务"
    ],
    "pagePath": "监管业务 / 供应链监管业务",
    "legacyPath": "项目管理～供应链监管订单",
    "actionPermissions": "监管订单： 查看（页面）、导出为excel、操作记录、查看资料、结算管理 更多操作-加/补仓、提货、解监管、平仓、货物盘点、盘点报告、查看监控、查看风险、设备管理（更多操作对应权限内的操作按钮还需根据订单关联的总流程内是否配置对应子流程决定最终是否展示，包含 加/补仓、提货、解监管、货物估值、平仓）、20280804新增 查看详情（查看抵质押详情）、20250801新增03-2版本内容：监管报告、监管报告-查看详情、监管报告-查看报告、监管报告-下载报告、监管报告-生成盘点监管报告",
    "dataPermission": "数据权限：根据当前登录账号的角色的数据权限决定【任务发起人及任务处理人可看到相关信息，其他无关人员需要有对应数据所属机构的数据权限才能看到】； 盘点 - 盘点人只能盘点自己有仓库权限的货物 当针对没有仓库权限的货物点击扫码盘点 操作记录 - 能看到这笔抵/质押单，就能看到这笔抵/质押单的全部操作记录",
    "changeNote": "",
    "createdAt": "2026-09-11",
    "updatedAt": "2026-09-11"
  },
  {
    "id": "63",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "合同管理",
      "融资合同管理"
    ],
    "pagePath": "合同管理 / 融资合同管理",
    "legacyPath": "合同管理～合同列表（复用页面）",
    "actionPermissions": "查看(页面)、下载、下载记录、合同下载",
    "dataPermission": "1、合同创建人账号归属机构为该份合同的归属机构； 2、C端产生的合同挂靠顶级机构； 3、登录账号有对应数据权限可查看权限内数据；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "64",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "货权管理",
      "货权档案"
    ],
    "pagePath": "货权管理 / 货权档案",
    "legacyPath": "和仓储板块的相同，完全一致（复用页面）",
    "actionPermissions": "查看页面、详情、移交档案、确认结束、批量移交、档案详情、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定； 档案移交人员的列表为当前子机构下的所有人员清单 (只展示同级机构，上一级机构和下一级机构都无法展示)",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "65",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "货权管理",
      "货权公示"
    ],
    "pagePath": "货权管理 / 货权公示",
    "legacyPath": "",
    "actionPermissions": "查看页面、生成系统货权牌、生成中仓登货权牌、中登网登记、公示页面、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "66",
    "platform": "PC",
    "module": "4.融资/监管",
    "topBarModuleLabel": "融资/监管",
    "menuModuleCode": "04-融资监管",
    "baselineModuleDir": "B端PC/04-融资监管",
    "recordStatus": "active",
    "pagePathSegments": [
      "货权管理",
      "证据管理"
    ],
    "pagePath": "货权管理 / 证据管理",
    "legacyPath": "",
    "actionPermissions": "查看页面、存证报告、原文件、货物详情、导出、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "67",
    "platform": "PC",
    "module": "5.交易",
    "topBarModuleLabel": "交易",
    "menuModuleCode": "05-交易",
    "baselineModuleDir": "B端PC/05-交易",
    "recordStatus": "active",
    "pagePathSegments": [
      "采购需求管理"
    ],
    "pagePath": "采购需求管理",
    "legacyPath": "需求管理～采购需求管理",
    "actionPermissions": "查看页面、详情、下架",
    "dataPermission": "1、所有数据挂靠顶级机构； 2、登录账号有对应机构的数据权限可看；",
    "changeNote": "按TSV口径调整菜单",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "68",
    "platform": "PC",
    "module": "5.交易",
    "topBarModuleLabel": "交易",
    "menuModuleCode": "05-交易",
    "baselineModuleDir": "B端PC/05-交易",
    "recordStatus": "active",
    "pagePathSegments": [
      "销售需求管理"
    ],
    "pagePath": "销售需求管理",
    "legacyPath": "需求管理～销售需求管理",
    "actionPermissions": "查看页面、详情、线索下架、线索跟进、线索详情",
    "dataPermission": "1、所有数据挂靠顶级机构； 2、登录账号有对应机构的数据权限可看；",
    "changeNote": "按TSV口径调整菜单",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "69",
    "platform": "PC",
    "module": "5.交易",
    "topBarModuleLabel": "交易",
    "menuModuleCode": "05-交易",
    "baselineModuleDir": "B端PC/05-交易",
    "recordStatus": "active",
    "pagePathSegments": [
      "合同管理",
      "销售合同管理"
    ],
    "pagePath": "合同管理 / 销售合同管理",
    "legacyPath": "合同管理～合同列表（复用页面）",
    "actionPermissions": "查看(页面)、下载、下载记录、合同下载",
    "dataPermission": "1、合同创建人账号归属机构为该份合同的归属机构； 2、C端产生的合同挂靠顶级机构； 3、登录账号有对应数据权限可查看权限内数据；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "70",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "客户管理"
    ],
    "pagePath": "客户管理",
    "legacyPath": "客户管理～客户列表 （负责交易数据的客户）",
    "actionPermissions": "查看页面、详情、导出为Excel、客户详情",
    "dataPermission": "1、挂靠顶级机构； 2、有功能权限可看；",
    "changeNote": "6.3 P0：保留菜单，增加客户账号与合作方主体绑定",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-09-20"
  },
  {
    "id": "71",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心/01-合作方档案/04-1-货主信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "合作方档案",
      "货主信息"
    ],
    "pagePath": "合作方档案 / 货主信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增档案、编辑、补全资料、追加合作档案角色、冻结/解冻、导出审计日志、新增货主、追加、验证联系手机",
    "dataPermission": "按菜单独立授权；可见数据根据登录账号角色与数据权限决定",
    "changeNote": "6.3 新增：统一合作方主数据四子菜单（方案 B；本菜单唯一规则 R01）",
    "createdAt": "2026-10-20",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "72",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心/01-合作方档案/04-2-提货人信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "合作方档案",
      "提货人信息"
    ],
    "pagePath": "合作方档案 / 提货人信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增档案、编辑、补全资料、追加合作档案角色、冻结/解冻、导出审计日志、新增提货人、追加、验证联系手机",
    "dataPermission": "按菜单独立授权；可见数据根据登录账号角色与数据权限决定",
    "changeNote": "6.3 新增：统一合作方主数据四子菜单（方案 B；本菜单唯一规则 R01）",
    "createdAt": "2026-10-20",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "73",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心/01-合作方档案/04-3-资金方信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "合作方档案",
      "资金方信息"
    ],
    "pagePath": "合作方档案 / 资金方信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增档案、编辑、补全资料、追加合作档案角色、冻结/解冻、导出审计日志、新增资金方、追加、验证联系手机",
    "dataPermission": "按菜单独立授权；可见数据根据登录账号角色与数据权限决定",
    "changeNote": "6.3 新增：统一合作方主数据四子菜单（方案 B；本菜单唯一规则 R01）",
    "createdAt": "2026-10-20",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "74",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心/01-合作方档案/04-4-服务方信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "合作方档案",
      "服务方信息"
    ],
    "pagePath": "合作方档案 / 服务方信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增档案、编辑、补全资料、追加合作档案角色、冻结/解冻、导出审计日志、新增服务方、追加、验证联系手机、新增资金方",
    "dataPermission": "按菜单独立授权；可见数据根据登录账号角色与数据权限决定",
    "changeNote": "6.3 新增：统一合作方主数据四子菜单（方案 B；本菜单唯一规则 R01）",
    "createdAt": "2026-10-20",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "75",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管档案",
      "仓库"
    ],
    "pagePath": "监管档案 / 仓库",
    "legacyPath": "项目管理～监管档案～仓库",
    "actionPermissions": "查看页面、详情、待提货、新增入库、新增出库、新增移库、货物转让、仓单开立、抵押单开立、质押单开立、新增异动、查看详情、导出、监库核验",
    "dataPermission": "仓库权限",
    "changeNote": "监管档案归入用户中心；功能按钮与TSV对齐；补齐新增异动按钮",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "76",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管档案",
      "货物"
    ],
    "pagePath": "监管档案 / 货物",
    "legacyPath": "项目管理～监管档案～货物",
    "actionPermissions": "查看页面、详情、待提货、新增入库、新增出库、新增移库、货物转让、仓单开立、抵押单开立、质押单开立、新增异动、查看详情、导出、货物核验",
    "dataPermission": "仓库权限",
    "changeNote": "监管档案归入用户中心；功能按钮与TSV对齐；补齐新增异动按钮",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "77",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管档案",
      "仓单管理"
    ],
    "pagePath": "监管档案 / 仓单管理",
    "legacyPath": "项目管理～监管档案～仓单管理",
    "actionPermissions": "查看页面、详情、仓单出库、仓单开立、变更记录、仓单补货、仓单移库、仓单移除、仓单注销、仓单入库、查看详情、操作记录、导出、质押锁定核验、在押仓单查验",
    "dataPermission": "仓库权限",
    "changeNote": "监管档案归入用户中心；功能按钮与TSV对齐；补齐仓单入库按钮",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "78",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管档案",
      "抵押单管理"
    ],
    "pagePath": "监管档案 / 抵押单管理",
    "legacyPath": "项目管理～监管档案～抵押单管理",
    "actionPermissions": "查看页面、详情、操作记录、货物出库、查看资料、查看风险、置换抵押、加/补仓、解抵押、货物估值、货物盘点、盘点报告、移库、查看监控、平仓、设备管理、贷款结果录入、查看详情、监管报告（撤销申请、下载报告、重新申请、生成盘点监管报告、查看报告）、部分结清、安全线管理、货物异动、抵押入库、日常监管、风险公示、加工管理、资料管理（上传资料）、监管报告（撤销申请/下载报告/查看详情/重新申请/生成盘点监管报告/查看报告）、出库、全量查看详情、导出、风险公示查看、监管报告查看、保管责任货位查验、部分结清查看",
    "dataPermission": "订单数据权限",
    "changeNote": "2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围；监管档案归入用户中心；功能按钮与TSV对齐",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "79",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管档案",
      "质押单管理"
    ],
    "pagePath": "监管档案 / 质押单管理",
    "legacyPath": "项目管理～监管档案～质押单管理",
    "actionPermissions": "查看页面、详情、操作记录、货物出库、查看资料、查看风险、置换质押、加/补仓、解质押、货物估值、货物盘点、盘点报告、移库、查看监控、平仓、设备管理、贷款结果录入、查看详情、监管报告（撤销申请、下载报告、重新申请、生成盘点监管报告、查看报告）、部分结清、安全线管理、货物异动、质押入库、日常监管、风险公示、加工管理、资料管理（上传资料）、监管报告（撤销申请/下载报告/查看详情/重新申请/生成盘点监管报告/查看报告）、出库、全量查看详情、导出、风险公示查看、监管报告查看、保管责任货位查验、部分结清查看",
    "dataPermission": "订单数据权限",
    "changeNote": "2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围；监管档案归入用户中心；功能按钮与TSV对齐",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "80",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管档案",
      "设备预警管理"
    ],
    "pagePath": "监管档案 / 设备预警管理",
    "legacyPath": "项目管理～监管档案～设备预警管理",
    "actionPermissions": "查看页面、详情、查看详情、全量查看、现场设备排查、解除预警、现场核实、结案处置",
    "dataPermission": "仓库权限",
    "changeNote": "监管档案归入用户中心；功能按钮与TSV对齐",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "81",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管档案",
      "订单预警管理"
    ],
    "pagePath": "监管档案 / 订单预警管理",
    "legacyPath": "项目管理～监管档案～订单预警管理",
    "actionPermissions": "查看页面、详情、查看详情、全量查看、核实处置、联动解除、结案处理",
    "dataPermission": "订单数据权限",
    "changeNote": "监管档案归入用户中心；功能按钮与TSV对齐",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "82",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管档案",
      "记录管理"
    ],
    "pagePath": "监管档案 / 记录管理",
    "legacyPath": "项目管理～监管档案～记录管理",
    "actionPermissions": "查看页面、详情、全量查看详情、查看详情",
    "dataPermission": "仓库权限",
    "changeNote": "监管档案归入用户中心；功能按钮与TSV对齐",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "83",
    "platform": "PC",
    "module": "2.用户中心",
    "topBarModuleLabel": "用户中心",
    "menuModuleCode": "02-用户中心",
    "baselineModuleDir": "B端PC/02-用户中心",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管档案",
      "监管服务单管理"
    ],
    "pagePath": "监管档案 / 监管服务单管理",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、操作记录、资料管理、资料上传、置换抵押、加/补仓、解抵押、货物估值、货物盘点、盘点报告、移库、查看监控、平仓、查看风险、设备管理、服务结果录入、查看详情、监管报告（撤销申请、下载报告、重新申请、生成盘点监管报告、查看报告）、服务结算、出库、安全线管理、货物异动、抵押入库、日常监管、风险公示、加工管理、资料管理（上传资料）、监管报告（撤销申请/下载报告/查看详情/重新申请/生成盘点监管报告/查看报告）、全量查看详情、导出、风险公示查看、监管报告查看、保管责任货位查验、服务结算查看",
    "dataPermission": "订单数据权限",
    "changeNote": "2026-11-10 按角色权限研讨会口径补充监管服务单管理页",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "84",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "planned",
    "pagePathSegments": [
      "风控中心",
      "设备中心（新增）"
    ],
    "pagePath": "风控中心 / 设备中心（新增）",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "仓库权限",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "85",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控中心",
      "总机构风控管理看板"
    ],
    "pagePath": "风控中心 / 总机构风控管理看板",
    "legacyPath": "总机构报表看板～风控管理看板",
    "actionPermissions": "查看页面、全量全局查看",
    "dataPermission": "所有机构权限，所有仓库权限",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "86",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控中心",
      "机构风控管理看板"
    ],
    "pagePath": "风控中心 / 机构风控管理看板",
    "legacyPath": "机构报表看板～风控管理看板",
    "actionPermissions": "查看页面、全量数据看板、受托监管仓全量风控指标、质押率浮动、价格走势、风险敞口指标",
    "dataPermission": "根据账号机构权限展示订单预警数据，根据仓库权限展示设备预警数据",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "87",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控中心",
      "总机构数字仓库看板"
    ],
    "pagePath": "风控中心 / 总机构数字仓库看板",
    "legacyPath": "总机构报表看板～数字仓库看板 （合并链接分享记录功能）",
    "actionPermissions": "查看页面、分享、全量全局查看",
    "dataPermission": "平台运营方查看全部租户（总机构口径）",
    "changeNote": "2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "88",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控中心",
      "机构数字仓库看板"
    ],
    "pagePath": "风控中心 / 机构数字仓库看板",
    "legacyPath": "机构报表看板～数字仓库看板 （合并链接分享记录功能）",
    "actionPermissions": "查看页面、分享、全量数据看板、受托监管仓全量风控指标、质押率浮动、价格走势、风险敞口指标",
    "dataPermission": "按角色数据权限隔离：平台运营方看全量，监管服务方看受托监管仓库，资金服务方看价格走势与质押率等风险指标；仓储服务方不开通",
    "changeNote": "2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "89",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "风险信息",
      "设备预警信息"
    ],
    "pagePath": "风险信息 / 设备预警信息",
    "legacyPath": "风险管理～设备预警管理",
    "actionPermissions": "查看页面、详情、去处理（操作权限+预警状态为未处理）",
    "dataPermission": "仓库权限 登录账号仓库权限（未绑定具体位置的设备所有账号可见） 数据权限内的数据；",
    "changeNote": "【6.2目标态】迁至 物联网IOT与预警 / 预警信息 / 设备预警信息；【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/02-预警信息/01设备预警信息",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-05-28"
  },
  {
    "id": "90",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "风险信息",
      "押品预警信息"
    ],
    "pagePath": "风险信息 / 押品预警信息",
    "legacyPath": "风险管理～订单预警管理",
    "actionPermissions": "查看页面、详情、去查看、公示风险、批量公示风险（已处理数据下才展示）",
    "dataPermission": "订单数据权限 登录账号数据权限内的数据（可见订单则可见订单相关的预警消息）",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/02-预警信息/02押品预警信息",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-05-28"
  },
  {
    "id": "91",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "风险信息",
      "设备事务通知信息"
    ],
    "pagePath": "风险信息 / 设备事务通知信息",
    "legacyPath": "风险管理～设备事务通知管理",
    "actionPermissions": "查看(页面)、去处理",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备事务记录所有登录账号可见",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-05-28"
  },
  {
    "id": "92",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "风险信息",
      "贷中风控管理"
    ],
    "pagePath": "风险信息 / 贷中风控管理",
    "legacyPath": "风险管理~风险公示",
    "actionPermissions": "查看（页面）、查看详情、执行风控模型、批量执行",
    "dataPermission": "订单数据权限",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/02-预警信息/03贷中风控管理",
    "createdAt": "2026-05-12",
    "updatedAt": ""
  },
  {
    "id": "93",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "风险信息",
      "风险公示"
    ],
    "pagePath": "风险信息 / 风险公示",
    "legacyPath": "",
    "actionPermissions": "",
    "dataPermission": "订单数据权限 登录账号数据权限内的数据（可见订单则可见订单相关的预警消息）",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/02-预警信息/04风险公示",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": "94",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "planned",
    "pagePathSegments": [
      "风险信息",
      "巡检异常管理（新增）"
    ],
    "pagePath": "风险信息 / 巡检异常管理（新增）",
    "legacyPath": "-",
    "actionPermissions": "查看页面、处理、查看详情",
    "dataPermission": "1.有菜单权限的人可见所有数据 2.操作：去处理；当前用户被配置到处理异常任务的权限决定",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "95",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "planned",
    "pagePathSegments": [
      "巡检管理（新）",
      "巡检计划"
    ],
    "pagePath": "巡检管理（新） / 巡检计划",
    "legacyPath": "-",
    "actionPermissions": "查看页面、新增、编辑、停/启用、删除、查看详情",
    "dataPermission": "有菜单权限的人可见所有数据",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "96",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "planned",
    "pagePathSegments": [
      "巡检管理（新）",
      "巡检任务"
    ],
    "pagePath": "巡检管理（新） / 巡检任务",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情",
    "dataPermission": "有菜单权限的人可见所有数据",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "97",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "planned",
    "pagePathSegments": [
      "巡检管理（新）",
      "巡检结果"
    ],
    "pagePath": "巡检管理（新） / 巡检结果",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情",
    "dataPermission": "有菜单权限的人可见所有数据",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "98",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控中心",
      "总机构数字仓库看板",
      "链接分享记录"
    ],
    "pagePath": "风控中心 / 总机构数字仓库看板 / 链接分享记录",
    "legacyPath": "-",
    "actionPermissions": "查看页面、失效、全量全局查看",
    "dataPermission": "所有仓库权限",
    "changeNote": "2026-11-10 按TSV补齐链接分享记录",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "99",
    "platform": "PC",
    "module": "6.风控",
    "topBarModuleLabel": "风控",
    "menuModuleCode": "06-风控",
    "baselineModuleDir": "B端PC/06-风控",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控中心",
      "机构数字仓库看板",
      "链接分享记录"
    ],
    "pagePath": "风控中心 / 机构数字仓库看板 / 链接分享记录",
    "legacyPath": "-",
    "actionPermissions": "查看页面、失效、全量数据看板、数字仓库库容看板、受托监管仓全量风控指标、质押率浮动、价格走势、风险敞口指标",
    "dataPermission": "所有仓库权限",
    "changeNote": "2026-11-10 按TSV补齐链接分享记录",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "100",
    "platform": "PC",
    "module": "8.统计/看板",
    "topBarModuleLabel": "统计/看板",
    "menuModuleCode": "08-统计",
    "baselineModuleDir": "B端PC/08-统计",
    "recordStatus": "active",
    "pagePathSegments": [
      "总机构报表看板",
      "业务管理看板"
    ],
    "pagePath": "总机构报表看板 / 业务管理看板",
    "legacyPath": "总机构报表看板～业务管理看板",
    "actionPermissions": "查看页面、业务管理看板、资产管理看板、价格走势看板、查看详情",
    "dataPermission": "所有机构权限，所有仓库权限",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "101",
    "platform": "PC",
    "module": "8.统计/看板",
    "topBarModuleLabel": "统计/看板",
    "menuModuleCode": "08-统计",
    "baselineModuleDir": "B端PC/08-统计",
    "recordStatus": "active",
    "pagePathSegments": [
      "总机构报表看板",
      "资产管理看板"
    ],
    "pagePath": "总机构报表看板 / 资产管理看板",
    "legacyPath": "总机构报表看板～资产管理看板",
    "actionPermissions": "查看页面、业务管理看板、资产管理看板、价格走势看板、查看详情",
    "dataPermission": "所有机构权限，所有仓库权限",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "102",
    "platform": "PC",
    "module": "8.统计/看板",
    "topBarModuleLabel": "统计/看板",
    "menuModuleCode": "08-统计",
    "baselineModuleDir": "B端PC/08-统计",
    "recordStatus": "active",
    "pagePathSegments": [
      "总机构报表看板",
      "价格走势看板"
    ],
    "pagePath": "总机构报表看板 / 价格走势看板",
    "legacyPath": "总机构报表看板～资产管理看板",
    "actionPermissions": "查看页面、业务管理看板、资产管理看板、价格走势看板、查看详情",
    "dataPermission": "所有机构权限，所有仓库权限",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "103",
    "platform": "PC",
    "module": "8.统计/看板",
    "topBarModuleLabel": "统计/看板",
    "menuModuleCode": "08-统计",
    "baselineModuleDir": "B端PC/08-统计",
    "recordStatus": "active",
    "pagePathSegments": [
      "机构报表看板",
      "业务管理看板"
    ],
    "pagePath": "机构报表看板 / 业务管理看板",
    "legacyPath": "机构报表看板～业务管理看板",
    "actionPermissions": "查看页面、业务管理看板、资产管理看板、价格走势看板、查看详情",
    "dataPermission": "根据账号机构权限展示数据，根据仓库权限展示部分数据",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "104",
    "platform": "PC",
    "module": "8.统计/看板",
    "topBarModuleLabel": "统计/看板",
    "menuModuleCode": "08-统计",
    "baselineModuleDir": "B端PC/08-统计",
    "recordStatus": "active",
    "pagePathSegments": [
      "机构报表看板",
      "资产管理看板"
    ],
    "pagePath": "机构报表看板 / 资产管理看板",
    "legacyPath": "机构报表看板～资产管理看板",
    "actionPermissions": "查看页面、业务管理看板、资产管理看板、价格走势看板、查看详情",
    "dataPermission": "根据账号机构权限展示数据，根据仓库权限展示部分数据",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "105",
    "platform": "PC",
    "module": "8.统计/看板",
    "topBarModuleLabel": "统计/看板",
    "menuModuleCode": "08-统计",
    "baselineModuleDir": "B端PC/08-统计",
    "recordStatus": "active",
    "pagePathSegments": [
      "机构报表看板",
      "价格走势看板"
    ],
    "pagePath": "机构报表看板 / 价格走势看板",
    "legacyPath": "机构报表看板～资产管理看板",
    "actionPermissions": "查看页面、业务管理看板、资产管理看板、价格走势看板、查看详情",
    "dataPermission": "根据账号机构权限展示数据，根据仓库权限展示部分数据",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "106",
    "platform": "PC",
    "module": "9.结算",
    "topBarModuleLabel": "结算",
    "menuModuleCode": "09-结算",
    "baselineModuleDir": "B端PC/09-结算",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管结算",
      "项目结算管理"
    ],
    "pagePath": "监管结算 / 项目结算管理",
    "legacyPath": "项目管理～项目结算管理",
    "actionPermissions": "查看页面、详情、新增收入结算单、新增支出结算单、结算单编辑、结算单结算、结算单结清、结算单作废、结算记录、结算单下载、结算单详情",
    "dataPermission": "功能权限",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "107",
    "platform": "PC",
    "module": "9.结算",
    "topBarModuleLabel": "结算",
    "menuModuleCode": "09-结算",
    "baselineModuleDir": "B端PC/09-结算",
    "recordStatus": "active",
    "pagePathSegments": [
      "监管结算",
      "结算汇总"
    ],
    "pagePath": "监管结算 / 结算汇总",
    "legacyPath": "项目管理～结算汇总",
    "actionPermissions": "查看页面、结算汇总明细、结算汇总导出、结算汇总导出记录",
    "dataPermission": "功能权限",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "108",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "门户管理",
      "门户端配置"
    ],
    "pagePath": "门户管理 / 门户端配置",
    "legacyPath": "系统配置～门户端配置",
    "actionPermissions": "查看页面、编辑、配置编辑",
    "dataPermission": "1.频道参数子页面 - 展示的可选项均为平台端赋予该机构的权限，不可展示非权限外的选项； 2.Banner配置子页面 - 展示的频道为平台端赋予该机构的权限内的频道，且展示的频道若在频道参数配置中已重命名此处名字将被同步修改；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "109",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "门户管理",
      "政策资讯"
    ],
    "pagePath": "门户管理 / 政策资讯",
    "legacyPath": "系统配置～政策资讯",
    "actionPermissions": "查看(页面)、查看详情、编辑、上/下架、删除、资讯新增、资讯编辑、资讯详情、资讯上下架、资讯删除",
    "dataPermission": "1、数据创建成功后挂靠到创建人员账号所属机构； 2、可见数据根据登录账号角色的数据权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "110",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "门户管理",
      "融资产品配置"
    ],
    "pagePath": "门户管理 / 融资产品配置",
    "legacyPath": "系统配置～产品配置",
    "actionPermissions": "查看(页面)、新增、查看详情、复制、编辑、上/下架、删除、设为推荐、配置新增、配置编辑、配置详情、配置复制、配置上下架、配置推荐、配置删除",
    "dataPermission": "1、数据创建成功后挂靠到创建人员账号所属机构； 2、可见数据根据登录账号角色的数据权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "111",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "平台管理",
      "基础配置"
    ],
    "pagePath": "平台管理 / 基础配置",
    "legacyPath": "系统配置～管理端配置",
    "actionPermissions": "查看(页面)、编辑、配置编辑",
    "dataPermission": "1.数据源参数子页面 - 展示给机构可配的数据源为平台端赋予该机构权限内的数据源； 2.硬件参数子页面 - 展示给机构可配的数据源为平台端赋予该机构权限内的硬件设备配置；",
    "changeNote": "6.3 P0：平台运行底座重构；货主准入策略并入；仓储作业参数只读联动",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-17"
  },
  {
    "id": "112",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "平台管理",
      "机构类别"
    ],
    "pagePath": "平台管理 / 机构类别",
    "legacyPath": "组织架构～机构类别",
    "actionPermissions": "查看(页面)、编辑、停/启用、删除、添加机构类别、类别新增、类别编辑、类别启停用、类别删除",
    "dataPermission": "数据权限通用，所有有该菜单查看（页面）权限的账号可见",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "113",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "平台管理",
      "机构管理"
    ],
    "pagePath": "平台管理 / 机构管理",
    "legacyPath": "组织架构～机构管理",
    "actionPermissions": "查看(页面)、新增机构、添加下级、编辑、停/启用、删除、机构新增、机构下级、机构编辑、机构详情、机构启停用、机构删除",
    "dataPermission": "1、新增机构按钮弹窗 - 合作机构：非必填，可多选，选择范围为登录账号权限内可看到的机构； 2、新增数据自动挂靠到创建人员账号所属机构； 3、可见数据根据登录账号角色的数据权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "114",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "平台管理",
      "角色管理"
    ],
    "pagePath": "平台管理 / 角色管理",
    "legacyPath": "组织架构～角色管理",
    "actionPermissions": "查看(页面)、新增角色、查看详情、编辑、停/启用、删除、角色新增、角色编辑、角色详情、角色启停用、角色删除",
    "dataPermission": "1、可选管理端及移动端权限、仓库权限、数据权限 为登录账号权限内的数据； 2、新增角色归属机构为登录账号归属机构； 3、可见数据根据登录账号角色的数据权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "115",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "平台管理",
      "账号管理"
    ],
    "pagePath": "平台管理 / 账号管理",
    "legacyPath": "组织架构～账号管理",
    "actionPermissions": "查看(页面)、新增账号、编辑、停/启用、删除、账号新增、账号编辑、账号详情、账号启停用、账号删除",
    "dataPermission": "1、新增账号弹窗 - 所属机构：必填，单选，仅展示登录账号权限内的机构； 2、新增账号弹窗 - 角色：必填，多选，仅展示登录账号权限内的角色； 3、可见数据根据登录账号角色的数据权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "116",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "平台管理",
      "外链管理"
    ],
    "pagePath": "平台管理 / 外链管理",
    "legacyPath": "总机构报表看板-链接分享记录",
    "actionPermissions": "页面展示、外链新增、外链编辑、外链置顶、外链启停用、外链删除",
    "dataPermission": "根据数据权限决定可见数据",
    "changeNote": "菜单更名",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "117",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "仓库管理",
      "仓库管理"
    ],
    "pagePath": "仓库管理 / 仓库管理",
    "legacyPath": "仓库管理～仓库管理",
    "actionPermissions": "查看(页面)、新增仓库、编辑、停/启用、删除、仓库新增、仓库编辑、仓库详情、仓库启停用、仓库删除",
    "dataPermission": "1、仓库管理列表 - 展示内容为登录账号权限内的所有数据（删除状态数据不展示）； 2、可见数据根据登录账号角色的数据权限决定； 3、库房新增存放区选择和标识",
    "changeNote": "6.3 P0：空间主档层级；库房出入库审核标记+编辑弹窗，与基础配置 R03 同步",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-17"
  },
  {
    "id": "118",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓库管理",
      "产地区域管理"
    ],
    "pagePath": "仓库管理 / 产地区域管理",
    "legacyPath": "仓库管理～产地区域管理",
    "actionPermissions": "查看(页面)、新增信息、批量导出、批量导入、导入导出记录、查看、跟进、编辑、作废、删除、信息新增、信息编辑、信息详情、信息跟进、信息作废、信息删除、查看详情",
    "dataPermission": "1、可选仓库为登录账号上赋予的仓库权限； 2、新增数据自动挂靠到创建人员账号所属机构； 3、可见数据根据登录账号角色的数据权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "119",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "货品规格管理",
      "大类管理"
    ],
    "pagePath": "货品规格管理 / 大类管理",
    "legacyPath": "货物管理～大类管理",
    "actionPermissions": "查看页面、新增、编辑、启停用、列表、大类新增、大类编辑、大类启停用、大类删除",
    "dataPermission": "有菜单权限的人可见所有数据",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "120",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "货品规格管理",
      "品类管理"
    ],
    "pagePath": "货品规格管理 / 品类管理",
    "legacyPath": "货物管理～品类管理",
    "actionPermissions": "查看页面、新增、编辑、启停用、删除、品规新增、品规编辑、品规启停用、品规删除",
    "dataPermission": "有菜单权限的人可见所有数据",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "121",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "货品规格管理",
      "货品管理"
    ],
    "pagePath": "货品规格管理 / 货品管理",
    "legacyPath": "货物管理～货品管理",
    "actionPermissions": "查看页面、新增、编辑、启停用、价格设置、货品新增、货品编辑、货品启停用、货品删除",
    "dataPermission": "1、有菜单权限的人可见所有数据； 2、货品单价为登录账号归属机构所设置的单价； 3、设置的货品价格为登录账号归属机构的单价，同一货品同一机构人员编辑直接更新；",
    "changeNote": "优化展示价格曲线、货物入库收集信息配置",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "122",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理/15-货品规格管理-入库收集项配置",
    "recordStatus": "active",
    "pagePathSegments": [
      "货品规格管理",
      "入库收集项配置"
    ],
    "pagePath": "货品规格管理 / 入库收集项配置",
    "legacyPath": "货物管理～入库收集项配置",
    "actionPermissions": "查看页面、详情、新增收集项、编辑、预览录入效果、启停用、删除、预览、启/停用",
    "dataPermission": "有菜单权限的人可见本租户数据",
    "changeNote": "6.3 新增：入库采集字段池底座（字段、控件、单位白名单）",
    "createdAt": "2026-10-28",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "123",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "合同模板管理"
    ],
    "pagePath": "合同模板管理",
    "legacyPath": "合同管理～合同模板管理",
    "actionPermissions": "查看页面、上传、编辑、预览、启停用、合同上传、合同编辑、合同预览、合同启停用",
    "dataPermission": "1、新增数据自动挂靠到登录人员账号归属机构； 2、可见数据根据当前登录账号角色的数据权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "124",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务流程管理",
      "作业环节（设置模板）"
    ],
    "pagePath": "业务流程管理 / 作业环节（设置模板）",
    "legacyPath": "流程配置～子流程配置",
    "actionPermissions": "查看页面、新增、编辑、启停用、发布、配置任务（新增、配置、删除）、子流程新增、子流程编辑、子流程启停用、子流程发布、任务新增、任务编辑、任务配置、任务启停用、任务删除",
    "dataPermission": "1、有菜单权限人员可见所有流程； 2、流程内配置填写对象，可选角色和人员为账号数据权限内的数据； 3、签章组件配置时可选模板为系统内启用的所有合同模板，包括系统内置的 电子仓单 模板；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "125",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务流程管理",
      "作业流程（引用模板）"
    ],
    "pagePath": "业务流程管理 / 作业流程（引用模板）",
    "legacyPath": "流程配置～总流程配置",
    "actionPermissions": "查看页面、新增、编辑、启停用、配置、流程新增、流程编辑、流程配置、流程启停用",
    "dataPermission": "有菜单权限人员可见所有流程",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "126",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务流程管理",
      "监管业务审批"
    ],
    "pagePath": "业务流程管理 / 监管业务审批",
    "legacyPath": "流程配置～节点配置",
    "actionPermissions": "查看页面、详情、新增、编辑、启停用、删除、节点配置新增、节点配置编辑、节点配置起停用、节点配置删除、全量查看详情、操作记录、导出",
    "dataPermission": "1、有菜单权限人员可见所有流程； 2、流程内配置填写对象，可选角色和人员为账号数据权限内的数据； 3、签章组件配置时可选模板为系统内启用的所有合同模板，包括系统内置的 电子仓单 模板；",
    "changeNote": "菜单更名",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "127",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务流程管理",
      "开锁审批"
    ],
    "pagePath": "业务流程管理 / 开锁审批",
    "legacyPath": "流程配置～开锁审批配置",
    "actionPermissions": "查看页面、新增、编辑、详情、启停用、删除、查看详情",
    "dataPermission": "有菜单权限人员可见当前租户下全部配置",
    "changeNote": "6.2 新增门禁开锁审批策略配置",
    "createdAt": "2026-08-25",
    "updatedAt": "2026-08-31"
  },
  {
    "id": "128",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "业务流程管理",
      "通知配置"
    ],
    "pagePath": "业务流程管理 / 通知配置",
    "legacyPath": "流程配置～通知配置",
    "actionPermissions": "查看页面、详情、编辑、停用、删除",
    "dataPermission": "有仓单权限的人员可见所有数据，操作参照按钮权限",
    "changeNote": "线上无此菜单；权限清单误录",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "129",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "预警配置",
      "预警等级"
    ],
    "pagePath": "预警配置 / 预警等级",
    "legacyPath": "风险管理～预警等级",
    "actionPermissions": "查看页面、新增、编辑、详情、删除、启停用、排序",
    "dataPermission": "有菜单权限人员可见当前租户等级字典",
    "changeNote": "【6.2目标态】迁至 物联网IOT与预警 / 预警配置 / 预警等级；6.2 新增公共底座；【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/03-预警配置/01预警等级",
    "createdAt": "2026-08-25",
    "updatedAt": "2026-08-31"
  },
  {
    "id": "130",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "预警配置",
      "订单预警配置"
    ],
    "pagePath": "预警配置 / 订单预警配置",
    "legacyPath": "风险管理～订单预警配置",
    "actionPermissions": "查看页面、详情、新增、编辑、删除",
    "dataPermission": "1、订单预警配置：可选和可看订单根据登录账号数据权限决定（可见订单则可见订单相关的预警配置和选项）； 2、设备预警配置：可选设备根据登录账号仓库权限决定，可看配置根据登录账号数据权限决定；",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/03-预警配置/03订单预警配置",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "131",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "预警配置",
      "设备预警配置"
    ],
    "pagePath": "预警配置 / 设备预警配置",
    "legacyPath": "风险管理～设备预警配置",
    "actionPermissions": "查看页面、详情、新增、编辑、删除",
    "dataPermission": "1、订单预警配置：可选和可看订单根据登录账号数据权限决定（可见订单则可见订单相关的预警配置和选项）； 2、设备预警配置：可选设备根据登录账号仓库权限决定，可看配置根据登录账号数据权限决定；",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警/03-预警配置/02设备预警配置",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "132",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "预警配置",
      "设备事务通知配置"
    ],
    "pagePath": "预警配置 / 设备事务通知配置",
    "legacyPath": "风险管理～设备事务通知配置",
    "actionPermissions": "查看页面、详情、新增、编辑、删除、启停用",
    "dataPermission": "设备类型分页：如果账号仓库权限和单条规则绑定设备的任意一个设备相同，则展示该条规则；如果单条规则的设备没有绑定任何仓库，则该规则展示给所有人",
    "changeNote": "【6.2已上线】菜单迁至07-物联网IOT与预警，见基准 B端PC/07-物联网IOT与预警",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "133",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "planned",
    "pagePathSegments": [
      "巡检配置（新)",
      "巡检清清单"
    ],
    "pagePath": "巡检配置（新) / 巡检清清单",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增、编辑、删除、启停用",
    "dataPermission": "机构权限",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "134",
    "platform": "PC",
    "module": "10.配置管理",
    "topBarModuleLabel": "配置管理",
    "menuModuleCode": "10-配置管理",
    "baselineModuleDir": "B端PC/10-配置管理",
    "recordStatus": "planned",
    "pagePathSegments": [
      "巡检配置（新)",
      "巡检点配置"
    ],
    "pagePath": "巡检配置（新) / 巡检点配置",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、编辑",
    "dataPermission": "仓库权限",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "135",
    "platform": "PC",
    "module": "11.合同签署",
    "topBarModuleLabel": "合同签署",
    "menuModuleCode": "11-合同签署",
    "baselineModuleDir": "B端PC/11-合同签署",
    "recordStatus": "active",
    "pagePathSegments": [
      "合同签署中心",
      "模版管理"
    ],
    "pagePath": "合同签署中心 / 模版管理",
    "legacyPath": "-",
    "actionPermissions": "查看页面、新建模板、编辑、复制、启/停用、删除、直接发起、查看详情",
    "dataPermission": "功能权限",
    "changeNote": "2026-11-10 按TSV补齐合同签署模块",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "136",
    "platform": "PC",
    "module": "11.合同签署",
    "topBarModuleLabel": "合同签署",
    "menuModuleCode": "11-合同签署",
    "baselineModuleDir": "B端PC/11-合同签署",
    "recordStatus": "active",
    "pagePathSegments": [
      "合同签署中心",
      "我的合同"
    ],
    "pagePath": "合同签署中心 / 我的合同",
    "legacyPath": "-",
    "actionPermissions": "查看页面、发起签署、下载、批量删除、撤销、查看合同、批量下载、查看详情",
    "dataPermission": "功能权限",
    "changeNote": "2026-11-10 按TSV补齐合同签署模块",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "137",
    "platform": "PC",
    "module": "11.合同签署",
    "topBarModuleLabel": "合同签署",
    "menuModuleCode": "11-合同签署",
    "baselineModuleDir": "B端PC/11-合同签署",
    "recordStatus": "active",
    "pagePathSegments": [
      "合同签署中心",
      "合同台账"
    ],
    "pagePath": "合同签署中心 / 合同台账",
    "legacyPath": "-",
    "actionPermissions": "查看页面、批量下载、查看合同、查看详情",
    "dataPermission": "功能权限",
    "changeNote": "2026-11-10 按TSV补齐合同签署模块",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "138",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/01-物联网IOT管理/01监控设备",
    "recordStatus": "active",
    "pagePathSegments": [
      "物联网IOT管理",
      "监控设备"
    ],
    "pagePath": "物联网IOT管理 / 监控设备",
    "legacyPath": "设备管理～监控设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、查看直播、查看回放、图像锚点、移除设备",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备所有登录账号可见",
    "changeNote": "6.2已上线基准；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "139",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/01-物联网IOT管理/02门禁设备",
    "recordStatus": "active",
    "pagePathSegments": [
      "物联网IOT管理",
      "门禁设备"
    ],
    "pagePath": "物联网IOT管理 / 门禁设备",
    "legacyPath": "设备管理～门禁设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、设备数据、获取密码、移除设备、人脸管理",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备所有登录账号可见",
    "changeNote": "6.2目标态菜单；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "140",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/01-物联网IOT管理/03物联设备",
    "recordStatus": "active",
    "pagePathSegments": [
      "物联网IOT管理",
      "物联设备"
    ],
    "pagePath": "物联网IOT管理 / 物联设备",
    "legacyPath": "设备管理～物联设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、设备数据、移除设备",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备所有登录账号可见",
    "changeNote": "6.2目标态菜单；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "141",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/01-物联网IOT管理/04GPS设备",
    "recordStatus": "active",
    "pagePathSegments": [
      "物联网IOT管理",
      "GPS设备"
    ],
    "pagePath": "物联网IOT管理 / GPS设备",
    "legacyPath": "设备管理～GPS设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、实时定位、运动轨迹、移除设备、GPS平台规则配置、GPS平台基础数据、绑定仓库",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备所有登录账号可见",
    "changeNote": "6.2目标态菜单；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "142",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/01-物联网IOT管理/05人脸配置",
    "recordStatus": "active",
    "pagePathSegments": [
      "物联网IOT管理",
      "人脸配置"
    ],
    "pagePath": "物联网IOT管理 / 人脸配置",
    "legacyPath": "设备管理～人脸配置",
    "actionPermissions": "查看(页面)、上传人脸、分配门禁、批量分配门禁、移除门禁、查看进度",
    "dataPermission": "1.分配门禁用：仓库权限可见 2.人员列表：机构数据权限",
    "changeNote": "6.2目标态菜单；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "143",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/02-预警信息/01设备预警信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "预警信息",
      "设备预警信息"
    ],
    "pagePath": "预警信息 / 设备预警信息",
    "legacyPath": "风险管理～设备预警管理",
    "actionPermissions": "查看页面、详情、去处理（操作权限+预警状态为未处理）、批量解除、预警详情、解除预警",
    "dataPermission": "仓库权限 登录账号仓库权限（未绑定具体位置的设备所有账号可见） 数据权限内的数据；",
    "changeNote": "6.2目标态；合流门禁事务/设备事务通知流水；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "144",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/02-预警信息/02押品预警信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "预警信息",
      "押品预警信息"
    ],
    "pagePath": "预警信息 / 押品预警信息",
    "legacyPath": "风险管理～订单预警管理",
    "actionPermissions": "查看页面、详情、去查看、公示风险、批量公示风险（已处理数据下才展示）、预警详情、解除预警、批量公示风险",
    "dataPermission": "订单数据权限 登录账号数据权限内的数据（可见订单则可见订单相关的预警消息）",
    "changeNote": "6.2目标态菜单；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "145",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/02-预警信息/03贷中风控管理",
    "recordStatus": "active",
    "pagePathSegments": [
      "预警信息",
      "贷中风控管理"
    ],
    "pagePath": "预警信息 / 贷中风控管理",
    "legacyPath": "风险管理~风险公示",
    "actionPermissions": "查看（页面）、查看详情、执行风控模型、批量执行、详情",
    "dataPermission": "订单数据权限",
    "changeNote": "6.2目标态菜单；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "146",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/02-预警信息/04风险公示",
    "recordStatus": "active",
    "pagePathSegments": [
      "预警信息",
      "风险公示"
    ],
    "pagePath": "预警信息 / 风险公示",
    "legacyPath": "",
    "actionPermissions": "查看页面",
    "dataPermission": "订单数据权限 登录账号数据权限内的数据（可见订单则可见订单相关的预警消息）",
    "changeNote": "6.2目标态菜单；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "147",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/03-预警配置/01预警等级",
    "recordStatus": "active",
    "pagePathSegments": [
      "预警配置",
      "预警等级"
    ],
    "pagePath": "预警配置 / 预警等级",
    "legacyPath": "风险管理～预警等级",
    "actionPermissions": "查看页面、新增、编辑、详情、删除、启停用、排序、启停",
    "dataPermission": "有菜单权限人员可见当前租户等级字典",
    "changeNote": "6.2目标态；2~20档动态字典；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "148",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/03-预警配置/02设备预警配置",
    "recordStatus": "active",
    "pagePathSegments": [
      "预警配置",
      "设备预警配置"
    ],
    "pagePath": "预警配置 / 设备预警配置",
    "legacyPath": "风险管理～设备预警配置",
    "actionPermissions": "查看页面、详情、新增、编辑、删除、预警启停用、预警新增、预警编辑、预警详情、预警删除、启停、排序",
    "dataPermission": "1、订单预警配置：可选和可看订单根据登录账号数据权限决定（可见订单则可见订单相关的预警配置和选项）； 2、设备预警配置：可选设备根据登录账号仓库权限决定，可看配置根据登录账号数据权限决定；",
    "changeNote": "6.2目标态；合流设备事务通知配置；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "149",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/03-预警配置/03订单预警配置",
    "recordStatus": "active",
    "pagePathSegments": [
      "预警配置",
      "订单预警配置"
    ],
    "pagePath": "预警配置 / 订单预警配置",
    "legacyPath": "风险管理～订单预警配置",
    "actionPermissions": "查看页面、详情、新增、编辑、删除、预警新增、预警编辑、预警详情、预警删除",
    "dataPermission": "1、订单预警配置：可选和可看订单根据登录账号数据权限决定（可见订单则可见订单相关的预警配置和选项）； 2、设备预警配置：可选设备根据登录账号仓库权限决定，可看配置根据登录账号数据权限决定；",
    "changeNote": "6.2目标态菜单；6.2上线合流批次A",
    "createdAt": "2026-09-03",
    "updatedAt": ""
  },
  {
    "id": "150",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警",
    "recordStatus": "active",
    "pagePathSegments": [
      "历史数据查询",
      "设备事务通知信息"
    ],
    "pagePath": "历史数据查询 / 设备事务通知信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、去处理、事务详情",
    "dataPermission": "仓库权限",
    "changeNote": "2026-11-10 按TSV补齐物联网页面",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "151",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警",
    "recordStatus": "active",
    "pagePathSegments": [
      "历史数据查询",
      "历史设备预警信息"
    ],
    "pagePath": "历史数据查询 / 历史设备预警信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、去处理、预警详情",
    "dataPermission": "仓库权限",
    "changeNote": "2026-11-10 按TSV补齐物联网页面",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "152",
    "platform": "PC",
    "module": "7.物联网IOT与预警",
    "topBarModuleLabel": "物联网IOT与预警",
    "menuModuleCode": "07-物联网IOT与预警",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警",
    "recordStatus": "active",
    "pagePathSegments": [
      "预警信息",
      "门禁事务记录"
    ],
    "pagePath": "预警信息 / 门禁事务记录",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "仓库权限",
    "changeNote": "2026-11-10 按TSV补齐物联网页面",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "153",
    "platform": "移动",
    "module": "1.首页",
    "topBarModuleLabel": "首页",
    "menuModuleCode": "01-首页",
    "baselineModuleDir": "B端H5/01-首页",
    "recordStatus": "active",
    "pagePathSegments": [
      "报表"
    ],
    "pagePath": "报表",
    "legacyPath": "无变化",
    "actionPermissions": "查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "无变化",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "154",
    "platform": "移动",
    "module": "1.首页",
    "topBarModuleLabel": "首页",
    "menuModuleCode": "01-首页",
    "baselineModuleDir": "B端H5/01-首页",
    "recordStatus": "active",
    "pagePathSegments": [
      "待办事项",
      "设置监管报告"
    ],
    "pagePath": "待办事项 / 设置监管报告",
    "legacyPath": "无变化",
    "actionPermissions": "设置监管报告、查看详情",
    "dataPermission": "",
    "changeNote": "无变化",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "155",
    "platform": "移动",
    "module": "1.首页",
    "topBarModuleLabel": "首页",
    "menuModuleCode": "01-首页",
    "baselineModuleDir": "B端H5/01-首页",
    "recordStatus": "active",
    "pagePathSegments": [
      "数字仓库",
      "温湿度设备"
    ],
    "pagePath": "数字仓库 / 温湿度设备",
    "legacyPath": "无变化",
    "actionPermissions": "查看页面、温湿度设备、监控设备、查看详情",
    "dataPermission": "",
    "changeNote": "无变化",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "156",
    "platform": "移动",
    "module": "1.首页",
    "topBarModuleLabel": "首页",
    "menuModuleCode": "01-首页",
    "baselineModuleDir": "B端H5/01-首页",
    "recordStatus": "active",
    "pagePathSegments": [
      "数字仓库",
      "监控设备"
    ],
    "pagePath": "数字仓库 / 监控设备",
    "legacyPath": "无变化",
    "actionPermissions": "查看页面、温湿度设备、监控设备、查看详情",
    "dataPermission": "",
    "changeNote": "无变化",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "157",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "存货管理"
    ],
    "pagePath": "仓储 / 存货管理",
    "legacyPath": "货物管理～存货管理",
    "actionPermissions": "查看页面、详情、库存分布、库存流水",
    "dataPermission": "1、可见数据为账号上赋予的仓库权限决定； 2、货品价格为登录账号归属机构设置的单价；",
    "changeNote": "优化",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "158",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "仓单管理"
    ],
    "pagePath": "仓储 / 仓单管理",
    "legacyPath": "货物管理～仓单管理",
    "actionPermissions": "查看页面、详情、查看详情、变更记录、仓单补货、仓单出库、仓单移库、注销、下载、货物移除、仓单入库",
    "dataPermission": "1、开立申请可选仓库为账号权限内的仓库； 2、可见数据为账号上赋予的仓库权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "159",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "货权档案"
    ],
    "pagePath": "仓储 / 货权档案",
    "legacyPath": "货权管理～货权档案",
    "actionPermissions": "查看页面、详情、批量移交、移交档案、确认结束、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定； 档案移交人员的列表为当前子机构下的所有人员清单 (只展示同级机构，上一级机构和下一级机构都无法展示)",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "160",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "证据管理"
    ],
    "pagePath": "仓储 / 证据管理",
    "legacyPath": "货权管理～证据管理",
    "actionPermissions": "查看页面、存证报告、原文件、货物详情、导出",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "161",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "仓储",
      "入库管理"
    ],
    "pagePath": "仓储 / 入库管理",
    "legacyPath": "货物管理～入库",
    "actionPermissions": "查看页面、入库、入库记录（入库订单：查看详情、编辑、分配二维码、单据下载、下载记录、入库申请：查看详情、入库撤销）、查看详情、资料管理",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3：入库发起合作方货主；暂存磁贴随暂存登记暂定开发进度展示",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-19"
  },
  {
    "id": "162",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "仓储",
      "出库管理"
    ],
    "pagePath": "仓储 / 出库管理",
    "legacyPath": "货物管理～出库",
    "actionPermissions": "查看页面、出库、出库记录（出库订单：查看详情、单据下载、下载记录、出库申请：查看详情、出库撤销）、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3 P0：货主引用已有档案；提货经办人 O06a",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-20"
  },
  {
    "id": "163",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "移库管理"
    ],
    "pagePath": "仓储 / 移库管理",
    "legacyPath": "货物管理～移库",
    "actionPermissions": "查看页面、移库、移库记录（移库订单：查看详情、单据下载、下载记录、移库申请：查看详情、操作记录、移库撤销）、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "164",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "仓储",
      "货物转让"
    ],
    "pagePath": "仓储 / 货物转让",
    "legacyPath": "货物管理～转让",
    "actionPermissions": "查看页面、转让、转让记录（转让申请：查看详情、撤销、转让记录：查看详情）、查看详情、新增转让",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3 P0：货主信息域挂接受让方货主（PA-V07；无接收方角色态）",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-20"
  },
  {
    "id": "165",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "仓储",
      "提货单"
    ],
    "pagePath": "仓储 / 提货单",
    "legacyPath": "货物管理～提货单",
    "actionPermissions": "查看页面、详情、取消提货、重置提货码、提货码核销、操作记录、确认提货、查看详情、核销提货码",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "6.3 P0：提货人引用合作方",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-09-20"
  },
  {
    "id": "166",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "货物盘点"
    ],
    "pagePath": "仓储 / 货物盘点",
    "legacyPath": "货物管理～货物盘点",
    "actionPermissions": "查看页面、新增盘点、撤销、查看详情、扫码盘点、盘点记录、解除异常、去盘点",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "优化页面；2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "167",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "加工管理"
    ],
    "pagePath": "仓储 / 加工管理",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增加工、撤销加工、完成加工、作废、操作记录、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": "168",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "设备管理",
      "监控设备"
    ],
    "pagePath": "仓储 / 设备管理 / 监控设备",
    "legacyPath": "设备管理～监控设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、查看直播、查看回放、移除设备、设备纳管、全局查看、园区/非质押物摄像头绑定、设备数据、质押单设备绑定、录像回放、查看实时监控（无回放、无绑定权）",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；未绑定位置的设备所有人可见",
    "changeNote": "2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "169",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "设备管理",
      "物联设备"
    ],
    "pagePath": "仓储 / 设备管理 / 物联设备",
    "legacyPath": "设备管理～物联设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、设备数据、移除设备、仓库设备绑定、监管设备绑定、设备运行状态查看",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；未绑定位置的设备所有人可见",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "170",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "设备管理",
      "门禁设备"
    ],
    "pagePath": "仓储 / 设备管理 / 门禁设备",
    "legacyPath": "设备管理～门禁设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、设备数据、移除设备、获取密码、设备纳管、全局配置、开锁申请、仓库设备绑定、监管设备绑定、设备运行状态查看（无开锁权）",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；未绑定位置的设备所有人可见",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "171",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "设备管理",
      "GPS设备"
    ],
    "pagePath": "仓储 / 设备管理 / GPS设备",
    "legacyPath": "设备管理～GPS设备",
    "actionPermissions": "查看页面、重命名、仓库绑定、实时定位、运动轨迹、移除设备、历史轨迹、仓库设备绑定、设备数据、监管设备绑定、设备运行状态查看",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；未绑定位置的设备所有人可见",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "172",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "设备管理",
      "门禁事务记录"
    ],
    "pagePath": "仓储 / 设备管理 / 门禁事务记录",
    "legacyPath": "设备管理～门禁事务记录",
    "actionPermissions": "查看页面、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；未绑定位置的设备所有人可见",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "173",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "异动管理"
    ],
    "pagePath": "仓储 / 异动管理",
    "legacyPath": "-",
    "actionPermissions": "查看页面、异动记录（异动订单：查看详情、新增异动、操作记录）、异动申请已停用、查看详情、操作记录",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "174",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "理货堆放"
    ],
    "pagePath": "仓储 / 理货堆放",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、理货堆放、拆分、查看详情",
    "dataPermission": "仓库权限",
    "changeNote": "",
    "createdAt": "2026-04-14",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "175",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "库存明细"
    ],
    "pagePath": "仓储 / 库存明细",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、查看详情",
    "dataPermission": "仓库权限",
    "changeNote": "",
    "createdAt": "2026-04-14",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "176",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资/监管",
      "监管管理"
    ],
    "pagePath": "融资/监管 / 监管管理",
    "legacyPath": "项目监管～项目管理",
    "actionPermissions": "查看页面、货物置换、货物补仓、货物出库、解抵质押、货物估值、货物盘点、盘点报告、货物移库、查看监控、平仓、查看风险、设备管理、操作记录、贷款结果录入、查看详情、监管报告（生成盘点监管报告、撤销申请、下载报告、重新申请、查看报告）、部分结清、安全线管理、货物异动、抵质押入库、日常监管、资料管理、加工管理、解抵押、监管报告（撤销申请/下载报告/查看详情/重新申请/生成盘点监管报告/查看报告）、资料管理（上传资料）、风险公示、部分结清查看、风险公示查看、服务结果录入、服务结算查看",
    "dataPermission": "页内 Tab：抵押 / 质押 / 监管服务（监管订单）。数据权限：根据当前登录账号的角色的数据权限决定【任务发起人及任务处理人可看到相关信息，其他无关人员需要有对应数据所属机构的数据权限才能看到】； 盘点 - 盘点人只能盘点自己有仓库权限的货物 当针对没有仓库权限的货物点击扫码盘点 操作记录 - 能看到这笔抵/质押单，就能看到这笔抵/质押单的全部操作记录； 资金服务方仅保留贷款结果录入、部分结清查看与风险公示查看；仓储服务方仅保留保管责任货位查验与监控查看",
    "changeNote": "2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围",
    "createdAt": "2026-10-19",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "177",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "融资/监管",
      "监管管理",
      "监管订单"
    ],
    "pagePath": "融资/监管 / 监管管理 / 监管订单",
    "legacyPath": "项目监管～项目管理",
    "actionPermissions": "查看页面、查看监控、查看风险、设备管理、货物估值、平仓、货物详情、查看详情、监管报告（生成盘点监管报告、撤销申请、下载报告、重新申请、查看报告）、货物置换、货物补仓、货物出库、解抵押、货物盘点、盘点报告、货物移库、操作记录、贷款结果录入、监管报告（撤销申请/下载报告/查看详情/重新申请/生成盘点监管报告/查看报告）、部分结清、安全线管理、货物异动、抵质押入库、日常监管、资料管理（上传资料）、风险公示、加工管理、部分结清查看、风险公示查看、服务结果录入、服务结算查看",
    "dataPermission": "6.3 独立菜单下线，并入「监管管理 · 监管服务」Tab；本行保留历史权限对照",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "178",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资/监管",
      "客户融资授信办理"
    ],
    "pagePath": "融资/监管 / 客户融资授信办理",
    "legacyPath": "其他～监管委托需求",
    "actionPermissions": "查看页面、融资详情、分配任务转交、状态管理、发起抵质押、分配、查看详情、授信办理、授信审批、授信记录、授信确认、查看授信",
    "dataPermission": "·有融资申请审核权限的账号可看到所有融资申请信息 ·根据登录账号针对具体任务的操作权限决定；",
    "changeNote": "与菜单地图命名对齐",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-08-31"
  },
  {
    "id": "179",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资/监管",
      "客户融资尽调办理"
    ],
    "pagePath": "融资/监管 / 客户融资尽调办理",
    "legacyPath": "",
    "actionPermissions": "待受理：查看（页面）、查看详情、拒绝、分配任务转交（待受理、受理通过状态展示）、发起尽调（待受理、受理中状态展示）、下载资料（受理通过、受理拒绝状态展示） 尽调完成：查看（页面）、分配给资方（待受理、重新尽调（尽调失败时展示）、受理拒绝状态展示）、详情、分配、发起尽调、分配给资方、尽调办理、去处理",
    "dataPermission": "登录账号数据权限内的数据",
    "changeNote": "",
    "createdAt": "2026-05-12",
    "updatedAt": ""
  },
  {
    "id": "180",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资/监管",
      "线上监管业务办理"
    ],
    "pagePath": "融资/监管 / 线上监管业务办理",
    "legacyPath": "",
    "actionPermissions": "发起抵质押、抵质押发起确认、查看详情、业务办理、业务发起、办理记录",
    "dataPermission": "·有融资申请审核权限的账号可看到所有融资申请信息 ·根据登录账号针对具体任务的操作权限决定；",
    "changeNote": "从【客户融资授信办理】中拆出来",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": "181",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "融资/监管",
      "被拒退回记录池"
    ],
    "pagePath": "融资/监管 / 被拒退回记录池",
    "legacyPath": "被拒退回记录池",
    "actionPermissions": "查看（页面）、重新尽调（有需要尽调的标识才展示）、重新分配给资方、详情、重新尽调、查看详情、被拒记录查看、重新救活发起、重新申请",
    "dataPermission": "登录账号数据权限内的数据",
    "changeNote": "",
    "createdAt": "2026-07-28",
    "updatedAt": ""
  },
  {
    "id": "182",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "用户中心",
      "监管档案"
    ],
    "pagePath": "用户中心 / 监管档案",
    "legacyPath": "项目监管～监管档案",
    "actionPermissions": "查看页面、新增入库、新增出库、新增移库、货物转让、待提货单、仓单开立、抵押单开立、质押单开立、货物列表、仓单（查看页面、详情、仓单出库、变更记录、仓单补货、仓单移库、仓单移除、仓单注销、仓单下载、仓单入库）、抵押单（查看页面、操作记录、货物出库、查看资料、查看风险、置换抵押、加/补仓、解抵押、货物估值、货物盘点、盘点报告、移库、查看监控、平仓、设备管理、贷款结果录入、查看详情、监管报告、部分结清、安全线管理、货物异动、抵押入库、日常监管、风险公示、加工管理）、监管服务单（查看页面、货物置换、货物补仓、货物移库、抵质押入库、资料管理、质押单（查看页面、置换质押、解质押、质押入库、设备预警、订单预警、记录管理、新增异动、资料上传、查看风险--公示风险/批量公示风险（已处理数据下才展示）",
    "dataPermission": "平台运营方、仓储服务方、监管服务方共同查看；按仓库/订单数据权限过滤",
    "changeNote": "2026-11-10 按角色权限研讨会口径校正功能按钮与数据可见范围；仓单子项补齐下载与入库；补齐监管服务单与新增异动",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "183",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "交易",
      "采购需求管理"
    ],
    "pagePath": "交易 / 采购需求管理",
    "legacyPath": "其他～采购需求管理",
    "actionPermissions": "查看页面、详情、下架",
    "dataPermission": "1、所有数据挂靠顶级机构； 2、登录账号有对应机构的数据权限可看；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "184",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "交易",
      "销售需求管理"
    ],
    "pagePath": "交易 / 销售需求管理",
    "legacyPath": "其他～销售需求管理",
    "actionPermissions": "查看(页面)、详情、下架、线索跟进、线索详情、线索下架",
    "dataPermission": "1、所有数据挂靠顶级机构； 2、登录账号有对应机构的数据权限可看；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "185",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "交易",
      "政策资讯"
    ],
    "pagePath": "交易 / 政策资讯",
    "legacyPath": "其他-政策资讯",
    "actionPermissions": "查看(页面)、查看详情、编辑、上/下架、删除、政策详情、政策上下架、政策删除",
    "dataPermission": "1、数据创建成功后挂靠到创建人员账号所属机构； 2、可见数据根据登录账号角色的数据权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "186",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控",
      "设备预警信息"
    ],
    "pagePath": "风控 / 设备预警信息",
    "legacyPath": "项目监管-预警管理-设备预警",
    "actionPermissions": "查看（页面）、去处理（操作权限+预警状态为未处理）、解除预警、详情、全量查看、现场设备排查、离线核实、现场核实、结案处置",
    "dataPermission": "登录账号仓库权限（未绑定具体位置的设备所有账号可见） 数据权限内的数据；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "187",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控",
      "押品预警信息"
    ],
    "pagePath": "风控 / 押品预警信息",
    "legacyPath": "项目监管-预警管理-订单预警",
    "actionPermissions": "查看（页面）、去查看、详情、解除预警、公示风险、批量公示风险、全量查看、核实处置、联动解除、结案处理",
    "dataPermission": "登录账号数据权限内的数据（可见订单则可见订单相关的预警消息）；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "188",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控",
      "设备事务通知"
    ],
    "pagePath": "风控 / 设备事务通知",
    "legacyPath": "项目监管-预警管理-设备事务通知",
    "actionPermissions": "查看(页面)、去处理、查看详情",
    "dataPermission": "根据仓库权限决定可看数据，未绑定具体位置的设备事务记录所有登录账号可见",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "189",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "风控",
      "贷中风控管理"
    ],
    "pagePath": "风控 / 贷中风控管理",
    "legacyPath": "",
    "actionPermissions": "查看（页面）、查看详情、执行风控模型、批量执行、详情、去处理、模型审核、风险处置",
    "dataPermission": "订单数据权限",
    "changeNote": "",
    "createdAt": "2026-05-12",
    "updatedAt": ""
  },
  {
    "id": "190",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "planned",
    "pagePathSegments": [
      "风控",
      "巡检异常管理"
    ],
    "pagePath": "风控 / 巡检异常管理",
    "legacyPath": "",
    "actionPermissions": "",
    "dataPermission": "",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "191",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "planned",
    "pagePathSegments": [
      "风控",
      "巡检任务"
    ],
    "pagePath": "风控 / 巡检任务",
    "legacyPath": "",
    "actionPermissions": "",
    "dataPermission": "",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "192",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "planned",
    "pagePathSegments": [
      "风控",
      "日常巡检"
    ],
    "pagePath": "风控 / 日常巡检",
    "legacyPath": "",
    "actionPermissions": "",
    "dataPermission": "",
    "changeNote": "计划中",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "193",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "结算",
      "结算管理"
    ],
    "pagePath": "结算 / 结算管理",
    "legacyPath": "结算管理-结算管理",
    "actionPermissions": "查看（页面）、详情、编辑、结算、结算记录、下载结算单、结清、作废、结算单编辑、结算单结算、结算单结清、结算单作废、结算单详情、结算单下载、全量结算汇总、结算报表、结算查看详情",
    "dataPermission": "功能权限",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "194",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "结算",
      "新增收入结算单"
    ],
    "pagePath": "结算 / 新增收入结算单",
    "legacyPath": "结算管理-新增收入结算单",
    "actionPermissions": "查看（页面）、查看页面、全量结算汇总、结算报表、结算查看详情",
    "dataPermission": "功能权限",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "195",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "结算",
      "新增支出结算单"
    ],
    "pagePath": "结算 / 新增支出结算单",
    "legacyPath": "结算管理-新增支出结算单",
    "actionPermissions": "查看（页面）、查看页面、全量结算汇总、结算报表、结算查看详情",
    "dataPermission": "功能权限",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "196",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "配置管理",
      "仓库管理"
    ],
    "pagePath": "配置管理 / 仓库管理",
    "legacyPath": "仓库管理-仓库管理",
    "actionPermissions": "查看(页面)、编辑、停/启用、查看详情、仓库编辑、仓库启停用、仓库删除",
    "dataPermission": "1、仓库管理列表 - 展示内容为登录账号权限内的所有数据（删除状态数据不展示）； 2、可见数据根据登录账号角色的数据权限决定； 3、库房新增存放区选择和标识",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "197",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "配置管理",
      "新增仓库"
    ],
    "pagePath": "配置管理 / 新增仓库",
    "legacyPath": "仓库管理-新增仓库",
    "actionPermissions": "查看(页面)、编辑、停/启用、查看页面",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "198",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "配置管理",
      "新增产业地"
    ],
    "pagePath": "配置管理 / 新增产业地",
    "legacyPath": "仓库管理-新增产业地",
    "actionPermissions": "查看(页面)、编辑、停/启用、查看页面",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "199",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端H5/02-工作台",
    "recordStatus": "active",
    "pagePathSegments": [
      "配置管理",
      "产业地信息管理"
    ],
    "pagePath": "配置管理 / 产业地信息管理",
    "legacyPath": "仓库管理-产业地信息管理",
    "actionPermissions": "查看(页面)、查看、跟进、编辑、产业地详情、产业地跟进、产业地编辑",
    "dataPermission": "1、新增数据自动挂靠到创建人员账号所属机构； 2、可见数据根据登录账号角色的数据权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "200",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "内部审批",
      "待处理"
    ],
    "pagePath": "内部审批 / 待处理",
    "legacyPath": "项目监管-审批-我的待办审批",
    "actionPermissions": "查看（页面）、报告设置（待办事项监管报告类型）、设置监管报告、查看详情",
    "dataPermission": "",
    "changeNote": "V3.2 由「业务概览」更名",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-08-31"
  },
  {
    "id": "201",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "内部审批",
      "已处理"
    ],
    "pagePath": "内部审批 / 已处理",
    "legacyPath": "项目监管-审批-我的待办审批",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "202",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "内部审批",
      "抄送我的"
    ],
    "pagePath": "内部审批 / 抄送我的",
    "legacyPath": "项目监管-审批-我的待办审批",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "203",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "内部审批",
      "我的申请记录"
    ],
    "pagePath": "内部审批 / 我的申请记录",
    "legacyPath": "项目监管-审批-我的申请管理",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "204",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "内部审批",
      "业务申请记录"
    ],
    "pagePath": "内部审批 / 业务申请记录",
    "legacyPath": "项目监管-审批-业务申请管理",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "205",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "业务发起",
      "入库发起"
    ],
    "pagePath": "业务发起 / 入库发起",
    "legacyPath": "货物管理-入库-入库",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "6.3 P0：合作方货主快捷建档；暂存通道随暂存登记暂定开发放开",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-19"
  },
  {
    "id": "206",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "业务发起",
      "出库发起"
    ],
    "pagePath": "业务发起 / 出库发起",
    "legacyPath": "货物管理-出库-出库",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "6.3 P0：提货经办人快捷建档（O06a）",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-19"
  },
  {
    "id": "207",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务发起",
      "移库发起"
    ],
    "pagePath": "业务发起 / 移库发起",
    "legacyPath": "货物管理-移库-移库",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "优化页面",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "208",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "6.3-delivered",
    "pagePathSegments": [
      "业务发起",
      "货物转让"
    ],
    "pagePath": "业务发起 / 货物转让",
    "legacyPath": "货物转让-转让-转让",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "6.3 P0：货主信息域挂接受让方货主（PA-V07；无接收方角色态）",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-10-20"
  },
  {
    "id": "209",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务发起",
      "仓单开立"
    ],
    "pagePath": "业务发起 / 仓单开立",
    "legacyPath": "仓单管理-仓单开立",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "优化页面",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "210",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务发起",
      "监管办理"
    ],
    "pagePath": "业务发起 / 监管办理",
    "legacyPath": "项目监管-项目发起-抵押信息确认 及 质押信息确认",
    "actionPermissions": "查看（页面）、抵押信息确认、质押信息确认、监管服务确认、查看详情",
    "dataPermission": "",
    "changeNote": "优化页面",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "211",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务发起",
      "加工发起"
    ],
    "pagePath": "业务发起 / 加工发起",
    "legacyPath": "仓储-加工管理-新增加工单",
    "actionPermissions": "查看（页面）、查看页面、查看详情",
    "dataPermission": "可见数据根据当前登录账号的角色的 仓库 权限决定；",
    "changeNote": "优化页面",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "212",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务发起",
      "异动申请"
    ],
    "pagePath": "业务发起 / 异动申请",
    "legacyPath": "-",
    "actionPermissions": "查看（页面）、申请、查看详情、查看页面",
    "dataPermission": "",
    "changeNote": "优化页面",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "213",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "业务发起",
      "盘点发起"
    ],
    "pagePath": "业务发起 / 盘点发起",
    "legacyPath": "-",
    "actionPermissions": "查看（页面）",
    "dataPermission": "",
    "changeNote": "",
    "createdAt": "2026-04-14",
    "updatedAt": "2026-04-14"
  },
  {
    "id": "214",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "客户需求审批",
      "客户入库需求"
    ],
    "pagePath": "客户需求审批 / 客户入库需求",
    "legacyPath": "项目监管-审批-客户入库需求",
    "actionPermissions": "查看(页面)、 入库 - 详情、去处理",
    "dataPermission": "操作：详情、去处理，根据当前登录用户针对对应任务的权限决定；（C端的申请记录需要登录账号有顶级机构权限才能看，入库详情必须要有对应仓库权限才能看）",
    "changeNote": "5.4.3版本取消",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "215",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "cancelled",
    "pagePathSegments": [
      "客户需求审批",
      "客户出库需求"
    ],
    "pagePath": "客户需求审批 / 客户出库需求",
    "legacyPath": "项目监管-审批-客户出库需求",
    "actionPermissions": "查看(页面)、 出库 - 详情、去处理",
    "dataPermission": "操作：详情、去处理，根据当前登录用户针对对应任务的权限决定；（C端的申请记录需要登录账号有顶级机构权限才能看，入库详情必须要有对应仓库权限才能看）",
    "changeNote": "5.4.3版本取消",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "216",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "客户需求审批",
      "客户入库预约"
    ],
    "pagePath": "客户需求审批 / 客户入库预约",
    "legacyPath": "客户入库需求优化升级",
    "actionPermissions": "查看页面、查看详情、去处理",
    "dataPermission": "可见数据根据当前登录账号的角色的仓库权限决定",
    "changeNote": "替代原客户入库需求",
    "createdAt": "2026-05-13",
    "updatedAt": "2026-08-31"
  },
  {
    "id": "217",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "客户需求审批",
      "客户出库预约"
    ],
    "pagePath": "客户需求审批 / 客户出库预约",
    "legacyPath": "客户出库需求优化升级",
    "actionPermissions": "查看页面、查看详情、去处理",
    "dataPermission": "可见数据根据当前登录账号的角色的仓库权限决定",
    "changeNote": "替代原客户出库需求",
    "createdAt": "2026-05-13",
    "updatedAt": "2026-08-31"
  },
  {
    "id": "218",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "客户需求审批",
      "客户融资需求线索"
    ],
    "pagePath": "客户需求审批 / 客户融资需求线索",
    "legacyPath": "项目监管-审批-客户融资需求",
    "actionPermissions": "查看(页面)、详情、驳回（操作权限+数据状态为未分配可用）、分配/再次分配、审核记录、任务详情、任务驳回、任务分配",
    "dataPermission": "有融资申请审核权限的账号可看到所有融资申请信息 根据登录账号针对具体任务的操作权限决定；",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": "2026-07-28"
  },
  {
    "id": "219",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "客户需求审批",
      "尽调办理"
    ],
    "pagePath": "客户需求审批 / 尽调办理",
    "legacyPath": "",
    "actionPermissions": "-、查看页面、查看详情、尽调办理",
    "dataPermission": "",
    "changeNote": "仅作为联登智风控的入口，联登成功后跳转到智风控平台任务列表页面",
    "createdAt": "2026-05-12",
    "updatedAt": ""
  },
  {
    "id": "220",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "客户需求审批",
      "客户销售需求"
    ],
    "pagePath": "客户需求审批 / 客户销售需求",
    "legacyPath": "项目监管-审批-客户销售需求",
    "actionPermissions": "查看(页面)、详情、去处理、审核记录、任务详情、任务处理、查看详情",
    "dataPermission": "有菜单权限的账号可看到所有线索； 登录账号的操作权限决定操作权限，且 去处理 按钮还需要根据线索审核状态为已处理则不允许再次处理",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "221",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "客户需求审批",
      "客户采购需求"
    ],
    "pagePath": "客户需求审批 / 客户采购需求",
    "legacyPath": "项目监管-审批-客户采购需求",
    "actionPermissions": "查看(页面)、详情、去处理、审核记录、任务详情、任务处理、查看详情",
    "dataPermission": "有菜单权限的账号可看到所有采购需求申请； 登录账号的操作权限决定操作权限，且 去处理 按钮还需要根据采购需求申请审核状态为已处理则不允许再次处理",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "222",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "其他审批",
      "政策资讯审核"
    ],
    "pagePath": "其他审批 / 政策资讯审核",
    "legacyPath": "项目监管-审批-政策资讯审核",
    "actionPermissions": "查看(页面)、预览、去处理、审核记录、任务详情、任务处理、查看详情",
    "dataPermission": "有菜单权限的账号可看到所有线索； 登录账号的操作权限决定操作权限，且 去处理 按钮还需要根据资讯审核状态为已处理则不允许再次处理",
    "changeNote": "",
    "createdAt": "2026-03-10",
    "updatedAt": ""
  },
  {
    "id": "223",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "其他审批",
      "开锁审批"
    ],
    "pagePath": "其他审批 / 开锁审批",
    "legacyPath": "业务办理-其他审批-开锁审批",
    "actionPermissions": "查看页面、详情、通过、驳回、审核记录、查看详情、去处理",
    "dataPermission": "须为 eligible 审批人且具备门禁仓库数据权限；列表按租户与仓库过滤",
    "changeNote": "6.2 新增；不进平台待处理池",
    "createdAt": "2026-08-25",
    "updatedAt": "2026-08-31"
  },
  {
    "id": "224",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端H5/03-业务办理",
    "recordStatus": "active",
    "pagePathSegments": [
      "其他审批",
      "贷中风控处理"
    ],
    "pagePath": "其他审批 / 贷中风控处理",
    "legacyPath": "",
    "actionPermissions": "查看(页面)、去处理、查看页面、查看详情",
    "dataPermission": "",
    "changeNote": "仅作为联登智风控的入口，联登成功后跳转到智风控平台任务列表页面",
    "createdAt": "2026-05-12",
    "updatedAt": ""
  },
  {
    "id": "225",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端PC/02-用户中心/01-合作方档案/04-1-货主信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "用户中心",
      "货主信息"
    ],
    "pagePath": "用户中心 / 货主信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增档案、编辑、冻结/解冻、新增货主、追加、补全、验证",
    "dataPermission": "按菜单独立授权；与 PC 共用主数据",
    "changeNote": "6.3 P1：H5 四入口之一（不含改址与保存并验证）",
    "createdAt": "2026-10-20",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "226",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端PC/02-用户中心/01-合作方档案/04-2-提货人信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "用户中心",
      "提货人信息"
    ],
    "pagePath": "用户中心 / 提货人信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增档案、编辑、冻结/解冻、新增提货人、追加、验证",
    "dataPermission": "按菜单独立授权；与 PC 共用主数据",
    "changeNote": "6.3 P1：H5 四入口之一",
    "createdAt": "2026-10-20",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "227",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端PC/02-用户中心/01-合作方档案/04-3-资金方信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "用户中心",
      "资金方信息"
    ],
    "pagePath": "用户中心 / 资金方信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增档案、编辑、冻结/解冻、新增资金方、追加、验证",
    "dataPermission": "按菜单独立授权；与 PC 共用主数据",
    "changeNote": "6.3 P1：H5 四入口之一",
    "createdAt": "2026-10-20",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "228",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端PC/02-用户中心/01-合作方档案/04-4-服务方信息",
    "recordStatus": "active",
    "pagePathSegments": [
      "用户中心",
      "服务方信息"
    ],
    "pagePath": "用户中心 / 服务方信息",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、新增档案、编辑、冻结/解冻、新增服务方、追加、验证",
    "dataPermission": "按菜单独立授权；与 PC 共用主数据",
    "changeNote": "6.3 P1：H5 四入口之一",
    "createdAt": "2026-10-20",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "229",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端PC/03-仓储/04-库存查询-库存流水",
    "recordStatus": "active",
    "pagePathSegments": [
      "仓储",
      "库存流水"
    ],
    "pagePath": "仓储 / 库存流水",
    "legacyPath": "-",
    "actionPermissions": "查看页面、详情、单据下载、下载记录、查看详情",
    "dataPermission": "仓库权限",
    "changeNote": "6.3 新增工作台磁贴（与 PC 库存流水同源）",
    "createdAt": "2026-11-11",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "230",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端PC/01-工作中心/01-审批中心/03-业务审批/04-监管委托受理",
    "recordStatus": "active",
    "pagePathSegments": [
      "内部审批",
      "监管委托受理"
    ],
    "pagePath": "内部审批 / 监管委托受理",
    "legacyPath": "-",
    "actionPermissions": "查看页面、查看详情、去处理、审核记录、处理记录",
    "dataPermission": "任务数据权限",
    "changeNote": "6.3 与 PC 审批中心「监管委托受理」对齐",
    "createdAt": "2026-11-11",
    "updatedAt": "2026-11-11"
  },
  {
    "id": "231",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端PC/11-合同签署/02-合同签署中心-我的合同",
    "recordStatus": "planned",
    "pagePathSegments": [
      "合同签署",
      "我的合同"
    ],
    "pagePath": "合同签署 / 我的合同",
    "legacyPath": "-",
    "actionPermissions": "发起、下载、查看详情、查看合同、编辑、删除",
    "dataPermission": "功能权限",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 补齐；H5 原型未建，按角色矩阵预留",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "232",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端PC/11-合同签署/03-合同签署中心-合同台账",
    "recordStatus": "planned",
    "pagePathSegments": [
      "合同签署",
      "合同台账"
    ],
    "pagePath": "合同签署 / 合同台账",
    "legacyPath": "-",
    "actionPermissions": "发起、下载、查看详情、查看合同、编辑、删除",
    "dataPermission": "功能权限",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 补齐；H5 原型未建，按角色矩阵预留",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "233",
    "platform": "移动",
    "module": "2.工作台",
    "topBarModuleLabel": "工作台",
    "menuModuleCode": "02-工作台",
    "baselineModuleDir": "B端PC/07-物联网IOT与预警/02-预警信息/04风险公示",
    "recordStatus": "planned",
    "pagePathSegments": [
      "风控",
      "风险公示"
    ],
    "pagePath": "风控 / 风险公示",
    "legacyPath": "-",
    "actionPermissions": "详情、查看公示记录、查看公示结果",
    "dataPermission": "订单数据权限；资方仅看最终结果，监管方发布/取消",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 补齐；更名为「风险公示记录」；H5 原型未建，按角色矩阵预留",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "234",
    "platform": "移动",
    "module": "3.业务办理",
    "topBarModuleLabel": "业务办理",
    "menuModuleCode": "03-业务办理",
    "baselineModuleDir": "B端PC/11-合同签署/02-合同签署中心-我的合同",
    "recordStatus": "planned",
    "pagePathSegments": [
      "业务发起",
      "发起签署"
    ],
    "pagePath": "业务发起 / 发起签署",
    "legacyPath": "-",
    "actionPermissions": "查看页面、查看详情",
    "dataPermission": "按登录账号权限过滤",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 补齐；H5 原型未建，按角色矩阵预留",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "235",
    "platform": "SAAS",
    "module": "14.SAAS运营端",
    "topBarModuleLabel": "SAAS运营端",
    "menuModuleCode": "14-SAAS运营",
    "baselineModuleDir": "SAAS运营端/",
    "recordStatus": "active",
    "pagePathSegments": [
      "系统管理",
      "部门管理"
    ],
    "pagePath": "系统管理 / 部门管理",
    "legacyPath": "-",
    "actionPermissions": "部门新增、添加下级、部门编辑、部门详情、部门启停用、部门删除",
    "dataPermission": "平台运营方专属系统与机构/租户管理",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "236",
    "platform": "SAAS",
    "module": "14.SAAS运营端",
    "topBarModuleLabel": "SAAS运营端",
    "menuModuleCode": "14-SAAS运营",
    "baselineModuleDir": "SAAS运营端/",
    "recordStatus": "active",
    "pagePathSegments": [
      "系统管理",
      "角色管理"
    ],
    "pagePath": "系统管理 / 角色管理",
    "legacyPath": "-",
    "actionPermissions": "角色新增、角色编辑、角色详情、角色启停用、角色删除",
    "dataPermission": "平台运营方专属系统与机构/租户管理",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "237",
    "platform": "SAAS",
    "module": "14.SAAS运营端",
    "topBarModuleLabel": "SAAS运营端",
    "menuModuleCode": "14-SAAS运营",
    "baselineModuleDir": "SAAS运营端/",
    "recordStatus": "active",
    "pagePathSegments": [
      "系统管理",
      "账号管理"
    ],
    "pagePath": "系统管理 / 账号管理",
    "legacyPath": "-",
    "actionPermissions": "账号新增、账号编辑、账号详情、账号启停用、账号删除",
    "dataPermission": "平台运营方专属系统与机构/租户管理",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "238",
    "platform": "SAAS",
    "module": "14.SAAS运营端",
    "topBarModuleLabel": "SAAS运营端",
    "menuModuleCode": "14-SAAS运营",
    "baselineModuleDir": "SAAS运营端/",
    "recordStatus": "active",
    "pagePathSegments": [
      "系统管理",
      "机构管理"
    ],
    "pagePath": "系统管理 / 机构管理",
    "legacyPath": "-",
    "actionPermissions": "机构新增、机构编辑、机构详情、机构启停用、机构删除、发送通知",
    "dataPermission": "平台运营方专属系统与机构/租户管理",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "239",
    "platform": "C端PC",
    "module": "12.C端门户",
    "topBarModuleLabel": "C端门户",
    "menuModuleCode": "12-C端PC",
    "baselineModuleDir": "C端PC/",
    "recordStatus": "active",
    "pagePathSegments": [
      "首页"
    ],
    "pagePath": "首页",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "240",
    "platform": "C端PC",
    "module": "12.C端门户",
    "topBarModuleLabel": "C端门户",
    "menuModuleCode": "12-C端PC",
    "baselineModuleDir": "C端PC/",
    "recordStatus": "active",
    "pagePathSegments": [
      "货物线索"
    ],
    "pagePath": "货物线索",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "241",
    "platform": "C端PC",
    "module": "12.C端门户",
    "topBarModuleLabel": "C端门户",
    "menuModuleCode": "12-C端PC",
    "baselineModuleDir": "C端PC/",
    "recordStatus": "active",
    "pagePathSegments": [
      "需求大厅"
    ],
    "pagePath": "需求大厅",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "242",
    "platform": "C端PC",
    "module": "12.C端门户",
    "topBarModuleLabel": "C端门户",
    "menuModuleCode": "12-C端PC",
    "baselineModuleDir": "C端PC/",
    "recordStatus": "active",
    "pagePathSegments": [
      "价格走势"
    ],
    "pagePath": "价格走势",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "243",
    "platform": "C端PC",
    "module": "12.C端门户",
    "topBarModuleLabel": "C端门户",
    "menuModuleCode": "12-C端PC",
    "baselineModuleDir": "C端PC/",
    "recordStatus": "active",
    "pagePathSegments": [
      "合作仓库"
    ],
    "pagePath": "合作仓库",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "244",
    "platform": "C端PC",
    "module": "12.C端门户",
    "topBarModuleLabel": "C端门户",
    "menuModuleCode": "12-C端PC",
    "baselineModuleDir": "C端PC/",
    "recordStatus": "active",
    "pagePathSegments": [
      "政策资讯"
    ],
    "pagePath": "政策资讯",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "245",
    "platform": "C端PC",
    "module": "12.C端门户",
    "topBarModuleLabel": "C端门户",
    "menuModuleCode": "12-C端PC",
    "baselineModuleDir": "C端PC/",
    "recordStatus": "active",
    "pagePathSegments": [
      "关于我们"
    ],
    "pagePath": "关于我们",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "246",
    "platform": "C端PC",
    "module": "12.C端门户",
    "topBarModuleLabel": "C端门户",
    "menuModuleCode": "12-C端PC",
    "baselineModuleDir": "C端PC/",
    "recordStatus": "active",
    "pagePathSegments": [
      "个人中心"
    ],
    "pagePath": "个人中心",
    "legacyPath": "-",
    "actionPermissions": "个人认证、企业认证、用户协议、我的关注、货物线索、融资记录、仓单、我的货物、出入库预约",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "247",
    "platform": "C端H5",
    "module": "13.C端移动端",
    "topBarModuleLabel": "C端移动端",
    "menuModuleCode": "13-C端H5",
    "baselineModuleDir": "C端H5/",
    "recordStatus": "active",
    "pagePathSegments": [
      "首页"
    ],
    "pagePath": "首页",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "248",
    "platform": "C端H5",
    "module": "13.C端移动端",
    "topBarModuleLabel": "C端移动端",
    "menuModuleCode": "13-C端H5",
    "baselineModuleDir": "C端H5/",
    "recordStatus": "active",
    "pagePathSegments": [
      "货物线索"
    ],
    "pagePath": "货物线索",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "249",
    "platform": "C端H5",
    "module": "13.C端移动端",
    "topBarModuleLabel": "C端移动端",
    "menuModuleCode": "13-C端H5",
    "baselineModuleDir": "C端H5/",
    "recordStatus": "active",
    "pagePathSegments": [
      "需求大厅"
    ],
    "pagePath": "需求大厅",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "250",
    "platform": "C端H5",
    "module": "13.C端移动端",
    "topBarModuleLabel": "C端移动端",
    "menuModuleCode": "13-C端H5",
    "baselineModuleDir": "C端H5/",
    "recordStatus": "active",
    "pagePathSegments": [
      "价格走势"
    ],
    "pagePath": "价格走势",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "251",
    "platform": "C端H5",
    "module": "13.C端移动端",
    "topBarModuleLabel": "C端移动端",
    "menuModuleCode": "13-C端H5",
    "baselineModuleDir": "C端H5/",
    "recordStatus": "active",
    "pagePathSegments": [
      "合作仓库"
    ],
    "pagePath": "合作仓库",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "252",
    "platform": "C端H5",
    "module": "13.C端移动端",
    "topBarModuleLabel": "C端移动端",
    "menuModuleCode": "13-C端H5",
    "baselineModuleDir": "C端H5/",
    "recordStatus": "active",
    "pagePathSegments": [
      "政策资讯"
    ],
    "pagePath": "政策资讯",
    "legacyPath": "-",
    "actionPermissions": "查看页面",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  },
  {
    "id": "253",
    "platform": "C端H5",
    "module": "13.C端移动端",
    "topBarModuleLabel": "C端移动端",
    "menuModuleCode": "13-C端H5",
    "baselineModuleDir": "C端H5/",
    "recordStatus": "active",
    "pagePathSegments": [
      "个人中心"
    ],
    "pagePath": "个人中心",
    "legacyPath": "-",
    "actionPermissions": "个人认证、企业认证、用户协议、我的关注、货物线索、融资记录、仓单、我的货物、出入库预约",
    "dataPermission": "门户端公开信息与客户互动大厅",
    "changeNote": "按 2026-11-10 角色按钮矩阵 TSV 并入；三件套待建",
    "createdAt": "2026-11-10",
    "updatedAt": "2026-11-10"
  }
]

export const permissionModuleTree = [
  "1.工作中心",
  "3.仓储",
  "4.融资/监管",
  "5.交易",
  "2.用户中心",
  "6.风控",
  "8.统计/看板",
  "9.结算",
  "10.配置管理",
  "11.合同签署",
  "7.物联网IOT与预警",
  "1.首页",
  "2.工作台",
  "3.业务办理",
  "14.SAAS运营端",
  "12.C端门户",
  "13.C端移动端"
]
