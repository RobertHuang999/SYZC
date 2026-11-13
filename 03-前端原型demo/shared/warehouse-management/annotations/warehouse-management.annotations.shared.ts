import type { SharedPrototypeAnnotation } from "../../annotations/prototype-annotation.shared-types"

/** 仓库管理 · 列表页打点正文（PC/H5 共用真源） */
export const warehouseManagementListShared: SharedPrototypeAnnotation[] = [
  {
    id: "wh-list-page",
    documentRefs: {
      prd: { section: "6.1 仓库管理 — 列表页（P-CFG-WH-010）", match: "路径：配置管理 / 仓库管理 / 仓库管理", element: "text" },
      rules: { section: "仓库管理 业务规则规格", match: "列表【编辑】模态", element: "row" },
    },
    targetId: "wh-list-page",
    number: 1,
    kind: "页面",
    title: "仓库管理列表（P-CFG-WH-010）",
    content:
      "维护租户内仓库主档：筛选、分页、新增模态、行内启停删；空间 ID 供下游 WMS 与设备挂载引用。",
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
      {
        title: "仓库主档生命周期与空间引用",
        items: [
          {
            label: "生命周期流转图",
            content: `flowchart TD
    A["新增仓库（基础信息 / 管理方 / 中仓登 + 附件）"] --> B["启用中"]
    B -->|停用| C["已停用"]
    C -->|重新启用| B
    B -->|库房或分区仍有库存| D["拦截：先在库清零"]
    B -->|删除| E{"两阶段校验"}
    E -->|有在库或下游引用| F["拦截并提示占用来源"]
    E -->|校验通过| G["已删除（软删除）"]
    B -->|维护库房 / 分区| H["空间 ID 供入库、仓单、设备挂载引用"]`,
          },
          {
            label: "上下游与权限",
            content:
              "仓库、库房、分区是入库、仓单、设备与库存的公共引用源 (REF-WH)；库房的「出入库审核」标记由基础配置 R02/R03 统管，仓库侧只读透出。仅平台管理员可新增、停用与删除。",
          },
        ],
      },
    ],
  },
]

/** 仓库管理 · 详情页打点正文（PC/H5 共用真源） */
export const warehouseManagementDetailShared: SharedPrototypeAnnotation[] = [
  {
    id: "wh-detail-layout",
    documentRefs: {
      prd: { section: "6.4 库房 / 分区维护（详情内嵌）", match: "分区表单字段：所属库房、分区名称、备注", element: "text" },
      rules: { section: "7.1 空间节点（仓库/库房/分区）停用校验时序" },
    },
    targetId: "wh-detail-layout",
    number: 1,
    kind: "页面",
    title: "仓库详情双栏工作台布局",
    content:
      "左侧主档三卡片（基础信息/管理方/中仓登）+ 右侧空间与设备双工作区（库房分区树/设备设施），信息连续且屏效更高。",
    details: [],
  },
  {
    id: "wh-63-audit-badge",
    documentRefs: {
      rules: { section: "7.3 出入库审核双端同步时序（F13 × R02 × R03）" },
      prd: { section: "3.2 与基础配置 · 出入库审核的边界（6.3）", match: "列表「出入库审核标记：是/否」", element: "row" },
    },
    targetId: "wh-63-audit-badge",
    number: 2,
    kind: "规则",
    title: "出入库审核展示与编辑（F13 × R03）",
    content:
      "树表只读展示「出入库审核标记：是/否」（与线上一致）；在【编辑库房】弹窗维护「出入库是否审核」单选，保存后同步基础配置受控清单。",
    details: [
      {
        title: "调整前 → 调整后",
        items: [
          {
            label: "库房表单",
            content:
              "保留线上一致三字段：库房名称、出入库是否审核（必填单选）、备注；保存触发 R03 同步（WH-V11 调整为表单维护）。",
          },
          {
            label: "树表展示",
            content:
              "第二行灰字「出入库审核标记：是/否」，由 R02+R03 计算；入库侧「需要审核」对应「是」（WH-V12）。",
          },
        ],
      },
    ],
  },
  {
    id: "wh-63-goto-config",
    targetId: "wh-63-goto-config",
    number: 3,
    kind: "交互",
    title: "6.3 变更 · 前往基础配置",
    content:
      "管理员批量入口：跳转基础配置（C02）。监管员主用【编辑库房】弹窗单选；与入库 R06 同源。",
    documentRefs: { prd: { section: "3.2", match: "基础配置" } },
    details: [],
  },
  {
    id: "wh-63-storeroom-form",
    targetId: "wh-63-audit-badge",
    number: 4,
    kind: "规则",
    title: "6.3 变更 · 库房表单字段收敛",
    content:
      "编辑库房弹窗含「出入库是否审核」必填单选；与基础配置双端同步（R03），非独立第二套配置。",
    documentRefs: { fields: { section: "4. 库房字段", match: "新增页" } },
    details: [],
  },
]

/** 仓库管理 · H5 专属页面打点（列表卡片 / 新增编辑 / 详情 Tab） */
export const warehouseManagementH5Shared: SharedPrototypeAnnotation[] = [
  {
    id: "wh-h5-list",
    documentRefs: {
      prd: { section: "6.5 移动端（H5 · 工作台）", match: "工作台 → 配置管理 → 新增仓库", element: "row" },
      rules: { section: "5.2 中仓登准入规则", match: "#### 【中仓登准入资质与材料完整性规则】(F05)", element: "text" },
    },
    targetId: "wh-h5-list",
    number: 1,
    kind: "页面",
    title: "移动端仓库列表",
    content:
      "与 PC 列表筛选对齐：仓库名称 + 中仓登准入仓；卡片流行操作为查看/删除/停启用/去编辑。**不含**列表内「新增仓库」——新增走工作台「配置管理 → 新增仓库」独立入口（对齐权限清单）。",
    details: [
      {
        title: "移动端结构",
        items: [
          {
            label: "入口与操作",
            content:
              "工作台 → 配置管理 → 仓库管理；卡片点击进详情，行操作走底部操作面板；新增在独立菜单。",
          },
          {
            label: "数据范围",
            content: "仅展示当前租户仓库；停用、删除与 PC 同一套 F07~F12 校验。",
          },
        ],
      },
    ],
  },
  {
    id: "wh-h5-form",
    documentRefs: {
      prd: { section: "6.3 新增/编辑仓库全页表单（添加仓库 / 仓库）", match: "触发：列表【添加仓库】或行【编辑】", element: "text" },
      rules: { section: "【管理方主体类型与中仓登互斥规则】(F04)", match: "仓库管理方类型分为 1企业 与 2个人；", element: "text" },
    },
    targetId: "wh-h5-form",
    number: 1,
    kind: "页面",
    title: "移动端新增仓库（独立菜单）",
    content:
      "字段分区与校验与 PC「添加仓库」全页一致（基础信息、管理方、中仓登及 F04/F05 附件）；布局为 H5 卡片 + 底部抽屉选型。",
    details: [
      {
        title: "移动端形态",
        items: [
          {
            label: "分区与控件",
            content:
              "基础信息、管理方、中仓登三段卡片；中仓登准入为开关 + 附件上传；管理方走底部抽屉选择，不跳页。",
          },
        ],
      },
    ],
  },
  {
    id: "wh-h5-form-edit",
    documentRefs: {
      prd: { section: "6.4 库房 / 分区维护（详情内嵌）", match: "分区表单字段：所属库房、分区名称、备注", element: "text" },
      rules: { section: "7.1 空间节点（仓库/库房/分区）停用校验时序" },
    },
    targetId: "wh-h5-form-edit",
    number: 2,
    kind: "页面",
    title: "移动端编辑仓库",
    content:
      "复用新增仓库的字段分区与校验，标题改为「编辑仓库」；库房、分区与设备设施仍回到仓库详情页维护，不在编辑页重复录入。",
    details: [],
  },
  {
    id: "wh-h5-detail-tabs",
    documentRefs: {
      prd: { section: "6.4 库房 / 分区维护（详情内嵌）", match: "分区表单字段：所属库房、分区名称、备注", element: "text" },
      fields: { section: "1. 仓库基础信息字段", match: "仓库唯一标识", element: "row" },
    },
    targetId: "wh-h5-detail-tabs",
    number: 1,
    kind: "页面",
    title: "仓库详情四 Tab",
    content: "基础信息、库房配置、分区配置、设备设施；与 PC 三件套字段口径一致。",
    details: [
      {
        title: "Tab 职责",
        items: [
          {
            label: "各 Tab 内容",
            content:
              "基础信息：仓库名称、管理方、中仓登、状态；库房配置：库房卡片 + 审核标记；分区配置：分区列表；设备设施：已挂设备与状态。",
          },
        ],
      },
    ],
  },
  {
    id: "wh-h5-63-audit",
    documentRefs: {
      rules: { section: "【库房出入库审核控制联动规则】(F13)", match: "导航辅助：具备 C02 时展示【前往配置】批量圈定；监管员主用编辑弹窗（R03）", element: "text" },
      prd: { section: "3.2 与基础配置 · 出入库审核的边界（6.3）", match: "列表「出入库审核标记：是/否」", element: "row" },
    },
    targetId: "wh-h5-63-audit",
    number: 2,
    kind: "规则",
    title: "库房出入库审核（F13 × R03）",
    content:
      "卡片展示「出入库审核标记：是/否」；编辑 Sheet 含「出入库是否审核」单选，与 PC 编辑库房弹窗、基础配置同步。",
    details: [
      {
        title: "移动端差异点",
        items: [
          {
            label: "库房配置 Tab",
            content: "列表行展示 6.3 文案；编辑抽屉仅名称+备注，不含审核单选。",
          },
          {
            label: "编辑 Sheet",
            content: "与 PC「编辑库房」一致：出入库是否审核单选，确认后写 R03 快照。",
          },
        ],
      },
    ],
  },
]
