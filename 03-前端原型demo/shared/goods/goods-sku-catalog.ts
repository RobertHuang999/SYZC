/**
 * 货品管理（14-货品规格管理-货品管理）Mock 主档
 * 品类维度 + SKU 动态规格取值 + 入库收集信息配置（对齐 SKU-F03 / SKU-F04）
 *
 * 覆盖 10 个大类、20+ 品类、40+ 有效 SKU；含多规格同品类、三/四维度冻货、
 * 重量/数量双计量、丰富入库收集项，以及 1 条停用 SKU（valid: false 不入库可选）。
 */

/** 入库单现场控件形态（对应货品管理配置的控件类型） */
export type InboundCollectControlKind =
  | "text"
  | "select"
  | "date"
  | "range"
  | "percent"
  | "period"
  | "region"

export type InboundCollectFieldDef = {
  fieldKey: string
  label: string
  required: boolean
  control: InboundCollectControlKind
  options?: readonly string[]
  /** 区间/百分比的后缀单位，或保质期的固定单位（如 ℃、%RH、%、个月） */
  unit?: string
  /** true = 单位只读锁定（保质期）；false/缺省 = 现场可改（老货品未指定固定单位） */
  unitLocked?: boolean
  /** 保质期建议默认数值，选中货品时自动回填 */
  suggestedValue?: string
}

export type GoodsSkuRecord = {
  skuId: string
  category: string
  variety: string
  /** 动态规格参数取值，键名为品类定义的维度名称 */
  specValues: Record<string, string>
  measureParam: "重量" | "数量" | "体积"
  measureUnit: string
  measureUnits: readonly string[]
  inboundCollect: readonly InboundCollectFieldDef[]
  /** 有效启用（大类∧品类∧自身） */
  valid: boolean
}

const PACKAGING_OPTS = ["箱装/盒装", "袋装", "散装", "桶装", "托盘"] as const
const QUALITY_OPTS = ["特级", "一级", "二级", "国标", "优等品", "合格品"] as const
const STORAGE_OPTS = ["常温", "冷藏", "冷冻"] as const
const HAZARD_OPTS = ["非危", "第3类 易燃液体", "第8类 腐蚀品"] as const

export const GOODS_SKU_CATALOG: readonly GoodsSkuRecord[] = [
  // —— 有色金属 · 电解铜（双维度：牌号 + 纯度）——
  {
    skuId: "sku-nonferrous-cu-cath1",
    category: "有色金属",
    variety: "电解铜",
    specValues: { 牌号: "Cu-CATH-1", 纯度等级: "99.9935%" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "producer", label: "生产企业", required: false, control: "text" },
      { fieldKey: "hazard", label: "危险品等级", required: false, control: "select", options: HAZARD_OPTS },
    ],
    valid: true,
  },
  {
    skuId: "sku-nonferrous-cu-cath2",
    category: "有色金属",
    variety: "电解铜",
    specValues: { 牌号: "Cu-CATH-2", 纯度等级: "99.95%" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "producer", label: "生产企业", required: false, control: "text" },
    ],
    valid: true,
  },
  {
    skuId: "sku-nonferrous-cu-std1",
    category: "有色金属",
    variety: "电解铜",
    specValues: { 牌号: "1号标准阴极铜", 纯度等级: "99.99%" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [{ fieldKey: "batchNo", label: "批次号", required: true, control: "text" }],
    valid: true,
  },
  // —— 有色金属 · 铝锭 ——
  {
    skuId: "sku-nonferrous-al-a00",
    category: "有色金属",
    variety: "铝锭",
    specValues: { 牌号: "A00 (Al99.70%)" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [{ fieldKey: "batchNo", label: "批次号", required: false, control: "text" }],
    valid: true,
  },
  {
    skuId: "sku-nonferrous-al-adc12",
    category: "有色金属",
    variety: "铝锭",
    specValues: { 牌号: "ADC12 压铸铝合金" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "producer", label: "生产企业", required: false, control: "text" },
    ],
    valid: true,
  },
  {
    skuId: "sku-nonferrous-al-a356",
    category: "有色金属",
    variety: "铝锭",
    specValues: { 牌号: "A356.2 铸造铝合金" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [{ fieldKey: "qualityGrade", label: "质量等级", required: false, control: "select", options: QUALITY_OPTS }],
    valid: true,
  },
  // —— 有色金属 · 锌锭 ——
  {
    skuId: "sku-nonferrous-zn-0",
    category: "有色金属",
    variety: "锌锭",
    specValues: { 牌号: "Zn99.995", 产地: "云南" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [{ fieldKey: "batchNo", label: "批次号", required: true, control: "text" }],
    valid: true,
  },
  {
    skuId: "sku-nonferrous-zn-sh",
    category: "有色金属",
    variety: "锌锭",
    specValues: { 牌号: "Zn99.99", 产地: "上海" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [],
    valid: true,
  },
  // —— 黑色金属 · 热轧卷板 ——
  {
    skuId: "sku-steel-hrc-q235b-575",
    category: "黑色金属",
    variety: "热轧卷板",
    specValues: { 牌号: "Q235B", 规格型号: "5.75*1500*C" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "qualityGrade", label: "质量等级", required: false, control: "select", options: QUALITY_OPTS },
    ],
    valid: true,
  },
  {
    skuId: "sku-steel-hrc-q235b-30",
    category: "黑色金属",
    variety: "热轧卷板",
    specValues: { 牌号: "Q235B", 规格型号: "3.0*1250*C" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "producer", label: "生产企业", required: false, control: "text" },
    ],
    valid: true,
  },
  {
    skuId: "sku-steel-hrc-sphc",
    category: "黑色金属",
    variety: "热轧卷板",
    specValues: { 牌号: "SPHC", 规格型号: "2.75*1500*C" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [{ fieldKey: "batchNo", label: "批次号", required: false, control: "text" }],
    valid: true,
  },
  // —— 黑色金属 · 冷轧卷板 ——
  {
    skuId: "sku-steel-crc-spcc-10",
    category: "黑色金属",
    variety: "冷轧卷板",
    specValues: { 牌号: "SPCC", 规格型号: "1.0*1250*C" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "qualityGrade", label: "质量等级", required: false, control: "select", options: ["国标", "优等品", "合格品"] },
    ],
    valid: true,
  },
  {
    skuId: "sku-steel-crc-dc01",
    category: "黑色金属",
    variety: "冷轧卷板",
    specValues: { 牌号: "DC01", 规格型号: "0.8*1000*C" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [{ fieldKey: "producer", label: "生产企业", required: false, control: "text" }],
    valid: true,
  },
  // —— 黑色金属 · 螺纹钢 ——
  {
    skuId: "sku-steel-rebar-hrb400e",
    category: "黑色金属",
    variety: "螺纹钢",
    specValues: { 牌号: "HRB400E", 规格型号: "Φ18-25mm" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [{ fieldKey: "producer", label: "生产企业", required: false, control: "text" }],
    valid: true,
  },
  {
    skuId: "sku-steel-rebar-hrb500",
    category: "黑色金属",
    variety: "螺纹钢",
    specValues: { 牌号: "HRB500E", 规格型号: "Φ20mm" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "qualityGrade", label: "质量等级", required: false, control: "select", options: QUALITY_OPTS },
    ],
    valid: true,
  },
  // —— 冻货 · 鸡翅 ——
  {
    skuId: "sku-frozen-wing-sc-2025",
    category: "冻货",
    variety: "鸡翅",
    specValues: { 产地: "四川", 等级: "特级", 批次年份: "2025" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: PACKAGING_OPTS },
      { fieldKey: "storage", label: "存储方式", required: true, control: "select", options: STORAGE_OPTS },
      { fieldKey: "productionDate", label: "生产日期", required: false, control: "date" },
      { fieldKey: "expiryDate", label: "过期时间", required: false, control: "date" },
    ],
    valid: true,
  },
  {
    skuId: "sku-frozen-wing-sc-1",
    category: "冻货",
    variety: "鸡翅",
    specValues: { 产地: "四川", 等级: "一级", 批次年份: "2025" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: PACKAGING_OPTS },
      { fieldKey: "storage", label: "存储方式", required: true, control: "select", options: STORAGE_OPTS },
      {
        fieldKey: "temperature",
        label: "温度要求",
        required: true,
        control: "range",
        unit: "℃",
      },
      {
        fieldKey: "origin",
        label: "产地",
        required: false,
        control: "region",
      },
    ],
    valid: true,
  },
  // —— 冻货 · 牛肉 ——
  {
    skuId: "sku-frozen-beef-36m",
    category: "冻货",
    variety: "牛肉",
    specValues: { 保质期: "36个月", 部位: "牛腩块" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: PACKAGING_OPTS },
      { fieldKey: "storage", label: "存储方式", required: true, control: "select", options: ["冷冻"] },
      { fieldKey: "inspectOrg", label: "检验机构", required: false, control: "text" },
      {
        fieldKey: "shelfLife",
        label: "保质期",
        required: true,
        control: "period",
        unit: "个月",
        unitLocked: true,
        suggestedValue: "36",
      },
      { fieldKey: "productionDate", label: "生产日期", required: true, control: "date" },
      { fieldKey: "expiryDate", label: "过期时间", required: false, control: "date" },
    ],
    valid: true,
  },
  {
    skuId: "sku-frozen-beef-steak",
    category: "冻货",
    variety: "牛肉",
    specValues: { 保质期: "24个月", 部位: "西冷牛排" },
    measureParam: "重量",
    measureUnit: "公斤",
    measureUnits: ["公斤", "吨"],
    inboundCollect: [
      { fieldKey: "productionDate", label: "生产日期", required: true, control: "date" },
      { fieldKey: "reportNo", label: "检验报告编号", required: false, control: "text" },
      {
        fieldKey: "shelfLife",
        label: "保质期",
        required: true,
        control: "period",
        unit: "个月",
        unitLocked: true,
        suggestedValue: "24",
      },
      { fieldKey: "expiryDate", label: "过期时间", required: false, control: "date" },
    ],
    valid: true,
  },
  // —— 冻货 · 鸡腿 ——
  {
    skuId: "sku-frozen-drumstick-sc",
    category: "冻货",
    variety: "鸡腿",
    specValues: { 产地: "四川", 等级: "合格品" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "packaging", label: "包装方式", required: false, control: "select", options: PACKAGING_OPTS },
      { fieldKey: "storage", label: "存储方式", required: true, control: "select", options: STORAGE_OPTS },
    ],
    valid: true,
  },
  // —— 水果 · 苹果 ——
  {
    skuId: "sku-fruit-apple-xj-special",
    category: "水果",
    variety: "苹果",
    specValues: { 产地: "新疆", 等级: "特级" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: ["箱装/盒装", "袋装", "散装"] },
      { fieldKey: "productionDate", label: "生产日期", required: false, control: "date" },
    ],
    valid: true,
  },
  {
    skuId: "sku-fruit-apple-xj-fuji",
    category: "水果",
    variety: "苹果",
    specValues: { 产地: "新疆红富士", 等级: "特级" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: PACKAGING_OPTS },
      { fieldKey: "qualityGrade", label: "质量等级", required: false, control: "select", options: QUALITY_OPTS },
    ],
    valid: true,
  },
  {
    skuId: "sku-fruit-apple-shandong-1",
    category: "水果",
    variety: "苹果",
    specValues: { 产地: "山东烟台", 等级: "一级" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [{ fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: PACKAGING_OPTS }],
    valid: true,
  },
  // —— 水果 · 香蕉 ——
  {
    skuId: "sku-fruit-banana-hn",
    category: "水果",
    variety: "香蕉",
    specValues: { 产地: "海南", 等级: "一级" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: PACKAGING_OPTS },
      { fieldKey: "productionDate", label: "生产日期", required: false, control: "date" },
    ],
    valid: true,
  },
  {
    skuId: "sku-fruit-banana-import",
    category: "水果",
    variety: "香蕉",
    specValues: { 产地: "厄瓜多尔", 等级: "特级" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [
      { fieldKey: "inspectOrg", label: "检验机构", required: false, control: "text" },
      { fieldKey: "reportNo", label: "检验报告编号", required: false, control: "text" },
    ],
    valid: true,
  },
  // —— 干果 ——
  {
    skuId: "sku-dried-cookie-24m",
    category: "干果",
    variety: "瓜馏饼干",
    specValues: { 保质期: "24个月" },
    measureParam: "重量",
    measureUnit: "公斤",
    measureUnits: ["公斤", "吨"],
    inboundCollect: [],
    valid: true,
  },
  {
    skuId: "sku-dried-walnut-xj",
    category: "干果",
    variety: "核桃仁",
    specValues: { 产地: "新疆", 等级: "特级" },
    measureParam: "重量",
    measureUnit: "公斤",
    measureUnits: ["公斤", "吨"],
    inboundCollect: [
      { fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: PACKAGING_OPTS },
      { fieldKey: "moisture", label: "水分含量", required: false, control: "text" },
    ],
    valid: true,
  },
  // —— 粮食 · 玉米 / 小麦（与列表筛选「粮食-玉米」口径对齐）——
  {
    skuId: "sku-grain-corn-grade2",
    category: "粮食",
    variety: "玉米",
    specValues: { 等级: "国标二等", 品种: "黄玉米" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "moisture", label: "水分含量", required: false, control: "text" },
      { fieldKey: "impurity", label: "杂质率", required: false, control: "text" },
      { fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: ["散装", "袋装"] },
    ],
    valid: true,
  },
  {
    skuId: "sku-grain-corn-feed",
    category: "粮食",
    variety: "玉米",
    specValues: { 等级: "饲料级", 品种: "黄玉米" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [{ fieldKey: "moisture", label: "水分含量", required: true, control: "text" }],
    valid: true,
  },
  {
    skuId: "sku-grain-wheat-strong",
    category: "粮食",
    variety: "小麦",
    specValues: { 等级: "强筋麦", 产地: "河南" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "moisture", label: "水分含量", required: false, control: "text" },
      { fieldKey: "packaging", label: "包装方式", required: false, control: "select", options: ["散装", "袋装"] },
    ],
    valid: true,
  },
  // —— 农产品 · 橡胶（保留原「农产品-玉米」一条便于历史 Mock 对照）——
  {
    skuId: "sku-agri-corn-grade2",
    category: "农产品",
    variety: "玉米",
    specValues: { 等级: "国标二等", 品种: "黄玉米" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [
      { fieldKey: "moisture", label: "水分含量", required: false, control: "text" },
      { fieldKey: "packaging", label: "包装方式", required: true, control: "select", options: ["散装", "袋装", "箱装/盒装"] },
    ],
    valid: true,
  },
  // —— 橡胶 ——
  {
    skuId: "sku-rubber-tsr20",
    category: "橡胶",
    variety: "天然橡胶",
    specValues: { 标准: "20号标胶", 产地: "云南" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "qualityGrade", label: "质量等级", required: false, control: "select", options: QUALITY_OPTS },
    ],
    valid: true,
  },
  {
    skuId: "sku-rubber-smr20",
    category: "橡胶",
    variety: "天然橡胶",
    specValues: { 标准: "SMR20", 产地: "马来西亚" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨", "公斤"],
    inboundCollect: [{ fieldKey: "batchNo", label: "批次号", required: false, control: "text" }],
    valid: true,
  },
  // —— 化工 ——
  {
    skuId: "sku-chem-pe-lldpe7042",
    category: "化工",
    variety: "聚乙烯",
    specValues: { 牌号: "LLDPE-7042", 形态: "粒料" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "hazard", label: "危险品等级", required: true, control: "select", options: HAZARD_OPTS },
      { fieldKey: "storage", label: "存储方式", required: false, control: "select", options: STORAGE_OPTS },
    ],
    valid: true,
  },
  {
    skuId: "sku-chem-pe-hdpe",
    category: "化工",
    variety: "聚乙烯",
    specValues: { 牌号: "HDPE-5000S", 形态: "粒料" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [
      { fieldKey: "batchNo", label: "批次号", required: true, control: "text" },
      { fieldKey: "hazard", label: "危险品等级", required: true, control: "select", options: HAZARD_OPTS },
    ],
    valid: true,
  },
  {
    skuId: "sku-chem-pp-t30s",
    category: "化工",
    variety: "聚丙烯",
    specValues: { 牌号: "PP-T30S", 形态: "粒料" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [{ fieldKey: "producer", label: "生产企业", required: false, control: "text" }],
    valid: true,
  },
  // —— 数量计量示例（件/卷）——
  {
    skuId: "sku-steel-coil-count",
    category: "黑色金属",
    variety: "镀锌卷",
    specValues: { 牌号: "DX51D+Z", 规格型号: "1.2*1000*C" },
    measureParam: "数量",
    measureUnit: "卷",
    measureUnits: ["卷", "件"],
    inboundCollect: [{ fieldKey: "batchNo", label: "批次号", required: true, control: "text" }],
    valid: true,
  },
  {
    skuId: "sku-pack-pallet-box",
    category: "化工",
    variety: "包装辅材",
    specValues: { 规格型号: "1200*1000 木托盘", 材质: "松木" },
    measureParam: "数量",
    measureUnit: "件",
    measureUnits: ["件", "托"],
    inboundCollect: [],
    valid: true,
  },
  // —— 停用 SKU（入库不可选，仅供配置管理对照）——
  {
    skuId: "sku-legacy-cu-disabled",
    category: "有色金属",
    variety: "电解铜",
    specValues: { 牌号: "已停用阴极铜", 纯度等级: "99.90%" },
    measureParam: "重量",
    measureUnit: "吨",
    measureUnits: ["吨"],
    inboundCollect: [],
    valid: false,
  },
]

export function formatSpecSummary(specValues: Record<string, string>): string {
  const values = Object.values(specValues).map((v) => v.trim()).filter(Boolean)
  return values.join("-")
}

export function measureLabelFromParam(param: GoodsSkuRecord["measureParam"]): string {
  if (param === "重量") return "入库重量"
  if (param === "数量") return "入库数量"
  return "入库体积"
}

export function listEnabledCategories(): string[] {
  const set = new Set<string>()
  for (const sku of GOODS_SKU_CATALOG) {
    if (sku.valid) set.add(sku.category)
  }
  return [...set]
}

export function listVarieties(category: string): string[] {
  const set = new Set<string>()
  for (const sku of GOODS_SKU_CATALOG) {
    if (sku.valid && sku.category === category) set.add(sku.variety)
  }
  return [...set]
}

export function listSkus(category: string, variety: string): GoodsSkuRecord[] {
  return GOODS_SKU_CATALOG.filter(
    (sku) => sku.valid && sku.category === category && sku.variety === variety
  )
}

export type InboundSkuCascadeVariety = {
  name: string
  skus: GoodsSkuRecord[]
}

export type InboundSkuCascadeCategory = {
  name: string
  varieties: InboundSkuCascadeVariety[]
}

/** H5 入库发起 · 大类 / 品类 / SKU 三级联动树 */
export function buildInboundSkuCascadeTree(): InboundSkuCascadeCategory[] {
  return listEnabledCategories().map((category) => ({
    name: category,
    varieties: listVarieties(category).map((variety) => ({
      name: variety,
      skus: listSkus(category, variety),
    })),
  }))
}

export function getSkuById(skuId: string): GoodsSkuRecord | undefined {
  return GOODS_SKU_CATALOG.find((sku) => sku.skuId === skuId && sku.valid)
}

/** 品类下默认维度（无选中 SKU 时预览） */
export function getSpecDimensions(category: string, variety: string): string[] {
  const sample = listSkus(category, variety)[0]
  if (!sample) return []
  return Object.keys(sample.specValues)
}

/** 当前选中 SKU 的规格维度与取值（入库页只读展示真源，对齐货品管理 SKU 快照） */
export function getSpecEntriesForSku(skuId: string): { label: string; value: string }[] {
  const sku = getSkuById(skuId)
  if (!sku) return []
  return Object.entries(sku.specValues).map(([label, value]) => ({ label, value }))
}

/** 触发器/标题等窄位展示：仅规格摘要（如 Cu-CATH-1-99.9935%） */
export function formatSkuTriggerLabel(sku: GoodsSkuRecord): string {
  return formatSpecSummary(sku.specValues)
}

/** 下拉选项完整文案 */
export function formatSkuSelectLabel(sku: GoodsSkuRecord): string {
  const summary = formatSpecSummary(sku.specValues)
  const dims = Object.entries(sku.specValues)
    .map(([k, v]) => `${k}:${v}`)
    .join(" · ")
  return summary ? `${summary}（${dims}）` : dims
}

const STAGING_CATEGORY_ALIASES: Record<string, string> = {
  有色: "有色金属",
  黑色: "黑色金属",
  冻品: "冻货",
  农产品: "粮食",
  化工: "化工",
  橡胶: "橡胶",
}

function normalizeStagingCategoryLabel(label: string): string {
  const trimmed = label.trim()
  return STAGING_CATEGORY_ALIASES[trimmed] ?? trimmed
}

/** 暂存摘要无 skuId 时，按大类/品类/规格文本推断最接近的有效 SKU */
export function inferSkuIdFromStagingParts(
  category: string,
  variety: string,
  spec: string,
): string | undefined {
  const cat = normalizeStagingCategoryLabel(category)
  const varName = variety.trim()
  const specText = spec.trim()
  if (!varName && !cat) return undefined

  let candidates = GOODS_SKU_CATALOG.filter((sku) => sku.valid)
  if (cat) {
    const byCat = candidates.filter(
      (sku) => sku.category === cat || sku.category.startsWith(cat.slice(0, 2)),
    )
    if (byCat.length > 0) candidates = byCat
  }
  if (varName) {
    const byVariety = candidates.filter((sku) => sku.variety === varName)
    if (byVariety.length > 0) candidates = byVariety
  }
  if (candidates.length === 0) return undefined
  if (!specText) return candidates[0]?.skuId

  const specHit = candidates.find((sku) => {
    const summary = formatSpecSummary(sku.specValues)
    if (summary.includes(specText) || specText.includes(summary)) return true
    return Object.values(sku.specValues).some(
      (v) => v.includes(specText) || specText.includes(v),
    )
  })
  return (specHit ?? candidates[0])?.skuId
}
