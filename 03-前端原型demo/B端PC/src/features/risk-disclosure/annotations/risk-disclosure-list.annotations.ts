import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const riskDisclosureListAnnotations: PrototypeAnnotation[] = [
  {
    id: "risk-disclosure-page",
    targetId: "risk-disclosure-page",
    number: 1,
    kind: "页面",
    title: "风险公示定位与合规披露流转",
    content: "管理对外已披露和待公示的押品风控处置记录，提供多维度公开信息查询与公示撤回管理。",
    details: [
      {
        title: "风险公示生命周期流转图",
        items: [
          {
            label: "公示流转图",
            content: `flowchart LR
    A["押品预警 (已处理有效)"] -->|"合规审批发起公示"| B["风险公示: 已公示"]
    B -->|"记录发布审计"| D["全链路审计日志"]
    B -->|"合规申诉/风险消除"| C["风险公示: 已取消"]
    C -->|"记录取消理由审计"| D`,
          },
          {
            label: "合规意义",
            content: "对资信严重恶化、多次跌价触及平仓线等重大违约事件对外履行合规公示义务，保障资方与监管穿透。",
          },
        ],
      },
      {
        title: "上下游协同",
        items: [
          {
            label: "上游数据",
            content: "来源于【押品预警信息】中已处置完成的有效告警，继承原预警事实、抓拍图与处置材料快照。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-filter",
    targetId: "risk-disclosure-filter",
    number: 2,
    kind: "交互",
    title: "公示信息检索与多维筛选",
    content: "支持公示标题、订单编号、借款货主主体、规则名称、公示状态与公示时间范围组合检索。",
    details: [
      {
        title: "筛选维度说明",
        items: [
          {
            label: "公示状态",
            content: "全部、已公示、已取消；默认展示已公示记录。",
          },
          {
            label: "订单/货主模糊匹配",
            content: "支持按订单号前缀或企业名称关键字快速检索目标风险事件。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-table",
    targetId: "risk-disclosure-table",
    number: 3,
    kind: "字段",
    title: "表格字段与公示状态定义",
    content: "展示公示标题、关联订单、借款主体、规则名称、公示状态 Tag、公示时间与最近操作人。",
    details: [
      {
        title: "列定义与展示规范",
        items: [
          {
            label: "公示标题 / 内容",
            content: "由系统模板自动拼接（如【关于 PO202608-01 订单押品跌价违约的风险公示】），支持点击进入详情。",
          },
          {
            label: "公示状态 Tag",
            content: "【已公示】（橙黄色）/ 【已取消】（灰色）；取消后列表仍保留归档记录供合规审计调阅。",
          },
          {
            label: "操作人与时间",
            content: "记录公示发起人或撤销人姓名及秒级时间戳。",
          },
        ],
      },
    ],
  },
  {
    id: "risk-disclosure-pagination",
    targetId: "risk-disclosure-pagination",
    number: 4,
    kind: "交互",
    title: "分页与页容量控制",
    content: "标准分页组件，支持 10/20/50 条每页切换，修改筛选或分页后平滑刷新。",
    details: [
      {
        title: "规范",
        items: [
          {
            label: "重置行为",
            content: "执行查询、重置或切换每页条数时均回到第 1 页展示。",
          },
        ],
      },
    ],
  },
]
