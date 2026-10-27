import type {
  GoodsStatus,
  InboundCollectItemDef,
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
 * 入库收集信息 17 项预置项。
 * 口径来源：货品管理字段清单「1.1 入库收集信息 16 项预置字段规格清单」
 * （表头写 16 项，实际清单为 17 项，本原型按 17 项落地）。
 */
export const INBOUND_COLLECT_ITEMS: readonly InboundCollectItemDef[] = [
  {
    key: "packaging",
    label: "包装方式",
    group: "货品基础类",
    control: "select",
    controlLabel: "下拉单选",
    options: ["箱装/盒装", "袋装", "散装", "桶装", "集装箱", "托盘"],
    description: "货品实体包装形态，入库提交强校验枚举合规性。",
  },
  {
    key: "origin",
    label: "产地",
    group: "货品基础类",
    control: "region",
    controlLabel: "省市区三级联动",
    description: "规范化行政区划，溯源真实货源地。",
  },
  {
    key: "batchNo",
    label: "批次号",
    group: "货品基础类",
    control: "text",
    controlLabel: "单行文本",
    description: "核心溯源追踪编号，仓储货位与批次管理依据，1~50 字符。",
  },
  {
    key: "producer",
    label: "生产企业",
    group: "货品基础类",
    control: "text",
    controlLabel: "单行文本",
    description: "生产加工厂全称，1~100 字符。",
  },
  {
    key: "hazardLevel",
    label: "危险品等级",
    group: "货品基础类",
    control: "select",
    controlLabel: "下拉单选",
    options: [
      "非危",
      "第1类 爆炸品",
      "第2类 压缩气体和液化气体",
      "第3类 易燃液体",
      "第4类 易燃固体",
      "第5类 氧化剂",
      "第6类 毒害品",
      "第7类 放射性物品",
      "第8类 腐蚀品",
      "第9类 杂类",
    ],
    description: "危险化学品安全监管分类。",
  },
  {
    key: "qualityGrade",
    label: "质量等级",
    group: "生产质检类",
    control: "select",
    controlLabel: "下拉单选",
    options: ["特级", "一级", "二级", "三级", "国标", "优等品", "合格品"],
    description: "行业标准质量评定等级。",
  },
  {
    key: "productionDate",
    label: "生产日期",
    group: "生产质检类",
    control: "date",
    controlLabel: "日期选择器",
    description: "货物出厂生产日期，格式为年-月-日。",
  },
  {
    key: "expiryDate",
    label: "过期时间",
    group: "生产质检类",
    control: "date",
    controlLabel: "日期选择器",
    description: "到期时间；与生产日期、保质期同时填写时需满足日期关系。",
  },
  {
    key: "shelfLife",
    label: "保质期",
    group: "生产质检类",
    control: "period",
    controlLabel: "周期组合（数值 + 天/月/年）",
    description: "货物保质期限，正整数数值配天、月、年单位。",
  },
  {
    key: "inspectDate",
    label: "检验日期",
    group: "生产质检类",
    control: "date",
    controlLabel: "日期选择器",
    description: "质检完成报告日期。",
  },
  {
    key: "inspectOrg",
    label: "检验机构",
    group: "生产质检类",
    control: "text",
    controlLabel: "单行文本",
    description: "第三方检测机构全称，1~50 字符。",
  },
  {
    key: "inspectReportNo",
    label: "检验报告编号",
    group: "生产质检类",
    control: "text",
    controlLabel: "单行文本",
    description: "检测报告编号，检验报告溯源唯一索引，1~50 字符。",
  },
  {
    key: "storageMode",
    label: "存储方式",
    group: "仓储要求类",
    control: "select",
    controlLabel: "下拉单选",
    options: ["常温", "冷藏", "冷冻"],
    description: "仓储环境温控类型标准。",
  },
  {
    key: "temperature",
    label: "温度要求",
    group: "仓储要求类",
    control: "range",
    controlLabel: "双数值区间",
    unit: "℃",
    description: "温度控制标准，允许只填一侧，最小值不得大于最大值。",
  },
  {
    key: "humidity",
    label: "湿度要求",
    group: "仓储要求类",
    control: "range",
    controlLabel: "双数值区间",
    unit: "%RH",
    description: "湿度控制标准，允许只填一侧，最小值不得大于最大值。",
  },
  {
    key: "moisture",
    label: "水分含量",
    group: "仓储要求类",
    control: "number",
    controlLabel: "单行数字",
    unit: "%",
    description: "农粮与矿产重要质量指标，范围 0~100，最多 2 位小数。",
  },
  {
    key: "impurity",
    label: "杂质率",
    group: "仓储要求类",
    control: "number",
    controlLabel: "单行数字",
    unit: "%",
    description: "质检纯度与杂质率扣减指标，范围 0~100，最多 2 位小数。",
  },
]

export const INBOUND_COLLECT_ITEM_MAP = new Map(
  INBOUND_COLLECT_ITEMS.map((item) => [item.key, item])
)

export const INBOUND_COLLECT_GROUPS: Array<{
  group: InboundCollectItemDef["group"]
  items: InboundCollectItemDef[]
}> = ["货品基础类", "生产质检类", "仓储要求类"].map((group) => ({
  group: group as InboundCollectItemDef["group"],
  items: INBOUND_COLLECT_ITEMS.filter((item) => item.group === group),
}))
