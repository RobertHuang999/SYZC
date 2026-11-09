/**
 * 上线用户文案 · 选择导出内容弹窗
 * 布局真源：02-PRD…/15-仓储-库存查询-跨菜单批量导出规格.md 第 3.1 节
 * 三入口（存货管理 / 库存明细 / 库存流水）共用 InventoryCrossExportDialog
 */
export const INVENTORY_CROSS_EXPORT_USER_DIALOG_TITLE = "选择导出内容"
export const INVENTORY_CROSS_EXPORT_USER_DIALOG_INTRO = "请选择要导出的内容"
export const INVENTORY_CROSS_EXPORT_USER_SECTION_CURRENT_PREFIX = "本菜单"
export const INVENTORY_CROSS_EXPORT_USER_SECTION_OTHER = "其他菜单"
export const INVENTORY_CROSS_EXPORT_USER_HINT_SCOPE =
  "导出为您有权限的全部数据，不受本页筛选影响。"
export const INVENTORY_CROSS_EXPORT_USER_HINT_ASYNC =
  "报表生成需一定时间，请在「导出记录」中下载。"
export const INVENTORY_CROSS_EXPORT_USER_SUBMIT = "开始导出"
export const INVENTORY_CROSS_EXPORT_USER_CANCEL = "取消"
export const INVENTORY_CROSS_EXPORT_USER_TOAST =
  "已提交导出任务，请在「导出记录」中查看并下载。"
export const INVENTORY_CROSS_EXPORT_USER_VALIDATION_EMPTY = "请至少选择一种导出内容"

export const INVENTORY_CROSS_EXPORT_OPTION_LABELS = {
  STAT_REPO: "仓库视图",
  STAT_GOODS: "货物视图",
  STAT_OWNER: "货主视图",
  /** 与「其他菜单」区一致，三入口弹窗同一行展示 */
  DETAIL: "库存明细（仅仍有库存余量的明细）",
  FLOW: "库存流水（列表）",
} as const

/** 其他菜单区内仍带菜单前缀，避免与本菜单短名混淆 */
export const INVENTORY_CROSS_EXPORT_OPTION_LABELS_OTHER_MENU = {
  STAT_REPO: "存货管理 · 仓库视图",
  STAT_GOODS: "存货管理 · 货物视图",
  STAT_OWNER: "存货管理 · 货主视图",
  DETAIL: "库存明细（仅仍有库存余量的明细）",
  FLOW: "库存流水（列表）",
} as const

/** 库存明细导出范围 · 勾选项下常驻说明 */
export const INVENTORY_CROSS_EXPORT_USER_DETAIL_SCOPE_HINT =
  "数据仅包含有「有库存的」：可用数量与冻结数量合计大于 0，不含已出清为零的记录。"

/** 库存流水导出范围 · 勾选项下常驻说明 */
export const INVENTORY_CROSS_EXPORT_USER_FLOW_SCOPE_HINT =
  "仅含已生效流水，不含审批中单据"

export const INVENTORY_CROSS_EXPORT_USER_ZIP_HINT =
  "若勾选多个菜单的数据，导出文件将打包为 Zip 压缩包（内含各菜单对应表格文件）。"

/** 原型规格对照 · 含规则编号 */
export const INVENTORY_CROSS_EXPORT_SPEC_DIALOG_NOTE =
  "【跨菜单导出入口统一规则】(IE-R01)：默认仅勾选「本菜单」分区。【跨菜单导出 Zip 打包规则】(IE-R06)：≥2 类菜单则 .zip，否则 .xlsx。【库存明细导出默认仅有库存余量规则】(IE-R02)。【组合导出全量不受列表筛选规则】(IE-R04)：首行右对齐说明。【组合导出与行级下载记录命名隔离规则】(IE-R03)：流水项下常驻终态说明。"
