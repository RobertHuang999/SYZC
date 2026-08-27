import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const riskDisclosureDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "risk-disclosure-detail-header",
    targetId: "risk-disclosure-detail-header",
    number: 1,
    kind: "页面",
    title: "风险公示详情与撤回管理",
    content: "展示公示事实全文、关联订单与原预警快照，支持风控主管录入理由后取消公示。",
    details: [
      {
        title: "公示流转与权限控制",
        items: [
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
    title: "公示核心信息与正文事实",
    content: "展示公示标题、订单号、货主企业名称、规则名称、当前状态、发布时间、操作人与公示全文。",
    details: [
      {
        title: "字段说明",
        items: [
          {
            label: "公示正文内容",
            content: "结构化展现订单发生跌价、逾期或物联异常的具体数值与处置结论（多行长文本排版）。",
          },
          {
            label: "取消说明（若有）",
            content: "若记录状态为【已取消】，在基本信息中回显取消时填写的详细申诉/核实理由。",
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
    title: "原预警快照数据固化",
    content: "不可变固化原押品预警的预警类型、内容、预警时间、处置人、处置时间与原始抓拍图。",
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
