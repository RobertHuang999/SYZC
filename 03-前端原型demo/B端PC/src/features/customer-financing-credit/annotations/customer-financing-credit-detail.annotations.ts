import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const customerFinancingCreditDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "credit-detail-header",
    targetId: "credit-detail-header",
    number: 1,
    kind: "页面",
    title: "授信业务详情与顶栏状态摘要",
    content:
      "集中呈现客户授信单号、当前融资状态徽章、所属资方机构、申请时间与最新处理人。支持一键返回列表或在具备权限时直接触发额度核准或改标操作。",
    documentRefs: {
      prd: { section: "5.2 授信详情抽屉/页面", match: "授信详情抽屉", element: "text" },
      fields: { section: "二、系统与审计字段", match: "授信任务编号", element: "row" },
    },
    details: [
      {
        title: "顶栏业务概要",
        items: [
          {
            label: "所属资方机构 (R02)",
            content: "明确呈现当前任务归属金融机构（如建设银行、华夏银行），确保多租户数据隔离合规。",
          },
          {
            label: "流转状态",
            content: "实时展示【授信已受理】、【申请成功】或【申请失败】。",
          },
        ],
      },
    ],
  },
  {
    id: "credit-detail-applicant",
    targetId: "credit-detail-applicant",
    number: 2,
    kind: "字段",
    title: "申请主体资质与经办信息板块",
    content:
      "展示借款企业工商全称或个人姓名、统一社会信用代码/身份证号、法人代表姓名、经办人姓名及联系电话（严格掩码脱敏）。",
    documentRefs: {
      prd: { section: "5.2 授信详情抽屉/页面", match: "申请主体基本资质", element: "text" },
      fields: { section: "一、业务字段", match: "申请人名称", element: "row" },
    },
    details: [
      {
        title: "数据风控要求",
        items: [
          {
            label: "隐私保护",
            content: "经办人手机号与身份证号严格遵循脱敏规范。",
          },
        ],
      },
    ],
  },
  {
    id: "credit-detail-risk",
    targetId: "credit-detail-risk",
    number: 3,
    kind: "规则",
    title: "前置尽调结论与智风控评估专区",
    content:
      "针对免尽调单据展示“免尽调直接授信”绿标；针对经过实地尽调的单据展示尽调评分、风控报告摘要及尽调核验说明。",
    documentRefs: {
      prd: { section: "5.2 授信详情抽屉/页面", match: "前置尽调与风控专区", element: "text" },
      rules: { section: "一、对象定位与单据层级", match: "单据来源", element: "row" },
    },
  },
  {
    id: "credit-detail-collateral",
    targetId: "credit-detail-collateral",
    number: 4,
    kind: "字段",
    title: "抵质押物标的清单与货值评估",
    content:
      "展示存货明细（货物大类、细类、规格型号、数量吨位、监管库位、申报货值）或数字仓单详情（仓单号、开单监管库、估值、冻结状态）。仓单支持点击穿透跳转。",
    documentRefs: {
      prd: { section: "5.2 授信详情抽屉/页面", match: "抵质押物标的清单", element: "text" },
      fields: { section: "一、业务字段", match: "抵/质押物", element: "row" },
    },
  },
  {
    id: "credit-detail-history",
    targetId: "credit-detail-history",
    number: 5,
    kind: "规则",
    title: "审批轨迹、改标记录与全链路审计追溯",
    content:
      "完整按时间倒序追踪单据上游接入、专员核准授信、标记失败原因、双向改标自纠偏及下游抵质押状态锁定全链路存证（遵循R03/R05/P01）。",
    documentRefs: {
      prd: { section: "5.2 授信详情抽屉/页面", match: "审批轨迹与改标历史", element: "text" },
      fields: { section: "二、系统与审计字段", match: "改标历史记录", element: "row" },
    },
  },
]
