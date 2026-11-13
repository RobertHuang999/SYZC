import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

export const inventoryCheckFormAnnotations: SharedPrototypeAnnotation[] = [
  {
    id: "check-form-base-card",
    targetId: "check-form-base-card",
    number: 1,
    kind: "字段",
    title: "基础信息与模式人数约束 (R03)",
    content:
      "单号自动生成（PD+年月日+6位流水号）；任务名称默认生成可修改（最大40字）；单人模式仅限指派 1 人，多人模式可多选；时间顺序强校验。",
    documentRefs: {
      prd: {
        section: "6.2 新增盘点页面",
        match: "表单基础信息",
        element: "text",
      },
      rules: {
        section: "四、新增盘点任务业务规则",
        match: "基础信息录入与校验",
        element: "text",
      },
    },
    details: [
      {
        title: "模式规则 (R03/R08)",
        items: [
          {
            label: "单人独立盘点",
            content: "仅能选择 1 名启用状态员工，责任明确。",
          },
          {
            label: "多人协作盘点",
            content: "可多选人员分工推进，多人录入以时间戳最后一次提交为准覆盖。",
          },
        ],
      },
    ],
  },
  {
    id: "check-form-warehouse-card",
    documentRefs: {
      prd: { section: "3. 模块定位与系统链路", match: "具体数据更新行为与业务效力", element: "row" },
      rules: { section: "【单仓锁定与级联数据隔离】(R04)", match: "切换仓库二次确认与数据清空：", element: "text" },
    },
    targetId: "check-form-warehouse-card",
    number: 2,
    kind: "交互",
    title: "单仓锁定与切换二次确认 (R04)",
    content:
      "强制单仓制单。若明细中已有货品，切换仓库系统强制弹出确认弹窗清空明细；添加货品弹窗自动锁定主表仓库数据源。",
    details: [
      {
        title: "清空明细机制",
        items: [
          {
            label: "二次确认文案",
            content: "“更改仓库将清空下方已选货品明细，是否确认修改？”，取消则恢复原仓库选项。",
          },
        ],
      },
    ],
  },
  {
    id: "check-form-goods-card",
    documentRefs: {
      rules: { section: "【选货弹窗双模式差异化】(R05)", match: "库存明细模式（微观条码/库位维度）：", element: "text" },
      prd: { section: "1.1 业务背景" },
    },
    targetId: "check-form-goods-card",
    number: 3,
    kind: "规则",
    title: "双模式选货弹窗与快照并发锁 (R05/R06)",
    content:
      "账面汇总模式按品类规格全仓聚合，库存明细模式穿透至库房/分区/条码；提交时固化在库快照并执行业务锁排他校验。",
    details: [
      {
        title: "提交校验与去盘点引导",
        items: [
          {
            label: "至少 1 条明细",
            content: "明细为空阻断提交；提交成功后弹窗根据当前用户是否在计划名单中智能显隐【去盘点】。",
          },
        ],
      },
    ],
  },
  {
    id: "check-form-page",
    documentRefs: {
      prd: { section: "2. 功能范围", match: "包含功能范围", element: "row" },
      rules: { section: "四、新增盘点任务业务规则", match: "盘点时间范围逻辑校验：", element: "text" },
    },
    targetId: "check-form-base-card",
    number: 0,
    kind: "页面",
    title: "新建盘点任务",
    content: "选择仓库、库房与盘点类型，确定范围后生成盘点单。",
    details: [
      {
        title: "业务流转",
        items: [
          {
            label: "流转图",
            content: `flowchart TD
    A["新建盘点任务"] --> B["选择仓库 / 库房 / 分区"]
    B --> C["选择盘点类型（账面汇总 / 库存明细）"]
    C --> D["确认盘点范围与货物清单"]
    D -->|生成| E["盘点单（未开始）"]
    D -->|取消| F["不生成单据"]`,
          },
        ],
      },
    ],
  },
  {
    id: "check-form-fields",
    documentRefs: {
      fields: { section: "货物盘点字段清单", match: "展示（本次数量）", element: "row" },
      rules: { section: "3.1 状态定义", match: "状态流转触发条件", element: "row" },
    },
    targetId: "check-form-base-card",
    number: 0,
    kind: "字段",
    title: "字段字典",
    content: "展示业务字段、数量口径与状态。",
    details: [
      {
        title: "字段清单对照表",
        items: [
          {
            label: "字段",
            content: `| 字段名称 | 控件 | 必填 | 取值范围与格式 | 展示规则 |
| :--- | :--- | :---: | :--- | :--- |
| **任务名称** | 单行文本 | 必填 | 最多 50 个字符 | 单行 |
| **仓库 / 库房 / 分区** | 级联选择 | 必填 | 授权范围内 | 选中后带出货物 |
| **盘点类型** | 单选 | 必填 | 账面汇总 / 库存明细 | 决定录入粒度 |
| **计划完成时间** | 日期时间 | 选填 | 不早于当前 | 超期进入已超期 |
| **盘点范围** | 只读表格 | 系统带出 | 货品与账面数量清单 | 多行 |`,
          },
        ],
      },
    ],
  },
]
