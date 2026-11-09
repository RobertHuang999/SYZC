import type {
  AnomalyHandlingStatus,
  CheckListFilters,
  CheckResult,
  CheckStatus,
  CheckType,
  CheckMode,
} from "./types"

export const CHECK_LIST_ROUTE = "/m/workspace/inventory-checks"
export const CHECK_WORKSPACE_ROUTE = "/m/workspace"

export function checkDetailRoute(id: string): string {
  return `${CHECK_LIST_ROUTE}/${encodeURIComponent(id)}`
}

/** 当前登录人（与 PC 原型演示账号一致） */
export const CHECK_CURRENT_USER = {
  id: "usr-01",
  name: "lxy",
  company: "四川享宇科技有限公司",
}

export const CHECK_STATUS_MAP: Record<
  CheckStatus,
  {
    label: string
    badgeClass: string
    tone: "emerald" | "amber" | "blue" | "rose" | "slate"
  }
> = {
  PENDING_START: {
    label: "未开始",
    badgeClass: "border-slate-200 bg-slate-100 text-slate-600",
    tone: "slate",
  },
  IN_PROGRESS: {
    label: "盘点中",
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
    tone: "blue",
  },
  COMPLETED: {
    label: "已盘点",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    tone: "emerald",
  },
  EXPIRED: {
    label: "已超期",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    tone: "amber",
  },
  REVOKED: {
    label: "已撤销",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-600",
    tone: "rose",
  },
  EXPIRED_COMPLETED: {
    label: "超期完成",
    badgeClass: "border-indigo-200 bg-indigo-50 text-indigo-700",
    tone: "blue",
  },
}

export const CHECK_RESULT_MAP: Record<
  CheckResult,
  { label: string; badgeClass: string }
> = {
  NORMAL: {
    label: "正常",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  ABNORMAL: {
    label: "异常",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-700 font-medium",
  },
  EMPTY: {
    label: "——",
    badgeClass: "border-transparent bg-transparent text-[#232D39]/35",
  },
}

export const ANOMALY_HANDLING_MAP: Record<
  AnomalyHandlingStatus,
  { label: string; badgeClass: string }
> = {
  RESOLVED: {
    label: "已处理",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  UNRESOLVED: {
    label: "未处理",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  EMPTY: {
    label: "——",
    badgeClass: "border-transparent bg-transparent text-[#232D39]/35",
  },
}

export const CHECK_MODE_LABEL: Record<CheckMode, string> = {
  SINGLE_PERSON: "单人独立盘点",
  MULTI_PERSON: "多人协作盘点",
}

export const CHECK_TYPE_LABEL: Record<CheckType, string> = {
  BOOK_SUMMARY: "账面汇总盘点",
  INVENTORY_DETAIL: "库存明细盘点",
}

export const CHECK_STATUS_OPTIONS = [
  { label: "全部状态", value: "ALL" },
  ...(Object.keys(CHECK_STATUS_MAP) as CheckStatus[]).map((key) => ({
    label: CHECK_STATUS_MAP[key].label,
    value: key,
  })),
]

export const CHECK_TYPE_OPTIONS = [
  { label: "全部类型", value: "ALL" },
  { label: "账面汇总盘点", value: "BOOK_SUMMARY" },
  { label: "库存明细盘点", value: "INVENTORY_DETAIL" },
]

export const CHECK_RESULT_OPTIONS = [
  { label: "全部结果", value: "ALL" },
  { label: "正常", value: "NORMAL" },
  { label: "异常", value: "ABNORMAL" },
]

/** 后端字典里的实际盘点人员（用于 More 抽屉多选） */
export const CHECK_ACTUAL_USER_OPTIONS = ["lxy", "卡皮巴拉", "张监管", "李库管"]

export const CHECK_CREATOR_OPTIONS = [
  { label: "全部制单人", value: "ALL" },
  { label: "lxy", value: "lxy" },
  { label: "卡皮巴拉", value: "卡皮巴拉" },
  { label: "张监管", value: "张监管" },
]

export const CHECK_WAREHOUSE_OPTIONS = [
  { label: "全部仓库", value: "ALL" },
  { label: "无锡不锈钢智慧监管仓", value: "无锡不锈钢智慧监管仓" },
  { label: "上海自贸区大宗商品中心仓", value: "上海自贸区大宗商品中心仓" },
  { label: "佛山顺德有色金属监管仓", value: "佛山顺德有色金属监管仓" },
]

export const DEFAULT_CHECK_FILTERS: CheckListFilters = {
  keyword: "",
  taskName: "",
  checkType: "ALL",
  warehouseName: "ALL",
  status: "ALL",
  result: "ALL",
  actualUsers: [],
  creator: "ALL",
  startDate: "",
  endDate: "",
}
