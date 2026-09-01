import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApplyAuditListAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-apply-audit-page",
    targetId: "unlock-apply-audit-page",
    number: 1,
    kind: "页面",
    title: "开锁审核列表 · 审批人视角与权限",
    content:
      "工作中心 → 审批中心 → 其他审批 → 开锁审核。集中处理挂锁/人脸门禁的临时开锁申请，独立于流程审批。",
    details: [
      {
        title: "审批权限与自审禁止",
        items: [
          {
            label: "P04 审批资格",
            content:
              "当前用户须为配置节点中指定的人员或包含的角色成员，且账号处于启用状态。",
          },
          {
            label: "P06 自审禁止（R11）",
            content:
              "审批人不能审批自己发起的开锁申请；若为申请人本人，列表中展示但不可执行审批操作。",
          },
          {
            label: "不进待处理/已处理",
            content:
              "开锁申请不接入工作流引擎待办池，严格通过「其他审批 → 开锁审核」独立处理。",
          },
        ],
      },
      {
        title: "状态流转图",
        items: [
          {
            label: "审批状态流转",
            content: `stateDiagram-v2
    [*] --> 待审批 : 申请人提交
    待审批 --> 已通过 : 审批通过（触发凭证下发）
    待审批 --> 已驳回 : 审批驳回（必填原因）
    待审批 --> 已撤回 : 申请人撤回
    已通过 --> [*]
    已驳回 --> [*]`,
          },
        ],
      },
    ],
  },
  {
    id: "unlock-apply-audit-filter",
    targetId: "unlock-apply-audit-filter",
    number: 2,
    kind: "交互",
    title: "组合筛选区 · 状态与数据过滤",
    content:
      "支持按申请单号、设备名称/编码、绑定仓库、申请人、事由、申请状态、提交时间范围等组合筛选。",
    details: [
      {
        title: "筛选规范",
        items: [
          {
            label: "申请状态",
            content:
              "默认「待审批」（L04）；可选待审批 / 已处理 / 全部；草稿态点击「查询」后生效。",
          },
          {
            label: "数据权限（P05）",
            content:
              "管辖仓库数据权限隔离；仓管人员仅可见所管辖仓库范围内的申请单。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-apply-audit-table",
    targetId: "unlock-apply-audit-table",
    number: 3,
    kind: "字段",
    title: "表格列与审批操作",
    content:
      "展示申请单号、设备信息、申请人、事由、提交时间、申请状态与行操作；支持行内及详情弹窗审批。",
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "待审批 + 有权限",
            content: "操作列展示「去处理」或「查看」，点击去处理弹出审批弹窗。",
          },
          {
            label: "已处理 / 终态",
            content: "操作列展示「查看」，点击跳转只读详情页。",
          },
          {
            label: "审批弹窗（R10~R13）",
            content:
              "通过：审批意见选填（≤200字）；驳回：驳回原因必填（≤200字）。审批后即时更新申请状态并触发凭证生成。",
          },
        ],
      },
    ],
  },
]
