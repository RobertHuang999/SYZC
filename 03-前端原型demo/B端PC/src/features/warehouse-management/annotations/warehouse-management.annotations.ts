import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const warehouseListAnnotations: PrototypeAnnotation[] = [
  {
    id: "wh-list-page",
    targetId: "wh-list-page",
    number: 1,
    kind: "页面",
    title: "仓库管理列表（P-CFG-WH-010）",
    content:
      "维护租户内仓库主档：筛选、分页、新增模态、行内启停删；空间 ID 供下游 WMS 与设备挂载引用。",
    documentRefs: {
      prd: { section: "6.1 仓库管理 — 列表页", match: "筛选区" },
      fields: { section: "一、业务字段", match: "仓库名称" },
    },
    details: [
      {
        title: "列表列与操作",
        items: [
          {
            label: "固定列序",
            content:
              "序号、仓库名称（链进详情）、管理方名称、中仓登准入、创建人、创建/更新时间、状态、操作。",
          },
          {
            label: "停用与删除",
            content:
              "停用在库强阻断（F07~F09）；删除两阶段校验（F10~F12），失败以 Toast 提示标准文案。",
          },
        ],
      },
    ],
  },
]

export const warehouseDetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "wh-detail-layout",
    targetId: "wh-detail-layout",
    number: 1,
    kind: "页面",
    title: "仓库详情双栏工作台布局",
    content:
      "左侧主档三卡片（基础信息/管理方/中仓登）+ 右侧空间与设备双工作区（库房分区树/设备设施），信息连续且屏效更高。",
    documentRefs: {
      prd: { section: "6.2 仓库详情页", match: "详情" },
    },
    details: [],
  },
  {
    id: "wh-63-audit-badge",
    targetId: "wh-storeroom-audit-column",
    number: 2,
    kind: "规则",
    title: "6.3 变更 · 出入库审核只读 Badge（F13）",
    content:
      "以前：库房编辑里可勾选「要不要审核」。现在：只在树表看「受控 / 免审」，由基础配置 R02 统一计算，本页不可改。",
    documentRefs: {
      fields: { section: "4. 库房字段", match: "出入库审核" },
      rules: { section: "5.4", match: "F13" },
      prd: { section: "场景 10", match: "WH-S10" },
    },
    details: [
      {
        title: "调整前 → 调整后",
        items: [
          {
            label: "库房表单",
            content: "移除「出入库是否审核」单选，仅保留库房名称与备注（WH-V11）。",
          },
          {
            label: "树表展示",
            content:
              "只读展示出入库审核「是 / 否」（由 R02 计算，对应入库侧需要审核 / 不需要审核）；改名单请去【基础配置 → 仓储作业参数】保存（WH-V12）。",
          },
        ],
      },
    ],
  },
  {
    id: "wh-63-goto-config",
    targetId: "wh-goto-basic-config",
    number: 3,
    kind: "交互",
    title: "6.3 变更 · 前往基础配置",
    content: "受控库房范围不在仓库管理维护，说明区提供跳转入口，与入库 R06 同源。",
    documentRefs: {
      prd: { section: "3.2", match: "基础配置" },
    },
    details: [],
  },
  {
    id: "wh-63-storeroom-form",
    targetId: "wh-storeroom-form-dialog",
    number: 4,
    kind: "规则",
    title: "6.3 变更 · 库房表单字段收敛",
    content: "添加/编辑库房弹窗不再出现审核开关，避免与 R02 双轨配置。",
    documentRefs: {
      fields: { section: "4. 库房字段", match: "新增页" },
    },
    details: [],
  },
]
