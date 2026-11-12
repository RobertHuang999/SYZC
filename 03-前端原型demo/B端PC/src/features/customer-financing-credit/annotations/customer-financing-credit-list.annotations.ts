import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const customerFinancingCreditListAnnotations: PrototypeAnnotation[] = [
  {
    id: "credit-page",
    targetId: "credit-page",
    number: 1,
    kind: "页面",
    title: "客户融资授信办理台账定位与资方信贷决策",
    content:
      "本页面为融资监管/融资管理第3节点核心业务台账，承接在上游节点（需求线索免尽调件、尽调办理成功件或被拒退回池重分配件）中已锁定合作资方机构的融资申请单据。由目标资方机构授权审核人员进行全员共享审核，录入核准授信额度与期数并标记申请成功以激活下游线上监管业务办理，或标记申请失败入池归集，并在未发起抵质押前提供可控双向改标能力（遵循R01~R06、C01~C03、P01~P02）。",
    documentRefs: {
      prd: { section: "1. 业务背景与核心痛点", match: "模块定位", element: "text" },
      fields: { section: "一、业务字段", match: "融资状态", element: "row" },
      rules: { section: "一、对象定位与单据层级", match: "单据层级", element: "text" },
    },
    details: [
      {
        title: "核心业务边界",
        items: [
          {
            label: "消除冗余按钮 (R01)",
            content: "分配资方动作已在上游节点完成，本页面无分配资方按钮，单据接入初始状态即为【授信已受理】。",
          },
          {
            label: "资方全员共享 (R02)",
            content: "严格按所属资方机构多租户物理隔离；所属资方内具备信贷审批权限的专员共享任务池，任一人员均可直接操作办理，免去专员认领与转交瓶颈。",
          },
          {
            label: "激活下游抵质押 (R06)",
            content: "标记成功后即时在【线上监管业务办理】激活业务发起入口，快照透传借款主体、授信额度与质押标的。",
          },
        ],
      },
    ],
  },
  {
    id: "credit-filters",
    targetId: "credit-filters",
    number: 2,
    kind: "交互",
    title: "多维组合筛选区与检索规则",
    content:
      "提供综合搜索（产品名称/申请人模糊匹配）、融资状态（全部、授信已受理、申请成功、申请失败）、申请人类型（企业货主、个人货主）、需要尽调（是、否）四项条件筛选。支持一键查询与重置恢复默认状态。",
    documentRefs: {
      prd: { section: "5.1 客户融资授信办理主列表页（P-RZ-003）", match: "筛选查询区排布", element: "text" },
      fields: { section: "三、展示规则与关联约束", match: "多维组合筛选控件规格", element: "text" },
    },
    details: [
      {
        title: "筛选匹配特性",
        items: [
          {
            label: "综合搜索",
            content: "单行文本输入框，同时模糊检索产品名称或借款申请人全称。",
          },
          {
            label: "状态精确匹配",
            content: "下拉单选框精准过滤当前业务流转阶段。",
          },
        ],
      },
    ],
  },
  {
    id: "credit-table",
    targetId: "credit-table",
    number: 3,
    kind: "字段",
    title: "授信核心业务要素与大宗商品台账展示",
    content:
      "包含产品名称、需要尽调彩标、申请人类型、申请人全称、抵/质押物（仓单支持穿透跳转仓单档案）、意向融资金额与期数、授信核准金额与期数、融资状态彩标、处理人员及时间。单号完整展示不折叠，操作列实色固定防穿透。",
    documentRefs: {
      prd: { section: "5.1 客户融资授信办理主列表页（P-RZ-003）", match: "数据表格呈现", element: "row" },
      fields: { section: "三、展示规则与关联约束", match: "列表业务字段排布顺序", element: "text" },
    },
    details: [
      {
        title: "字段展示口径",
        items: [
          {
            label: "金额展示",
            content: "意向融资金额与授信金额均为单位元，千分位展示并保留4位小数；未核准时授信额度期数均展示“--”。",
          },
          {
            label: "穿透查验",
            content: "抵/质押物为“仓单”时提供文字链接直达【仓储-仓单管理】对应仓单档案详情。",
          },
        ],
      },
    ],
  },
  {
    id: "credit-actions",
    targetId: "credit-actions",
    number: 4,
    kind: "规则",
    title: "动态操作能力矩阵与双向改标锁定机制",
    content:
      "根据单据当前状态动态呈现可用操作：【授信已受理】展示【查看】、【标记申请成功】、【标记申请失败】；【申请成功】展示【查看】及未发起抵质押时的【改标为失败】；【申请失败】展示【查看】及未重新调度时的【改标为成功】。一旦下游发起抵质押确认，改标通道即刻永久锁定（遵循R03/C01）。",
    documentRefs: {
      prd: { section: "6. 核心业务规则索引与追溯", match: "R03", element: "row" },
      rules: { section: "四、动作能力矩阵", match: "动作能力矩阵", element: "row" },
    },
    details: [
      {
        title: "状态机联动规则",
        items: [
          {
            label: "标记申请成功 (R04)",
            content: "必须录入资方正式审批授信金额(>0)与授信期数(≥1正整数)，缺失强阻断 (C02)。",
          },
          {
            label: "标记申请失败 (R05)",
            content: "必须录入拒绝原因分类与详细说明(≤300字)，可靠写入【被拒退回池 -> 授信失败标签页】(C03)。",
          },
          {
            label: "未发起抵质押改标 (R03)",
            content: "在借款人或监管员尚未提交线上抵质押前，支持成功/失败互改自纠偏；一旦提交则强制锁定 (C01)。",
          },
        ],
      },
    ],
  },
]
