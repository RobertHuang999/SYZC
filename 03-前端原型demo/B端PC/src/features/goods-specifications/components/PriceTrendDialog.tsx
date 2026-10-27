import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { GoodsSku, Subcategory } from "../domain/types"
import { formatSpecSummary } from "../lib/format"
import { PriceTrendChart } from "./PriceTrendChart"

type PriceTrendDialogProps = {
  open: boolean
  sku?: GoodsSku
  subcategory?: Subcategory
  onOpenChange: (open: boolean) => void
}

export function PriceTrendDialog({
  open,
  sku,
  subcategory,
  onOpenChange,
}: PriceTrendDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>价格趋势</DialogTitle>
          {sku ? (
            <p className="text-sm text-muted-foreground">
              {subcategory?.name ?? "—"} · {formatSpecSummary(sku, subcategory)} ·
              计量单位 {sku.measureUnit}
            </p>
          ) : null}
        </DialogHeader>

        {sku ? (
          <PriceTrendChart points={sku.priceTrend} unit={sku.measureUnit} />
        ) : (
          <div className="py-10 text-center text-sm text-muted-foreground">
            未找到货品信息
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
