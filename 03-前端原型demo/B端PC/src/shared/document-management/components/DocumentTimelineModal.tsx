import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DocumentTimelineView } from "./DocumentTimelineView"

interface DocumentTimelineModalProps {
  open: boolean
  orderNo: string
  approvalId?: string
  orderType?: "inbound" | "outbound"
  onClose: () => void
}

export function DocumentTimelineModal({
  open,
  orderNo,
  approvalId = "SP202605280001",
  orderType = "inbound",
  onClose,
}: DocumentTimelineModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-semibold text-slate-800">
            资料管理
          </DialogTitle>
        </DialogHeader>

        <DocumentTimelineView
          orderNo={orderNo}
          approvalId={approvalId}
          orderType={orderType}
        />
      </DialogContent>
    </Dialog>
  )
}
