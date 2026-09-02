import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const deviceManagementHubAnnotations: PrototypeAnnotation[] = [
  {
    id: "device-management-hub-page",
    targetId: "device-management-hub-page",
    number: 1,
    kind: "页面",
    title: "设备管理 · 移动端子 Tab 入口 hub",
    content:
      "工作台 → 仓储 → 设备管理。本页聚合 5 个子 Tab：监控设备 / 物联设备 / 门禁设备 / GPS设备 / 门禁事务记录，提供 6.2 门禁设备与开锁审批专属入口。",
    details: [
      {
        title: "移动端导航与路由分流",
        items: [
          {
            label: "入口与分流流转图",
            content: `flowchart TD
    A["工作台 (仓储管理)"] --> B["设备管理 Hub"]
    B --> C["门禁设备 (6.2 已接入)"]
    B --> D["监控 / 物联 / GPS / 事务 (通用占位)"]
    C --> E{"点击获取密码"}
    E -->|命中审批配置| F["UnlockApplySubmitSheet 发起申请"]
    E -->|免审/未命中| G["GetPasswordSheet 直发临时密码"]`,
          },
          {
            label: "标准入口",
            content: "工作台宫格「设备管理」→ 本 hub 页 → 点击「门禁设备」→ `/m/access-control-devices`。",
          },
          {
            label: "Deep link",
            content: "亦可通过 `/m/module/ws-device-access` 自动重定向至门禁设备列表（customRoute）。",
          },
        ],
      },
      {
        title: "6.2 交付范围与业务约束",
        items: [
          {
            label: "门禁设备",
            content: "标记「6.2 已接入」；支持挂锁与人脸门禁在线状态、双路径密码获取及开锁申请协同。",
          },
        ],
      },
    ],
  },
  {
    id: "device-management-hub-tabs",
    targetId: "device-management-hub-tabs",
    number: 2,
    kind: "交互",
    title: "子 Tab 列表与模块跳转",
    content: "卡片展示 subTab 名称 + 简介；点击按 moduleId 或 customRoute 跳转对应移动端视图。",
    details: [
      {
        title: "子 Tab 映射规格",
        items: [
          {
            label: "ws-device-access",
            content: "门禁设备 → customRoute `/m/access-control-devices`（双路径获取密码 + 开锁申请）。",
          },
          {
            label: "其余 Tab",
            content: "监控/物联/GPS/门禁事务 → `/m/module/{id}` 通用占位页（非 6.2 范围）。",
          },
        ],
      },
    ],
  },
]
