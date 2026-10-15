import { ChevronDownIcon, ChevronUpIcon, PlusIcon, PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { GoodsLineForm, InboundFormState } from "../domain/form-types"
import { InboundGoodsLineCard } from "./InboundGoodsLineCard"

type InboundGoodsSectionProps = {
  form: InboundFormState
  variant?: "formal" | "staging"
  expanded: boolean
  highlightGoodsId?: string | null
  onToggle: () => void
  onAddGoods: () => void
  onUpdateLine: (id: string, line: GoodsLineForm) => void
  onRemoveLine: (id: string) => void
  onPreviewImage?: (url: string) => void
}

export function InboundGoodsSection({
  form,
  variant = "formal",
  expanded,
  highlightGoodsId,
  onToggle,
  onAddGoods,
  onUpdateLine,
  onRemoveLine,
  onPreviewImage,
}: InboundGoodsSectionProps) {
  return (
    <Card className="shadow-xs">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          onClick={onToggle}
        >
          {expanded ? (
            <ChevronUpIcon className="size-4 text-primary" />
          ) : (
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          )}
          货品明细 ({form.goodsLines.length} 项)
        </button>
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          onClick={onAddGoods}
        >
          <PlusIcon className="size-4" />
          添加货品
        </Button>
      </div>

      {expanded ? (
        <CardContent className="space-y-4 pt-5 pb-6">
          {form.goodsLines.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <PackageOpen className="size-10 text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-foreground">暂无货品明细</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                请点击「添加货品」，从货品管理主档选择大类、品类与规格，并分配堆放货位
              </p>
              <Button type="button" variant="outline" size="sm" onClick={onAddGoods}>
                <PlusIcon className="mr-1 size-3.5" />
                立即添加货品
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {form.goodsLines.map((line, index) => (
                <div
                  key={line.id}
                  className={cn(
                    "transition-all",
                    highlightGoodsId === line.id &&
                      "rounded-lg ring-2 ring-destructive ring-offset-2"
                  )}
                >
                  <InboundGoodsLineCard
                    index={index}
                    line={line}
                    form={form}
                    variant={variant}
                    showMeasureError={highlightGoodsId === line.id}
                    onChange={(next) => onUpdateLine(line.id, next)}
                    onRemove={() => onRemoveLine(line.id)}
                    onPreviewImage={onPreviewImage}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      ) : null}
    </Card>
  )
}
