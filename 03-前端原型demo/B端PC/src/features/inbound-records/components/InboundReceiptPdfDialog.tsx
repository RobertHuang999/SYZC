import { useMemo } from "react"
import {
  buildInboundReceiptPrintData,
  ReceiptPdfPreviewDialog,
} from "@/shared/receipt-print"
import type { InboundRecord } from "../domain/types"
import type { InboundRecordDetail } from "../lib/detail-utils"

interface InboundReceiptPdfDialogProps {
  open: boolean
  record: InboundRecord | InboundRecordDetail | null
  onClose: () => void
  onSuccess?: (msg: string) => void
}

export function InboundReceiptPdfDialog({
  open,
  record,
  onClose,
  onSuccess,
}: InboundReceiptPdfDialogProps) {
  const printData = useMemo(
    () => (record ? buildInboundReceiptPrintData(record) : null),
    [record]
  )

  return (
    <ReceiptPdfPreviewDialog
      open={open}
      kind="inbound"
      data={printData}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}

