import { useMemo } from "react"
import {
  buildOutboundReceiptPrintData,
  ReceiptPdfPreviewDialog,
} from "@/shared/receipt-print"
import type { OutboundRecord } from "../domain/types"

interface OutboundPdfDialogProps {
  open: boolean
  record: OutboundRecord | null
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function OutboundPdfDialog({
  open,
  record,
  onClose,
  onSuccess,
}: OutboundPdfDialogProps) {
  const printData = useMemo(
    () => (record ? buildOutboundReceiptPrintData(record) : null),
    [record]
  )

  return (
    <ReceiptPdfPreviewDialog
      open={open}
      kind="outbound"
      data={printData}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}
