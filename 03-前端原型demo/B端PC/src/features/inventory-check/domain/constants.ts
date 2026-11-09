import type { CheckStatus, CheckResult, AnomalyHandlingStatus, CheckMode, CheckType, CheckListFilterParams } from "./types"

export const CHECK_STATUS_MAP: Record<CheckStatus, { label: string; badgeClass: string; sealClass: string }> = {
  PENDING_START: {
    label: "未开始",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    sealClass: "text-slate-500 border-slate-400 bg-slate-50/50",
  },
  IN_PROGRESS: {
    label: "盘点中",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    sealClass: "text-blue-600 border-blue-400 bg-blue-50/50",
  },
  COMPLETED: {
    label: "已盘点",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    sealClass: "text-emerald-600 border-emerald-500 bg-emerald-50/50",
  },
  EXPIRED: {
    label: "已超期",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    sealClass: "text-amber-600 border-amber-500 bg-amber-50/50",
  },
  REVOKED: {
    label: "已撤销",
    badgeClass: "bg-rose-50 text-rose-600 border-rose-200",
    sealClass: "text-rose-500 border-rose-400 bg-rose-50/50",
  },
  EXPIRED_COMPLETED: {
    label: "超期完成",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    sealClass: "text-purple-600 border-purple-500 bg-purple-50/50",
  },
}

export const CHECK_RESULT_MAP: Record<CheckResult, { label: string; badgeClass: string }> = {
  NORMAL: {
    label: "正常",
    badgeClass: "text-emerald-700 bg-emerald-50 border border-emerald-200",
  },
  ABNORMAL: {
    label: "异常",
    badgeClass: "text-rose-700 bg-rose-50 border border-rose-200 font-medium",
  },
  EMPTY: {
    label: "——",
    badgeClass: "text-slate-400",
  },
}

export const ANOMALY_HANDLING_MAP: Record<AnomalyHandlingStatus, { label: string; badgeClass: string }> = {
  RESOLVED: {
    label: "已处理",
    badgeClass: "text-emerald-700 bg-emerald-50 border border-emerald-200",
  },
  UNRESOLVED: {
    label: "未处理",
    badgeClass: "text-amber-700 bg-amber-50 border border-amber-200",
  },
  EMPTY: {
    label: "——",
    badgeClass: "text-slate-400",
  },
}

export const CHECK_MODE_OPTIONS: { label: string; value: CheckMode; desc: string }[] = [
  { label: "单人独立盘点", value: "SINGLE_PERSON", desc: "仅限选择 1 人，独立承接并录入盘点数据" },
  { label: "多人协作盘点", value: "MULTI_PERSON", desc: "可选择多人协同录入，同一货物以最后一次提交结果为准" },
]

export const CHECK_TYPE_OPTIONS: { label: string; value: CheckType; desc: string }[] = [
  { label: "账面汇总盘点", value: "BOOK_SUMMARY", desc: "按货物维度合并汇总，不细分货主与条码，核对总量" },
  { label: "库存明细盘点", value: "INVENTORY_DETAIL", desc: "逐件穿透到每一笔存货条码、货主、库房及分区" },
]

export const DEFAULT_CHECK_FILTER_PARAMS: CheckListFilterParams = {
  checkNo: "",
  taskName: "",
  startDate: "",
  endDate: "",
  checkType: "ALL",
  warehouseName: "ALL",
  status: "ALL",
  result: "ALL",
  actualUsers: [],
  creator: "ALL",
  createdStartTime: "",
  createdEndTime: "",
}

/** 模拟系统启用员工列表 */
export const MOCK_SYSTEM_USERS = [
  { id: "usr-01", name: "lxy", company: "四川享宇科技有限公司", dept: "仓储监管部" },
  { id: "usr-02", name: "卡皮巴拉", company: "四川享宇科技有限公司", dept: "仓储调度中心" },
  { id: "usr-03", name: "张监管", company: "森云智能供应链管理有限公司", dept: "现场运营部" },
  { id: "usr-04", name: "李库管", company: "森云智能供应链管理有限公司", dept: "现场运营部" },
  { id: "usr-05", name: "王巡查", company: "四川享宇科技有限公司", dept: "风险控制部" },
]

/** 模拟实体仓库档案 */
export const MOCK_WAREHOUSES = [
  {
    id: "wh-01",
    name: "无锡不锈钢智慧监管仓",
    rooms: [
      { id: "room-01", name: "1号板材立体库", partitions: ["A区精密冷轧区", "B区不锈钢卷板区", "C区特种合金区"] },
      { id: "room-02", name: "2号高架保税库", partitions: ["保税暂存A区", "海关监管B区"] },
    ],
  },
  {
    id: "wh-02",
    name: "上海自贸区大宗商品中心仓",
    rooms: [
      { id: "room-03", name: "冷链1号控温库", partitions: ["分区冷冻1", "分区冷冻2"] },
      { id: "room-04", name: "常温电解铜库", partitions: ["高纯阴极铜垛位A", "铜杆线盘垛位B"] },
    ],
  },
  {
    id: "wh-03",
    name: "佛山顺德有色金属监管仓",
    rooms: [
      { id: "room-05", name: "铝锭主仓", partitions: ["重熔用铝锭A区", "铝合金锭B区"] },
    ],
  },
]

