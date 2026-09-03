// 自动生成，请勿手工编辑。运行 npm run generate:iterations 更新。
// 数据源：02-PRD文档/B-迭代需求/{版本}/00-菜单迭代记录.md
// 索引说明：02-PRD文档/B-迭代需求/00-菜单迭代记录/README.md

export type IterationPlatform = "PC" | "移动" | "双端"

export type IterationChangeType = "新增" | "更名" | "迁移" | "取消" | "结构"

export type IterationVersionMeta = {
  version: string
  name: string
  period: string
  summary: string
  docPath: string
  recordPath: string
}

export type IterationRecordEntry = {
  id: string
  version: string
  platform: IterationPlatform
  type: IterationChangeType
  title: string
  before: string
  after: string
  note: string
  date: string
  sourceDoc: string
}

export const ITERATION_RECORD_LABEL = "迭代记录"

export const iterationVersions: IterationVersionMeta[] = [
  {
    "version": "6.2",
    "name": "6.2版本（2026.08）",
    "period": "2026.08",
    "summary": "物联网 IOT、运行时预警、预警配置三主干 + 门禁开锁审批链路（06/07）",
    "docPath": "B-迭代需求/6.2版本（2026.08）/README.md",
    "recordPath": "B-迭代需求/6.2版本（2026.08）/00-菜单迭代记录.md"
  },
  {
    "version": "6.1",
    "name": "6.1版本（2026.07）",
    "period": "2026.07",
    "summary": "仓库主档、货品规格、加工监管与线上抵质押基础规格",
    "docPath": "B-迭代需求/6.1版本（2026.07）/",
    "recordPath": "B-迭代需求/6.1版本（2026.07）/00-菜单迭代记录.md"
  }
]

export const iterationRecords: IterationRecordEntry[] = [
  {
    "id": "1",
    "version": "6.2",
    "platform": "PC",
    "type": "更名",
    "title": "顶栏「首页」更名为「工作中心」",
    "before": "1.首页",
    "after": "1.工作中心",
    "note": "权限清单、菜单地图、原型顶栏已统一；历史草稿 CSV 仍可能残留旧名",
    "date": "2026-08",
    "sourceDoc": "B端PC/00-菜单地图.md"
  },
  {
    "id": "2",
    "version": "6.2",
    "platform": "双端",
    "type": "新增",
    "title": "门禁开锁审批专网专道",
    "before": "",
    "after": "PC：工作中心 → 审批中心 → 其他审批 → 开锁审核；H5：业务办理 → 其他审批 → 开锁审批",
    "note": "不进常规「待处理/已处理」池；配置入口：配置管理 → 业务流程管理 → 开锁审批",
    "date": "2026-08",
    "sourceDoc": "06-门禁开锁审批/门禁开锁审批总索引.md"
  },
  {
    "id": "3",
    "version": "6.2",
    "platform": "PC",
    "type": "新增",
    "title": "预警等级公共底座（03/01）",
    "before": "",
    "after": "物联网IOT与预警 / 预警配置 / 预警等级",
    "note": "单租户 2~20 档动态字典",
    "date": "2026-08",
    "sourceDoc": "03-预警配置/01预警等级/预警等级主PRD.md"
  },
  {
    "id": "4",
    "version": "6.2",
    "platform": "PC",
    "type": "结构",
    "title": "新增顶栏「物联网IOT与预警」",
    "before": "8 顶栏模块",
    "after": "9 顶栏模块（插入 #6）",
    "note": "6.2 原型顶栏已独立；上线前基准菜单地图仍按采集 8 模块",
    "date": "2026-08",
    "sourceDoc": "00-PC菜单地图（目标态）.md"
  },
  {
    "id": "5",
    "version": "6.2",
    "platform": "PC",
    "type": "迁移",
    "title": "仓储·设备管理 → 物联网IOT管理",
    "before": "仓储 / 设备管理 / *",
    "after": "物联网IOT与预警 / 物联网IOT管理 / *",
    "note": "监控/门禁/物联/GPS/人脸 5 页；门禁事务记录取消合流",
    "date": "2026-08",
    "sourceDoc": "01-物联网IOT管理/物联网IOT管理总索引.md"
  },
  {
    "id": "6",
    "version": "6.2",
    "platform": "PC",
    "type": "迁移",
    "title": "风控·风险信息 → 预警信息",
    "before": "风控 / 风险信息 / *",
    "after": "物联网IOT与预警 / 预警信息 / *",
    "note": "设备/押品预警、贷中、风险公示；设备事务通知信息取消合流",
    "date": "2026-08",
    "sourceDoc": "02-预警信息/预警信息总索引.md"
  },
  {
    "id": "7",
    "version": "6.2",
    "platform": "PC",
    "type": "迁移",
    "title": "配置·风险管理（预警类）→ 预警配置",
    "before": "配置管理 / 预警配置 / *",
    "after": "物联网IOT与预警 / 预警配置 / *",
    "note": "预警等级、设备/订单预警配置；设备事务通知配置取消合流",
    "date": "2026-08",
    "sourceDoc": "03-预警配置/预警配置总索引.md"
  },
  {
    "id": "8",
    "version": "6.2",
    "platform": "PC",
    "type": "取消",
    "title": "门禁事务记录独立菜单",
    "before": "仓储 / 设备管理 / 门禁事务记录",
    "after": "",
    "note": "合入设备预警信息流水",
    "date": "2026-08",
    "sourceDoc": "04-历史迁移与割接方案/6.1→6.2 三旧模块兼容总说明.md"
  },
  {
    "id": "9",
    "version": "6.2",
    "platform": "PC",
    "type": "取消",
    "title": "设备事务通知信息/配置",
    "before": "风控·风险信息、配置·风险管理",
    "after": "",
    "note": "合入设备预警信息/设备预警配置",
    "date": "2026-08",
    "sourceDoc": "同上"
  },
  {
    "id": "10",
    "version": "6.2",
    "platform": "移动",
    "type": "更名",
    "title": "H5「业务概览」更名为「内部审批」",
    "before": "业务办理 / 业务概览",
    "after": "业务办理 / 内部审批",
    "note": "菜单地图 V3.2 与 mobileMenuData 已对齐",
    "date": "2026-08",
    "sourceDoc": "B端H5/00-菜单地图.md"
  },
  {
    "id": "11",
    "version": "6.2",
    "platform": "双端",
    "type": "更名",
    "title": "客户入/出库「需求」升级为「预约」",
    "before": "客户入库需求 / 客户出库需求",
    "after": "客户入库预约 / 客户出库预约",
    "note": "原「需求」菜单已标记 cancelled；PC 工作中心与 H5 业务办理均已收录预约页",
    "date": "2026-08",
    "sourceDoc": "功能与数据权限清单.csv"
  },
  {
    "id": "12",
    "version": "6.2",
    "platform": "双端",
    "type": "更名",
    "title": "融资授信办理命名统一",
    "before": "客户融资需求 / 客户融资需求分配授信办理 / 客户融资需求管理授信办理",
    "after": "客户融资需求线索 / 客户融资授信办理",
    "note": "",
    "date": "2026-08",
    "sourceDoc": "功能与数据权限清单.csv"
  },
  {
    "id": "13",
    "version": "6.2",
    "platform": "PC",
    "type": "新增",
    "title": "风险公示独立页",
    "before": "",
    "after": "物联网IOT与预警 / 预警信息 / 风险公示",
    "note": "取消公示须 R-RISK-MGR 权限",
    "date": "2026-08",
    "sourceDoc": "02-预警信息/04风险公示/风险公示主PRD.md"
  },
  {
    "id": "14",
    "version": "6.1",
    "platform": "双端",
    "type": "新增",
    "title": "加工管理 · 加工记录",
    "before": "",
    "after": "仓储 → 加工管理 → 加工记录",
    "note": "6.1 新增加工监管能力",
    "date": "2026-07",
    "sourceDoc": "加工管理/加工管理主PRD.md"
  },
  {
    "id": "15",
    "version": "6.1",
    "platform": "双端",
    "type": "新增",
    "title": "线上抵质押办理",
    "before": "",
    "after": "融资/监管 → 线上抵质押办理",
    "note": "从客户融资授信办理流程中拆分",
    "date": "2026-07",
    "sourceDoc": "融资管理/04线上抵质押办理/线上抵质押办理主PRD.md"
  },
  {
    "id": "16",
    "version": "6.1",
    "platform": "PC",
    "type": "新增",
    "title": "货品规格管理（大类/品类/货品）",
    "before": "",
    "after": "配置管理 → 货品规格管理",
    "note": "6.1 主数据规格体系",
    "date": "2026-07",
    "sourceDoc": "货品规格管理/01大类管理/大类管理主PRD.md"
  }
]
