import { DocumentTimelineView } from "./DocumentTimelineView"
import type { DocumentItem } from "../types"

interface DocumentManagementTabContentProps {
  orderNo: string
  approvalId?: string
  orderType?: DocumentItem["orderType"]
  allowSupplement?: boolean
}

export function DocumentManagementTabContent({
  orderNo,
  approvalId = "SP202605280001",
  orderType = "inbound",
  allowSupplement = true,
}: DocumentManagementTabContentProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <DocumentTimelineView
        orderNo={orderNo}
        approvalId={approvalId}
        orderType={orderType}
        allowSupplement={allowSupplement}
      />
    </div>
  )
}
