// 货主联想池 (包含截图中的 李米娜 真实数据)
export interface MovingOwnerCandidate {
  ownerId: string
  ownerName: string
  ownerType: 1 | 2 // 1 个人, 2 企业
  ownerIdentity: string // 身份证号或税号
  ownerMobile: string // 联系手机号
}

export const MOVING_OWNER_CANDIDATES: MovingOwnerCandidate[] = [
  {
    ownerId: "OWN-000",
    ownerName: "李米娜",
    ownerType: 1,
    ownerIdentity: "310101********2738",
    ownerMobile: "185****8733",
  },
  {
    ownerId: "OWN-001",
    ownerName: "无锡中金物资实业有限公司",
    ownerType: 2,
    ownerIdentity: "91320200MA1W9XY188",
    ownerMobile: "13812345678",
  },
  {
    ownerId: "OWN-002",
    ownerName: "江苏新华发国际物流贸易有限公司",
    ownerType: 2,
    ownerIdentity: "91320100789012345X",
    ownerMobile: "13987654321",
  },
  {
    ownerId: "OWN-003",
    ownerName: "陈志刚",
    ownerType: 1,
    ownerIdentity: "320211198506124518",
    ownerMobile: "13766668888",
  },
]

// 关联单号候选池
export interface RelatedPledgeOrder {
  id: string
  code: string
  orderType: "PLEDGE" | "MORTGAGE" | "CD"
  ownerName: string
  repoName: string
  goodsCount: number
  totalAmount: number
  unit: string
}

export const RELATED_PLEDGE_ORDERS: RelatedPledgeOrder[] = [
  {
    id: "ORD-ZY-202611-001",
    code: "ZY202611010088",
    orderType: "PLEDGE",
    ownerName: "李米娜",
    repoName: "海霸王仓库",
    goodsCount: 1,
    totalAmount: 450,
    unit: "公斤",
  },
  {
    id: "ORD-CD-202610-002",
    code: "WRL-CD-20261025-01",
    orderType: "CD",
    ownerName: "江苏新华发国际物流贸易有限公司",
    repoName: "张家港沙钢中心1号仓",
    goodsCount: 2,
    totalAmount: 45,
    unit: "卷",
  },
]

// 待移库明细结构 (完全对齐截图中的真实层级)
export interface MovingStockQrcodeItem {
  inboundTime: string
  statusText: string // "存货中"
  repoName: string
  houseName: string
  zoneName: string
  detailPlace?: string
  attrOtherValueText?: string // 入库收集信息
  selectAmount: number
  unit: string
  moveInLocation?: string // 移入位置，如 "海霸王仓库-库房不审核-分区冷冻1"
  moveInDetail?: string // 具体位置输入
}

export interface MovingStockZoneItem {
  zoneName: string // 如 "分区冷冻2"
  selectAmount: number
  unit: string
  showContent: boolean
  respStockInboundQrcodeVoList: MovingStockQrcodeItem[]
}

export interface MovingStockHouseItem {
  houseName: string // 如 "库房不审核"
  boundCheck: number // 1 需审核, 0 不审核
  selectAmount: number
  unit: string
  respZoneDistributionInfoList: MovingStockZoneItem[]
}

export interface MovingGoodsCardItem {
  goodsName: string // 如 "冻货-牛丸-36个月"
  cateName: string
  typeName: string
  concatAttrValue: string
  totalSelectNumber: number // 450
  unit: string // "公斤"
  repoName: string // "海霸王仓库"
  showDetail: boolean // 控制明细折叠/展开
  activeHouseIndex: number
  respHouseDistributionInfoList: MovingStockHouseItem[]
}

// 截图 2 中的真实货物明细数据
export const MOCK_INITIATE_GOODS_LIST: MovingGoodsCardItem[] = [
  {
    goodsName: "冻货-牛丸-36个月",
    cateName: "冻货",
    typeName: "牛丸",
    concatAttrValue: "36个月",
    totalSelectNumber: 450,
    unit: "公斤",
    repoName: "海霸王仓库",
    showDetail: true,
    activeHouseIndex: 0,
    respHouseDistributionInfoList: [
      {
        houseName: "库房不审核",
        boundCheck: 0,
        selectAmount: 450,
        unit: "公斤",
        respZoneDistributionInfoList: [
          {
            zoneName: "分区冷冻2",
            selectAmount: 450,
            unit: "公斤",
            showContent: true,
            respStockInboundQrcodeVoList: [
              {
                inboundTime: "2026-05-25 09:53:31",
                statusText: "存货中",
                repoName: "海霸王仓库",
                houseName: "库房不审核",
                zoneName: "分区冷冻2",
                detailPlace: "",
                attrOtherValueText: "无: --",
                selectAmount: 450,
                unit: "公斤",
                moveInLocation: "",
                moveInDetail: "",
              },
            ],
          },
        ],
      },
    ],
  },
]

// 移入可用位置选项
export const TARGET_LOCATION_OPTIONS = [
  { id: "LOC-01", name: "海霸王仓库-库房不审核-分区冷冻1" },
  { id: "LOC-02", name: "海霸王仓库-库房不审核-分区冷冻3" },
  { id: "LOC-03", name: "海霸王仓库-恒温库-A区01位" },
  { id: "LOC-04", name: "海霸王仓库-冷藏库-B区05位" },
]

export const MOVING_REPO_TREE = [
  {
    id: "WH-HBW",
    name: "海霸王仓库",
    houses: [
      {
        id: "H-01",
        name: "库房不审核",
        zones: ["分区冷冻1", "分区冷冻2", "分区冷冻3"],
      },
      {
        id: "H-02",
        name: "恒温库",
        zones: ["A区01位", "A区02位"],
      },
    ],
  },
]

export const MOVING_CREATOR_OPTIONS = [
  { id: "U-01", userName: "李海峰", belongOrgName: "张家港沙钢监管运营中心" },
  { id: "U-02", userName: "王强", belongOrgName: "张家港沙钢监管运营中心" },
  { id: "U-03", userName: "周晓华", belongOrgName: "无锡硕放仓储管理部" },
]
