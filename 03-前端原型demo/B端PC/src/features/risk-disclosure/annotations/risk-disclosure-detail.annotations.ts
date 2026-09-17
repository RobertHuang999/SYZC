import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const riskDisclosureDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "risk-disclosure-detail-header",
    targetId: "risk-disclosure-detail-header",
    number: 1,
    kind: "页面",
    title: "风险公示详情与撤回管理 · 司法存证全流程",
    content: "展示公示状态、独立快照字段（预警/处置分区）与操作记录；支持风控主管录入理由后取消公示并全链路审计留痕。双入口（押品预警 / 风险公示台账）详情字段一致。",
    details: [
      {
        title: "公示流转与权限控制",
        items: [
          {
            label: "合规流转与撤回图",
            content: `flowchart TD
    A["押品预警 (已处理有效)"] --> B["合规审核通过发起公示"]
    B --> C["对外公开披露 (公示事实+证据快照)"]
    C --> D{"借款主体债务重组/消除隐患"}
    D -->|风控经理发起取消公示| E["强制录入取消理由 (限200字)"]
    E --> F["状态流转为已取消"]
    F --> G["记录全路径审计流水 (操作人+时间+IP+理由)"]`,
          },
          {
            label: "合规流程",
            content: "已公示记录对外公开；如借款主体已完成债务重组或经风控复核确认消除隐患，可执行【取消公示】撤回披露。",
          },
          {
            label: "操作权限",
            content: "取消公示属于敏感风控操作，仅 R-RISK-MGR（风控经理）及以上角色具备操作权限。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-detail-info",
    targetId: "risk-disclosure-detail-info",
    number: 2,
    kind: "字段",
    title: "公示状态与快照字段分区",
    content: "公示状态区展示状态、公示时间、操作人与取消说明；快照区按「公示信息 / 处置信息」两卡片展示独立副本字段，不再使用合成的「公示标题/公示内容」块。",
    details: [
      {
        title: "字段说明",
        items: [
          {
            label: "公示信息快照",
            content: "订单号（只读）、预警时间、预警类型、位置、设备名称、预警描述、预警抓拍图；来源于发布时固化副本，可按合规要求在确认页编辑后落账。",
          },
          {
            label: "处置信息快照",
            content: "处理人、解除方式（自动解除类展示）、解除时间、情况说明、现场照片、解除预警抓拍图。",
          },
          {
            label: "取消说明（若有）",
            content: "若记录状态为【已取消】，在公示状态区回显取消时填写的 1~200 字合规说明。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-detail-snapshot",
    targetId: "risk-disclosure-detail-snapshot",
    number: 3,
    kind: "规则",
    title: "独立快照解耦与不可回写",
    content: "公示详情展示的是发布时生成的独立快照副本；取消公示或重新公示均不回写押品预警原始事实。",
    details: [
      {
        title: "不可变审计",
        items: [
          {
            label: "快照溯源",
            content: "即使后续订单状态变迁或规则删除，原预警触发时的指标快照与抓拍原图始终保持原样不变，保障司法证据效力。",
          },
          {
            label: "时效签名图片",
            content: "点击查看原预警抓拍图，向私有 OSS 动态申请临时访问签名。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-detail-history",
    targetId: "risk-disclosure-detail-history",
    number: 4,
    kind: "规则",
    title: "全路径操作审计历史",
    content: "以表格时间轴呈现该公示记录从【发起公示】到【取消公示】的全流程操作人、时间与备注。",
    details: [
      {
        title: "审计要求",
        items: [
          {
            label: "审计字段",
            content: "包含操作类型 (action)、操作人账号姓名 (operator)、操作时间 (operated_at) 与操作备注 (remark)。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-detail-cancel-dialog",
    targetId: "risk-disclosure-detail-header",
    number: 5,
    kind: "交互",
    title: "取消公示弹窗与校验规则",
    content: "点击取消公示弹出二次确认弹窗，强制录入取消说明理由（限 200 字）并校验非空。",
    details: [
      {
        title: "交互与校验约束",
        items: [
          {
            label: "取消理由必填",
            content: "多行文本输入框，最长 200 字；理由为空时【确认取消】按钮保持禁用。",
          },
          {
            label: "操作反馈",
            content: "提交成功后关闭弹窗，页面状态刷新为【已取消】，并弹出 Toast 提示操作成功。",
          },
        ],
      },
    ],
  },
]
