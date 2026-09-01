import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApplyAuditDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-apply-audit-detail-header",
    targetId: "unlock-apply-audit-detail-header",
    number: 1,
    kind: "页面",
    title: "开锁审核详情 · 审批人视角与处理",
    content:
      "展示申请单全量快照信息、审批历史及处理动作；待审批状态下审批人可在此执行通过/驳回操作。",
    details: [
      {
        title: "页面结构与能力",
        items: [
          {
            label: "设备与位置",
            content: "只读展示设备名称、编码、设备类型、绑定仓库、库房/分区及具体安装位置。",
          },
          {
            label: "申请内容",
            content: "展示申请人姓名、所属机构、手机号（脱敏）、开锁事由、备注、预计使用时段与提交时间。",
          },
          {
            label: "审批处理区",
            content: "待审批且当前用户具备审批资格时，页面顶栏提供「去处理」按钮唤起审批弹窗；终态单据仅供只读查阅。",
          },
        ],
      },
      {
        title: "凭证生命周期触发（后置）",
        items: [
          {
            label: "审批通过后",
            content:
              "挂锁门禁：生成临时密码并调用短信服务下发；人脸门禁：生成密码并在页面展示（不调短信，R31）。",
          },
        ],
      },
    ],
  },
]
