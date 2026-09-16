import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const orderWarningConfigFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "order-warning-config-form-header",
    targetId: "order-warning-config-form-header",
    number: 1,
    kind: "页面",
    title: "订单预警多策略表单 · 逐条保存与风控引擎同步",
    content: "针对目标订单在同一页面配置超时、跌价、盘点、巡检、质押率与贷中风控等多维度监控策略，每条策略独立保存与热同步。",
    details: [
      {
        title: "逐条保存与风控引擎同步流转",
        items: [
          {
            label: "逐条保存流转图",
            content: `flowchart TD
    A["选择有效抵押/质押/监管服务订单"] --> B["带出订单类型、物料与货主信息"]
    B --> C["展示 6 大策略配置卡片"]
    C --> D["按需开启 Switch 并配置阈值/等级/通知人"]
    D --> E["点击单卡片「保存该策略」"]
    E --> F{"卡片独立字段与业务校验"}
    F -->|校验未通过| G["卡片内部红框提示错误"]
    F -->|通过| H["单策略 API 提交 (Version+1)"]
    H --> I["热更新风控引擎该策略子项判定任务"]`,
          },
          {
            label: "逐条保存理念",
            content: "后端按 strategy_type 独立写入，前端每条策略卡片提供「保存该策略」按钮，与 API 粒度对齐；不提供整页统一保存。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-form-order",
    targetId: "order-warning-config-form-order",
    number: 2,
    kind: "字段",
    title: "订单选择与业务数据联动清单",
    content: "选择订单编号后，自动带出订单类型、货主主体、电话和全部订单货物明细，并动态禁用不适用的策略卡片；货物行不是手工录入明细。",
    details: [
      {
        title: "联动与互斥约束",
        items: [
          {
            label: "一单一配约束 (R04)",
            content: "已配置过有效规则的订单在选择下拉中置灰不可再选，保证 1:1 实体映射。",
          },
          {
            label: "订单类型口径",
            content: "新增候选返回有效抵押、质押、监管服务订单；旧历史“监管”不进入候选、不展示，也不映射为“监管服务”。",
          },
          {
            label: "带出字段清单",
            content: "关联订单号 (order_no)、订单类型 (order_type)、货主企业名称 (owner_name)、联系电话 (phone)、质押物料清单 (materials)；订单货物行由订单主数据自动生成，不提供手工新增或删除入口。",
          },
          {
            label: "超时货物行",
            content: "超时策略按订单返回的货物二维码/批次逐行生成配置行；二维码/批次、货物和成功时间只读带出，仅允许填写超时天数，不能单独添加批次或删除某个货物。无对应二维码/批次或成功时间时不渲染该字段。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-form-cards",
    targetId: "order-warning-config-form-cards",
    number: 3,
    kind: "规则",
    title: "六大风控策略卡片字段清单与独立校验",
    content: "各子策略卡片拥有独立开关、阈值输入、03/01 预警等级选择与独立通知/升级矩阵，底部「保存该策略」独立提交。",
    details: [
      {
        title: "卡片校验与业务规格清单",
        items: [
          {
            label: "子项启用必填校验",
            content: "保存某策略且 Switch=ON 时，其对应的预警等级必须选择、预警对象至少指定一人。",
          },
          {
            label: "最少启用策略约束 (R07a)",
            content: "保存某策略 Switch=OFF 时，若其为最后 1 项已启用策略则阻断并提示【至少保留 1 项有效风控策略】。",
          },
          {
            label: "抵质押率双阈值 · 表格布局 · 单等级 (R09/R10/R12a/R13d/R13e)",
            content: "只读展示当前订单抵/质押率 (LTV)；无法计算时在 `—` 下方紧邻 LTV_UNAVAILABLE_HINT（DZY-R08a）。触发条件：「若超过 X% 时触发预警（不含等于）」；底部 LTV_FOOTER_HINT；整卡单等级。",
          },
          {
            label: "通知渠道（notify_channels）",
            content: "各策略子项独立配置，选填复选框组：短信、邮件；预警命中时 H5「押品预警信息」入口自动展示待处置红点，无需配置；短信/邮件需同时配置通知对象并勾选渠道后才会下发；与 03/02 设备预警配置口径一致。",
          },
        ],
      },
    ],
  },
  {
    id: "order-warning-config-form-actions",
    targetId: "order-warning-config-form-actions",
    number: 4,
    kind: "交互",
    title: "离开拦截与单策略保存反馈",
    content: "页头仅提供取消返回；各策略卡片独立保存，成功后停留当前页；存在未保存卡片修改时离开弹出确认。",
    details: [
      {
        title: "保存与联动",
        items: [
          {
            label: "引擎同步",
            content: "单策略保存后 Version+1，幂等同步该子项风控判定引擎；贷中风控子项按需初始化台账。",
          },
          {
            label: "脏数据离开拦截",
            content: "任意卡片表单处于编辑未保存状态时离开页面，弹出确认对话框。",
          },
        ],
      },
    ],
  },
]
