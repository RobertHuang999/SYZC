import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const abnormalRecordDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "abnormal-detail-header",
    targetId: "abnormal-detail-header",
    number: 1,
    kind: "字段",
    title: "异动单号与单据类型标识",
    content:
      "头部完整展示 19 位异动单号并提供一键复制；根据源头单据属性清晰展示单据类型标签（存货单、质押单、抵押单、监管业务单）；展示申请人、申请时间与生效时间。",
    documentRefs: {
      prd: {
        section: "6.3 异动详情多卡片聚合弹窗（P-CKG-013-DETAIL-MODAL）",
        match: "异动单号",
        element: "text",
      },
      fields: {
        section: "五、异动详情多卡片弹窗字段",
        match: "异动单号",
        element: "row",
      },
      rules: {
        section: "4. 异动类型聚合与可见性穿透规则",
        match: "多货物穿透可见性数据权限",
        element: "text",
      },
    },
    details: [
      {
        title: "展示细节",
        items: [
          {
            label: "单据类型",
            content: "区分存货单、质押单、抵押单、监管业务单并提供徽标区分。",
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-detail-card",
    targetId: "abnormal-detail-card",
    number: 2,
    kind: "交互",
    title: "一单多物纵向卡片与差额对比",
    content:
      "支持一张异动单包含多件货物时纵向分卡片排布。每张卡片高亮展示剩余数量与红升绿降差额；支持展开查看存货条码与二维码生成时间；展示存放位置、变动前数量、变动后数量、变动类型、变动原因及现场照片大图预览。",
    documentRefs: {
      prd: {
        section: "6.3 异动详情多卡片聚合弹窗（P-CKG-013-DETAIL-MODAL）",
        match: "多卡片聚合详情弹窗",
        element: "text",
      },
      fields: {
        section: "五、异动详情多卡片弹窗字段",
        match: "变动后数量",
        element: "row",
      },
      rules: {
        section: "2. 差额试算与输入防护规则",
        match: "差异数量自动试算与红升绿降规则",
        element: "text",
      },
    },
    details: [
      {
        title: "多物聚合",
        items: [
          {
            label: "纵向卡片",
            content: "一单多物纵向排布，清晰对比每件货物调账前后的数量及原因。",
          },
        ],
      },
    ],
  },
  {
    id: "abnormal-detail-timeline",
    targetId: "abnormal-detail-timeline",
    number: 3,
    kind: "规则",
    title: "审批记录时间轴与全流程审计",
    content:
      "底部展示完整的审批流程名称与时间轴流转记录（如申请提交、分配、任务、仅抄送、审批通过）。支持点击【任务详情 >】穿透至工作中心流程详情，形成全生命周期闭环审计证据链。",
    documentRefs: {
      prd: {
        section: "6.3 异动详情多卡片聚合弹窗（P-CKG-013-DETAIL-MODAL）",
        match: "审批记录时间轴",
        element: "text",
      },
      fields: {
        section: "五、异动详情多卡片弹窗字段",
        match: "审批记录时间轴",
        element: "row",
      },
      rules: {
        section: "3. 审批流转与状态互斥锁定规则",
        match: "审批流转与货位状态互斥锁定",
        element: "text",
      },
    },
    details: [
      {
        title: "流程溯源",
        items: [
          {
            label: "审批时间轴",
            content: "展示经办人、抄送人、处理人及流转时间，支持任务详情跳转。",
          },
        ],
      },
    ],
  },
]
