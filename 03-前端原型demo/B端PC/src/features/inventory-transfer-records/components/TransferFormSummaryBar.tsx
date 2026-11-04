import { Button } from "@/components/ui/button"

interface Props {
  categoryCount: number
  totalQuantity: number
  unit: string
  submitting: boolean
  onCancel: () => void
  onSubmit: () => void
}

export function TransferFormSummaryBar({
  categoryCount,
  totalQuantity,
  unit,
  submitting,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur border-t border-border p-4 shadow-lg flex items-center justify-between">
      {/* 左侧试算统计 */}
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">调拨品类数：</span>
          <span className="font-semibold text-foreground text-base">
            {categoryCount}
          </span>
          <span className="text-xs text-muted-foreground ml-1">类</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div>
          <span className="text-muted-foreground">移库总数量：</span>
          <span className="font-semibold text-primary text-base">
            {totalQuantity}
          </span>
          <span className="text-xs text-muted-foreground ml-1">{unit}</span>
        </div>
      </div>

      {/* 右侧操作按钮 */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={submitting}
          className="h-9 px-5 text-sm"
        >
          取消
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          disabled={submitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-6 text-sm font-medium"
        >
          {submitting ? "提交审核中..." : "提交审核"}
        </Button>
      </div>
    </div>
  )
}

