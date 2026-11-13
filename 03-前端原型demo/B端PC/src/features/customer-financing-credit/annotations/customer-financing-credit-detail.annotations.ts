import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const customerFinancingCreditDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "credit-detail-header",
    documentRefs: {
      prd: { section: "客户融资授信办理主PRD", match: "标题：“核准授信额度”；", element: "text" },
      rules: { section: "客户融资授信办理业务规则规格", match: "改标为申请失败", element: "row" },
    },
    targetId: "credit-detail-header",
    number: 1,
    kind: "页面",
    title: "授信业务详情与顶栏状态摘要",
    content:
      "集中呈现客户授信单号、当前融资状态徽章、所属资方机构、申请时间与最新处理人。支持一键返回列表或在具备权限时直接触发额度核准或改标操作。",
    details: [
      {
        title: "业务流转",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["线上抵质押 / 线索免尽调件"] --> B["授信已受理"]
    A2["尽调受理成功"] --> B
    B -->|资方审核| C{"审核结果"}
    C -->|通过| D["申请成功<br/>录入授信金额与期数"]
    C -->|不通过| E["申请失败"]`,
          },
        ],
      },
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
  {
    id: "cr-detail-fields",
    documentRefs: {
      fields: { section: "一、业务字段", match: "授信金额（元）", element: "row" },
      rules: { section: "【授信核准金额与期数合规校验规则】(R04)", match: "授信期数必须为大于等于 1 的正整数；", element: "text" },
    },
    targetId: "credit-detail-applicant",
    number: 99,
    kind: "字段",
    title: "字段字典",
    content: "展示产品、申请人、抵质押物、意向金额与期数、授信/贷款回写值及授信节点状态。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "字段",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **产品名称** | 文本 | 系统带出 | 继承线索 | 列表 / 详情 |
| **申请人名称** | 文本 | 系统带出 | 企业全称 / 个人姓名 | 支持综合搜索 |
| **申请人电话** | 文本 | 系统带出 | 11 位，脱敏中间 4 位 | 详情展示 |
| **抵/质押物** | 标签 | 系统带出 | 存货 / 仓单 | 仓单可穿透 |
| **意向融资金额** | 数值 | 系统带出 | 元，保留 4 位小数 | 右对齐 |
| **意向融资期数** | 数值 | 系统带出 | 正整数 | 单行 |
| **授信金额 / 期数** | 数值 | 条件回写 | 元，4 位小数；期数 | 未授信显示「—」 |
| **贷款金额 / 期数** | 数值 | 条件回写 | 元，4 位小数；期数 | 未放款显示「—」 |
| **融资状态** | 状态标签 | 系统维护 | 授信已受理 / 申请成功 / 申请失败 | 彩色标签 |
| **附件资料** | 文件组 | 条件必填 | 最多 10 份，图片 / PDF / Word | 详情上传与预览 |`,
          },
        ],
      },
    ],
  },
  {
    id: "credit-detail-actions",
    documentRefs: {
      prd: { section: "1.1 业务背景" },
      rules: { section: "【未发起抵质押前双向改标规则】(R03)" },
    },
    targetId: "credit-detail-header",
    number: 98,
    kind: "交互",
    title: "页头操作与业务提示",
    content:
      "资方审核人可标记授信成功或失败；未发起抵质押前支持双向改标；已发起后锁定。",
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "按钮与提示",
            content: `| 操作 | 可见状态 | 点击后发生什么 | 提示原话 |
| :--- | :--- | :--- | :--- |
| **标记申请成功** | 授信已受理 | 弹窗录入授信金额与期数，保存后状态置申请成功 | 金额或期数缺失时阻断「请填写授信金额与期数」 |
| **标记申请失败** | 授信已受理 | 必填失败原因后置申请失败并入被拒池 | 「请填写失败原因（最多 200 字）」 |
| **改标** | 未发起抵质押 | 成功/失败可在允许范围内互改 | 已发起抵质押后按钮置灰「已进入抵质押办理，不可改标」 |
| **查看附件** | 全部 | 预览申请与尽调附件 | — |`,
          },
        ],
      },
    ],
  },
]
