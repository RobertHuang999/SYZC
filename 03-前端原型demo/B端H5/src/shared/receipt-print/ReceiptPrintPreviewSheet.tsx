import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { Download } from "lucide-react"
import { NavBar } from "@/components/layout/NavBar"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  INBOUND_RECEIPT_SPEC_NOTE,
  OUTBOUND_RECEIPT_SPEC_NOTE,
  RECEIPT_PAPER_OPTIONS,
  RECEIPT_PRINT_USER_HINTS,
  type ReceiptPaperSize,
} from "@prototype/B端PC/src/shared/receipt-print/receipt-print-ui-labels"
import {
  RECEIPT_PAPER_PREVIEW_WIDTH,
  ReceiptPaperSheet,
} from "@prototype/B端PC/src/shared/receipt-print/receipt-print-sheets"
import type { H5ReceiptPrintData } from "./build-mobile-receipt-print"

type Props = {
  open: boolean
  data: H5ReceiptPrintData | null
  onClose: () => void
  onSuccess?: (message: string) => void
}

const PAPER_PADDING: Record<ReceiptPaperSize, string> = {
  a4: "p-6",
  a5: "p-5",
  continuous: "p-3",
}

function ReceiptZoomViewport({
  paperWidth,
  paperClassName,
  children,
}: {
  paperWidth: number
  paperClassName: string
  children: ReactNode
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null)
  const scaleRef = useRef(0.48)
  const [scale, setScale] = useState(0.48)
  const [paperHeight, setPaperHeight] = useState(960)

  scaleRef.current = scale

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const fit = Math.min(1, (viewport.clientWidth - 16) / paperWidth)
    const next = Math.max(0.28, Number(fit.toFixed(3)))
    setScale(next)
    scaleRef.current = next
  }, [paperWidth])

  useLayoutEffect(() => {
    setPaperHeight(paperRef.current?.offsetHeight ?? 960)
  }, [paperWidth, children])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) return
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      pinchRef.current = { dist: Math.hypot(dx, dy), scale: scaleRef.current }
    }

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || !pinchRef.current) return
      event.preventDefault()
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const next = Math.min(
        2.4,
        Math.max(0.28, pinchRef.current.scale * (dist / Math.max(pinchRef.current.dist, 1)))
      )
      scaleRef.current = next
      setScale(next)
    }

    const onTouchEnd = () => {
      pinchRef.current = null
    }

    viewport.addEventListener("touchstart", onTouchStart, { passive: true })
    viewport.addEventListener("touchmove", onTouchMove, { passive: false })
    viewport.addEventListener("touchend", onTouchEnd)
    viewport.addEventListener("touchcancel", onTouchEnd)
    return () => {
      viewport.removeEventListener("touchstart", onTouchStart)
      viewport.removeEventListener("touchmove", onTouchMove)
      viewport.removeEventListener("touchend", onTouchEnd)
      viewport.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [])

  return (
    <div
      ref={viewportRef}
      className="relative min-h-0 flex-1 overflow-auto bg-[#d4d4d4] overscroll-contain"
    >
      <div
        className="p-2"
        style={{
          width: paperWidth * scale + 16,
          height: paperHeight * scale + 16,
        }}
      >
        <div
          ref={paperRef}
          className={`bg-white text-black shadow-[0_6px_24px_rgba(0,0,0,0.14)] ${paperClassName}`}
          style={{
            width: paperWidth,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            fontFamily:
              '"PingFang SC", -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif',
          }}
        >
          {children}
        </div>
      </div>
      <div className="pointer-events-none sticky bottom-2 z-10 flex justify-center">
        <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] text-white">
          固定预览区 · 双指缩放查看
        </span>
      </div>
    </div>
  )
}

export function ReceiptPrintPreviewSheet({ open, data, onClose, onSuccess }: Props) {
  const [paperSize, setPaperSize] = useState<ReceiptPaperSize>("a4")
  const [specOpen, setSpecOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  if (!open || !data?.data) return null

  const specNote = data.kind === "inbound" ? INBOUND_RECEIPT_SPEC_NOTE : OUTBOUND_RECEIPT_SPEC_NOTE
  const docTypeLabel = data.kind === "inbound" ? "入库单" : "出库单"
  const paperFileLabel =
    paperSize === "a4" ? "A4纵向完整版" : paperSize === "a5" ? "A5横向便携版" : "针式连续纸二等分"
  const fileName = `${docTypeLabel}_${data.data.orderNo}_${paperFileLabel}.pdf`
  const paperWidth = RECEIPT_PAPER_PREVIEW_WIDTH[paperSize]

  return (
    <div className="absolute inset-0 z-[70] flex flex-col bg-[#edf2f8]">
      <NavBar title="单据预览" onBack={onClose} />

      <div className="shrink-0 space-y-1.5 border-b border-[#232D39]/10 bg-white px-3 py-2">
        <p className="truncate text-[11px] text-[#232D39]/55">
          {docTypeLabel}号：{data.data.orderNo} · 货主：{data.data.ownerName}
        </p>
        <p className="text-xs font-medium text-[#232D39]">选择纸张规格</p>
        <div className="flex flex-wrap gap-1.5">
          {RECEIPT_PAPER_OPTIONS.map((option) => {
            const checked = paperSize === option.value
            return (
              <label
                key={option.value}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] ${
                  checked
                    ? "border-blue-600 bg-blue-50 font-semibold text-blue-600"
                    : "border-[#232D39]/15 text-[#232D39]"
                }`}
              >
                <input
                  type="radio"
                  name="h5-receipt-paper"
                  className="size-3"
                  checked={checked}
                  onChange={() => setPaperSize(option.value)}
                />
                {option.label.split("（")[0]}
              </label>
            )
          })}
        </div>
        <ProductFieldHint className="mt-0 text-[11px] leading-snug">
          {RECEIPT_PRINT_USER_HINTS[paperSize]}
        </ProductFieldHint>
        <button
          type="button"
          className="text-[11px] font-medium text-amber-800"
          onClick={() => setSpecOpen((value) => !value)}
        >
          {specOpen ? "收起规格说明" : "查看规格说明"}
        </button>
        {specOpen ? <PrototypeSpecCallout>{specNote}</PrototypeSpecCallout> : null}
      </div>

      <ReceiptZoomViewport paperWidth={paperWidth} paperClassName={PAPER_PADDING[paperSize]}>
        {data.kind === "inbound" ? (
          <ReceiptPaperSheet kind="inbound" paperSize={paperSize} data={data.data} />
        ) : (
          <ReceiptPaperSheet kind="outbound" paperSize={paperSize} data={data.data} />
        )}
      </ReceiptZoomViewport>

      <div className="flex shrink-0 gap-2 border-t border-[#232D39]/10 bg-white px-3 py-2.5 pb-[calc(10px+env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-[#232D39]"
          onClick={onClose}
        >
          取消
        </button>
        <button
          type="button"
          disabled={downloading}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          onClick={() => {
            setDownloading(true)
            window.setTimeout(() => {
              setDownloading(false)
              onSuccess?.(`已生成并导出标准矢量凭证：${fileName}`)
              onClose()
            }, 350)
          }}
        >
          <Download className="size-3.5" />
          {downloading ? "正在导出…" : "下载单据文件"}
        </button>
      </div>
    </div>
  )
}
