import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApprovalConfigDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-approval-config-detail-header",
    targetId: "unlock-approval-config-detail-header",
    number: 1,
    kind: "页面",
    title: "开锁审批配置详情与页头操作",
    content: "只读查看完整配置并执行编辑/启停；已停用可逻辑删除（C08，保留历史快照）。",
    details: [],
  },
  {
    id: "unlock-approval-config-detail-base",
    targetId: "unlock-approval-config-detail-base",
    number: 2,
    kind: "字段",
    title: "基础信息与适用设备",
    content: "配置编号、配置名称、适用设备清单（台数 + 编码摘要 + 展开清单）。",
    details: [],
  },
  {
    id: "unlock-approval-config-detail-strategy",
    targetId: "unlock-approval-config-detail-strategy",
    number: 3,
    kind: "字段",
    title: "审批策略与节点只读表格",
    content: "审批方式固定「任一人通过」、审批超时、配置版本、审批节点表。",
    details: [],
  },
  {
    id: "unlock-approval-config-detail-audit",
    targetId: "unlock-approval-config-detail-audit",
    number: 4,
    kind: "字段",
    title: "系统审计字段",
    content: "状态、创建/更新人时间；已停用时展示停用原因。",
    details: [],
  },
  {
    id: "unlock-approval-config-detail-actions",
    targetId: "unlock-approval-config-detail-header",
    number: 5,
    kind: "规则",
    title: "启停二次确认",
    content: "启停/删除与列表页一致；停用须填原因；删除仅已停用且二次确认。",
    details: [],
  },
]
