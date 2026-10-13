import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const outboundH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "outbound-h5-list",
    targetId: "outbound-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 仓储 · 出库管理",
    content:
      "移动端出库管理生效归档台账（对齐原路径 货物管理～出库）。接口固定过滤已通过 APPROVED 单据，展示出库单号、货主信息、出库类型、出库时间、货物明细摘要及操作项；支持查看详情、单据下载与记录下载；不设状态筛选（O13）。",
    documentRefs: {
      prd: { section: "6.1 出库记录 — 列表页", match: "已生效", element: "text" },
      rules: { section: "【已通过台账专网过滤与不可变快照】(O13)", match: "APPROVED", element: "text" },
    },
    details: [
      {
        title: "移动端台账规范",
        items: [
          {
            label: "入口与路由",
            content: "工作台 → 仓储 → 出库管理（/m/workspace/outbound-records）。",
          },
        ],
      },
    ],
  },
]

export const outboundH5InitiateAnnotations: PrototypeAnnotation[] = [
  {
    id: "outbound-h5-initiate",
    targetId: "outbound-h5-initiate",
    number: 1,
    kind: "页面",
    title: "业务办理 · 业务发起 · 出库发起",
    content:
      "移动端出库发起业务制单页（参考 wrl-agency-native cargo/outbound-goods 与最新基准版 PRD）。支持货主选择、出库类型（普通出库、仓单出库、质押出库、抵押出库）、关联业务单号带出货物、货品勾选与出库数量录入、提货人信息核验与出库现场照片上传；执行先解押后发货硬控，提交前必须核验现场照片与库存可用量（O02/O06/O10）。",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "业务发起", element: "text" },
      rules: { section: "【关联单号带出与行级独立勾选】(O02)", match: "O02", element: "text" },
    },
    details: [
      {
        title: "制单风控",
        items: [
          {
            label: "O02 独立勾选",
            content: "首列独立勾选，未勾选不计入汇总，已勾选必须录入有效数量。",
          },
          {
            label: "C06 照片必传",
            content: "必须上传至少 1 张现场实物照片方可提交审核。",
          },
        ],
      },
    ],
  },
]

export const outboundH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "outbound-h5-detail",
    targetId: "outbound-h5-detail",
    number: 1,
    kind: "页面",
    title: "移动端 · 出库详情",
    content:
      "展示出库单号（带一键复制）、绿色【已通过】印章、货主信息、出库类型、货物位置与出库前后数量明细、出库现场影像、审批履历时间轴；若已完成现场提货回写，展示提货人信息及【提货记录】板块（O11/O13）。",
    documentRefs: {
      prd: { section: "6.2 出库单详情页", match: "提货记录", element: "text" },
      rules: { section: "【提货单自动生成与现场影像存证】(O11)", match: "提货记录", element: "text" },
    },
    details: [
      {
        title: "展示闭环",
        items: [
          {
            label: "提货记录",
            content: "仅在提货完成后展示提货人与现场出场记录。",
          },
        ],
      },
    ],
  },
]
