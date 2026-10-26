import type { ReceiptStatus } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  RECEIPT_STATUS_LABEL,
  RECEIPT_STATUS_TONE,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { cn } from "@/lib/utils"

export function ReceiptStatusPill({
  status,
  className,
}: {
  status: ReceiptStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium",
        RECEIPT_STATUS_TONE[status].h5,
        className,
      )}
    >
      {RECEIPT_STATUS_LABEL[status]}
    </span>
  )
}
