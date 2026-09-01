import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApprovalConfigFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-approval-config-form-header",
    targetId: "unlock-approval-config-form-header",
    number: 1,
    kind: "页面",
    title: "开锁审批配置新增/编辑表单",
    content:
      "6.2 仅配置名称 + 适用设备 + 审批节点 + 超时；审批方式固定「任一人通过」。编辑保存生成新版本（C05、C06）。",
    details: [
      {
        title: "新增 vs 编辑差异",
        items: [
          {
            label: "不可变字段（R06）",
            content: "编辑态：配置名称、适用设备 Readonly；需调整设备清单时停用旧配置并新增。",
          },
          {
            label: "审批方式",
            content: "6.2 前端灰字只读展示「任一人通过」，不提供 Radio。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-form-scope",
    targetId: "unlock-approval-config-form-scope",
    number: 2,
    kind: "字段",
    title: "基础信息与适用设备",
    content: "配置名称 + 设备选择弹窗（UnlockDeviceSelectDialog）；已移除 ScopeCascadeSelector 与全局开关。",
    details: [
      {
        title: "适用设备",
        items: [
          {
            label: "选择器",
            content: "按仓库筛选 + 关键字搜索；至少选 1 台设备。",
          },
          {
            label: "匹配",
            content: "仅 deviceCodes 精确命中（C01）；Mock 见 MOCK_DATA-开锁审批-V1.2.md。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-form-device",
    targetId: "unlock-approval-config-form-device",
    number: 3,
    kind: "交互",
    title: "UnlockDeviceSelectDialog 设备弹窗",
    content: "表单页展示已选摘要 +「勾选/调整设备」按钮。",
    details: [],
  },
  {
    id: "unlock-approval-config-form-strategy",
    targetId: "unlock-approval-config-form-strategy",
    number: 5,
    kind: "字段",
    title: "审批策略：节点、超时",
    content: "审批节点可编辑表格 + TimeoutHoursInput；审批方式固定只读。",
    details: [],
  },
  {
    id: "unlock-approval-config-form-actions",
    targetId: "unlock-approval-config-form-actions",
    number: 6,
    kind: "规则",
    title: "保存二次确认",
    content: "新增/编辑保存前二次确认；校验设备必选、节点完整、超时为正整数。",
    details: [],
  },
]
