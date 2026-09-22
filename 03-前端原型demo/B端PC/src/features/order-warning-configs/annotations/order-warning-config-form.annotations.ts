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
    content: "各子策略卡片拥有独立开关、阈值输入、03/01 预警等级选择与独立通知/升级矩阵；底部操作区含「取消修改」「关闭并停用」「保存该策略」。",
    details: [
      {
        title: "卡片校验与业务规格清单",
        items: [
          {
            label: "子项启用必填校验",
            content: "保存某策略且 Switch=ON 时，其对应的预警等级必须选择；预警通知对象为选填，勾选短信/邮件后可选配接收人。",
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
            content: "各策略子项独立配置，选填复选框组：短信、邮件；预警命中时移动端「押品预警信息」入口自动展示待处置红点，无需配置；仅勾选短信/邮件后才展示「预警通知对象（选填）」与「启用升级预警」。",
          },
          {
            label: "预警通知对象选填 (ORD-R19)",
            content: "勾选短信/邮件后展示 OrgUserSelect，标签无必填星号；保存时不校验对象是否为空；未配置对象则对应外部渠道不下发。",
          },
          {
            label: "升级文案与渠道联动 (ORD-R21)",
            content: "buildUpgradeWarningLabel(notify_channels) 动态生成 Checkbox 文案，如「启用升级预警（长时间未处置时，将通过短信、邮件逐级上报）」；勾选/取消渠道时文案即时刷新；升级下发渠道与 notify_channels 一致。",
          },
          {
            label: "仓储巡检超期 · 动态表格 (R17)",
            content: "策略 3 卡片内嵌 InspectionConfigTable：按组织架构级联选择巡检人（每行单选 1 人，可添加多行），每人独立配置巡检周期（天）；至少 1 组有效配置且巡检人不可重复；巡检执行人与预警通知对象职责分离；与盘点作业完全解耦。",
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
    content: "页头「取消」返回列表；各策略卡片独立保存，脏态时展示「取消修改」，已保存启用态展示「关闭并停用」（destructive，位于保存左侧）；存在未保存卡片修改时离开弹出确认。",
    details: [
      {
        title: "保存与联动",
        items: [
          {
            label: "引擎同步",
            content: "单策略保存后 Version+1，幂等同步该子项风控判定引擎；贷中风控子项按需初始化台账。",
          },
          {
            label: "阈值修改即时重算与流水置换 (C07)",
            content: "修改策略阈值（跌价比例、超时天数、巡检周期、抵质押率阈值）保存成功后，系统立即触发实时指标重算：若仍命中新阈值且存在未解除预警，旧流水置为「已作废」（原因：预警配置阈值调整重算置换）并生成新流水推送；若不命中则保留旧流水并进入新一轮判断。",
          },
          {
            label: "升级策略动态调度与补发 (R20a/R24a)",
            content: "开启升级或修改升级天数保存后，系统即时根据原预警首次触发时间重算升级状态，超期立即补发升级预警通知；关闭升级时自动清除排队中的升级任务。",
          },
          {
            label: "卡片级取消修改",
            content: "单策略卡片字段或开关变更后标记「● 未保存」；底部操作区：[取消修改] [关闭并停用] [保存该策略]。点击「取消修改」将该卡片恢复至 baseline 快照，不弹窗、不离开页面。",
          },
          {
            label: "关闭并停用该策略 (ORD-R07a / ORD-C01a)",
            content: "仅对已保存为启用态（savedStrategies=ON）的策略卡片，在底部操作区「保存该策略」左侧展示 destructive 按钮「关闭并停用」。点击后若其为最后 1 项已启用策略则 ORD-R07a 阻断；否则弹出二次确认（说明停止判定、流水作废、升级终止，不向用户展示规则编号），确认后自动以 Switch=OFF 提交保存，后端级联 ORD-C01a，卡片折叠为 OFF。",
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
