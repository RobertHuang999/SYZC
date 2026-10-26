import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ReceiptStatus } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  RECEIPT_STATUS_LABEL,
  RECEIPT_STATUS_TONE,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"

export function ReceiptStatusBadge({
  status,
  className,
}: {
  status: ReceiptStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn("px-2 py-0.5 text-xs font-normal", RECEIPT_STATUS_TONE[status].badge, className)}
    >
      {RECEIPT_STATUS_LABEL[status]}
    </Badge>
  )
}
