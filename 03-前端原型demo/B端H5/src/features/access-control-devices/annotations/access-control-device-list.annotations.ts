import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const accessControlDeviceH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "access-control-device-h5-page",
    targetId: "access-control-device-h5-page",
    number: 1,
    kind: "页面",
    title: "H5 门禁设备列表 · 双路径入口架构",
    content:
      "设备管理 → 门禁设备。移动端卡片列表 + 获取密码分流入口；返回上一级为设备管理 hub，而非工作台根页。",
    details: [
      {
        title: "菜单与路由",
        items: [
          {
            label: "页面路径",
            content: "`/m/access-control-devices`；菜单路径 `设备管理 → 门禁设备`（H5）。",
          },
          {
            label: "入口链路",
            content: "工作台 → 设备管理 hub → 门禁设备 Tab；或 moduleId `ws-device-access` 重定向。",
          },
        ],
      },
      {
        title: "双路径分流",
        items: [
          {
            label: "需审批",
            content: "命中已启用审批配置 → 弹出 UnlockApplySubmitSheet 发起申请 → 提交成功 Deep link 我的申请记录。",
          },
          {
            label: "免审",
            content: "未命中审批配置 → 弹出 GetLockPasswordSheet（挂锁）/ GetAccessPasswordSheet（人脸，无短信 R31）。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-h5-filter",
    targetId: "access-control-device-h5-filter",
    number: 2,
    kind: "交互",
    title: "搜索 · 类型 Chip · 筛选抽屉",
    content:
      "搜索框模糊匹配设备名称/编码；顶部 Chip 切换设备类型；Filter 抽屉含状态/仓库/绑定状态，确认后刷新列表。",
    details: [
      {
        title: "筛选项（对齐 Demo 移动端）",
        items: [
          {
            label: "设备类型",
            content: "全部 / 挂锁门禁 / 人脸门禁（Chip + 抽屉双入口）。",
          },
          {
            label: "设备状态",
            content: "全部 / 在线 / 离线（抽屉内）。",
          },
          {
            label: "绑定仓库",
            content: "全部 + 数据权限内仓库；P02 过滤（原型 Mock 三仓）。",
          },
          {
            label: "筛选持久化",
            content: "已应用筛选写入 sessionStorage；从设备管理 hub 离开再返回，或打开 Sheet 后关闭，均保留条件。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-h5-cards",
    targetId: "access-control-device-h5-cards",
    number: 3,
    kind: "字段",
    title: "设备卡片 · 行操作与加载更多",
    content:
      "DeviceCard 展示图标/名称/状态/位置/更新时间；底栏重命名/绑定/数据/获取密码/移除；列表支持加载更多。",
    details: [
      {
        title: "主操作分流",
        items: [
          {
            label: "获取密码",
            content: "挂锁展示「获取门锁密码」，人脸展示「获取门禁密码」，点击触发双路径 match 逻辑。",
          },
          {
            label: "R31 短信边界",
            content: "人脸路径任何 Sheet 均不含短信字段与下发逻辑；挂锁路径支持短信下发。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-h5-sheets",
    targetId: "access-control-device-h5-sheets",
    number: 4,
    kind: "规则",
    title: "移动端底部 Sheet 弹窗三件套",
    content:
      "UnlockApplySubmitSheet / GetLockPasswordSheet / GetAccessPasswordSheet 互斥展示，提供移动端极佳的开锁交互体验。",
    details: [
      {
        title: "Sheet 规范",
        items: [
          {
            label: "UnlockApplySubmitSheet",
            content: "需审批时唤起，展示目标设备快照并录入事由、备注及预计使用时段；提交成功后可直接跳转我的申请记录。",
          },
          {
            label: "GetLockPasswordSheet",
            content: "挂锁免审时唤起，展示大号开门密码与倒计时有效期，并调用短信网关向手机下发通知。",
          },
          {
            label: "GetAccessPasswordSheet",
            content: "人脸免审时唤起，展示大号开门密码与复制按钮，不调用短信服务（R31）。",
          },
        ],
      },
    ],
  },
]
