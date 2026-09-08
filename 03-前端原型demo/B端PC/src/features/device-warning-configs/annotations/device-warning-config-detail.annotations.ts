import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningConfigDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-config-detail-header",
    targetId: "device-warning-config-detail-header",
    number: 1,
    kind: "页面",
    title: "设备预警配置详情与状态流转",
    content: "展示单条设备预警规则的完整策略定义、监控设备清单、阈值条件、规则 Version 及通知升级矩阵。",
    details: [
      {
        title: "规则状态生命周期与操作",
        items: [
          {
            label: "状态流转图",
            content: `flowchart TD
    A["生效中 (ACTIVE)"] -->|"人工停用"| B["停用 (DISABLED)"]
    B -->|"重新启用"| A
    A -->|"关联设备全部解绑"| C["已失效 (EXPIRED / 不可逆)"]
    A -->|"软删除"| D["已删除 (DELETED)"]
    A -->|"编辑保存"| E["Version+1 (C08)"]
    E --> A`,
          },
          {
            label: "页头动作与权限",
            content: "支持【编辑】（仅生效中/停用可用）、【停用】/【启用】切换及【删除】操作；已失效状态展示具体失效原因（如【关联设备全部已注销/解绑】）。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-detail-base",
    targetId: "device-warning-config-detail-base",
    number: 2,
    kind: "字段",
    title: "基本信息与预警等级画像",
    content: "展示规则名称、预警大类、预警子类型、绑定的预警等级色块、规则 Version 与规则状态。",
    details: [
      {
        title: "核心字段字典清单",
        items: [
          {
            label: "预警等级标签 (severity_level)",
            content: "读取 03/01 字典的等级色块与显示名称，直观呈现严重程度。",
          },
          {
            label: "预警子类型 (sub_type)",
            content: "展示标准枚举子类型；设备上线类规则仅含单一上线子类型，不与其他监控类混配（R14）。",
          },
          {
            label: "处置策略 (disposition_mode)",
            content: "Badge 展示：触发即结案 / 人工解除结案 / 恢复自动结案；固化入 02/01 规则快照，决定落账初态与 R14'/R03 结案路径。",
          },
          {
            label: "规则 Version",
            content: "当前生效版本号；编辑保存后递增，不回写既有未处理流水，等待下一次厂商回调按最新 Version 落账（C08）。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-detail-scope",
    targetId: "device-warning-config-detail-scope",
    number: 3,
    kind: "字段",
    title: "生效设备范围与设备清单",
    content: "展示规则是作用于【仅针对新设备】还是绑定具体设备列表，支持展开查看关联设备清单。",
    details: [
      {
        title: "范围与清单展示规范",
        items: [
          {
            label: "全局新设备规则 (R05/R13)",
            content: "无需绑定设备 ID，未来任何新注册入库的同类硬件自动套用该告警基线策略；此类规则子类型仅能单选「xxx设备上线」（R14）。",
          },
          {
            label: "指定设备列表",
            content: "展开表格展示设备编码、设备名称、设备类型及当前所在仓库/库位，支持快速穿透设备资产台账。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-detail-threshold",
    targetId: "device-warning-config-detail-threshold",
    number: 4,
    kind: "规则",
    title: "监控阈值与厂商预过滤",
    content: "展示数值阈值或事件型触发条件；平台不再配置防抖，事件预过滤与去抖由设备厂商侧完成后再回调平台。",
    details: [
      {
        title: "阈值规格",
        items: [
          {
            label: "瞬态安防事件",
            content: "如防拆报警、强行破门，展示事件型触发描述；厂商侧实时上报，平台直接接收回调落账。",
          },
          {
            label: "持续传感器事件",
            content: "如温湿度超标，展示数值上下限（如【温度 > 35℃】）；持续判定由厂商接入层完成，平台按回调逐条落账。",
          },
          {
            label: "厂商预过滤边界",
            content: "防抖、持续时长、连续次数等判定均在厂商侧完成；平台 03/02 仅维护阈值策略与通知升级，不再展示防抖配置项。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-detail-notify",
    targetId: "device-warning-config-detail-notify",
    number: 5,
    kind: "规则",
    title: "通知渠道与超时升级策略",
    content: "展示命中时触达的通知渠道、预警接收人，以及超时未处置时的升级天数与升级接收人。",
    details: [
      {
        title: "升级通知机制",
        items: [
          {
            label: "通知渠道",
            content: "支持短信、邮件多选组合推送；系统小角标在预警命中时自动更新。",
          },
          {
            label: "超时升级梯队",
            content: "配置超时 T 天未解除时向升级对象追加督办；处置策略为「触发即结案」时升级区隐藏（R15a）。升级计时以每条流水的预警时间为起点。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-detail-audit",
    targetId: "device-warning-config-detail-audit",
    number: 6,
    kind: "字段",
    title: "系统审计信息",
    content: "统一展示规则 Version、状态、创建人/创建时间与更新人/更新时间；已失效规则追加失效原因。",
    details: [
      {
        title: "配置审计字段",
        items: [
          {
            label: "创建/更新主体与时间",
            content: "创建与最近更新均展示操作主体和完整秒级时间戳，和设备预警配置列表保持一致。",
          },
          {
            label: "Version",
            content: "编辑保存后递增；该版本号与规则快照一起用于历史事件追溯。",
          },
        ],
      },
    ],
  },
]
