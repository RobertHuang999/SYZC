import type { PrototypeAnnotation } from "@/shared/annotations/annotation.types"

export const myApplyRecordsListAnnotations: PrototypeAnnotation[] = [
  {
    id: "my-apply-records-page",
    targetId: "my-apply-records-page",
    number: 1,
    kind: "页面",
    title: "H5 我的申请记录 · 三 Tab 壳页",
    content:
      "业务办理 → 我的申请记录。与 PC「我的申请管理」一致拆分为流程申请 / 政策资讯 / 开锁审核三个独立 Tab，URL 同步 ?tab=process|policy|unlock-applies。",
    details: [
      {
        title: "入口与路由",
        items: [
          {
            label: "路由",
            content:
              "/m/my-applies?tab=process（默认）| policy | unlock-applies；开锁详情 /m/my-applies/unlock/:applyNo，返回时回到开锁 Tab。",
          },
          {
            label: "Tab 对齐 PC",
            content:
              "流程申请 ↔ 我的流程申请；政策资讯 ↔ 我的政策资讯申请（占位）；开锁审核 ↔ 我的开锁申请。",
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
    title: "页头 Tab 切换",
    content:
      "横向滚动 Chip 按钮；切换 Tab 更新 URL；流程申请/政策资讯展示「功能将在后续版本接入…」占位，开锁审核为完整列表。",
    details: [
      {
        title: "Tab 状态",
        items: [
          {
            label: "流程申请 / 政策资讯",
            content:
              "展示「功能将在后续版本接入，与 PC 端对应 Tab 保持一致」占位。",
          },
          {
            label: "开锁审核",
            content: "已接入完整列表与筛选。",
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
    title: "各 Tab 独立筛选",
    content:
      "流程 Tab：占位「功能将在后续版本接入…」。开锁 Tab：设备/申请人关键词 + 是否需要审核 + 申请状态 + 凭证状态 + 发起日期；即时过滤，无单独查询按钮。",
    details: [
      {
        title: "开锁 Tab 规则",
        items: [
          {
            label: "是否需要审核",
            content: "全部 / 是 / 否；仅展示当前用户（zhang3）的开锁申请。",
          },
          {
            label: "申请状态 / 凭证状态",
            content:
              "单选 Pill 筛选，与 PC 完整页默认行筛选项对齐；默认「全部」表示不过滤。",
          },
          {
            label: "筛选持久化",
            content: "开锁 Tab 筛选条件 sessionStorage 持久化，返回列表时保留。",
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
    title: "列表卡片",
    content:
      "流程/政策 Tab 为占位文案；开锁 Tab 展示 MyUnlockApplyCard（提交时间、设备、凭证状态、查看详情）。",
    details: [
      {
        title: "空态",
        items: [
          {
            label: "开锁 Tab 空列表",
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
    content: "NavBar + 页头摘要框（单号/设备/申请与凭证状态 Tag）+ KeyValue 分区；可折叠：审批配置/记录/凭证信息。",
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
            content: "审批配置默认收起；已通过时审批记录默认展开。",
          },
          {
            label: "返回",
            content: "NavBar 返回 /m/my-applies?tab=unlock-applies。",
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
    title: "凭证信息 SectionCard",
    content:
      "已通过时展示凭证区：已下发→密码+复制；密码下发失败→失败原因+重新获取密码（脱敏展示不可复制）。",
    details: [
      {
        title: "操作",
        items: [
          {
            label: "重新获取密码",
            content: "凭证=生成失败或密码下发失败时展示；成功后→已下发。",
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
