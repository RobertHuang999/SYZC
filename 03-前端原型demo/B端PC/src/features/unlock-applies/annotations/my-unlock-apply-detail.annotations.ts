import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const myUnlockApplyDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "my-unlock-apply-detail-page",
    documentRefs: {
      prd: { section: "开锁申请 主PRD", match: "状态为「待审批」：展示【详情】、【撤回】；", element: "text" },
      rules: { section: "【待审批主动撤回与防并发控制】(R23)", match: "可撤回窗口：仅处于「待审批」状态的申请，允许申请人本人在 PC 端或移动端主动发", element: "text" },
    },
    targetId: "my-unlock-apply-detail-page",
    number: 1,
    kind: "页面",
    title: "我的开锁申请详情 · 申请人视角与撤回控制",
    content:
      "从「我的开锁申请」列表或设备端 Deep Link 进入；只读展示申请单快照、审批记录与门禁开门凭证；待审批状态下申请人可主动撤回。",
    details: [
      {
        title: "页面架构与交互路径",
        items: [
          {
            label: "入口与返回",
            content:
              "支持从列表进入，或由门禁设备提交后 Deep Link `?tab=unlock-applies&applyNo=xxx` 直达；顶部返回按钮保留原上下文及 `return_route` 参数。",
          },
          {
            label: "Mock 样例单号",
            content:
              "待审批 UA28001/28002 · 凭证已下发 UA27015/27020/28007 · 生成失败 UA26008/26011/24007/28008 · 过期 UA26012/27021 · 被覆盖 UA22004/26013/28009 · 详见列表标注 §Mock 场景索引。",
          },
          {
            label: "撤回主操作 (Withdraw)",
            content:
              "仅在申请状态为 **待审批（PENDING）** 且属于需审批单据时展示【撤回】按钮；其他终态（已通过/已驳回/已撤回/已失效）全只读展示。",
          },
        ],
      },
      {
        title: "申请与凭证状态",
        items: [
          {
            label: "状态流转图",
            content: `flowchart TD
    A["提交开锁申请"] --> B["待审批"]
    B -->|审批通过| C["已通过"]
    B -->|审批驳回| D["已驳回"]
    B -->|申请人撤回| E["已撤回"]
    B -->|审批超时| F["已失效"]
    C --> G{"凭证生成"}
    G -->|成功| H["已下发"]
    G -->|密码服务失败| I["生成失败（可重新获取）"]
    H -->|超时未用| J["已过期"]
    H -->|设备密码更新| K["已失效（被覆盖）"]`,
          },
          {
            label: "申请人能做什么",
            content: "待审批可【撤回】；已通过可查看凭证状态并申请重新获取；已驳回 / 已撤回 / 已失效为终态，只能查看。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-base",
    documentRefs: {
      fields: { section: "开锁申请 字段清单", match: "是否需要审核", element: "row" },
      rules: { section: "3.1 状态定义", match: "无需审核 (NOAPPROVALREQUIRED)：免审直发模式自动落账状态，终", element: "text" },
    },
    targetId: "my-unlock-apply-detail-base",
    number: 2,
    kind: "字段",
    title: "基础信息与审核模式标识",
    content:
      "展示申请流水单号、申请状态 Tag、凭证状态 Tag、提交时间戳以及【是否需要审核】标识。",
    details: [
      {
        title: "关键字段说明",
        items: [
          {
            label: "是否需要审核 (R-MYAPP-08)",
            content:
              "展示「是」或「否」；「是」表示命中已启用开锁审批配置；「否」表示设备未配置审批，走原有免审直发临时密码模式。",
          },
          {
            label: "申请状态与凭证状态双 Tag",
            content:
              "申请状态反映审核生命周期（待审批/已通过/已驳回/已撤回/已失效）；凭证状态反映开门密码生命周期（未生成/已下发/生成失败/已过期/已失效）。复核或密码服务失败时申请保持已通过、凭证=生成失败。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-device",
    documentRefs: {
      fields: { section: "二、门禁设备与位置快照字段", match: "安装库房/分区", element: "row" },
    },
    targetId: "my-unlock-apply-detail-device",
    number: 3,
    kind: "字段",
    title: "目标设备与库位快照",
    content:
      "展示申请提交时固化的设备档案（设备编码、设备名称、设备类型、绑定仓库、库房、分区及具体安装位置）。",
    details: [
      {
        title: "快照机制",
        items: [
          {
            label: "数据不可变性",
            content: "展示申请提交时的瞬时主数据快照，即使后续设备解绑、更名或移位，历史申请单据数据仍保持原始真实状态。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-apply",
    documentRefs: {
      fields: { section: "三、开锁申请内容与佐证字段", match: "现场开锁的补充情况说明", element: "row" },
      rules: { section: "开锁申请 业务规则规格", match: "【发起申请】", element: "row" },
    },
    targetId: "my-unlock-apply-detail-apply",
    number: 4,
    kind: "字段",
    title: "申请内容与所属合作机构",
    content:
      "展示申请人姓名、申请人所属机构、脱敏手机号、开锁事由、补充备注及有效期。",
    details: [
      {
        title: "字段与安全规范",
        items: [
          {
            label: "所属机构",
            content: "展示申请人所归属的合作机构全称（如「浙商监管部」），便于多方协同追溯。",
          },
          {
            label: "有效期",
            content: "与发起申请弹窗一致的有效起止时间；超过结束时间凭证自动失效。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-approval",
    documentRefs: {
      fields: { section: "四、审批配置与责任链快照字段", match: "命中配置编号", element: "row" },
    },
    targetId: "my-unlock-apply-detail-approval",
    number: 5,
    kind: "字段",
    title: "审批配置快照与审批流转记录",
    content:
      "展示提交时固化的配置编号、版本、审批方式（任一人通过）、超时时长与节点链；并展示审批人员的处理结果与意见。",
    details: [
      {
        title: "快照与记录详情",
        items: [
          {
            label: "审批配置快照 (C04/C05)",
            content: "固化配置编号（如「UNLOCK-CFG-20260828-001」）与版本号；不受后续配置变更影响。",
          },
          {
            label: "审批记录表格",
            content: "展示各节点处理人姓名（账号）、审批结果（通过/驳回）、审批意见或驳回原因、处理时间；待审批时提示「暂无记录，等待审批」。",
          },
          {
            label: "驳回原因展示",
            content: "审批驳回时高亮展示具体驳回原因，便于申请人知晓原因并重新提交。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-credential",
    documentRefs: {
      rules: { section: "一、单据与能力定位", match: "业务单据与凭证交付层（Business Document & Credentia", element: "row" },
    },
    targetId: "my-unlock-apply-detail-credential",
    number: 6,
    kind: "规则",
    title: "开门凭证卡片 · 挂锁与人脸统一规范",
    content:
      "集中展示开门密码、有效时段、密码复制与重试能力；凭证分为 5 态（未生成、已下发、生成失败、已过期、已失效）。",
    details: [
      {
        title: "凭证状态与卡片交互",
        items: [
          {
            label: "已下发 (DELIVERED)",
            content:
              "大号字体展示明文开门密码，提供【一键复制】按钮；展示密码有效截止时间（如「有效期至 2026-08-28 16:30:00」）。",
          },
          {
            label: "生成失败 (GEN_FAILED)",
            content:
              "密码服务超时或设备通信异常时触发，展示失败原因说明，并提供 **【重新获取密码】** 按钮，点击直接重试密码生成服务。",
          },
          {
            label: "已过期 / 已失效 (EXPIRED / INVALIDATED)",
            content: "已过有效期的密码打码隐藏或置灰，提示「密码已过期，请重新申请」。",
          },
          {
            label: "人脸三方下发失败备注 (26010)",
            content: "三方门禁下发失败时，凭证状态仍为【已下发】，详情卡片展示明文密码并标注三方终端网络异常提示。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-withdraw",
    documentRefs: {
      prd: { section: "5.2 状态流转图" },
      rules: { section: "3.2 状态机流转图" },
    },
    targetId: "my-unlock-apply-detail-page",
    number: 7,
    kind: "交互",
    title: "申请人主动撤回确认与并发拦截",
    content:
      "点击【撤回】弹出二次确认弹窗；确认后提交服务端流转状态并拦截并发冲突。",
    details: [
      {
        title: "撤回交互机制",
        items: [
          {
            label: "二次确认文案",
            content: "「确认撤回该开锁申请？撤回后审批人将无法继续处理。」，点击确定后提交撤回。",
          },
          {
            label: "并发防御拦截",
            content:
              "提交时若审批人已完成通过或驳回（状态已非 PENDING），服务端阻断并 Toast 提示「撤回失败：申请状态已变更」，前端刷新单据最新状态。",
          },
        ],
      },
    ],
  },
  {
    id: "my-unlock-apply-detail-fields",
    documentRefs: {
      fields: { section: "开锁申请 字段清单", match: "申请人手机号", element: "row" },
      rules: { section: "3.1 状态定义", match: "已撤回 (REVOKED)：申请人在审批前主动撤回，流程终止；", element: "text" },
    },
    targetId: "my-unlock-apply-detail-base",
    number: 8,
    kind: "字段",
    title: "基础信息字段字典",
    content:
      "详情展示申请单号、申请人、设备、事由、有效期、审核模式、申请状态与凭证状态。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "字段",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **申请单号** | 文本 | 系统生成 | UA + 数字串 | 可复制 |
| **申请人** | 文本 | 系统记录 | 姓名(所属机构) | 单行 |
| **是否需要审核** | 标签 | 必填 | 是 / 否 | 否 = 免审直发 |
| **设备名称 / 编码** | 文本 | 必填 | 提交时快照 | 单行 |
| **事由** | 标签 | 必填 | 出库 / 入库 / 移库 / 参观 / 其他 | 单行 |
| **有效期** | 时间范围 | 必填 | 起止时间，最长 24 小时 | 单行 |
| **申请状态** | 状态标签 | 系统维护 | 待审批 / 已通过 / 已驳回 / 已撤回 / 已失效 | 彩色标签 |
| **凭证状态** | 状态标签 | 系统维护 | 未生成 / 已下发 / 生成失败 / 已过期 / 已失效 | 彩色标签 |
| **开锁次数** | 只读数值 | 条件展示 | 仅人脸门禁 | 单行 |`,
          },
        ],
      },
    ],
  },
]
