import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

/**
 * 货物盘点 · H5 标注（业务正文与 PC「16-货物盘点」三件套同源，H5 只描述端上承载差异）。
 */
export const checkH5Annotations: PrototypeAnnotation[] = [
  {
    id: "check-h5-list",
    targetId: "check-h5-list",
    number: 1,
    kind: "页面",
    title: "工作台 · 货物盘点台账",
    content:
      "盘点单流水查询页。首屏放盘点单号搜索、盘点类型/状态/结果/仓库四个常用胶囊；任务名称、盘点时间、实际盘点人员、制单人、制单时间收进「更多筛选」抽屉，共 10 项筛选维度与 PC 一致。列表卡片按 PC 台账展示任务名称、盘点时间、实际盘点人员、盘点结果和异常处理。列表只做查询、盘点与撤销，不在列表页放新增入口。",
    documentRefs: {
      prd: { section: "6.1 盘点任务列表页", match: "盘点任务列表", element: "text" },
      fields: { section: "一、单据级主表字段", match: "盘点单号", element: "row" },
      rules: {
        section: "二、数据权限控制规则",
        match: "盘点任务权限判定并集模型",
        element: "text",
      },
    },
    details: [
      {
        title: "盘点与撤销操作矩阵",
        items: [
          {
            label: "盘点",
            content:
              "「未开始」「盘点中」「已超期」三种状态都提供【盘点】入口，允许超期补盘。",
          },
          {
            label: "撤销",
            content:
              "仅「未开始」且当前登录人是制单人本人时提供【撤销】，撤销前二次确认。",
          },
        ],
      },
    ],
  },
  {
    id: "check-h5-detail",
    targetId: "check-h5-detail",
    number: 2,
    kind: "页面",
    title: "盘点单详情 · 总览",
    content:
      "摘要卡完整展示盘点单号、类型、状态、任务名称、盘点模式、起止时间、计划与实际盘点人员、仓库、结果和异常处理；单号完整可见并可复制。",
    documentRefs: {
      prd: { section: "6.4 详情页", match: "头部单据信息", element: "text" },
      fields: { section: "一、单据级主表字段", match: "盘点任务名称", element: "row" },
      rules: {
        section: "六、异常判别算法与解除闭环",
        match: "综合异常状态流转计算",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "check-h5-summary-table",
    targetId: "check-h5-summary-table",
    number: 3,
    kind: "字段",
    title: "账面汇总盘点 · 合计与明细",
    content:
      "按货品维度汇总，不细分货主和条码。顶部合计条展示货品类型、库存总数量、已盘点数量和异常细分；每条货品展示本次数量、盘点数量、是否存在、是否完好、位置一致、盘点人员和异常状态。",
    documentRefs: {
      prd: { section: "6.4 详情页", match: "账面汇总明细", element: "text" },
      fields: {
        section: "二、账面汇总货品明细字段",
        match: "本次数量",
        element: "row",
      },
      rules: {
        section: "【四大异常判别算法】(R09)",
        match: "R09",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "check-h5-progress",
    targetId: "check-h5-progress",
    number: 4,
    kind: "规则",
    title: "库存明细盘点 · 四张完成率看板",
    content:
      "展示货物条码已盘点率、分区完成率、库房完成率和异常货物数；异常货物数再拆成货物不存在、货物损坏、位置不符、数量不符四项，方便现场快速定位。",
    documentRefs: {
      prd: { section: "6.4 详情页", match: "盘点进度", element: "text" },
      fields: { section: "四、统计看板与进度汇总字段", match: "盘点数量", element: "row" },
      rules: {
        section: "【完成率与异常统计】(R12)",
        match: "R12",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "check-h5-detail-items",
    targetId: "check-h5-detail-items",
    number: 5,
    kind: "字段",
    title: "库存明细盘点 · 逐件明细与二次筛选",
    content:
      "逐件穿透到每一笔存货条码、货主、库房和分区。明细页支持按盘点时间和库房二次筛选；每张卡片展示货物编号、条码、货主、位置、本次数量、盘点数量、三项现场核验结果、实际盘点人员、盘点时间和异常状态。",
    documentRefs: {
      prd: { section: "6.4 详情页", match: "库存明细", element: "text" },
      fields: {
        section: "三、库存明细盘点记录字段",
        match: "存货条码",
        element: "row",
      },
      rules: {
        section: "【四大异常判别算法】(R09)",
        match: "R09",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "check-h5-resolve",
    targetId: "check-h5-resolve",
    number: 6,
    kind: "交互",
    title: "解除盘点异常（强制说明）",
    content:
      "异常行点击【解除异常】后从底部弹出处理说明，必须填写 1~200 字，写清异常原因、处理方式和复验结果；提交后写入盘点历史并记录解除人和时间，不能修改。",
    documentRefs: {
      prd: { section: "6.4 详情页", match: "解除异常", element: "text" },
      fields: { section: "五、盘点历史与异常处理审计字段", match: "处理说明", element: "row" },
      rules: {
        section: "【解除异常强制留痕】(R11)",
        match: "R11",
        element: "text",
      },
    },
    details: [],
  },
  {
    id: "check-h5-history",
    targetId: "check-h5-history",
    number: 7,
    kind: "交互",
    title: "盘点历史与解除留痕",
    content:
      "点击【查看历史】查看该货品每一次盘点记录：盘点人员、账面与实盘数量、存在/完好/位置三项判断、现场说明，以及异常解除记录和解除说明。",
    documentRefs: {
      prd: { section: "6.4 详情页", match: "盘点历史", element: "text" },
      fields: { section: "五、盘点历史与异常处理审计字段", match: "解除时间", element: "row" },
      rules: {
        section: "【解除异常强制留痕】(R11)",
        match: "R11",
        element: "text",
      },
    },
    details: [],
  },
]
