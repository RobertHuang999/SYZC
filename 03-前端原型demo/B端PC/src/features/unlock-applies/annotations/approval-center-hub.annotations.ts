import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const approvalCenterHubAnnotations: PrototypeAnnotation[] = [
  {
    id: "approval-center-hub-page",
    documentRefs: {
      prd: { section: "1.1 业务背景" },
    },
    targetId: "approval-center-hub-page",
    number: 1,
    kind: "页面",
    title: "审批中心首页 · 三区块导航与无 Sidebar",
    content:
      "工作中心 → 审批中心聚合页。无左侧 Sidebar；业务管理审批 / 客户需求审批 / 其他审批单行三列并排，组内子类型 Grid 均分。",
    details: [
      {
        title: "导航与布局（AGENTS §4.3）",
        items: [
          {
            label: "无 Sidebar",
            content:
              "工作中心模块隐藏 SidebarNav（shouldShowSidebar）；与线上采集一致，权限清单路径仅用于 RBAC 与占位路由。",
          },
          {
            label: "子项文案",
            content:
              "icon + 文字；每行 4 汉字逻辑断行 + whitespace-nowrap，避免 CSS 二次折行。组间宽度按子项数量比例分配。",
          },
          {
            label: "预览区",
            content:
              "选中子类型后下方展示最多 5 条；右上角「查看更多」跳转完整页或 PrototypeEmptyPage。",
          },
        ],
      },
      {
        title: "其他审批 · 开锁审核（R-MYAPP-01）",
        items: [
          {
            label: "开锁审核定位",
            content:
              "挂载于「其他审批」区块，带待审批角标；不接入流程引擎，不进「待处理/已处理」待办池，专网专道保障高频开锁响应。",
          },
          {
            label: "我的申请管理",
            content:
              "业务管理审批下子项；完整页 `/工作中心/审批中心/我的申请管理`（Tab「我的开锁申请」等）。",
          },
        ],
      },
      {
        title: "数据权限与仓库隔离 (P05)",
        items: [
          {
            label: "仓管隔离",
            content:
              "仓管角色仅可见管辖仓库下的开锁申请；管理员可见租户及各合作机构全量数据。",
          },
        ],
      },
      {
        title: "审批入口分流",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["门禁设备 · 获取密码"] --> B{"matchUnlockApprovalConfig"}
    B -->|命中需审批| C["我的开锁申请（待审批）"]
    B -->|未命中免审| D["免审直发（approval_required=false）"]
    C --> E["其他审批 → 开锁审核"]
    E -->|通过| F["生成临时密码凭证"]
    E -->|驳回（原因必填）| G["已驳回，释放防重"]
    C -->|申请人撤回 / 审批超时| H["已撤回 / 已失效"]
    F --> I["详情查密码（人脸仅页面展示，R31）"]`,
          },
          {
            label: "不走通用待办",
            content:
              "开锁审批专网专道，不进「待处理/已处理」池；审批人只看「其他审批 → 开锁审核」。",
          },
        ],
      },
    ],
  },
  {
    id: "approval-center-preview-table",
    documentRefs: {
      prd: { section: "1.1 业务背景" },
      rules: { section: "开锁申请 业务规则规格", match: "驱动开锁审核流转与凭证解密", element: "row" },
    },
    targetId: "approval-center-preview-table",
    number: 2,
    kind: "交互",
    title: "子类型预览表格（最多 5 条）",
    content:
      "选中子类型后展示预览表格（业务流 Mock / 开锁待审批 / 政策占位等）；开锁审核支持「去处理」弹窗。",
    details: [
      {
        title: "操作规格",
        items: [
          {
            label: "去处理（开锁）",
            content:
              "弹出 UnlockApplyApprovalDialog（通过/驳回）；驳回原因必填（R10、R13）。",
          },
          {
            label: "查看更多",
            content:
              "跳转当前子类型完整路径；开锁审核默认 `/工作中心/审批中心/其他审批/开锁审核` 待审批视图。",
          },
        ],
      },
    ],
  },
]
