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
        title: "1. 设备预警配置字段字典 (SSOT 真源对齐)",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 / 编码 | 控件与类型 | 展示与格式要求 | 触发动作 / 业务联动 |
| :--- | :--- | :--- | :--- |
| **序号** | 系统计算整数 | 1, 2, 3... 顺序递增 | 翻页重算 |
| **规则名称**<br>\`rule_name\` | 文本输入 | 1~50 字符；租户内唯一；点击查看详情 | 支持模糊检索 |
| **预警类型**<br>\`warning_type\` | 两栏树形枚举 | 5 大类枚举与细粒子类型；如【设备物联预警 / 超温预警】 | R14 上线类子类型互斥单独建规 |
| **处置策略**<br>\`disposition_mode\` | 枚举 Tag 徽章 | 三档：触发即结案 / 人工解除结案 / 恢复自动结案 | 遵循 5 大类白名单能力矩阵 |
| **预警等级**<br>\`severity_level_id\` | 枚举 Tag 徽章 | 读取当前租户 03/01 已启用等级；展示彩色药丸 | 提交稳定主键 ID；带穿透开关 |
| **监控范围**<br>\`scope_type\` | 结构化标签 | 【仅针对新设备】或【已关联 N 台设备】(悬浮查看明细) | R04/R05 同设备同子类型唯一绑定 |
| **触发阈值条件**<br>\`threshold_condition\` | 结构化文本 | 数值型(如温度 < -5℃ 或 > 35℃) 或事件型(剪杆破坏) | 厂商预过滤与防抖下沉，平台不配防抖 |
| **规则 Version**<br>\`version\` | 计数器徽章 | \`v1\`, \`v2\`... 编辑保存自增递增 (C08) | **不回写**存量流水；新事件匹配最新版 |
| **状态**<br>\`status\` | 状态 Badge | 生效中 (绿) / 停用 (灰) / 已失效 (红) | 联动行操作状态化控制 |
| **操作** | 按钮组合 | 【编辑】、【启用/停用】、【删除】 | 遵循规则生命周期动作能力矩阵 |`,
          },
        ],
      },
    ],
  },
  {
    id: "device-warning-config-row-actions",
    targetId: "device-warning-config-table",
    number: 4,
    kind: "规则",
    title: "状态 × 行操作控制矩阵",
    content: "提供【编辑】、【启用】、【停用】与【删除】操作，严格遵循规则生命周期动作矩阵与并发版本控制。",
    details: [
      {
        title: "1. 操作列状态化控制矩阵",
        items: [
          {
            label: "状态与动作对照表",
            content: `| 规则当前状态 | 可用操作按钮 | 交互行为与校验约束 | 审计与业务影响 |
| :--- | :--- | :--- | :--- |
| **生效中** | 【编辑】、【停用】、【删除】 | 点击【停用】无需弹窗即时生效；新事件暂停匹配该规则 | 正在生效的规则允许编辑，保存后 Version 递增 |
| **停用** | 【编辑】、【启用】、【删除】 | 点击【启用】校验设备范围互斥，恢复匹配厂商回调 | 重新激活规则 |
| **已失效** | 【删除】 (编辑置灰禁用) | 关联设备全部解绑时系统自动置失效，**不可逆不可编辑** | 仅支持查看配置详情或软删除 |
| **删除操作** | 任意状态均可触发 | 弹出强确认弹窗；二次确认后软删除 | 删除后该规则关联的未处理告警流水自动置【已作废】(DEV-T04) |`,
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
