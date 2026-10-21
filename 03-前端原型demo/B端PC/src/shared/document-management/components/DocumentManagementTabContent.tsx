import { DocumentTimelineView } from "./DocumentTimelineView"

interface DocumentManagementTabContentProps {
  orderNo: string
  approvalId?: string
  orderType?: "inbound" | "outbound"
}

export function DocumentManagementTabContent({
  orderNo,
  approvalId = "SP202605280001",
  orderType = "inbound",
}: DocumentManagementTabContentProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <DocumentTimelineView
        orderNo={orderNo}
        approvalId={approvalId}
        orderType={orderType}
      />
    </div>
  )
}
