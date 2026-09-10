import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const myApplyRecordsListAnnotations: PrototypeAnnotation[] = [
  {
    id: "my-apply-records-page",
    targetId: "my-apply-records-page",
    number: 1,
    kind: "页面",
    title: "H5 我的申请记录 · 三 Tab 壳页与架构",
    content:
      "业务办理 → 我的申请记录。与 PC「我的申请管理」一致拆分为流程申请 / 政策资讯 / 开锁审核三个独立 Tab，URL 同步 `?tab=process|policy|unlock-applies`。",
    details: [
      {
        title: "入口与路由分流",
        items: [
          {
            label: "路由架构",
            content:
              "`/m/my-applies?tab=process`（默认）| `policy` | `unlock-applies`；开锁详情 `/m/my-applies/unlock/:applyNo`，返回时回到开锁 Tab。",
          },
          {
            label: "Tab 对齐 PC",
            content:
              "流程申请 ↔ 我的流程申请；政策资讯 ↔ 我的政策资讯申请（占位）；开锁审核 ↔ 我的开锁申请。",
          },
          {
            label: "Deep Link 直达",
            content:
              "从门禁设备获取密码成功后，通过 Deep Link 直达详情页并支持回跳门禁设备。R07 阻断时 Toast 留在 Sheet 内。",
          },
          {
            label: "Mock 场景索引",
            content:
              "23 条与 PC 对齐；R07：LK-2024-0082 / FACE-01；可提交：LK-0085。见 MOCK_DATA V1.7 §2 / Demo 列表 §6.1。",
          },
        ],
      },
      {
        title: "状态流转图",
        items: [
          {
            label: "申请状态流转",
            content: `flowchart TD
    A["提交开锁申请"] --> B["待审批 (可撤回)"]
    B -->|"审批通过"| C["已通过 (生成凭证)"]
    B -->|"审批驳回"| D["已驳回"]
    B -->|"主动撤回"| E["已撤回"]
    B -->|"超时作废"| F["已失效"]
    C --> G["凭证流转: 未生成 / 已下发 / 生成失败 / 已过期 / 已失效"]`,
          },
        ],
      },
    ],
  },
  {
    id: "my-apply-records-tabs",
    targetId: "my-apply-records-tabs",
    number: 2,
    kind: "交互",
    title: "页头 Tab 切换与占位",
    content:
      "横向滑动 Chip 胶囊按钮；切换 Tab 同步更新 URL；流程申请/政策资讯展示后续接入占位，开锁审核为完整列表。",
    details: [
      {
        title: "Tab 状态说明",
        items: [
          {
            label: "流程申请 / 政策资讯",
            content:
              "展示「功能将在后续版本接入，与 PC 端对应 Tab 保持一致」占位状态。",
          },
          {
            label: "开锁审核",
            content: "已接入移动端全量申请列表、状态筛选与卡片交互。",
          },
        ],
      },
    ],
  },
  {
    id: "my-apply-records-filter",
    targetId: "my-apply-records-filter",
    number: 3,
    kind: "交互",
    title: "开锁 Tab 独立筛选与持久化",
    content:
      "支持设备/申请人关键词模糊检索 + 是否需要审核 + 申请状态 + 凭证状态（5 态）+ 发起日期范围；即时过滤无需单独查询按钮。申请状态统一展示为待审批 / 已通过 / 已驳回 / 已撤回 / 已失效，其中真实系统旧称待分配 / 未通过 / 已撤销分别对应待审批 / 已驳回 / 已撤回。",
    details: [
      {
        title: "筛选规则",
        items: [
          {
            label: "是否需要审核",
            content: "单选：全部 / 是 / 否；「是」=命中审批；「否」=免审直发。",
          },
          {
            label: "申请状态与凭证状态",
            content:
              "单选 Pill 胶囊；凭证包含 5 态（未生成 / 已下发 / 生成失败 / 已过期 / 已失效）；「生成失败」=密码服务调用失败，挂锁/人脸统一。",
          },
          {
            label: "筛选持久化",
            content: "开锁 Tab 筛选条件自动保存在 sessionStorage 中，返回列表时保持过滤状态。",
          },
        ],
      },
    ],
  },
  {
    id: "my-apply-records-cards",
    targetId: "my-apply-records-cards",
    number: 4,
    kind: "字段",
    title: "列表卡片与典型场景",
    content:
      "开锁 Tab 展示 MyUnlockApplyCard（提交时间、设备名称/编码、所属仓库、事由、双状态 Tag、查看详情）。",
    details: [
      {
        title: "Mock 场景索引（与 PC 对齐 · 23 条）",
        items: [
          {
            label: "R07 在途",
            content: "UA20260828001（挂锁-LK02）· UA20260828002（人脸-FC01）· 门禁设备再次提交阻断。",
          },
          {
            label: "LK-0085 终态/凭证态",
            content: "UA28004 驳回 · UA28005 撤回 · UA28006 失效 · UA28007~09 已通过各凭证态。",
          },
          {
            label: "免审",
            content: "UA20260828003 · UA20260827016 · needsApproval=false。",
          },
        ],
      },
      {
        title: "卡片验收样例",
        items: [
          {
            label: "UA20260828001",
            content: "待审批 · 详情页可撤回 · 对应 R07 阻断设备 LK-2024-0082。",
          },
          {
            label: "UA20260827015 / UA20260827020",
            content: "已通过 · DELIVERED · 人脸 R31 / 挂锁密码+复制。",
          },
          {
            label: "UA20260826008 / UA20260826011",
            content: "GEN_FAILED · 详情【重新获取密码】。",
          },
          {
            label: "UA20260826010",
            content: "人脸 · 三方失败 · 凭证仍 DELIVERED。",
          },
          {
            label: "UA20260826012 / UA20260827021 / UA20260828009",
            content: "EXPIRED 或 SUPERSEDED · 详情不展示/失效提示。",
          },
          {
            label: "文档对齐",
            content: "Demo 列表 §6 · MOCK_DATA V1.7 · unlock-applies-seed.ts。",
          },
        ],
      },
      {
        title: "空态规范",
        items: [
          {
            label: "暂无申请",
            content: "展示空态图标与「暂无开锁申请」，并提供快捷跳转至门禁设备列表发起开锁申请。",
          },
        ],
      },
    ],
  },
]

export const myUnlockApplyDetailH5Annotations: PrototypeAnnotation[] = [
  {
    id: "my-unlock-apply-detail-h5-page",
    targetId: "my-unlock-apply-detail-h5-page",
    number: 1,
    kind: "页面",
    title: "H5 开锁申请详情 · 申请人视角与撤回控制",
    content:
      "NavBar + 页头摘要框（单号/设备/申请状态与凭证状态 Tag）+ 分区 KeyValue 展示；支持折叠查看审批配置与审批记录；待审批时支持底部撤回。",
    details: [
      {
        title: "布局与交互",
        items: [
          {
            label: "分区排版",
            content: "基础信息、设备与位置快照、申请内容、审批配置快照、审批记录、凭证信息。",
          },
          {
            label: "折叠默认状态",
            content: "审批配置快照默认收起；已通过或有记录时审批记录默认展开。",
          },
          {
            label: "返回导航",
            content: "顶部 NavBar 返回保留 `?tab=unlock-applies` 及 `return_route`。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-h5-credential",
    targetId: "my-unlock-apply-detail-h5-credential",
    number: 2,
    kind: "规则",
    title: "开门凭证卡片 · 挂锁与人脸统一规范",
    content:
      "集中展示开门密码、有效时段、密码复制与重试能力；凭证分为 5 态（未生成、已下发、生成失败、已过期、已失效）。",
    details: [
      {
        title: "凭证状态分轨与交互",
        items: [
          {
            label: "已下发 (DELIVERED)",
            content: "大号字号展示明文密码，提供【复制密码】按钮；展示截止有效期。",
          },
          {
            label: "生成失败 (GEN_FAILED)",
            content: "展示失败原因说明，并提供 **【重新获取密码】** 按钮重试服务。",
          },
          {
            label: "人脸三方下发失败 (26010)",
            content: "三方门禁失败时凭证仍为【已下发】，详情展示密码并标注终端离线备注。",
          },
          {
            label: "过期与被覆盖",
            content: "不展示明文密码，提示「密码已失效，请重新申请」。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-h5-withdraw",
    targetId: "my-unlock-apply-detail-h5-withdraw",
    number: 3,
    kind: "规则",
    title: "底部撤回操作与二次确认",
    content:
      "待审批状态下固定底部展示【撤回申请】主按钮；点击弹出二次确认弹窗，防御并发状态变更。",
    details: [
      {
        title: "撤回交互机制",
        items: [
          {
            label: "二次确认",
            content: "文案：「确认撤回该开锁申请？撤回后审批人将无法继续处理。」。",
          },
          {
            label: "并发拦截",
            content: "提交时若单据已非待审批，Toast 提示「撤回失败：申请状态已变更」并刷新单据。",
          },
        ],
      },
    ],
  },
]
