import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const orderWarningConfigFormAnnotations: PrototypeAnnotation[] = [
  {
    id: "order-warning-config-form-header",
    targetId: "order-warning-config-form-header",
    number: 1,
    kind: "页面",
    title: "订单预警多策略表单（逐条保存）",
    content: "针对目标订单在同一页面配置超时、跌价、盘点、巡检、质押率与贷中风控等多维度监控策略，每条策略独立保存。",
    details: [
      {
        title: "设计规范与原则",
        items: [
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
    title: "订单选择与业务数据联动",
    content: "选择订单编号后，自动带出订单类型、货主主体、电话、押品明细，并动态禁用不适用的策略卡片。",
    details: [
      {
        title: "联动与互斥约束",
        items: [
          {
            label: "一单一配约束 (R04)",
            content: "已配置过有效规则的订单在选择下拉中置灰不可再选，保证 1:1 实体映射。",
          },
          {
            label: "监管订单策略限制",
            content: "当选择【监管】订单时，系统自动置灰禁用【抵/质押率预警】与【贷中风控预警】卡片，防止商业逻辑冲突。",
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
    title: "策略卡片独立配置与逐条保存",
    content: "各子策略卡片拥有独立开关、阈值输入、03/01 预警等级选择与独立通知/升级矩阵，底部「保存该策略」独立提交。",
    details: [
      {
        title: "卡片校验清单",
        items: [
          {
            label: "子项启用必填校验",
            content: "保存某策略且 Switch=ON 时，其对应的预警等级必须选择、预警对象至少指定一人。",
          },
          {
            label: "最少启用策略约束",
            content: "保存某策略 Switch=OFF 时，若其为最后 1 项已启用策略则 R07a 阻断。",
          },
          {
            label: "抵质押率双等级",
            content: "抵/质押率卡片需分别指定补仓线等级与平仓线等级，平仓线严重度 sort_order 必须大于等于补仓线。",
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
    title: "离开拦截与单策略保存",
    content: "页头仅提供取消返回；各策略卡片独立保存，成功后停留当前页；存在未保存卡片修改时离开弹出确认。",
    details: [
      {
        title: "保存与联动",
        items: [
          {
            label: "引擎同步",
            content: "单策略保存后 Version+1，幂等同步该子项风控判定引擎；贷中风控子项按需初始化台账。",
          },
        ],
      },
    ],
  },
]
