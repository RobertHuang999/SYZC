import { Button } from "@/components/ui/button"

interface OutboundFormSummaryBarProps {
  categoryCount: number
  totalAmount: number
  unit: string
  totalValueWan?: number
  isRelated: boolean
  loading: boolean
  onCancel: () => void
  onSubmit: () => void
}

export function OutboundFormSummaryBar({
  categoryCount,
  totalAmount,
  unit,
  totalValueWan,
  isRelated,
  loading,
  onCancel,
  onSubmit,
}: OutboundFormSummaryBarProps) {
  return (
    <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 border-t border-border bg-card/95 px-6 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur">
      {/* 左侧统计数字 */}
      <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">合计：</span>
          <span className="ml-1">货品品类数：</span>
          <strong className="font-mono text-sm text-foreground">
            {categoryCount}
          </strong>
          <span className="ml-1">种</span>
        </div>

        <span className="text-border">|</span>

        <div>
          <span>出库总数量：</span>
          <strong className="font-mono text-sm text-primary">
            {totalAmount.toLocaleString("zh-CN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </strong>
          <span className="ml-1">{unit}</span>
        </div>

        {isRelated && typeof totalValueWan === "number" && totalValueWan > 0 && (
          <>
            <span className="text-border">|</span>
            <div>
              <span>出库货物估值约：</span>
              <strong className="font-mono text-sm text-foreground">
                {totalValueWan.toLocaleString("zh-CN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
              <span className="ml-1">万元</span>
            </div>
          </>
        )}
      </div>

      {/* 右侧动作按钮 */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={loading}
        >
          取 消
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "正在提交审核..." : "提交审核"}
        </Button>
      </div>
    </div>
  )
}
