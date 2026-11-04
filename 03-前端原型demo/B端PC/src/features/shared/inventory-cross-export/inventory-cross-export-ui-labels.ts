/** 上线用户文案 · 选择导出内容弹窗 */
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
  /** 本菜单区标题已含「库存明细」，此处强调导出范围 */
  DETAIL: "仅仍有库存余量的明细",
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

/** 库存明细导出范围 · 字段旁说明（可选挂载） */
export const INVENTORY_CROSS_EXPORT_USER_DETAIL_SCOPE_HINT =
  "与列表「仅查看有库存的」一致：可用数量与冻结数量合计大于 0，不含已出清为零的记录。"

export const INVENTORY_CROSS_EXPORT_USER_ZIP_HINT =
  "已勾选多个菜单的数据，导出文件将打包为 Zip 压缩包（内含各菜单对应表格文件）。"

/** 原型规格对照 · 含规则编号 */
export const INVENTORY_CROSS_EXPORT_SPEC_DIALOG_NOTE =
  "【跨菜单导出入口统一规则】(IE-R01)：默认仅勾选「本菜单」分区。【跨菜单导出 Zip 打包规则】(IE-R06)：≥2 类菜单则 .zip，否则 .xlsx。【库存明细导出默认仅有库存余量规则】(IE-R02)。【组合导出全量不受列表筛选规则】(IE-R04)。"
