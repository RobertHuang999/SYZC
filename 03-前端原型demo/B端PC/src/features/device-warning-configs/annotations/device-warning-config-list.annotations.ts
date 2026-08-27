import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningConfigListAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-config-page",
    targetId: "device-warning-config-page",
    number: 1,
    kind: "页面",
    title: "设备预警配置定位与生命周期",
    content: "物联网 IoT 策略配置中枢，集中维护硬件资产的异常告警阈值、防抖模式与通知升级策略。",
    details: [
      {
        title: "规则生命周期流转图",
        items: [
          {
            label: "生命周期流转图",
            content: `flowchart TD
    A["设备预警配置表单"] -->|"保存生效/启用"| B["生效中 (监听事件)"]
    B -->|"人工停用/启用"| C["停用 (暂停引擎监听)"]
    C -->|"重新启用"| B
    B -->|"解绑全部关联设备"| D["已失效 (不可逆/禁编辑)"]
    B -->|"软删除"| E["配置已删除 (未处理流水置无效)"]`,
          },
          {
            label: "三态定义",
            content: "生效中（实时监听硬件流）、停用（策略暂停）、已失效（关联设备全部解绑时系统自动置为失效，不可逆不可编辑）。",
          },
        ],
      },
      {
        title: "与预警等级字典协同",
        items: [
          {
            label: "等级字典绑定",
            content: "预警等级下拉仅读取当前租户 03/01 预警等级中【已启用】等级（2~20 档），提交稳定主键 severity_level_id。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-filter",
    targetId: "device-warning-config-filter",
    number: 2,
    kind: "交互",
    title: "多维组合检索与新增入口",
    content: "支持规则名称、预警类型、预警子类型、预警等级与规则状态组合筛选，并提供【新增规则】入口。",
    details: [
      {
        title: "筛选维度说明",
        items: [
          {
            label: "预警类型 / 子类型联动",
            content: "选择预警大类后，子类型下拉联动收敛为对应权威枚举（如安防类联动围栏越界、离线类联动心跳超时等）。",
          },
          {
            label: "状态筛选",
            content: "全部、生效中、停用、已失效；默认展示全部。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-table",
    targetId: "device-warning-config-table",
    number: 3,
    kind: "字段",
    title: "表格字段与防抖参数展示",
    content: "展示规则名称、预警大类/子类型、预警等级 Tag、监控范围、监控阈值/防抖参数、通知渠道与状态。",
    details: [
      {
        title: "列定义与展示",
        items: [
          {
            label: "监控范围",
            content: "显示【仅针对新设备】或【N台设备】；悬浮可查看具体设备编码与安装库位。",
          },
          {
            label: "阈值与防抖",
            content: "瞬态破坏事件显示【即时触发】；数值型展示具体上下限与防抖（如【持续超过 10 分钟】或【连续 3 次超标】）。",
          },
          {
            label: "状态 Tag",
            content: "生效中（绿色）/ 停用（灰色）/ 已失效（红色且展示原因）。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-row-actions",
    targetId: "device-warning-config-table",
    number: 4,
    kind: "交互",
    title: "行操作控制与状态流转操作",
    content: "提供【编辑】、【启用】、【停用】与【删除】操作，严格遵循规则生命周期动作矩阵。",
    details: [
      {
        title: "操作与权限约束",
        items: [
          {
            label: "已失效规则约束",
            content: "已失效规则【编辑】按钮置灰禁用，仅支持查看详情或软删除。",
          },
          {
            label: "删除联动",
            content: "软删除前弹出强提示确认，删除后该规则关联的所有【未处理】告警流水自动转为【未处理（无效）】并终止超时升级定时器。",
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-pagination",
    targetId: "device-warning-config-pagination",
    number: 5,
    kind: "交互",
    title: "分页与页容量设置",
    content: "标准分页组件，支持 10/20/50 条每页切换。",
    details: [
      {
        title: "分页规范",
        items: [
          {
            label: "重置第 1 页",
            content: "检索条件变更或切换分页尺寸时自动重置至第 1 页展示。",
          },
        ],
      },
    ],
  },
]
