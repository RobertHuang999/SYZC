import { useRef, useState } from "react"
import { Download, FileText, Printer, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { useIterationHighlight } from "@/shared/components/IterationHighlight"
import { cn } from "@/lib/utils"
import {
  INBOUND_RECEIPT_SPEC_NOTE,
  OUTBOUND_RECEIPT_SPEC_NOTE,
  RECEIPT_PAPER_OPTIONS,
  RECEIPT_PRINT_USER_HINTS,
  type ReceiptPaperSize,
} from "./receipt-print-ui-labels"
import {
  exportReceiptSheetToPdf,
  type InboundReceiptPrintData,
  type OutboundReceiptPrintData,
} from "./receipt-print-utils"
import {
  RECEIPT_PAPER_PREVIEW_WIDTH,
  ReceiptPaperSheet,
} from "./receipt-print-sheets"

type ReceiptPdfPreviewDialogProps =
  | {
      open: boolean
      kind: "inbound"
      data: InboundReceiptPrintData | null
      onClose: () => void
      onSuccess?: (message: string) => void
    }
  | {
      open: boolean
      kind: "outbound"
      data: OutboundReceiptPrintData | null
      onClose: () => void
      onSuccess?: (message: string) => void
    }

export function ReceiptPdfPreviewDialog(props: ReceiptPdfPreviewDialogProps) {
  const { open, kind, data, onClose, onSuccess } = props
  const { highlightEnabled } = useIterationHighlight()
  const [paperSize, setPaperSize] = useState<ReceiptPaperSize>("a4")
  const [specOpen, setSpecOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  if (!data) return null

  const activeOption =
    RECEIPT_PAPER_OPTIONS.find((o) => o.value === paperSize) ?? RECEIPT_PAPER_OPTIONS[0]

  const docTypeLabel = kind === "inbound" ? "入库单" : "出库单"
  const paperFileLabel =
    paperSize === "a4" ? "A4纵向完整版" : paperSize === "a5" ? "A5横向便携版" : "针式连续纸二等分"
  const fileName = `${docTypeLabel}_${data.orderNo}_${paperFileLabel}.pdf`

  const handleDownloadPdf = () => {
    setDownloading(true)
    exportReceiptSheetToPdf(sheetRef.current, fileName, paperSize)
    window.setTimeout(() => {
      setDownloading(false)
      onSuccess?.(
        `已生成并导出【${activeOption.label.split(" ")[0]}】标准矢量凭证：${fileName}`
      )
      onClose()
    }, 350)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[95vh] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[960px]"
      >
        {/* 顶部紧凑标题栏 */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-slate-50/90 px-5 py-2.5 dark:bg-slate-900">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileText className="size-4" />
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 min-w-0">
              <DialogTitle className="text-sm font-semibold text-foreground">
                单据凭证预览（PDF）
              </DialogTitle>
              <span className="text-xs text-muted-foreground">
                {docTypeLabel}号：{data.orderNo} · 货主：{data.ownerName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭预览弹窗"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 纸张规格紧凑单行切换栏 */}
        <div className="shrink-0 space-y-1.5 border-b border-border bg-background px-5 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-foreground shrink-0">
                [选择纸张规格]
              </span>
              <div
                role="radiogroup"
                aria-label="选择纸张规格"
                className="inline-flex flex-wrap items-center gap-1.5"
              >
                {RECEIPT_PAPER_OPTIONS.map((option) => {
                  const checked = paperSize === option.value
                  return (
                    <label
                      key={option.value}
                      title={option.subLabel}
                      onClick={() => setPaperSize(option.value)}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs transition-all select-none",
                        checked
                          ? "border-primary bg-primary/[0.08] font-semibold text-primary shadow-2xs"
                          : "border-border bg-card font-medium text-foreground hover:border-primary/40 hover:bg-muted/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="receipt-paper-size"
                        value={option.value}
                        checked={checked}
                        onChange={() => setPaperSize(option.value)}
                        className="size-3 accent-primary"
                      />
                      <span>{option.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-[11px] text-muted-foreground lg:inline">
                尺寸：{activeOption.dimensionsLabel}
              </span>
              {highlightEnabled && (
                <button
                  type="button"
                  onClick={() => setSpecOpen((v) => !v)}
                  className="cursor-pointer rounded border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-800 hover:bg-amber-500/20 dark:text-amber-200"
                >
                  {specOpen ? "收起 6.4 规格说明" : "查看 6.4 规格说明"}
                </button>
              )}
            </div>
          </div>

          {/* 4.1.3 上线用户文案（紧凑单行） + 按需展开的原型规格对照 */}
          <ProductFieldHint className="mt-0 text-[11px] leading-snug">
            {RECEIPT_PRINT_USER_HINTS[paperSize]}
          </ProductFieldHint>
          {highlightEnabled && specOpen && (
            <PrototypeSpecCallout badge="6.4 新增 · 多介质单据导出与打印规格对照（非上线文案）">
              {kind === "inbound" ? INBOUND_RECEIPT_SPEC_NOTE : OUTBOUND_RECEIPT_SPEC_NOTE}
            </PrototypeSpecCallout>
          )}
        </div>

        {/* 单据预览区域（最大化纵向可视空间） */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-neutral-200/75 px-5 py-3.5 dark:bg-slate-950/70">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              [单据预览区域 - 当前模式：{activeOption.label.split("（")[0]}]
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px]">
              <Printer className="size-3.5" />
              纯黑实线、线宽 1 像素 · 无灰阶防断针
            </span>
          </div>

          <div className="flex justify-center">
            <div
              ref={sheetRef}
              className={cn(
                "bg-white text-black shadow-[0_6px_24px_rgba(0,0,0,0.14)] transition-all duration-200",
                paperSize === "a4" && "w-[760px] p-6",
                paperSize === "a5" && "w-[780px] p-5",
                paperSize === "continuous" && "w-[830px] p-3"
              )}
              style={{
                width: RECEIPT_PAPER_PREVIEW_WIDTH[paperSize],
                fontFamily:
                  '"PingFang SC", -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif',
              }}
            >
              {kind === "inbound" ? (
                <ReceiptPaperSheet kind="inbound" paperSize={paperSize} data={data} />
              ) : (
                <ReceiptPaperSheet kind="outbound" paperSize={paperSize} data={data} />
              )}
            </div>
          </div>
        </div>

        {/* 底部操作按钮区 */}
        <div className="flex shrink-0 items-center justify-between border-t border-border bg-background px-5 py-2.5">
          <span className="text-xs text-muted-foreground">
            导出文件：{fileName}（支持另存为标准矢量文件或直连打印机输出）
          </span>
          <div className="flex items-center gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="gap-1.5 whitespace-nowrap"
            >
              <Download className="size-4" />
              {downloading ? "正在生成文件…" : "下载单据文件（PDF）"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

