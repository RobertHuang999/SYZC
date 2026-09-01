import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const unlockApplyAuditH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "h5-unlock-audit-list-page",
    targetId: "h5-unlock-audit-list-page",
    number: 1,
    kind: "页面",
    title: "开锁审批 · H5 移动列表与权限",
    content:
      "业务办理 → 其他审批 → 开锁审批。审批人集中处理门禁临时开锁申请，独立于流程待办。",
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
              "审批人不能审批自己发起的开锁申请；列表卡片底链展示「详情 ▸」而非「去审批 ▸」。",
          },
          {
            label: "P05 数据权限",
            content: "仓管角色仅可见管辖仓库下的开锁申请；管理员可见租户全量数据。",
          },
        ],
      },
    ],
  },
  {
    id: "h5-unlock-audit-filter",
    targetId: "h5-unlock-audit-filter",
    number: 2,
    kind: "交互",
    title: "搜索与状态胶囊过滤",
    content:
      "搜索框支持申请单号、设备、申请人、事由即时过滤；状态下拉胶囊默认「待审批」（L04），可选已处理与全部。",
    details: [
      {
        title: "过滤逻辑",
        items: [
          {
            label: "待审批",
            content: "status === PENDING",
          },
          {
            label: "已处理",
            content: "status ∈ {APPROVED, REJECTED, WITHDRAWN, EXPIRED, VOIDED}",
          },
        ],
      },
    ],
  },
  {
    id: "h5-unlock-audit-card",
    targetId: "h5-unlock-audit-card",
    number: 3,
    kind: "字段",
    title: "卡片结构与审批操作",
    content:
      "卡片展示设备名称、申请状态Tag、绑定仓库、申请人、事由与提交时间；底链区分「去审批 ▸」与「详情 ▸」。",
    details: [
      {
        title: "审批弹窗（R10~R13）",
        items: [
          {
            label: "通过",
            content: "审批意见选填（≤200字）；触发凭证生成与短信下发。",
          },
          {
            label: "驳回",
            content: "驳回原因必填（≤200字）；申请流转至已驳回终态。",
          },
        ],
      },
    ],
  },
]

export const unlockApplyAuditH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "h5-unlock-audit-detail-page",
    targetId: "h5-unlock-audit-detail-page",
    number: 1,
    kind: "页面",
    title: "开锁审批详情 · 审批人移动端操作",
    content:
      "展示申请单设备位置、申请内容、审批配置快照与审批记录；支持审批人通过与驳回操作。",
    details: [
      {
        title: "处理权限",
        items: [
          {
            label: "待审批 + 有权限",
            content: "底部展示「去审批」操作栏，点击唤起通过/驳回弹窗。",
          },
          {
            label: "已处理 / 非审批人",
            content: "只读展示申请单全量快照与审批历史流水。",
          },
        ],
      },
    ],
  },
]
