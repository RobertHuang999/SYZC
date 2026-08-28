import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApprovalConfigDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-approval-config-detail-header",
    targetId: "unlock-approval-config-detail-header",
    number: 1,
    kind: "页面",
    title: "开锁审批配置详情与页头操作",
    content:
      "只读查看完整配置并执行编辑/启停。无删除（C08）；不展示 Version、操作审计日志（后台 A01–A02 可查）。",
    details: [
      {
        title: "页头布局",
        items: [
          {
            label: "识别区",
            content: "{配置名称} + 状态 Tag（已启用绿 / 已停用灰）。",
          },
          {
            label: "已启用操作",
            content: "← 返回 / 编辑 / 停用。",
          },
          {
            label: "已停用操作",
            content: "← 返回 / 启用（无编辑，R06）。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-detail-base",
    targetId: "unlock-approval-config-detail-base",
    number: 2,
    kind: "字段",
    title: "基础识别与范围（DetailSection 4 列 Grid）",
    content:
      "DetailField：label 在上 value 在下；按适用范围类型条件展示各范围字段。",
    details: [
      {
        title: "始终展示",
        items: [
          {
            label: "配置编号",
            content: "如 UNLOCK-CFG-001；租户内唯一，版本沿用原编号。",
          },
          {
            label: "配置名称",
            content: "业务名称文本；租户内唯一。",
          },
          {
            label: "适用范围类型",
            content: "5 类枚举：仓库 / 库房 / 分区 / 指定设备 / 未绑定位置全局。",
          },
        ],
      },
      {
        title: "条件展示",
        items: [
          {
            label: "适用仓库",
            content: "仓库/库房/分区/指定设备时展示；未绑定位置全局隐藏。",
          },
          {
            label: "适用库房",
            content: "库房/分区/指定设备时展示；多选用「、」连接；空则「—」。",
          },
          {
            label: "适用分区",
            content: "分区/指定设备时展示；多选摘要。",
          },
          {
            label: "适用设备",
            content: "指定设备时：摘要「已选 N 台 · 编码…」+「查看设备清单 >」展开只读列表。",
          },
          {
            label: "未绑定位置设备全局审批开关",
            content: "未绑定位置全局时展示「开启/关闭」。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-detail-strategy",
    targetId: "unlock-approval-config-detail-strategy",
    number: 3,
    kind: "字段",
    title: "审批策略与节点只读表格",
    content: "展示审批方式、审批超时、配置版本及审批节点跨列只读表格。",
    details: [
      {
        title: "字段说明",
        items: [
          {
            label: "审批方式",
            content: "任一人通过 / 按顺序审批。",
          },
          {
            label: "审批超时时间",
            content: "如「24 小时」；申请待审批超过该时长自动失效。",
          },
          {
            label: "配置版本",
            content: "如 v1、v3；修改生成新版本时递增。",
          },
        ],
      },
      {
        title: "审批节点表格",
        items: [
          {
            label: "节点序号",
            content: "从 1 起；按顺序审批时行顺序即激活顺序。",
          },
          {
            label: "审批对象类型",
            content: "指定人员 / 指定角色。",
          },
          {
            label: "指定人员 / 指定角色",
            content: "展示已选人员姓名或角色名称；申请侧固化节点快照（C05）。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-detail-audit",
    targetId: "unlock-approval-config-detail-audit",
    number: 4,
    kind: "字段",
    title: "系统审计字段",
    content: "状态、创建/更新人时间；已停用时展示停用原因。",
    details: [
      {
        title: "审计字段",
        items: [
          {
            label: "状态",
            content: "已启用 / 已停用；配置生命周期，非申请状态。",
          },
          {
            label: "创建人 / 创建时间",
            content: "格式「姓名（所属机构）」/ YYYY-MM-DD HH:mm:ss。",
          },
          {
            label: "更新人 / 更新时间",
            content: "最近一次修改、停用、启用操作的时间戳。",
          },
          {
            label: "停用原因",
            content: "仅已停用状态展示；列表停用弹窗必填，≤200 字。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-detail-actions",
    targetId: "unlock-approval-config-detail-header",
    number: 5,
    kind: "规则",
    title: "启停二次确认与状态流转",
    content: "启停动作与列表页一致；须二次确认，停用须填原因。",
    details: [
      {
        title: "状态流转表（摘要）",
        items: [
          {
            label: "停用",
            content:
              "前置：P02 写权限。确认：「停用后新申请不再命中本配置，在途申请不受影响」。后置：写停用原因，只影响新申请（C07）。",
          },
          {
            label: "启用",
            content:
              "前置：R01–R04、R27、R29 通过 + P02。确认：「启用后新申请将按本配置匹配」。后置：恢复对新申请生效。",
          },
        ],
      },
      {
        title: "动作能力矩阵",
        items: [
          {
            label: "矩阵",
            content: `| 动作 | 已启用 | 已停用 |
| 编辑 | ✅ | ❌ |
| 停用 | ✅ | ❌ |
| 启用 | ❌ | ✅ |
| 删除 | ❌ | ❌ |`,
          },
        ],
      },
    ],
  },
]
