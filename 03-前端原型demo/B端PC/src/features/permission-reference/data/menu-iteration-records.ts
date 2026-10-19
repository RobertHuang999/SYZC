// 自动生成，请勿手工编辑。运行 npm run generate:iterations 更新。
// 数据源：02-PRD文档/B-迭代需求/{版本}/00-菜单迭代记录.md
// 索引说明：02-PRD文档/B-迭代需求/00-菜单迭代记录/README.md

export type IterationPlatform = "PC" | "移动" | "双端"

/** 含 6.3 菜单记录中的「修改 / 合并调整 / 模块重构 / 保留」等扩展类型 */
export type IterationChangeType = string

export type IterationScopeAnnotation = {
  tag: string
  meaning: string
  menus: string
}

export type IterationVersionMeta = {
  version: string
  name: string
  period: string
  summary: string
  docPath: string
  recordPath: string
  /** 可选 · 版本级交付范围标注（来自 Markdown「交付范围标注」节） */
  scopeAnnotations?: IterationScopeAnnotation[]
}

export type IterationRecordEntry = {
  id: string
  version: string
  platform: IterationPlatform
  type: IterationChangeType
  title: string
  before: string
  after: string
  /** 版本里程碑优先级，如 P0 / P1；无列或为空则留空 */
  priority: string
  /** 6.3 等版本的交付裁切标注：暂定 / 不涉及 / 暂定开发 / 必交付 */
  deliveryTag: string
  note: string
  date: string
  sourceDoc: string
}

export const ITERATION_RECORD_LABEL = "迭代记录"

export const iterationVersions: IterationVersionMeta[] = [
  {
    "version": "6.3",
    "name": "6.3版本（2026.09）",
    "period": "2026.09",
    "summary": "统一合作方主数据 + 个人货主证件地址规则 + 存量作业菜单主体引用改造",
    "docPath": "B-迭代需求/6.3版本（2026.09）/README.md",
    "recordPath": "B-迭代需求/6.3版本（2026.09）/00-菜单迭代记录.md",
    "scopeAnnotations": [
      {
        "tag": "暂定",
        "meaning": "规格可保留，本期不排研发、不上菜单",
        "menus": "配置管理 → 入库收集项配置；配置管理 → 货品管理（收集项 / 固定保质期等单位配置）"
      },
      {
        "tag": "不涉及",
        "meaning": "不在 6.3 改造范围，沿用基准版",
        "menus": "工作中心 → 客户入库预约（C 端客户入库信息 / 预约域，不做合作方引用协同）"
      },
      {
        "tag": "暂定开发",
        "meaning": "三件套已定，研发暂定排期，随迭代放开",
        "menus": "入库暂存登记（PC/H5 菜单、业务发起磁贴、入库记录 R32 通道与转正）"
      },
      {
        "tag": "必交付",
        "meaning": "6.3 合作方主线 P0/P1 必须上线",
        "menus": "合作方档案、基础配置准入、仓库管理、入库记录货主 R03、出库/提货/转让/客户管理等（见下表明细）"
      }
    ]
  },
  {
    "version": "6.2",
    "name": "6.2版本（2026.08）",
    "period": "2026.08",
    "summary": "物联网 IOT、运行时预警、预警配置三主干 + 门禁开锁审批链路（06/07）",
    "docPath": "B-迭代需求/6.2版本（2026.08）/README.md",
    "recordPath": "B-迭代需求/6.2版本（2026.08）/00-菜单迭代记录.md",
    "scopeAnnotations": []
  },
  {
    "version": "6.1",
    "name": "6.1版本（2026.07）",
    "period": "2026.07",
    "summary": "仓库主档、货品规格、加工监管与线上抵质押基础规格",
    "docPath": "B-迭代需求/6.1版本（2026.07）/",
    "recordPath": "B-迭代需求/6.1版本（2026.07）/00-菜单迭代记录.md",
    "scopeAnnotations": []
  }
]

export const iterationRecords: IterationRecordEntry[] = [
  {
    "id": "1",
    "version": "6.3",
    "platform": "PC",
    "type": "新增",
    "title": "合作方管理一级板块",
    "before": "",
    "after": "合作方管理 / 合作方档案",
    "priority": "P0",
    "deliveryTag": "必交付",
    "note": "业务主体主档入口",
    "date": "2026-09",
    "sourceDoc": "04-合作方档案/合作方档案主PRD.md"
  },
  {
    "id": "2",
    "version": "6.3",
    "platform": "PC",
    "type": "合并调整",
    "title": "合作方准入规则",
    "before": "配置管理 / 平台管理 / 合作方准入规则",
    "after": "并入基础配置（配置管理 / 平台管理 / 基础配置 / 合作方准入策略）",
    "priority": "P0",
    "deliveryTag": "必交付",
    "note": "原独立单页设置整合进基础配置，消灭独立冗余菜单；提供个人一人一址双开关、存量检测与放宽审计",
    "date": "2026-10",
    "sourceDoc": "02-平台管理-基础配置/基础配置主PRD.md"
  },
  {
    "id": "3",
    "version": "6.3",
    "platform": "PC",
    "type": "新增",
    "title": "入库收集项配置",
    "before": "",
    "after": "配置管理 / 货品规格管理 / 入库收集项配置",
    "priority": "暂定",
    "deliveryTag": "暂定",
    "note": "三件套保留；本期不交付菜单与研发",
    "date": "2026-10-19",
    "sourceDoc": "08-版本范围与里程碑.md"
  },
  {
    "id": "4",
    "version": "6.3",
    "platform": "PC",
    "type": "修改",
    "title": "客户管理",
    "before": "交易 / 客户管理",
    "after": "保留菜单，增加客户账号与合作方绑定",
    "priority": "P0",
    "deliveryTag": "必交付",
    "note": "C 端账号 不等于 业务主体",
    "date": "2026-09",
    "sourceDoc": "05-存量改造与关联业务协同/合作方改造-存量业务单据协同规格.md"
  },
  {
    "id": "5",
    "version": "6.3",
    "platform": "PC",
    "type": "保留",
    "title": "客户入库预约",
    "before": "工作中心 / 客户需求审批 / 客户入库预约",
    "after": "6.3 不涉及",
    "priority": "",
    "deliveryTag": "不涉及",
    "note": "C 端客户入库信息/预约域，不在合作方存量改造范围",
    "date": "2026-10-19",
    "sourceDoc": "08-版本范围与里程碑.md"
  },
  {
    "id": "6",
    "version": "6.3",
    "platform": "PC",
    "type": "修改",
    "title": "入库记录",
    "before": "仓储 / 入库管理 / 入库记录",
    "after": "合作方货主 R03 快捷建档；6.3 副本见 10 目录",
    "priority": "P0",
    "deliveryTag": "必交付",
    "note": "货主协同 必交付；暂存 R32 见「入库暂存登记」暂定开发",
    "date": "2026-10-19",
    "sourceDoc": "10-仓储管理-入库记录/入库记录主PRD.md"
  },
  {
    "id": "7",
    "version": "6.3",
    "platform": "PC",
    "type": "修改",
    "title": "出库记录",
    "before": "仓储 / 出库管理 / 出库记录",
    "after": "货主、提货主体、提货经办人引用合作方",
    "priority": "P0",
    "deliveryTag": "必交付",
    "note": "提货人不触发货主地址规则",
    "date": "2026-09",
    "sourceDoc": "05-存量改造与关联业务协同/合作方改造-存量业务单据协同规格.md"
  },
  {
    "id": "8",
    "version": "6.3",
    "platform": "PC",
    "type": "修改",
    "title": "提货单",
    "before": "仓储 / 货物管理 / 提货单",
    "after": "提货人引用合作方",
    "priority": "P0",
    "deliveryTag": "必交付",
    "note": "支持身份证/手机号检索",
    "date": "2026-09",
    "sourceDoc": "05-存量改造与关联业务协同/合作方改造-存量业务单据协同规格.md"
  },
  {
    "id": "9",
    "version": "6.3",
    "platform": "PC",
    "type": "修改",
    "title": "转让记录",
    "before": "仓储 / 货物管理 / 转让记录",
    "after": "接收方引用合作方",
    "priority": "P0",
    "deliveryTag": "必交付",
    "note": "转让生效变货主时执行地址规则",
    "date": "2026-09",
    "sourceDoc": "05-存量改造与关联业务协同/合作方改造-存量业务单据协同规格.md"
  },
  {
    "id": "10",
    "version": "6.3",
    "platform": "PC",
    "type": "修改",
    "title": "仓单管理",
    "before": "仓储 / 仓单管理",
    "after": "存货人/持有人引用合作方",
    "priority": "P1",
    "deliveryTag": "必交付",
    "note": "P0 存货人复用货主；持有人流水与质押联动为 P1",
    "date": "2026-09",
    "sourceDoc": "05-存量改造与关联业务协同/合作方改造-存量业务单据协同规格.md"
  },
  {
    "id": "11",
    "version": "6.3",
    "platform": "PC",
    "type": "保留",
    "title": "货品管理",
    "before": "配置管理 / 货品规格管理 / 货品管理",
    "after": "6.3 配置改造暂定",
    "priority": "暂定",
    "deliveryTag": "暂定",
    "note": "收集项/保质期等单位配置本期不做，沿用基准版",
    "date": "2026-10-19",
    "sourceDoc": "08-版本范围与里程碑.md"
  },
  {
    "id": "12",
    "version": "6.3",
    "platform": "PC",
    "type": "模块重构",
    "title": "基础配置",
    "before": "配置管理 / 平台管理 / 基础配置",
    "after": "基础配置（平台运行底座、垂直6大分类导航中心）",
    "priority": "P0",
    "deliveryTag": "必交付",
    "note": "纳管仓储作业参数（出入库受控库房联动、移库审核）、合作方准入策略、法律协议、9大数据源参数、9大硬件参数、邮件通道",
    "date": "2026-10",
    "sourceDoc": "02-平台管理-基础配置/基础配置主PRD.md"
  },
  {
    "id": "13",
    "version": "6.3",
    "platform": "PC",
    "type": "模块重构",
    "title": "仓库管理",
    "before": "配置管理 / 仓库管理 / 仓库管理",
    "after": "仓库管理（仓库主档、库房、分区空间监管）",
    "priority": "P0",
    "deliveryTag": "必交付",
    "note": "空间主档层级维护；库房出入库审核状态改为读取基础配置只读展示",
    "date": "2026-10",
    "sourceDoc": "03-仓库管理-仓库管理/仓库管理主PRD.md"
  },
  {
    "id": "14",
    "version": "6.3",
    "platform": "PC",
    "type": "新增",
    "title": "入库暂存登记",
    "before": "",
    "after": "仓储 / 入库管理 / 入库暂存登记",
    "priority": "暂定开发",
    "deliveryTag": "暂定开发",
    "note": "09 三件套为准；研发暂定排期，菜单/路由随迭代放开",
    "date": "2026-10-19",
    "sourceDoc": "09-仓储管理-入库暂存登记/入库暂存登记主PRD.md"
  },
  {
    "id": "15",
    "version": "6.3",
    "platform": "PC",
    "type": "修改",
    "title": "入库记录（暂存联动）",
    "before": "仓储 / 入库管理 / 入库记录",
    "after": "【入库暂存登记】通道与 R32 转正",
    "priority": "暂定开发",
    "deliveryTag": "暂定开发",
    "note": "与「入库暂存登记」同节奏放开通道与深链",
    "date": "2026-10-19",
    "sourceDoc": "10-仓储管理-入库记录/入库记录业务规则规格.md"
  },
  {
    "id": "16",
    "version": "6.3",
    "platform": "移动",
    "type": "新增",
    "title": "H5 入库暂存登记",
    "before": "",
    "after": "工作台 / 仓储 / 入库暂存登记",
    "priority": "暂定开发",
    "deliveryTag": "暂定开发",
    "note": "与 PC 一致",
    "date": "2026-10-19",
    "sourceDoc": "09-仓储管理-入库暂存登记/入库暂存登记主PRD.md"
  },
  {
    "id": "17",
    "version": "6.3",
    "platform": "移动",
    "type": "修改",
    "title": "H5 入库发起（暂存通道）",
    "before": "业务办理 / 业务发起 / 入库发起",
    "after": "「切换为暂存登记」与业务发起磁贴",
    "priority": "暂定开发",
    "deliveryTag": "暂定开发",
    "note": "随暂存登记研发进度展示",
    "date": "2026-10-19",
    "sourceDoc": "10-仓储管理-入库记录/入库记录业务规则规格.md"
  },
  {
    "id": "18",
    "version": "6.3",
    "platform": "PC",
    "type": "保留/澄清",
    "title": "机构管理、角色管理、账号管理",
    "before": "原菜单保留",
    "after": "边界澄清，不承担合作方主档职责",
    "priority": "",
    "deliveryTag": "",
    "note": "机构不等于合作方；仓库管理方不从合作方选择",
    "date": "2026-09",
    "sourceDoc": "2026.09.14合作方需求设计方案.md"
  },
  {
    "id": "19",
    "version": "6.3",
    "platform": "移动",
    "type": "新增",
    "title": "H5 合作方档案",
    "before": "",
    "after": "工作台 / 用户中心 / 合作方档案",
    "priority": "P1",
    "deliveryTag": "必交付",
    "note": "外勤列表/详情/悬浮新增；规则与 PC 共用；不含 PC 全量改址与「保存并验证」",
    "date": "2026-10",
    "sourceDoc": "04-合作方档案/合作方档案主PRD.md 6.6 节"
  },
  {
    "id": "20",
    "version": "6.3",
    "platform": "移动",
    "type": "保留",
    "title": "作业页内嵌合作方选择/创建",
    "before": "",
    "after": "不单独增菜单",
    "priority": "P2",
    "deliveryTag": "",
    "note": "入库等页面复用选择器与跳转详情",
    "date": "2026-09",
    "sourceDoc": "05-存量改造与关联业务协同/合作方改造-存量业务单据协同规格.md"
  },
  {
    "id": "21",
    "version": "6.2",
    "platform": "PC",
    "type": "更名",
    "title": "顶栏「首页」更名为「工作中心」",
    "before": "1.首页",
    "after": "1.工作中心",
    "priority": "",
    "deliveryTag": "",
    "note": "权限清单、菜单地图、原型顶栏已统一；历史草稿 CSV 仍可能残留旧名",
    "date": "2026-08",
    "sourceDoc": "B端PC/00-菜单地图.md"
  },
  {
    "id": "22",
    "version": "6.2",
    "platform": "双端",
    "type": "新增",
    "title": "门禁开锁审批专网专道",
    "before": "",
    "after": "PC：工作中心 → 审批中心 → 其他审批 → 开锁审核；H5：业务办理 → 其他审批 → 开锁审批",
    "priority": "",
    "deliveryTag": "",
    "note": "不进常规「待处理/已处理」池；配置入口：配置管理 → 业务流程管理 → 开锁审批",
    "date": "2026-08",
    "sourceDoc": "06-门禁开锁审批/门禁开锁审批总索引.md"
  },
  {
    "id": "23",
    "version": "6.2",
    "platform": "PC",
    "type": "新增",
    "title": "预警等级公共底座（03/01）",
    "before": "",
    "after": "物联网IOT与预警 / 预警配置 / 预警等级",
    "priority": "",
    "deliveryTag": "",
    "note": "单租户 2~20 档动态字典",
    "date": "2026-08",
    "sourceDoc": "03-预警配置/01预警等级/预警等级主PRD.md"
  },
  {
    "id": "24",
    "version": "6.2",
    "platform": "PC",
    "type": "结构",
    "title": "新增顶栏「物联网IOT与预警」",
    "before": "8 顶栏模块",
    "after": "9 顶栏模块（插入 #6）",
    "priority": "",
    "deliveryTag": "",
    "note": "6.2 原型顶栏已独立；上线前基准菜单地图仍按采集 8 模块",
    "date": "2026-08",
    "sourceDoc": "00-PC菜单地图（目标态）.md"
  },
  {
    "id": "25",
    "version": "6.2",
    "platform": "PC",
    "type": "迁移",
    "title": "仓储·设备管理 → 物联网IOT管理",
    "before": "仓储 / 设备管理 / *",
    "after": "物联网IOT与预警 / 物联网IOT管理 / *",
    "priority": "",
    "deliveryTag": "",
    "note": "监控/门禁/物联/GPS/人脸 5 页；门禁事务记录取消合流",
    "date": "2026-08",
    "sourceDoc": "01-物联网IOT管理/物联网IOT管理总索引.md"
  },
  {
    "id": "26",
    "version": "6.2",
    "platform": "PC",
    "type": "迁移",
    "title": "风控·风险信息 → 预警信息",
    "before": "风控 / 风险信息 / *",
    "after": "物联网IOT与预警 / 预警信息 / *",
    "priority": "",
    "deliveryTag": "",
    "note": "设备/押品预警、贷中、风险公示；设备事务通知信息取消合流",
    "date": "2026-08",
    "sourceDoc": "02-预警信息/预警信息总索引.md"
  },
  {
    "id": "27",
    "version": "6.2",
    "platform": "PC",
    "type": "迁移",
    "title": "配置·风险管理（预警类）→ 预警配置",
    "before": "配置管理 / 预警配置 / *",
    "after": "物联网IOT与预警 / 预警配置 / *",
    "priority": "",
    "deliveryTag": "",
    "note": "预警等级、设备/订单预警配置；设备事务通知配置取消合流",
    "date": "2026-08",
    "sourceDoc": "03-预警配置/预警配置总索引.md"
  },
  {
    "id": "28",
    "version": "6.2",
    "platform": "PC",
    "type": "取消",
    "title": "门禁事务记录独立菜单",
    "before": "仓储 / 设备管理 / 门禁事务记录",
    "after": "",
    "priority": "",
    "deliveryTag": "",
    "note": "合入设备预警信息流水",
    "date": "2026-08",
    "sourceDoc": "04-历史迁移与割接方案/6.1→6.2 三旧模块兼容总说明.md"
  },
  {
    "id": "29",
    "version": "6.2",
    "platform": "PC",
    "type": "取消",
    "title": "设备事务通知信息/配置",
    "before": "风控·风险信息、配置·风险管理",
    "after": "",
    "priority": "",
    "deliveryTag": "",
    "note": "合入设备预警信息/设备预警配置",
    "date": "2026-08",
    "sourceDoc": "同上"
  },
  {
    "id": "30",
    "version": "6.2",
    "platform": "PC",
    "type": "下线",
    "title": "供应链监管业务",
    "before": "融资/监管 / 监管业务 / 供应链监管业务",
    "after": "",
    "priority": "",
    "deliveryTag": "",
    "note": "菜单下线废弃（历史旧监管单据下线，收口为抵押/质押/监管服务体系）",
    "date": "2026-08",
    "sourceDoc": "功能与数据权限清单.csv"
  },
  {
    "id": "31",
    "version": "6.2",
    "platform": "移动",
    "type": "更名",
    "title": "H5「业务概览」更名为「内部审批」",
    "before": "业务办理 / 业务概览",
    "after": "业务办理 / 内部审批",
    "priority": "",
    "deliveryTag": "",
    "note": "菜单地图 V3.2 与 mobileMenuData 已对齐",
    "date": "2026-08",
    "sourceDoc": "B端H5/00-菜单地图.md"
  },
  {
    "id": "32",
    "version": "6.2",
    "platform": "双端",
    "type": "更名",
    "title": "客户入/出库「需求」升级为「预约」",
    "before": "客户入库需求 / 客户出库需求",
    "after": "客户入库预约 / 客户出库预约",
    "priority": "",
    "deliveryTag": "",
    "note": "原「需求」菜单已标记 cancelled；PC 工作中心与 H5 业务办理均已收录预约页",
    "date": "2026-08",
    "sourceDoc": "功能与数据权限清单.csv"
  },
  {
    "id": "33",
    "version": "6.2",
    "platform": "双端",
    "type": "更名",
    "title": "融资授信办理命名统一",
    "before": "客户融资需求 / 客户融资需求分配授信办理 / 客户融资需求管理授信办理",
    "after": "客户融资需求线索 / 客户融资授信办理",
    "priority": "",
    "deliveryTag": "",
    "note": "",
    "date": "2026-08",
    "sourceDoc": "功能与数据权限清单.csv"
  },
  {
    "id": "34",
    "version": "6.2",
    "platform": "PC",
    "type": "新增",
    "title": "风险公示独立页",
    "before": "",
    "after": "物联网IOT与预警 / 预警信息 / 风险公示",
    "priority": "",
    "deliveryTag": "",
    "note": "取消公示须 R-RISK-MGR 权限",
    "date": "2026-08",
    "sourceDoc": "02-预警信息/04风险公示/风险公示主PRD.md"
  },
  {
    "id": "35",
    "version": "6.1",
    "platform": "双端",
    "type": "新增",
    "title": "加工管理 · 加工记录",
    "before": "",
    "after": "仓储 → 加工管理 → 加工记录",
    "priority": "",
    "deliveryTag": "",
    "note": "6.1 新增加工监管能力",
    "date": "2026-07",
    "sourceDoc": "加工管理/加工管理主PRD.md"
  },
  {
    "id": "36",
    "version": "6.1",
    "platform": "双端",
    "type": "新增",
    "title": "线上抵质押办理",
    "before": "",
    "after": "融资/监管 → 线上抵质押办理",
    "priority": "",
    "deliveryTag": "",
    "note": "从客户融资授信办理流程中拆分",
    "date": "2026-07",
    "sourceDoc": "融资管理/04线上抵质押办理/线上抵质押办理主PRD.md"
  },
  {
    "id": "37",
    "version": "6.1",
    "platform": "PC",
    "type": "新增",
    "title": "货品规格管理（大类/品类/货品）",
    "before": "",
    "after": "配置管理 → 货品规格管理",
    "priority": "",
    "deliveryTag": "",
    "note": "6.1 主数据规格体系",
    "date": "2026-07",
    "sourceDoc": "货品规格管理/01大类管理/大类管理主PRD.md"
  },
  {
    "id": "63-1",
    "version": "6.2",
    "platform": "PC",
    "type": "重命名",
    "title": "线上监管业务办理",
    "before": "融资管理 / 融资结果/线上抵质押办理",
    "after": "融资管理 / 线上监管业务办理",
    "priority": "P1",
    "deliveryTag": "必交付",
    "note": "去掉「融资结果/」前缀",
    "date": "2026-10-19",
    "sourceDoc": "B-迭代需求/6.2版本（2026.08）/04-融资监管-菜单更名与监管管理口径.md"
  },
  {
    "id": "63-2",
    "version": "6.2",
    "platform": "双端",
    "type": "重命名",
    "title": "监管业务 / 监管办理 / 监管管理",
    "before": "抵质押业务 → 抵质押业务办理 / 抵质押业务管理",
    "after": "监管业务 → 监管办理 / 监管管理",
    "priority": "P1",
    "deliveryTag": "必交付",
    "note": "侧栏一级与二级菜单名词统一",
    "date": "2026-10-19",
    "sourceDoc": "B-迭代需求/6.2版本（2026.08）/04-融资监管-菜单更名与监管管理口径.md"
  },
  {
    "id": "63-3",
    "version": "6.2",
    "platform": "移动",
    "type": "结构合并",
    "title": "H5 监管管理",
    "before": "抵质押订单 + 监管订单（独立菜单）",
    "after": "监管管理（Tab：抵押/质押/监管服务）",
    "priority": "P1",
    "deliveryTag": "必交付",
    "note": "与 PC 三 Tab 对齐",
    "date": "2026-10-19",
    "sourceDoc": "B-迭代需求/6.2版本（2026.08）/04-融资监管-菜单更名与监管管理口径.md"
  }
]
