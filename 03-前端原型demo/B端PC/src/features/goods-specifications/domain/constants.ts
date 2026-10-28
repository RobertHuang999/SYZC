import type {
  GoodsStatus,
  InboundCollectFilter,
  MajorCategoryFilter,
  SubcategoryFilter,
} from "./types"

export const GOODS_SPEC_BASE_PATH = "/配置管理/货品规格管理"

export const MAJOR_CATEGORY_LIST_PATH = `${GOODS_SPEC_BASE_PATH}/大类管理`
export const SUBCATEGORY_LIST_PATH = `${GOODS_SPEC_BASE_PATH}/品类管理`
export const GOODS_LIST_PATH = `${GOODS_SPEC_BASE_PATH}/货品管理`
export const GOODS_ADD_PATH = `${GOODS_LIST_PATH}/新增`
export const goodsEditPath = (id: string) => `${GOODS_LIST_PATH}/编辑/${id}`
export const goodsDetailPath = (id: string) => `${GOODS_LIST_PATH}/详情/${id}`

export const INBOUND_COLLECT_CONFIG_PATH = `${GOODS_SPEC_BASE_PATH}/入库收集项配置`
export const inboundCollectDetailPath = (id: string) =>
  `${INBOUND_COLLECT_CONFIG_PATH}/详情/${id}`
export const INBOUND_COLLECT_CREATE_PATH = `${INBOUND_COLLECT_CONFIG_PATH}/新增`
export const inboundCollectEditPath = (id: string) =>
  `${INBOUND_COLLECT_CONFIG_PATH}/编辑/${id}`

export const CONTROL_TYPE_OPTIONS: Array<{
  value: string
  label: string
  description?: string
}> = [
  { value: "单行文本输入框", label: "单行文本输入框", description: "常规文本信息" },
  { value: "下拉单选框", label: "下拉单选框", description: "预设固定枚举选项" },
  { value: "日期选择器", label: "日期选择器", description: "标准年月日日期" },
  { value: "数字区间框", label: "数字区间框", description: "指标数值范围，如温度、湿度" },
  { value: "百分比数值框", label: "百分比数值框", description: "0~100 比率参数，如含水量" },
  { value: "周期组合项", label: "周期组合项", description: "保质期专属：正整数 + 固定单位" },
  { value: "省市区三级联动", label: "省市区三级联动", description: "省 → 市 → 区逐级选择，如产地" },
]

/**
 * 新增/编辑页可选的控件类型。
 * 【周期组合项】为保质期专属（字段清单 6.1），只能在系统预置项上出现，
 * 不允许管理员自建，因此从新建选项里剔除；筛选下拉仍保留全量。
 */
export const CREATABLE_CONTROL_TYPE_OPTIONS = CONTROL_TYPE_OPTIONS.filter(
  (option) => option.value !== "周期组合项"
)

export const COMMON_UNIT_SUGGESTIONS = ["℃", "%RH", "kg", "%", "g", "mg/kg", "mm"]

export const DEFAULT_INBOUND_COLLECT_FILTER: InboundCollectFilter = {
  name: "",
  controlType: "",
  status: "",
  createdAtRange: ["", ""],
}



export const DEFAULT_MAJOR_CATEGORY_FILTER: MajorCategoryFilter = {
  name: "",
  status: "",
}

export const DEFAULT_SUBCATEGORY_FILTER: SubcategoryFilter = {
  categoryId: "",
  name: "",
  status: "",
}

export const STATUS_OPTIONS: Array<{ value: "" | GoodsStatus; label: string }> = [
  { value: "", label: "全部" },
  { value: "ENABLED", label: "启用" },
  { value: "DISABLED", label: "停用" },
]

export const STATUS_LABEL: Record<GoodsStatus, string> = {
  ENABLED: "启用",
  DISABLED: "停用",
}

export const MEASURE_PARAM_OPTIONS = ["重量", "数量", "体积", "面积"] as const

export const MEASURE_UNIT_SUGGESTIONS: Record<string, string[]> = {
  重量: ["吨", "公斤", "千克"],
  数量: ["件", "包", "箱", "卷", "个"],
  体积: ["立方米", "升"],
  面积: ["平方米"],
}

export const PAGE_SIZE = 10

/** 货品列表单价展示单位切换 */
export const PRICE_DISPLAY_OPTIONS = [
  { value: "YUAN", label: "元" },
  { value: "WAN", label: "万元" },
] as const

/**
 * 06 存量货品收集项标识 → 07 字段池字段 ID 的迁移对照。
 * 存量数据里同时存在 camelCase 与 snake_case 两套写法，这里全部覆盖。
 */
export const LEGACY_COLLECT_KEY_MAP: Record<string, string> = {
  shelfLife: "col-shelf-life",
  shelf_life: "col-shelf-life",
  packaging: "col-packaging",
  packaging_type: "col-packaging",
  origin: "col-origin",
  batchNo: "col-batch-no",
  batch_no: "col-batch-no",
  heat_no: "col-heat-no",
  heatNo: "col-heat-no",
  producer: "col-producer",
  hazardLevel: "col-hazard-level",
  hazard_level: "col-hazard-level",
  qualityGrade: "col-quality-grade",
  quality_grade: "col-quality-grade",
  productionDate: "col-prod-date",
  production_date: "col-prod-date",
  expiryDate: "col-exp-date",
  expiry_date: "col-exp-date",
  inspectDate: "col-inspect-date",
  inspect_date: "col-inspect-date",
  inspectOrg: "col-inspect-org",
  inspect_org: "col-inspect-org",
  inspectReportNo: "col-inspect-report",
  inspect_report_no: "col-inspect-report",
  storageMode: "col-storage-mode",
  storage_mode: "col-storage-mode",
  temperature: "col-temp",
  humidity: "col-humidity",
  moisture: "col-moisture",
  impurity: "col-impurity",
}

/** 07 字段池里可被 06 勾选时的控件类型筛选项（周期组合项只给保质期，不单列） */
export const COLLECT_CONTROL_TABS = [
  "全部",
  "单行文本输入框",
  "下拉单选框",
  "日期选择器",
  "数字区间框",
  "百分比数值框",
  "省市区三级联动",
  "周期组合项",
] as const
