import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const unlockApprovalConfigListAnnotations: PrototypeAnnotation[] = [
  {
    id: "unlock-approval-config-page",
    targetId: "unlock-approval-config-page",
    number: 1,
    kind: "页面",
    title: "开锁审批配置定位与生命周期",
    content:
      "配置管理 → 业务流程管理 → 开锁审批。面向指定门禁设备集中配置开锁授权策略，维护审批节点（支持跨合作机构）与超时规则，实现货权监管与物防开锁的闭环控制。",
    details: [
      {
        title: "配置生命周期流转图",
        items: [
          {
            label: "状态流转图",
            content: `flowchart TD
    A["开锁审批配置表单"] -->|"新增保存 (校验通过)"| B["已启用 (对新申请生效)"]
    B -->|"人工停用 (填停用原因)"| C["已停用 (暂停匹配/在途保留快照)"]
    C -->|"重新启用"| B
    B -->|"编辑保存 (生成新版本)"| B
    B -.->|"旧版本自动流转"| C
    C -->|"逻辑删除 (仅已停用)"| D["已删除 (列表不可见/历史保留快照)"]`,
          },
          {
            label: "三态生命周期定义",
            content:
              "已启用（生效中，新申请按设备精确命中）、已停用（暂停对新申请匹配，在途申请继续使用旧版本快照）、已删除（逻辑删除态，列表不可见，历史申请保留 C04 快照）。无草稿态，新增保存校验通过后直接已启用。",
          },
        ],
      },
      {
        title: "下游匹配与执行机制 (C01–C04)",
        items: [
          {
            label: "C01 精确匹配",
            content:
              "用户点击【获取门锁密码】时，系统按设备 ID 在所有【已启用】配置中检索，若命中适用设备列表则进入审批申请流程。",
          },
          {
            label: "C02 未命中免审",
            content:
              "若设备未出现在任何已启用配置的适用设备列表中，系统走原有免审直发临时密码流程，不得静默阻断。",
          },
          {
            label: "C03 冲突阻断",
            content:
              "同一设备不得同时归属于多条内容不一致的已启用配置，配置保存与启用时在服务端强校验阻断。",
          },
          {
            label: "C04 快照固化",
            content:
              "申请一旦生成，永久固化当时的配置编号、配置版本、审批方式与审批节点快照；后续配置停用、修改或删除均不影响历史与在途申请。",
          },
        ],
      },
      {
        title: "跨机构协同与权限约束",
        items: [
          {
            label: "租户与合作机构隔离 (P01b)",
            content:
              "审批策略中指定的人员与角色严格限制在当前租户下合作机构范围内（含本机构及各合作机构），穿透货权风控与多方协同审核。",
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
    title: "多维组合检索与新增入口",
    content:
      "提供配置名称（模糊搜索）、状态（下拉单选）及配置编号（精确匹配）的一行平铺筛选，支持回车/点击查询、重置及【新增配置】主操作入口。",
    details: [
      {
        title: "筛选维度说明",
        items: [
          {
            label: "配置名称",
            content: "Input 单行输入框，支持模糊匹配当前租户下的审批策略名称（如「A库指定挂锁」）。",
          },
          {
            label: "状态下拉",
            content: "枚举：全部、已启用、已停用；默认展示全部有效数据（不含已逻辑删除记录）。",
          },
          {
            label: "配置编号",
            content: "Input 单行输入框，支持精确查询业务编号（如「UNLOCK-CFG-20260828-001」）。",
          },
        ],
      },
      {
        title: "交互与重置行为",
        items: [
          {
            label: "查询与重置",
            content: "点击【查询】或在输入框按回车触发筛选；点击【重置】清空输入项并自动回到第 1 页展示全量数据。",
          },
          {
            label: "新增入口",
            content: "点击【新增配置】按钮路由跳转至 `/配置管理/业务流程管理/开锁审批/新增` 页面。",
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
    title: "表格字段与适用设备摘要展示",
    content:
      "展示序号、配置编号、配置名称、适用设备摘要、审批超时时间、配置版本、状态 Tag、创建人/创建时间及操作列。",
    details: [
      {
        title: "列定义与展示规范",
        items: [
          {
            label: "适用设备摘要",
            content:
              "展示派生摘要文本，格式为「已选 N 台 · 设备编码1 / 设备编码2 / ...」，便于列表快速识别设备覆盖范围。",
          },
          {
            label: "审批超时时间",
            content: "展示正整数时长，带内嵌单位「小时」（如「12 小时」）。",
          },
          {
            label: "配置版本",
            content: "展示策略版本号（如「v1」、「v2」），每次修改已启用配置保存后递增。",
          },
          {
            label: "状态 Tag 渲染",
            content:
              "已启用（绿色 Emerald Badge）、已停用（灰色 Slate Badge）；已删除数据列表不可见。",
          },
          {
            label: "创建人与所属机构",
            content: "格式为「姓名（所属机构）」，真实体现多方协作下的创建人员主体。",
          },
        ],
      },
      {
        title: "审批方式固定说明",
        items: [
          {
            label: "任一人通过",
            content:
              "6.2 审批方式固定为「任一人通过」（各节点 eligible 人员并行收到待办，任一人通过即完成审批），列表不单独展示该列以提升屏幕利用率。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-row-actions",
    targetId: "unlock-approval-config-table",
    number: 4,
    kind: "交互",
    title: "状态 × 行操作控制与生命周期流转",
    content:
      "操作列提供【查看详情】、【编辑】、【停用】、【启用】与【删除】入口，严格遵循状态动作能力矩阵与 P02 权限控制。",
    details: [
      {
        title: "状态能力矩阵",
        items: [
          {
            label: "已启用状态",
            content: "允许【查看详情】、【编辑】（跳转编辑页生成新版本）、【停用】；禁止直接删除。",
          },
          {
            label: "已停用状态",
            content: "允许【查看详情】、【启用】（恢复对新申请匹配）、【删除】（仅已停用可逻辑删除）；禁止编辑。",
          },
        ],
      },
      {
        title: "二次确认与审计留痕",
        items: [
          {
            label: "停用操作",
            content:
              "点击【停用】弹出 DisableConfirmDialog，强制填写最多 200 字停用原因；确认后状态置为已停用，不影响已有在途申请（C06）。",
          },
          {
            label: "启用操作",
            content:
              "点击【启用】弹出二次确认提示「启用后新申请将按本配置匹配，确认启用？」，校验通过后恢复对新申请生效。",
          },
          {
            label: "删除操作 (C08)",
            content:
              "仅在已停用行展示【删除】按钮；弹出破坏性确认弹窗「删除后列表将不再展示本配置，历史申请仍保留配置快照，确认删除？」，确认后后端逻辑删除，历史申请保留快照（C04）。",
          },
        ],
      },
    ],
  },
  {
    id: "unlock-approval-config-pagination",
    targetId: "unlock-approval-config-pagination",
    number: 5,
    kind: "交互",
    title: "分页与页容量设置",
    content:
      "标准分页组件，支持 10/20/50 条每页切换，检索条件变更或切换分页尺寸时自动重置至第 1 页展示。",
    details: [
      {
        title: "空态规范",
        items: [
          {
            label: "空数据展示",
            content: "未查询到匹配配置时展示空态图标与文案，并提供【新增配置】快捷入口。",
          },
        ],
      },
    ],
  },
]
