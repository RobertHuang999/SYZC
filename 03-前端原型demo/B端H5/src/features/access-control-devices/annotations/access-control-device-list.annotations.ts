import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const accessControlDeviceH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "access-control-device-h5-page",
    targetId: "access-control-device-h5-page",
    number: 1,
    kind: "页面",
    title: "H5 门禁设备列表 · 双路径入口架构",
    content:
      "设备管理 → 门禁设备。移动端卡片列表 + 获取密码分流；Sheet 规格与 R07 见打点 **#3 设备卡片**。",
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
            content: "命中配置 → UnlockApplySubmitSheet → Deep link `/m/my-applies/unlock/:applyNo`。",
          },
          {
            label: "免审",
            content: "未命中 → GetLockPasswordSheet（挂锁）/ GetAccessPasswordSheet（人脸，R31 无短信）。",
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
            content: "已应用筛选写入 sessionStorage；离开再返回保留条件。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-h5-cards",
    targetId: "access-control-device-h5-cards",
    number: 3,
    kind: "规则",
    title: "设备卡片 · 获取密码与 R07",
    content:
      "卡片底栏「获取密码」为双路径入口；R07 在途阻断与 Mock 场景在挂锁-LK02 / 人脸-FC01 / 挂锁-LK08 上验证。",
    details: [
      {
        title: "卡片字段",
        items: [
          {
            label: "展示内容",
            content: "图标/名称/状态/位置/更新时间；22 条 Mock 覆盖三仓与双路径。",
          },
          {
            label: "R31 短信边界",
            content: "人脸路径任何 Sheet 均不含短信；挂锁支持短信下发。",
          },
        ],
      },
      {
        title: "获取密码 · 点击后 Sheet",
        items: [
          {
            label: "UnlockApplySubmitSheet",
            content:
              "需审批；字段：事由 → 有效期 →（人脸：开锁次数）→ 备注。R07 Toast 阻断；R08 60s 幂等。",
          },
          {
            label: "GetLockPasswordSheet / GetAccessPasswordSheet",
            content: "免审挂锁/人脸；成功后引导查看申请详情。",
          },
        ],
      },
      {
        title: "Mock 场景索引（再次提交）",
        items: [
          {
            label: "R07 阻断",
            content: "LK-2024-0082（UA28001）· FACE-01（UA28002）· 提交应 Toast 阻断。",
          },
          {
            label: "允许提交",
            content: "LK-0085 无在途，应新建待审批单。",
          },
          {
            label: "文档对齐",
            content: "PC Demo §5.1 · MOCK_DATA V1.7 §2 · 发起申请 §8.0。",
          },
        ],
      },
    ],
  },
]
