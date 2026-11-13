import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const customerFinancingDueDiligenceListAnnotations: PrototypeAnnotation[] = [
  {
    id: "diligence-page",
    documentRefs: {
      prd: { section: "客户融资尽调办理主PRD", match: "尽调专员本人", element: "row" },
      rules: { section: "客户融资尽调办理业务规则规格", match: "尽调完成标签页", element: "row" },
    },
    targetId: "diligence-page",
    number: 1,
    kind: "页面",
    title: "客户融资尽调办理台账定位与风控执行中枢",
    content:
      "本页面为融资监管/融资管理第2节点风控执行处理中枢，承接上游【客户融资需求线索】分流的“需要尽调=是”任务件，解耦提供【待尽调】与【尽调完成】双标签页视图。赋能尽调专员推进主体资质复核、同组织任务转交、第三方智风控模型异步调用、线下实地核验报告归档，以及审批通过后向合作资方机构的派发流转与异常单据驳回入池全闭环（遵循R01~R08）。",
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
      {
        title: "核心业务边界",
        items: [
          {
            label: "数据来源",
            content: "需求线索自动派单或被拒退回池重指派生成，1:1 继承主体与融资金额期数口径（遵循R07）。",
          },
          {
            label: "双标签页解耦",
            content: "待尽调标签页承载【待尽调】与【受理中】；尽调完成标签页承载【受理成功】、【受理失败】与【申请失败】（遵循R05）。",
          },
          {
            label: "下游流转",
            content: "尽调通过并分配资方后流转至【客户融资授信办理】；失败件可靠投递至【被拒退回池 -> 尽调失败标签页】（遵循R03/R04）。",
          },
        ],
      },
    ],
  },
  {
    id: "diligence-tabs",
    targetId: "diligence-tabs",
    number: 2,
    kind: "交互",
    title: "双标签页解耦架构与【客户尽调记录】操作",
    content:
      "解耦划分【待尽调】与【尽调完成】双标签页，标签页只展示分类名称、不显示待办数字角标。对齐现网布局，在筛选区右上角提供【客户尽调记录】操作入口，点击可调阅全量历史归档的客户尽调台账。",
    documentRefs: {
      prd: { section: "5.1 客户融资尽调办理主列表页（P-RZ-002）", match: "顶部双标签页切换", element: "text" },
      fields: { section: "四、展示规则与关联约束", match: "双标签页筛选状态联动", element: "text" },
      rules: { section: "三、状态定义与双标签页解耦架构", match: "业务界面严格解耦划分", element: "row" },
    },
    details: [
      {
        title: "状态联动规则",
        items: [
          {
            label: "待尽调标签页",
            content: "仅容纳 待尽调 (PENDING_DILIGENCE) 与 受理中 (IN_PROCESSING)。",
          },
          {
            label: "尽调完成标签页",
            content: "归档容纳 受理成功 (DILIGENCE_SUCCESS)、受理失败 (DILIGENCE_FAILED) 及 申请失败 (MANUAL_REJECTED)，只读保护禁止重新尽调 (R05)。",
          },
        ],
      },
    ],
  },
  {
    id: "diligence-filters",
    targetId: "diligence-filters",
    number: 3,
    kind: "交互",
    title: "筛选区（100% 对齐现网 3 项筛选布局）",
    content:
      "严格对齐现网真实页面布局，筛选区提供精准 3 项条件控件：1. 综合搜索（申请人/产品）、2. 申请类型（全部/企业/个人）、3. 尽调状态（依据当前标签页自适应选项）。右侧紧随白底【重置】与主色实心【查询】按钮。支持草稿态与生效态隔离，回车或点击查询触发检索。",
    documentRefs: {
      prd: { section: "5.1 客户融资尽调办理主列表页（P-RZ-002）", match: "筛选查询区排布", element: "text" },
      fields: { section: "四、展示规则与关联约束", match: "双标签页筛选状态联动", element: "text" },
      rules: { section: "六、动作能力矩阵", match: "查看详情", element: "row" },
    },
  },
  {
    id: "diligence-table",
    targetId: "diligence-table",
    number: 4,
    kind: "字段",
    title: "数据表格13列规格（对齐现网老表头与空值占位）",
    content:
      "表格完整对齐现网13列规格：序号、产品名称、申请人、意向融资金额、意向融资期数、货物、申请时间、授信金额、授信期数、贷款金额、贷款期数、状态、操作。未发生的授信金额/期数、贷款金额/期数严格采用「--」占位，行高固定72px，全站统一苹方正文字体（严禁滥用 font-mono），Sticky 操作列使用 100% 不透明实色背景与立体投影防穿透。",
    documentRefs: {
      prd: { section: "5.1 客户融资尽调办理主列表页（P-RZ-002）", match: "数据表格呈现", element: "text" },
      fields: { section: "四、展示规则与关联约束", match: "列表业务字段排布顺序", element: "text" },
      rules: { section: "二、数量、金额与口径隔离表", match: "意向融资金额（元）", element: "row" },
    },
    details: [
      {
        title: "字段规范",
        items: [
          {
            label: "货物与仓单穿透",
            content: "展示货物类别名称；若质押物为【仓单】，提供深蓝色文字链接穿透跳转至仓单档案详情。",
          },
          {
            label: "空值占位规范 (R07)",
            content: "未产生下游授信与放款前，授信金额、授信期数、贷款金额、贷款期数统一以「--」占位。",
          },
        ],
      },
    ],
  },
  {
    id: "diligence-action-trigger",
    targetId: "diligence-action-trigger",
    number: 5,
    kind: "规则",
    title: "主体要素核验与发起智风控 (R01/R06/S02)",
    content:
      "仅限指派尽调专员本人或超管可操作。发起前强校验企业工商统一代码/个人身份证合规。点击【发起尽调】后异步调用第三方智风控 OpenAPI，单据状态即刻推进至【受理中】（保留在待尽调标签页），避免专员界面白屏死等；模型计算完成后自动通过网关回调收敛状态。",
    documentRefs: {
      prd: { section: "4. 业务场景与用户故事", match: "场景 2【主体要素核对与发起智风控模型核验】", element: "row" },
      fields: { section: "一、业务字段", match: "智风控结论", element: "row" },
      rules: { section: "七、核心业务规则清单", match: "【尽调责任人独占与主体资质核验规则】(R01)", element: "text" },
    },
  },
  {
    id: "diligence-action-transfer",
    targetId: "diligence-action-transfer",
    number: 6,
    kind: "规则",
    title: "同组织任务转交与审计留痕 (R02/C01/S01)",
    content:
      "尽调专员因外出或调休无法履职时，支持点击【任务转交】。弹窗下拉单选框仅加载同属于当前组织机构下的在职同事，跨机构转交时系统强制阻断 (C01)。转交成功后责任人即时更新并写入转交审计日志，状态保持待尽调。",
    documentRefs: {
      prd: { section: "4. 业务场景与用户故事", match: "场景 1【待尽调任务认领与同组织内部转交】", element: "row" },
      fields: { section: "三、系统与审计字段", match: "转交记录", element: "row" },
      rules: { section: "七、核心业务规则清单", match: "【同机构任务转交与流转审计规则】(R02)", element: "text" },
    },
  },
  {
    id: "diligence-action-reject",
    targetId: "diligence-action-reject",
    number: 7,
    kind: "规则",
    title: "手动拒绝不可逆与入池归集 (R03/C02/S04)",
    content:
      "现场实地勘查发现借款企业停产或押品查封等严重异常时，专员可点击【手动拒绝】。弹窗强制要求选择拒绝原因分类并录入详细说明（必填且不超过300字，未填阻断 C02）。提交后二次确认生效，单据标记为【申请失败】并移入完成标签页，可靠投递入被拒退回池。",
    documentRefs: {
      prd: { section: "4. 业务场景与用户故事", match: "场景 4【实地核查异常尽调专员手动拒绝入池】", element: "row" },
      fields: { section: "三、系统与审计字段", match: "手动拒绝说明", element: "row" },
      rules: { section: "七、核心业务规则清单", match: "【手动拒绝不可逆与原因入池规则】(R03)", element: "text" },
    },
  },
  {
    id: "diligence-action-assign",
    targetId: "diligence-action-assign",
    number: 8,
    kind: "规则",
    title: "尽调报告归档与分配合作资方 (R04/C03/S03)",
    content:
      "仅针对“受理成功”单据开放。点击【分配给资方】前，系统强校验附件列表中必须至少包含1份正式尽调报告盖章件（PDF/Word），无报告强制阻断提交 (C03)。选择有效准入的合作资方银行后确认，自动向【客户融资授信办理】推送授信任务，尽调阶段终结。",
    documentRefs: {
      prd: { section: "4. 业务场景与用户故事", match: "场景 3【尽调报告归档与审批通过分配资方】", element: "row" },
      fields: { section: "一、业务字段", match: "尽调报告附件", element: "row" },
      rules: { section: "七、核心业务规则清单", match: "【尽调报告附件齐备与资方分配规则】(R04)", element: "text" },
    },
  },
  {
    id: "dd-list-fields",
    documentRefs: {
      fields: { section: "一、业务字段", match: "意向融资期数", element: "row" },
      rules: { section: "【金额与期数口径隔离与透传规则】(R07)", match: "尽调阶段严格继承上游线索的意向融资金额与意向融资期数，只读展示，不可由尽调专员修", element: "text" },
    },
    targetId: "diligence-table",
    number: 99,
    kind: "字段",
    title: "列表字段字典",
    content: "列表展示产品、申请人、抵质押物、意向金额与期数、授信/贷款回写值、尽调状态与需要尽调标记。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "字段",
            content: `| 列名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **产品名称** | 文本 | 系统带出 | 继承线索 | 单行 |
| **申请人名称** | 文本 | 系统带出 | 企业全称 / 个人姓名 | 综合搜索 |
| **抵/质押物** | 标签 | 系统带出 | 存货 / 仓单 | 仓单可穿透 |
| **意向融资金额** | 数值 | 系统带出 | 元，4 位小数 | 右对齐 |
| **意向融资期数** | 数值 | 系统带出 | 正整数 | 单行 |
| **授信金额 / 期数** | 数值 | 条件回写 | 元，4 位小数；期数 | 未授信「—」 |
| **贷款金额 / 期数** | 数值 | 条件回写 | 元，4 位小数；期数 | 未放款「—」 |
| **融资状态** | 状态标签 | 系统维护 | 待尽调 / 受理中 / 受理成功 / 受理失败 / 申请失败 | 彩色标签 |
| **需要尽调** | 徽标 | 系统带出 | 固定「是」 | 单行 |
| **操作** | 行操作按钮 | — | 详情 / 转交 / 智风控 / 通过 / 驳回 | 按状态渲染 |`,
          },
        ],
      },
    ],
  },
]
