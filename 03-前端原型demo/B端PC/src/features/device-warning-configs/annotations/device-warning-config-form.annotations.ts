import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningConfigFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-config-form-header",
    targetId: "device-warning-config-form-header",
    number: 1,
    kind: "页面",
    title: "设备预警配置表单",
    content: "录入或编辑设备策略，配置预警等级、设备范围、阈值条件、防抖参数及通知升级矩阵。",
    details: [
      {
        title: "编辑限制",
        items: [
          {
            label: "已失效规则拦截",
            content: "已失效规则不可编辑，前端与服务端实施双重拦截。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-form-base",
    targetId: "device-warning-config-form-base",
    number: 2,
    kind: "字段",
    title: "基本信息与预警等级选择",
    content: "规则名称必填、预警类型联动子类型枚举、预警等级读取 03/01 启用字典。",
    details: [
      {
        title: "字段与校验",
        items: [
          {
            label: "规则名称",
            content: "2~50 字符，建议包含设备类型与关键参数（如【1号冷库温湿度超限预警】）。",
          },
          {
            label: "等级下拉",
            content: "下拉展示等级编码、名称与颜色色块；提交 severity_level_id。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-form-scope",
    targetId: "device-warning-config-form-scope",
    number: 3,
    kind: "字段",
    title: "监控设备范围配置",
    content: "支持单选【仅针对新设备】或【选择现有设备】并勾选多台目标硬件。",
    details: [
      {
        title: "设备选择与互斥规则",
        items: [
          {
            label: "唯一性约束 (R04)",
            content: "同一台设备与同一个预警子类型在租户内只能归属于一条生效中规则，已绑定的设备在弹窗中置灰不可选。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-form-threshold",
    targetId: "device-warning-config-form-threshold",
    number: 4,
    kind: "规则",
    title: "阈值条件与防抖分流表单",
    content: "按子类型自动适配阈值表单结构，并动态控制防抖配置模式。",
    details: [
      {
        title: "防抖配置模式",
        items: [
          {
            label: "瞬态事件",
            content: "防抖模式不可选，提示【瞬态事件即时触发】。",
          },
          {
            label: "持续事件",
            content: "可选择【持续时长】（单位：分钟）或【连续次数】（单位：次）。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-form-notify",
    targetId: "device-warning-config-form-notify",
    number: 5,
    kind: "规则",
    title: "通知渠道与超时升级表单",
    content: "多选通知渠道、选择预警对象，并支持配置超时升级天数与升级对象。",
    details: [
      {
        title: "通知与升级约束",
        items: [
          {
            label: "预警对象与渠道必选",
            content: "至少选择一种通知渠道且至少指定一位预警接收人。",
          },
          {
            label: "超时升级天数",
            content: "配置升级天数（如 1~30 天）及升级对象，未配置则不触发升级。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-form-actions",
    targetId: "device-warning-config-form-actions",
    number: 6,
    kind: "交互",
    title: "保存提交与离开拦截",
    content: "保存提交前进行全字段校验，表单脏数据未保存离开时弹出确认拦截。",
    details: [
      {
        title: "提交体验",
        items: [
          {
            label: "校验提示",
            content: "校验失败时精准定位到出错字段并高亮红框提示。",
          },
        ],
      },
    ],
  },
]
