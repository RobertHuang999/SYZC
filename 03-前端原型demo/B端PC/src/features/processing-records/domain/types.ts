/**
 * 加工管理/加工记录 领域模型与类型定义
 * 依据：
 * - 加工管理主PRD.md
 * - 加工管理字段清单.md (14列台账 + 9项筛选 + 三大折叠卡片 + 四大标签页)
 * - 加工管理业务规则规格.md (R01~R36)
 */

export type ProcessingType =
  | "INVENTORY" // 存货加工
  | "PLEDGE" // 质押加工
  | "MORTGAGE" // 抵押加工
  | "REGULATORY_SERVICE" // 监管服务加工

export type ProcessingStatus =
  | "PENDING_COMPLETION" // 未完成
  | "COMPLETED" // 已完成
  | "VOIDED" // 作废

export type OwnerType = "ENTERPRISE" | "PERSONAL"

/** 动态采集属性定义 */
export interface DynamicCollectAttr {
  key: string
  label: string
  type: "text" | "number" | "select" | "date"
  required?: boolean
  options?: string[]
  unit?: string
  value?: string
}

/** 投入明细 二级货位明细行 */
export interface InputGoodsLocationDetail {
  id: string
  candidateId?: string
  warehouseId: string
  warehouseName: string
  roomZone: string // 如：生鲜仓库-水果库房2-常见水果分区
  specificLocation?: string // 具体位置快照，如 45.69
  inboundTime: string // 入库时间 YYYY-MM-DD HH:mm:ss
  otherInfo?: string // 扩展信息快照，如 "保质期: 6个月"
  barcode: string // 存货条码
  qrCodeUrl?: string
  availableAmount: number // 实时可用量
  planAmount: number // 计划投入数量
  lockedAmount?: number // 锁定数量（完成时依据）
  actualAmount?: number // 实际消耗数量（完成时填入）
  releasedAmount?: number // 自动释放数量（锁定量 - 消耗量）
  unit: string // 计量单位
}

/** 投入明细 一级货品汇总行 */
export interface InputGoodsGroup {
  id: string
  goodsId: string
  goodsName: string // 货物大类-货物品类-规格参数
  specModel?: string // 规格型号
  unit: string
  expanded?: boolean
  details: InputGoodsLocationDetail[]
}

/** 产出明细行 */
export interface OutputGoodsItem {
  id: string
  goodsId: string
  goodsName: string // 货物大类/品类/货品
  specModel: string // 规格型号（如 散装、特级）
  unit: string // 计量单位
  expectedQty: number // 预计产出数量
  actualQty?: number // 实际产出数量
  price?: number | null // 行业参考单价（元），null表示未定价
  expectedAmount?: number | null // 预计产出金额
  actualAmount?: number | null // 实际产出金额
  warehouseLocation?: string // 货物位置（仓库-库房-分区）
  specificLocation?: string // 具体位置（≤20字）
  otherInfo?: string // 其它信息
  collectAttrs?: DynamicCollectAttr[] // 动态采集属性
  barcode?: string // 新存货条码（入库生成）
  barcodeUrl?: string
}

/** 审批流轨迹节点（标签页 3 审核记录） */
export interface ProcessingAuditNode {
  id: string
  nodeName: string // 如：发起申请、风控审核、主管审批
  handlerName: string // 操作人姓名
  handlerOrg?: string // 所属机构
  handleTime: string // 时间
  status: "APPROVED" | "PENDING" | "REJECTED" | "SUBMITTED"
  comment?: string // 审批意见
  taskId?: string // 关联任务ID
}

/** 修改记录（标签页 4） */
export interface ProcessingModifyRecord {
  type: "COMPLETED" | "VOIDED"
  operatorName: string // 操作人
  operatorOrg?: string // 所属机构
  operateTime: string // 操作时间
  voidReason?: string // 作废原因（≤500字）
  lossRatio?: number // 损耗比例（%）
  lossReason?: string // 损耗说明（≤500字）
}

/** 加工记录主台账实体 */
export interface ProcessingRecord {
  id: string // 19位纯数字加工单号
  processingTime: string // 加工日期（精确到秒）
  ownerType: OwnerType // 货主类型
  ownerName: string // 货主名称
  ownerIdentity: string // 统一社会信用代码 或 脱敏手机号
  ownerIdCard?: string // 个人身份证号（脱敏）
  processingType: ProcessingType // 加工类型
  warehouseId: string // 实体仓库ID
  warehouseName: string // 实体仓库名称
  associatedOrderId?: string // 关联单号（抵押单号/质押单号/监管服务单号）
  status: ProcessingStatus // 单据状态
  remark?: string // 备注 / 加工原因（≤140字/≤500字）
  devicePhotos?: Array<{
    deviceId: string
    deviceName: string
    url?: string
    status: "SUCCESS" | "FAILED" | "NO_DEVICE"
  }> // 设备抓拍图
  lossRatio?: number // 加工损耗百分比（如 9%）
  lossReason?: string // 损耗原因
  createByName: string // 制单人姓名
  createOrgName?: string // 制单人所属组织
  createTime: string // 制单时间
  version: number // 乐观锁版本号
  inputGoodsGroups: InputGoodsGroup[] // 投入货品明细
  outputGoodsItems: OutputGoodsItem[] // 产出货品明细
  auditNodes?: ProcessingAuditNode[] // 审批流历史
  modifyRecord?: ProcessingModifyRecord // 修改记录
}

/** 列表筛选条件（严格对齐 9 项筛选） */
export interface ProcessingRecordFilters {
  id?: string // 加工单号
  processingTimeRange?: [string, string] // 加工日期范围
  ownerKeyword?: string // 货主名称/标识复合搜索
  processingType?: string // 加工类型（全部/特定类型）
  warehouseName?: string // 仓库名称
  goodsKeyword?: string // 货品名称
  status?: string // 单据状态
  createBy?: string // 制单人
  createTimeRange?: [string, string] // 制单时间范围
}

export type ProcessingRecordRowAction = "detail" | "complete" | "void" | "export"

