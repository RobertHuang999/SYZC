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

export const DOC_NATURE_LABELS: Record<DocNature, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  BASE: { label: "原始流程归档", variant: "secondary" },
  ADDITION: { label: "事后补充资料", variant: "default" },
}

export interface DocumentItem {
  id: string
  orderNo: string
  approvalId: string
  orderType: "inbound" | "outbound"
  flowType: string // "1": 申请, "2": 库管审核, "9528": 基础资料, "9527": 补充资料
  flowNodeTitle: string
  nature: DocNature
  category: DocCategory
  name: string
  version: string // "V1.0", "V1.1"
  fileType: "pdf" | "jpg" | "png" | "zip" | "docx"
  fileSize: string
  createTime: string
  uploader: string
  uploaderOrg: string
  hash: string
  description?: string
  originalDocId?: string
  originalDocName?: string
  originalDocVersion?: string
  statusText?: string
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
  expanded: boolean
}
