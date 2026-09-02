import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningConfigDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-config-detail-header",
    targetId: "device-warning-config-detail-header",
    number: 1,
    kind: "页面",
    title: "设备预警配置详情与状态流转",
    content: "展示单条设备预警规则的完整策略定义、监控设备清单、阈值防抖参数及通知升级矩阵。",
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
    A -->|"软删除"| D["已删除 (DELETED)"]`,
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
    content: "展示规则名称、预警大类、预警子类型、绑定的预警等级色块与规则状态。",
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
    title: "监控阈值与防抖判定模型",
    content: "区分瞬态安防事件与持续传感器事件，展示阈值条件、持续时长或连续次数判定规则。",
    details: [
      {
        title: "防抖模型规格",
        items: [
          {
            label: "瞬态安防事件",
            content: "如防拆报警、强行破门，防抖置灰并锁定为【即时触发】，0 延时上报保障安全。",
          },
          {
            label: "持续传感器事件",
            content: "如温湿度超标，支持【持续超标 M 分钟】或【连续 N 次采样超标】才判定为有效预警，过滤环境毛刺波动。",
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
            content: "配置超时 T 天未解除时，通知引擎自动向升级对象（如风控总监/主管）追加高优先级督办通知。",
          },
        ],
      },
    ],
  },
]
