import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const myApplyRecordsListAnnotations: PrototypeAnnotation[] = [
  {
    id: "my-apply-records-page",
    targetId: "my-apply-records-page",
    number: 1,
    kind: "页面",
    title: "H5 我的申请记录 · 统一列表",
    content:
      "业务办理 → 我的申请记录。混合展示流程申请与开锁审批；开锁卡片仅当前用户（zhang3）可见；筛选「开锁审批」对齐 PC Tab「我的开锁申请」。",
    details: [
      {
        title: "入口与路由",
        items: [
          {
            label: "路由",
            content: "/m/my-applies；详情 /m/my-applies/unlock/:applyNo。",
          },
          {
            label: "业务类型筛选",
            content: "全部 / 流程申请 / 开锁审批；选开锁审批时列表仅 UNLOCK_APPLY 卡片。",
          },
        ],
      },
    ],
  },
  {
    id: "my-apply-records-filter",
    targetId: "my-apply-records-filter",
    number: 2,
    kind: "交互",
    title: "搜索与筛选 Pill",
    content: "即时过滤（无单独查询按钮）；搜索不含申请单号；开锁模式下 placeholder 为设备名称/编码/申请人。",
    details: [
      {
        title: "筛选项",
        items: [
          {
            label: "是否需要审核",
            content: "全部 / 是 / 否；选「否」时开锁列表为空（与 PC 一致）。",
          },
          {
            label: "发起日期",
            content: "起止 date input；与 submitTime 比较。",
          },
          {
            label: "筛选持久化",
            content: "筛选条件写入 sessionStorage；进入详情再返回列表时保留业务类型/日期/搜索等条件。",
          },
        ],
      },
    ],
  },
  {
    id: "my-apply-records-cards",
    targetId: "my-apply-records-cards",
    number: 3,
    kind: "字段",
    title: "开锁申请卡片",
    content: "提交时间 +「开锁·临时授权」、挂锁/人脸图标、仓库/凭证状态/事由/发起人；仅「查看详情」入口。",
    details: [
      {
        title: "空态",
        items: [
          {
            label: "开锁审批空列表",
            content: "「暂无开锁申请」+ 引导至设备管理 → 门禁设备发起临时开锁申请。",
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
    title: "H5 开锁申请详情",
    content: "NavBar + 页头摘要框（单号/设备/状态 Tag）+ KeyValue 分区；可折叠：审批配置/记录/凭证/关联事务。",
    details: [
      {
        title: "布局",
        items: [
          {
            label: "KeyValue",
            content: "左 label 右 value；长文本 break-all。",
          },
          {
            label: "折叠默认",
            content: "审批配置/关联事务默认收起；已通过时审批记录默认展开。",
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
    title: "凭证区 · R31 人脸无短信",
    content: "人脸：仅页面密码 + 复制 + 无短信提示。挂锁：短信状态/失败原因/重新下发。",
    details: [
      {
        title: "操作",
        items: [
          {
            label: "复制 / 重发短信",
            content: "复制 Toast；重发后 credential.status→DELIVERED、smsStatus→发送成功。",
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
    title: "底部撤回栏",
    content: "待审批时固定底栏「撤回申请」+ 二次确认；文案与 PC 一致。",
    details: [],
  },
]
