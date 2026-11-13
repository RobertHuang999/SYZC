import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const midLoanRiskListAnnotations: PrototypeAnnotation[] = [
  {
    id: "mid-loan-risk-page",
    documentRefs: {
      prd: { section: "贷中风控管理主PRD", match: "模型拒绝自动联动押品告警", element: "row" },
      rules: { section: "贷中风控管理 业务规则规格", match: "执行资格判定", element: "row" },
    },
    targetId: "mid-loan-risk-page",
    number: 1,
    kind: "页面",
    title: "贷中风控管理定位与调度闭环",
    content: "管理订单级贷中风控模型执行资格，调度智风控平台异步计算任务，并在模型拒绝时自动联动押品预警。",
    details: [
      {
        title: "贷中模型调度流转图",
        items: [
          {
            label: "模型调度流转图",
            content: `flowchart TD
    A["03/03 订单预警配置<br/>启用贷中风控"] --> B["02/03 贷中风控管理台账"]
    B --> C{"判定准入资格三要素<br/>在押/存续/有效规则"}
    C -->|可执行| D["发起单条/批量执行"]
    C -->|不可执行| E["置灰禁用并悬浮原因提示"]
    D --> F["智风控平台受理<br/>生成唯一 task_id"]
    F --> G{"平台异步计算结果"}
    G -->|结果=通过| H["状态回写: 未触发预警"]
    G -->|结果=拒绝| I["状态回写: 触发预警<br/>联动生成 02/02 押品预警"]
    G -->|需补充材料| J["待补充资料<br/>联登任务中心"]
    J --> F`,
          },
          {
            label: "业务定位",
            content: "对存续抵/质押订单进行全生命周期资信、涉诉与经营风控监控，连接业务中台与智风控算法大脑。",
          },
        ],
      },
      {
        title: "协同关系与边界",
        items: [
          {
            label: "上游依赖",
            content: "订单预警配置中启用【贷中风控预警】并绑定具体风控模型产品（如大宗商品贸易资信模型 V2）。",
          },
          {
            label: "下游联动",
            content: "模型评估结果若为【拒绝 / 触发预警】，系统自动在【押品预警信息】中生成一条高危预警流水驱动处置。",
          },
        ],
      },
    ],
  },
  {
    id: "mid-loan-risk-filter",
    documentRefs: {
      prd: { section: "5.1 执行状态定义", match: "满足执行资格可再次发起执行", element: "row" },
      rules: { section: "3.1 状态定义", match: "重新发起执行申请", element: "row" },
    },
    targetId: "mid-loan-risk-filter",
    number: 2,
    kind: "交互",
    title: "多维组合检索与资格筛选",
    content: "支持订单号、货主名称/统一信用代码、订单类型、执行资格、最近执行状态及创建时间组合过滤。",
    details: [
      {
        title: "筛选维度说明",
        items: [
          {
            label: "执行资格",
            content: "全部、可执行、不可执行；快速筛选出当前可发起模型重算的存续订单。",
          },
          {
            label: "最近执行状态",
            content: "未执行、提交中、提交成功_处理中、待补充资料、未触发预警、触发预警、提交失败。",
          },
          {
            label: "货主匹配",
            content: "支持模糊搜索货主企业名称或精确搜索统一社会信用代码。",
          },
        ],
      },
    ],
  },
  {
    id: "mid-loan-risk-table",
    documentRefs: {
      fields: { section: "二、风控模型执行历史字段（详情页时间轴）", match: "模型决策结果", element: "row" },
    },
    targetId: "mid-loan-risk-table",
    number: 3,
    kind: "字段",
    title: "表格字段与执行资格判定条件",
    content: "展示订单信息、货主名称、押品概况、风控模型、执行资格判定结果与历史统计指标。",
    details: [
      {
        title: "核心字段与判定规则",
        items: [
          {
            label: "执行资格三要素",
            content: `系统实时计算判定为【可执行】必须同时满足：
1. 订单处于【抵/质押中】有效存续期；
2. 订单预警配置中贷中风控项处于【启用】状态；
3. 当前无【提交中 / 提交成功_处理中】的在途计算任务。`,
          },
          {
            label: "不可执行原因提示",
            content: "不可执行项鼠标悬浮 Info 图标可查看具体原因（如【订单已结清】或【已有在途处理中任务】）。",
          },
          {
            label: "执行/预警次数",
            content: "展示该订单累计发起模型计算的次数，以及累计触发拒绝预警的次数。",
          },
        ],
      },
      {
        title: "列表字段字典",
        items: [
          {
            label: "字段清单对照表",
            content: `| 字段名称 | 控件类型 | 必填 | 取值范围与格式 | 展示规则 | 说明 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **订单编号** | 链接 | 必填 | 抵 / 质押订单号 | 可穿透详情 | — |
| **货主名称** | 文本 | 必填 | 企业全称 | 单行 | 支持信用代码精确搜索 |
| **订单类型** | 标签 | 必填 | 抵押 / 质押 / 监管服务 | 单行 | — |
| **押品概况** | 文本 | 必填 | 品类-规格 + 数量 | 单行 | — |
| **风控模型** | 文本 | 必填 | 绑定的模型产品与版本 | 单行 | 来自订单预警配置 |
| **执行资格** | 徽标 | 系统计算 | 可执行 / 不可执行 | 单行 | 悬浮查看原因 |
| **最近执行状态** | 状态标签 | 系统维护 | 未执行 / 提交中 / 处理中 / 待补充 / 未触发 / 触发预警 / 失败 | 彩色标签 | — |
| **执行 / 预警次数** | 只读文本 | 系统统计 | 次数 | 单行 | 累计统计 |
| **操作** | 行操作按钮 | — | 执行 / 详情 | 可执行时【执行】高亮 | 防连击 |`,
          },
        ],
      },
    ],
  },
  {
    id: "mid-loan-risk-row-actions",
    documentRefs: {
      prd: { section: "5.1 执行状态定义", match: "点击确认执行提交", element: "row" },
      rules: { section: "【单条执行可执行资格排他校验规则】(MID-E01)" },
    },
    targetId: "mid-loan-risk-table",
    number: 4,
    kind: "交互",
    title: "单条执行与详情跳转控制",
    content: "根据资格判定动态控制【执行】按钮可用性，支持单条触发智风控平台计算并防重复点击。",
    details: [
      {
        title: "操作逻辑与幂等约束",
        items: [
          {
            label: "单条执行",
            content: "仅【可执行】状态下激活；点击后立即锁定按钮防止连击，生成一条新执行流水并异步上报智风控平台。",
          },
          {
            label: "详情跳转",
            content: "点击订单号或操作列【详情】进入详情页，查看完整的历史执行记录与模型分数变化曲线。",
          },
        ],
      },
    ],
  },
  {
    id: "mid-loan-risk-pagination",
    documentRefs: {
      rules: { section: "【批量执行容量与资格过滤校验规则】(MID-E02)" },
    },
    targetId: "mid-loan-risk-pagination",
    number: 5,
    kind: "交互",
    title: "分页与页容量设置",
    content: "标准分页组件，支持 10/20/50 条每页切换与页码快速跳转。",
    details: [
      {
        title: "分页规范",
        items: [
          {
            label: "页码联动",
            content: "筛选变更或切换页容量后重置到第 1 页，保持列表数据呈现一致。",
          },
        ],
      },
    ],
  },
]
