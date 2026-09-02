import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApprovalConfigDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-approval-config-detail-header",
    targetId: "unlock-approval-config-detail-header",
    number: 1,
    kind: "页面",
    title: "开锁审批配置详情与生命周期操作",
    content:
      "全景只读查看开锁审批配置策略与审计信息，提供【编辑】、【停用】、【启用】与【删除】操作入口，严格受限于配置状态机矩阵。",
    details: [
      {
        title: "状态机与操作矩阵",
        items: [
          {
            label: "已启用状态",
            content: "展示【编辑】（生成新版本）、【停用】（填停用原因）入口；禁止删除。",
          },
          {
            label: "已停用状态",
            content: "展示【启用】（恢复匹配）、【删除】（仅已停用可逻辑删除，C08）入口；禁止编辑。",
          },
          {
            label: "状态 Tag 渲染",
            content: "已启用为绿色 Emerald 徽标，已停用为灰色 Slate 徽标。",
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
    title: "基础信息与适用设备清单",
    content:
      "只读展示配置业务编号、配置名称及适用设备范围；支持展开/收起查看关联的全部门禁设备清单。",
    details: [
      {
        title: "字段与交互规范",
        items: [
          {
            label: "配置编号",
            content: "系统自动生成的业务唯一主键（如「UNLOCK-CFG-20260828-001」），递增版本时沿用同一编号。",
          },
          {
            label: "配置名称",
            content: "业务规则名称，租户内唯一标识。",
          },
          {
            label: "适用设备展开清单",
            content:
              "展示已选台数及设备编码摘要，点击【查看设备清单 >】展开显示所有绑定的门禁设备编码，便于管理员完整核对覆盖范围。",
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
    content:
      "展示审批方式（任一人通过）、审批超时时间、当前配置版本号，以及按序号排列的审批节点表格（展示指定人员/角色及其所属合作机构）。",
    details: [
      {
        title: "审批策略字段",
        items: [
          {
            label: "审批方式",
            content: "固定为「任一人通过」，各节点解析出的审批人并行收到待办，任一人通过即完成审批。",
          },
          {
            label: "审批超时时间",
            content: "正整数时长（小时），超时未处理自动失效。",
          },
          {
            label: "配置版本",
            content: "展示当前策略的版本号（如「v1」、「v2」），历史申请按当时固化的版本快照执行。",
          },
        ],
      },
      {
        title: "审批节点表格列定义",
        items: [
          {
            label: "节点序号",
            content: "从 1 递增展示节点顺序。",
          },
          {
            label: "审批对象类型",
            content: "展示「指定人员」或「指定角色」。",
          },
          {
            label: "审批对象（含所属机构）",
            content:
              "展示指定人员或角色的名称与所属机构标签（如「李四（仓储监管部）」、「监管主管（华东监管分公司）」），体现跨合作机构协同背景。",
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
    title: "系统状态与操作审计信息",
    content:
      "展示配置生命周期状态、创建人（所属机构）、创建时间、更新人（所属机构）、更新时间；处于已停用状态时展示停用原因。",
    details: [
      {
        title: "审计与停用溯源",
        items: [
          {
            label: "停用原因展示",
            content: "仅在状态=已停用时动态展示，呈现停用操作时填写的具体业务原因（最多 200 字）。",
          },
          {
            label: "操作人与时间",
            content: "格式为「姓名（所属机构）」，精准追溯配置创建与最近更新的操作主体及时间戳。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-detail-actions",
    targetId: "unlock-approval-config-detail-header",
    number: 5,
    kind: "交互",
    title: "详情页启停用与删除确认交互",
    content:
      "支持在详情页直接执行停用、启用及逻辑删除操作；操作后状态实时刷新并记录全生命周期审计日志。",
    details: [
      {
        title: "动作交互与提示",
        items: [
          {
            label: "停用确认",
            content: "弹出 DisableConfirmDialog，填写停用原因后提交，Toast 提示「停用成功」并返回列表页。",
          },
          {
            label: "启用确认",
            content: "弹出确认弹窗「启用后新申请将按本配置匹配，确认启用？」，确认后 Toast 提示「启用成功」并刷新详情状态。",
          },
          {
            label: "删除确认 (C08)",
            content:
              "已停用配置点击【删除】弹出破坏性确认弹窗，确认后后端执行逻辑删除，Toast 提示「删除成功」并返回列表页，历史申请保留快照（C04）。",
          },
        ],
      },
    ],
  },
]
