import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const accessControlDeviceListAnnotations: PrototypeAnnotation[] = [
  {
    id: "access-control-device-page",
    documentRefs: {
      prd: { section: "门禁设备 主PRD", match: "获取门锁密码", element: "row" },
      rules: { section: "门禁设备 业务规则规格", match: "物联网IOT管理 → 门禁设备", element: "row" },
    },
    targetId: "access-control-device-page",
    number: 1,
    kind: "页面",
    title: "门禁设备列表 · 双路径获取密码入口",
    content:
      "物联网 IOT 管理 → 门禁设备。行操作「获取门锁密码」（挂锁）/「获取门禁密码」（人脸）为统一入口；先 matchUnlockApprovalConfig 再分流。弹窗规格与 R07/R08 见打点 **#3 行操作**。",
    details: [
      {
        title: "双路径分流",
        items: [
          {
            label: "分流流程图",
            content: `flowchart TD
    A["表格行 · 点击获取密码"] --> B{"matchUnlockApprovalConfig"}
    B -->|命中需审批| C["UnlockApplySubmitDialog 发起申请"]
    B -->|未命中/免审| D{"设备类型"}
    D -->|挂锁| E["GetLockPasswordDialog 引导我的申请记录"]
    D -->|人脸| F["GetAccessPasswordDialog 引导我的申请记录"]
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
    documentRefs: {
      prd: { section: "5.1 状态定义", match: "空间绑定状态：已绑定 (BOUND)、未绑定 (UNBOUND)；", element: "text" },
    },
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
            label: "22 条设备 Mock",
            content:
              "三仓、挂锁/人脸、在线/离线。需审批：`LK-2024-0082`（挂锁-LK02）、`LK-0085`（挂锁-LK08）、`FACE-01`（人脸-FC01）；免审：如 `LK-HB-003`、`FACE-2024-001`。详见 Demo 列表页 §5 / §5.1。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-table",
    documentRefs: {
      rules: { section: "【设备类型分类与行操作矩阵】(R01)", match: "操作矩阵控制：", element: "text" },
      fields: { section: "三、行操作与密码凭证字段", match: "临时开锁密码", element: "row" },
    },
    targetId: "access-control-device-table",
    number: 3,
    kind: "规则",
    title: "表格行操作 · 获取密码双路径与 R07",
    content:
      "主操作「获取密码」挂载在本表格操作列：点击后按审批配置分流至三个互斥弹窗之一；R07 在途阻断与 Mock 场景在此验证。",
    details: [
      {
        title: "表格列",
        items: [
          {
            label: "更新人/时间",
            content: "合并列：上行更新人、下行 `YYYY-MM-DD HH:mm:ss`；字体与预警等级表格一致。",
          },
        ],
      },
      {
        title: "行操作 · 获取密码",
        items: [
          {
            label: "入口文案",
            content: "挂锁→「获取门锁密码」；人脸→「获取门禁密码」；触发 `handleGetPassword` 双路径 handler。",
          },
          {
            label: "其他操作",
            content: "重命名、仓库绑定、人脸配置、设备数据、移除设备等 6.2 原型 Toast 占位。",
          },
        ],
      },
      {
        title: "弹窗分流（点击后）",
        items: [
          {
            label: "UnlockApplySubmitDialog · 需审批",
            content:
              "只读设备快照 + 事由/有效期/备注（挂锁）或 +开锁次数（人脸）；提交成功 Deep link 我的开锁申请详情。",
          },
          {
            label: "GetLockPasswordDialog · 挂锁免审",
            content: "事由 + 有效期（最长 24h）；成功后引导【查看申请详情】，弹窗内不展示明文。",
          },
          {
            label: "GetAccessPasswordDialog · 人脸免审",
            content: "事由 → 有效期 → 开锁次数 → 备注；R31 不下发短信。",
          },
        ],
      },
      {
        title: "R07 / R08（发起申请弹窗内提交时）",
        items: [
          {
            label: "R07 同设备在途阻断",
            content:
              "挂锁-LK02 → Toast「设备已有在途申请 UA20260828001…」；人脸-FC01 → UA20260828002；挂锁-LK08 无在途可新建。",
          },
          {
            label: "R08 幂等",
            content: "60 秒内同设备重复提交返回原单号及状态。",
          },
        ],
      },
      {
        title: "Mock 场景索引（再次提交）",
        items: [
          {
            label: "R07 阻断",
            content: "在本表找到 LK-2024-0082 或 FACE-01 → 获取密码 → 填表提交 → 应 Toast 阻断。",
          },
          {
            label: "允许提交",
            content: "LK-0085：无在途，提交应新建待审批单。",
          },
          {
            label: "文档对齐",
            content: "Demo §5.1 · 发起申请 §8.0 · MOCK_DATA V1.7 §2。",
          },
        ],
      },
    ],
  },
  {
    id: "access-control-device-pagination",
    documentRefs: {
      prd: { section: "6.1 PC 端列表页交互规格", match: "菜单路径：物联网IOT管理 → 门禁设备（/iot/access-devices", element: "text" },
    },
    targetId: "access-control-device-pagination",
    number: 4,
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
  {
    id: "access-control-device-fields",
    documentRefs: {
      fields: { section: "门禁设备 字段清单", match: "列表展示为更新人/时间复合列", element: "row" },
      rules: { section: "【设备类型分类与行操作矩阵】(R01)", match: "挂锁门禁：仅展示【获取门锁密码】、【设备数据】、【重命名】、【绑定仓库】、【移除", element: "text" },
    },
    targetId: "access-control-device-table",
    number: 5,
    kind: "字段",
    title: "设备列表字段字典",
    content:
      "列表展示设备名称、设备编码、设备类型、绑定仓库、在线状态、最新数据时间与更新人；审核配置命中与否决定获取密码走审批还是免审。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "列表字段字典",
            content: `| 字段名称 | 控件类型 | 必填 | 取值范围与格式 | 展示规则 | 说明 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **设备名称** | 文本 | 必填 | 最多 50 个字符 | 单行 | — |
| **设备编码** | 文本 | 必填 | 设备唯一编码，如 LK-2024-0082 | 单行完整展示 | 支持复制 |
| **设备类型** | 标签 | 必填 | 挂锁 / 人脸门禁 / 监控 / 温湿度 / GPS | 单行 | 决定获取密码入口文案 |
| **绑定仓库** | 文本 | 条件必填 | 仓库-库房-分区 | 单行 | 未绑定显示「未绑定」 |
| **在线状态** | 状态标签 | 系统维护 | 在线 / 离线 | 彩色标签 | — |
| **最新数据时间** | 日期时间 | 系统记录 | YYYY-MM-DD HH:mm:ss | 单行 | 离线设备为最后上报时间 |
| **更新人 / 更新时间** | 双行复合 | 系统记录 | 上行更新人、下行时间 | 两行合并列 | — |
| **操作** | 行操作按钮 | — | 获取密码 / 重命名 / 仓库绑定 / 人脸配置 / 设备数据 / 移除 | 直出 ≤3 个，其余进【更多】 | 获取密码文案随类型变化 |`,
          },
        ],
      },
    ],
  },
]
