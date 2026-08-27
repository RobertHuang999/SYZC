import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const midLoanRiskDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "mid-loan-risk-detail-header",
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
    ],
  },
  {
    id: "mid-loan-risk-detail-eligibility",
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
