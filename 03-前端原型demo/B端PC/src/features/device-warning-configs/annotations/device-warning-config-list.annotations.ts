import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const deviceWarningConfigListAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-warning-config-page",
    targetId: "device-warning-config-page",
    number: 1,
    kind: "页面",
    title: "设备预警配置定位与生命周期",
    content: "物联网 IoT 策略配置中枢，集中维护硬件资产的异常告警阈值与通知升级策略；设备事件由厂商侧预过滤后回调匹配生效规则。",
    details: [
      {
        title: "规则生命周期流转图",
        items: [
          {
            label: "生命周期流转图",
            content: `flowchart TD
    A["设备预警配置表单"] -->|"保存生效/启用 Version=1"| B["生效中 (匹配厂商回调)"]
    B -->|"人工停用/启用"| C["停用 (暂停匹配新回调)"]
    C -->|"重新启用"| B
    B -->|"解绑全部关联设备"| D["已失效 (不可逆/禁编辑)"]
    B -->|"软删除"| E["配置已删除 (未处理流水置无效)"]
    B -->|"编辑保存"| F["Version+1 (C08 不回写未处理流水)"]
    F --> B`,
          },
          {
            label: "三态定义",
            content: "生效中（匹配厂商预过滤回调）、停用（策略暂停）、已失效（关联设备全部解绑时系统自动置为失效，不可逆不可编辑）。",
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
    content: "默认行四列：规则名称、预警类型、预警等级、状态；展开筛选后追加「处置策略」多选。与 ASCII/Demo 列表页 4 列栅格一致。",
    details: [
      {
        title: "筛选维度说明",
        items: [
          {
            label: "预警类型大类与子类型级联多选",
            content: "采用两栏树形级联多选组件：左栏支持按大类一键全选或半选联动，右栏展示对应子类型复选列表；支持关键字搜索子类型与自适应回显（全部 / [大类](全部) / [具体子类型] / 已选 N 项）。",
          },
          {
            label: "处置策略筛选（展开行）",
            content: "点击「展开筛选」后展示；多选：触发即结案 / 人工解除结案 / 恢复自动结案；空选=全部。",
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
    title: "表格字段与阈值展示",
    content: "展示规则名称、预警类型、处置策略、预警等级、监控范围、触发阈值条件、规则 Version 与状态。",
    details: [
      {
        title: "列定义与展示",
        items: [
          {
            label: "处置策略列 (disposition_mode)",
            content: "Badge 展示三档：触发即结案 / 人工解除结案 / 恢复自动结案；与 02/01 落账策略一致，命中后写入规则快照（R15b）。",
          },
          {
            label: "监控范围",
            content: "显示【仅针对新设备】或【N台设备】；悬浮可查看具体设备编码与安装库位。",
          },
          {
            label: "阈值条件",
            content: "展示数值上下限或事件型触发描述（如【温度 < -5℃ 或 > 35℃】、【二氧化碳 < 400 ppm 或 > 1500 ppm】、【剪杆破坏事件】）；平台不再配置防抖，事件预过滤由设备厂商侧完成。",
          },
          {
            label: "规则 Version",
            content: "每次编辑保存递增；后续厂商回调按最新 Version 匹配，历史流水保留触发时刻 Version 快照（C08）。",
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
            content: "软删除前弹出强提示确认，删除后该规则关联的所有【未处理】告警流水自动转为【已作废】并终止超时升级定时器。",
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
