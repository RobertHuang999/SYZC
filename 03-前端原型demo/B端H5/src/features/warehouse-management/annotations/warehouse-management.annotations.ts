import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"

export const warehouseH5ListAnnotations: PrototypeAnnotation[] = [
  {
    id: "wh-h5-list",
    targetId: "wh-h5-list",
    number: 1,
    kind: "页面",
    title: "移动端仓库列表",
    content:
      "与 PC 列表筛选对齐：仓库名称 + 中仓登准入仓；卡片流行操作为查看/删除/停启用/去编辑。**不含**列表内「新增仓库」——新增走工作台「配置管理 → 新增仓库」独立入口（对齐权限清单）。",
    details: [],
  },
]

export const warehouseH5FormAnnotations: PrototypeAnnotation[] = [
  {
    id: "wh-h5-form",
    targetId: "wh-h5-form",
    number: 1,
    kind: "页面",
    title: "移动端新增仓库（独立菜单）",
    content:
      "字段分区与校验与 PC「添加仓库」全页一致（基础信息、管理方、中仓登及 F04/F05 附件）；布局为 H5 卡片 + 底部抽屉选型。",
    details: [],
  },
]

export const warehouseH5DetailAnnotations: PrototypeAnnotation[] = [
  {
    id: "wh-h5-detail-tabs",
    targetId: "wh-h5-detail-tabs",
    number: 1,
    kind: "页面",
    title: "仓库详情四 Tab",
    content: "基础信息、库房配置、分区配置、设备设施；与 PC 三件套字段口径一致。",
    details: [],
  },
  {
    id: "wh-h5-63-audit",
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
