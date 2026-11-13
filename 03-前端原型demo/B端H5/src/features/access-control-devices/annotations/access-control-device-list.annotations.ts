import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const accessControlDeviceH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "access-control-device-h5-page",
    documentRefs: {
      prd: { section: "门禁设备 主PRD", match: "获取门禁密码", element: "row" },
      rules: { section: "门禁设备 业务规则规格", match: "获取门禁密码", element: "row" },
    },
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
      {
        title: "获取密码链路",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["门禁设备卡片 · 获取密码"] --> B{"matchUnlockApprovalConfig"}
    B -->|命中需审批| C["UnlockApplySubmitSheet 发起申请"]
    C -->|R07 同设备在途| D["阻断并提示在途单号"]
    C -->|无在途| E["提交成功 → Deep link 我的开锁申请"]
    B -->|未命中免审| F{"设备类型"}
    F -->|挂锁| G["GetLockPasswordSheet（可短信）"]
    F -->|人脸| H["GetAccessPasswordSheet（仅页面密码，R31）"]`,
          },
          {
            label: "移动端差异",
            content: "PC 用居中弹窗，H5 统一用底部 Sheet；提交后跳「我的申请记录」详情。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-h5-filter",
    documentRefs: {
      prd: { section: "5.1 状态定义", match: "空间绑定状态：已绑定 (BOUND)、未绑定 (UNBOUND)；", element: "text" },
      rules: { section: "【设备类型分类与行操作矩阵】(R01)", match: "类型强隔离：门禁设备分为「挂锁门禁」与「人脸门禁」。", element: "text" },
    },
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
    documentRefs: {
      rules: { section: "【设备类型分类与行操作矩阵】(R01)", match: "类型强隔离：门禁设备分为「挂锁门禁」与「人脸门禁」。", element: "text" },
    },
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
  {
    id: "access-control-device-h5-fields",
    documentRefs: {
      fields: { section: "四、系统状态与审计字段", match: "设备重命名、仓位变更、密码获取及移除的全量审计", element: "row" },
      rules: { section: "3.1 运行状态与生命周期", match: "空间绑定状态：已绑定 (BOUND)、未绑定 (UNBOUND)；", element: "text" },
    },
    targetId: "access-control-device-h5-cards",
    number: 4,
    kind: "字段",
    title: "设备卡片字段字典",
    content:
      "卡片展示设备名称与编码、类型、绑定仓库、在线状态与获取密码入口。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "卡片字段",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **设备名称** | 文本 | 必填 | 最多 50 个字符 | 卡片首行 |
| **设备编码** | 文本 | 必填 | 如 LK-2024-0082 | 可复制 |
| **设备类型** | 图标 + 文本 | 必填 | 挂锁 / 人脸门禁 | 决定获取密码入口文案 |
| **绑定仓库** | 文本 | 条件必填 | 仓库-库房-分区 | 未绑定显示「未绑定」 |
| **在线状态** | 状态标签 | 系统维护 | 在线 / 离线 | 彩色标签 |
| **获取密码** | 胶囊按钮 | — | 获取门锁密码 / 获取门禁密码 | 卡片底部 |`,
          },
        ],
      },
    ],
  },
]
