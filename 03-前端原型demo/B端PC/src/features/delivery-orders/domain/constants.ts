export const DELIVERY_ORDER_LIST_PATH = "/仓储/提货单"
export const deliveryOrderDetailPath = (id: string) => `/仓储/提货单/详情/${id}`

export const PAGE_SIZE = 10

export const DEFAULT_DELIVERY_ORDER_FILTERS = {
  nameOrIdentity: "",
  pickNameOrMobile: "",
  status: "全部",
}

export const DELIVERY_STATUS_CONFIG = {
  未提货: {
    label: "未提货",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  },
  已提货: {
    label: "已提货",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  已取消: {
    label: "已取消",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  },
} as const

