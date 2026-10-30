import { DocumentTimelineView } from "./DocumentTimelineView"

interface DocumentManagementTabContentProps {
  orderNo: string
  approvalId?: string
  orderType?: "inbound" | "outbound"
  /** 质押/抵押/仓单等金融类单据禁止事后补资料（R33 / O18） */
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
      {!allowSupplement ? (
        <p className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          本单为金融货权类单据，按【出入库事后资料补充与审批穿透】(R33) /【出库流程后补充资料与审批穿透】(O18) 不允许在这里后补资料；确需调整权属资料，请走融资监管下的抵质押资料管理追加流程。此处仅供查阅已归档资料。
        </p>
      ) : null}
      <DocumentTimelineView
        orderNo={orderNo}
        approvalId={approvalId}
        orderType={orderType}
        allowSupplement={allowSupplement}
      />
    </div>
  )
}
