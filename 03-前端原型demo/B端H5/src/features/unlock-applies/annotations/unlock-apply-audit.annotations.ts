import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const unlockApplyAuditH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "h5-unlock-audit-list-page",
    targetId: "h5-unlock-audit-list-page",
    number: 1,
    kind: "页面",
    title: "开锁审批 · H5 移动列表与权限架构",
    content:
      "业务办理 → 其他审批 → 开锁审批。移动端审批人集中处理门禁临时开锁申请，独立于常规流程审批待办。",
    details: [
      {
        title: "状态流转图",
        items: [
          {
            label: "审批状态流转",
            content: `flowchart TD
    A["提交开锁申请"] --> B["待审批 (PENDING)"]
    B -->|"审批通过"| C["已通过 (APPROVED)"]
    B -->|"审批驳回 (必填原因)"| D["已驳回 (REJECTED)"]
    B -->|"申请人撤回"| E["已撤回 (WITHDRAWN)"]
    B -->|"超时自动作废"| F["已失效 (EXPIRED)"]
    C -->|"挂锁门禁"| G["调用密码服务并短信下发"]
    C -->|"人脸门禁"| H["生成临时密码 (页面展示/不调短信)"]`,
          },
          {
            label: "生命周期说明",
            content: "待审批、已通过、已驳回、已撤回、已失效；终态单据均保留只读快照供溯源查阅。",
          },
        ],
      },
      {
        title: "审批权限与自审禁止",
        items: [
          {
            label: "P04 审批资格",
            content:
              "当前登录用户须为配置节点中指定的人员或包含的角色成员，且账号处于启用状态。",
          },
          {
            label: "P06 自审禁止（R11）",
            content:
              "运行时比较当前用户账号、申请人账号与配置快照审批节点；审批人不能审批自己发起的开锁申请。若为本人申请，卡片底部仅展示「详情 ▸」，不提供「去审批 ▸」操作。",
          },
          {
            label: "P01b 合作机构协同",
            content:
              "支持跨合作机构审批人员登录 H5 端协同审核，仅展示其管辖与合作范围内的业务单据。",
          },
          {
            label: "P05 数据权限",
            content: "仓管角色仅可见管辖仓库下的开锁申请；管理员可见租户全量数据。",
          },
        ],
      },
    ],
  },
  {
    id: "h5-unlock-audit-filter",
    targetId: "h5-unlock-audit-filter",
    number: 2,
    kind: "交互",
    title: "搜索与申请状态胶囊过滤",
    content:
      "搜索框支持申请单号、设备、申请人、事由即时过滤；申请状态下拉胶囊默认「待审批」（L04），可选已处理与全部。真实系统中的「待分配 / 未通过 / 已撤销」统一展示为「待审批 / 已驳回 / 已撤回」。",
    details: [
      {
        title: "过滤逻辑",
        items: [
          {
            label: "待审批",
            content: "status === PENDING，优先聚焦待处理单据。",
          },
          {
            label: "已处理",
            content: "status ∈ {APPROVED, REJECTED, WITHDRAWN, EXPIRED}，查看历史归档。",
          },
          {
            label: "全部",
            content: "展示全量历史申请流水。",
          },
        ],
      },
    ],
  },
  {
    id: "h5-unlock-audit-card",
    targetId: "h5-unlock-audit-card",
    number: 3,
    kind: "字段",
    title: "卡片结构与审批操作",
    content:
      "卡片展示设备名称、申请状态 Tag、绑定仓库、申请人（所属机构）、事由与提交时间；底链区分「去审批 ▸」与「详情 ▸」。",
    details: [
      {
        title: "移动端审批弹窗（R10~R13）",
        items: [
          {
            label: "审批通过",
            content: "审批意见选填（≤200 字）；确认后仅回写申请状态并触发后置凭证生成，凭证由申请人侧「我的申请」查看。",
          },
          {
            label: "审批驳回",
            content: "驳回原因 **强制必填**（≤200 字）；确认后申请流转至已驳回终态。",
          },
          {
            label: "人脸门禁凭证差异 (R31)",
            content: "人脸门禁审批通过后生成临时密码，**不调用短信服务**；审批人侧不展示凭证，申请人侧页面查看。",
          },
        ],
      },
    ],
  },
]

export const unlockApplyAuditH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "h5-unlock-audit-detail-page",
    targetId: "h5-unlock-audit-detail-page",
    number: 1,
    kind: "页面",
    title: "开锁审批详情 · 审批人移动端操作与快照",
    content:
      "展示申请单设备与位置、申请内容、审批配置快照与审批记录；支持审批人在移动端执行通过与驳回操作；审批人侧不展示开锁凭证信息。",
    details: [
      {
        title: "处理权限与交互",
        items: [
          {
            label: "待审批 + 有权限",
            content: "底部固定展示「去审批」主按钮，点击唤起通过/驳回弹窗；审批后即时刷新单据状态。",
          },
          {
            label: "已处理 / 非当前审批人",
            content: "只读展示申请单全量快照与审批历史流水，底部提示「您不是当前审批人，仅可查看。」。",
          },
        ],
      },
      {
        title: "分区快照规范",
        items: [
          {
            label: "设备与位置",
            content: "展示设备编码、名称、类型、所属仓库、库房及分区位置快照。",
          },
          {
            label: "申请内容",
            content: "展示申请人「姓名（所属机构）」、脱敏手机号、开锁事由、有效期及提交时间。",
          },
          {
            label: "审批配置与记录",
            content: "固化提交时的配置编号、版本号、审批方式及各节点审批人处理结论与意见留痕；不展示凭证状态、凭证编号或临时密码。",
          },
        ],
      },
    ],
  },
]
