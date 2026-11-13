/** 监管管理三大业务单据标签页 */
export type SupervisionOrderTabKey = "MORTGAGE" | "PLEDGE" | "SERVICE"

/** 存续期业务状态：随标签页动态展示为抵押/质押/监管口径 */
export type SupervisionOrderStatus =
  | "抵押中"
  | "解抵押"
  | "质押中"
  | "解质押"
  | "监管中"
  | "解监管"

/** 单条在押货物摘要（品类-品名-规格-数量-单位已在 name 内拼好） */
export interface SupervisionGoodsItem {
  name: string
}

/** 详情页货品批次明细（父表展开后的子表行） */
export interface SupervisionGoodsDetail {
  id: string
  name: string
  /** 仓库-库房-分区 */
  location: string
  /** 具体货位/垛位 */
  spot: string
  inboundAt: string
  batchInfo: string
  barcode: string
  qty: number
  unit: string
  unitPriceYuan: number
  totalValueWan: number
}

/** 监管管理订单台账行 */
export interface SupervisionOrderItem {
  id: string
  tab: SupervisionOrderTabKey
  /** 19 位业务单号（抵押单号 / 质押单号 / 监管单号） */
  orderNo: string
  ownerType: "企业" | "个人"
  ownerName: string
  /** 列表展示的货主标识：企业为统一社会信用代码，个人为脱敏手机号 */
  ownerIdentity: string
  /** 个人手机号明文，供眼睛图标切换明密文 */
  ownerIdentityFull?: string
  goodsList: SupervisionGoodsItem[]
  /** 业务办理终审确权生效时间 */
  pledgeTime: string
  status: SupervisionOrderStatus
  /** 业务方式：固定/浮动抵押、静态/流动质押、固定/浮动服务 */
  businessMode: string
  loanAmount?: number
  loanPeriods?: number
  loanBalance?: number
  safetyLine?: number
  /** 行业参考价总市值（万元），未定价时为空 */
  industryPrice?: number
  /** 货物评估价值总市值（万元） */
  appraisedValue?: number
  processName: string
  relatedOrgs: string[]
  hasRisk: boolean
  /** 在途审批任务名称，存在时变更类操作置灰 */
  lockedTask?: string
  /** 存在未定价货品，行业参考价/评估价值旁给警示 */
  unpriced?: boolean
  /** 操作记录（倒序） */
  logs: SupervisionOrderLogItem[]
  /** 详情：发起人（姓名（所属机构）） */
  initiator?: string
  /** 详情：主债权合同编号，未签署为空 */
  contractNo?: string
  /** 详情：权人主体类型（恒定为企业） */
  holderType?: string
  /** 详情：权人 / 质权人名称 */
  holderName?: string
  /** 详情：权人 / 质权人证件号 */
  holderCertNo?: string
  /** 详情：授信金额（万元） */
  creditAmount?: number
  /** 详情：授信期数 */
  creditPeriods?: number
  /** 详情：业务备注 */
  remark?: string
  /** 详情：货品批次明细 */
  goodsDetails?: SupervisionGoodsDetail[]
}

export interface SupervisionOrderLogItem {
  id: string
  action: string
  operatorName: string
  time: string
  detail: string
  notes?: string
}

/** 组合筛选条件 */
export interface SupervisionOrderFilters {
  orderNo: string
  ownerKeyword: string
  status: string
  mode: string
  risk: string
  goodsName: string
  org: string
  dateStart: string
  dateEnd: string
}
