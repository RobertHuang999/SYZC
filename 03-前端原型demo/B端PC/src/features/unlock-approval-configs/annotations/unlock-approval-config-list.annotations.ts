import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApprovalConfigListAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-approval-config-page",
    targetId: "unlock-approval-config-page",
    number: 1,
    kind: "页面",
    title: "开锁审批配置定位与生命周期",
    content:
      "配置管理 → 业务流程管理 → 开锁审批。6.2 仅维护「指定设备」范围；保存后直接已启用。已停用配置可逻辑删除（C08），历史申请保留快照。",
    details: [
      {
        title: "配置生命周期流转图",
        items: [
          {
            label: "状态流转图",
            content: `stateDiagram-v2
    [*] --> 已启用 : 新增保存（校验通过）
    已启用 --> 已停用 : 停用
    已启用 --> 已启用 : 修改保存（生成新版本，旧版本→已停用）
    已停用 --> 已启用 : 启用
    已停用 --> 已删除 : 逻辑删除（仅已停用）`,
          },
          {
            label: "匹配规则 C01–C03",
            content:
              "C01 设备编码精确命中已启用配置 → 进入审批；C02 未命中 → 免审直发；C03 多配置冲突 → 阻断提交。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-filter",
    targetId: "unlock-approval-config-filter",
    number: 2,
    kind: "交互",
    title: "组合筛选",
    content: "配置名称 + 状态 + 配置编号，一行四列平铺展示，无展开/收起。已移除适用范围类型/审批方式/全局开关筛选。",
    details: [
      {
        title: "筛选项",
        items: [
          {
            label: "配置名称",
            content: "Input 模糊匹配。",
          },
          {
            label: "状态",
            content: "全部 / 已启用 / 已停用。",
          },
          {
            label: "配置编号",
            content: "Input 精确匹配。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-table",
    targetId: "unlock-approval-config-table",
    number: 3,
    kind: "字段",
    title: "表格字段与摘要",
    content:
      "列顺序：序号→配置编号→配置名称→适用设备摘要→审批超时→配置版本→状态→创建人/时间→操作。审批方式 6.2 固定「任一人通过」，不在列表展示。",
    details: [
      {
        title: "适用设备摘要",
        items: [
          {
            label: "渲染",
            content: "如「3 台 · LK-2024-0082 / LK-0085 / FACE-01」。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-row-actions",
    targetId: "unlock-approval-config-table",
    number: 4,
    kind: "规则",
    title: "状态 × 行操作能力矩阵",
    content: "已启用：编辑/详情/停用；已停用：详情/启用/删除（逻辑删除，C08）。",
    details: [],
  },
  {
    id: "unlock-approval-config-disable-dialog",
    targetId: "unlock-approval-config-table",
    number: 5,
    kind: "规则",
    title: "停用确认弹窗",
    content: "停用须填原因；在途申请继续使用旧版本快照。",
    details: [],
  },
  {
    id: "unlock-approval-config-delete-dialog",
    targetId: "unlock-approval-config-table",
    number: 6,
    kind: "规则",
    title: "删除确认弹窗",
    content:
      "仅已停用可删除；二次确认后列表移除，历史申请保留配置编号/版本快照（C04）。",
    details: [],
  },
  {
    id: "unlock-approval-config-pagination",
    targetId: "unlock-approval-config-pagination",
    number: 7,
    kind: "交互",
    title: "分页与空态",
    content: "默认 10 条/页；空态引导新增配置。",
    details: [],
  },
]
