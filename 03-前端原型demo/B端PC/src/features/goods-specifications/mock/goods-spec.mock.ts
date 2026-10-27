import type {
  GoodsInboundCollectConfig,
  GoodsSku,
  MajorCategory,
  PriceHistoryEntry,
  PriceTrendPoint,
  Subcategory,
} from "../domain/types"

/**
 * 货品规格管理精炼场景 Mock 数据
 * 严格按用户要求精简：每种业务场景仅包含 1 个代表性样本，绝不冗余堆砌。
 *
 * 覆盖的完整场景矩阵：
 * 【大类维度】：
 * 1. 自身启用 · 存在在押业务数据产生（锁定不可删改，演示强阻断）
 * 2. 自身启用 · 无业务数据（支持完整新增/编辑/删除体验）
 * 3. 自身停用（演示停用状态与启用恢复链路）
 *
 * 【品类维度】：
 * 1. 自身启用 · 存在业务数据产生（锁定不可删改）
 * 2. 自身启用 · 无业务数据（可编辑规格维度与删除）
 * 3. 自身停用 · 所属大类启用（演示品类级独立停用）
 * 4. 自身停用 · 所属大类停用（演示上级级联停用/无效停用状态）
 *
 * 【货品 SKU 维度】：
 * 1. 自身启用 · 有入库单锁定 · 已设参考单价（含价格历史与趋势曲线）
 * 2. 自身启用 · 无入库单 · 未设单价（展示“--”，支持自由设价与编辑删除）
 * 3. 自身停用 · 演示“已停用”与左侧复选框联动过滤
 */

export const MOCK_MAJOR_CATEGORIES: MajorCategory[] = [
  // 场景 1: 启用 · 有关联业务数据（阻断修改名称与删除，仅可操作停用）
  {
    id: "cat-ferrous",
    name: "黑色金属",
    status: "ENABLED",
    createdBy: "张伟",
    createdAt: "2026-08-21 14:20:05",
    updatedBy: "李娜",
    updatedAt: "2026-08-21 14:20:05",
    version: 3,
    hasInboundOrders: true,
  },
  // 场景 2: 启用 · 无业务数据（可自由编辑、删除、停用）
  {
    id: "cat-dryfood",
    name: "干粮",
    status: "ENABLED",
    createdBy: "卡皮巴拉",
    createdAt: "2026-05-09 10:33:34",
    updatedBy: "卡皮巴拉",
    updatedAt: "2026-05-09 10:33:34",
    version: 1,
    hasInboundOrders: false,
  },
  // 场景 3: 停用 · 演示停用状态展示与启用恢复
  {
    id: "cat-building",
    name: "建筑建材",
    status: "DISABLED",
    createdBy: "刘敏",
    createdAt: "2026-04-02 14:48:42",
    updatedBy: "刘敏",
    updatedAt: "2026-09-01 16:20:00",
    version: 2,
    hasInboundOrders: false,
  },
]

export const MOCK_SUBCATEGORIES: Subcategory[] = [
  // 场景 1: 启用 · 有关联业务数据（阻断编辑规格参数与删除）
  {
    id: "sub-rebar",
    name: "螺纹钢",
    categoryId: "cat-ferrous",
    specDimensions: ["材质", "规格", "产地"],
    status: "ENABLED",
    createdBy: "张伟",
    createdAt: "2026-08-21 14:23:21",
    updatedBy: "李娜",
    updatedAt: "2026-08-21 14:23:21",
    version: 3,
    hasInboundOrders: true,
  },
  // 场景 2: 启用 · 无业务数据（支持自由编辑规格参数与删除）
  {
    id: "sub-instant-noodle",
    name: "方便面",
    categoryId: "cat-dryfood",
    specDimensions: ["品牌", "口味"],
    status: "ENABLED",
    createdBy: "卡皮巴拉",
    createdAt: "2026-08-19 14:18:27",
    updatedBy: "卡皮巴拉",
    updatedAt: "2026-08-19 14:18:27",
    version: 1,
    hasInboundOrders: false,
  },
  // 场景 3: 自身停用 · 所属大类启用（演示独立停用）
  {
    id: "sub-compressed-biscuit",
    name: "压缩饼干",
    categoryId: "cat-dryfood",
    specDimensions: ["口味", "规格"],
    status: "DISABLED",
    createdBy: "卡皮巴拉",
    createdAt: "2026-06-24 14:44:05",
    updatedBy: "卡皮巴拉",
    updatedAt: "2026-06-24 14:44:05",
    version: 1,
    hasInboundOrders: false,
  },
  // 场景 4: 所属大类已停用 · 级联停用（演示上级停用导致的无效停用）
  {
    id: "sub-hotrolled",
    name: "热轧卷板",
    categoryId: "cat-building",
    specDimensions: ["厚度", "宽度"],
    status: "DISABLED",
    createdBy: "张伟",
    createdAt: "2026-05-09 10:35:02",
    updatedBy: "张伟",
    updatedAt: "2026-09-10 11:30:00",
    version: 2,
    hasInboundOrders: false,
  },
]

const standardInboundCollect: GoodsInboundCollectConfig[] = [
  { key: "shelf_life", label: "保质期", required: true },
  { key: "packaging_type", label: "包装方式", required: true },
]

const rebarPriceTrend: PriceTrendPoint[] = [
  { date: "2026-10-01", price: 3780 },
  { date: "2026-10-08", price: 3820 },
  { date: "2026-10-15", price: 3850 },
]

const rebarPriceHistory: PriceHistoryEntry[] = [
  {
    id: "hist-1",
    price: 3850,
    unit: "吨",
    operator: "张伟",
    operatedAt: "2026-10-15 14:20:00",
  },
  {
    id: "hist-2",
    price: 3780,
    unit: "吨",
    operator: "李娜",
    operatedAt: "2026-09-25 15:20:00",
  },
]

export const MOCK_GOODS_SKUS: GoodsSku[] = [
  // 螺纹钢 1: 自身启用 · 有关联入库单（已锁定不可删改） · 已设单价 3850（含趋势与历史）
  {
    id: "sku-rebar-01",
    subcategoryId: "sub-rebar",
    specValues: {
      材质: "HRB400E",
      规格: "Φ20mm",
      产地: "沙钢",
    },
    measureParam: "重量",
    measureUnit: "吨",
    inboundCollect: [
      { key: "packaging_type", label: "包装方式", required: true },
      { key: "batch_no", label: "批次号", required: true },
    ],
    price: 3850,
    status: "ENABLED",
    createdBy: "张伟",
    createdAt: "2026-08-21 15:00:00",
    updatedBy: "李娜",
    updatedAt: "2026-10-15 14:20:00",
    version: 4,
    hasInboundOrders: true,
    priceHistory: rebarPriceHistory,
    priceTrend: rebarPriceTrend,
  },
  // 螺纹钢 2: 自身启用 · 无入库单（支持自由编辑和删除） · 已设单价 3880
  {
    id: "sku-rebar-02",
    subcategoryId: "sub-rebar",
    specValues: {
      材质: "HRB400E",
      规格: "Φ25mm",
      产地: "永钢",
    },
    measureParam: "重量",
    measureUnit: "吨",
    inboundCollect: [
      { key: "batch_no", label: "批次号", required: true },
      { key: "heat_no", label: "炉号", required: true },
    ],
    price: 3880,
    status: "ENABLED",
    createdBy: "李娜",
    createdAt: "2026-08-21 15:10:00",
    updatedBy: "李娜",
    updatedAt: "2026-10-10 11:00:00",
    version: 2,
    hasInboundOrders: false,
    priceHistory: [
      {
        id: "hist-rebar-02-1",
        price: 3880,
        unit: "吨",
        operator: "李娜",
        operatedAt: "2026-10-10 11:00:00",
      },
    ],
    priceTrend: [
      { date: "2026-10-01", price: 3820 },
      { date: "2026-10-08", price: 3850 },
      { date: "2026-10-15", price: 3880 },
    ],
  },
  // 螺纹钢 3: 自身启用 · 无入库单 · 未设单价（展示“--”，演示设置价格入口）
  {
    id: "sku-rebar-03",
    subcategoryId: "sub-rebar",
    specValues: {
      材质: "HRB500E",
      规格: "Φ18mm",
      产地: "中天",
    },
    measureParam: "重量",
    measureUnit: "吨",
    inboundCollect: [
      { key: "packaging_type", label: "包装方式", required: true },
      { key: "quality_grade", label: "质量等级", required: false },
    ],
    price: undefined,
    status: "ENABLED",
    createdBy: "张伟",
    createdAt: "2026-08-21 15:20:00",
    updatedBy: "张伟",
    updatedAt: "2026-08-21 15:20:00",
    version: 1,
    hasInboundOrders: false,
    priceHistory: [],
    priceTrend: [],
  },
  // 螺纹钢 4: 自身停用 · 演示停用状态与左下角“显示已停用货品信息”勾选联动
  {
    id: "sku-rebar-04",
    subcategoryId: "sub-rebar",
    specValues: {
      材质: "HRB400",
      规格: "Φ12mm",
      产地: "申特",
    },
    measureParam: "重量",
    measureUnit: "吨",
    inboundCollect: [
      { key: "packaging_type", label: "包装方式", required: true },
    ],
    price: 3720,
    status: "DISABLED",
    createdBy: "王强",
    createdAt: "2026-08-21 15:30:00",
    updatedBy: "王强",
    updatedAt: "2026-09-01 10:00:00",
    version: 2,
    hasInboundOrders: false,
    priceHistory: [],
    priceTrend: [],
  },
  // 其他场景备用: 方便面 (干粮品类)
  {
    id: "sku-noodle-01",
    subcategoryId: "sub-instant-noodle",
    specValues: {
      品牌: "康师傅",
      口味: "酸菜",
    },
    measureParam: "个数",
    measureUnit: "桶",
    inboundCollect: [],
    price: undefined,
    status: "ENABLED",
    createdBy: "卡皮巴拉",
    createdAt: "2026-08-19 14:30:00",
    updatedBy: "卡皮巴拉",
    updatedAt: "2026-08-19 14:30:00",
    version: 1,
    hasInboundOrders: false,
    priceHistory: [],
    priceTrend: [],
  },
  // 其他场景备用: 热轧卷板 (所属品类与大类均停用)
  {
    id: "sku-hotrolled-01",
    subcategoryId: "sub-hotrolled",
    specValues: {
      厚度: "2.5mm",
      宽度: "1250mm",
    },
    measureParam: "重量",
    measureUnit: "吨",
    inboundCollect: standardInboundCollect,
    price: 3600,
    status: "DISABLED",
    createdBy: "张伟",
    createdAt: "2026-05-09 11:00:00",
    updatedBy: "张伟",
    updatedAt: "2026-09-10 11:35:00",
    version: 2,
    hasInboundOrders: false,
    priceHistory: [],
    priceTrend: [],
  },
]
