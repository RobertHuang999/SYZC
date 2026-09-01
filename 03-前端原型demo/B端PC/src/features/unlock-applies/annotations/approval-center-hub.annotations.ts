import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const approvalCenterHubAnnotations: PrototypeAnnotation[] = [
  {
    id: "approval-center-hub-page",
    targetId: "approval-center-hub-page",
    number: 1,
    kind: "页面",
    title: "审批中心首页 · 架构与独立其他审批",
    content:
      "工作中心 → 审批中心首页。提供流程审批聚合、我的申请管理快捷入口及「其他审批」独立卡片。",
    details: [
      {
        title: "其他审批卡片与分流（R-MYAPP-01）",
        items: [
          {
            label: "开锁审核定位",
            content:
              "挂载于「其他审批」卡片，带待审批数量角标；不接入系统流程引擎，不进入 07 审批中心「待处理/已处理」（见主PRD §5.0）。",
          },
          {
            label: "我的申请管理",
            content:
              "独立卡片入口，点击跳转「我的申请管理」三 Tab 完整页；首页预览区仅展示流程申请，不含 UNLOCK_APPLY。",
          },
        ],
      },
      {
        title: "数据权限（P05）",
        items: [
          {
            label: "仓管隔离",
            content:
              "仓管角色仅可见管辖仓库下的开锁申请；管理员可见租户全量数据。",
          },
        ],
      },
    ],
  },
  {
    id: "approval-center-preview-table",
    targetId: "approval-center-preview-table",
    number: 2,
    kind: "交互",
    title: "开锁审核页内预览表格与去处理",
    content:
      "卡片内默认展示最近 5 条待审批申请；支持「去处理」快速弹窗审批与「查看更多」跳转完整列表。",
    details: [
      {
        title: "操作规格",
        items: [
          {
            label: "去处理",
            content:
              "弹出审批弹窗（通过/驳回）；通过时审批意见选填，驳回时驳回原因必填（R10、R13）。",
          },
          {
            label: "查看更多",
            content:
              "跳转 /工作中心/审批中心/其他审批/开锁审核 完整列表页，默认视图为「待审批」。",
          },
        ],
      },
    ],
  },
]
