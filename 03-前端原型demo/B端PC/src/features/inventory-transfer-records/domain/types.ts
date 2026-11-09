export type OwnerType = "ENTERPRISE" | "PERSONAL"

export type TransferStatus = "APPROVED"

/** 二级库存储位明细（折叠树形二级项） */
export interface TransferStockLocationDetail {
  id: string
  locationName: string // 格式：仓库-库房-分区（如“示例仓库-水果库房-常见水果分区”）
  specificLocation: string // 具体位置/货架/垛位编号，无值展示“——”
  inboundTime: string // 入库时间 YYYY-MM-DD HH:mm:ss
  otherInfo?: string // 原库存扩展属性（如“保质期: 8个月”，无值展示“—”）
  barcode: string // 存货条码
  barcodeQrUrl?: string // 存货二维码图形链接
  status: string // 在库状态，固定为“存货中”
  amount: number // 转让数量
  unit: string // 计量单位
}

/** 一级货品主行（按货品规格汇总） */
export interface TransferGoodsItem {
  id: string
  goodsName: string // 格式：大类-品类-规格，如“水果-苹果-新疆-特级”
  cateName?: string // 大类
  typeName?: string // 品类
  specName?: string // 规格
  warehouseName: string // 实体监管仓库全称
  warehouseId?: string
  amount: number // 该货品本次转让总数量
  unit: string // 计量单位
  locations: TransferStockLocationDetail[] // 二级储位明细
}

/** 货主主体实体（转让人 / 接收人） */
export interface TransferOwnerInfo {
  ownerName: string // 主体名称（公司全称 / 个人真实姓名）
  ownerType: OwnerType // 主体性质
  ownerIdentity: string // 主体标识（统一社会信用代码 / 脱敏手机号）
  idCardNo?: string // 个人身份证号（脱敏）
}

/** 审批流转节点记录（详情页【审核记录】Tab） */
export interface TransferAuditLog {
  id: string
  flowName?: string // 流程名称（如“大宗商品货物在仓转让审核”）
  nodeName: string // 节点名称（如“监管主管审核”、“资方风控审核”）
  operatorName: string // 处理人姓名
  operatorOrg: string // 所属机构
  action: "SUBMIT" | "APPROVE" | "REJECT" | "REVOKE" // 操作行为
  actionName: string // 动作展示名（如“提交申请”、“审批通过”）
  time: string // 处理时间
  comment?: string // 处理意见
}

/** 转让记录主实体（归档台账） */
export interface TransferRecord {
  id: string // 19位全局唯一转让单号（如 2115716323004960770）
  assignTime: string // 转让时间 YYYY-MM-DD HH:mm:ss（列表第一行日期，第二行时间）
  sourceOwner: TransferOwnerInfo // 转让人（出让原货主）
  targetOwner: TransferOwnerInfo // 接收人（受让新货主）
  warehouseName: string // 实体监管仓库全称
  warehouseId?: string
  amount: number // 转让总数量
  unit: string // 计量单位
  goodsSummaryText: string // 货物名称简要汇总
  goodsDisplayList: Array<{
    name: string
    amount: number
    unit: string
  }> // 用于列表单元格多行展示（超出2行提供更多 Popover）
  goodsList: TransferGoodsItem[] // 完整的树形货品明细
  assignReason: string // 0/500 字必填转让原因说明（固化司法存证 R04）
  createByName: string // 制单人姓名
  createOrgName: string // 制单人所属机构
  createTime: string // 制单时间 YYYY-MM-DD HH:mm:ss
  status: TransferStatus // 单据状态，固定为“已通过”
  auditLogs: TransferAuditLog[] // 审核记录
}

/** 列表筛选条件（共 7 项，无转让类型，无状态，R01） */
export interface TransferRecordFilters {
  id: string // 转让单号
  assignStartDate: string // 转让开始日期
  assignEndDate: string // 转让结束日期
  keyword: string // 货主名称/标识（匹配出让人）
  warehouseId: string // 仓库名称
  goodsName: string // 货品名称
  createBy: string // 制单人
  createStartDate: string // 制单开始时间
  createEndDate: string // 制单结束时间
}

/** 列表行操作（仅【查看详情】） */
export type TransferRecordRowAction = "viewDetail"
