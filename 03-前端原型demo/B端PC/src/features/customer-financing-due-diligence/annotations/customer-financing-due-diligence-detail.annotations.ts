import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const customerFinancingDueDiligenceDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "detail-header",
    targetId: "detail-header",
    number: 1,
    kind: "页面",
    title: "尽调任务详情与状态看板",
    content:
      "展示尽调任务单号、所属申请产品、双态标签页状态徽章以及全生命周期操作动作条。支持一键复制尽调单号与返回列表，按单据所处状态（待尽调、受理中、受理成功、受理失败、申请失败）动态渲染业务操作。",
    documentRefs: {
      prd: { section: "5.2 尽调详情抽屉/页面", match: "主体基本信息卡片", element: "text" },
      fields: { section: "一、业务字段", match: "尽调状态", element: "row" },
      rules: { section: "六、动作能力矩阵", match: "查看详情", element: "row" },
    },
    details: [
      {
        title: "业务流转",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["线索分配跟进（需要尽调 = 是）"] --> B["待尽调"]
    B -->|受理| C["受理中"]
    C -->|尽调通过| D["受理成功<br/>转授信办理"]
    C -->|尽调不通过| E["受理失败"]
    E --> F["申请失败"]
    D --> G["授信已受理"]`,
          },
        ],
      },
    ],
  },
  {
    id: "detail-applicant-section",
    targetId: "detail-applicant-section",
    number: 2,
    kind: "字段",
    title: "主体资质信息与经办人脱敏规范",
    content:
      "包含申请人主体名称、申请人类型（企业/个人）、统一社会信用代码/身份证号、法人代表及经办人脱敏联系方式（严格隐藏中间4位）。专员在此核实借款人真实身份与营业资质，作为发起智风控的前置准入保障（遵循R01）。",
    documentRefs: {
      prd: { section: "5.2 尽调详情抽屉/页面", match: "主体基本信息卡片", element: "text" },
      fields: { section: "一、业务字段", match: "申请人标识", element: "row" },
      rules: { section: "七、核心业务规则清单", match: "【尽调责任人独占与主体资质核验规则】(R01)", element: "text" },
    },
  },
  {
    id: "detail-collateral-section",
    targetId: "detail-collateral-section",
    number: 3,
    kind: "字段",
    title: "质押物标的明细与仓单穿透",
    content:
      "展示质押资产形态（存货或仓单）。若为存货，展示大类、品类、规格、在库数量、单位、存储库位及申报货值；若为仓单，展示仓单编号、开单仓库、货值估价及冻结状态，并支持点击穿透调阅电子仓单凭证档案。",
    documentRefs: {
      prd: { section: "5.2 尽调详情抽屉/页面", match: "现场尽调材料清单", element: "text" },
      fields: { section: "二、明细字段", match: "存货明细", element: "row" },
      rules: { section: "二、数量、金额与口径隔离表", match: "意向融资金额（元）", element: "row" },
    },
  },
  {
    id: "detail-risk-section",
    targetId: "detail-risk-section",
    number: 4,
    kind: "规则",
    title: "智风控大数据核验结论与安全签名 (P02)",
    content:
      "展示第三方智风控平台返回的综合得分、信用结论（PASS/REJECT/REVIEW）及大数据排查摘要。前端采用15分钟临时单点登录（SSO）安全签名加载，严禁明文暴露接口秘钥与私有存储地址（遵循P02）。",
    documentRefs: {
      prd: { section: "5.2 尽调详情抽屉/页面", match: "智风控报告专区", element: "text" },
      fields: { section: "一、业务字段", match: "智风控结论", element: "row" },
      rules: { section: "九、权限、风控与安全控制", match: "【智风控单点登录安全签名与报告防泄露】(P02)", element: "text" },
    },
  },
  {
    id: "detail-attachments-section",
    targetId: "detail-attachments-section",
    number: 5,
    kind: "规则",
    title: "现场尽调材料清单与报告归档门禁 (R04/C03)",
    content:
      "归档线下实地勘验照片、权属证明文件及加盖公章的正式尽调报告文件（PDF/Word）。针对受理成功件，必须至少存在1份有效尽调报告，方可向合作资方机构分流派发（遵循R04/C03）。",
    documentRefs: {
      prd: { section: "5.2 尽调详情抽屉/页面", match: "现场尽调材料清单", element: "text" },
      fields: { section: "一、业务字段", match: "尽调报告附件", element: "row" },
      rules: { section: "八、异常阻断规则", match: "【缺少尽调报告分配资方阻断】(C03)", element: "text" },
    },
  },
  {
    id: "detail-audit-section",
    targetId: "detail-audit-section",
    number: 6,
    kind: "规则",
    title: "全生命周期流转与审计存证轨迹 (P03)",
    content:
      "时间轴逆序记录单据自线索分发、专员转交、发起智风控、外部网关回调、报告归档至分配资方或手动拒绝入池的全路径不可篡改审计快照，具备完整司法存证效力（遵循P03）。",
    documentRefs: {
      prd: { section: "5.2 尽调详情抽屉/页面", match: "审批轨迹时间轴", element: "text" },
      fields: { section: "三、系统与审计字段", match: "操作审计日志", element: "row" },
      rules: { section: "九、权限、风控与安全控制", match: "【全链路尽调操作审计日志存证】(P03)", element: "text" },
    },
  },
  {
    id: "dd-detail-fields",
    documentRefs: {
      fields: { section: "一、业务字段", match: "意向融资期数", element: "row" },
      rules: { section: "【金额与期数口径隔离与透传规则】(R07)", match: "尽调阶段严格继承上游线索的意向融资金额与意向融资期数，只读展示，不可由尽调专员修", element: "text" },
    },
    targetId: "detail-applicant-section",
    number: 99,
    kind: "字段",
    title: "字段字典",
    content: "展示产品、申请人、抵质押物、意向金额与期数、授信/贷款回写值及尽调节点状态。",
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
| **融资状态** | 状态标签 | 系统维护 | 待尽调 / 受理中 / 受理成功 / 受理失败 / 申请失败 | 彩色标签 |
| **附件资料** | 文件组 | 条件必填 | 最多 10 份，图片 / PDF / Word | 详情上传与预览 |`,
          },
        ],
      },
    ],
  },
  {
    id: "dd-detail-actions",
    documentRefs: {
      prd: { section: "1.1 业务背景" },
      rules: { section: "1. 尽调准入与转交规则" },
    },
    targetId: "detail-header",
    number: 98,
    kind: "交互",
    title: "页头操作与业务提示",
    content:
      "尽调专员按状态推进受理、转交、智风控与结论；驳回须填原因。",
    details: [
      {
        title: "操作矩阵",
        items: [
          {
            label: "按钮与提示",
            content: `| 操作 | 可见状态 | 点击后发生什么 | 提示原话 |
| :--- | :--- | :--- | :--- |
| **受理** | 待尽调 | 状态置受理中，开始尽调 | — |
| **转交** | 待尽调 / 受理中 | 选择同组织尽调专员后转交 | 「请选择转交对象」 |
| **智风控核验** | 受理中 | 调用第三方模型并回显结果 | 失败提示「模型调用失败，请稍后重试」 |
| **受理成功** | 受理中 | 上传尽调报告后置受理成功并转授信 | 未传报告时阻断「请上传尽调报告」 |
| **受理失败 / 驳回** | 受理中 | 必填原因后置失败/驳回入池 | 「请填写原因（最多 200 字）」 |`,
          },
        ],
      },
    ],
  },
]
