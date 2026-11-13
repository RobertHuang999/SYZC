import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const midLoanRiskDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "mid-loan-risk-detail-header",
    documentRefs: {
      prd: { section: "贷中风控管理主PRD", match: "页面路由：/m/risk/mid-loan", element: "text" },
      rules: { section: "贷中风控管理 业务规则规格", match: "执行资格判定", element: "row" },
    },
    targetId: "mid-loan-risk-detail-header",
    number: 1,
    kind: "页面",
    title: "贷中风控详情与模型调用链路",
    content: "展示存续订单的风控模型配置、执行资格明细、最近计算结果与全量历史执行轨迹。",
    details: [
      {
        title: "计算流转与协同闭环",
        items: [
          {
            label: "计算链路流程图",
            content: `flowchart LR
    A["操作员/系统调度"] -->|"发起执行"| B["生成执行流水ID"]
    B -->|"任务受理"| C["智风控 OpenAPI"]
    C -->|"异步计算完成"| D["评分与通过/拒绝"]
    D -->|"回调写回结果"| E["发布 RiskEvent"]
    E -->|"若判定为拒绝"| F["02/02 押品预警信息"]`,
          },
          {
            label: "数据快照",
            content: "每一次执行均生成独立的 execution_id，固化当次提交人、时间、智风控任务号、模型评分与结果描述。",
          },
        ],
      },
    ],
  },
  {
    id: "mid-loan-risk-detail-order",
    documentRefs: {
      fields: { section: "二、风控模型执行历史字段（详情页时间轴）", match: "模型综合评分", element: "row" },
      rules: { section: "三、单据状态机与生命周期流转", match: "① 写入 midloanriskledger；② 初始执行次数=0，预警次数=0", element: "row" },
    },
    targetId: "mid-loan-risk-detail-order",
    number: 2,
    kind: "字段",
    title: "关联订单与风控模型信息",
    content: "展示订单业务编号、借款货主主体、押品品类、订单生命周期与当前绑定运行的风控模型。",
    details: [
      {
        title: "核心字段",
        items: [
          {
            label: "订单号 / 货主主体",
            content: "展示订单编号与货主企业全称及信用代码，支持跳转抵质押订单主数据。",
          },
          {
            label: "风控模型产品",
            content: "当前绑定的智风控模型版本（如【大宗存货质押贷中综合风险评级模型 V3.0】）。",
          },
        ],
      },
      {
        title: "字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 | 控件类型 | 必填 | 取值范围与格式 | 展示规则 | 说明 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **订单编号** | 链接 | 必填 | 抵 / 质押订单号 | 可跳转订单主数据 | — |
| **货主主体** | 文本 | 必填 | 企业全称 + 信用代码 | 双行 | — |
| **押品品类** | 文本 | 必填 | 品类-规格 | 单行 | — |
| **订单生命周期** | 状态标签 | 系统维护 | 抵/质押中 / 已结清 等 | 彩色标签 | 决定是否可执行 |
| **风控模型产品** | 文本 | 必填 | 模型名称 + 版本 | 单行 | 来自订单预警配置 |
| **执行资格** | 徽标 | 系统计算 | 可执行 / 不可执行 | 单行 | 悬浮看原因 |
| **累计执行 / 预警次数** | 只读文本 | 系统统计 | 次数 | 单行 | — |`,
          },
        ],
      },
    ],
  },
  {
    id: "mid-loan-risk-detail-eligibility",
    documentRefs: {
      rules: { section: "【执行次数与预警次数累加统计规则】(MID-E07)" },
      fields: { section: "二、风控模型执行历史字段（详情页时间轴）", match: "执行状态快照", element: "row" },
    },
    targetId: "mid-loan-risk-detail-eligibility",
    number: 3,
    kind: "规则",
    title: "执行资格动态判定与统计指标",
    content: "系统实时计算是否允许发起新一轮模型计算，并展示历史累计执行与预警次数。",
    details: [
      {
        title: "资格判定逻辑",
        items: [
          {
            label: "判定公式与条件",
            content: "只有同时满足【订单存续有效】+【配置启用】+【无在途计算】三项要求，executability 字段才为【可执行】。",
          },
          {
            label: "累计预警触发比率",
            content: "预警次数 ÷ 执行次数 反映该借款主体在授信期内的资信波动烈度。",
          },
        ],
      },
    ],
  },
  {
    id: "mid-loan-risk-detail-latest",
    documentRefs: {
      fields: { section: "二、风控模型执行历史字段（详情页时间轴）", match: "申请提交时间", element: "row" },
      rules: { section: "3.1 状态定义", match: "用户点击确认提交执行", element: "row" },
    },
    targetId: "mid-loan-risk-detail-latest",
    number: 4,
    kind: "字段",
    title: "最近一次执行状态与责任人",
    content: "展示最近一次模型调用的执行状态 Tag、提交人账号姓名与提交时间点。",
    details: [
      {
        title: "状态说明",
        items: [
          {
            label: "状态流转",
            content: "展示未执行、处理中、待补充资料、未触发预警、触发预警或提交失败。",
          },
          {
            label: "责任人留痕",
            content: "记录真实提交人账号与时间戳，若由定时任务触发则显示【系统自动调度】。",
          },
        ],
      },
    ],
  },
  {
    id: "mid-loan-risk-detail-history",
    documentRefs: {
      rules: { section: "【智风控任务受理与异步跟踪规则】(MID-TC01)" },
      prd: { section: "5.1 执行状态定义", match: "智风控返回任务受理编号", element: "row" },
    },
    targetId: "mid-loan-risk-detail-history",
    number: 5,
    kind: "规则",
    title: "全量执行历史与智风控任务跟踪",
    content: "表格形式按时间倒序展示历次执行的提交时间、提交人、执行状态、模型分数、结果描述与智风控任务号。",
    details: [
      {
        title: "历史字段与对接规范",
        items: [
          {
            label: "模型分数 (Score)",
            content: "智风控平台返回的 0~100 综合信用分；低于预警阈值时判定为【触发预警】。",
          },
          {
            label: "智风控任务号 (zfk_task_no)",
            content: "OpenAPI 异步任务唯一定位凭证，用于排查日志与联登协同。",
          },
          {
            label: "待补充资料处理",
            content: "若状态为【待补充资料】，页头提供【联登任务中心】入口，支持带签名跳转至任务中心上传财报/征信等补充证明。",
          },
        ],
      },
    ],
  },
  {
    id: "mid-loan-risk-detail-actions",
    documentRefs: {
      prd: { section: "5.1 执行状态定义", match: "经任务中心联登补齐材料继续计算", element: "row" },
      rules: { section: "【任务中心联登安全签名与时效规则】(MID-P04)" },
    },
    targetId: "mid-loan-risk-detail-header",
    number: 6,
    kind: "交互",
    title: "页头操作与权限控制",
    content: "包含【返回】、【执行】与【联登任务中心】操作按钮。",
    details: [
      {
        title: "操作与权限",
        items: [
          {
            label: "执行权限",
            content: "需具备 R-RISK-OPR（风控操作员）或更高级权限；不可执行状态下按钮置灰并提示原因。",
          },
          {
            label: "联登任务中心",
            content: "仅在存在【待补充资料】状态时高亮展示，点击通过单点登录带参跳转。",
          },
        ],
      },
    ],
  },
]
