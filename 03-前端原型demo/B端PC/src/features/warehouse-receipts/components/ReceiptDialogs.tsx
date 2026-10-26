import { useMemo, useState } from "react"
import { AlertTriangleIcon, FileTextIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { WarehouseReceipt } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { buildReceiptQrCells } from "@prototype/shared/warehouse-receipts/warehouse-receipt-qr"

/** 确定性二维码占位图：仅用于原型观感，不承载真实跳转 */
export function QrPlaceholder({
  value,
  size = 176,
  className,
}: {
  value: string
  size?: number
  className?: string
}) {
  const cells = useMemo(() => buildReceiptQrCells(value), [value])

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md border bg-white p-2",
        className,
      )}
    >
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

export function ReceiptQrGuideDialog({
  open,
  onOpenChange,
  title,
  pathHint,
  description,
  receiptCode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  pathHint: string
  description?: string
  receiptCode?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-center">{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <QrPlaceholder value={`SYZC|${receiptCode ?? "receipt"}|${title}`} size={180} />
          <p className="text-sm font-medium text-foreground">
            请使用移动端或监管 PDA 扫描上方二维码
          </p>
          <div className="w-full rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            <p>
              该操作涉及仓单货权处置，须由当事人在移动端完成活体人脸识别与电子签署，PC
              端不直接完成业务终审。
            </p>
            <p className="mt-1.5 text-foreground">
              移动端路径：<span className="font-medium">{pathHint}</span>
            </p>
            {receiptCode ? (
              <p className="mt-1">仓单编号：{receiptCode}</p>
            ) : null}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            我知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export type ReceiptDownloadKind = "original" | "change"

export function ReceiptDownloadDialog({
  open,
  onOpenChange,
  receipt,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  receipt: WarehouseReceipt | null
  onConfirm: (kind: ReceiptDownloadKind) => void
}) {
  const [kind, setKind] = useState<ReceiptDownloadKind>("original")

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setKind("original")
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>下载电子仓单存证</DialogTitle>
          <DialogDescription>
            仓单编号 {receipt?.code ?? "--"}；下载文件内嵌电子签章水印与 SHA-256 防伪存证哈希。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {(
            [
              {
                value: "original" as const,
                title: "电子仓单正本（PDF）",
                desc: "含存货人、监管方电子签章与中仓登备案信息",
              },
              {
                value: "change" as const,
                title: "仓单变更确认单（PDF）",
                desc: "含最近一次补货、出库、移库或移除的变更快照",
              },
            ] satisfies Array<{
              value: ReceiptDownloadKind
              title: string
              desc: string
            }>
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setKind(option.value)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                kind === option.value
                  ? "border-blue-300 bg-blue-50/60"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                  kind === option.value
                    ? "border-blue-600 bg-blue-600"
                    : "border-muted-foreground/40",
                )}
              >
                {kind === option.value ? (
                  <span className="size-1.5 rounded-full bg-white" />
                ) : null}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <FileTextIcon className="size-4 text-muted-foreground" />
                  {option.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {option.desc}
                </span>
              </span>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type="button" onClick={() => onConfirm(kind)}>
            确认下载
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ReceiptNoticeDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "我知道了",
  tone = "warning",
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  tone?: "warning" | "danger" | "info"
  onConfirm?: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangleIcon
              className={cn(
                "size-5",
                tone === "danger"
                  ? "text-rose-600"
                  : tone === "warning"
                    ? "text-amber-500"
                    : "text-blue-600",
              )}
            />
            {title}
          </DialogTitle>
          <DialogDescription className="whitespace-pre-line leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              onConfirm?.()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
