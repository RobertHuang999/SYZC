import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const customerFinancingLeadsListAnnotations: PrototypeAnnotation[] = [
  {
    id: "leads-page",
    documentRefs: {
      prd: { section: "客户融资需求线索主PRD", match: "申请失败：【详情】。", element: "text" },
      rules: { section: "客户融资需求线索业务规则规格", match: "接入融资申请", element: "row" },
    },
    targetId: "leads-page",
    number: 1,
    kind: "页面",
    title: "融资需求线索台账定位与首节点职责",
    content:
      "本页面为融资监管/融资管理第1节点核心台账，统一接收外部C端客户提交的动产质押融资申请，生成线索流水记录，支持运营人员直接完成核验派单（分配跟进流转至处理中）或异常驳回入池（申请失败）全生命周期闭环。",
    details: [
      {
        title: "核心业务边界",
        items: [
          {
            label: "数据来源",
            content: "外部C端移动门户或第三方对接接口通过标准API以流水号防重推送接入（遵循R01/R02）。",
          },
          {
            label: "下游协同",
            content: "依【需要尽调】快照分别流转至【客户融资尽调办理】或【客户融资授信办理】（遵循R03/R07）。",
          },
          {
            label: "异常归集",
            content: "不准入单据驳回后可靠沉淀至【被拒退回池 -> 线索被拒标签页】（遵循R04）。",
          },
        ],
      },
      {
        title: "线索全生命周期",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["C 端门户 / 第三方 API 推送线索"] --> B["待受理"]
    B -->|基础校验通过| C["已受理"]
    C -->|分配跟进（按需尽调快照分流）| D["处理中"]
    D -->|尽调 / 授信通过| E["申请成功"]
    B -->|驳回（原因必填）| F["申请失败"]
    C -->|主动驳回| F
    F -->|进入被拒退回池| G["线索被拒标签页<br/>可救活重派"]`,
          },
          {
            label: "分流依据",
            content: "需要尽调 = 是 → 派尽调专员；否 → 派合作资方。分流只看建单快照 (R03)，后续改产品规则不影响。",
          },
        ],
      },
    ],
  },
  {
    id: "leads-filters",
    targetId: "leads-filters",
    number: 2,
    kind: "交互",
    title: "多维组合筛选区（标准4列栅格）",
    content:
      "严格遵循PC端列表页筛选区规范，采用标准4列等分栅格（lg:grid-cols-4），支持综合搜索（产品名称/申请人模糊匹配）、需要尽调（全部/是/否）、融资状态（全部/待受理/处理中/申请成功/申请失败）及抵/质押物类型精确匹配。草稿态与生效态隔离，回车或点击【查询】触发检索。",
    documentRefs: {
      prd: { section: "5.1 客户融资需求线索主列表页（P-RZ-001）", match: "筛选查询区排布", element: "text" },
      fields: { section: "四、展示规则与关联约束", match: "多维组合筛选控件规格", element: "text" },
      rules: { section: "五、动作能力矩阵", match: "列表组合筛选与导出", element: "row" },
    },
    details: [
      {
        title: "交互规范",
        items: [
          {
            label: "综合搜索",
            content: "单行文本输入框，输入产品名称或申请人全称/简称，支持双向模糊匹配。",
          },
          {
            label: "重置与查询",
            content: "点【重置】清空筛选条件回到全部数据；输入草稿不即时刷新，点击【查询】后写回生效态。",
          },
        ],
      },
    ],
  },
  {
    id: "leads-table",
    targetId: "leads-table",
    number: 3,
    kind: "字段",
    title: "线索数据表格14列排布与万元口径 (方案 B)",
    content:
      "严格对齐现网14列经典排布：序号、产品名称、申请人、意向融资金额、意向融资期数、货物、申请时间、授信金额、授信期数、贷款金额、贷款期数、状态、需要尽调、操作。金额单位统一为「万元」，固定行高72px（h-[72px]），未发生下游业务时授信与贷款金额期数统一以「—」占位（遵循R05）。",
    documentRefs: {
      prd: { section: "5.1 客户融资需求线索主列表页（P-RZ-001）", match: "数据表格呈现", element: "text" },
      fields: { section: "四、展示规则与关联约束", match: "列表业务字段排布顺序", element: "text" },
      rules: { section: "二、数量、金额与期数口径隔离表", match: "口径名称", element: "row" },
    },
    details: [
      {
        title: "口径与排版",
        items: [
          {
            label: "金额单位",
            content: "意向金额、授信金额、贷款金额统一以万元为单位，保留4位小数，对齐真实业务。",
          },
          {
            label: "需要尽调位置",
            content: "置于状态列之后、操作列之前（倒数第2列），采用彩色Badge标签展示。",
          },
          {
            label: "Sticky操作列",
            content: "操作列声明不透明实色背景与立体投影，横向滚动时防止文字穿透重叠。",
          },
        ],
      },
      {
        title: "列表字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 列名称 | 控件类型 | 必填 | 取值范围与格式 | 展示规则 | 说明 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **产品名称** | 文本 | 必填 | 融资产品名 | 单行 | — |
| **申请人** | 文本 | 必填 | 企业全称或个人姓名 | 单行 | 支持模糊搜索 |
| **意向融资金额** | 数值 | 必填 | 万元，保留 4 位小数 | 右对齐 | — |
| **意向融资期数** | 数值 | 必填 | 期数 | 单行 | — |
| **货物** | 文本 | 条件必填 | 货品大类-品类-规格 | 超长折行 | — |
| **申请时间** | 日期时间 | 系统记录 | YYYY-MM-DD HH:mm:ss | 单行 | — |
| **授信金额 / 期数** | 数值 | 条件展示 | 万元，4 位小数；期数 | 未发生下游显示「—」 | 来自授信环节 |
| **贷款金额 / 期数** | 数值 | 条件展示 | 万元，4 位小数；期数 | 未发生下游显示「—」 | 来自放款环节 |
| **状态** | 状态标签 | 系统维护 | 待受理 / 处理中 / 申请成功 / 申请失败 | 彩色标签 | 见生命周期图 |
| **需要尽调** | 徽标 | 系统维护 | 是 / 否 | 状态列之后 | 建单快照，不随产品改动 |
| **操作** | 行操作按钮 | — | 分配跟进 / 驳回 / 详情 | 待受理才展示前两项 | 右侧冻结 |`,
          },
        ],
      },
    ],
  },
  {
    id: "leads-action-assign",
    targetId: "leads-action-assign",
    number: 4,
    kind: "交互",
    title: "分配跟进与路由快照强制分流 (方案 B / 方案 A 锁定)",
    content:
      "在【待受理】状态下直接露出【分配跟进】。弹窗基于建单固化的【需要尽调】快照强行自动分流锁定：快照为「是」时自动锁定指派尽调专员下拉框；快照为「否」时自动锁定分配合作资方下拉框，禁止人工任意切换。确认派单后单据状态直接流转至「处理中」（遵循R03/R07）。",
    documentRefs: {
      prd: { section: "4. 业务场景与用户故事", match: "场景 3【尽调路由自动分流与下游任务派发】(S03)", element: "row" },
      fields: { section: "一、业务字段", match: "需要尽调", element: "row" },
      rules: { section: "六、核心业务规则清单 (R01 ~ R08)", match: "【尽调路由判定与快照锁定规则】(R03)", element: "text" },
    },
    details: [
      {
        title: "路由与分流机制",
        items: [
          {
            label: "快照强保护 (R03)",
            content: "分流规则完全依赖线索建单时的快照，不受后续产品规则改动干扰，弹窗不提供人工切换单选。",
          },
          {
            label: "下游单据创建 (R07)",
            content: "提交后向尽调或授信模块自动创建对应任务，主单据状态由「待受理」变更为「处理中」。",
          },
        ],
      },
    ],
  },
  {
    id: "leads-action-reject",
    targetId: "leads-action-reject",
    number: 5,
    kind: "交互",
    title: "异常审查驳回与被拒池沉淀 (R04/C03)",
    content:
      "在【待受理】状态下点击【驳回】。弹出驳回模态弹窗，强制选择驳回原因分类并录入不超过200字的详细情况说明（C03阻断）。确认驳回后，单据状态变更为「申请失败」，并通过事务机制可靠同步写入【被拒退回池 -> 线索被拒标签页】，永久不可物理删除。",
    documentRefs: {
      prd: { section: "4. 业务场景与用户故事", match: "场景 4【申请资料不符运营驳回入被拒池】(S04)", element: "row" },
      fields: { section: "三、系统与审计字段", match: "驳回原因说明", element: "row" },
      rules: { section: "六、核心业务规则清单 (R01 ~ R08)", match: "【异常驳回留痕与被拒入池规则】(R04)", element: "text" },
    },
    details: [
      {
        title: "风控与留痕机制",
        items: [
          {
            label: "原因必填阻断 (C03)",
            content: "未录入驳回原因或超过200字时前端红字拦截，禁止空值提交。",
          },
          {
            label: "归集沉淀 (R04)",
            content: "所有驳回单据统一归集至被拒退回池，支持后续重新救活补全或重指派调度。",
          },
        ],
      },
    ],
  },
]
