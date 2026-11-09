import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const inventoryCheckFormAnnotations: PrototypeAnnotation[] = [
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
]

