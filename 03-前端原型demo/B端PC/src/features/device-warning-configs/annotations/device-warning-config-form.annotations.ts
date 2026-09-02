import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningConfigFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-config-form-header",
    targetId: "device-warning-config-form-header",
    number: 1,
    kind: "页面",
    title: "设备预警配置表单 · 策略定义与生命周期",
    content: "录入或编辑设备策略，配置预警等级、设备范围、阈值条件、防抖参数及通知升级矩阵，支持瞬态/持续事件自动适配。",
    details: [
      {
        title: "配置提交流转与校验链路",
        items: [
          {
            label: "规则提交流转图",
            content: `flowchart TD
    A["表单录入 (基本信息/设备范围/阈值/防抖/通知升级)"] --> B{"R14 上线类互斥判定"}
    B -->|混配上线类与监控类| C["前端阻断 & Toast 提示单独配置"]
    B -->|合规| D{"R04/R05 设备唯一性校验"}
    D -->|设备+子类型已存在| E["拦截并提示已在其他生效规则中绑定"]
    D -->|校验通过| F["保存并生效规则"]
    F --> G["发布 DeviceWarningConfigSaved"]
    G --> H["防抖判定引擎热加载新规则"]`,
          },
          {
            label: "编辑与失效保护",
            content: "已失效规则（关联设备全部解绑）前端与服务端实施双重拦截，只允许查看不允许编辑或重新启用。",
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
    content: "规则名称必填、预警类型联动子类型枚举、预警等级读取 03/01 启用字典；设备上线类子类型须单独成规则（R14）。",
    details: [
      {
        title: "字段字典清单与校验规范",
        items: [
          {
            label: "规则名称 (rule_name) · 必填",
            content: "2~50 字符，建议包含设备类型与关键参数（如【1号冷库温湿度超限预警】）。",
          },
          {
            label: "预警大类 / 子类型 (warn_type / sub_type) · 必填",
            content: "大类支持安防类、离线类、传感器环境类、生命周期类等；选择大类后联动过滤对应子类型枚举。",
          },
          {
            label: "预警等级下拉 (severity_level_id) · 必填",
            content: "下拉展示 03/01 等级编码、名称与颜色色块；仅展示当前启用的等级档位，提交稳定 UUID。",
          },
          {
            label: "子类型互斥 (R14)",
            content: "「xxx设备上线」与其他运营监控类子类型不可混选；点击上线类自动取消其他项，点击其他类自动取消上线类。",
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
    title: "监控设备范围配置与互斥约束",
    content: "支持单选【仅针对新设备】或【选择现有设备】并勾选多台目标硬件；全局新设备仅适用于唯一选中的设备上线子类型。",
    details: [
      {
        title: "设备选择与互斥规则清单",
        items: [
          {
            label: "唯一性约束 (R04)",
            content: "同一台设备与同一个预警子类型在租户内只能归属于一条生效中规则，已绑定的设备在弹窗中置灰不可选。",
          },
          {
            label: "上线类互斥 (R14)",
            content: "设备上线通知须单独配置，不可与其他子类型组合；勾选「仅针对新设备」时子类型锁定为当前大类的 xxx设备上线。",
          },
          {
            label: "全局新设备 (R05/R13)",
            content: "每预警大类仅允许 1 条生效中的全局新设备规则；勾选后隐藏设备选择与升级预警配置。",
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
    content: "按子类型自动适配阈值表单结构，并动态控制防抖配置模式（瞬态 vs 持续）。",
    details: [
      {
        title: "防抖配置模式与字段",
        items: [
          {
            label: "瞬态事件（防拆/撞击/破门）",
            content: "防抖模式置灰锁定，显示【瞬态事件即时触发】，无防抖窗口，0 延迟上报告警。",
          },
          {
            label: "持续事件（温湿度/离线/电压）",
            content: "可选择【持续时长】（单位：分钟，如 >= 15 分钟）或【连续次数】（单位：次，如连续采样 >= 3 次），有效过滤传感器毛刺波动。",
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
            content: "按需选择短信、邮件等外部通知渠道；系统小角标自动更新，至少指定一位预警接收人。",
          },
          {
            label: "超时升级天数 (escalation_days)",
            content: "配置升级天数（如 1~30 天）及升级对象；超时未处置时自动向升级对象追加督办，未配置则不触发升级。",
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
    title: "保存提交与离开拦截控制",
    content: "保存提交前进行全字段校验，表单脏数据未保存离开时弹出确认拦截。",
    details: [
      {
        title: "提交体验与错误指引",
        items: [
          {
            label: "校验提示",
            content: "校验失败时精准定位到出错字段并高亮红框提示；R14 混选阻断时 Toast「设备上线通知需单独配置，不可与其他预警子类型组合」。",
          },
          {
            label: "防未保存丢失拦截",
            content: "表单处于 Dirty 状态时点击取消或切换路由弹出离开确认框，防止数据意外丢失。",
          },
        ],
      },
    ],
  },
]
