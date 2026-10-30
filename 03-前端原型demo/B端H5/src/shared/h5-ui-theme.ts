/**
 * H5 交互主色 · 对齐设备/押品预警、《05-移动端色彩与视觉系统规范》经典蓝，
 * 并与 PC 原型 `--primary: #165dff`（Tailwind `blue-600` 近似）保持一致。
 */

export const H5_PRIMARY = {
  btn: "bg-blue-600 text-white active:bg-blue-700",
  btnLg: "rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700",
  btnFab: "bg-blue-600 text-white shadow-lg active:bg-blue-700",
  text: "text-blue-600",
  textHover: "text-blue-600 hover:text-blue-700",
  ring: "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400",
  pillActive: "bg-blue-50 text-blue-600 font-semibold border border-blue-200",
  icon: "text-blue-600",
  gradientTop: "bg-gradient-to-b from-blue-50/80 to-[#F2F3F7]",
} as const

export const H5_FILTER_BAR =
  "shrink-0 space-y-2 border-b border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs"

/** 列表首屏筛选胶囊行：强制单行，子项等分宽度（配合 DropdownFilterPill compactRow） */
export const H5_FILTER_PILL_ROW =
  "flex w-full max-w-full flex-nowrap items-stretch gap-1 py-0.5"

export const H5_SEARCH_INPUT =
  "w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20"

/** 列表/详情页主列：放在 MobileShell 内，承接 NavBar + 筛选 + 滚动区 */
export const H5_PAGE_BODY = "flex min-h-0 flex-1 flex-col"

/**
 * 标注打点包装列表滚动区时必须加在 PrototypeAnnotationTarget 上，
 * 否则外层 relative 块不参与 flex，列表无法滚动。
 */
export const H5_SCROLL_HOST = "relative flex min-h-0 flex-1 flex-col"

export const H5_LIST_SCROLL = "flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain"

export const H5_CARD =
  "overflow-hidden rounded-xl border border-[#232D39]/5 bg-white shadow-sm transition-all active:scale-[0.99]"

/** 列表卡片底部胶囊操作（对齐出库记录 buttons-view） */
export const H5_PILL_SECONDARY =
  "inline-flex items-center gap-1 rounded-full border border-[#232D39]/20 px-3 py-1.5 text-xs font-medium text-[#232D39]/80 active:bg-gray-50"

export const H5_PILL_PRIMARY =
  "inline-flex items-center gap-0.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 active:bg-blue-100"

export const H5_PILL_ACCENT =
  "inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white active:bg-blue-700"

export const H5_PILL_DANGER =
  "inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 active:bg-red-100"

/** 详情页吸底主/次按钮（对齐入库发起、暂存货品步） */
export const H5_DETAIL_BTN_SECONDARY =
  "flex h-11 flex-1 items-center justify-center rounded-lg border border-[#232D39]/20 text-sm font-medium text-[#232D39] active:bg-gray-50"

export const H5_DETAIL_BTN_PRIMARY =
  "flex h-11 flex-[1.2] items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
