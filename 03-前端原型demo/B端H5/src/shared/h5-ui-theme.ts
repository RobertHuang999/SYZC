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

export const H5_SEARCH_INPUT =
  "w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20"

export const H5_LIST_SCROLL = "flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain"

export const H5_CARD =
  "overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-xs transition-all active:scale-[0.99]"
