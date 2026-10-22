export type DocNature = "ADDITION" | "BASE"

export type DocCategory =
  | "INSPECTION"
  | "WEIGHT"
  | "SETTLEMENT"
  | "OWNERSHIP"
  | "ONSITE"
  | "COMPLIANCE"
  | "OTHER"

export const DOC_CATEGORY_LABELS: Record<DocCategory, string> = {
  INSPECTION: "检验证明 (质检/商检/化验)",
  WEIGHT: "衡重凭证 (地磅/复磅/码单)",
  SETTLEMENT: "结算凭证 (发票/对账/费单)",
  OWNERSHIP: "权属回执 (货转协议/交接单)",
  ONSITE: "现场单据 (随车单/实物照)",
  COMPLIANCE: "合规说明 (情况说明/公章函)",
  OTHER: "其他杂项证明",
}

export interface DocumentItem {
  id: string
  orderNo: string
  approvalId: string
  orderType: "inbound" | "outbound"
  /** "1" 申请阶段 / "2" 核验阶段 / "3" 终审阶段 / "9527" 事后综合补充 */
  flowType: string
  flowNodeTitle: string
  nature: DocNature
  category: DocCategory
  name: string
  version: string
  fileType: "pdf" | "jpg" | "png" | "zip" | "docx"
  fileSize: string
  createTime: string
  uploader: string
  uploaderOrg: string
  hash: string
  description?: string
  statusText?: string
  /** 图片类资料的预览地址（原型阶段用示例图） */
  previewImages?: string[]
}

export interface TimelineStep {
  stepIndex: number
  title: string
  flowType: string
  statusText: string
  statusType: "success" | "warning" | "info" | "danger"
  time: string
  operator: string
  org: string
  documents: DocumentItem[]
}

/** 图片类资料走图片预览，其余走文档预览 */
export function isImageDocument(doc: DocumentItem): boolean {
  return doc.fileType === "jpg" || doc.fileType === "png"
}
