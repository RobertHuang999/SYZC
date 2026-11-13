import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const supervisionHandlingH5Annotations: PrototypeAnnotation[] = [
  {
    id: "supervision-h5-initiate-page",
    documentRefs: {
      prd: { section: "监管办理 主PRD", match: "移动端提供【存货】与【仓单】双标的发起专道", element: "text" },
      rules: { section: "【移动端存货三级选货与先入先出智能扣减规则】(R13)", match: "三级递进式选货流程", element: "text" },
    },
    targetId: "supervision-h5-initiate-page",
    number: 1,
    kind: "页面",
    title: "移动端监管办理 · 存货与仓单双标的发起",
    content:
      "从「业务办理 → 业务发起 → 监管办理」进入两步式开立流程：Step 1 基础信息（含主体动态反显与货物类型切换）；Step 2 存货 FIFO 三级选货或仓单整单打包 + 法定代表人活体人脸识别。",
    details: [
      {
        title: "双标的流转差异",
        items: [
          {
            label: "流程示意",
            content: `flowchart LR
  A[Step1 基础信息] --> B{货物类型}
  B -->|存货| C[三级选货 FIFO/自定义]
  C --> D[四级明细手风琴 -> 直接提审]
  B -->|仓单| E[CD仓单整单勾选 + 同保管人校验]
  E --> F[法定代表人活体人脸识别 -> 提审]`,
          },
        ],
      },
    ],
  },
  {
    id: "supervision-h5-list-page",
    documentRefs: {
      prd: { section: "3. 业务全景与系统流向图", match: "生成 19 位业务单据号", element: "text" },
      rules: { section: "【仓单全生命周期状态机双向闭环机制规则】(R10)", match: "审批通过置为", element: "text" },
    },
    targetId: "supervision-h5-list-page",
    number: 2,
    kind: "页面",
    title: "移动端监管办理记录台账",
    content:
      "支持关键词搜索、状态胶囊与底部筛选抽屉；覆盖草稿、审批中、已生效、已驳回、已撤回、已解押全部状态，敏感操作均带二次确认与 Toast 反馈。",
    details: [
      {
        title: "台账操作规范",
        items: [
          {
            label: "操作胶囊",
            content:
              "卡片操作区一行最多 4 个胶囊：详情、重新编辑、撤回、驳回、删除；敏感操作（撤回、驳回、删除）均带二次确认弹窗。",
          },
        ],
      },
    ],
  },
]
