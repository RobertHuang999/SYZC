import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { GoodsLineForm, InboundFormState } from "../domain/form-types"
import { InboundGoodsLineCard } from "./InboundGoodsLineCard"

type InboundGoodsSectionProps = {
  form: InboundFormState
  expanded: boolean
  highlightGoodsId?: string | null
  onToggle: () => void
  onAddGoods: () => void
  onUpdateLine: (id: string, line: GoodsLineForm) => void
  onRemoveLine: (id: string) => void
}

export function InboundGoodsSection({
  form,
  expanded,
  highlightGoodsId,
  onToggle,
  onAddGoods,
  onUpdateLine,
  onRemoveLine,
}: InboundGoodsSectionProps) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium"
          onClick={onToggle}
        >
          {expanded ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
          货品明细
        </button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="bg-primary/10 text-primary hover:bg-primary/15"
          onClick={onAddGoods}
        >
          <PlusIcon className="size-4" />
          添加货品
        </Button>
      </div>
      {expanded ? (
        <CardContent className="space-y-4 pt-4">
          {form.goodsLines.length === 0 ? null : (
            <div className="space-y-4">
              {form.goodsLines.map((line, index) => (
                <div
                  key={line.id}
                  className={cn(
                    highlightGoodsId === line.id &&
                      "rounded-lg ring-2 ring-destructive/60 ring-offset-2"
                  )}
                >
                  <InboundGoodsLineCard
                    index={index}
                    line={line}
                    form={form}
                    showMeasureError={highlightGoodsId === line.id}
                    onChange={(next) => onUpdateLine(line.id, next)}
                    onRemove={() => onRemoveLine(line.id)}
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
