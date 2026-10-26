import { useMemo } from "react"
import { buildReceiptQrCells } from "@prototype/shared/warehouse-receipts/warehouse-receipt-qr"
import { cn } from "@/lib/utils"

/** 确定性二维码占位图：仅用于原型观感，不承载真实跳转 */
export function ReceiptQrBox({
  value,
  size = 150,
  className,
}: {
  value: string
  size?: number
  className?: string
}) {
  const cells = useMemo(() => buildReceiptQrCells(value), [value])

  return (
    <div className={cn("inline-flex rounded-lg border bg-white p-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 21 21"
        role="img"
        aria-label={`二维码 ${value}`}
        shapeRendering="crispEdges"
      >
        <rect width="21" height="21" fill="#fff" />
        {cells.map((row, y) =>
          row.map((filled, x) =>
            filled ? (
              <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#1d2129" />
            ) : null,
          ),
        )}
      </svg>
    </div>
  )
}
