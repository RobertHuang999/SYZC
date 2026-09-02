import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const accessControlDeviceListAnnotations: PrototypeAnnotation[] = [
  {
    id: "access-control-device-page",
    targetId: "access-control-device-page",
    number: 1,
    kind: "页面",
    title: "门禁设备列表 · 双路径获取密码入口",
    content:
      "物联网 IOT 管理 → 门禁设备。行操作「获取门锁密码」（挂锁）/「获取门禁密码」（人脸）为统一入口；先 matchUnlockApprovalConfig 再分流。",
    details: [
      {
        title: "双路径分流",
        items: [
          {
            label: "分流流程图",
            content: `flowchart TD
    A["点击获取密码"] --> B{"matchUnlockApprovalConfig"}
    B -->|命中需审批| C["UnlockApplySubmitDialog 发起申请"]
    B -->|未命中/免审| D{"设备类型"}
    D -->|挂锁| E["GetLockPasswordDialog 短信+页面密码"]
    D -->|人脸| F["GetAccessPasswordDialog 仅页面密码"]
    C --> G["提交成功 Deep link 我的开锁申请"]`,
          },
          {
            label: "免审路径",
            content: "未命中已启用审批配置时走免审密码窗；成功后写入 `approval_required=false` 开锁记录至我的申请管理。",
          },
          {
            label: "需审批路径",
            content: "命中配置后弹出发起申请窗；提交成功后跳转申请人列表/详情 Deep link。",
          },
        ],
      },
      {
        title: "R31 短信边界",
        items: [
          {
            label: "挂锁",
            content: "免审与审批通过后均可短信 + 页面密码（审批路径在详情/凭证模块下发）。",
          },
          {
            label: "人脸",
            content: "任何路径仅页面密码，不调短信 API。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-filter",
    targetId: "access-control-device-filter",
    number: 2,
    kind: "交互",
    title: "筛选区与查询",
    content: "筛选草稿态；查询/重置页码归 1。支持设备名称、编码、类型、在线状态、绑定状态等（见 Demo 列表页）。",
    details: [
      {
        title: "Mock 设备覆盖",
        items: [
          {
            label: "免审挂锁 / 免审人脸",
            content: "未绑定或命中免审全局开关的设备 → 直接密码弹窗。",
          },
          {
            label: "需审批设备",
            content: "绑定仓库且命中已启用配置 → 发起申请弹窗。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-table",
    targetId: "access-control-device-table",
    number: 3,
    kind: "字段",
    title: "表格列与行操作",
    content: "展示设备编码、系统内名称、类型、绑定仓库/位置、在线状态；主操作「获取密码」按类型文案区分。",
    details: [
      {
        title: "行操作",
        items: [
          {
            label: "获取密码",
            content: "挂锁→「获取门锁密码」；人脸→「获取门禁密码」；触发双路径 handler。",
          },
          {
            label: "其他操作",
            content: "重命名、仓库绑定、人脸配置、设备数据、移除设备等 6.2 原型 Toast 占位。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-password-dialogs",
    targetId: "access-control-device-password-dialogs",
    number: 4,
    kind: "规则",
    title: "免审弹窗与发起申请弹窗",
    content: "三个弹窗互斥：GetLockPasswordDialog / GetAccessPasswordDialog / UnlockApplySubmitDialog（复用 unlock-applies 模块）。",
    details: [
      {
        title: "GetLockPasswordDialog",
        items: [
          {
            label: "挂锁免审",
            content: "展示临时密码 + 短信发送状态；人脸不适用此弹窗。",
          },
        ],
      },
      {
        title: "GetAccessPasswordDialog",
        items: [
          {
            label: "人脸免审",
            content: "仅页面密码 + 复制；无短信区块。",
          },
        ],
      },
      {
        title: "UnlockApplySubmitDialog",
        items: [
          {
            label: "需审批发起",
            content: "只读设备快照 + 事由/备注/预计使用时段；提交后 Mock 固定单号 Deep link（动态写入列表待后续迭代）。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-pagination",
    targetId: "access-control-device-pagination",
    number: 5,
    kind: "交互",
    title: "分页与页容量控制",
    content: "默认 10 条/页；与预警列表共用 WarningListPagination 组件，支持 10/20/50 条切换。",
    details: [
      {
        title: "分页规范",
        items: [
          {
            label: "重置行为",
            content: "检索条件变更或切换分页尺寸时自动重置至第 1 页展示。",
          },
          {
            label: "空态说明",
            content: "未查询到匹配设备时展示空态占位，提示「暂无匹配的门禁设备」。",
          },
        ],
      },
    ],
  },
]
