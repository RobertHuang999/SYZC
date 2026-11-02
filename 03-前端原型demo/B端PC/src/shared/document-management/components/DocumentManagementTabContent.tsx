import { DocumentTimelineView } from "./DocumentTimelineView"

interface DocumentManagementTabContentProps {
  orderNo: string
  approvalId?: string
  orderType?: "inbound" | "outbound"
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
